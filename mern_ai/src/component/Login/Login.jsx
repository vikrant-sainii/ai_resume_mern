import React, { useContext } from 'react';
import styles from './Login.module.css';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import GoogleIcon from '@mui/icons-material/Google';

import { auth, provider } from '../../utils/firebase';
import { signInWithPopup } from 'firebase/auth';
import { AuthContext } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';

const Login = () => {
    const { setLogin, setUserInfo } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            // Register or login user on backend
            const res = await axios.post('/api/user', {
                name: user.displayName,
                email: user.email,
                photoUrl: user.photoURL
            });

            const savedUser = res.data.user || {
                _id: user.uid,
                name: user.displayName,
                email: user.email,
                photoUrl: user.photoURL
            };

            setUserInfo(savedUser);
            localStorage.setItem("userInfo", JSON.stringify(savedUser));
            setLogin(true);
            localStorage.setItem("isLogin", "true");

            navigate('/dashboard');
        } catch (err) {
            console.error("Login Error:", err);
            // Fallback for development if Firebase Popup is blocked or closed
            alert(err.message || "Failed to sign in with Google.");
        }
    };

    return (
        <div className={styles.Login}>
            <div className={styles.loginCard}>
                <div className={styles.loginCardTitle}>
                    <h1>Login </h1>
                    <VpnKeyIcon />
                </div>

                <div className={styles.googleBtn} onClick={handleLogin}>
                    <GoogleIcon sx={{ fontSize: 20, color: "red" }} /> Sign in with Google
                </div>
            </div>
        </div>
    );
};

export default Login;