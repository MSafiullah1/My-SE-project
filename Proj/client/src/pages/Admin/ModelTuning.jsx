import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFileArrowDown, faFileArrowUp, faStreetView, faGear, faChartLine, faBuilding, faUser, faFileLines, faTriangleExclamation, faEye, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import './ModelTuning.css';
import './fonts.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLogout } from '../../hooks/useLogout';
import { useUserContext } from '../../hooks/useUserContext';


export default function ModelTuning() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useLogout()
    
    const user = JSON.parse(localStorage.getItem('user'));

    const { authenticatedUser, no, path, dispatch} = useUserContext()

    // 7 weights for 7 KPIs: 
    const featureNames = ['task_completion_rate', 'attendance_rate', 'punctuality', 'efficiency', 'professionalism', 'collaboration', 'leadership'];
    // two sets of weights: one set given by ML, and one set given by the admin. Fetch them using a GET request.
    const [weights, setWeights] = useState({
        ML: {},
        admin: {}
    });

    const handleSliderChange = (feature, value) => {
        setWeights(prevState => ({
            ...prevState,
            admin: {
                ...prevState.admin,
                [feature]: value
            }
        }));
    };

    useEffect(() => {
        dispatch({type: 'LOGIN', payload: user, no: 2, path: location.pathname})
        localStorage.setItem('path' ,JSON.stringify(location.pathname))
        document.title = 'Model Tuning'
        axios.get('/weights').then(res => {
            console.log("Weights fetched: ", res.data)
            const ML_weights = res.data.find(item => item.weightsID === 1);
            const admin_weights = res.data.find(item => item.weightsID === 2);

            // drop the weightsID field and _id field
            delete ML_weights.weightsID;
            delete ML_weights._id;
            delete admin_weights.weightsID;
            delete admin_weights._id;

            setWeights({
                ML: ML_weights,
                admin: admin_weights
            });
        }).catch(err => {
            console.log(err);
            toast.error('Failed to fetch weights');
        });
    }, []);




    const menuItems = [
        { name: "Dashboard", icon: faHouse, margin: 5, path: "/dashboard" },
        { name: "Assess Feedback", icon: faFileArrowDown, margin: 12, path: "/assess_feedback" },
        { name: "Create Assessment", icon: faFileArrowUp, margin: 10, path: "/create_assessment" },
        { name: "Employee Data", icon: faStreetView, margin: 3, path: "/employee_data" },
        { name: "Model Tuning", icon: faChartLine, margin: 5, path: "/model_tuning" },
        { name: "Settings", icon: faGear, margin: 5, path: "/admin_settings" },
    ];

    const [activeMenuItem, setActiveMenuItem] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [employees, setEmployees] = useState([
        { id: 1, role: "Manager", age: 30, contact: "123-456-7890", hoursWorked: 40, status: "Active" }
    ]);
    const [newEmployeeData, setNewEmployeeData] = useState({
        role: "",
        age: "",
        contact: "",
        hoursWorked: "",
        status: ""
    });

    const isActive = (path) => {
        return location.pathname === path; // Check if the current location matches the path
    };


    const handleMenuItemClick = (path, e) => {
        e.preventDefault()
        navigate(path, { state: { userInfo: user }}); 
    };

    const handleSaveChanges = () => {
        // Assuming the endpoint for updating weights is '/updateWeights'
        axios.post('/updateWeights', weights.admin)
            .then(res => {
                toast.success('Weights saved successfully');
            })
            .catch(err => {
                console.log(err);
                toast.error('Failed to save weights');
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
                <div className='contentSettings'>
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

                    <div className='weights'>
                        <h1>Weights</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th>ML Weights</th>
                                    <th>Admin Weights</th>
                                    <th>Product</th>
                                </tr>
                            </thead>
                            <tbody>
                                {featureNames.map(feature => (
                                    <tr key={feature}>
                                        <td>{feature}</td>
                                        <td>{weights.ML[feature]}</td>
                                        <td>{weights.admin[feature]}</td>
                                        <td>{(weights.ML[feature] * weights.admin[feature]).toFixed(3)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className='sliders'>
                            {featureNames.map(feature => (
                                <div key={feature} className='slider-container'>
                                    <label htmlFor={feature}>{feature}</label>
                                    <input
                                        type='range'
                                        id={feature}
                                        name={feature}
                                        min='0'
                                        max='1'
                                        step='0.001'
                                        value={weights.admin[feature] || 0}
                                        onChange={(e) => handleSliderChange(feature, e.target.value)}
                                    />
                                </div>
                            ))}
                            <button
                                onClick={handleSaveChanges}
                            >
                                Save Changes
                            </button>
                        </div>

                    </div>

                </div>
            </div>
            {0 && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <span className="closeModal" onClick={closeModal}>&times;</span>
                        <h2>Add New Employee</h2>
                        <form className="addEmployeeForm" onSubmit={handleSubmit}>
                            <div className="formGroup">
                                <label htmlFor="role">Role Qualification:</label>
                                <input type="text" id="role" value={newEmployeeData.role} onChange={(e) => setNewEmployeeData({ ...newEmployeeData, role: e.target.value })} />
                            </div>
                            <div className="formGroup">
                                <label htmlFor="age">Age:</label>
                                <input type="number" id="age" value={newEmployeeData.age} onChange={(e) => setNewEmployeeData({ ...newEmployeeData, age: e.target.value })} />
                            </div>
                            <div className="formGroup">
                                <label htmlFor="contact">Contact:</label>
                                <input type="text" id="contact" value={newEmployeeData.contact} onChange={(e) => setNewEmployeeData({ ...newEmployeeData, contact: e.target.value })} />
                            </div>
                            <div className="formGroup">
                                <label htmlFor="hoursWorked">Hours Worked:</label>
                                <input type="number" id="hoursWorked" value={newEmployeeData.hoursWorked} onChange={(e) => setNewEmployeeData({ ...newEmployeeData, hoursWorked: e.target.value })} />
                            </div>
                            <div className="formGroup">
                                <label htmlFor="status">Status:</label>
                                <select id="status" value={newEmployeeData.status} onChange={(e) => setNewEmployeeData({ ...newEmployeeData, status: e.target.value })}>
                                    <option value="">Select Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <button type="submit">Add Employee</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}