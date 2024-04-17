import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFileArrowDown, faFileArrowUp, faStreetView, faGear, faBuilding, faUser, faFileLines, faTriangleExclamation, faEye, faTrash, faSearch, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import './UserProfile.css';
import defaultImg from './img/profile-default.svg'
import './fonts.css';
import { useUserContext } from '../hooks/useUserContext';
import { useLogout } from '../hooks/useLogout';

export default function UserProfile() {
    const location = useLocation();
    const navigate = useNavigate();

    const { logout } = useLogout()
    const { authenticatedUser, dispatch } = useUserContext()
    // const user = authenticatedUser
    const user = JSON.parse(localStorage.getItem('user'));

    const menuItems = [
        { name: "Career Path", icon: faHouse, margin: 0, path: "/employeeDashboard" },
        { name: "Personal Development Plans", icon: faFileArrowDown, margin: 4, path: "/developmentPlans" },
        { name: "Feedback Tools", icon: faFileArrowUp, margin: 7, path: "/feedback" },
        { name: "Settings", icon: faGear, margin: 0, path: "/employeeSettings" }
    ];

    const [activeMenuItem, setActiveMenuItem] = useState("");
    const [positions, setPositions] = useState([])

    const handleMenuItemClick = (path, e) => {
        e.preventDefault()
        navigate(path, { state: { userInfo: user } });
    };

    const getPositionTitle = (positionID) => {
        const position = positions.find(position => position.positionID === positionID);
        return position ? position.title : "Unknown";
    };

    const getPositionData = async () => {
        try {
            const resp = await axios.get('/getPositionsData')
            setPositions(resp.data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        dispatch({type: 'LOGIN', payload: user, no: 1, path: location.pathname})
        localStorage.setItem('path' ,JSON.stringify(location.pathname))
        getPositionData()
    },[])

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
                            <div key={item.name} className={activeMenuItem === item.name ? "active" : ""}>
                                <FontAwesomeIcon icon={item.icon} className={activeMenuItem === item.name ? "icon active" : "icon"} size="2x" color='rgb(196,196,202)' style={{ marginLeft: item.margin }} />
                                <a href="" onClick={(e) => handleMenuItemClick(item.path, e)}>{item.name}</a>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='content'>
                    <div className='header'>
                        <a href="" onClick={(e) => handleMenuItemClick('/about', e)}>About</a>
                        <span>|</span>
                        <FontAwesomeIcon icon={faUser} size='xl' color='rgb(196,196,202)' />
                        <a href="" onClick={(e) => handleMenuItemClick('/UserProfile', e)}>{user && user.name}</a>
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
                    <div className="profile-header">
                <label htmlFor='profile-image' className='profile-image-label'>
                    <img src={user && user.profile_picture || defaultImg} alt="Profile" className='profile-image-pic'/>
                </label>
            </div>
                    <div class="profile-settings">
                        <h1>{user && user.name}</h1>
                        <form>
                            <label for="empID">Employee ID</label>
                            <input 
                                type="text"
                                value={user.employeeID}
                                disabled={true}
                            />
                            
                            <label for="position">Position Title</label>
                            <input 
                                type="text"
                                value={getPositionTitle(user.positionID)}
                                disabled={true}
                            />
                            
                            <label for="email">Email</label>
                            <input 
                                type="email"
                                value={user.email}
                                disabled={true}
                            />

                            <label for="contact">Contact No.</label>
                            <input 
                                type="text"
                                value={user.contactNumber}
                                disabled={true}
                            />

                            <label for="gender">Gender</label>
                            <input 
                                type="text"
                                value={user.gender}
                                disabled={true}
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}