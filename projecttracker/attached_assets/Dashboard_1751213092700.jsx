function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome to Nexus Tracker</h1>
      <p className="text-gray-600">Here's what's happening today:</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Tasks Today" value="4" />
        <StatCard label="In Progress" value="7" />
        <StatCard label="Completed" value="15" />
        <StatCard label="Upcoming" value="3" />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Active Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {["Project Alpha", "Beta Launch", "Website Revamp"].map((proj, i) => (
            <div key={i} className="p-4 border rounded shadow-sm bg-white">
              <h3 className="font-bold text-lg">{proj}</h3>
              <p className="text-sm text-gray-600">Progress: {(i + 1) * 20}%</p>
              <p className="text-xs text-gray-400">Deadline: 2025-07-{10 + i}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="p-4 bg-white rounded shadow text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

export default Dashboard;