import React, { useState, useEffect, useCallback } from "react";
import { db } from "../../firebase/firebaseConfig";
import { doc, setDoc, collection, getDocs } from "firebase/firestore"; // removed getDoc
import JobCard from "./JobCard";

const JobAlertPage = ({ userId }) => {
  const [keyword, setKeyword] = useState("developer");
  const [location, setLocation] = useState("remote");
  const [frequency, setFrequency] = useState("daily");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch latest job alerts from Firestore
  const fetchJobs = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const jobsRef = collection(db, "users", userId, "job_alerts");
      const snapshot = await getDocs(jobsRef);
      const jobsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobs(jobsData);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Save user preferences to Firestore
  const savePreferences = async () => {
    if (!userId) return;
    try {
      await setDoc(doc(db, "users", userId, "job_preferences", "alert"), {
        keyword,
        location,
        frequency,
        createdAt: new Date().toISOString(),
      });
      alert("✅ Preferences saved! Jobs will update automatically.");
      fetchJobs();
    } catch (err) {
      console.error("Error saving preferences:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">🎯 Job Alerts</h1>

        {/* Preference Form */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Keyword (e.g. Python Developer)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="p-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Location (e.g. Remote)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="p-2 border rounded-md"
          />
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <button
          onClick={savePreferences}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          💾 Save Preferences
        </button>

        {/* Job Results */}
        <h2 className="text-xl font-semibold mt-8 mb-3 text-gray-700">
          Latest Jobs
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.slice(0, 10).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No jobs found yet. Try saving preferences!</p>
        )}
      </div>
    </div>
  );
};

export default JobAlertPage;
