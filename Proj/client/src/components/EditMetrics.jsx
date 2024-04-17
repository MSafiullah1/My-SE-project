import { useEffect, useState } from 'react'
import './EditMetrics.css'
import toast from 'react-hot-toast'
import axios from 'axios'

export default function EditMetrics(props) {
    const userData = props.user
    const [metrics, setMetrics] = useState({
        task_completion_rate: userData.task_completion_rate,
        attendance_rate: userData.attendance_rate,
        punctuality: userData.punctuality,
        efficiency: userData.efficiency,
        professionalism: userData.professionalism,
        collaborations: userData.collaboration,
        leadership: userData.leadership
    })

    const handleClick = async () => {
        try {
            const data = await axios.post('/setMetrics', {
                empID: userData.employeeID,
                metrics
            })
            if (data.error) {
                toast.error(data.error)
            } else {
                toast.success(userData.name + "'s perfomance metrics successfully updated")
                props.setModal(false)
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div class="metrics-wrapper">
            <h1>{userData.name}</h1>
            <h3>Task Completion Rate: {metrics.task_completion_rate}</h3>
            <div class="metrics-container">
                <input 
                    type="range" 
                    min="0" max="1" step='0.001' 
                    value={metrics.task_completion_rate} 
                    class="metric-slider" 
                    id="myRange"
                    onChange={(e) => setMetrics({...metrics, task_completion_rate: e.target.value})}
                />
            </div>

            <h3>Attendance Rate: {metrics.attendance_rate}</h3>
            <div class="metrics-container">
                <input 
                    type="range" 
                    min="0" max="1" step='0.001' 
                    value={metrics.attendance_rate} 
                    class="metric-slider" 
                    id="myRange"
                    onChange={(e) => setMetrics({...metrics, attendance_rate: e.target.value})}
                />
            </div>

            <h3>Punctuality: {metrics.punctuality}</h3>
            <div class="metrics-container">
                <input 
                    type="range" 
                    min="0" max="1" step='0.001' 
                    value={metrics.punctuality} 
                    class="metric-slider" 
                    id="myRange"
                    onChange={(e) => setMetrics({...metrics, punctuality: e.target.value})}
                />
            </div>

            <h3>Efficiency: {metrics.efficiency}</h3>
            <div class="metrics-container">
                <input 
                    type="range" 
                    min="0" max="1" step='0.001' 
                    value={metrics.efficiency} 
                    class="metric-slider" 
                    id="myRange"
                    onChange={(e) => setMetrics({...metrics, efficiency: e.target.value})}
                />
            </div>    

            <h3>Professionalism: {metrics.professionalism}</h3>
            <div class="metrics-container">
                <input 
                    type="range" 
                    min="0" max="1" step='0.001' 
                    value={metrics.professionalism} 
                    class="metric-slider" 
                    id="myRange"
                    onChange={(e) => setMetrics({...metrics, professionalism: e.target.value})}
                />
            </div>     

            <h3>Collaboration: {metrics.collaborations}</h3>
            <div class="metrics-container">
                <input 
                    type="range" 
                    min="0" max="1" step='0.001' 
                    value={metrics.collaborations} 
                    class="metric-slider" 
                    id="myRange"
                    onChange={(e) => setMetrics({...metrics, collaborations: e.target.value})}
                />
            </div> 

            <h3>Leadership: {metrics.leadership}</h3>
            <div class="metrics-container">
                <input 
                    type="range" 
                    min="0" max="1" step='0.001' 
                    value={metrics.leadership} 
                    class="metric-slider" 
                    id="myRange"
                    onChange={(e) => setMetrics({...metrics, leadership: e.target.value})}
                />
            </div> 

            <button class="save-button-metric" onClick={handleClick}>Update</button>
        </div>
    )
}