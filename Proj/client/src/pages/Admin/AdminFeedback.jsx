import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from '../../../context/userContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFileArrowDown, faFileArrowUp, faStreetView, faGear, faBuilding, faUser, faFileLines, faTriangleExclamation, faEye, faTrash, faSearch, faChartLine } from '@fortawesome/free-solid-svg-icons';
import './AdminFeedback.css';
import './fonts.css';
import { useUserContext } from '../../hooks/useUserContext';
import { useLogout } from '../../hooks/useLogout';

export default function AdminFeedback() {
    const location = useLocation();
    const { logout } = useLogout()
    
    const { authenticatedUser, no, path, dispatch} = useUserContext()
    const navigate = useNavigate();
    const allUserInfo = JSON.parse(localStorage.getItem('user'));
    const user = allUserInfo.name

    const menuItems = [
        { name: "Employee Development", icon: faHouse, margin: 0, path: "/dashboard" },
        { name: "Assess Feedback", icon: faFileArrowDown, margin: 12, path: "/admin_feedback" },
        { name: "Create Assessment", icon: faFileArrowUp, margin: 10, path: "/admin_feedback/create_assessment" },
        { name: "Employee Data", icon: faStreetView, margin: 3, path: "/employee_data" },
        { name: "Model Tuning", icon: faChartLine, margin: 5, path: "/model_tuning" },
        { name: "Settings", icon: faGear, margin: 5, path: "/admin_settings" },
    ];

    const [activeMenuItem, setActiveMenuItem] = useState("");

    const handleMenuItemClick = (path, e) => {
        e.preventDefault()
        navigate(path, { state: { name: user,userInfo:allUserInfo } });
    };

    const isActive = (path) => {
        return location.pathname === path; // Check if the current location matches the path
    };

    useEffect(() => {
        document.title = 'Assess Feedback'
        dispatch({type: 'LOGIN', payload: user, no: 2, path: location.pathname})
        localStorage.setItem('path' ,JSON.stringify(location.pathname))
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
                <div className='contentDashClient'>
                    <div className='header'>
                        <FontAwesomeIcon icon={faUser} size='xl' color='rgb(196,196,202)' />
                        <a href="" onClick={(e) => handleMenuItemClick('/AdminProfile', e)}>{user}</a>
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
                    <div className='promotionsWrapper'>
                        <div className='promotionItem' id='courseFeedback' onClick={(e) => handleMenuItemClick('/admin_feedback/assess_feedback', e)}>
                            <div>View Course Feedback.</div>
                        </div>
                        <div className='promotionItem' id='complaintForm' onClick={(e) => handleMenuItemClick('/admin_feedback/assess_complaint', e)}>
                            <div >View Complaints.</div>
                        </div>
                        <div className='promotionItem' id='pendingAssessments' onClick={(e) => handleMenuItemClick('/admin_feedback/view_assessment', e)}>
                            <div>View Assessments.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}