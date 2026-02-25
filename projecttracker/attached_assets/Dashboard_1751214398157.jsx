import React from "react";

const Dashboard = () => (
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Welcome back, there!</h2>
    <div className="grid grid-cols-4 gap-4">
      <div className="p-4 border rounded shadow">Active Projects: 0</div>
      <div className="p-4 border rounded shadow">Completed Tasks: 0</div>
      <div className="p-4 border rounded shadow">Pending Tasks: 0</div>
      <div className="p-4 border rounded shadow">Productivity: 0%</div>
    </div>
  </div>
);

export default Dashboard;
