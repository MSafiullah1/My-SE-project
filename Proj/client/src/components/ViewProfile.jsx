import './ViewProfile.css'
import { useState, useEffect } from 'react';
import axios from 'axios'
import defaultImg from '../pages/img/profile-default.svg'

export default function ViewProfile(props) {
    const userData = props.user

    const [positionTitles, setPositionTitles] = useState([]);
    useEffect(() => {
        axios.get('/dashboard-position-titles')
            .then(res => {
                setPositionTitles(res.data);
                console.log(res.data);
            })
            .catch(err => {
                console.error(err);
                toast.error('Failed to fetch position titles');
            });
    }, []);

    // function to convert positionID to position title
    const getPositionTitle = (positionID) => {
        const position = positionTitles.find(position => position.positionID === positionID);
        return position ? position.title : "Unknown";
    };
    
    return (
        <div class="profile-container">
            <aside class="profile-sidebar">
            {/* <img src={(activeUser.userData && activeUser.userData.profile_picture) || defaultImg} alt="Profile" className='profile-picture'/> */}
                <label htmlFor='profile-image' className='profile-picture'>
                    <img src={(userData && userData.profile_picture) || defaultImg} alt="Profile" className='profile-picture'/>
                </label>
                {/* {<input
                    type='file'
                    id='profile-image'
                    name='newImg'
                    accept='.jpeg, .png, .jpg'
                    style={{ display: 'none' }} // Hide the actual input element
                />} */}
                <h2>{userData && userData.name}</h2>
                <p>{userData && getPositionTitle(userData.positionID)}</p>
            </aside>
            <main class="profile-main">
                <section class="profile-section">
                    <div class='profile-body'>
                        <p>
                            <h3>About Me:</h3><br/> 
                            {userData && userData.about}
                        </p><br></br>
                        <p>
                            <h3>Skills:</h3><br/>
                            {userData && userData.skills.map((val, index) => {
                                return <li key={index}>{val}</li>
                            })}
                        </p><br></br>
                        <p>
                            <h3>Courses Taken:</h3><br/>
                            {userData && userData.courses_taken.map((val, index) => {
                                return <li key={index}>{val}</li>
                            })}
                        </p><br></br>
                        <p>
                            <h3>Education:</h3><br/>
                            {userData && userData.education.map((val, index) => {
                                return <li key={index}>{val}</li>
                            })}
                        </p><br></br>
                        <p>
                            <h3>Workshops Taken:</h3><br/>
                            {userData && userData.workshops_taken.map((val, index) => {
                                return <li key={index}>{val}</li>
                            })}
                        </p><br></br>
                        <p>
                            <h3>Awards:</h3><br/>
                            {userData && userData.awards.map((val, index) => {
                                return <li key={index}>{val}</li>
                            })}
                        </p><br></br>
                        <p>
                            <h3>Job History:</h3><br/>
                            {userData && userData.job_history.map((val, index) => {
                                return <li key={index}>{val}</li>
                            })}
                        </p><br></br>
                    </div>
                </section>
            </main>
        </div>
    )
}