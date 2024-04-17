import React, { useEffect, useState } from 'react';
import { UserContext } from '../../../context/userContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFileArrowDown, faFileArrowUp, faStreetView, faGear, faBuilding, faUser, faFileLines, faTriangleExclamation, faEye, faTrash, faSearch, faChartLine } from '@fortawesome/free-solid-svg-icons';
import './CreateAssessment.css';
import './fonts.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'
import { FaSearch } from 'react-icons/fa'
// import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useUserContext } from '../../hooks/useUserContext';
import { useLogout } from '../../hooks/useLogout';

export default function CreateAssessment() {
	const location = useLocation();
	const { logout } = useLogout()

	const user = JSON.parse(localStorage.getItem('user'));
	const { authenticatedUser, no, path, dispatch } = useUserContext()
	const navigate = useNavigate();
	const [questions, setQuestions] = useState([]);
	const [data, setData] = useState({
		empID: '',
		positionTitle: '',
		questions: '',
		answers: '',
	})

	const menuItems = [
        { name: "Employee Development", icon: faHouse, margin: 0, path: "/dashboard" },
        { name: "Assess Feedback", icon: faFileArrowDown, margin: 12, path: '/admin_feedback' },
        { name: "Create Assessment", icon: faFileArrowUp, margin: 10, path: "/admin_feedback/create_assessment" },
        { name: "Employee Data", icon: faStreetView, margin: 3, path: "/employee_data" },
        { name: "Model Tuning", icon: faChartLine, margin: 5, path: "/model_tuning" },
        { name: "Settings", icon: faGear, margin: 5, path: "/admin_settings" },
	];

	const retrieveQuestions = async () => {
		try {
			const resp = await axios.post('/retrieveAssessmentQuestions', { empID: data.empID });
			if (resp.data.error) {
				toast.error(resp.data.error);
			} else {
				console.log(resp.data.questions);

				// Shuffle the array of questions and answers
				const shuffledQuestions = resp.data.questions.sort(() => 0.5 - Math.random());

				// Slice the first 4 questions from the shuffled array
				const selectedQuestions = shuffledQuestions.slice(0, 4);

				// Prepare text and arrays for the UI and database
				const questionsText = selectedQuestions.map(q => q.question).join('\n');
				const answersText = selectedQuestions.map(q => q.answer).join('\n');
				const questionArray = selectedQuestions.map(q => q.question);
				const answerArray = selectedQuestions.map(q => q.answer);

				console.log("the answers are: ", answerArray);
				console.log("the questions are: ", questionArray);
				console.log("the position id is: ", resp.data.positionTitle);

				// Update the state with the selected questions and answers
				setQuestions(questionsText);
				setData({ ...data, positionTitle: resp.data.positionTitle, questions: questionArray, answers: answerArray });

				toast.success("Questions retrieved successfully");
			}
		} catch (error) {
			toast.error('An error occurred while retrieving questions');
			console.error(error);
		}
	}


	// const [activeMenuItem, setActiveMenuItem] = useState("");
	// const [searchTerm, setSearchTerm] = useState("");
	// const [employees, setEmployees] = useState([
	//     { id: 1, role: "Manager", age: 30, contact: "123-456-7890", hoursWorked: 40, status: "Active" }
	// ]);
	// const [newEmployeeData, setNewEmployeeData] = useState({
	//     role: "",
	//     age: "",
	//     contact: "",
	//     hoursWorked: "",
	//     status: ""
	// });
	const [showModal, setShowModal] = useState(false);

	const isActive = (path) => {
		return location.pathname === path; // Check if the current location matches the path
	};


	const handleMenuItemClick = (path, e) => {
		e.preventDefault()
		navigate(path, { state: { userInfo: user } });
	};

	// const addEmployee = () => {
	//     setShowModal(true);
	// };

	// const closeModal = () => {
	//     setShowModal(false);
	//     setNewEmployeeData({
	//         role: "",
	//         age: "",
	//         contact: "",
	//         hoursWorked: "",
	//         status: ""
	//     });
	// };

	// const handleSubmit = (e) => {
	//     e.preventDefault();
	//     console.log(newEmployeeData);
	//     const newEmployee = {
	//         id: employees.length + 1,
	//         ...newEmployeeData
	//     };
	//     setEmployees([...employees, newEmployee]);
	//     closeModal();
	// };

	// const deleteEmployee = (id) => {
	//     setEmployees(employees.filter(employee => employee.id !== id));
	// };
	const assignAssessment = async (e) => {
		e.preventDefault();
		console.log("Submitting assessment with data:", data);
		const { empID,
			positionTitle,
			questions,
			answers } = data;
		try {
			const response = await axios.post("/assignAssessment", {
				empID,
				positionTitle,
				questions,
				answers
			});
			//   console.log("assignment response")
			//   console.log(response.message);
			if (response.status !== 200) {
				toast.error(response.error);
				// setData({});
			} else {
				// console.log("assignment submitted successfully")
				console.log(response.data.message);
				console.log(response.data.feedback)
				// setData({});
				setData({
					empID: '',
					positionTitle: '',
					questions: '',
					answers: ''
				});
				setQuestions('');
				toast.success("Assignment assigned successfully");
			}
		} catch (error) {
			console.log(error.response.data.error)
			toast.error(error.response.data.error);
			// setData({});    
		}
	};

	useEffect(() => {
		document.title = 'Create Assesment'
		dispatch({ type: 'LOGIN', payload: user, no: 2, path: location.pathname })
		localStorage.setItem('path', JSON.stringify(location.pathname))
	}, [])

	return (
		<div className='overlay'>
			<div className='wrapperForm'>
				<div className='sidebar'>
					<div className="logo">
						<div>
							<div className="logo-icon-container">
								<FontAwesomeIcon icon={faBuilding} size="4x" color='rgb(34,137,255)' />
							</div>
							<span>Admin</span>
						</div>
					</div>
					<div className="menu">
						{menuItems.map(item => (
							<div key={item.name} className={isActive(item.path) ? "active" : ""}>
								<FontAwesomeIcon icon={item.icon} className={isActive(item.path) ? "icon active" : "icon"} size="2x" color='rgb(196,196,202)' style={{ marginLeft: item.margin }} />
								<a href="" onClick={(e) => handleMenuItemClick(item.path, e)}>{item.name}</a>
							</div>
						))}
					</div>
				</div>
				<div className='contentForm'>
					<div className='header'>
						<a href="" onClick={(e) => handleMenuItemClick('/aboutAdmin', e)}>About</a>
						<span>|</span>
						<FontAwesomeIcon icon={faUser} size='xl' color='rgb(196,196,202)' />
						<a href="" onClick={(e) => handleMenuItemClick('/AdminProfile', e)}>{user.name}</a>
						<button
							onClick={() => logout()}
							style={{
								padding: '8px 16px',
								backgroundColor: '#f44336',
								color: 'white',
								border: 'none',
								borderRadius: '15px',
								cursor: 'pointer'
							}}
						>
							Logout
						</button>
					</div>
					<div className="main-body">
						<div className="form-heading">
							<FontAwesomeIcon
								icon={faFileLines}
								size="2x"
								color="rgb(34, 137, 255)"
							/>
							<h1>Assign Assessments</h1>
						</div>
						<form className="feedback-form" onSubmit={assignAssessment}>
							<label htmlFor="course-id" style={{ fontSize: "25px" }}>
								Employee ID
							</label>
							<div className='input-group'>
								<input
									type="text"
									id="course-id"
									name="courseid"
									placeholder="Enter Employee ID"
									value={data.empID}
									onChange={(e) => setData({ ...data, empID: e.target.value })}
								/>
								<span>
									{<button type="button" onClick={retrieveQuestions} className="search-btn"><FaSearch /></button>}
								</span>
							</div>
							{/* <input
                    type="text"
                    id="course-id"
                    name="courseid"
                    placeholder="Enter Employee ID"
                    value={data.empID}
                    onChange={(e) => setData({ ...data, empID: e.target.value })}
                  />
                  {<button type="button" onClick={retrieveQuestions} className="search-btn"><FaSearch/></button>} */}
							<label htmlFor="feedback" style={{ fontSize: "25px" }}>
								Questions
							</label>
							<textarea
								id="feedback"
								name="feedback"
								rows={8}
								cols={70}
								placeholder="Position Questions"
								required
								value={questions} // This should be the state variable holding the questions text
								style={{ color: 'grey' }}
								readOnly // If you don't want users to edit the questions, make the textarea read-only
							// onChange={(e) => setData({ ...data, questions: e.target.value })}
							></textarea>
							{/* <div className="give-rating">
                    <h2>Rate This Course</h2>
                    <StarRatingInput
                      value={data.rating}
                      onRatingChange={(newRating) =>
                        setData({ ...data, rating: newRating })
                      }
                    />
                  </div> */}
							<button className="feedbackButton" type="submit">
								Assign Assessment
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}