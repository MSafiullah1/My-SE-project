import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFileArrowDown, faFileArrowUp, faStreetView, faGear, faBuilding, faUser, faFileLines, faTriangleExclamation, faEye, faTrash, faSearch, faBrain, faNetworkWired, faChartLine, faChartBar } from '@fortawesome/free-solid-svg-icons';
import './AdminProfile.css';
import './fonts.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import defaultImg from '../img/profile-default.svg'
import { useLogout } from '../../hooks/useLogout';
import { useUserContext } from '../../hooks/useUserContext';


export default function AdminProfile() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useLogout()
    
    const user = JSON.parse(localStorage.getItem('user'));
    const { authenticatedUser, no, path, dispatch} = useUserContext()

    const menuItems = [
        { name: "Dashboard", icon: faHouse, margin: 0, path: "/dashboard" },
        { name: "Assess Feedback", icon: faFileArrowDown, margin: 12, path: "/assess_feedback" },
        { name: "Create Assessment", icon: faFileArrowUp, margin: 10, path: "/create_assessment" },
        { name: "Employee Data", icon: faStreetView, margin: 3, path: "/employee_data" },
        { name: "Model Tuning", icon: faChartLine, margin: 5, path: "/model_tuning" },
        { name: "Settings", icon: faGear, margin: 5, path: "/admin_settings" },
    ];

    const isActive = (path) => {
        return location.pathname === path; // Check if the current location matches the path
    };


    const handleMenuItemClick = (path, e) => {
        e.preventDefault()
        navigate(path, { state: { userInfo: user }}); 
    };
    
    useEffect(() => {
        dispatch({type: 'LOGIN', payload: user, no: 2, path: location.pathname})
        localStorage.setItem('path' ,JSON.stringify(location.pathname))
    }, [])

    return (user && (
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
                <div className='content'>
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
                    <div className="profile-header">
                    <label htmlFor='profile-image' className='profile-image-label'>
                        <img src={user.profile_picture || defaultImg} alt="Profile" className='profile-image-pic'/>
                        </label>
                    </div>
                    <div class="profile-settings">
                        <h1>{user.name}</h1>
                        <form>
                            <label for="empID">Admin ID</label>
                            <input 
                                type="text"
                                value={user.adminID}
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
    ));
}