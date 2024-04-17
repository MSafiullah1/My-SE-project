import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFileArrowDown, faFileArrowUp, faStreetView, faGear, faBuilding, faUser, faFileLines, faTriangleExclamation, faEye, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import './AvailablePositions.css';
import '../fonts.css';
import axios from 'axios'
import toast from 'react-hot-toast';
import { useLogout } from '../../../hooks/useLogout';
import { useUserContext } from '../../../hooks/useUserContext';


export default function AvailablePositions() {
    const location = useLocation();
    // const allUserInfo = location.state.userInfo
    const allUserInfo = JSON.parse(localStorage.getItem('user'))
    const { authenticatedUser, no, dispatch } = useUserContext();
    const { logout } = useLogout()

    const navigate = useNavigate();

    const menuItems = [
        { name: "Career Path", icon: faHouse, margin: 0, path: "/employeeDashboard" },
        { name: "Personal Development Plans", icon: faFileArrowDown, margin: 4, path: "/developmentPlans" },
        { name: "Feedback Tools", icon: faFileArrowUp, margin: 7, path: "/feedback" },
        { name: "Settings", icon: faGear, margin: 0, path: "/employeeSettings" }
    ];

    const [activeMenuItem, setActiveMenuItem] = useState("");

    const [positions, setPositions] = useState([])
    const [employees, setEmployees] = useState([])
    const [availablePositions, setAvailablePositions] = useState([])
    const [title, setTitle] = useState("")
    const [noPosition,setNoPosition] = useState(false)
    const [empFetched,setEmpFetched] = useState(0)
    
    useEffect(() => {
        dispatch({type: 'LOGIN', payload: allUserInfo, no: 1, path: location.pathname})
        localStorage.setItem('path' ,JSON.stringify(location.pathname))
    }, [])


    const getCurrentEmployee = (employeeName) => {
        let employee = employees.find((emp) => emp.name == employeeName)
        return employee
    }

    const getPositionHierarchy = (positionID) => {
        const position = positions.find(position => position.positionID === positionID);
        return position ? position.hierarchy_level : "Unknown";
    };

    const getPositionTitle = (positionID) => {
        const position = positions.find(position => position.positionID === positionID);
        return position ? position.title : "Unknown";
    };



    // Fetching all employees from the database
    useEffect(() => {

        axios.get('/dashboard-employees')
            .then(res => {
                setEmployees(res.data);
            })
            .catch(err => {
                console.log(err);
                toast.error('Failed to fetch employees');
            })
        axios.get('/dashboard-position-titles')
            .then(res => {

                if(employees.length>0 && empFetched < 5)
                {
                    setEmpFetched(empFetched+1)
                    setPositions(res.data);
                    let currEmployee = allUserInfo
    
                    let currHierarchy = getPositionHierarchy(currEmployee.positionID)
                    let new_positions = positions.filter(position => position.hierarchy_level === (currHierarchy -1))
                    // new_positions = new_positions_one.filter(position => (position.held_by).length < position.max_held_by)

                    // console.log(new_positions_one[0])
                    // console.log("Check: ", new_positions_one[0].held_by,new_positions_one[0].max_held_by)
                    if(new_positions.length==0)
                    {
                        setNoPosition(true)
                        setAvailablePositions([])
                    }
                    else
                    {
                        setNoPosition(false)
                        setAvailablePositions(new_positions)
                        setTitle(getPositionTitle(currEmployee.positionID))
    
                    }
                    setTitle(getPositionTitle(currEmployee.positionID))
                }

                
            })
            .catch(err => {
                console.log(err);
                toast.error('Failed to fetch employees data');
            });

    }, [employees]);

    const handleMenuItemClick = (path, e) => {
        e.preventDefault();
        navigate(path, { state: { userInfo:allUserInfo } });
    };

    const isActive = (path) => {
        return path === '/employeeDashboard'; // Check if the current location matches the path
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
                            <span>Employee</span>
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
                <div className='contentDashClient'>
                    <div className='header'>
                        <a href="" onClick={(e) => handleMenuItemClick('/about', e)}>About</a>
                        <span>|</span>
                        <FontAwesomeIcon icon={faUser} size='xl' color='rgb(196,196,202)' />
                        <a href="" onClick={(e) => handleMenuItemClick('/UserProfile', e)}>{allUserInfo.name}</a>
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
                    <div className='positionsDashboard'>

                        <div className="form-heading">
                            <FontAwesomeIcon
                                icon={faUser}
                                size="2x"
                                color="rgb(34, 137, 255)"
                            />
                            <h1>Available Positions</h1>
                        </div>

                        {title && (
                            <div className='positionStatus'>
                                <div className='status'>
                                    <div id='posHolder'>Current Position: </div>
                                    <div id='posTitle'>{getPositionTitle(allUserInfo.positionID)}</div>
                                </div>
                            </div>)}


                        <div className='positionCards'>
                            {!noPosition && (availablePositions.map((position) => (
                                <div className='positionItem' >
                                    <div className='positionContent'>
                                        <div className="personImage"> </div>
                                        <div className="personName">{position.title}</div>
                                    </div>
                                </div>

                            )))}
                             {noPosition && (
                                <div className='positionItem' >
                                    <div className='positionContent'>
                                        <div className="personImage"> </div>
                                        <div className="personName">No Positions Are Currently Available</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}