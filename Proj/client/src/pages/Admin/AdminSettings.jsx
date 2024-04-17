import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faFileArrowDown, faFileArrowUp, faStreetView, faGear, faChartLine, faBuilding, faUser, faFileLines, faTriangleExclamation, faEye, faEyeSlash, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import './AdminSettings.css';
import './fonts.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import defaultImg from '../img/profile-default.svg'
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
import { useUserContext } from '../../hooks/useUserContext';
import { useLogout } from '../../hooks/useLogout';

export default function AdminSettings() {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [enableEdit, setEnableEdit] = useState(false);
    const [newPassword, setNewPassword] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const { logout } = useLogout()
    
    const user = JSON.parse(localStorage.getItem('user'));

    const [activeUser, setActiveUser] = useState(JSON.parse(localStorage.getItem('user')));

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

    const { authenticatedUser, no, path, dispatch } = useUserContext();

    useEffect(() => {
        dispatch({type: 'LOGIN', payload: user, no: 2, path: location.pathname})
        localStorage.setItem('path' ,JSON.stringify(location.pathname))
        document.title = 'Settings'
    }, [])

    const menuItems = [
        { name: "Employee Development", icon: faHouse, margin: 0, path: "/dashboard" },
        { name: "Assess Feedback", icon: faFileArrowDown, margin: 12, path: "/admin_feedback" },
        { name: "Create Assessment", icon: faFileArrowUp, margin: 10, path: "/admin_feedback/create_assessment" },
        { name: "Employee Data", icon: faStreetView, margin: 3, path: "/employee_data" },
        { name: "Model Tuning", icon: faChartLine, margin: 5, path: "/model_tuning" },
        { name: "Settings", icon: faGear, margin: 5, path: "/admin_settings" },
    ];

    const isActive = (path) => {
        return location.pathname === path; // Check if the current location matches the path
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

    const tabs = ["My Profile", "Change Password", "Change Security Image"];

    const handleMenuItemClick = (path, e) => {
        e.preventDefault()
        navigate(path, { state: { userInfo: user }}); 
    };

    const handleEditSubmit = (flag) => {
        setEnableEdit(false)
        if (flag) {
            updateProfileProfile()
        } else {
            setActiveUser(user)
        }
    }

    const handleImageUpload = async (e) => {
        const img = e.target.files[0]
        const base64 = await convertToBase64(img)
        setActiveUser({...activeUser, profile_picture: base64})
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

    const updateProfileProfile = async () => {
        try {
            const resp = await axios.post('/updateAdminPic', {
                adminID: user.adminID,
                profile_picture: activeUser.profile_picture
            })
            if (resp.error) {
                toast.error(resp.error)
                setActiveUser(user)
            } else {
                toast.success('Profile picture successfully updated')
                localStorage.setItem('user', JSON.stringify(activeUser))
                user.profile_picture = activeUser.profile_picture
            }
        } catch (err) {
            console.log(err)
        }
    }

    const myProfile = () => {
        return (
            <div className='admin-profile-box'>
                <div className='admin-profile-input-box'>
                    <label for="adminID">Admin ID</label>
                    <input 
                        type='text'
                        value={activeUser.adminID}
                        disabled={true}
                    />
                </div>

                <div className='admin-profile-input-box'>
                    <label for="email">Email</label>
                    <input 
                        type='text'
                        value={activeUser.email}
                        disabled={true}
                    />
                </div>

                <div className='admin-profile-input-box'>
                    <label for="contactNum">Contact No.</label>
                    <input 
                        type='text'
                        value={activeUser.contactNumber}
                        disabled={true}
                    />
                </div>

                <div className='admin-profile-input-box'>
                    <label for="gender">Gender</label>
                    <input 
                        type='text'
                        value={activeUser.gender}
                        disabled={true}
                    />
                </div>
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
            const { data } = await axios.post("/changeAdminPassword", {
                adminID: activeUser.adminID,
                password: newPassword.currentPassword,
                samePassword: newPassword.confirmPassword
            });
            if (data.error) {
                toast.error(data.error);
            } else {
                user.password = newPassword.confirmPassword
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

    const changePassword = () => {
        return (
            <form onSubmit={(e) => reqChangePwd(e)}>
                <div class="admin-password-input-group">
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

                <div class="admin-password-input-group">
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

                <div class="admin-password-input-group">
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

                <div class="password-input-group">
                            <button type="submit" class="reset-btn">
                                Reset password
                            </button>
                </div>
            </form>
        )
    }

    const reqChangeSecurityImg = () => {
        return (
            <form onSubmit={(e) => forwardImgReq(e)}>
                <div className="security-image-selection">
                    <p>Select your current security image </p>
                    <div className="admin-security-images">
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
                    <div className="admin-security-images">
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
                    <div className="admin-security-images">
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
                    <div className="admin-security-images">
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
                <div class="password-input-group">
                            <button type="submit" class="reset-btn">
                                Reset Security Image
                            </button>
                </div>
            </form>
        )
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

        if (securityImg.currentImg === securityImg.newImg) {
            toast.error('New security image must be different')
            return
        }

        try {
            const { data } = await axios.post("/changeAdminSecurityImage", {
                adminID: activeUser.adminID,
                currentImg: securityImg.currentImg,
                newImg: securityImg.newImg
            });
            if (data.error) {
                toast.error(data.error);
                setRandomizedImages(sequenceImg([...imgSources]));
            } else {
                user.two_factor_answer = securityImg.newImg
                setSecurityImg({currentImg: '', newImg: ''})
                setRandomizedImages(sequenceImg([...imgSources]));
                toast.success("Security Image Successfully Updated");
            }
        } catch (error) {
            console.log(error)
        }
    }

    return activeUser && (
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

                    <div className='admin-setting-wrapper'>
                        <aside className='admin-setting-sidebar'>
                            <label htmlFor='profile-image-e' className='admin-profile-picture-e'>
                                <img src={(activeUser.profile_picture) || defaultImg} alt="Profile" className='admin-profile-picture-e'/>
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
                            <h2>{activeUser && activeUser.name}</h2>
                            {!activeTab && !enableEdit && <button class="edit-profile-btn" onClick={() => setEnableEdit(true)}>Edit Profile Profile</button>}
                            {!activeTab && enableEdit && <button class="edit-profile-btn" onClick={() => handleEditSubmit(true)}>Save Changes</button>}<br></br>
                            {!activeTab && enableEdit && <button class="cancel-profile-btn" onClick={() => handleEditSubmit(false)}>Cancel</button>}
                        </aside>
                        <main class="admin-profile-main-e">
                            <section class="admin-profile-section-e">
                                <div className="admin-profile-navbar-e">
                                    {tabs.map((tab, index) => (
                                        <button key={index} className={`nav-item ${index === activeTab ? "active" : ""}`} onClick={(e) => handleItemClick(index, e)}>
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            <div class='admin-profile-e-body'>
                                {!activeTab && myProfile()}
                                {activeTab == 1 && changePassword()}
                                {activeTab == 2 && reqChangeSecurityImg()}
                            </div>
                            </section>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    )
}