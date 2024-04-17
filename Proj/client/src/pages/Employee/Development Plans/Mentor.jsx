import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFileArrowDown, faFileArrowUp, faStreetView, faGear, faBuilding, faUser, faFileLines, faTriangleExclamation, faEye, faTrash, faSearch, faCheckCircle, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import './Mentor.css';
import '../fonts.css';
import axios from 'axios';
import { toast } from "react-hot-toast";
import { useLogout } from '../../../hooks/useLogout';
import defaultImg from '../../img/profile-default.svg'
import { useUserContext } from '../../../hooks/useUserContext';

export default function Mentor() {
    const location = useLocation();
    const navigate = useNavigate();
    const allUserInfo = JSON.parse(localStorage.getItem('user'))
    const user = allUserInfo.name;
    const { logout } = useLogout()
    const { authenticatedUser, no, dispatch } = useUserContext();

    const menuItems = [
        { name: "Career Path", icon: faHouse, margin: 0, path: "/employeeDashboard" },
        { name: "Personal Development Plans", icon: faFileArrowDown, margin: 4, path: "/developmentPlans" },
        { name: "Feedback Tools", icon: faFileArrowUp, margin: 7, path: "/feedback" },
        { name: "Settings", icon: faGear, margin: 0, path: "/employeeSettings" }
    ];

    const [activeMenuItem, setActiveMenuItem] = useState("");

    const handleMenuItemClick = (path, e) => {
        e.preventDefault()
        navigate(path, { state: { userInfo: allUserInfo } });
    };

    const isActive = (path) => {
        return '/developmentPlans' === path; // Check if the current location matches the path
    };


    // Menotr Mentee Specific stuff below
    const [mentorID, setMentorID] = useState(allUserInfo.mentor_ID);
    const [mentorInfo, setMentorInfo] = useState({});

    const [loading, setLoading] = useState(false); // Add loading state
    

    const getMentorOptions = () => {

        // send a request to the server to get a list of available mentors. request contains the employee ID and position ID
        const positionID = allUserInfo.positionID;
        const employeeID = allUserInfo.employeeID;

        setLoading(true);

        // send these two as body of the request
        axios.get(`/mentorOptions/${positionID}/${employeeID}`)
            .then(res => {
                console.log(res.data);

                // set the available mentors
                setAvailableMentors(res.data);
                setLoading(false);
            }
            )
            .catch(err => {
                console.log(err);
                toast.error("Could not get mentor options");
                setLoading(false);
            });
    }

    // Get list of available mentors
    const [availableMentors, setAvailableMentors] = useState([]);
    useEffect(() => {
        document.title = 'Development Plans - Mentors'
        dispatch({type: 'LOGIN', payload: user, no: 1, path: location.pathname})
        localStorage.setItem('path' ,JSON.stringify(location.pathname))
        if (!mentorID) {
            console.log('getting mentors');
            getMentorOptions();
        }
    }, []);

    // Choose a mentor and save it to the database
    const chooseMentor = (mentorID) => {

        // Send a post request to the server to save the mentor ID against the employee ID
        axios.post(`/saveMentor/${mentorID}/${allUserInfo.employeeID}`)
            .then(res => {
                console.log(res.data);
                toast.success("Mentor chosen successfully");

                // Update location state
                navigate(location.pathname, { state: { userInfo: { ...allUserInfo, mentor_ID: mentorID } } });
            })
            .catch(err => {
                console.log(err);
                toast.error("Could not save mentor");
            });

        // Hardcoded for now
        setMentorID(mentorID);
    }

    // Get mentor name, email, and phone number for contact
    useEffect(() => {
        if (mentorID) {
            axios.get(`/mentor/${mentorID}`)
                .then(res => {
                    console.log(res.data);
                    setMentorInfo(res.data);
                })
                .catch(err => {
                    console.log(err);
                    toast.error("Could not get mentor info");
                });
        }
    }, [mentorID]);


    // Get positions data to map position ID to position name
    const [positions, setPositions] = useState([]);
    useEffect(() => {
        axios.get('/dashboard-position-titles')
            .then(res => {
                setPositions(res.data);
                console.log(res.data);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to fetch position titles');
            });
    }, []);



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
                    <div className='mentorWrapper'>
                        {loading ? (
                            <h1>Loading...</h1>
                        ) : (
                            <>
                                {mentorID ? (
                                    <>
                                        <h1>Welcome to the Mentorship Program!</h1>
                                        <p>Here's some information about your chosen mentor:</p>
                                        <div className="mentor-info">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <th>Name:</th>
                                                        <td>{mentorInfo.name}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Picture</th>
                                                        <td>
                                                            {mentorInfo.profile_picture ? (
                                                                <img src={mentorInfo.profile_picture} alt="Profile" className="profile-pic" width={150} height={150} />
                                                            ) : (
                                                                <img src={defaultImg} alt="Profile" className="profile-pic" width={150} height={150} />
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Position:</th>
                                                        <td>{positions.find(pos => pos.positionID === mentorInfo.positionID)?.title}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Email:</th>
                                                        <td>{mentorInfo.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Phone:</th>
                                                        <td>{mentorInfo.contactNumber}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Areas of Expertise:</th>
                                                        <td>
                                                            <ul>
                                                                {mentorInfo.skills && mentorInfo.skills.map(skill => (
                                                                    <li key={skill}>
                                                                        <FontAwesomeIcon icon={faCheckCircle} className="skill-icon" />
                                                                        {skill}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>
                                        <div className="contact-icons">
                                            <a href={`mailto:${mentorInfo.email}`} className="icon-link">
                                                <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
                                            </a>
                                            <a href={`tel:${mentorInfo.contactNumber}`} className="icon-link">
                                                <FontAwesomeIcon icon={faPhone} className="contact-icon" />
                                            </a>
                                        </div>
                                    </>

                                ) : (
                                    <>
                                        <h1>Choose Mentor</h1>
                                        {availableMentors.length === 0 && <h1 className="no-mentors">No mentors available for your position</h1>}
                                        <div className="mentor-cards">
                                            {availableMentors.map(mentor => (
                                                <div className="mentor-card" key={mentor.employeeID}>
                                                    <h2>{mentor.name}</h2>
                                                    <p>{positions.find(pos => pos.positionID === mentor.positionID)?.title} | {mentor.email} | {mentor.contactNumber}</p>
                                                    <button onClick={() => chooseMentor(mentor.employeeID)}>Choose Mentor</button>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}