import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, isAdmin } from './context/AuthContext';
import { TermProvider } from './context/TermContext';
import { ProgramProvider } from './context/ProgramContext';
import LoginPage from './components/LoginPage';
import MainScreen from './components/MainScreen';
import StatsScreen from './components/StatsScreen';
import AdminScreen from './components/AdminScreen';

function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { isLoggedIn, user } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!isAdmin(user)) return <Navigate to="/" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainScreen />
          </PrivateRoute>
        }
      />
      <Route
        path="/stats"
        element={
          <PrivateRoute>
            <StatsScreen />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminScreen />
          </AdminRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TermProvider>
          <ProgramProvider>
            <AppRoutes />
          </ProgramProvider>
        </TermProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
