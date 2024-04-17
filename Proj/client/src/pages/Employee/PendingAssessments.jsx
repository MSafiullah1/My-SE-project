import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../context/userContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHouse,
	faFileArrowDown,
	faFileArrowUp,
	faStreetView,
	faGear,
	faBuilding,
	faUser,
	faFileLines,
	faTriangleExclamation,
	faEye,
	faTrash,
	faSearch,
	faStar,
} from "@fortawesome/free-solid-svg-icons";
// import './Dashboard.css';
import "./PendingAssessments.css";
import "./fonts.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useLogout } from "../../hooks/useLogout";
import { useUserContext } from "../../hooks/useUserContext";

export default function PendingAssessment() {
	const location = useLocation();
	const navigate = useNavigate();
	const allUserInfo = JSON.parse(localStorage.getItem('user'));
	const { logout } = useLogout()
	const { authenticatedUser, no, path, dispatch } = useUserContext()
	const user = allUserInfo.name;

	const menuItems = [
		{
			name: "Career Path",
			icon: faHouse,
			margin: 0,
			path: "/employeeDashboard",
		},
		{
			name: "Personal Development Plans",
			icon: faFileArrowDown,
			margin: 4,
			path: "/developmentPlans",
		},
		{
			name: "Feedback Tools",
			icon: faFileArrowUp,
			margin: 7,
			path: "/feedback",
		},
		{ name: "Settings", icon: faGear, margin: 0, path: "/employeeSettings" },
	];

	const [activeMenuItem, setActiveMenuItem] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [employees, setEmployees] = useState([
		// { id: 1, role: "Manager", age: 30, contact: "123-456-7890", hoursWorked: 40, status: "Active" }
	]);
	const [empdata, setEmpdata] = useState([]);

	const [specificE, setSpecificE] = useState({});

	const [complaintData, setComplaintData] = useState([]);
	const [assessmentData, setAssessmentData] = useState([]);
	const [employeeAnswers, setEmployeeAnswers] = useState([]);
	const [pendingCount, setPendingCount] = useState([]);
	// Fetching all employees from the database
	useEffect(() => {
		document.title = 'Pending Assessments'
		dispatch({ type: 'LOGIN', payload: user, no: 1, path: location.pathname })
		localStorage.setItem('path', JSON.stringify(location.pathname))
		let isMounted = true; // Flag to check if the component is still mounted

		Promise.all([axios.post("/getAssessmentData")])
			.then(([assessmentRes]) => {
				if (!isMounted) return; // Prevent updating state if the component is unmounted
				const assessmentData = assessmentRes.data;
				const employeeAssignments = assessmentData.filter(
					(assignment) => assignment.employeeID === allUserInfo.employeeID
				);
				console.log(employeeAssignments);
				console.log(employeeAssignments.length);
				if (employeeAssignments) {
					setAssessmentData(employeeAssignments);
				} else {
					console.log("null");
				}
				// Update employees with combined data
				// updateEmployeesWithData(complaintData, empData);
			})
			.catch((err) => {
				console.error(err); // Log any errors to the console
				toast.error("Failed to fetch data"); // Display a toast message on failure
			});

		// Cleanup function to set isMounted to false when the component unmounts
		return () => {
			isMounted = false;
		};
	}, []); // Empty dependency array means this effect runs only once after the initial render

	const [positionTitles, setPositionTitles] = useState([]);
	useEffect(() => {
		axios
			.get("/dashboard-position-titles")
			.then((res) => {
				setPositionTitles(res.data);
				// console.log(res.data);
			})
			.catch((err) => {
				console.error(err);
				toast.error("Failed to fetch position titles");
			});
	}, []);

	const [newEmployeeData, setNewEmployeeData] = useState({
		employeeID: "",
		name: "",
		positionID: "",
		registered_status: false,
		email: "",
	});
	const [showModal, setShowModal] = useState(false);

	const isActive = (path) => {
		return '/feedback' === path; // Check if the current location matches the path
	};

	const handleMenuItemClick = (path, e) => {
		e.preventDefault();
		navigate(path, { state: { name: user } });
	};

	const handleAnswerChange = (index, value) => {
		const newAnswers = [...employeeAnswers];
		newAnswers[index] = value;
		setEmployeeAnswers(newAnswers);
	};

	// Function to handle form submission
	const handleFormSubmit = () => {
		const correctAnswers = specificE.answers;
    console.log("correct answers: ", specificE.answers)
    console.log("employee answers: ", employeeAnswers)
		const totalQuestions = correctAnswers.length;
		let correctCount = 0;

		employeeAnswers.forEach((answer, index) => {
			if (
				answer.trim().toLowerCase() ===
				correctAnswers[index].trim().toLowerCase()
			) {
				correctCount++;
			}
		});

		const scoreString = `${correctCount}/${totalQuestions}`;

		const updatedAssessmentData = assessmentData.map((assessment) => {
			if (assessment.assignmentID === specificE.assignmentID) {
				return { ...assessment, score: scoreString, status: "Completed" };
			}
			return assessment;
		});

		setAssessmentData(updatedAssessmentData);
		// const pendingAssignments = assessmentData.filter(assessment => assessment.status !== "Completed");
		// setPendingCount(pendingAssignments.length);

		// closeModal(); // Close the modal after submitting
		// Send the updated score and status to your backend to update the database
		axios
			.post("/submitAssessmentScore", {
				assessmentID: specificE.assignmentID,
				employee_answers: employeeAnswers,
				score: scoreString,
				status: "Completed",
			})
			.then((response) => {
				toast.success("Assessment completed successfully");
				closeModal(); // Close the modal after submitting
			})
			.catch((error) => {
				console.error("Error updating assessment", error);
				toast.error("Error updating assessment");
			});
	};

	useEffect(() => {
		// ... inside your existing useEffect where you fetch assessment data ...
		const pendingAssignments = assessmentData.filter(
			(assessment) => assessment.status !== "Completed"
		);
		// Update some state or variable to hold the count of pending assessments
		setPendingCount(pendingAssignments.length);
		// ... rest of your useEffect code ...
	}, [assessmentData]);

	// const addEmployee = (assessment) => {
	//     setSpecificE(assessment)
	//     setShowModal(true);
	// };
	const addEmployee = (assessment) => {
		setSpecificE(assessment);
		setEmployeeAnswers(new Array(assessment.questions.length).fill(""));
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
		setNewEmployeeData({
			role: "",
			age: "",
			contact: "",
			status: "",
			email: "",
		});
	};

	return (
		<div className="overlay">
			<div className="wrapper">
				<div className="sidebar">
					<div className="logo">
						<div>
							<div className="logo-icon-container">
								<FontAwesomeIcon
									icon={faBuilding}
									size="4x"
									color="rgb(34,137,255)"
								/>
							</div>
							<span>Employee</span>
						</div>
					</div>
					<div className="menu">
						{menuItems.map((item) => (
							<div
								key={item.name}
								className={isActive(item.path) ? "active" : ""}
							>
								<FontAwesomeIcon
									icon={item.icon}
									className={isActive(item.path) ? "icon active" : "icon"}
									size="2x"
									color="rgb(196,196,202)"
									style={{ marginLeft: item.margin }}
								/>
								<a href="" onClick={(e) => handleMenuItemClick(item.path, e)}>
									{item.name}
								</a>
							</div>
						))}
					</div>
				</div>
				<div className="contentAdminDash">
					<div className="header">
						<FontAwesomeIcon icon={faUser} size="xl" color="rgb(196,196,202)" />
						<a href="" onClick={(e) => handleMenuItemClick("/UserProfile", e)}>
							{user}
						</a>
						<button
							onClick={() => logout()}
							style={{
								padding: "8px 16px",
								backgroundColor: "#f44336",
								color: "white",
								border: "none",
								borderRadius: "15px",
								cursor: "pointer",
							}}
						>
							Logout
						</button>
					</div>

					<div className="feedbackHeader">
						{/* <h1>Feedbacks</h1> */}
						<div className="form-heading">
							<FontAwesomeIcon
								icon={faFileLines}
								size="2x"
								color="rgb(34, 137, 255)"
							/>
							<h1>Pending Assessments</h1>
						</div>
						<div className="employeeFunctionss">
							<div className="func">Pending Assessments</div>
							<div className="countAndView">
								<div className="funcCount">{pendingCount}</div>
								{/* <div className='iconAndView'>
                                        <FontAwesomeIcon icon={faEye} size='3x' color='rgb(255,157,71)' />
                                        <a href="">View</a>
                                    </div> */}
							</div>
						</div>
					</div>
					<div className="employeeSection" style={{ marginTop: 50 }}>
						<div className="employeeData">
							<table>
								<thead>
									<tr>
										<th>Assessment ID</th>
										<th>Date</th>
										<th>Action</th>
										<th>Score</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									{assessmentData.map((assessment) => (
										<tr key={assessment.assignmentID}>
											<td>{assessment.assignmentID}</td>
											<td>{assessment.date}</td>
											<td>
												<button
													onClick={() => addEmployee(assessment)}
													disabled={assessment.status === "Completed"}
												>
													<FontAwesomeIcon icon={faEye} size="xl" />
												</button>
											</td>
											<td>{assessment.score}</td>
											<td>{assessment.status}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			{showModal && (
				<div className="modalOverlay">
					<div className="modalContent">
						<span className="closeModal" onClick={closeModal}>
							&times;
						</span>{" "}
						{/* Close button */}
						<div className="modalHeader">
							<h2>Assessment</h2>
						</div>
						<div className="modalBody">
							<form onSubmit={(e) => e.preventDefault()}>
								{specificE.questions.map((question, index) => (
									<div className="formGroup1" key={index}>
										<label htmlFor={`question-${index}`}>{question}</label>
										<input
											type="text"
											id={`question-${index}`}
											value={employeeAnswers[index]}
											onChange={(e) =>
												handleAnswerChange(index, e.target.value)
											}
											required
										/>
									</div>
								))}
								<button type="submit" onClick={handleFormSubmit}>
									Submit
								</button>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
