import React, { useState } from 'react';
import './SmallBox.css';
import { toast } from "react-hot-toast";

function SmallBox(props) {
    const [currentUser, setCurrentUser] = useState(props.user)
    const [isEmptyField, setIsEmptyField] = useState(true)

    if (props.type === 'About') {
        return ( 
            <div className="small-box">
                <h2 className="small-box-heading">{props.type}</h2>
                <input 
                    type="text" 
                    value={currentUser.about} 
                    onChange={(e) => setCurrentUser({...currentUser, about: e.target.value})} 
                    className="small-box-input-about" 
                    placeholder="Type here..."
                />
                <div className='save-button-class'>
                    <button onClick={() => {props.update(currentUser); props.close({...props.editInfo, about: false})}}>Save Changes</button>
                    <span className='cancel-button-class'>    
                        <button onClick={() => {props.close({...props.editInfo, about: false})}}>Cancel</button>
                    </span>
                </div>
            </div>
        )
    } else if (props.type === 'Skills') {
        return (
            <div className='small-box'>
                <h2 className="small-box-heading">{props.type}</h2>
                {currentUser.skills.map((val, index) => (
                    <div key={index} className={isEmptyField ? "list-input-err" : "list-input"}>
                        <input
                            type="text"
                            placeholder={`Skill ${index + 1}`}
                            value={val}
                            required
                            onChange={(e) => {
                                const newSkills = [...currentUser.skills];
                                newSkills[index] = e.target.value;
                                setCurrentUser({
                                    ...currentUser,
                                    skills: newSkills,
                                });
                            }}
                        />
                        <button
                            type="button"
                            className="remove-btn"
                            onClick={() => {
                                const newSkills = [...currentUser.skills];
                                newSkills.splice(index, 1);
                                setCurrentUser({
                                    ...currentUser,
                                    skills: newSkills,
                                });
                            }}
                        >
                            -
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="add-btn"
                    onClick={() =>
                        setCurrentUser({
                            ...currentUser,
                            skills: [...currentUser.skills, ''],
                        })
                    }
                >
                    +
                </button><br></br>
                <div className='save-button-class'>    
                    <button onClick={() => {props.update(currentUser); props.close({...props.editInfo, skills: false})}}>Save Changes</button>
                    <span className='cancel-button-class'>    
                        <button onClick={() => {props.close({...props.editInfo, skills: false})}}>Cancel</button>
                    </span>
                </div>
            </div>
        )
    } else if (props.type === 'Courses Taken') {
        return (
            <div className="small-box">
                <h2 className="small-box-heading">{props.type}</h2>
                {currentUser.courses_taken.map((val, index) => (
                    <div key={index} className="list-input">
                        <input
                            type="text"
                            placeholder={`Course ${index + 1}`}
                            value={val}
                            onChange={(e) => {
                                const new_courses_taken = [...currentUser.courses_taken];
                                new_courses_taken[index] = e.target.value;
                                setCurrentUser({
                                    ...currentUser,
                                    courses_taken: new_courses_taken,
                                });
                            }}
                        />
                        <button
                            type="button"
                            className="remove-btn"
                            onClick={() => {
                                const new_courses_taken = [...currentUser.courses_taken];
                                new_courses_taken.splice(index, 1);
                                setCurrentUser({
                                    ...currentUser,
                                    courses_taken: new_courses_taken,
                                });
                            }}
                        >
                            -
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="add-btn"
                    onClick={() =>
                        setCurrentUser({
                            ...currentUser,
                            courses_taken: [...currentUser.courses_taken, ""],
                        })
                    }
                >
                    +
                </button><br></br>
                <div className='save-button-class'>
                    <button onClick={() => {props.update(currentUser); props.close({...props.editInfo, courses: false})}}>Save Changes</button>
                    <span className='cancel-button-class'>   
                        <button onClick={() => {props.close({...props.editInfo, courses: false})}}>Cancel</button>
                    </span>
                </div>
            </div>
        )
    } else if (props.type === 'Education') {
        return (
            <div className="small-box">
                <h2 className="small-box-heading">{props.type}</h2>
                {currentUser.education.map((val, index) => (
                    <div key={index} className="list-input">
                        <input
                            type="text"
                            placeholder={`Education ${index + 1}`}
                            value={val}
                            onChange={(e) => {
                                const new_education = [...currentUser.education];
                                new_education[index] = e.target.value;
                                setCurrentUser({
                                    ...currentUser,
                                    education: new_education,
                                });
                            }}
                        />
                        <button
                            type="button"
                            className="remove-btn"
                            onClick={() => {
                                const new_education = [...currentUser.education];
                                new_education.splice(index, 1);
                                setCurrentUser({
                                    ...currentUser,
                                    education: new_education,
                                });
                            }}
                        >
                            -
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="add-btn"
                    onClick={() =>
                        setCurrentUser({
                            ...currentUser,
                            education: [...currentUser.education, ""],
                        })
                    }
                >
                    +
                </button><br></br>
                <div className='save-button-class'>
                    <button onClick={() => {props.update(currentUser); props.close({...props.editInfo, education: false})}}>Save Changes</button>
                    <span className='cancel-button-class'>
                        <button onClick={() => {props.close({...props.editInfo, education: false})}}>Cancel</button>
                    </span>
                </div>
            </div>
        )
    } else if (props.type === 'Workshops Taken') {
        return (
            <div className="small-box">
                <h2 className="small-box-heading">{props.type}</h2>
                {currentUser.workshops_taken.map((val, index) => (
                    <div key={index} className="list-input">
                        <input
                            type="text"
                            placeholder={`Workshop ${index + 1}`}
                            value={val}
                            onChange={(e) => {
                                const new_workshops_taken = [...currentUser.workshops_taken];
                                new_workshops_taken[index] = e.target.value;
                                setCurrentUser({
                                    ...currentUser,
                                    workshops_taken: new_workshops_taken,
                                });
                            }}
                        />
                        <button
                            type="button"
                            className="remove-btn"
                            onClick={() => {
                                const new_workshops_taken = [...currentUser.workshops_taken];
                                new_workshops_taken.splice(index, 1);
                                setCurrentUser({
                                    ...currentUser,
                                    workshops_taken: new_workshops_taken,
                                });
                            }}
                        >
                            -
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="add-btn"
                    onClick={() =>
                        setCurrentUser({
                            ...currentUser,
                            workshops_taken: [...currentUser.workshops_taken, ""],
                        })
                    }
                >
                    +
                </button><br></br>
                <div className='save-button-class'>
                    <button onClick={() => {props.update(currentUser); props.close({...props.editInfo, workshops: false})}}>Save Changes</button>
                    <span className='cancel-button-class'>
                        <button onClick={() => {props.close({...props.editInfo, workshops: false})}}>Cancel</button>
                    </span>
                </div>
            </div>
        )
    } else if (props.type === 'Awards') {
        return (
            <div className="small-box">
                <h2 className="small-box-heading">{props.type}</h2>
                {currentUser.awards.map((val, index) => (
                    <div key={index} className="list-input">
                        <input
                            type="text"
                            placeholder={`Award ${index + 1}`}
                            value={val}
                            onChange={(e) => {
                                const new_awards = [...currentUser.awards];
                                new_awards[index] = e.target.value;
                                setCurrentUser({
                                    ...currentUser,
                                    awards: new_awards,
                                });
                            }}
                        />
                        <button
                            type="button"
                            className="remove-btn"
                            onClick={() => {
                                const new_awards = [...currentUser.awards];
                                new_awards.splice(index, 1);
                                setCurrentUser({
                                    ...currentUser,
                                    awards: new_awards,
                                });
                            }}
                        >
                            -
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="add-btn"
                    onClick={() =>
                        setCurrentUser({
                            ...currentUser,
                            awards: [...currentUser.awards, ""],
                        })
                    }
                >
                    +
                </button><br></br>
                <div className='save-button-class'>
                <button onClick={() => {props.update(currentUser); props.close({...props.editInfo, awards: false})}}>Save Changes</button>
                <span className='cancel-button-class'>
                    <button onClick={() => {props.close({...props.editInfo, awards: false})}}>Cancel</button>
                </span>
                </div>
            </div>
        )
    } else if (props.type === 'Job History') {
        return (
            <div className="small-box">
                <h2 className="small-box-heading">{props.type}</h2>
                {currentUser.job_history.map((val, index) => (
                    <div key={index} className="list-input">
                        <input
                            type="text"
                            placeholder={`Job ${index + 1}`}
                            value={val}
                            onChange={(e) => {
                                const new_job_history = [...currentUser.job_history];
                                new_job_history[index] = e.target.value;
                                setCurrentUser({
                                    ...currentUser,
                                    job_history: new_job_history,
                                });
                            }}
                        />
                        <button
                            type="button"
                            className="remove-btn"
                            onClick={() => {
                                const new_job_history = [...currentUser.job_history];
                                new_job_history.splice(index, 1);
                                setCurrentUser({
                                    ...currentUser,
                                    job_history: new_job_history,
                                });
                            }}
                        >
                            -
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="add-btn"
                    onClick={() =>
                        setCurrentUser({
                            ...currentUser,
                            job_history: [...currentUser.job_history, ""],
                        })
                    }
                >
                    +
                </button><br></br>
                <div className='save-button-class'>
                    <button onClick={() => {props.update(currentUser); props.close({...props.editInfo, history: false})}}>Save Changes</button>
                    <span className='cancel-button-class'>
                        <button onClick={() => props.close({...props.editInfo, history: false})}>Cancel</button>
                    </span>
                </div>
            </div>
        )
    }
}

export default SmallBox;
