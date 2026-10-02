import React, { useState, useEffect } from 'react';
import styles from './Admin.module.css';
import { Skeleton } from '@mui/material';
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import axios from '../../utils/axios';

const Admin = () => {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoader(true);
        const res = await axios.get('/api/resume/get');
        setData(res.data.data || res.data.resumes || []);
      } catch (err) {
        console.error("Admin data fetch error:", err);
      } finally {
        setLoader(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className={styles.Admin}>
      <div className={styles.AdminBlock}>
        {loader && (
          <>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={300}
              sx={{ borderRadius: "20px" }}
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={300}
              sx={{ borderRadius: "20px" }}
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={300}
              sx={{ borderRadius: "20px" }}
            />
          </>
        )}

        {!loader && data.length === 0 && (
          <div style={{ padding: "40px", fontSize: "18px", color: "#666", gridColumn: "1 / -1" }}>
            No candidate resume records found across the platform.
          </div>
        )}

        {!loader &&
          data.map((item) => {
            const userObj = item.user && typeof item.user === 'object' ? item.user : null;
            return (
              <div key={item._id} className={styles.AdminCard} style={{ backgroundColor: "#fff" }}>
                {userObj?.photoUrl && (
                  <img
                    src={userObj.photoUrl}
                    alt={userObj.name}
                    style={{ width: "60px", height: "60px", borderRadius: "50%", marginBottom: "10px" }}
                  />
                )}
                <h3 style={{ margin: "0 0 6px 0", color: "#1976d2" }}>{userObj?.name || "Anonymous Candidate"}</h3>
                <p style={{ margin: "4px 0", fontSize: "13px", color: "#555" }}>{userObj?.email}</p>
                <div style={{ fontSize: "24px", fontWeight: "bold", color: "#2e7d32", margin: "10px 0" }}>
                  Match Score: {item.score}%
                </div>
                <p style={{ fontSize: "14px", margin: "6px 0" }}><strong>Resume:</strong> {item.resume_name}</p>
                <p style={{ fontSize: "13px", color: "#444", maxHeight: "100px", overflow: "auto" }}>
                  <strong>Feedback:</strong> {item.feedback}
                </p>
                <p style={{ fontSize: "12px", color: "#888", marginTop: "10px" }}>
                  Submitted: {item.createdAt ? item.createdAt.slice(0, 10) : "N/A"}
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default WithAuthHOC(Admin);