import React from "react";

const JobCard = ({ job }) => {
  return (
    <div className="border p-4 rounded-xl shadow-sm bg-white hover:shadow-md transition duration-200">
      <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
      <p className="text-gray-600">{job.company}</p>
      <p className="text-sm text-gray-500">{job.location}</p>
      <div className="flex justify-between mt-2">
        <span className="text-xs text-blue-600 font-semibold">{job.source}</span>
        <span className="text-xs text-gray-400">{job.date}</span>
      </div>
      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-3 text-sm text-blue-500 hover:underline"
      >
        🔗 View Job
      </a>
    </div>
  );
};

export default JobCard;
