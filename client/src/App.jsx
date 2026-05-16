import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import EmployeeDashboard from './pages/EmployeeDashboard'
import ManagerDashboard from './pages/ManagerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Goals from './pages/Goals'
import Reports from './pages/Reports'
import CheckIn from './pages/CheckIn'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        
        <Routes>

          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/employee/dashboard" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          } />

          <Route path="/employee/goals" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <Goals />
            </ProtectedRoute>
          } />

          <Route path="/employee/checkin" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <CheckIn />
            </ProtectedRoute>
          } />

          <Route path="/manager/dashboard" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <ManagerDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/reports" element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <Reports />
            </ProtectedRoute>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

