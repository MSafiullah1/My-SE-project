import {Link} from 'react-router-dom'
import React from 'react'
import './Navbar.css'

export default function Navbar() {
    return (
        <nav>
            <Link to='/'>Home   </Link>
            <Link to='/signup'>Sign up  </Link>
            <Link to='/login'>Login  </Link>
        </nav>
    )
}