import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFileArrowDown, faFileArrowUp, faStreetView, faGear, faBuilding, faUser, faFileLines, faTriangleExclamation, faEye, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { CategoryScale, LinearScale, Chart as ChartJS, BarElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './PromotionProgress.css';
import '../fonts.css';
import { useLogout } from '../../../hooks/useLogout';
import { useUserContext } from '../../../hooks/useUserContext';

export default function PromotionProgress() {
    const location = useLocation();
    const navigate = useNavigate();
    const allUserInfo = JSON.parse(localStorage.getItem('user'));
    const { logout } = useLogout()
    const { authenticatedUser, no, dispatch } = useUserContext();

    console.log("CHeck, ", allUserInfo)

    ChartJS.register(
        BarElement,
        CategoryScale,
        LinearScale
    );

    const menuItems = [
        { name: "Career Path", icon: faHouse, margin: 0, path: "/employeeDashboard" },
        { name: "Personal Development Plans", icon: faFileArrowDown, margin: 4, path: "/developmentPlans" },
        { name: "Feedback Tools", icon: faFileArrowUp, margin: 7, path: "/feedback" },
        { name: "Settings", icon: faGear, margin: 0, path: "/employeeSettings" }
    ];

    const [positionTitles, setPositionTitles] = useState([]);
    const [courses, setCourses] = useState([])
    const [workshops, setWorkshops] = useState([])
    const [employees, setEmployees] = useState([]);
    const [employeeScores, setEmployeeScores] = useState({});
    const [positions, setPositions] = useState([])
    const [hierarchy, setHierarchy] = useState(-1);
    const [promotabilityScore, setPromotabilityScore] = useState("loading");
    const [availablePositions, setAvailablePositions] = useState([])
    const [title, setTitle] = useState("")
    const [noPosition, setNoPosition] = useState(false)
    const [loadEmp, setLoadEmp] = useState(10)


    const getPositionHierarchy = (positionID) => {
        const position = positions.find(position => position.positionID === positionID);
        return position ? position.hierarchy_level : "Unknown";
    };


    useEffect(() => {
        document.title = 'Career Path - Promotion Progress'
        dispatch({type: 'LOGIN', payload: allUserInfo, no: 1, path: location.pathname})
        localStorage.setItem('path' ,JSON.stringify(location.pathname))
        axios.get('/dashboard-employees')
            .then(res => {
                setEmployees(res.data);
            })
            .catch(err => {
                console.log(err);
                toast.error('Failed to fetch employees');
            });
    }, []);

    useEffect(() => {

        axios.get('/dashboard-employees')
            .then(res => {
                setEmployees(res.data);
                if (loadEmp > 0) {
                    setLoadEmp(loadEmp - 1)
                }
            })
            .catch(err => {
                console.log(err);
                toast.error('Failed to fetch employees');
            });
        axios.get('/dashboard-position-titles')
            .then(res => {
                setPositions(res.data);
                let currEmployee = allUserInfo

                let currHierarchy = getPositionHierarchy(currEmployee.positionID)
                setHierarchy(currHierarchy);
                let new_positions = positions.filter(position => position.hierarchy_level === (currHierarchy - 1))

                if (new_positions.length == 0) {
                    setNoPosition(true)
                    setAvailablePositions([])
                }
                else {
                    setNoPosition(false)
                    setAvailablePositions(new_positions)
                    setTitle(getPositionTitle(currEmployee.positionID))
                }
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to fetch position titles');
            });

        axios.get('/dashboard-course-data')
            .then(res => {
                setCourses(res.data)
            })
            .catch(err => {
                console.log(err)
                toast.error('Failed to fetch courses')
            });

        axios.get('/dashboard-workshop-data')
            .then(res => {
                setWorkshops(res.data)
            })
            .catch(err => {
                console.log(err)
                toast.error('Failed to fetch workshops')
            })


    }, [loadEmp]);

    // function to convert positionID to position title
    const getPositionTitle = (positionID) => {
        const position = positions.find(position => position.positionID === positionID);
        return position ? position.title : "Unknown";
    };

    const getPositionalCourses = (positionID) => {
        const position = positions.find(position => position.positionID === positionID);
        return position ? position.courses : []
    }
    const getPositionalWorkshops = (positionID) => {
        const position = positions.find(position => position.positionID === positionID);
        console.log(positionID, position)
        return position ? position.workshops : []
    }

    const getCourseTitle = (courseID) => {
        const course = courses.find(course => course.courseID === courseID)
        return course ? course.title : []
    }

    const getWorkshopTitle = (workshopID) => {
        const workshop = workshops.find(workshop => workshop.workshopID === workshopID)
        return workshop ? workshop.title : []
    }


    const getCourseCompletion = (() => {
        const requiredCourses = getPositionalCourses(allUserInfo.positionID).map((courseID) => getCourseTitle(courseID))
        const coursesTaken = allUserInfo.courses_taken

        if (requiredCourses.length == 0) {
            return 1
        }


        let progress = 0
        for (const course of requiredCourses) {
            if (coursesTaken.includes(course)) {
                progress++
            }
        }

        return (progress / requiredCourses.length)


    })

    const getWorkshopCompletion = (() => {
        const requiredWorkshops = getPositionalWorkshops(allUserInfo.positionID).map((workshopID) => getWorkshopTitle(workshopID))
        const workshopsTaken = allUserInfo.workshops_taken


        if (requiredWorkshops.length == 0) {
            return 1;
        }


        let progress = 0
        for (const workshop of requiredWorkshops) {
            if (workshopsTaken.includes(workshop)) {
                progress++
            }
        }

        return (progress / requiredWorkshops.length)

    })

    const getWorkshopCompletionNew = ((id) => {

        const requiredWorkshopsNew = getPositionalWorkshops(id.positionID).map((workshopID) => getWorkshopTitle(workshopID))
        const workshopsTakenNew = allUserInfo.workshops_taken

        // if(workshopsTakenNew.length==0)
        // {
        //     return 0;
        // }





        if (requiredWorkshopsNew.length == 0) {
            return 1;
        }


        let progressNew = 0
        for (const workshop of requiredWorkshopsNew) {
            if (workshopsTakenNew.includes(workshop)) {
                progressNew++
            }
        }

        return (progressNew / requiredWorkshopsNew.length)

    })

    const getCourseCompletionNew = ((id) => {
        const requiredCourses = getPositionalCourses(id.positionID).map((courseID) => getCourseTitle(courseID))
        const coursesTaken = allUserInfo.courses_taken

        console.log("Here's id + requrement", id, requiredCourses)

        if (requiredCourses.length == 0) {
            return 1
        }


        let progress = 0
        for (const course of requiredCourses) {
            if (coursesTaken.includes(course)) {
                progress++
            }
        }

        return (progress / requiredCourses.length)


    })

    const handleMenuItemClick = (path, e) => {
        e.preventDefault()
        navigate(path, { state: { userInfo: allUserInfo } });
    };

    const isActive = (path) => {
        return '/employeeDashboard' === path; // Check if the current location matches the path
    };


    const barChartData = {
        labels: ['Attendance Rate', 'Punctuality Score', 'Work Ethic Score', 'Task Completion Rate', 'Workshop Completion Rate', 'Course Completion Rate', 'Leadership skills', 'Collaboration skills'],
        datasets: [
            {
                label: 'My KPIs',

                data: [allUserInfo.attendance_rate * 100, allUserInfo.punctuality * 100, allUserInfo.efficiency * 100, allUserInfo.task_completion_rate * 100, getWorkshopCompletion() * 100, getCourseCompletion() * 100, allUserInfo.professionalism * 100, allUserInfo.leadership * 100, allUserInfo.collaboration * 100],

                backgroundColor: '#30e257',
                borderColor: 'rgba(150, 132, 132, 1)',
                borderWidth: 2,
            },
        ],
    };

    const ProgressBar = (props) => {
        const { bgcolor, completed } = props;

        let barColor = bgcolor
        if (completed < 60) {
            barColor = "red"
        } else if (completed < 80) {
            barColor = "orange"
        }

        const containerStyles = {
            height: 20,
            width: '25vw',
            backgroundColor: "#e0e0de",
            borderRadius: 20,
            margin: 50
        }

        const fillerStyles = {
            height: '100%',
            width: `${completed}%`,
            backgroundColor: barColor,
            borderRadius: 'inherit',
            textAlign: 'right'
        }

        const labelStyles = {
            color: 'white',
            fontWeight: 'bold'
        }

        return (
            <div style={containerStyles}>
                <div style={fillerStyles}>
                    <span style={labelStyles}>{`${completed}%`}</span>
                </div>
            </div>
        );
    };

    const [weights, setWeights] = useState({});
    useEffect(() => {
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

                // filter employees at a given hierarchy
                let scores = {};

                const levelEmployees = employees.filter((emp) => {

                    if (getPositionHierarchy(emp.positionID) === hierarchy) {
                        return true
                    }
                    else {
                        return false
                    }


                })
                //finf scores for all employees at this hierarchy
                levelEmployees.forEach(employee => {
                    calculatePerformanceScore(employee) > 1 ? scores[employee.employeeID] = 1 : scores[employee.employeeID] = calculatePerformanceScore(employee);
                });
                setEmployeeScores(scores);


                let max_score = 0;
                for (var id in employeeScores) {
                    if (employeeScores[id] > max_score) {
                        max_score = employeeScores[id]
                    }
                }
                console.log(scores, max_score)


                // find promotability score
                let new_score = ((scores[allUserInfo.employeeID] / max_score) * 100).toFixed(2)
                if (new_score <= 100 && new_score >= 0) {
                    setPromotabilityScore(new_score.toString())

                }

                // console.log("MAX, Mine, and score", max_score, scores[allUserInfo.employeeID], promotabilityScore)

            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to fetch weights');
            });
    }, [employees]);

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
                <div className='contentDashClientProgress'>
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
                    <div className='progressWrapper'>
                        <div className="sectionVisualizations">
                            <div className="charts">
                                <div className="chartBar">
                                    <div className='sectionHeadings'>Key Performance Indicators</div>
                                    <Bar data={barChartData} />
                                </div>
                                <div className="chartCircular">
                                    <div className='sectionHeadings'>Promotability Score</div>
                                    <CircularProgressbar
                                        value={promotabilityScore}
                                        text={`${promotabilityScore}%`}
                                        styles={buildStyles({
                                            // Rotation of path and trail, in number of turns (0-1)
                                            rotation: 0.9,

                                            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                            strokeLinecap: 'round',

                                            // Text size
                                            textSize: '1.3em',

                                            // How long animation takes to go from one percentage to another, in seconds
                                            pathTransitionDuration: 0.5,

                                            // Colors
                                            pathColor: `#30e257`,
                                            textColor: 'rgb(150,150,150)',
                                            trailColor: '#ddd',
                                            backgroundColor: '#3e98c7',
                                        })}
                                    />;
                                </div>
                            </div>
                        </div>
                        <div className="sectionSkills">
                            <div className='sectionHeadings'>Skills Acquired</div>
                            <div className="skillsContainer">
                                {allUserInfo.skills.map((skill, index) => (
                                    <div key={index} className="skill">
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="sectionCards">
                            <div className='sectionHeadings'>Positions</div>
                            <div className="cards">
                                {
                                    !noPosition && (availablePositions.map(currPosition => (

                                        <div className="card">
                                            <div className='promotionalPosition'>
                                                <div className='cardHeadings'>Promotional Position:</div>
                                                <div id='positionTitle'>{currPosition.title}</div>
                                            </div>
                                            <div className='positionalCourseProgress'>
                                                <div className='progContainer'>
                                                    <div className='cardHeadings'>Coursework Progress:</div>
                                                    <div className='progressBar'>
                                                        <ProgressBar bgcolor='#30E257' completed={(getCourseCompletionNew(currPosition) * 100).toFixed(2)} />
                                                    </div>
                                                </div>
                                                <div className='progContainer'>
                                                    <div className='cardHeadings'>Workshop Progress:</div>
                                                    <div className='progressBar'>
                                                        <ProgressBar bgcolor='#30E257' completed={(getWorkshopCompletionNew(currPosition) * 100).toFixed(2)} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='promotionalSkills'>
                                                <div className='cardHeadings' style={{ color: '#969696 ' }}>Skills Required</div>

                                                <div className="skillsContainer">
                                                    {
                                                        currPosition.required_skills.map((skill, index) => (
                                                            <div key={index} className="skill">
                                                                {skill}
                                                            </div>
                                                        ))}
                                                </div>

                                            </div>
                                        </div>
                                    ))
                                    )}

                                {
                                    noPosition && (

                                        <div className="card">
                                            <h1>No open positions are currently available.</h1>
                                        </div>
                                    )


                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}