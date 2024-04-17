import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFileArrowDown, faFileArrowUp, faStreetView, faGear, faBuilding, faUser, faFileLines, faTriangleExclamation, faEye, faTrash, faSearch, faE, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './EmployeeSettings.css';
import axios from 'axios'
import defaultImg from '../img/profile-default.svg'
import './fonts.css';
import { toast } from "react-hot-toast";
import img1 from "../img/s_img1.png";
import img2 from "../img/s_img2.png";
import img3 from "../img/s_img3.png";
import img4 from "../img/s_img4.png";
import img5 from "../img/s_img5.png";
import img6 from "../img/s_img6.png";
import img7 from "../img/s_img7.png";
import img8 from "../img/s_img8.png";
import img9 from "../img/s_img9.png";
import img10 from "../img/s_img10.png";
import { FaEdit, FaEye, FaEyeSlash } from 'react-icons/fa';
import SmallBox from '../../components/SmallBox';
import { useLogout } from '../../hooks/useLogout';
import { useUserContext } from '../../hooks/useUserContext';

export default function EmployeeSettings() {
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));
    const { logout } = useLogout()
    const navigate = useNavigate();
    const { authenticatedUser, no, dispatch } = useUserContext();

    const [positions, setPositions] = useState([])
    const getPositionTitle = (positionID) => {
        const position = positions.find(position => position.positionID === positionID);
        return position ? position.title : "Unknown";
    };

    useEffect(() => {
        // fetchData(); // Call the fetch function on component mount
        dispatch({type: 'LOGIN', payload: user, no: 1, path: location.pathname})
        localStorage.setItem('path' ,JSON.stringify(location.pathname))
        getPositionData()
        setActiveUser({...activeUser, userPosition: getPositionTitle(user.positionID)})
        setRandomizedImages(sequenceImg([...imgSources]));
    }, [positions]); // Empty array means it will only run once when component mounts

    const menuItems = [
        { name: "Career Path", icon: faHouse, margin: 0, path: "/employeeDashboard" },
        { name: "Personal Development Plans", icon: faFileArrowDown, margin: 4, path: "/developmentPlans" },
        { name: "Feedback Tools", icon: faFileArrowUp, margin: 7, path: "/feedback" },
        { name: "Settings", icon: faGear, margin: 0, path: "/employeeSettings" }
    ];

    const tabs = ["My Profile", "Change Password", "Change Security Image"];

    const [activeMenuItem, setActiveMenuItem] = useState("");
    const [activeUser, setActiveUser] = useState({
        userData: user,
        userPosition: getPositionTitle(user.positionID)
    })

    const updateUserData = (update) => {
        setActiveUser({...activeUser, userData: update})
        console.log('Hello')
    }

    const [activeTab, setActiveTab] = useState(0);
    const [newPassword, setNewPassword] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [securityImg, setSecurityImg] = useState({
        currentImg: '',
        newImg: ''
    })

    const [passwordValidations, setPasswordValidations] = useState({
        isLongEnough: false,
        hasUpper: false,
        hasLower: false,
        hasNumber: false,
        hasSpecial: false,
    });

    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const [showPassword, setShowPassword] = useState({
        field1: false,
        field2: false,
        field3: false
    })

    const [editInfo, setEditInfo] = useState({
        about: false,
        skills: false,
        courses: false,
        education: false,
        workshops: false,
        awards: false,
        history: false
    })

    const [enableEdit, setEnableEdit] = useState(false);

    const handleUpdateBox = (edit) => {
        setEditInfo(edit)
    }

    const handleEditSubmit = (flag) => {
        setEnableEdit(false)
        if (flag) {
            updateUserProfile()
        } else {
            // fetchData()
            setActiveUser({...activeUser, userData: user})
        }
    }

    const onPasswordChange = (password) => {
        setNewPassword({ ...newPassword, newPassword: password});
        setPasswordValidations({
            isLongEnough: password.length >= 8,
            hasUpper: /[A-Z]/.test(password),
            hasLower: /[a-z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        });
    };

    const onConfirmPasswordChange = (samePassword) => {
        setNewPassword({ ...newPassword, confirmPassword: samePassword});
        setPasswordsMatch(newPassword.newPassword === samePassword);
    };

    const handleMenuItemClick = (path, e) => {
        e.preventDefault()
        navigate(path, { state: { userInfo: user } });
    };

    const handleItemClick = (index, e) => {
        e.preventDefault()
        setActiveTab(index)
        setNewPassword({newPassword: '', currentPassword: '', confirmPassword: ''})
        setPasswordValidations({})
        setPasswordsMatch(false)
        setEnableEdit(false)
        setShowPassword({field1: false, field2: false, field3: false})
        setSecurityImg({currentImg: '', newImg: ''})
        // fetchData()
    }

    const defaultBehavior = () => {
        // fetchData()
        setEditInfo(false)
    }

    const imgSources = [
        [img1, 1],
        [img2, 2],
        [img3, 3],
        [img4, 4],
        [img5, 5],
        [img6, 6],
        [img7, 7],
        [img8, 8],
        [img9, 9],
        [img10, 10],
    ];
    const [randomizedImages, setRandomizedImages] = useState(imgSources);

    const sequenceImg = (list) => {
        let array = [...list];
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const getPositionData = async () => {
        try {
            const resp = await axios.get('/getPositionsData')
            setPositions(resp.data)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchData = async () => {
        try {
            const resp = await axios.post('/getProfile', {
                name: user
            })
            if (resp.data.error) {
                toast.error(data.error)
            } else {
                console.log(resp.data)
                setActiveUser({userData: resp.data.record1, userPosition: resp.data.record2.title})
            }
        } catch (err) {
            console.log(err)
        }
    }

    const updateUserProfile = async () => {
        try {
            console.log('I am here')
            const resp = await axios.post('/updateProfile', activeUser.userData)
            if (resp.data.error) {
                // fetchData()
                setActiveUser({...activeUser, userData: user})
                toast.error(resp.data.error)
            } else {
                localStorage.setItem('user', JSON.stringify(activeUser.userData))
                toast.success('User Profile successfully updated')
            }
        } catch (err) {
            console.log(err)
        }
    }

    const isActive = (path) => {
        return location.pathname === path; // Check if the current location matches the path
    };  

    const handleImageUpload = async (e) => {
        const img = e.target.files[0]
        const base64 = await convertToBase64(img)
        console.log(base64)
        setActiveUser({...activeUser, userData: {...activeUser.userData, profile_picture: base64}})
    }

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
                resolve(fileReader.result)
            }
            fileReader.onerror = (err) => {
                reject(err)
            }
        })
    }

    const myProfile = () => {
        return (
            <div className='profil-box'>
            <p>
                <h3>About Me: {enableEdit && <FaEdit className='edit-info' onClick={(e) => setEditInfo({...editInfo, about: true})}/>}</h3><br/> {activeUser.userData && activeUser.userData.about}
                {editInfo.about && (
                    <div className="modal">
                        <div className="modal-content">
                            <SmallBox type='About' user = {activeUser.userData} update = {updateUserData} editInfo = {editInfo} close = {handleUpdateBox}/>
                        </div>
                    </div>
                )}
            </p><br></br>
            <p>
                <h3>Skills: {enableEdit && <FaEdit className='edit-info' onClick={(e) => setEditInfo({...editInfo, skills: true})}/>}</h3><br/>
                {activeUser.userData && activeUser.userData.skills.map((val, index) => {
                    return <li key={index}>{val}</li>
                })}
                {editInfo.skills && (
                    <div className="modal">
                        <div className="modal-content">
                            <SmallBox type='Skills' user = {activeUser.userData} update = {updateUserData} editInfo = {editInfo} close = {handleUpdateBox}/>
                        </div>
                    </div>
                )}
            </p><br></br>
            <p>
                <h3>Courses Taken: {enableEdit && <FaEdit className='edit-info' onClick={(e) => setEditInfo({...editInfo, courses: true})}/>}</h3><br/>
                {activeUser.userData && activeUser.userData.courses_taken.map((val, index) => {
                    return <li key={index}>{val}</li>
                })}
                {editInfo.courses && (
                    <div className="modal">
                        <div className="modal-content">
                            <SmallBox type='Courses Taken' user = {activeUser.userData} update = {updateUserData} editInfo = {editInfo} close = {handleUpdateBox}/>
                        </div>
                    </div>
                )}
            </p><br></br>
            <p>
                <h3>Education: {enableEdit && <FaEdit className='edit-info' onClick={(e) => setEditInfo({...editInfo, education: true})}/>}</h3><br/>
                {activeUser.userData && activeUser.userData.education.map((val, index) => {
                    return <li key={index}>{val}</li>
                })}
                {editInfo.education && (
                    <div className="modal">
                        <div className="modal-content">
                            <SmallBox type='Education' user = {activeUser.userData} update = {updateUserData} editInfo = {editInfo} close = {handleUpdateBox}/>
                        </div>
                    </div>
                )}
            </p><br></br>
            <p>
                <h3>Workshops Taken: {enableEdit && <FaEdit className='edit-info' onClick={(e) => setEditInfo({...editInfo, workshops: true})}/>}</h3><br/>
                {activeUser.userData && activeUser.userData.workshops_taken.map((val, index) => {
                    return <li key={index}>{val}</li>
                })}
                {editInfo.workshops && (
                    <div className="modal">
                        <div className="modal-content">
                            <SmallBox type='Workshops Taken' user = {activeUser.userData} update = {updateUserData} editInfo = {editInfo} close = {handleUpdateBox}/>
                        </div>
                    </div>
                )}
            </p><br></br>
            <p>
                <h3>Awards: {enableEdit && <FaEdit className='edit-info' onClick={(e) => setEditInfo({...editInfo, awards: true})}/>}</h3><br/>
                {activeUser.userData && activeUser.userData.awards.map((val, index) => {
                    return <li key={index}>{val}</li>
                })}
                {editInfo.awards && (
                    <div className="modal">
                        <div className="modal-content">
                            <SmallBox type='Awards' user = {activeUser.userData} update = {updateUserData} editInfo = {editInfo} close = {handleUpdateBox}/>
                        </div>
                    </div>
                )}
            </p><br></br>
            <p>
                <h3>Job History: {enableEdit && <FaEdit className='edit-info' onClick={(e) => setEditInfo({...editInfo, history: true})}/>}</h3><br/>
                {activeUser.userData && activeUser.userData.job_history.map((val, index) => {
                    return <li key={index}>{val}</li>
                })}
                {editInfo.history && (
                    <div className="modal">
                        <div className="modal-content">
                            <SmallBox type='Job History' user = {activeUser.userData} update = {updateUserData} editInfo = {editInfo} close = {handleUpdateBox}/>
                        </div>
                    </div>
                )}
            </p><br></br>
            </div>
        )
    }

    const reqChangePwd = async (e) => {
        e.preventDefault();
        if (!(newPassword.newPassword && newPassword.confirmPassword && newPassword.newPassword === newPassword.confirmPassword )) {
            toast.error("passwords do not match");
            return;
        }
        try {
            const { data } = await axios.post("/changePassword", {
                empID: activeUser.userData.employeeID,
                password: newPassword.currentPassword,
                samePassword: newPassword.confirmPassword
            });
            if (data.error) {
                toast.error(data.error);
            } else {
                setNewPassword({newPassword: '', currentPassword: '', confirmPassword: ''})
                setPasswordValidations({})
                setPasswordsMatch(false)
                setShowPassword({field1: false, field2: false, field3: false})
                toast.success("Password Successfully Reset");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const forwardImgReq = async (e) => {
        e.preventDefault();
        if (!securityImg.currentImg) {
            toast.error('you need to select your current security image')
        }

        if (!securityImg.newImg) {
            toast.error('you need to select new security image')
            return
        }

        try {
            const { data } = await axios.post("/changeSecurityImage", {
                empID: activeUser.userData.employeeID,
                currentImg: securityImg.currentImg,
                newImg: securityImg.newImg
            });
            if (data.error) {
                toast.error(data.error);
                setRandomizedImages(sequenceImg([...imgSources]));
            } else {
                setSecurityImg({currentImg: '', newImg: ''})
                setRandomizedImages(sequenceImg([...imgSources]));
                toast.success("Security Image Successfully Reset");
            }
        } catch (error) {
            console.log(error)
        }
    }

    const reqChangeSecurityImg = () => {
        return (
            <form onSubmit={(e) => forwardImgReq(e)}>
                <div className="security-image-selection">
                    <p>Select your current security image </p>
                    <div className="security-images">
                        <img
                            src={randomizedImages[0][0]}
                            alt="Security Icon 1"
                            className={`security-image ${securityImg.currentImg === randomizedImages[0][1] ? "selected" : ""
                                }`}
                            onClick={(e) =>
                                setSecurityImg({ ...securityImg, currentImg: randomizedImages[0][1] })
                            }
                        />
                        <img
                            src={randomizedImages[1][0]}
                            alt="Security Icon 2"
                            className={`security-image ${securityImg.currentImg  === randomizedImages[1][1] ? "selected" : ""
                                }`}
                            onClick={(e) =>
                                setSecurityImg({ ...securityImg, currentImg: randomizedImages[1][1] })
                            }
                        />
                        <img
                            src={randomizedImages[2][0]}
                            alt="Security Icon 3"
                            className={`security-image ${securityImg.currentImg  === randomizedImages[2][1] ? "selected" : ""
                                }`}
                            onClick={(e) =>
                                setSecurityImg({ ...securityImg, currentImg: randomizedImages[2][1] })
                            }
                        />
                        <img
                            src={randomizedImages[3][0]}
                            alt="Security Icon 4"
                            className={`security-image ${securityImg.currentImg  === randomizedImages[3][1] ? "selected" : ""
                                }`}
                            onClick={(e) =>
                                setSecurityImg({ ...securityImg, currentImg: randomizedImages[3][1] })
                            }
                        />
                        <img
                            src={randomizedImages[4][0]}
                            alt="Security Icon 5"
                            className={`security-image ${securityImg.currentImg  === randomizedImages[4][1] ? "selected" : ""
                                }`}
                            onClick={(e) =>
                                setSecurityImg({ ...securityImg, currentImg: randomizedImages[4][1] })
                            }
                        />
                    </div>
                    <div className="security-images">
                        <img
                            src={randomizedImages[5][0]}
                            alt="Security Icon 1"
                            className={`security-image ${securityImg.currentImg  === randomizedImages[5][1] ? "selected" : ""
                                }`}
                            onClick={(e) =>
                                setSecurityImg({ ...securityImg, currentImg: randomizedImages[5][1] })
                            }
                        />
                        <img
                            src={randomizedImages[6][0]}
                            alt="Security Icon 2"
                            className={`security-image ${securityImg.currentImg  === randomizedImages[6][1] ? "selected" : ""
                                }`}
                            onClick={(e) =>
                                setSecurityImg({ ...securityImg, currentImg: randomizedImages[6][1] })
                            }
                        />
                        <img
                            src={randomizedImages[7][0]}
                            alt="Security Icon 3"
                            className={`security-image ${securityImg.currentImg  === randomizedImages[7][1] ? "selected" : ""
                                }`}
                            onClick={(e) =>
                                setSecurityImg({ ...securityImg, currentImg: randomizedImages[7][1] })
                            }
                        />
                        <img
                            src={randomizedImages[8][0]}
                            alt="Security Icon 4"
                            className={`security-image ${securityImg.currentImg  === randomizedImages[8][1] ? "selected" : ""
                                }`}
                            onClick={(e) =>
                                setSecurityImg({ ...securityImg, currentImg: randomizedImages[8][1] })
                            }
                        />
                        <img
                            src={randomizedImages[9][0]}
                            alt="Security Icon 5"
                            className={`security-image ${securityImg.currentImg === randomizedImages[9][1] ? "selected" : ""
                                }`}
                            onClick={(e) =>
                                setSecurityImg({ ...securityImg, currentImg: randomizedImages[9][1] })
                            }
                        />
                    </div>
                </div>

                <div className="security-image-selection">
                    <p>Select new security image </p>
                    <div className="security-images">
                        <img
                            src={randomizedImages[0][0]}
                            alt="Security Icon 1"
                            className={`security-image ${securityImg.newImg === randomizedImages[0][1] ? "selected" : ""
                                }`}
                            onClick={(e) =>
                                setSecurityImg({ ...securityImg, newImg: randomizedImages[0][1] })
                            }
                        />
                        <img
                            src={randomizedImages[1][0]}
                            alt="Security Icon 2"
                            className={`security-image ${securityImg.newImg  === randomizedImages[1][1] ? "selected" : ""
                                }`}
                            onClick={(e) =>
                                setSecurityImg({ ...securityImg, newImg: randomizedImages[1][1] })
                            }
                        />
                        <img
                            src={randomizedImages[2][0]}
                            alt="Security Icon 3"
                            className={`security-image ${securityImg.newImg  === randomizedImages[2][1] ? "selected" : ""
                                }`}
                            onClick={(e) =>
                                setSecurityImg({ ...securityImg, newImg: randomizedImages[2][1] })
                            }
                        />
                        <img
                            src={randomizedImages[3][0]}
                            alt="Security Icon 4"
                            className={`security-image ${securityImg.newImg  === randomizedImages[3][1] ? "selected" : ""
                                }`}
                            onClick={(e) =>
                                setSecurityImg({ ...securityImg, newImg: randomizedImages[3][1] })
                            }
                        />
                        <img
                            src={randomizedImages[4][0]}
                            alt="Security Icon 5"
                            className={`security-image ${securityImg.newImg  === randomizedImages[4][1] ? "selected" : ""
                                }`}
                            onClick={(e) =>
                                setSecurityImg({ ...securityImg, newImg: randomizedImages[4][1] })
                            }
                        />
                    </div>
                    <div className="security-images">
                        <img
                            src={randomizedImages[5][0]}
                            alt="Security Icon 1"
                            className={`security-image ${securityImg.newImg  === randomizedImages[5][1] ? "selected" : ""
                                }`}
                            onClick={(e) =>
                                setSecurityImg({ ...securityImg, newImg: randomizedImages[5][1] })
                            }
                        />
                        <img
                            src={randomizedImages[6][0]}
                            alt="Security Icon 2"
                            className={`security-image ${securityImg.newImg  === randomizedImages[6][1] ? "selected" : ""
                                }`}
                            onClick={(e) =>
                                setSecurityImg({ ...securityImg, newImg: randomizedImages[6][1] })
                            }
                        />
                        <img
                            src={randomizedImages[7][0]}
                            alt="Security Icon 3"
                            className={`security-image ${securityImg.newImg  === randomizedImages[7][1] ? "selected" : ""
                                }`}
                            onClick={(e) =>
                                setSecurityImg({ ...securityImg, newImg: randomizedImages[7][1] })
                            }
                        />
                        <img
                            src={randomizedImages[8][0]}
                            alt="Security Icon 4"
                            className={`security-image ${securityImg.newImg  === randomizedImages[8][1] ? "selected" : ""
                                }`}
                            onClick={(e) =>
                                setSecurityImg({ ...securityImg, newImg: randomizedImages[8][1] })
                            }
                        />
                        <img
                            src={randomizedImages[9][0]}
                            alt="Security Icon 5"
                            className={`security-image ${securityImg.newImg === randomizedImages[9][1] ? "selected" : ""
                                }`}
                            onClick={(e) =>
                                setSecurityImg({ ...securityImg, newImg: randomizedImages[9][1] })
                            }
                        />
                    </div>
                </div>
                <div className="password-input-group">
                            <button type="submit" className="reset-btn">
                                Reset Security Image
                            </button>
                </div>
            </form>
        )
    }

    const changePassword = () => {
        return (
            <form onSubmit={(e) => reqChangePwd(e)}>
                <div className="password-input-group">
                    <label>Current Password: </label>
                    <div className="input-wrapper-n">
                        <input
                            type={showPassword.field1 ? "text" : "password"}
                            placeholder="Password"
                            value={newPassword.currentPassword}
                            className="password-input"
                            onChange={(e) => setNewPassword({ ...newPassword, currentPassword: e.target.value })}
                        />
                        <FontAwesomeIcon icon={showPassword.field1 ? faEyeSlash : faEye} className="password-icon" onClick={(e) => {setShowPassword({...showPassword, field1: !showPassword.field1})}}/>
                    </div>
                </div>

                <div className="password-input-group">
                    <label>New Password: </label>
                    <div className="input-wrapper-n">
                        <input
                            type={showPassword.field2 ? 'text': 'password'}
                            placeholder="Password"
                            value={newPassword.newPassword}
                            onChange={(e) => onPasswordChange(e.target.value)}
                        />
                        <FontAwesomeIcon icon={showPassword.field2 ? faEyeSlash : faEye} className="password-icon" onClick={(e) => {setShowPassword({...showPassword, field2: !showPassword.field2})}}/>
                    </div>
                </div>

                <div className="password-criteria">
                    <p>Password must:</p>
                    <ul>
                        <li className={passwordValidations.isLongEnough ? "valid" : ""}>
                            Be at least 8 characters long
                        </li>
                        <li className={passwordValidations.hasUpper ? "valid" : ""}>
                            Contain an uppercase and a lowercase letter (A, z)
                        </li>
                        <li className={passwordValidations.hasNumber ? "valid" : ""}>
                            Contain a number
                        </li>
                        <li className={passwordValidations.hasSpecial ? "valid" : ""}>
                            Contain a special character (!, %, @, #, etc.)
                        </li>
                    </ul>
                </div><br></br>

                <div className="password-input-group">
                    <label>Confirm Password: </label>
                    <div className="input-wrapper-n">
                        <input
                            type={showPassword.field3 ? 'text': 'password'}
                            placeholder="Password"
                            value={newPassword.confirmPassword}
                            onChange={(e) => onConfirmPasswordChange(e.target.value)}
                        />
                        <FontAwesomeIcon icon={showPassword.field3 ? faEyeSlash : faEye} className="password-icon" onClick={(e) => {setShowPassword({...showPassword, field3: !showPassword.field3})}}/>
                    </div>
                    {!passwordsMatch && newPassword.confirmPassword && (
                        <p className="password-mismatch">Passwords do not match</p>
                    )}
                </div>

                <div className="password-input-group">
                            <button type="submit" className="reset-btn">
                                Reset password
                            </button>
                </div>
            </form>
        )
    }

    return user.employeeID && (
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
                <div className='contentForm'>
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

                    {/* <div className='promotionsWrapper'> */}
                    <div className="admin-setting-wrapper">
                        <aside className="profile-sidebar-e">
                        {/* <img src={(activeUser.userData && activeUser.userData.profile_picture) || defaultImg} alt="Profile" className='profile-picture'/> */}
                            <label htmlFor='profile-image-e' className='profile-picture-e'>
                                <img src={(activeUser.userData && activeUser.userData.profile_picture) || defaultImg} alt="Profile" className='profile-picture-e'/>
                            </label>
                            {!activeTab && enableEdit && 
                            (   <div className='choose-pic-button'>
                                    <input
                                        type='file'
                                        id='admin-profile-image'
                                        name='newImg'
                                        accept='.jpeg, .png, .jpg'
                                        onChange={(e) => handleImageUpload(e)}
                                    />
                                </div>)}
                            <h2>{activeUser.userData && activeUser.userData.name}</h2>
                            <p>{activeUser.userData && activeUser.userPosition}</p>
                            {!activeTab && !enableEdit && <button className="edit-profile-btn" onClick={() => setEnableEdit(true)}>Edit Profile</button>}
                            {!activeTab && enableEdit && <button className="edit-profile-btn" onClick={() => handleEditSubmit(true)}>Update Profile</button>}<br></br>
                            {!activeTab && enableEdit && <button className="cancel-profile-btn" onClick={() => handleEditSubmit(false)}>Cancel</button>}
                        </aside>
                        <main className="profile-main-e">
                            <section className="profile-section-e">
                            <div className="profile-navbar-e">
                                {tabs.map((tab, index) => (
                                    <button key={index} className={`nav-item ${index === activeTab ? "active" : ""}`} onClick={(e) => handleItemClick(index, e)}>
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className='profile-e-body'>
                                {!activeTab && myProfile()}
                                {activeTab == 1 && changePassword()}
                                {activeTab == 2 && reqChangeSecurityImg()}
                            </div>
                            </section>
                        </main>
                        </div>
                    </div>
                {/* </div> */}
            </div>
        </div>
    )
}