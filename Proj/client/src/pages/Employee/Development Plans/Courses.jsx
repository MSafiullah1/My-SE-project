import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFileArrowDown, faFileArrowUp, faStreetView, faGear, faBuilding, faUser, faFileLines, faTriangleExclamation, faEye, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import './Courses.css';
import '../fonts.css';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useLogout } from '../../../hooks/useLogout';
import { useUserContext } from '../../../hooks/useUserContext';

export default function Courses() {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'))
    const navigate = useNavigate();
    const employeeInfo  = user;
    const { logout } = useLogout()
    const { authenticatedUser, no, dispatch } = useUserContext();

    // const employeeInfo = location.state.info


    const menuItems = [
        { name: "Career Path", icon: faHouse, margin: 0, path: "/employeeDashboard" },
        { name: "Personal Development Plans", icon: faFileArrowDown, margin: 4, path: "/developmentPlans" },
        { name: "Feedback Tools", icon: faFileArrowUp, margin: 7, path: "/feedback" },
        { name: "Settings", icon: faGear, margin: 0, path: "/employeeSettings" }
    ];

    const [activeMenuItem, setActiveMenuItem] = useState("");
    const [positionTitles, setPositionTitles] = useState([]);
    const [courses, setCourses] = useState([])

    const handleMenuItemClick = (path, e) => {
        e.preventDefault()
        navigate(path, { state: { userInfo: user } });
    };

    const isActive = (path) => {
        return '/developmentPlans' === path; // Check if the current location matches the path
    };

    useEffect(() => {
        document.title = 'Development Plans - Courses'
        dispatch({type: 'LOGIN', payload: user, no: 1, path: location.pathname})
        localStorage.setItem('path' ,JSON.stringify(location.pathname))
        axios.get('/dashboard-position-titles')
            .then(res => {
                setPositionTitles(res.data);
                console.log(res.data);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to fetch position titles');
            });

        axios.get('/dashboard-course-data')
            .then(res => {
                console.log(res.data)
                setCourses(res.data)
            })
            .catch(err => {
                console.log(err)
                toast.error('Failed to fetch courses')
            });
    }, []);

        // function to convert positionID to position title
        const getPositionTitle = (positionID) => {
            const position = positionTitles.find(position => position.positionID === positionID);
            return position ? position.title : "Unknown";
        };
    
        const getPositionalCourses = (positionID) => {
            const position = positionTitles.find(position => position.positionID === positionID);
    
            return position ? position.courses : []
        }
        const getPositionalWorkshops = (positionID) => {
            const position = positionTitles.find(position => position.positionID === positionID);
            return position ? position.workshops : []
        }
    
        const getCourseTitle = (courseID) => {
            const course = courses.find(course => course.courseID === courseID)
            return course ? course.title : []
        }

        const getCourseId = (courseTitle) => {
            const course = courses.find(course => course.title === courseTitle);
            return course ? course.courseID : null;
        }

        const getCourseDetails = (courseID) => {
            const course = courses.find(course => course.courseID === courseID)
            // return course ? course.details : ["jasnjasnasxcn"]
            return course ? course.description : "No details available";
        }

        const getCourseDuration = (courseID) => {
            const course = courses.find(course => course.courseID === courseID)
            return course ? course.duration : []
        }
    
        const getWorkshopTitle = (workshopID) => {
            const workshop = workshops.find(workshop => workshop.workshopID === workshopID)
            return workshop ? workshop.title : []
        }
    
        const getCourseCompletion = (()=>{
            const requiredCourses = getPositionalCourses(employeeInfo.positionID).map((courseID)=>getCourseTitle(courseID))
            const coursesTaken = employeeInfo.courses_taken
    
            if(requiredCourses.length == 0)
            {
                return 1
            }
    
    
            let progress = 0
            for(const course of requiredCourses){
                if(coursesTaken.includes(course))
                {
                    progress++
                }
            }
    
            return (progress/requiredCourses.length)
    
    
        })

        const coursesTaken = employeeInfo.courses_taken;//courses taken by the employee
        const positionalCourses = getPositionalCourses(employeeInfo.positionID);//courses required for the employee's position
        const positionalCourses_names = getPositionalCourses(employeeInfo.positionID).map(courseID => getCourseTitle(courseID));

        const completedCourses_for_position = positionalCourses_names.filter(courseID => coursesTaken.includes(courseID));
        const rem_Courses_for_position = positionalCourses_names.filter(courseID => !coursesTaken.includes(courseID));

        const totalCourses_for_curr_position = positionalCourses.length;
        const all_courses_offered = courses.map(course => course.title);
        const rem_all_courses_offered = all_courses_offered.filter(course => !coursesTaken.includes(course));
    

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
                        <a href="" onClick={(e) => handleMenuItemClick('/UserProfile', e)}>{user.name}</a>
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
                    <div className='coursesWrapper'>
                        {/* <h1>Courses</h1> */}
                        <div className="coursesColumns">
                            <h2>Recommended Courses 📝</h2>
                            <ul className="recommendedCourses">
                            {rem_Courses_for_position.length > 0 ? (

                            rem_Courses_for_position.map((course, index) => (
                                <li key={index}>
                                <h4>Course Name: {course}</h4>
                                <div>Course ID: {getCourseId(course)}</div>
                                <div>Course Duration: {getCourseDuration(getCourseId(course))}</div>
                                <div>Course details: {getCourseDetails(getCourseId(course))}</div> 
                              </li>
                               ))): (
                                <li>
                                <div>You have completed all the Courses for your position.</div>
                                </li>
                              )}
                            </ul>
                            <h2>Completed Courses ✅</h2>
                            <ul className="completedCourses"> 
                            {completedCourses_for_position.length > 0 ? ( 
                            completedCourses_for_position.map((course, index) => (
                                <li key={index}>
                                <h4>Course Name: {course}</h4>
                                <div>Course ID: {getCourseId(course)}</div>
                                <div>Course Duration: {getCourseDuration(getCourseId(course))}</div>
                                <div>Course details: {getCourseDetails(getCourseId(course))}</div>

                            </li>
                                ))): (
                            <li>
                            <div>You have not completed any course yet.</div>
                            </li>
                          )}
                            </ul>
                        </div>
                        </div>
                </div>
            </div>
        </div>
    )
}