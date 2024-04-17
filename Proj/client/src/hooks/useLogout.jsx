import { useNavigate } from "react-router-dom"
import { useUserContext } from "./useUserContext"

export const useLogout = () => {
    const { dispatch } = useUserContext()
    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('path')
        dispatch({type: 'LOGOUT'})
        navigate('/logout')
    }

    return { logout }
}