import { faChevronDown, faChevronUp, faGear } from '@fortawesome/free-solid-svg-icons'
import './ViewPosition.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react'
import img from './pk1.webp'

function ViewPosition(props) {
    const position = props.position
    const title = props.title
    const workshops = props.workshops
    const courses = props.courses
    const [showBox, setShowBox] = useState({skills: false, courses: false, workshops:false})

    const mapCourse = (courseID) => {
        const courseSelected = courses.find(c => c.courseID === courseID);
        return courseSelected ? courseSelected.title : 'Course not found';
    }

    const mapWorkshops = (workshopID) => {
        const workshopSelected = workshops.find(c => c.workshopID === workshopID);
        return workshopSelected ? workshopSelected.title : 'Workshop not found';
    }

    return (
        <div className="view-position-wrapper">
            <h1>Position: {title}</h1>
            <div className='position-accordion'>
                <button className='position-accordion-btn' onClick={(e) => {setShowBox({...showBox, skills: !showBox.skills})}}>
                    <span>Required Skills</span>
                    <span><FontAwesomeIcon icon={showBox.courses ? faChevronUp : faChevronDown} /></span>
                </button>
                <div className={showBox.skills ? 'panel-show' : 'panel'}>
                    {position.required_skills.map((val) => {
                        return (
                            <p>{val}</p>
                        )
                    })}
                </div>
            </div>

            <div className='position-accordion'>
                <button className='position-accordion-btn' onClick={(e) => {setShowBox({...showBox, courses: !showBox.courses})}}>
                    <span>Recommended Courses</span>
                    <span><FontAwesomeIcon icon={showBox.courses ? faChevronUp : faChevronDown} /></span>
                </button>
                <div className={showBox.courses ? 'panel-show' : 'panel'}>
                    {position.courses.map((val) => {
                        return (
                            <p>{mapCourse(val)}</p>
                        )
                    })}
                </div>
            </div>

            <div className='position-accordion'>
                <button className='position-accordion-btn' onClick={(e) => {setShowBox({...showBox, workshops: !showBox.workshops})}}>
                    <span>Recommended Workshops</span>
                    <span><FontAwesomeIcon icon={showBox.workshops ? faChevronUp : faChevronDown} /></span>
                </button>
                <div className={showBox.workshops ? 'panel-show' : 'panel'}>
                    {position.workshops.map((val) => {
                        return (
                            <p>{mapWorkshops(val)}</p>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ViewPosition