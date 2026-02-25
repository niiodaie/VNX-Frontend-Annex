import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'My Projects', path: '/projects' },
  { name: 'Tasks', path: '/tasks' },
  { name: 'Calendar', path: '/calendar' },
  { name: 'Settings', path: '/settings' }
];

function Sidebar() {
  const location = useLocation();
  return (
    <div className="w-60 bg-white border-r p-4 space-y-6">
      <h2 className="text-xl font-bold">Nexus Tracker</h2>
      <nav className="space-y-2">
        {navItems.map(item => (
          <Link
            key={item.name}
            to={item.path}
            className={\`\${location.pathname === item.path ? 'text-blue-600' : 'text-gray-700'} block px-2 py-1 hover:bg-gray-100 rounded\`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;