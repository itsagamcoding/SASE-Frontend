import React from 'react';
import AssignedTasks from './AssignedTasks';
import TaskIcons from './TaskIcons';
import Timeline from './Timeline';

const Home = ({ auth, user }) => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Dashboard</h1>

        {/* Top Section - Two components side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AssignedTasks auth={auth} user={user} />
          <TaskIcons />
        </div>
        
        {/* Bottom Section - Timeline component full width */}
        <div className="w-full">
          <Timeline auth={auth} user={user}/>
        </div>
      </div>
    </div>
  );
};

export default Home;
