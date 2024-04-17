import React, { useContext, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFileArrowDown, faFileArrowUp, faStreetView, faGear, faBuilding, faUser, faFileLines, faTriangleExclamation, faEye, faTrash, faChartLine, faSearch, faStar } from '@fortawesome/free-solid-svg-icons';
import './AssessFeedback.css';
import './fonts.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useUserContext } from '../../hooks/useUserContext';
import { useLogout } from '../../hooks/useLogout';


export default function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();

    const { logout } = useLogout()

    const user = JSON.parse(localStorage.getItem('user'));
    const { authenticatedUser, no, path, dispatch } = useUserContext()

    const menuItems = [
        { name: "Dashboard", icon: faHouse, margin: 5, path: "/dashboard" },
        { name: "Assess Feedback", icon: faFileArrowDown, margin: 12, path: "/admin_feedback" },
        { name: "Create Assessment", icon: faFileArrowUp, margin: 10, path: "/admin_feedback/create_assessment" },
        { name: "Employee Data", icon: faStreetView, margin: 3, path: "/employee_data" },
        { name: "Model Tuning", icon: faChartLine, margin: 5, path: "/model_tuning" },
        { name: "Settings", icon: faGear, margin: 5, path: "/admin_settings" },
    ];

    const [searchTerm, setSearchTerm] = useState("");
    const [employees, setEmployees] = useState([
        // { id: 1, role: "Manager", age: 30, contact: "123-456-7890", hoursWorked: 40, status: "Active" }
    ]);

    const [specificE, setSpecificE] = useState({})

    // Fetching all employees from the database
    useEffect(() => {
        let isMounted = true; // Flag to check if the component is still mounted

        // Helper function to combine and update employee data
        const updateEmployeesWithData = (employees, empData) => {
            // Combine employee and additional data
            const updatedEmployees = employees.map(employee => {
                const additionalData = empData.find(ed => `E${ed.employeeID}` === employee.employeeID);
                if (additionalData) {
                    return {
                        ...employee,
                        name: additionalData.name,
                        positionID: additionalData.positionID,
                        date_of_birth: additionalData.date_of_birth,
                        registered_status: additionalData.registered_status,
                    };
                }
                return employee;
            });

            // Update state if component is still mounted
            if (isMounted) {
                setEmployees(updatedEmployees);
            }
        };

        // Perform both Axios requests in parallel
        Promise.all([
            axios.post('/getFeedback'),
            axios.get('/dashboard-employees')
        ])
            .then(([feedbackRes, empDataRes]) => {
                if (!isMounted) return; // Prevent updating state if the component is unmounted
                const feedbackData = feedbackRes.data;
                const empData = empDataRes.data;

                // Update employees with combined data
                updateEmployeesWithData(feedbackData, empData);
            })
            .catch(err => {
                console.error(err); // Log any errors to the console
                toast.error('Failed to fetch data'); // Display a toast message on failure
            });

        // Cleanup function to set isMounted to false when the component unmounts
        return () => {
            isMounted = false;
        };
    }, []); // Empty dependency array means this effect runs only once after the initial render

    useEffect(() => {
        document.title = 'Assess Feedback - Course'
        dispatch({ type: 'LOGIN', payload: user, no: 2, path: location.pathname })
        localStorage.setItem('path', JSON.stringify(location.pathname))
    }, [])

    const [positionTitles, setPositionTitles] = useState([]);
    useEffect(() => {
        axios.get('/dashboard-position-titles')
            .then(res => {
                setPositionTitles(res.data);
                console.log(res.data);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to fetch position titles');
            });
    }, []);

    // function to convert positionID to position title
    const getPositionTitle = (positionID) => {
        const position = positionTitles.find(position => position.positionID === positionID);
        return position ? position.title : "Unknown";
    };

    // function to get age from date of birth
    const getAge = (dateOfBirth) => {
        if (!dateOfBirth) return "Unknown";
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };


    const [newEmployeeData, setNewEmployeeData] = useState({
        employeeID: "",
        name: "",
        positionID: "",
        registered_status: false,
        email: "",
    });
    const [showModal, setShowModal] = useState(false);

    const isActive = (path) => {
        return '/admin_feedback' === path; // Check if the current location matches the path
    };


    const handleMenuItemClick = (path, e) => {
        e.preventDefault()
        navigate(path, { state: { userInfo: user } });
    };


    const addEmployee = (employee) => {
        setSpecificE(employee)
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
        <div className='overlay'>
            <div className='wrapper'>
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
                <div className='contentAdminDash'>
                    <div className='header'>
                        <a href="" onClick={(e) => handleMenuItemClick('/about', e)}>About</a>
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

                    <div className='feedbackHeader'>
                        {/* <h1>Feedbacks</h1> */}
                        <div className="form-heading">
                            <FontAwesomeIcon
                                icon={faFileLines}
                                size="2x"
                                color="rgb(34, 137, 255)"
                                style={{ marginBottom: 10, marginLeft: 20 }} />
                            <h1 style={{ marginLeft: 40, marginRight: 60 }}>Feedback Forms</h1>
                        </div>
                        <div className='employeeFunctionss'>
                            <div className='func' style={{ fontSize: 25 }}>Total Feedbacks</div>
                            <div className='countAndView'>
                                <div className='funcCount'>{employees.length}</div>
                                {/* <div className='iconAndView'> 
                                        <FontAwesomeIcon icon={faEye} size='3x' color='rgb(255,157,71)' />
                                        <a href="">View</a>
                                    </div> */}
                            </div>
                        </div>
                    </div>
                    <div className='employeeSection' style={{ marginTop: 50 }}>
                        <div className='employeeData'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Employee ID</th>
                                        <th>Name</th>
                                        <th>Position ID</th>
                                        <th>Position Title</th>
                                        {/* <th>Age</th> */}
                                        {/* <th>Status</th> */}
                                        <th>View Feedback</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees
                                        .filter(employee => employee.employeeID.toString().includes(searchTerm))
                                        .map(employee => (
                                            <tr key={employee.employeeID}>
                                                <td>{employees.indexOf(employee) + 1}</td>
                                                <td>{employee.employeeID}</td>
                                                <td>{employee.name}</td>
                                                <td>{employee.positionID}</td>
                                                <td>{getPositionTitle(employee.positionID)}</td>
                                                {/* <td>{getAge(employee.date_of_birth)}</td> */}
                                                {/* <td>{employee.registered_status ? 'Registered' : 'Not registered'}</td>                  */}
                                                <td>
                                                    {/* <a href="" onClick={(e) => viewPerformance('/dashboard/performance', e, employee)}><FontAwesomeIcon icon={faEye} size='xl' /></a> */}
                                                    <button onClick={(e) => addEmployee(employee)}><FontAwesomeIcon icon={faEye} size='xl' /></button>
                                                </td>
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
                        <span className="closeModal" onClick={closeModal}>&times;</span> {/* Close button */}
                        <div className="modalHeader">
                            {/* <span className="closeModal" onClick={closeModal}>&times;</span> */}
                            <h2>Feedback</h2>
                        </div>
                        <div className="modalBody">
                            <div className="formGroup1">
                                <label htmlFor="CourseID">Course ID:</label>
                                <h3>{specificE.courseID}</h3>
                            </div>
                            <div className="formGroup1">
                                <label>Rating:</label>
                                <div>
                                    {[...Array(5)].map((star, i) => {
                                        const ratingValue = i + 1;
                                        return (
                                            <label key={i}>
                                                <input type="radio" name="rating" value={ratingValue} style={{ display: 'none' }} />
                                                <FontAwesomeIcon icon={faStar} color={ratingValue <= specificE.rating ? "#ffc107" : "#e4e5e9"} />
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="formGroup1">
                                <label htmlFor="Response">Feedback response:</label>
                                <h3>{specificE.feedback}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}