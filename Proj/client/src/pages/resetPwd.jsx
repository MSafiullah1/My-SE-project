import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import './resetPwd.css'
import { useNavigate } from 'react-router-dom'
import { FaSearch } from 'react-icons/fa'
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
import { useUserContext } from '../hooks/useUserContext'


export default function ResetPwd() {
    const navigate = useNavigate()
    const [data, setData] = useState({
        empID: '',
        secQ: '',
        secA: '',
        s_img: 0
    })

    const fetchData = async (e) => {
        const { empID, secQ, secA } = data
        try {
            const resp = await axios.post('/retrieveSecurityQuestion', {
                empID
            })
            if (resp.data.error) {
                toast.error(resp.data.error)
                setData({ ...data, secQ: '' })
                setTimeout(() => setRandomizedImages(sequenceImg([...imgSources])), 0)
            } else {
                toast.success('Security question retrieved successfully')
                setData({ ...data, secQ: resp.data })
            }

        } catch (error) {
            console.log(error)
        }
    }

    const imgSources = [[img1, 1], [img2, 2], [img3, 3], [img4, 4], [img5, 5], [img6, 6], [img7, 7], [img8, 8], [img9, 9], [img10, 10]]
    const [randomizedImages, setRandomizedImages] = useState(imgSources);

    const sequenceImg = (list) => {
        let array = [...list]
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    useEffect(() => {
        setRandomizedImages(sequenceImg([...imgSources]))
    }, [])

    const searchRecord = async () => {
        try {
            const { empID, secQ, secA } = data

            if (empID.trim() == '') {
                toast.error('Employee id missing')
                setTimeout(() => setRandomizedImages(sequenceImg([...imgSources])), 0)
            } else {
                await fetchData(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const resetPassword = async (e) => {
        e.preventDefault()
        const { empID, secQ, secA, s_img } = data
        if (!secQ) {
            toast.error('Error')
            setTimeout(() => setRandomizedImages(sequenceImg([...imgSources])), 0)
            return
        }
        try {
            const { data } = await axios.post('/resetPassword', {
                empID,
                secQ,
                secA,
                s_img
            })
            if (data.error) {
                toast.error(data.error)
                setTimeout(() => setRandomizedImages(sequenceImg([...imgSources])), 0)
            } else {
                setData({})
                toast.success('Success')
                navigate('/resetPasswordFinalStep', { state: { empID: empID } })
            }
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <body>
            <div class="resetPwd-container">
                <div class="reset-box">
                    <h1>Reset your password</h1>
                    <h3>Verify your identity</h3>
                    <form onSubmit={resetPassword}>
                        <div class="input-group">
                            <input type="text" placeholder='Employee ID' value={data.empID} onChange={(e) => setData({ ...data, empID: e.target.value })} />
                            <span><FaSearch onClick={searchRecord} className="search-btn-e"/></span>
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Security Question"
                                value={data.secQ}
                                onChange={(e) => {/* Handle changes if needed*/ }}
                                disabled={true} // This makes the input non-interactive
                                style={{ color: 'grey' }} // This styles the placeholder and value color
                            />
                        </div>

                        <div class="input-group">
                            <input type="text" placeholder='Security Answer' value={data.secA} onChange={(e) => setData({ ...data, secA: e.target.value })} />
                        </div>

                        <div className="security-image-selection">
                            <p>Select security image </p>
                            <div className="security-images">
                                <img src={randomizedImages[0][0]} alt="Security Icon 1" className={`security-image ${data.s_img === randomizedImages[0][1] ? "selected" : ""}`} onClick={(e) => setData({ ...data, s_img: randomizedImages[0][1] })} />
                                <img src={randomizedImages[1][0]} alt="Security Icon 2" className={`security-image ${data.s_img === randomizedImages[1][1] ? "selected" : ""}`} onClick={(e) => setData({ ...data, s_img: randomizedImages[1][1] })} />
                                <img src={randomizedImages[2][0]} alt="Security Icon 3" className={`security-image ${data.s_img === randomizedImages[2][1] ? "selected" : ""}`} onClick={(e) => setData({ ...data, s_img: randomizedImages[2][1] })} />
                                <img src={randomizedImages[3][0]} alt="Security Icon 4" className={`security-image ${data.s_img === randomizedImages[3][1] ? "selected" : ""}`} onClick={(e) => setData({ ...data, s_img: randomizedImages[3][1] })} />
                                <img src={randomizedImages[4][0]} alt="Security Icon 5" className={`security-image ${data.s_img === randomizedImages[4][1] ? "selected" : ""}`} onClick={(e) => setData({ ...data, s_img: randomizedImages[4][1] })} />
                            </div>
                            <div className="security-images">
                                <img src={randomizedImages[5][0]} alt="Security Icon 1" className={`security-image ${data.s_img === randomizedImages[5][1] ? "selected" : ""}`} onClick={(e) => setData({ ...data, s_img: randomizedImages[5][1] })} />
                                <img src={randomizedImages[6][0]} alt="Security Icon 2" className={`security-image ${data.s_img === randomizedImages[6][1] ? "selected" : ""}`} onClick={(e) => setData({ ...data, s_img: randomizedImages[6][1] })} />
                                <img src={randomizedImages[7][0]} alt="Security Icon 3" className={`security-image ${data.s_img === randomizedImages[7][1] ? "selected" : ""}`} onClick={(e) => setData({ ...data, s_img: randomizedImages[7][1] })} />
                                <img src={randomizedImages[8][0]} alt="Security Icon 4" className={`security-image ${data.s_img === randomizedImages[8][1] ? "selected" : ""}`} onClick={(e) => setData({ ...data, s_img: randomizedImages[8][1] })} />
                                <img src={randomizedImages[9][0]} alt="Security Icon 5" className={`security-image ${data.s_img === randomizedImages[9][1] ? "selected" : ""}`} onClick={(e) => setData({ ...data, s_img: randomizedImages[9][1] })} />
                            </div>
                        </div>

                        <div class="input-group">
                            <button type="submit" class="signup-btn">Next</button>
                        </div>

                    </form>
                </div>
            </div>
        </body>

    )
}