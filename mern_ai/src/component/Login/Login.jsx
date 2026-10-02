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
            
            const initialUser = {
                _id: user.uid,
                name: user.displayName || "Candidate",
                email: user.email,
                photoUrl: user.photoURL
            };

            // Save state immediately so navigation works without waiting on backend
            setUserInfo(initialUser);
            localStorage.setItem("userInfo", JSON.stringify(initialUser));
            setLogin(true);
            localStorage.setItem("isLogin", "true");

            // Sync with MongoDB backend asynchronously
            try {
                const res = await axios.post('/api/user', {
                    name: user.displayName,
                    email: user.email,
                    photoUrl: user.photoURL
                });

                if (res.data && res.data.user) {
                    setUserInfo(res.data.user);
                    localStorage.setItem("userInfo", JSON.stringify(res.data.user));
                }
            } catch (apiErr) {
                console.warn("Backend user sync warning:", apiErr.message);
            }

            navigate('/dashboard');
        } catch (err) {
            console.error("Firebase Login Error:", err);
            if (err.code !== 'auth/popup-closed-by-user') {
                alert(err.message || "Failed to sign in with Google.");
            }
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