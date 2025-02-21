import { Navigate, Route, Routes } from "react-router-dom";
import AdminLogin from "./pages/auth/AdminLogin";
import TeacherLogin from "./pages/auth/TeacherLogin";
import StudentLogin from "./pages/auth/StudentLogin";
import StudentSignup from "./pages/auth/StudentSignup";
import AdminDashboardLayout from "./layouts/AdminDashboardLayout";
import TeacherDashboardLayout from "./layouts/TeacherDashboardLayout";
import StudentDashboardLayout from "./layouts/StudentDashboardLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffManagement from "./pages/admin/StaffManagement";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminMessages from "./pages/admin/AdminMessages";
import StudentDashboard from "./pages/student/StudentDashboard";
import Community from "./pages/student/Community";
import StudentCreate from "./pages/student/StudentCreate";
import TeacherCreate from "./pages/teacher/TeacherCreate";
import Attendance from "./pages/teacher/Attendance";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import { UnauthenticatedRoute } from "./routes/UnauthenticatedRoute";
import RegistrationDashboard from "./pages/auth/RegistrationDashboard";

const App = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<RegistrationDashboard />} />
      <Route
        path="/"
        element={
          <UnauthenticatedRoute role="admin">
            <AdminLogin />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path="/"
        element={<TeacherLogin />}
      />
      <Route
        path="/"
        element={<StudentLogin />}
      />
      <Route
        path="/student/signup"
        element={<StudentSignup />}
      />

      {/* Admin Dashboard Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="staffroom" element={<StaffManagement />} />
        <Route path="messages" element={<AdminMessages />} />
        {/* Add other admin routes */}
      </Route>

      {/* Teacher Dashboard Routes */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute role="teacher">
            <TeacherDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TeacherDashboard />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="create" element={<TeacherCreate />} />
        {/* Add other teacher routes */}
      </Route>

      {/* Student Dashboard Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute role="student">
            <StudentDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="community" element={<Community />} />
        <Route path="create" element={<StudentCreate />} />
        {/* Add other student routes */}
      </Route>

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/admin/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Protected Route Component (create this in components/auth/ProtectedRoute.jsx)
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem(`${role}Token`);
  if (!token) {
    return <Navigate to={`/${role}/login`} replace />;
  }
  return children;
};

// Not Found Component (create this in components/NotFound.jsx)
const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
    </div>
  );
};

export default App;
