import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../../context/userContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFileArrowDown, faFileArrowUp, faStreetView, faGear, faBuilding, faUser, faFileLines, faTriangleExclamation, faEye, faTrash, faSearch, faStar, faChartLine } from '@fortawesome/free-solid-svg-icons';
// import './Dashboard.css';
import './AssessComplaint.css';
import './fonts.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useLogout } from '../../hooks/useLogout';
import { useUserContext } from '../../hooks/useUserContext';


export default function AssessComplaint() {
    const location = useLocation();
    const { logout } = useLogout()

    const user = JSON.parse(localStorage.getItem('user'));
    const { authenticatedUser, no, path, dispatch } = useUserContext()
    const navigate = useNavigate();


    const menuItems = [
        { name: "Dashboard", icon: faHouse, margin: 5, path: "/dashboard" },
        { name: "Assess Feedback", icon: faFileArrowDown, margin: 12, path: '/admin_feedback' },
        { name: "Create Assessment", icon: faFileArrowUp, margin: 10, path: "/admin_feedback/create_assessment" },
        { name: "Employee Data", icon: faStreetView, margin: 3, path: "/employee_data" },
        { name: "Model Tuning", icon: faChartLine, margin: 5, path: "/model_tuning" },
        { name: "Settings", icon: faGear, margin: 5, path: "/admin_settings" },
    ];

    const [activeMenuItem, setActiveMenuItem] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [employees, setEmployees] = useState([
        // { id: 1, role: "Manager", age: 30, contact: "123-456-7890", hoursWorked: 40, status: "Active" }
    ]);
    const [empdata, setEmpdata] = useState([]);

    const [specificE, setSpecificE] = useState({})

    const [complaintData, setComplaintData] = useState([]);


    // Fetching all employees from the database
    useEffect(() => {
        dispatch({ type: 'LOGIN', payload: user, no: 2, path: location.pathname })
        localStorage.setItem('path', JSON.stringify(location.pathname))
        document.title = 'Assess Feedback - Complaint'
        let isMounted = true; // Flag to check if the component is still mounted

        // // Helper function to combine and update employee data
        // const updateEmployeesWithData = (employees, empData) => {
        //     // Combine employee and additional data
        //     // {complaintID, employeeID1, courseID, employeeID2, feedback, date} = employees.body;
        //     console.log(employees)
        //     const updatedEmployees = employees.map(employee => {
        //         console.log("employee id: ", employee.employeeID)
        //         const additionalData = empData.find(ed => `E${ed.employeeID}` === employee.employeeID);
        //         // console.log(additionalData.name);
        //         if (additionalData) {
        //             return {
        //                 ...employee,
        //                 name: additionalData.name,
        //                 positionID: additionalData.positionID,
        //                 date_of_birth: additionalData.date_of_birth,
        //                 registered_status: additionalData.registered_status,
        //             };
        //         }
        //         return employee;
        //     });

        //     // Update state if component is still mounted
        //     if (isMounted) {
        //         setEmployees(updatedEmployees);
        //     }
        // };

        // Perform both Axios requests in parallel
        Promise.all([
            axios.post('/getComplaint'),
            axios.get('/dashboard-employees')
        ])
            .then(([complaintRes, empDataRes]) => {
                if (!isMounted) return; // Prevent updating state if the component is unmounted
                const complaintData = complaintRes.data;
                const empData = empDataRes.data;
                if (complaintData) {
                    console.log(complaintData)
                    setComplaintData(complaintData);
                }
                else {
                    console.log("null")
                }

                // Update employees with combined data
                // updateEmployeesWithData(complaintData, empData);
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


    const addEmployee = (complaint) => {
        setSpecificE(complaint)
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

    const deleteComplaint = async (id) => {
        try {
            // console.log('Deleting complaint:', id);
            const response = await axios.post(`/deleteComplaint/${id}`);
            console.log('complaint deleted:', response.data);

            axios.post('/getComplaint')
                .then(res => {
                    // console.log(res.data);
                    setComplaintData(res.data);

                    toast.success('complaint deleted successfully');
                })
                .catch(err => {
                    console.log(err);
                    toast.error('Failed to fetch complaints');
                });

        } catch (error) {
            console.error('Failed to delete complaint:', error);
            // Handle error
        }
    }

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
                            <h1 style={{ marginLeft: 40, marginRight: 60 }}>Complaints</h1>
                        </div>
                        <div className='employeeFunctionss'>
                            <div className='func'>Total Complaints</div>
                            <div className='countAndView'>
                                <div className='funcCount'>{complaintData.length}</div>
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
                                        <th>Complaint ID</th>
                                        <th>Complaint by Employee</th>
                                        <th>Against Employee ID</th>
                                        <th>Against Course ID</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                        <th>Resolve Complaint</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {complaintData.map(complaint => (
                                        <tr key={complaint.complaintID}>
                                             <td>{complaintData.indexOf(complaint) + 1}</td>
                                            <td>{complaint.complaintID}</td>
                                            <td>{complaint.employeeID2}</td>
                                            <td>{complaint.employeeID1}</td>
                                            <td>{complaint.courseID}</td>
                                            <td>{new Date(complaint.date).toLocaleDateString()}</td>
                                            <td>
                                                <button onClick={() => addEmployee(complaint)}>
                                                    <FontAwesomeIcon icon={faEye} size='xl' />
                                                </button>
                                            </td>
                                            <td>
                                                <button onClick={() => deleteComplaint(complaint.complaintID)}>
                                                    <FontAwesomeIcon icon={faTrash} size='xl' />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {showModal &&
                (
                    <div className="modalOverlay">
                        <div className="modalContent">
                            <span className="closeModal" onClick={closeModal}>&times;</span> {/* Close button */}
                            <div className="modalHeader">
                                {/* <span className="closeModal" onClick={closeModal}>&times;</span> */}
                                <h2>Complaint</h2>
                            </div>
                            <div className="modalBody">
                                <div className="formGroup1">
                                    <label htmlFor="CourseID">Against Employee/Course ID:</label>
                                    <h3>{specificE.employeeID1 == "-" ? specificE.courseID : specificE.employeeID1}</h3>
                                </div>
                                <div className="formGroup1">
                                    <label htmlFor="Response">What the complaint was?</label>
                                    <h3>{specificE.feedback}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}