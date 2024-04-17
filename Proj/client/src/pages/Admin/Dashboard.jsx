import React, { useContext, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFileArrowDown, faFileArrowUp, faStreetView, faGear, faBuilding, faChartLine, faUser, faFileLines, faTriangleExclamation, faEye, faTrash, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
// import filter icon

import './Dashboard.css';
import './fonts.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useLogout } from '../../hooks/useLogout';
import { useUserContext } from '../../hooks/useUserContext';


export default function Dashboard() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const { logout } = useLogout()
    const { authenticatedUser, no, path, dispatch} = useUserContext()

    const user = JSON.parse(localStorage.getItem('user'));

    const isAuthenticated = 1;

    useEffect(() => {
        dispatch({type: 'LOGIN', payload: user, no: 2, path: '/dashboard'})
        localStorage.setItem('path' ,JSON.stringify('/dashboard'))
    }, [])
    
    const menuItems = [
        { name: "Dashboard", icon: faHouse, margin: 0, path: "/dashboard" },
        { name: "Assess Feedback", icon: faFileArrowDown, margin: 12, path: "/admin_feedback" },
        { name: "Create Assessment", icon: faFileArrowUp, margin: 10, path: "/admin_feedback/create_assessment" },
        { name: "Employee Data", icon: faStreetView, margin: 3, path: "/employee_data" },
        { name: "Model Tuning", icon: faChartLine, margin: 5, path: "/model_tuning" },
        { name: "Settings", icon: faGear, margin: 5, path: "/admin_settings" },
    ];

    const [activeMenuItem, setActiveMenuItem] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [employees, setEmployees] = useState([]);
    const [employeeScores, setEmployeeScores] = useState({});
    const [highPotentialEmployees, setHighPotentialEmployees] = useState([]);
    const [employeesAtRisk, setEmployeesAtRisk] = useState([]);
    const [threshold, setThreshold] = useState(0.75);
    const [employeesToDisplay, setEmployeesToDisplay] = useState([]);
    const [view, setView] = useState("all"); // can be "all", "high", or "atRisk" [high potential employees, employees at risk, all employees

    // Fetching all employees from the database
    useEffect(() => {
        if (isAuthenticated) {
            axios.get('/dashboard-employees')
                .then(res => {
                    console.log(res.data);
                    setEmployees(res.data);
                    setEmployeesToDisplay(res.data);
                })
                .catch(err => {
                    console.log(err);
                    toast.error('Failed to fetch employees');
                });
        }
    }, []);

    // Fetching all position titles from the database
    const [positionTitles, setPositionTitles] = useState([]);
    useEffect(() => {
        if (isAuthenticated) {
            axios.get('/dashboard-position-titles')
                .then(res => {
                    setPositionTitles(res.data);
                    console.log(res.data);
                })
                .catch(err => {
                    console.error(err);
                    toast.error('Failed to fetch position titles');
                });
        }
    }, []);


    // Fetch the weights to be used for calculating the performance score
    const [weights, setWeights] = useState({});
    useEffect(() => {
        if (isAuthenticated) {
            axios.get('/weights')
                .then(res => {
                    // contains two sets of weights: ML and Admin. Set the weights to be equal to the product of the two
                    let ML_weights = res.data.find(weight => weight.weightsID === 1);
                    let Admin_weights = res.data.find(weight => weight.weightsID === 2);
                    let finalWeights = {};

                    for (let key in ML_weights) {
                        finalWeights[key] = ML_weights[key] * Admin_weights[key];
                    }
                    setWeights(finalWeights);
                    console.log('Weights:', finalWeights);

                    // Calculate the performance score for each employee
                    let scores = {};
                    employees.forEach(employee => {
                        calculatePerformanceScore(employee) > 1 ? scores[employee.employeeID] = 1 : scores[employee.employeeID] = calculatePerformanceScore(employee);
                    });
                    setEmployeeScores(scores);
                    // console.log('Employee scores:', scores);

                    // Find high potential employees
                    let highPotential = [];
                    let atRisk = [];
                    for (let key in scores) {
                        if (scores[key] >= threshold) {
                            highPotential.push(key);
                        } else {
                            atRisk.push(key);
                        }
                    }
                    setHighPotentialEmployees(highPotential);
                    setEmployeesAtRisk(atRisk);
                    // console.log('High potential employees:', highPotential);
                    // console.log('Employees at risk:', atRisk);
                })
                .catch(err => {
                    console.error(err);
                    toast.error('Failed to fetch weights');
                });
        }
    }, [employees, threshold]);

    // function to calculate the performance score of an employee
    const calculatePerformanceScore = (employee) => {
        let score = 0;
        for (let key in employee) {
            if (key === 'task_completion_rate' || key === 'attendance_rate' || key === 'punctuality' || key === 'efficiency' || key === 'professionalism' || key === 'collaboration' || key === 'leadership') {
                score += employee[key] * weights[key];
            }
        }
        return score;
    };

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
    const [showThresholdModal, setShowThresholdModal] = useState(false);

    const isActive = (path) => {
        return location.pathname === path; // Check if the current location matches the path
    };


    const handleMenuItemClick = (path, e) => {
        e.preventDefault()
        navigate(path, { state: { userInfo: user } });
    };

    const viewPerformance = (path, e, employee) => {
        console.log("hi", employee)
        e.preventDefault()
        navigate(path, { state: { userInfo: user, info: employee } });
    }

    const addEmployee = () => {
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

    const closeThresholdModal = () => {
        setShowThresholdModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // set the email to the employeeID + @lums.edu.pk
            newEmployeeData.email = newEmployeeData.employeeID + '@lums.edu.pk';
            // setNewEmployeeData({ ...newEmployeeData, email: newEmployeeData.employeeID + '@lums.edu.pk' });

            console.log(newEmployeeData);
            const response = await axios.post('/addEmployeeFromAdminDashboard', newEmployeeData);
            console.log('Employee added:', response.data);
            // setEmployees([...employees, response.data]);

            // Fetch all employees again to update the list
            axios.get('/dashboard-employees')
                .then(res => {
                    console.log(res.data);
                    setEmployees(res.data);
                    setEmployeesToDisplay(res.data);
                })
                .catch(err => {
                    console.log(err);
                    toast.error('Failed to fetch employees');
                });



            closeModal();
        } catch (error) {
            console.error('Failed to add employee:', error);
            // Handle error
        }
    };

    // deleteEmployee(employee.id)}
    const deleteEmployee = async (id) => {
        try {
            console.log('Deleting employee:', id);
            const response = await axios.post(`/deleteEmployee/${id}`);
            console.log('Employee deleted:', response.data);
            // setEmployees(employees.filter(employee => employee.id !== id));

            // Fetch all employees again to update the list
            axios.get('/dashboard-employees')
                .then(res => {
                    console.log(res.data);
                    setEmployees(res.data);
                    setEmployeesToDisplay(res.data);

                    toast.success('Employee deleted successfully');
                })
                .catch(err => {
                    console.log(err);
                    toast.error('Failed to fetch employees');
                });

        } catch (error) {
            console.error('Failed to delete employee:', error);
            // Handle error
        }
    }

    // Function to filter out employees based on performance score
    const filterEmployees = (threshold, highPotential) => {
        setView(highPotential);
        if (highPotential === "high") {
            setEmployeesToDisplay(employees.filter(employee => employeeScores[employee.employeeID] >= threshold));
        } else if (highPotential === "atRisk") {
            setEmployeesToDisplay(employees.filter(employee => employeeScores[employee.employeeID] < threshold));
        } else {
            setEmployeesToDisplay(employees);
        }
    };

    // Popup to allow admin to change the threshold for high potential employees
    const changeThreshold = () => {
        setShowThresholdModal(true);
    };

    // Function to filter employees based on position for which successors are to be viewed
    const [filterPositionID, setFilterPositionID] = useState("");
    const filterSuccessors = (positionID) => {
        // For given positionID, find the hierarchy level
        // Find all employees at level + 1 of the hierarchy
        // set the employeesToDisplay to these employees

        // Find the hierarchy level of the given positionID
        const position = positionTitles.find(position => position.positionID === positionID);
        const level = position.hierarchy_level;

        // Find all employees at level + 1 of the hierarchy
        const successors = employees.filter(employee => {
            const position = positionTitles.find(position => position.positionID === employee.positionID);
            return position.hierarchy_level === level + 1;
        });

        setEmployeesToDisplay(successors);
    }


    return isAuthenticated && (
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
                        <a href="" onClick={(e) => handleMenuItemClick('/aboutAdmin', e)}>About</a>
                        <span>|</span>
                        <FontAwesomeIcon icon={faUser} size='xl' color='rgb(196,196,202)' />
                        <a href="" onClick={(e) => handleMenuItemClick('/AdminProfile', e)}>{user && user.name}</a>
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
                    <div className='employeeFunctions'>
                        <div className='employeeFunction'>
                            <div className='func'>High Potential Employees</div>
                            <div className='countAndView'>
                                <div className='funcCount'>{highPotentialEmployees.length}</div>
                                <div className='iconAndView'>
                                    <FontAwesomeIcon icon={faFileLines} size='3x' color='rgb(255,157,71)' />
                                    {/*on click of view, filter out employees with performance score >= 0.75*/}
                                    <label onClick={() => filterEmployees(threshold, "high")} style={{ color: view === "high" ? "rgb(255,157,71)" : "" }}>
                                        View
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className='employeeFunction'>
                            <div className='func'>Total Employees</div>
                            <div className='countAndView'>
                                <div className='funcCount'>{employees.length}</div>
                                <div className='iconAndView'>
                                    <FontAwesomeIcon icon={faEye} size='3x' color='rgb(255,157,71)' />
                                    {/* <a href="">View</a> */}
                                    <label onClick={() => filterEmployees(threshold, "all")} style={{ color: view === "all" ? "rgb(255,157,71)" : "" }}>
                                        View
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className='employeeFunction'>
                            <div className='func'>Employees at Risk</div>
                            <div className='countAndView'>
                                <div className='funcCount'>{employeesAtRisk.length}</div>
                                <div className='iconAndView'>
                                    <FontAwesomeIcon icon={faTriangleExclamation} size='3x' color='rgb(255,157,71)' />
                                    {/* <a href="">View</a> */}
                                    <label onClick={() => filterEmployees(threshold, "atRisk")} style={{ color: view === "atRisk" ? "rgb(255,157,71)" : "" }}>
                                        View
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='employeeSection'>
                        <div className='searchAndAdd'>
                            <div>
                                <input type="text" placeholder="Search by Employee ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                <FontAwesomeIcon icon={faSearch} />
                            </div>
                            <button onClick={changeThreshold}>
                                <FontAwesomeIcon icon={faFilter} size = 'lg'/>   Filter
                            </button>
                            <button onClick={addEmployee}>+ Add New Employee</button>
                        </div>
                        <div className='employeeData'>
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Employee ID</th>
                                        <th>Name</th>
                                        <th>Position ID</th>
                                        <th>Position Title</th>
                                        <th>Age</th>
                                        <th>Status</th>
                                        <th>Performance Score</th>
                                        <th>View Performance</th>
                                        <th>Delete Employee</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employeesToDisplay
                                        .filter(employee => employee.employeeID.toString().includes(searchTerm))
                                        .map(employee => (
                                            <tr key={employee.employeeID}>
                                                <td>{employeesToDisplay.indexOf(employee) + 1}</td>
                                                <td>{employee.employeeID}</td>
                                                <td>{employee.name}</td>
                                                <td>{employee.positionID}</td>
                                                <td>{getPositionTitle(employee.positionID)}</td>
                                                <td>{getAge(employee.date_of_birth)}</td>
                                                {/* <td>{employee.contact}</td> */}
                                                {/* <td>{employee.hoursWorked}</td> */}
                                                <td>{employee.registered_status ? 'Registered' : 'Not registered'}</td>
                                                <td>{employeeScores[employee.employeeID] ? employeeScores[employee.employeeID].toFixed(2) : "Unknown"}</td>
                                                <td>
                                                    <a href="" onClick={(e) => viewPerformance('/dashboard/performance', e, employee)}><FontAwesomeIcon icon={faEye} size='xl' /></a>
                                                </td>
                                                <td>
                                                    <button onClick={() => deleteEmployee(employee.employeeID)}>
                                                        <FontAwesomeIcon icon={faTrash} size='xl' />
                                                    </button>
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
                        <span className="closeModal" onClick={closeModal}>&times;</span>
                        <h2>Add Employee Form</h2>
                        <form className="addEmployeeForm" onSubmit={handleSubmit}>
                            <div className="formGroup">
                                <label htmlFor="employeeID">Employee ID:</label>
                                <input type="text" required id="employeeID" value={newEmployeeData.employeeID} onChange={(e) => setNewEmployeeData({ ...newEmployeeData, employeeID: e.target.value })} />
                            </div>
                            <div className="formGroup">
                                <label htmlFor="name">Name:</label>
                                <input type="text" required id="name" value={newEmployeeData.name} onChange={(e) => setNewEmployeeData({ ...newEmployeeData, name: e.target.value })} />
                            </div>
                            <div className="formGroup">
                                <label htmlFor="positionID">Position ID:</label>
                                <input type="text" required id="positionID" value={newEmployeeData.positionID} onChange={(e) => setNewEmployeeData({ ...newEmployeeData, positionID: e.target.value })} />
                            </div>
                            <div className="formGroup">
                                <label htmlFor="registered_status">Registered Status:</label>
                                <select id="registered_status" value={newEmployeeData.registered_status} onChange={(e) => setNewEmployeeData({ ...newEmployeeData, registered_status: e.target.value })}>
                                    <option value="Unregistered">Unregistered</option>
                                </select>
                            </div>
                            <button type="submit" id='addEmployeeButton'>Add Employee</button>
                        </form>
                    </div>
                </div>
            )}

            {showThresholdModal && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <span className="closeModal" onClick={closeThresholdModal}>&times;</span>
                        <h2>Change Threshold</h2>
                        <label htmlFor="threshold" style={{ marginTop: '100px' }}>Enter the new threshold for high potential employees (0-1):</label>
                        <input type="number" min="0" max="1" step="0.01" id="threshold" value={threshold} onChange={(e) => setThreshold(e.target.value)} />

                        {/* allow user to change position for which they want successors */}
                        <label htmlFor="positionID" style={{ marginTop: '50px' }}>Select the position for which you want to view successors:</label>
                        <select id="positionID" value={filterPositionID} onChange={(e) => { setFilterPositionID(e.target.value); filterSuccessors(e.target.value); }}>
                            <option value="">All Positions</option>
                            {positionTitles.map(position => (
                                // do not include interns in the list of positions
                                position.title !== "Intern" && <option key={position.positionID} value={position.positionID}>{position.title}</option>
                            ))}
                        </select>

                        <button id="changeThresholdButton" onClick={() => { filterEmployees(threshold, view); closeThresholdModal(); }}>Done</button>

                    </div>
                </div>
            )}
        </div>
    ) || !isAuthenticated && (
        <h1>You're not allowed to access</h1>
    )
}