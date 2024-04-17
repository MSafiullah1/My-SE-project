import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './About.css';
import { useUserContext } from '../../hooks/useUserContext';

export default function AboutEmployee() {

	const location = useLocation();
	const navigate = useNavigate();
	const user = JSON.parse(localStorage.getItem('user'));
	const { authenticatedUser, no, dispatch } = useUserContext()


	const handleMenuItemClick = (path, e) => {
		e.preventDefault()
		navigate(path, { state: { userInfo: user } });
	};

	useEffect(() => {
		document.title = 'About'
		dispatch({ type: 'LOGIN', payload: user, no: 1, path: location.pathname })
		localStorage.setItem('path', JSON.stringify(location.pathname))
	}, [])

	return (
		<div className="about-container">
			<button className='back-arrow' onClick={(e) => handleMenuItemClick('/employeeDashboard', e)}>Go back</button>
			<div>
				<h1>About Us</h1>
				<p>DevsInc is a global software development and consultancy company which provides low-cost quality software services to customers worldwide. We also do long terms strategic alliances with companies, software development firms and individuals for offering our software services. Our prime goal is to combine creativity and experience to develop and deliver quality information solutions.
					We are dedicated to produce a new generation of products and services. Our most valuable assets are our experience, understanding of specific industry workflows, processes and our expertise in developing technology solutions that ready to face the future ahead.</p>
				<br></br>
				<h1>Terms and Conditions</h1>
				<p>Please read these terms and conditions carefully before using our website.</p>
				<br></br>
				<h2>1. Acceptance of Terms</h2>
				<p>By accessing or using the website, you agree to be bound by these terms and conditions. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
				<br></br>
				<h2>2. Use License</h2>
				<p>Permission is granted to temporarily download one copy of the materials (information or software) on the website for personal, non-commercial transitory viewing only.</p>
				<br></br>
				<h2>3. Disclaimer</h2>
				<p>The materials on the website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
				<br></br>
				<h1>Privacy Policy</h1>
				<p>This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our website.</p>
				<br></br>
				<h2>Personal Information We Collect</h2>
				<p>When you visit the site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the site, we may collect information about the individual web pages or products that you view, what websites or search terms referred you to the site, and information about how you interact with the site.</p>
				<br></br>
				<h2>Sharing Your Personal Information</h2>
				<p>We may share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use Google Analytics to help us understand how our customers use the site -- you can read more about how Google uses your Personal Information <a href="https://www.google.com/intl/en/policies/privacy/">here</a>.</p>
				<p>We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.</p>
				<br></br>
				<h2>Contact Us</h2>
				<p>For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by using the details provided below:</p>
				<p><strong><u>Mail:</u></strong> Cs Lounge, SSE, Lums</p>
				<p><strong><u>Email:</u></strong>  25100079@lums.edu.pk</p>
				<p><strong><u>Contact Number:</u></strong>  042-00001111</p>
				<p>Copyright © 2024, Succession Planning Portal</p>
			</div>
		</div>
	);
}