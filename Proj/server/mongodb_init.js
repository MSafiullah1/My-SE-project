const mongoose = require('mongoose');
const Employee = require('./models/employee');
const HR_Admin = require('./models/hr_admin')
const Feedback = require('./models/feedback')
const Workshop = require('./models/workshop')
const Complaint = require('./models/complaint')
const Course = require('./models/course')
const Positions = require('./models/positions')
const Assign_Assessment = require('./models/assign_assessment')
const DO_assignment = require('./models/doassignment')
const { hashPassword } = require('./helpers/auth');
const { max } = require('@tensorflow/tfjs');

async function init_db(conn) {
    const db = conn;

    db.once('open', async () => {
        try {
            await Promise.all([
                db.collection('employees').deleteMany(),
                db.collection('hr_admins').deleteMany(),
                db.collection('feedbacks').deleteMany(),
                db.collection('complaints').deleteMany(),
                db.collection('workshops').deleteMany(),
                db.collection('courses').deleteMany(),
                db.collection('positions').deleteMany(),
                db.collection('assessments').deleteMany(),
                db.collection('doassignments').deleteMany()
            ]);
            console.log('Database initialized');
        } catch (err) {
            console.error("Error clearing database:", err);
        }
    });

    try {
        const employeeData = [
            {
                "employeeID": "1001",
                "name": "John Doe",
                "email": "john.doe@example.com",
                "password": await hashPassword("password123"),
                "contactNumber": "123-456-7890",
                // "age": 30,
                "date_of_birth": new Date("1971-04-10"),
                "gender": "Male",
                "positionID": "P001",
                "skills": ["JavaScript", "Node.js", "MongoDB"],
                "security_question": "What is your favorite color?", // for password reset
                "security_answer": "Blue", // for password reset
                "two_factor_answer": "3", // 3 is lightbulb
                "mentor_ID": "",

                "task_completion_rate": 0.85,
                "attendance_rate": 0.95,
                "punctuality": 0.93,
                "efficiency": 0.89,
                "professionalism": 0.97,
                "collaboration": 0.98,
                "leadership": 0.95,

                "job_history": ["Software Engineer at ABC Inc.", "Intern at XYZ Corp."],
                "education": ["Bachelor's in Computer Science"],
                "certifications": ["AWS Certified Developer"],
                "courses_taken": ["Node.js Basics", "MongoDB Basics","Strategic Planning Course","Machine Learning Course", "Agile Development Course","Public Speaking Course"],
                "workshops_taken": ["Leadership Seminar","Financial Management Workshop","Project Management Workshop","Digital Marketing Workshop"],
                "awards": ["Employee of the Month"],
                "profile_picture": "",
                "registered_status": true,
                "about": 'I am king',
                "is_blocked": false,
                "failed_attempts": 0
            },

            {
                "employeeID": "1002",
                "name": "Jane Smith",
                "email": "jane.smith@example.com",
                "password": await hashPassword("securepassword"),
                "contactNumber": "987-654-3210",
                // "age": 28,
                "date_of_birth": new Date("1973-07-15"),
                "gender": "Female",
                "positionID": "P002",
                "skills": ["Python", "Django", "SQL"],
                "security_question": "What is your mother's maiden name?",
                "security_answer": "Johnson",
                "two_factor_answer": "10",
                "mentor_ID": "",
                "task_completion_rate": 0.85,
                "attendance_rate": 0.98,
                "punctuality": 0.99,
                "efficiency": 0.92,
                "professionalism": 0.92,
                "collaboration": 0.99,
                "leadership": 0.99,

                "job_history": ["Data Analyst at XYZ Corp.", "Intern at PQR Ltd."],
                "education": ["Master's in Data Science"],
                "certifications": ["Google Analytics Certified"],
                
                "courses_taken": ["Node.js Basics", "MongoDB Basics","Strategic Planning Course","Machine Learning Course", "Agile Development Course","Public Speaking Course","Digital Marketing Course","Public Speaking Course"],

                "workshops_taken": ["Leadership Seminar","Financial Management Workshop","Project Management Workshop","Digital Marketing Workshop"],
                
                "awards": ["Best Newcomer Award"],
                "profile_picture": "",
                "registered_status": true,
                "is_blocked": true
            },

            {
                "employeeID": "1003",
                "name": "Arbaaz Butt",
                "email": "arbaaz@lums.edu.pk",
                "password": await hashPassword("Abc1234."),
                "contactNumber": "0300-1234567",
                "date_of_birth": new Date("1985-12-25"),
                "gender": "Male",
                "positionID": "P003",
                "skills": ["Financial Management", "Accounting", "Risk Management", "Leadership", "Python"],
                "security_question": "What city were you born in?",
                "security_answer": "Lahore",
                "two_factor_answer": "8",
                "mentor_ID": "",
                "task_completion_rate": 0.98,
                "attendance_rate": 0.99,
                "punctuality": 1,
                "efficiency": 1,
                "professionalism": 1,
                "collaboration": 1,
                "leadership": 1,

                "job_history": ["Intern at Devsinc", "Junior Accountant at Devsinc", "Senior Accountant at Devsinc", "Accounting Manager at Devsinc", "CFO at Devsinc"],
                "education": ["BS in Accounting and Finance", "MBA in Finance"],
                "certifications": ["ACCA", "CFA Level 1", "CIMA"],
                
                "courses_taken": ["Strategic Planning Course","Public Speaking Course","Public Speaking Course","Financial Analysis Course"],

                "workshops_taken": [ "Financial Management Workshop"],

                "awards": ["Employee of the Year", "Best Accountant Award"],
                "profile_picture": "",
                "registered_status": true
            },
            {
                "employeeID": "1004",
                "name": "Abdul Rehman",
                "email": "abdul.rehman@lums.edu.pk",
                "password": await hashPassword("Abc1234."),
                "contactNumber": "0300-2345678",
                "date_of_birth": new Date("1994-11-15"),
                "gender": "Male",
                "positionID": "P005",
                "skills": ["Software Development", "Team Management", "Project Management", "Leadership", "Problem Solving", "Communication", "Teamwork"],
                "security_question": "What is your favorite food?",
                "security_answer": "Biryani",
                "two_factor_answer": "2",
                "mentor_ID": "1003",
                "task_completion_rate": 0.90,
                "attendance_rate": 0.95,

                "punctuality": 0.85,
                "efficiency": 0.78,
                "professionalism": 0.79,
                "collaboration": 0.88,
                "leadership": 0.95,

                "job_history": ["Intern at Devsinc", "Junior Software Developer at Devsinc", "Software Developer at Devsinc", "Senior Software Developer at Devsinc"],
                "education": ["BS in Computer Science"],
                "certifications": ["AWS Certified Developer", "Oracle Certified Professional"],
                "courses_taken": ["Node.js Basics","MongoDB Basics","Python Basics","SEO Course","Public Speaking Course","Financial Analysis Course"],
                "workshops_taken": ["Angular Workshop","Python for Data Analysis Workshop","Digital Marketing Workshop","Leadership Seminar"],
                "awards": ["Employee of the Month", "Best Developer Award"],
                "profile_picture": "",
                "registered_status": true
            },

            {
                "employeeID": "1005",
                "name": "Sara Khan",
                "email": "sara@lums.edu.pk",
                "password": await hashPassword("Abc1234."),
                "contactNumber": "0300-3456789",
                "date_of_birth": new Date("1996-10-20"),
                "gender": "Female",
                "positionID": "P005",
                "skills": ["Software Development", "Problem Solving", "Teamwork", "Leadership"],
                "security_question": "What is your favorite movie?",
                "security_answer": "Inception",
                "two_factor_answer": "7",
                "mentor_ID": "1003",
                "task_completion_rate": 0.80,
                "attendance_rate": 0.90,

                "punctuality": 0.81,
                "efficiency": 0.79,
                "professionalism": 0.82,
                "collaboration": 0.71,
                "leadership": 0.85,

                "job_history": ["Intern at Devsinc", "Junior Software Developer at Devsinc"],
                "education": ["BS in Computer Science"],
                "certifications": ["Microsoft Certified Professional"],
                "courses_taken": ["Node.js Basics","MongoDB Basics","Python Basics","SEO Course","Strategic Planning Course","Public Speaking Course","Financial Analysis Course"],
                "workshops_taken": ["Angular Workshop","Python for Data Analysis Workshop","Digital Marketing Workshop"],
                "awards": ["Employee of the Month"],
                "profile_picture": "",
                "registered_status": true
            },
            {
                "employeeID": "1008",
                "name": "Fatima Jinnah",
                "email": "fatima@lums.edu.pk",
                "password": await hashPassword("Abc1234."),
                "contactNumber": "0300-4567890",
                "date_of_birth": new Date("1997-09-05"),
                "gender": "Female",
                "positionID": "P007",
                "skills": ["UI/UX Design", "Wireframing", "Prototyping", "User Research"],
                "security_question": "What is the name of your first pet?",
                "security_answer": "Tommy",
                "two_factor_answer": "1",
                "mentor_ID": "1002",
                "task_completion_rate": 0.95,
                "attendance_rate": 0.95,

                "punctuality": 0.99,
                "efficiency": 0.98,
                "professionalism": 0.97,
                "collaboration": 0.96,
                "leadership": 0.75,

                "job_history": ["Intern at Devsinc", "Junior UI/UX Designer at Devsinc"],
                "education": ["BS in Computer Science", "MS in HCI"],
                "certifications": ["Adobe Certified Expert"],
                "courses_taken": ["Node.js Basics","MongoDB Basics","Python Basics","SEO Course","Strategic Planning Course","Public Speaking Course","Financial Analysis Course", "UI/UX Design Masterclass","UX Research Course"],
                "workshops_taken": ["Python for Data Analysis Workshop","UI/UX Design Thinking Workshop"],
                "awards": [],
                "profile_picture": "",
                "registered_status": true
            },
            {
                "employeeID": "1010",
                "name": "Ali Zafar",
                "email": "ali.zafar@lums.edu.pk",
                "password": await hashPassword("Abc1234."),
                "contactNumber": "0300-5678901",
                "date_of_birth": new Date("1998-08-10"),
                "gender": "Male",
                "positionID": "P009",
                "skills": ["Data Analysis", "Data Visualization", "SQL", "Python"],
                "security_question": "What is the name of your best friend?",
                "security_answer": "Ahmed",
                "two_factor_answer": "5",
                "mentor_ID": "1008",
                "task_completion_rate": 0.65,
                "attendance_rate": 0.75,

                "punctuality": 0.72,
                "efficiency": 0.68,
                "professionalism": 0.70,
                "collaboration": 0.65,
                "leadership": 0.60,

                "job_history": ["Intern at Devsinc", "Junior Data Analyst at Devsinc"],
                "education": ["BS in Computer Science"],
                "certifications": ["Tableau Certified Professional"],
                "courses_taken": ["Public Speaking Course","Financial Analysis Course", ,"UX Research Course","Data Science Course"],
                "workshops_taken": ["Python for Data Analysis Workshop"],
                "awards": [],
                "profile_picture": "",
                "registered_status": true
            },
            {
                "employeeID": "1011",
                "name": "Pasha Patel",
                "email": "pasha@lums.edu.pk",
                "password": await hashPassword("Abc1234."),
                "contactNumber": "0300-6789012",
                "date_of_birth": new Date("2000-07-15"),
                "gender": "Male",
                "positionID": "P010",
                "skills": ["Technical Support", "Troubleshooting", "Customer Service"],
                "security_question": "What is your favorite book?",
                "security_answer": "The Alchemist",
                "two_factor_answer": "6",
                "mentor_ID": "1010",
                "task_completion_rate": 0.70,
                "attendance_rate": 0.92,

                "punctuality": 0.85,
                "efficiency": 0.73,
                "professionalism": 0.92,
                "collaboration": 0.90,
                "leadership": 0.84,

                "job_history": ["IT Support Specialist at Devsinc"],
                "education": ["BS in Computer Science"],
                "certifications": ["CompTIA A+"],
                "courses_taken": ["Public Speaking Course","Strategic Planning Course", ,"UX Research Course","Data Science Course"],
                "workshops_taken": ["Python for Data Analysis Workshop","SEO Workshop"],
                "awards": [],
                "profile_picture": "",
                "registered_status": true
            },
            {
                "employeeID": "1012",
                "name": "Batool Rizvi",
                "email": "batool@lums.edu.pk",
                "password": await hashPassword("Abc1234."),
                "contactNumber": "0300-7890123",
                "date_of_birth": new Date("2001-06-20"),
                "gender": "Female",
                "positionID": "P011",
                "skills": ['Customer Support'],
                "security_question": "What is your mother's maiden name?",
                "security_answer": "Maryam",
                "two_factor_answer": "1",
                "mentor_ID": "",
                "task_completion_rate": 0.65,
                "attendance_rate": 1,
                
                "punctuality": 1,
                "efficiency": 0.73,
                "professionalism": 0.75,
                "collaboration": 0.65,
                "leadership": 0.63,

                "job_history": ["Intern at Devsinc"],
                "education": ["BS in Computer Science"],
                "certifications": [],
                "courses_taken": [],
                "workshops_taken": [],
                "awards": [],
                "profile_picture": "",
                "registered_status": true
            },
            {
                "employeeID": "1013",
                "name": "Zubair Ahmed",
                "email": "zubair@lums.edu.pk",
                "password": await hashPassword("Abc1234."),
                "contactNumber": "0300-8901234",
                "date_of_birth": new Date("1989-12-25"),
                "gender": "Male",
                "positionID": "P005",
                "skills": ["Software Development", "Problem Solving", "Teamwork", "Leadership"],
                "security_question": "What is your favorite movie?",
                "security_answer": "The Dark Knight",
                "two_factor_answer": "7",
                "mentor_ID": "",
                "task_completion_rate": 0.87,
                "attendance_rate": 0.99,

                "punctuality": 0.98,
                "efficiency": 0.86,
                "professionalism": 0.79,
                "collaboration": 0.88,
                "leadership": 0.71,

                "job_history": ["Intern at Arbisoft", "Junior Software Developer at Arbisoft", "Software Developer at Devsinc", "Senior Software Developer at Devsinc"],
                "education": ["BS in Computer Science", "MS in Data Science"],
                "certifications": ["Google Certified Professional Cloud Architect", "Microsoft Certified: Azure Solutions Architect Expert"],
                "courses_taken": ["Node.js Basics","MongoDB Basics","Python Basics","SEO Course","Public Speaking Course",  "Strategic Planning Course"],
                "workshops_taken": ["Angular Workshop","Python for Data Analysis Workshop","Digital Marketing Workshop","Leadership Seminar"],
                "awards": ["Employee of the Month", "Employee of the Year"],
                "profile_picture": "",
                "registered_status": true
            },

            {
                "employeeID": "1014",
                "name": "Sana Malik",
                "email": "sana.malik@lums.edu.pk",
                "password": await hashPassword("Abc1234."),
                "contactNumber": "0311-2345678",
                "date_of_birth": new Date("1992-11-15"),
                "gender": "Female",
                "positionID": "P007",
                "skills": ["UI/UX Design", "User Research", "Teamwork", "Leadership"],
                "security_question": "What is your mother's maiden name?",
                "security_answer": "Abiha",
                "two_factor_answer": "4",
                "mentor_ID": "",
                "task_completion_rate": 0.97,
                "attendance_rate": 0.98,

                "punctuality": 0.92,
                "efficiency": 0.89,
                "professionalism": 0.45,
                "collaboration": 0.88,
                "leadership": 0.59,

                "job_history": ["Intern at Devsinc", "Junior UI/UX Designer at Devsinc"],
                "education": ["BS in Computer Science", "MS in HCI"],
                "certifications": [],
                "courses_taken": ["SEO Course","Strategic Planning Course","Public Speaking Course","Financial Analysis Course", "UI/UX Design Masterclass","UX Research Course"],
                "workshops_taken": ["Python for Data Analysis Workshop"],
                "awards": [],
                "profile_picture": "",
                "registered_status": true
            },
            {
                "employeeID": "1015",
                "name": "Turab Waheed",
                "email": "turab@lums.edu.pk",
                "password": await hashPassword("Abc1234."),
                "contactNumber": "0311-3334444",
                "date_of_birth": new Date("1993-12-25"),
                "gender": "Male",
                "positionID": "P008",
                "skills": ["Software Development", "Problem Solving", "Teamwork", "Communication"],
                "security_question": "What city were you born in?",
                "security_answer": "Islamabad",
                "two_factor_answer": "3",
                "mentor_ID": "1013",

                "task_completion_rate": 0.80,
                "attendance_rate": 0.88,
                "punctuality": 0.91,
                "efficiency": 0.89,
                "professionalism": 0.92,
                "collaboration": 0.85,
                "leadership": 0.81,

                // w1 * KPI1 + w2 * KPI2 + w3 * KPI3 + w4 * KPI4 + w5 * KPI5 + w6 * KPI6
                // calculate for each employee
                // Sort employees based on this score to get the ranking

                "job_history": ["Intern at Systems Ltd.", "Junior Software Developer at Systems Ltd.", "Junior Software Developer at Devsinc"],
                "education": ["BS in Computer Science"],
                "certifications": ["Meta Certified Developer"],
                "courses_taken": ["Software Development", "Problem Solving", "Teamwork", "Communication"],
                "workshops_taken": ["Software Development Workshop", "Problem Solving Workshop"],
                "awards": ["Employee of the Month"],
                "profile_picture": "",
                "registered_status": true
            },
            {
                "employeeID": "1016",
                "name": "Fahad Mehmood",
                "email": "fahad@lums.edu.pk",
                "password": await hashPassword("Abc1234."),
                "contactNumber": "0311-4445555",
                "date_of_birth": new Date("2000-02-20"),
                "gender": "Male",
                "positionID": "P008",
                "skills": ["Software Development", "Problem Solving", "Teamwork", "Communication"],
                "security_question": "What is the name of your best friend?",
                "security_answer": "Ali",
                "two_factor_answer": "5",
                "mentor_ID": "1014",

                "task_completion_rate": 0.69,
                "attendance_rate": 0.79,
                "punctuality": 0.71,
                "efficiency": 0.68,
                "professionalism": 0.92,
                "collaboration": 0.75,
                "leadership": 0.80,

                "job_history": ["IT Support Specialist at Devsinc", "Junior Software Developer at Devsinc"],
                "education": ["BS in Computer Science"],
                "certifications": ["CompTIA A+"],
                "courses_taken": ["Node.js Basics","MongoDB Basics", "Strategic Planning Course"],
                "workshops_taken": ["Angular Workshop"],
                "awards": [],
                "profile_picture": "",
                "registered_status": true
            },
            {
                "employeeID": "1017",
                "name": "Samiya Iqbal",
                "email": "samiya@;ums.edu.pk",
                "password": await hashPassword("Abc1234."),
                "contactNumber": "0311-5556666",
                "date_of_birth": new Date("1994-03-02"),
                "gender": "Female",
                "positionID": "P009",
                "skills": ["Data Analysis", "Data Visualization", "SQL", "Python"],
                "security_question": "What is your favorite book?",
                "security_answer": "To Kill a Mockingbird",
                "two_factor_answer": "2",
                "mentor_ID": "1005",
                "task_completion_rate": 0.96,
                "attendance_rate": 1,

                "punctuality": 0.93,
                "efficiency": 0.89,
                "professionalism": 0.97,
                "collaboration": 0.98,
                "leadership": 0.95,

                "job_history": ["Intern at Wavetec", "Junior Data Analyst at Devsinc"],
                "education": ["BS in Computer Science"],
                "certifications": ["Tableau Certified Professional"],
                "courses_taken": ["Node.js Basics","MongoDB Basics","Python Basics","SEO Course","UI/UX Design Masterclass"],
                "workshops_taken": ["UI/UX Design Thinking Workshop"],
                "awards": ["Employee of the Month"],
                "profile_picture": "",
                "registered_status": true
            },
            {
                "employeeID": "1018",
                "name": "Omar Farooq",
                "email": "omar@lums.edu.pk",
                "password": await hashPassword("Abc1234."),
                "contactNumber": "0311-6667777",
                "date_of_birth": new Date("2001-04-10"),
                "gender": "Male",
                "positionID": "P010",
                "skills": ["Technical Support", "Troubleshooting", "Customer Service"],
                "security_question": "What is your favorite movie?",
                "security_answer": "The Matrix",
                "two_factor_answer": "9",
                "mentor_ID": "1017",
                "task_completion_rate": 0.71,
                "attendance_rate": 0.75,

                "punctuality": 0.78,
                "efficiency": 0.75,
                "professionalism": 0.80,
                "collaboration": 0.90,
                "leadership": 0.81,

                "job_history": ["IT Support Specialist at Devsinc"],
                "education": ["BS in Computer Science"],
                "certifications": ["Oracle Certified Professional"],
                "courses_taken": ["Node.js Basics","MongoDB Basics"],
                "workshops_taken": ["Python for Data Analysis Workshop"],
                "awards": [],
                "profile_picture": "",
                "registered_status": true,
                "failed_attempts": 0
            },
            {
                "employeeID": "1019",
                "name": "Danish Chaudhry",
                "email": "danish@lums.edu.pk",
                "password": await hashPassword("Abc1234."),
                "contactNumber": "0311-7778888",
                "date_of_birth": new Date("2003-11-05"),
                "gender": "Male",
                "positionID": "P011",
                "skills": ['C++'],
                "security_question": "What is your favorite movie?",
                "security_answer": "Avengers: Endgame",
                "two_factor_answer": "10",
                "mentor_ID": "",
                "task_completion_rate": 0.85,
                "attendance_rate": 0.90,

                "punctuality": 0.89,
                "efficiency": 0.89,
                "professionalism": 0.97,
                "collaboration": 0.82,
                "leadership": 0.75,

                "job_history": ["Intern at Devsinc"],
                "education": ["BS in Computer Science"],
                "certifications": [],
                "courses_taken": [],
                "workshops_taken": [],
                "awards": [],
                "profile_picture": "",
                "registered_status": true
            },
            {
                "employeeID": "1020",
                "name": "Rabia Javed",
                "email": "rabia@lums.edu.pk",
                "password": await hashPassword("Abc1234."),
                "contactNumber": "0311-8889999",
                "date_of_birth": new Date("2002-08-10"),
                "gender": "Female",
                "positionID": "P011",
                "skills": ['Troubleshooting'],
                "security_question": "What city were you born in?",
                "security_answer": "Karachi",
                "two_factor_answer": "8",
                "mentor_ID": "",
                "task_completion_rate": 0.75,
                "attendance_rate": 0.81,

                "punctuality": 0.93,
                "efficiency": 0.89,
                "professionalism": 0.66,
                "collaboration": 0.76,
                "leadership": 0.69,

                "job_history": ["Intern at Devsinc"],
                "education": ["BS in Computer Science"],
                "certifications": [],
                "courses_taken": [],
                "workshops_taken": [],
                "awards": [],
                "profile_picture": "",
                "registered_status": true
            },


            {
                "employeeID": "1021",
                "name": "Shera",
                "positionID": "P011",
                "registered_status": false,
            },
            // {
            //     "employeeID": "1004",
            //     "name": "Shera",
            //     "positionID": "P001",
            //     "registered_status": false,
            // }

        ];

        const AdminsData = [
            {
                adminID: 'A0001',
                name: 'Muhammad Ali',
                email: 'muhammad@devsinc.com',
                contactNumber: "123-456-7890",
                password: await hashPassword('abcd1234'),
                gender: 'Male',
                profile_picture: "",
                two_factor_answer: "3"
            },
            {
                adminID: 'A0002',
                name: 'Booshan Khan',
                email: 'booshan@devsinc.com',
                contactNumber: "987-654-3210",
                password: await hashPassword('q1w2e3r4'),
                gender: 'Male',
                profile_picture: "",
                two_factor_answer: "4"
            },
            {
                adminID: 'A0003',
                name: 'Alice Johnson',
                email: 'alice.johnson@devsinc.com',
                contactNumber: "123-456-7890",
                password: await hashPassword('password123'),
                gender: 'Female',
                profile_picture: "",
                two_factor_answer: "1"
            },
            {
                adminID: 'A0004',
                name: 'Bob Brown',
                email: 'bob.brown@lums.edu.pk',
                contactNumber: "987-654-3210",
                password: await hashPassword('password123'),
                gender: 'Male',
                profile_picture: "",
                two_factor_answer: "9"
            },
            {
                adminID: 'A0005',
                name: 'Eve Williams',
                email: 'eve.williams@example.com',
                contactNumber: "987-654-3232",
                password: await hashPassword('aaaaaaaa'),
                gender: 'Female',
                profile_picture: "",
                two_factor_answer: "5"
            },
        ];

        const FeedbacksData = [
            {
                feedbackID: 'F0001',
                courseID: "C013",
                rating: 2,
                employeeID: 'E1001',
                feedback: 'Great work! The course was very useful for me. It helped me in learning new skills and applying them effectively in my daily tasks. I especially appreciated the practical examples and hands-on projects.',
                date: new Date('2024-03-01T08:00:00Z'),
            },
            {
                feedbackID: 'F0002',
                courseID: "C013",
                rating: 2,
                employeeID: 'E1001',
                feedback: 'Needs improvement. The course content was somewhat outdated, and the examples used didn’t quite match the current industry standards. Additionally, the pacing was a bit off, with some sections moving too quickly.',
                date: new Date('2024-03-02T08:00:00Z'),
            },
            {
                feedbackID: 'F0003',
                courseID: "C013",
                rating: 3,
                employeeID: 'E1002',
                feedback: 'Keep up the good work! This course has a lot of potentials. I found the modules on advanced topics particularly insightful. However, it would be beneficial to update some of the earlier sections with more current information.',
                date: new Date('2024-03-04T08:00:00Z'),
            },
            {
                feedbackID: 'F0004',
                courseID: "C013",
                rating: 5,
                employeeID: 'E1002',
                feedback: 'Well done! This course exceeded my expectations with its depth and breadth of topics covered. The instructors were knowledgeable and engaging, making complex topics easy to understand.',
                date: new Date('2024-03-05T08:00:00Z'),
            }
        ];

        const ComplaintsData = [
            {
                complaintID: 'C0001',
                employeeID1 : '1002',
                courseID: "-",
                employeeID2: '1001',
                feedback: 'Farigh banda hai',
                date: new Date('2024-03-01T08:00:00Z'),
            },
            {
                complaintID: 'C0002',
                employeeID1 : '-',
                courseID: "C013",
                employeeID2: '1001',
                feedback: 'Needs improvement. The course content was somewhat outdated, and the examples used didn’t quite match the current industry standards. Additionally, the pacing was a bit off, with some sections moving too quickly.',
                date: new Date('2024-03-02T08:00:00Z'),
            },
            {
                complaintID: 'C0003',
                employeeID1 : '1001',
                courseID: "-",
                employeeID2: '1002',
                feedback: 'Work ethic very bad.',
                date: new Date('2024-03-04T08:00:00Z'),
            },
            {
                complaintID: 'C0004',
                employeeID1 : '-',
                courseID: "C013",
                employeeID2: '1002',
                feedback: 'Didnt like the course at all.',
                date: new Date('2024-03-05T08:00:00Z'),
            }
        ];

        const WorkshopsData = [
            {
                "workshopID": "W001",
                "title": "Angular Workshop",
                "date": new Date("2024-03-01T08:00:00Z"),
                "description": "Learn Angular from scratch."
            },
            {
                "workshopID": "W002",
                "title": "Data Visualization Workshop",
                "date": new Date("2024-03-02T08:00:00Z"),
                "description": "Learn to visualize data using Python libraries."
            },
            {
                "workshopID": "W003",
                "title": "React Workshop",
                "date": new Date("2024-03-03T08:00:00Z"),
                "description": "Learn React basics."
            },
            {
                "workshopID": "W004",
                "title": "Leadership Seminar",
                "date": new Date("2024-03-04T08:00:00Z"),
                "description": "Enhance your leadership skills."
            },
            {
                "workshopID": "W005",
                "title": "Financial Management Workshop",
                "date": new Date("2024-03-05T08:00:00Z"),
                "description": "Learn financial management strategies."
            },
            {
                "workshopID": "W006",
                "title": "Python for Data Analysis Workshop",
                "date": new Date("2024-03-06T08:00:00Z"),
                "description": "Explore data analysis with Python."
            },
            {
                "workshopID": "W007",
                "title": "UI/UX Design Thinking Workshop",
                "date": new Date("2024-03-07T08:00:00Z"),
                "description": "Master design thinking techniques."
            },
            {
                "workshopID": "W008",
                "title": "Project Management Workshop",
                "date": new Date("2024-03-08T08:00:00Z"),
                "description": "Learn effective project management."
            },
            {
                "workshopID": "W009",
                "title": "Digital Marketing Workshop",
                "date": new Date("2024-03-09T08:00:00Z"),
                "description": "Learn digital marketing strategies."
            },
            {
                "workshopID": "W010",
                "title": "Cybersecurity Workshop",
                "date": new Date("2024-03-10T08:00:00Z"),
                "description": "Understand cybersecurity fundamentals."
            },
            {
                "workshopID": "W011",
                "title": "Machine Learning Workshop",
                "date": new Date("2024-03-11T08:00:00Z"),
                "description": "Introduction to machine learning concepts."
            },
            {
                "workshopID": "W012",
                "title": "Agile Development Workshop",
                "date": new Date("2024-03-12T08:00:00Z"),
                "description": "Learn Agile development methodologies."
            },
            {
                "workshopID": "W013",
                "title": "Ethical Hacking Workshop",
                "date": new Date("2024-03-13T08:00:00Z"),
                "description": "Understand ethical hacking techniques."
            },
            {
                "workshopID": "W014",
                "title": "Public Speaking Workshop",
                "date": new Date("2024-03-14T08:00:00Z"),
                "description": "Improve your public speaking skills."
            },
            {
                "workshopID": "W015",
                "title": "Artificial Intelligence Workshop",
                "date": new Date("2024-03-15T08:00:00Z"),
                "description": "Introduction to artificial intelligence."
            },
            {
                "workshopID": "W016",
                "title": "Blockchain Workshop",
                "date": new Date("2024-03-16T08:00:00Z"),
                "description": "Understanding blockchain technology."
            },
            {
                "workshopID": "W017",
                "title": "Cloud Computing Workshop",
                "date": new Date("2024-03-17T08:00:00Z"),
                "description": "Introduction to cloud computing."
            },
            {
                "workshopID": "W018",
                "title": "SEO Workshop",
                "date": new Date("2024-03-18T08:00:00Z"),
                "description": "Master search engine optimization."
            },
            {
                "workshopID": "W019",
                "title": "Data Science Workshop",
                "date": new Date("2024-03-19T08:00:00Z"),
                "description": "Introduction to data science."
            },
            {
                "workshopID": "W020",
                "title": "UX Research Workshop",
                "date": new Date("2024-03-20T08:00:00Z"),
                "description": "Learn user experience research techniques."
            }
        ];

        const CoursesData = [
            {
                "courseID": "C001",
                "title": "Node.js Basics",
                "start_date": new Date("2024-03-01T08:00:00Z"),
                "duration": 5,
                "description": "Learn Node.js basics."
            },
            {
                "courseID": "C002",
                "title": "MongoDB Basics",
                "start_date": new Date("2024-03-02T08:00:00Z"),
                "duration": 7,
                "description": "Learn MongoDB basics."
            },
            {
                "courseID": "C003",
                "title": "Python Basics",
                "start_date": new Date("2024-03-03T08:00:00Z"),
                "duration": 10,
                "description": "Learn Python basics."
            },
            {
                "courseID": "C004",
                "title": "Strategic Planning Course",
                "start_date": new Date("2024-03-04T08:00:00Z"),
                "duration": 7,
                "description": "Learn strategic planning techniques."
            },
            {
                "courseID": "C005",
                "title": "UI/UX Design Masterclass",
                "start_date": new Date("2024-03-05T08:00:00Z"),
                "duration": 14,
                "description": "Master UI/UX design principles."
            },
            {
                "courseID": "C006",
                "title": "Financial Analysis Course",
                "start_date": new Date("2024-03-06T08:00:00Z"),
                "duration": 10,
                "description": "Learn financial analysis techniques."
            },
            {
                "courseID": "C007",
                "title": "Advanced Data Visualization Course",
                "start_date": new Date("2024-03-07T08:00:00Z"),
                "duration": 14,
                "description": "Advance your data visualization skills."
            },
            {
                "courseID": "C008",
                "title": "Leadership Development Program",
                "start_date": new Date("2024-03-08T08:00:00Z"),
                "duration": 21,
                "description": "Develop leadership qualities and skills."
            },
            {
                "courseID": "C009",
                "title": "Digital Marketing Course",
                "start_date": new Date("2024-03-09T08:00:00Z"),
                "duration": 14,
                "description": "Master digital marketing strategies."
            },
            {
                "courseID": "C010",
                "title": "Cybersecurity Course",
                "start_date": new Date("2024-03-10T08:00:00Z"),
                "duration": 21,
                "description": "Understand cybersecurity principles."
            },
            {
                "courseID": "C011",
                "title": "Machine Learning Course",
                "start_date": new Date("2024-03-11T08:00:00Z"),
                "duration": 21,
                "description": "Explore machine learning algorithms."
            },
            {
                "courseID": "C012",
                "title": "Agile Development Course",
                "start_date": new Date("2024-03-12T08:00:00Z"),
                "duration": 14,
                "description": "Learn Agile development methodologies."
            },
            {
                "courseID": "C013",
                "title": "Ethical Hacking Course",
                "start_date": new Date("2024-03-13T08:00:00Z"),
                "duration": 21,
                "description": "Understand ethical hacking techniques."
            },
            {
                "courseID": "C014",
                "title": "Public Speaking Course",
                "start_date": new Date("2024-03-14T08:00:00Z"),
                "duration": 10,
                "description": "Improve your public speaking skills."
            },
            {
                "courseID": "C015",
                "title": "Artificial Intelligence Course",
                "start_date": new Date("2024-03-15T08:00:00Z"),
                "duration": 21,
                "description": "Introduction to artificial intelligence."
            },
            {
                "courseID": "C016",
                "title": "Blockchain Course",
                "start_date": new Date("2024-03-16T08:00:00Z"),
                "duration": 21,
                "description": "Understanding blockchain technology."
            },
            {
                "courseID": "C017",
                "title": "Cloud Computing Course",
                "start_date": new Date("2024-03-17T08:00:00Z"),
                "duration": 21,
                "description": "Introduction to cloud computing."
            },
            {
                "courseID": "C018",
                "title": "SEO Course",
                "start_date": new Date("2024-03-18T08:00:00Z"),
                "duration": 14,
                "description": "Master search engine optimization."
            },
            {
                "courseID": "C019",
                "title": "Data Science Course",
                "start_date": new Date("2024-03-19T08:00:00Z"),
                "duration": 21,
                "description": "Introduction to data science."
            },
            {
                "courseID": "C020",
                "title": "UX Research Course",
                "start_date": new Date("2024-03-20T08:00:00Z"),
                "duration": 14,
                "description": "Learn user experience research techniques."
            }
        ];

        
        const PositionsData = [
            {
                positionID: "P001",
                title: "CEO",
                vacant: false,
                required_skills: ["Leadership", "Strategic Planning", "Financial Management"],
                held_by: ["1001"],
                hierarchy_level: 1,
                courses: ["C004", "C008","C012","C011","C010","C006","C014"],
                workshops: ["W004", "W005", "W008","W009"],
                max_held_by: 1
            },
            {
                positionID: "P002",
                title: "CTO",
                vacant: false,
                required_skills: ["Technical Leadership", "Innovation", "Technology Strategy", "Product Development"],
                held_by: ["1002"],
                hierarchy_level: 1,
                courses: ["C001", "C002", "C003","C009", "C014"],
                workshops: ["W001", "W002", "W003","W009"],
                max_held_by: 1
            },
            {
                positionID: "P003",
                title: "CFO",
                vacant: false,
                required_skills: ["Financial Management", "Accounting", "Risk Management"],
                held_by: ["1003"],
                hierarchy_level: 1,
                courses: ["C006","C004","C014","C009"],
                workshops: ["W005"],
                max_held_by: 1
            },
            {
                positionID: "P004",
                title: "Software Development Manager",
                vacant: true,
                required_skills: ["Software Development", "Team Management", "Project Management"],
                held_by: [],
                hierarchy_level: 2,
                courses: ["C003", "C008","C012","C004","C010"],
                workshops: ["W006", "W008"],
                max_held_by: 2
            },
            {
                positionID: "P005",
                title: "Senior Software Engineer",
                vacant: false,
                required_skills: ["Software Development", "Problem Solving", "Communication", "Teamwork", "Leadership"],
                held_by: ["1004", "1005", "1013"],
                hierarchy_level: 3,
                courses: ["C001","C002", "C003", "C0018","C004"],
                workshops: ["W001", "W006"],
                max_held_by: 3
            },
            {
                positionID: "P006",
                title: "Senior Data Analyst",
                vacant: true,
                required_skills: ["Data Analysis", "Data Visualization", "SQL", "Python"],
                held_by: [],
                hierarchy_level: 3,
                courses: ["C002", "C007","C008","C004"],
                workshops: ["W002", "W006", "W007"],
                max_held_by: 2
            },
            {
                positionID: "P007",
                title: "Senior UI/UX Designer",
                vacant: false,
                required_skills: ["UI/UX Design", "Wireframing", "Prototyping", "User Research"],
                held_by: ["1008", "1014"],
                hierarchy_level: 3,
                courses: ["C005","C008","C004","C020"],
                workshops: ["W007"],
                max_held_by: 2
            },
            {
                positionID: "P008",
                title: "Junior Software Developer",
                vacant: false,
                required_skills: ["Software Development", "Problem Solving", "Communication", "Teamwork"],
                held_by: ["1015", "1016"],
                hierarchy_level: 4,
                courses: ["C001", "C003","C002","C017"],
                workshops: ["W001"],
                max_held_by: 3
            },
            {
                positionID: "P009",
                title: "Junior Data Analyst",
                vacant: false,
                required_skills: ["Data Analysis", "Data Visualization", "SQL", "Python"],
                held_by: ["1010", "1017"],
                hierarchy_level: 4,
                courses: ["C002","C019"],
                workshops: ["W002", "W006"],
                max_held_by: 3
            },
            {
                positionID: "P010",
                title: "IT Support Specialist",
                vacant: false,
                required_skills: ["Technical Support", "Troubleshooting", "Customer Service"],
                held_by: ["1011", "1018"],
                hierarchy_level: 5,
                courses: [],
                workshops: ["W008"],
                max_held_by: 3
            },
            {
                positionID: "P011",
                title: "Intern",
                vacant: false,
                required_skills: [],
                held_by: ["1012", "1019", "1020", "1021"],
                hierarchy_level: 6,
                courses: [],
                workshops: [],
                max_held_by: 8
            }
        ];

        const AssignAssessmentData = [
            {
                positionIDnew: "P004",
                questions: [
                    { question: "Primary methodology for software lifecycle management?", answer: "Agile" },
                    { question: "Term for managing software project constraints?", answer: "Scoping" },
                    { question: "Common conflict resolution strategy?", answer: "Mediation" },
                    { question: "Budget tracking tool preference?", answer: "Jira" },
                    { question: "Define 'refactoring' in the context of code maintenance.", answer: "Improvement" },
                    { question: "Software development practice that ensures code clarity.", answer: "Comments" },
                    { question: "Technique for managing changing requirements.", answer: "Flexibility" },
                    { question: "Approach to break down a project into small parts.", answer: "Modularization" },
                    { question: "A way to measure codebase maintainability.", answer: "Complexity" },
                    { question: "Methodology used to respond to unpredictability.", answer: "Adaptive" },
                    { question: "What does 'MVP' stand for in product development?", answer: "MinimumViableProduct" },
                    { question: "Principle for reducing rework in the development process.", answer: "DRY" },
                    { question: "Strategy for reducing technical debt.", answer: "Refactoring" },
                    { question: "Name an alternative to monolithic application architecture.", answer: "Microservices" },
                    { question: "Common practice for scaling agile practices in large organizations.", answer: "SAFe" },
                    { question: "Key benefit of pair programming.", answer: "Collaboration" },
                    { question: "Term for the division of tasks into small increments.", answer: "Chunking" },
                    { question: "Main goal of a sprint review meeting.", answer: "Feedback" },
                    { question: "Name a way to measure the performance of development processes.", answer: "Metrics" },
                    { question: "Technique to manage cross-team dependencies in agile.", answer: "ScrumOfScrums" },
                ]
            },
            {
                positionIDnew: "P005",
                questions: [
                    { question: "Preferred programming paradigm?", answer: "OOP" },
                    { question: "Key practice for quality code?", answer: "Review" },
                    { question: "Version control system?", answer: "Git" },
                    { question: "Methodology for small iterative development?", answer: "Scrum" },
                    { question: "Name a design pattern for object creation in software engineering.", answer: "Factory" },
                    { question: "Command to revert changes in git.", answer: "Revert" },
                    { question: "What is a software construct that enables data encapsulation?", answer: "Class" },
                    { question: "Term for checking out previous versions of a codebase.", answer: "Branching" },
                    { question: "Software engineering practice for integrating code into a shared repository.", answer: "CI" },
                    { question: "What does 'SOLID' stand for in software design principles?", answer: "DesignPrinciples" },
                    { question: "Technique for scaling agile practices.", answer: "LeSS" },
                    { question: "Name a language used for server-side scripting.", answer: "JavaScript" },
                    { question: "Key feature of responsive web design.", answer: "Adaptability" },
                    { question: "Name a relational database management system.", answer: "PostgreSQL" },
                    { question: "Name a non-relational database.", answer: "MongoDB" },
                    { question: "Common architectural style for developing web services.", answer: "REST" },
                    { question: "Name a way to organize CSS code.", answer: "BEM" },
                    { question: "Name a package manager for JavaScript.", answer: "NPM" },
                    { question: "Term for making applications usable across different browsers.", answer: "CrossBrowser" },
                    { question: "A methodology that focuses on lean principles in the software development.", answer: "Kanban" },
                ]
            },
            {
                positionIDnew: "P006",
                questions: [
                    { question: "Preferred statistical software?", answer: "R" },
                    { question: "Data visualization tool?", answer: "Tableau" },
                    { question: "Method for handling missing data?", answer: "Imputation" },
                    { question: "Technique for predictive modeling?", answer: "Regression" },
                    { question: "What is the process called to convert raw data into useful information?", answer: "Analysis" },
                    { question: "Name a database language for managing and querying data.", answer: "SQL" },
                    { question: "Term for graphical representation of data distributions.", answer: "Histogram" },
                    { question: "What does KPI stand for in data analysis?", answer: "KeyPerformanceIndicator" },
                    { question: "Technique used to discover patterns in large data sets.", answer: "DataMining" },
                    { question: "Commonly used measure of central tendency.", answer: "Mean" },
                    { question: "Technique for reducing the dimensionality of data.", answer: "PCA" },
                    { question: "What is the process of identifying incorrect or irrelevant parts of data called?", answer: "Cleansing" },
                    { question: "Name a Python library used for data analysis.", answer: "Pandas" },
                    { question: "Term for a test used to infer properties of a population.", answer: "HypothesisTesting" },
                    { question: "Technique to find the relationship between two variables.", answer: "Correlation" },
                    { question: "Method for classifying data into groups.", answer: "Clustering" },
                    { question: "What is the process of examining large pre-existing databases called?", answer: "DataMining" },
                    { question: "Term for the prediction of future trends based on historical data.", answer: "Forecasting" },
                    { question: "Software for creating dynamic dashboards.", answer: "PowerBI" },
                    { question: "Technique for visualizing complex data relationships.", answer: "NetworkGraphs" },
                ]
            },
            {
                positionIDnew: "P007",
                questions: [
                    { question: "Term for user-centered design considering user limitations?", answer: "Accessibility" },
                    { question: "Process to determine usability issues before launch?", answer: "UsabilityTesting" },
                    { question: "Technique used to create a detailed visualization of a user's journey?", answer: "Storyboarding" },
                    { question: "Design phase where the most creative ideas are generated?", answer: "Ideation" },
                    { question: "What is the rule for minimal user interface design?", answer: "LessIsMore" },
                    { question: "Term for testing with a representative user group?", answer: "UserTesting" },
                    { question: "Name a popular tool for UI prototyping.", answer: "AdobeXD" },
                    { question: "What kind of design focuses on effective text presentation?", answer: "Typography" },
                    { question: "What do you call a set of interface items users interact with?", answer: "UIElements" },
                    { question: "What principle reduces the cognitive load in design?", answer: "Simplicity" },
                    { question: "Term for a brief outline of digital or screen design?", answer: "Wireframe" },
                    { question: "What aspect of design involves a grid system?", answer: "Layout" },
                    { question: "Name a method to structure information in a logical way.", answer: "Hierarchy" },
                    { question: "Technique to create high fidelity representation of the final product?", answer: "Mockup" },
                    { question: "Name the practice of creating engaging user experiences.", answer: "UXDesign" },
                    { question: "Term for consistency in design throughout the product.", answer: "Cohesiveness" },
                    { question: "What is user experience evaluation based on observation called?", answer: "Ethnography" },
                    { question: "Tool used for user flow diagrams.", answer: "Flowchart" },
                    { question: "Name a technique for real-time user feedback.", answer: "LivePrototype" },
                    { question: "Term for a small-scale version of your product.", answer: "Prototype" },
                ]
            },
            
            // P008: Junior Software Developer
            {
                positionIDnew: "P008",
                questions: [
                    { question: "Term for the architecture pattern separating data, UI, and control logic?", answer: "MVC" },
                    { question: "Name a version control system other than Git.", answer: "SVN" },
                    { question: "Command to list all Git branches.", answer: "git branch" },
                    { question: "Name a high-level programming language other than Python.", answer: "Java" },
                    { question: "What does 'CRUD' stand for in database applications?", answer: "CreateReadUpdateDelete" },
                    { question: "Name the HTML element for creating a text input field.", answer: "input" },
                    { question: "Term for the invisible coding standards guiding programming?", answer: "Conventions" },
                    { question: "What is a reusable software component?", answer: "Module" },
                    { question: "Term for the logical error in a program.", answer: "Bug" },
                    { question: "Name a build automation tool.", answer: "Gradle" },
                    { question: "What type of testing is performed by the developers themselves?", answer: "UnitTesting" },
                    { question: "Name a common software license that allows users to view and modify the source code.", answer: "MIT" },
                    { question: "What is a formal description of a software system used to analyze and document?", answer: "Specification" },
                    { question: "Term for a pointer that does not point to a valid object.", answer: "NullPointer" },
                    { question: "What does ORM stand for in software development?", answer: "ObjectRelationalMapping" },
                    { question: "Name a software design pattern that restricts object creation for a class to only one instance.", answer: "Singleton" },
                    { question: "What is the iterative methodology for managing software projects?", answer: "Agile" },
                    { question: "Term for the part of the system where the main logic and functionality are implemented.", answer: "Backend" },
                    { question: "Command to compile Java source code into bytecode.", answer: "javac" },
                    { question: "What JSON-based open standard is used for token-based authentication?", answer: "JWT" },
                ]
            },
            
            // P009: Junior Data Analyst
            {
                positionIDnew: "P009",
                questions: [
                    { question: "Name the process of examining data sets to draw conclusions.", answer: "DataAnalysis" },
                    { question: "Software typically used for advanced statistical analysis.", answer: "SPSS" },
                    { question: "Technique used to forecast future data trends.", answer: "TimeSeriesAnalysis" },
                    { question: "Term for data visualization with geographic dimensions.", answer: "GeoMapping" },
                    { question: "Name the operation for joining tables by a key.", answer: "Merge" },
                    { question: "Term for a data point that differs significantly from other observations.", answer: "Outlier" },
                    { question: "What is the sequence of steps for data preparation called?", answer: "DataPipeline" },
                    { question: "Name a programming language highly utilized for statistical analysis and graphics.", answer: "R" },
                    { question: "What is the analysis of data generated by users' activity called?", answer: "BehavioralAnalytics" },
                    { question: "Name a system used for efficient data retrieval.", answer: "DatabaseManagementSystem" },
                    { question: "Term for ensuring data is accurate and consistent over its lifecycle.", answer: "DataIntegrity" },
                    { question: "What does EDA stand for in exploratory data work?", answer: "ExploratoryDataAnalysis" },
                    { question: "Name a measure of how spread out numbers are in a data set.", answer: "Variance" },
                    { question: "What is a tool used to automate the creation of reports and dashboards?", answer: "ReportingSoftware" },
                    { question: "Name the statistical method that estimates the relationships among variables.", answer: "Regression" },
                    { question: "What is a popular Python library for data manipulation and analysis?", answer: "Pandas" },
                    { question: "Name the type of analysis that deals with large data sets.", answer: "BigDataAnalysis" },
                    { question: "Term for the graphical representation of the distribution of numerical data.", answer: "BoxPlot" },
                    { question: "What do you call the science of collecting, analyzing, and interpreting data?", answer: "Statistics" },
                    { question: "Name the technique for identifying patterns and correlations within data.", answer: "DataMining" },
                ]
            },
            {
                positionIDnew: "P010",
                questions: [
                    { question: "What does DHCP stand for in networking?", answer: "DynamicHostConfigurationProtocol" },
                    { question: "Term for a network point that acts as an entrance to another network.", answer: "Gateway" },
                    { question: "What is the primary protocol used by email systems to retrieve messages?", answer: "IMAP" },
                    { question: "Name a popular tool used for removing viruses.", answer: "Malwarebytes" },
                    { question: "Term for isolating a section of the network to protect from unauthorized access.", answer: "Segmentation" },
                    { question: "Command to display all current TCP/IP network configuration values.", answer: "ipconfig" },
                    { question: "What type of device filters network traffic?", answer: "Firewall" },
                    { question: "Common name for software that prevents, detects, and removes malware.", answer: "Antivirus" },
                    { question: "Term for the unauthorized exploitation of a software vulnerability.", answer: "Exploit" },
                    { question: "What is the process of returning a device to its original manufacturer settings?", answer: "Reset" },
                    { question: "What do you call the main database that stores network configurations?", answer: "DirectoryService" },
                    { question: "Term used for copying files to a second medium as a precaution against data loss.", answer: "Backup" },
                    { question: "Name the protocol used to assign IP addresses automatically.", answer: "DHCP" },
                    { question: "What hardware device connects a computer to a telephone line for dial-up Internet?", answer: "Modem" },
                    { question: "Name a command to test network connectivity.", answer: "ping" },
                    { question: "Term for a network device that forwards data packets between computer networks.", answer: "Router" },
                    { question: "Name the secure network for transmitting encrypted data.", answer: "VPN" },
                    { question: "What does SSL stand for, a protocol for securing data sent over the Internet?", answer: "SecureSocketsLayer" },
                    { question: "Name the technology used to create virtual networks on a single physical network.", answer: "VLAN" },
                    { question: "Term for the process of fixing, upgrading, or preventing software issues.", answer: "Troubleshooting" },
                ]
            },
            
            // P011: Intern
            {
                positionIDnew: "P011",
                questions: [
                    { question: "What is the office software suite developed by Microsoft?", answer: "Office365" },
                    { question: "Name a programming language that is primarily used for client-side scripting.", answer: "JavaScript" },
                    { question: "What platform is commonly used for version control and code sharing?", answer: "GitHub" },
                    { question: "Term for collaborative hubs for project management and version tracking.", answer: "GitLab" },
                    { question: "What is the tool used for real-time office communication?", answer: "Slack" },
                    { question: "Name a database management system used to handle large application databases.", answer: "MySQL" },
                    { question: "What do you call the study of algorithmic processes and computational machines?", answer: "ComputerScience" },
                    { question: "Term for a software that manages the creation and modification of digital content.", answer: "CMS" },
                    { question: "What is a widely used open-source operating system?", answer: "Linux" },
                    { question: "Name a lightweight data interchange format.", answer: "JSON" },
                    { question: "What is the global system of interconnected computer networks?", answer: "Internet" },
                    { question: "Term for the rules that govern the behavior of some system.", answer: "Protocol" },
                    { question: "What application is used for creating vector graphics?", answer: "AdobeIllustrator" },
                    { question: "Name the process of optimizing web pages for search engines.", answer: "SEO" },
                    { question: "What is the business-oriented social networking service?", answer: "LinkedIn" },
                    { question: "Term for a temporary role offered to novices to gain experience and training.", answer: "Internship" },
                    { question: "What type of software is used for analyzing and retrieving documents and content?", answer: "Database" },
                    { question: "Name the personal productivity tool often used for task scheduling.", answer: "Calendar" },
                    { question: "What do you call a diagram that represents an algorithm?", answer: "Flowchart" },
                    { question: "Name a popular system for tracking changes in source code during software development.", answer: "Git" },
                ]
            }
        ];

        const assignmentData = [{
            assignmentID: 'A0001',
            employeeID: '1018',
            positionTitle: 'P006',
            questions: [
            'Primary OS for enterprise?',
            'Tool for remote desktop support?',
            'Protocol for secure network access?',
            'Common user issue?' 
            ],
            answers: ['Windows', 'TeamViewer', 'VPN', 'Password'],
            employee_answers: [],
            score: '0',
            status: 'Pending',
            date: new Date('2024-03-05T08:00:00Z')
        }
            
        ];


        // const PositionsData = [
        //     // {
        //     //     "positionID": "P001",
        //     //     "title": "Software Engineer",
        //     //     "vacant": false,
        //     //     "required_skills": ["JavaScript", "Node.js", "MongoDB"],
        //     //     "held_by": ["E1001"]
        //     // },
        //     // {
        //     //     "positionID": "P002",
        //     //     "title": "Data Analyst",
        //     //     "vacant": false,
        //     //     "required_skills": ["Python", "Django", "SQL"],
        //     //     "held_by": ["E1002"]
        //     // },
        //     // {
        //     //     "positionID": "P003",
        //     //     "title": "Frontend Developer",
        //     //     "vacant": true,
        //     //     "required_skills": ["HTML", "CSS", "JavaScript"],
        //     //     "held_by": []
        //     // },
        //     {
        //         positionID: "P001",
        //         title: "CEO",
        //         vacant: false,
        //         required_skills: ["Leadership", "Strategic Planning", "Financial Management"],
        //         held_by: ["1001"],
        //         hierarchy_level: 1
        //     },
        //     {
        //         positionID: "P002",
        //         title: "CTO",
        //         vacant: false,
        //         required_skills: ["Technical Leadership", "Innovation", "Technology Strategy", "Product Development"],
        //         held_by: ["1002"],
        //         hierarchy_level: 1
        //     },
        //     {
        //         positionID: "P003",
        //         title: "CFO",
        //         vacant: false,
        //         required_skills: ["Financial Management", "Accounting", "Risk Management"],
        //         held_by: ["1003"],
        //         hierarchy_level: 1
        //     },
        //     {
        //         positionID: "P004",
        //         title: "Software Development Manager",
        //         vacant: true,
        //         required_skills: ["Software Development", "Team Management", "Project Management"],
        //         held_by: [],
        //         hierarchy_level: 2
        //     },
        //     {
        //         positionID: "P005",
        //         title: "Senior Software Engineer",
        //         vacant: false,
        //         required_skills: ["Software Development", "Problem Solving", "Communication", "Teamwork", "Leadership"],
        //         held_by: ["1004", "1005", "1013"],
        //         hierarchy_level: 3
        //     },
        //     {
        //         positionID: "P006",
        //         title: "Senior Data Analyst",
        //         vacant: true,
        //         required_skills: ["Data Analysis", "Data Visualization", "SQL", "Python"],
        //         held_by: [],
        //         hierarchy_level: 3
        //     },
        //     {
        //         positionID: "P007",
        //         title: "Senior UI/UX Designer",
        //         vacant: false,
        //         required_skills: ["UI/UX Design", "Wireframing", "Prototyping", "User Research"],
        //         held_by: ["1008", "1014"],
        //         hierarchy_level: 3
        //     }, 
        //     {
        //         positionID: "P008",
        //         title: "Junior Software Developer",
        //         vacant: false,
        //         required_skills: ["Software Development", "Problem Solving", "Communication", "Teamwork"],
        //         held_by: ["1015", "1016"],
        //         hierarchy_level: 4
        //     },
        //     {
        //         positionID: "P009",
        //         title: "Junior Data Analyst",
        //         vacant: false,
        //         required_skills: ["Data Analysis", "Data Visualization", "SQL", "Python"],
        //         held_by: ["1010", "1017"],
        //         hierarchy_level: 4
        //     },
        //     {
        //         positionID: "P010",
        //         title: "IT Support Specialist",
        //         vacant: false,
        //         required_skills: ["Technical Support", "Troubleshooting", "Customer Service"],
        //         held_by: ["1011", "1018"],
        //         hierarchy_level: 5
        //     },
        //     {
        //         positionID: "P011",
        //         title: "Intern",
        //         vacant: false,
        //         required_skills: [],
        //         held_by: ["1012", "1019", "1020", "1021"],
        //         hierarchy_level: 6
        //     }
        // ];


        // Save employee data to the database
        await Promise.all([
            Employee.insertMany(employeeData),
            HR_Admin.insertMany(AdminsData),
            Feedback.insertMany(FeedbacksData),
            Complaint.insertMany(ComplaintsData),
            Workshop.insertMany(WorkshopsData),
            Course.insertMany(CoursesData),
            Positions.insertMany(PositionsData),
            Assign_Assessment.insertMany(AssignAssessmentData),
            DO_assignment.insertMany(assignmentData)
        ]);

        console.log('Employee data saved to database')
    } catch (error) {
        console.error('Error saving data to database:', error);
    }
}


module.exports = init_db;
