# Succession Planning Software Project

Welcome to the **Succession Planning Software Project**. This innovative software is designed to assist managers in monitoring employee performance, tracking promotions, and facilitating efficient talent development. By focusing on merit-based evaluations, our software aims to eliminate hidden biases, ensuring a fair and transparent process for all employees. The ultimate goal is to strategically fill leadership gaps based on each employee's domain expertise, thereby minimizing disruptions and maximizing organizational throughput.

## Features

Our software comes packed with a robust set of features to enhance user experience and management efficiency:

- **User Registration**: Easy sign-up process for new users.
- **User Login**: Secure access for returning users.
- **Admin Dashboard**: A comprehensive overview for administrators to manage operations effectively.
- **Employee Dashboard**: Personalized dashboard for employees to track their progress and updates.
- **View Employee Information (Admin)**: Allows admins to view detailed profiles of employees.
- **View feedback form (Employee)**: Allows employees to give their suggestions and opinions about the course and workshops they have taken.
- **About the Portal**: Information about the software and its benefits.
- **Two-Factor Authorization**: An extra layer of security for user accounts.
- **Encryption**: Protects sensitive data through advanced encryption methods.
- **User Authentication**: Verifies the identity of first-time users efficiently.
- **Feedback Form for Courses and Workshops**: Enables employees to provide feedback directly through their dashboard.
- **Role-Based Access Control**: Ensures users have access only to the features and information relevant to their role.
- **Log out**: Ensures employees log out of their account successfully.

### Delighters

- **Forgot Password**: Recovery options for users who have forgotten their passwords.
- **Forgot Security Image**: Additional recovery option for enhanced security.

## Installation Guide

### Cloning the Repository

1. Open your terminal in VSCode.
2. Clone the repository with the following command: `git clone [repository URL]`

### Setting Up the Environment

After cloning the repository, you will find a folder named `proj` containing two subfolders: `client` and `server`.

1. Open two separate terminals: one for the client and one for the server.
2. In both terminals, run `npm i` to install all necessary Node.js modules.
3. **Important**: Run `npm install bcrypt` to ensure encryption functionalities are properly set up.

### Running the Software

1. On the server side, execute `npm start` to launch the server.
2. On the client side, run `npm run dev` to load the website.
3. Navigate to the website's login page to access the software.

## How It Works

- **For Existing Users**: The login page facilitates access for already registered employees and admins. Admins are redirected to their dashboard, while employees access their personalized dashboard upon login, maintaining strict role-based access control.
- **For New Employees**: Admins add new employees by entering their name, employee ID, and position. New employees can then sign up using their unique employee ID, which retrieves their name and allows them to complete their profile.

Stay tuned for further updates as we continue to enhance and expand our project!
