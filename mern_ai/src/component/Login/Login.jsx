import React, { useContext } from 'react';
import styles from './Login.module.css';
import GoogleIcon from '@mui/icons-material/Google';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DescriptionIcon from '@mui/icons-material/Description';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
        <div className={styles.LoginWrapper}>
            {/* Background Ambient Floating Graphic Elements */}
            <div className={styles.floatingCardTL}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <DescriptionIcon sx={{ color: '#6366f1', fontSize: 24 }} />
                    <span style={{ fontWeight: 700, fontSize: '13px', color: '#334155' }}>Resume</span>
                </div>
                <div className={styles.skeletonLine} />
                <div className={styles.skeletonLine} />
                <div className={styles.skeletonLineShort} />
            </div>

            <div className={styles.floatingCardTR}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', border: '4px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                        92
                    </div>
                    <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />
                </div>
                <div className={styles.skeletonLine} />
                <div className={styles.skeletonLineShort} />
            </div>

            <div className={styles.floatingCardBL}>
                <div className={styles.skeletonLine} />
                <div className={styles.skeletonLine} />
                <div className={styles.skeletonLineShort} />
            </div>

            <div className={styles.floatingCardBR}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <DescriptionIcon sx={{ color: '#8b5cf6', fontSize: 24 }} />
                    <span style={{ fontWeight: 700, fontSize: '13px', color: '#334155' }}>Match Score</span>
                </div>
                <div className={styles.skeletonLine} />
                <div className={styles.skeletonLineShort} />
            </div>

            {/* Central Main Glassmorphism Card */}
            <div className={styles.mainCard}>
                <div className={styles.iconContainer}>
                    <DescriptionIcon sx={{ fontSize: 40 }} />
                    <div className={styles.sparkleBadge}>
                        <AutoAwesomeIcon sx={{ fontSize: 16 }} />
                    </div>
                </div>

                <h1 className={styles.title}>
                    AI Resume <span className={styles.gradientText}>Checker</span>
                </h1>

                <p className={styles.subtitle}>
                    Get instant AI-powered feedback to improve your resume and land your dream job.
                </p>

                <button className={styles.googlePillBtn} onClick={handleLogin}>
                    <div className={styles.btnContent}>
                        <GoogleIcon sx={{ fontSize: 22, color: '#4285F4' }} />
                        <span className={styles.btnText}>Sign in with Google</span>
                    </div>
                    <ArrowForwardIcon className={styles.arrowIcon} sx={{ fontSize: 20 }} />
                </button>
            </div>
        </div>
    );
};

export default Login;