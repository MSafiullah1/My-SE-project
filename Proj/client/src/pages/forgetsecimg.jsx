import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
import './forgetsecimg.css'
// Import images
import img1 from './img/s_img1.png'
import img2 from './img/s_img2.png'
import img3 from './img/s_img3.png'
import img4 from './img/s_img4.png'
import img5 from './img/s_img5.png'
import img6 from './img/s_img6.png'
import img7 from './img/s_img7.png'
import img8 from './img/s_img8.png'
import img9 from './img/s_img9.png'
import img10 from './img/s_img10.png'

export default function ForgetSecurityImage() {
    const navigate = useNavigate()
    const [data, setData] = useState({
        empID: '',
        password: '',
        secQ: '',
        secA: '',
        newImage: 0
    })
    const [stage, setStage] = useState(1) // 1 for security question, 2 for selecting image

    const imgSources = [[img1, 1], [img2, 2], [img3, 3], [img4, 4], [img5, 5], [img6, 6], [img7, 7], [img8, 8], [img9, 9], [img10, 10]]
    const [randomizedImages, setRandomizedImages] = useState(imgSources)

    // Function to handle the retrieval of the security question
    const retrieveSecurityQuestion = async () => {
        try {
            const resp = await axios.post('/retrieveSecurityQuestion', { empID: data.empID })
            if (resp.data.error) {
                toast.error(resp.data.error)
            } else {
                console.log(resp.data);
                setData({ ...data, secQ: resp.data })
                toast.success('Security question retrieved successfully')
            }
        } catch (error) {
            toast.error('An error occurred while retrieving security question')
            console.error(error)
        }
    }

    // Function to verify security answer and proceed to image selection
    const verifySecurityAnswer = async () => {
        try {
            const resp = await axios.post('/verifySecurityAnswer', {
                empID: data.empID,
                secA: data.secA
            })
            if (resp.data.error) {
                toast.error(resp.data.error)
            } else {
                toast.success('Security answer verified successfully')
                setStage(2) // Proceed to image selection
            }
        } catch (error) {
            toast.error('An error occurred while verifying security answer')
            console.error(error)
        }
    }

    // Function to handle the selection of the new security image
    const selectNewSecurityImage = async (imageId) => {
        try {
            const resp = await axios.post('/resetSecurityImage', {
                empID: data.empID,
                newImage: imageId
            });
            if (resp.data.error) {
                toast.error(resp.data.error);
            } else {
                toast.success('Security image updated successfully');
                navigate('/login');
            }
        } catch (error) {
            toast.error('An error occurred while updating security image');
            console.error(error);
        }
    }

    return (
        <div className="resetImG-container">
            <div className="reset-box">
                <h1>{stage === 1 ? 'Retrieve Security Question' : 'Select New Security Image'}</h1>
                <h3>Verify your identity</h3>
                <form onSubmit={(e) => { e.preventDefault(); stage === 1 ? verifySecurityAnswer() : navigate('/login'); }}>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder='Employee ID'
                            value={data.empID}
                            onChange={(e) => setData({ ...data, empID: e.target.value })}
                            disabled={stage !== 1}
                        />
                        {stage === 1 && <span><FaSearch onClick={retrieveSecurityQuestion} className="search-btn-e"/></span>}
                    </div>
                    {stage === 1 ? (
                        <>
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="Security Question"
                                    value={data.secQ}
                                    disabled={true}
                                    style={{ color: 'grey' }}
                                />
                            </div>
                            <div className="input-group">
                                <input type="text" placeholder='Security Answer' value={data.secA} onChange={(e) => setData({ ...data, secA: e.target.value })} />
                            </div>
                        </>
                    ) : (
                        <div className="security-image-selection">
                            {randomizedImages.map(([src, id]) => (
                                <img
                                    key={id}
                                    src={src}
                                    alt={`Security Icon ${id}`}
                                    className={`security-image ${data.newImage === id ? "selected" : ""}`}
                                    onClick={() => selectNewSecurityImage(id)}
                                />
                            ))}
                        </div>
                    )}
                    <div className="input-group">
                        <button type="submit" className="signup-btn">{stage === 1 ? 'Submit Answer' : 'Update Image'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}