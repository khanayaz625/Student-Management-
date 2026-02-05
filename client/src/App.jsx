import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Profile from './pages/Profile';
import DailyTask from './pages/DailyTask';
import Leaderboard from './pages/Leaderboard';
import Students from './pages/Students';
import AttendanceAdmin from './pages/AttendanceAdmin';
import './App.css';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function AppContent() {
  const { user } = useAuth();
  const { isSidebarOpen } = useTheme();

  return (
    <Router>
      <div className="app-container">
        {user && <Navbar />}
        <div className="main-layout">
          {user && <Sidebar />}
          <main className={user ? `main-content ${!isSidebarOpen ? 'collapsed' : ''}` : 'auth-content'}>
            <Routes>
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

              <Route path="/" element={
                !user ? <Landing /> : (
                  <ProtectedRoute>
                    {user?.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
                  </ProtectedRoute>
                )
              } />

              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              <Route path="/tasks" element={
                <ProtectedRoute>
                  <DailyTask />
                </ProtectedRoute>
              } />

              <Route path="/leaderboard" element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              } />

              <Route path="/students" element={
                <ProtectedRoute role="teacher">
                  <Students />
                </ProtectedRoute>
              } />

              <Route path="/attendance-admin" element={
                <ProtectedRoute role="teacher">
                  <AttendanceAdmin />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
