import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
// import './resetPwd.css'
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useUserContext } from "../hooks/useUserContext";

export default function ResetFinalPwd() {
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState({
        password: "",
        samePassword: "",
        empID: location.state.empID,
    });

    const [passwordValidations, setPasswordValidations] = useState({
        isLongEnough: false,
        hasUpper: false,
        hasLower: false,
        hasNumber: false,
        hasSpecial: false,
    });

    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const onPasswordChange = (password) => {
        setData({ ...data, password });
        setPasswordValidations({
            isLongEnough: password.length >= 8,
            hasUpper: /[A-Z]/.test(password),
            hasLower: /[a-z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        });
    };

    const onConfirmPasswordChange = (samePassword) => {
        setData({ ...data, samePassword });
        setPasswordsMatch(data.password === samePassword);
    };

    const { authenticatedUser, no, dispatch } = useUserContext();

    const resetPassword = async (e) => {
        e.preventDefault();
        const { empID, password, samePassword } = data;
        if (!(password && samePassword && password == samePassword)) {
            toast.error("passwords do not match");
            return;
        }
        try {
            const { data } = await axios.post("/resetPasswordFinalStep", {
                empID,
                password,
                samePassword,
            });
            if (data.error) {
                toast.error(data.error);
            } else {
                setData({});
                toast.success("password successfully reset");
                navigate("/resetPg2");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <body>
            <div class="resetPwd-container">
                <div class="reset-box">
                    <h1>Reset your password</h1>
                    <h3>
                        Enter your new password to reset the password on your account. <br></br>We'll
                        ask this password whenever you log in.
                    </h3>
                    <form onSubmit={resetPassword}>
                        <div class="input-group">
                            <input
                                type="password"
                                placeholder="New password"
                                value={data.password}
                                onChange={(e) => onPasswordChange(e.target.value)}
                            />
                        </div>

                        <div className="password-criteria">
                            <p>Password must:</p>
                            <ul>
                                <li className={passwordValidations.isLongEnough ? "valid" : ""}>
                                    Be at least 8 characters long
                                </li>
                                <li className={passwordValidations.hasUpper ? "valid" : ""}>
                                    Contain an uppercase and a lowercase letter (A, z)
                                </li>
                                <li className={passwordValidations.hasNumber ? "valid" : ""}>
                                    Contain a number
                                </li>
                                <li className={passwordValidations.hasSpecial ? "valid" : ""}>
                                    Contain a special character (!, %, @, #, etc.)
                                </li>
                            </ul>
                        </div>

                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={data.samePassword}
                                onChange={(e) => onConfirmPasswordChange(e.target.value)}
                            />
                            {!passwordsMatch && data.samePassword && (
                                <p className="password-mismatch">Passwords do not match</p>
                            )}
                        </div>

                        <div class="input-group">
                            <button type="submit" class="reset-btn">
                                Reset password
                            </button>
                        </div>

                        <div class="login">
                            Know your password? <a href="/login">Log in</a>
                        </div>
                    </form>
                </div>
            </div>
        </body>
    );
}
