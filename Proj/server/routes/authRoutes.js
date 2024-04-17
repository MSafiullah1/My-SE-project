const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
    test,
    registerUser,
    loginUser,
    getProfile,
    retrieveName,
    resetPassword,
    retrieveSecurityQuestion,
    setPassword,
    resetSecurityImage,
    verifySecurityAnswer,
    submitFeedback,
    submitComplaint,
    returnProfile,
    uploadImage,
    changePassword,
    changeSecurityImg,

    updateProfile,
    deleteComplaint,
    retrieveAssessmentQuestions,
    assignAssessment,
    updateAssessment,
    getMentorInfo,
    getMentorOptions,
    assignMentor,
} = require("../controllers/authControllers");
const {
    dashboardEmployees,
    positionIDtoName,
    addEmployeeFromAdminDashboard,
    deleteEmployeefromAdminDashboard,
    fetchCourses,
    fetchWorkshops,
    returnAdminProfile,
    getWeights,
    saveWeights,
    setMetrics,
    changeStatus,
    getCourses,
    getWorkshops,
    updateAdminPic,
    changeAdminPasssword,
    changeAdminSecurityImg
} = require("../controllers/dashboardAdmin");

const { viewFeedbacks, viewComplaints, viewAssignments } = require("../controllers/feedbackControllers"); 


//middleware
router.use(
    cors({
        credentials: true,
        origin: "http://localhost:5173",
    })
);

// router.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
// router.use(bodyParser());

router.get("/", loginUser);
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/profile", getProfile);
router.post("/registerUser", retrieveName);
router.post("/resetPassword", resetPassword);
router.post("/retrieveSecurityQuestion", retrieveSecurityQuestion);
router.post("/resetPasswordFinalStep", setPassword);
router.post("/resetSecurityImage", resetSecurityImage);
router.post("/verifySecurityAnswer", verifySecurityAnswer);
router.get("/dashboard-employees", dashboardEmployees);
router.get("/dashboard-position-titles", positionIDtoName);
router.get("/dashboard-course-data", fetchCourses);
router.get("/dashboard-workshop-data", fetchWorkshops);
router.post("/addEmployeeFromAdminDashboard", addEmployeeFromAdminDashboard);
router.post("/submitFeedback", submitFeedback);
router.post('/submitComplaint', submitComplaint);
router.post('/getProfile', returnProfile)
router.post('/uploadImage', uploadImage)
router.post('/changePassword', changePassword)
router.post('/changeSecurityImage', changeSecurityImg)
router.post('/updateProfile', updateProfile)
router.post('/getAdminProfile', returnAdminProfile)
router.post('/getFeedback', viewFeedbacks)
router.post('/getComplaint', viewComplaints)
router.post('/getAssessmentData', viewAssignments)
router.post('/setMetrics', setMetrics)
router.post('/change_status', changeStatus)

// create a route for axios.post(`/deleteEmployee/${employeeID}`);
router.post("/deleteEmployee/:id", deleteEmployeefromAdminDashboard);
router.get("/weights", getWeights);
router.post("/updateWeights", saveWeights);
router.post('/retrieveAssessmentQuestions', retrieveAssessmentQuestions);
router.post('/assignAssessment', assignAssessment);
router.post('/submitAssessmentScore', updateAssessment);
router.post("/deleteComplaint/:id", deleteComplaint);
router.get("/getPositionsData", positionIDtoName)
router.get('/getCoursesData', getCourses)
router.get('/getWorkshopsData', getWorkshops)
router.post('/updateAdminPic', updateAdminPic)
router.post('/changeAdminPassword', changeAdminPasssword)
router.post('/changeAdminSecurityImage', changeAdminSecurityImg)

router.get("/mentor/:mentor", getMentorInfo);   
router.get("/mentorOptions/:positionID/:employeeID", getMentorOptions);

// axios.post(`/saveMentor/${mentorID}/${allUserInfo.employeeID}`)
router.post("/saveMentor/:mentorID/:employeeID", assignMentor);


module.exports = router;
