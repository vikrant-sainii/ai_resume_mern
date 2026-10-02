import styles from './History.module.css';
import { Skeleton } from '@mui/material';
import WithAuthHOC from '../../utils/HOC/withAuthHOC';
import { useState, useEffect, useContext } from 'react';
import axios from '../../utils/axios';
import { AuthContext } from '../../utils/AuthContext';

const History = () => {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userInfo?._id) return;
      try {
        setLoader(true);
        const res = await axios.get(`/api/resume/get/${userInfo._id}`);
        setData(res.data.data || res.data.resumes || []);
      } catch (err) {
        console.error("History fetch error:", err);
      } finally {
        setLoader(false);
      }
    };

    fetchUserData();
  }, [userInfo]);

  return (
    <div className={styles.History}>
      <div className={styles.HistoryCardBlock}>
        {loader && (
          <>
            <Skeleton
              variant="rectangular"
              width={266}
              height={200}
              sx={{ borderRadius: "20px" }}
            />
            <Skeleton
              variant="rectangular"
              width={266}
              height={200}
              sx={{ borderRadius: "20px" }}
            />
            <Skeleton
              variant="rectangular"
              width={266}
              height={200}
              sx={{ borderRadius: "20px" }}
            />
            <Skeleton
              variant="rectangular"
              width={266}
              height={200}
              sx={{ borderRadius: "20px" }}
            />
          </>
        )}

        {!loader && data.length === 0 && (
          <div style={{ padding: "40px", fontSize: "18px", color: "#666" }}>
            No past resume analyses found. Try analyzing a resume in the Dashboard!
          </div>
        )}

        {!loader &&
          data.map((item) => {
            return (
              <div key={item._id} className={styles.HistoryCard}>
                <div className={styles.cardPercentage}>{item.score}%</div>
                <p><strong>Resume Name:</strong> {item.resume_name}</p>
                <p><strong>Feedback:</strong> {item.feedback}</p>
                <p><strong>Dated:</strong> {item.createdAt ? item.createdAt.slice(0, 10) : "N/A"}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default WithAuthHOC(History);