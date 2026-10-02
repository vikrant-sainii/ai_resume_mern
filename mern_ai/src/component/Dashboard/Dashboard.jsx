import styles from './Dashboard.module.css';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import Skeleton from '@mui/material/Skeleton';
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import { useState, useContext } from 'react';
import axios from '../../utils/axios';
import { AuthContext } from '../../utils/AuthContext';

const Dashboard = () => {
    const [uploadFileText, setUploadFileText] = useState("Upload your resume (PDF)");
    const [loading, setLoading] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDesc, setJobDesc] = useState("");
    const [result, setResult] = useState(null);

    const { userInfo } = useContext(AuthContext);

    const handleOnChangeFile = (e) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0]);
            setUploadFileText(e.target.files[0].name);
        }
    };

    const handleUpload = async () => {
        if (!resumeFile) {
            alert("Please select a PDF resume to upload.");
            return;
        }
        if (!jobDesc.trim()) {
            alert("Please paste a job description.");
            return;
        }

        try {
            setLoading(true);
            setResult(null);

            const formData = new FormData();
            formData.append("resume", resumeFile);
            formData.append("job_desc", jobDesc);
            formData.append("user", userInfo?._id || "guest_user");

            const res = await axios.post('/api/resume/addResume', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setResult(res.data.data);
        } catch (err) {
            console.error("Analysis Error:", err);
            alert(err.response?.data?.message || err.message || "Failed to analyze resume.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.Dashboard}>
            <div className={styles.DashboardLeft}>
                <div className={styles.DashboardHeader}>
                    <div className={styles.DashboardHeaderTitle}>AI Powered</div>
                    <div className={styles.DashboardHeaderLargeTitle}>Resume Matcher & Analyzer</div>
                </div>

                <div className={styles.alertInfo}>
                    📌 Upload your PDF resume and paste the target Job Description to generate an AI match score (0-100) and actionable recommendations.
                </div>

                <div className={styles.DashboardUploadResume}>
                    <div className={styles.DashboardResumeBlock}>
                        <div className={styles.DashboardInputField}>
                            <label htmlFor="resumeUpload" style={{ cursor: "pointer", width: "100%" }}>
                                {uploadFileText}
                            </label>
                            <input
                                id="resumeUpload"
                                type="file"
                                accept="application/pdf"
                                onChange={handleOnChangeFile}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.jobDesc}>
                    <textarea
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                        className={styles.textArea}
                        placeholder="Paste your Job Description here..."
                        rows={10}
                    />
                    <div className={styles.AnalyzeBtn} onClick={handleUpload}>
                        {loading ? "Analyzing..." : "Analyze"}
                    </div>
                </div>
            </div>

            <div className={styles.DashboardRight}>
                <div className={styles.DashboardRightTopCard}>
                    <div>User Profile</div>
                    <img
                        className={styles.profileImg}
                        src={userInfo?.photoUrl || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                        alt="Profile"
                    />
                    <h2>{userInfo?.name || "Candidate"}</h2>
                    <p style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>{userInfo?.email}</p>
                </div>

                {loading && (
                    <Skeleton
                        variant="rectangular"
                        sx={{ borderRadius: "20px" }}
                        width="100%"
                        height={280}
                    />
                )}

                {result && !loading && (
                    <div className={styles.DashboardRightTopCard} style={{ backgroundColor: "#ffffff" }}>
                        <div style={{ color: "#2e7d32", display: "flex", alignItems: "center", gap: "8px" }}>
                            <CreditScoreIcon /> Match Result
                        </div>

                        <h1 style={{ fontSize: "48px", margin: "15px 0", color: "#1976d2" }}>
                            {result.score}%
                        </h1>

                        <div style={{ textAlign: "left", fontSize: "14px", color: "#333", lineHeight: "1.5" }}>
                            <strong>Feedback:</strong>
                            <p style={{ marginTop: "6px" }}>{result.feedback}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WithAuthHOC(Dashboard);