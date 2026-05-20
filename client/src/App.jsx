import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectBoard from './pages/ProjectBoard';
import Members from './pages/Members';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/board': 'Project Board',
  '/members': 'Team Members',
  '/reports': 'Analytics',
  '/settings': 'Settings',
};

import NewTaskModal from './components/task/NewTaskModal';
import CommandPalette from './components/layout/CommandPalette';

const AppLayout = ({ theme, toggleTheme }) => {
  const { user } = useAuth();
  const path = window.location.pathname;
  const [showNewTask, setShowNewTask] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleK = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleK);
    return () => window.removeEventListener('keydown', handleK);
  }, []);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <SocketProvider>
      <div className={`flex h-screen overflow-hidden ${theme === 'light' ? 'light' : ''}`}
        style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <Sidebar theme={theme} toggleTheme={toggleTheme} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex flex-col flex-1 overflow-hidden relative">
          <Navbar 
            title={PAGE_TITLES[path] || 'TaskFlow'} 
            onNewTask={() => setShowNewTask(true)} 
            onMenuClick={() => setSidebarOpen(true)}
          />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/board" element={<ProjectBoard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings theme={theme} toggleTheme={toggleTheme} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
      {showNewTask && <NewTaskModal onClose={() => setShowNewTask(false)} />}
      <CommandPalette isOpen={showCommandPalette} onClose={() => setShowCommandPalette(false)} />
    </SocketProvider>
  );
};

const App = () => {
  const [theme, setTheme] = useState('dark');
  const toggleTheme = () => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
    document.documentElement.classList.toggle('light');
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              fontSize: '13px',
              backdropFilter: 'blur(10px)',
            },
            success: {
              iconTheme: {
                primary: '#43E97B',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<AppLayout theme={theme} toggleTheme={toggleTheme} />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
