import {createContext, useState, useEffect, useReducer} from 'react'
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext({})

export const UserReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { authenticatedUser: action.payload, no: action.no, path: action.path }
        case 'LOGOUT':
            return { authenticatedUser: null, no: 0, path: '/' }
        default:
            return state
    }
}

export function UserContextProvider({children}) {

    const [state, dispatch] = useReducer(UserReducer, {
        authenticatedUser: null,
        no: 0,
        path: ''
    })

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'))
        const ret_path = JSON.parse(localStorage.getItem('path'))

        console.log("Retrieved user data from localStorage:", user);
        if (user) {
            if (user.adminID)
                dispatch({ type: 'LOGIN', payload: user, no: 2, path: ret_path })
            else 
                dispatch({ type: 'LOGIN', payload: user, no: 1, path: ret_path })
        }
    }, [])

    console.log('UserContext state:', state)

    return (
        <UserContext.Provider value={{ ...state, dispatch }}>
            {children}
        </UserContext.Provider>
    )
}