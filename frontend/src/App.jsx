import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import { RegisterProvider } from './context/RegisterContext';

// Shared
import Login from './pages/shared/Login';

// Farmer portal
import Splash from './pages/farmer/Splash';
import Welcome from './pages/farmer/Welcome';
import RegisterStep1 from './pages/farmer/RegisterStep1';
import RegisterStep2 from './pages/farmer/RegisterStep2';
import CreatePin from './pages/farmer/CreatePin';
import FarmerDashboard from './pages/farmer/Dashboard';
import MyFarms from './pages/farmer/MyFarms';
import AddFarm from './pages/farmer/AddFarm';
import EmergencyContacts from './pages/farmer/EmergencyContacts';
import CheckIn from './pages/farmer/CheckIn';
import ActiveSession from './pages/farmer/ActiveSession';
import History from './pages/farmer/History';
import Profile from './pages/farmer/Profile';
import ChangePin from './pages/farmer/ChangePin';

// Coordinator (CSO) portal
import CsoDashboard from './pages/coordinator/Dashboard';
import ActiveFarmers from './pages/coordinator/ActiveFarmers';
import LiveMap from './pages/coordinator/LiveMap';
import AlertsList from './pages/coordinator/AlertsList';
import AlertDetails from './pages/coordinator/AlertDetails';
import FarmerDetails from './pages/coordinator/FarmerDetails';
import CsoReports from './pages/coordinator/Reports';
import CsoProfile from './pages/coordinator/Profile';

// Admin portal
import AdminDashboard from './pages/admin/Dashboard';
import FarmersList from './pages/admin/FarmersList';
import CSOsList from './pages/admin/CSOsList';
import StatesManagement from './pages/admin/StatesManagement';
import LGAsManagement from './pages/admin/LGAsManagement';
import WardsManagement from './pages/admin/WardsManagement';
import SecurityPosts from './pages/admin/SecurityPosts';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';
import ActivityLogs from './pages/admin/ActivityLogs';
import Settings from './pages/admin/Settings';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Splash />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/register" element={<RegisterProvider><RegisterStep1 /></RegisterProvider>} />
      <Route path="/register/location" element={<RegisterProvider><RegisterStep2 /></RegisterProvider>} />
      <Route path="/register/pin" element={<RegisterProvider><CreatePin /></RegisterProvider>} />
      <Route path="/login" element={<Login />} />

      {/* Farmer portal */}
      <Route path="/farmer" element={<ProtectedRoute allowedRoles={['farmer']}><FarmerDashboard /></ProtectedRoute>} />
      <Route path="/farmer/farms" element={<ProtectedRoute allowedRoles={['farmer']}><MyFarms /></ProtectedRoute>} />
      <Route path="/farmer/farms/add" element={<ProtectedRoute allowedRoles={['farmer']}><AddFarm /></ProtectedRoute>} />
      <Route path="/farmer/contacts" element={<ProtectedRoute allowedRoles={['farmer']}><EmergencyContacts /></ProtectedRoute>} />
      <Route path="/farmer/checkin" element={<ProtectedRoute allowedRoles={['farmer']}><CheckIn /></ProtectedRoute>} />
      <Route path="/farmer/session" element={<ProtectedRoute allowedRoles={['farmer']}><ActiveSession /></ProtectedRoute>} />
      <Route path="/farmer/history" element={<ProtectedRoute allowedRoles={['farmer']}><History /></ProtectedRoute>} />
      <Route path="/farmer/profile" element={<ProtectedRoute allowedRoles={['farmer']}><Profile /></ProtectedRoute>} />
      <Route path="/farmer/change-pin" element={<ProtectedRoute allowedRoles={['farmer']}><ChangePin /></ProtectedRoute>} />

      {/* Coordinator (CSO) portal */}
      <Route path="/coordinator" element={<ProtectedRoute allowedRoles={['coordinator']}><CsoDashboard /></ProtectedRoute>} />
      <Route path="/coordinator/farmers" element={<ProtectedRoute allowedRoles={['coordinator']}><ActiveFarmers /></ProtectedRoute>} />
      <Route path="/coordinator/farmers/:id" element={<ProtectedRoute allowedRoles={['coordinator']}><FarmerDetails /></ProtectedRoute>} />
      <Route path="/coordinator/map" element={<ProtectedRoute allowedRoles={['coordinator']}><LiveMap /></ProtectedRoute>} />
      <Route path="/coordinator/alerts" element={<ProtectedRoute allowedRoles={['coordinator']}><AlertsList /></ProtectedRoute>} />
      <Route path="/coordinator/alerts/:id" element={<ProtectedRoute allowedRoles={['coordinator']}><AlertDetails /></ProtectedRoute>} />
      <Route path="/coordinator/reports" element={<ProtectedRoute allowedRoles={['coordinator']}><CsoReports /></ProtectedRoute>} />
      <Route path="/coordinator/profile" element={<ProtectedRoute allowedRoles={['coordinator']}><CsoProfile /></ProtectedRoute>} />

      {/* Admin portal */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/farmers" element={<ProtectedRoute allowedRoles={['admin']}><FarmersList /></ProtectedRoute>} />
      <Route path="/admin/csos" element={<ProtectedRoute allowedRoles={['admin']}><CSOsList /></ProtectedRoute>} />
      <Route path="/admin/states" element={<ProtectedRoute allowedRoles={['admin']}><StatesManagement /></ProtectedRoute>} />
      <Route path="/admin/lgas" element={<ProtectedRoute allowedRoles={['admin']}><LGAsManagement /></ProtectedRoute>} />
      <Route path="/admin/wards" element={<ProtectedRoute allowedRoles={['admin']}><WardsManagement /></ProtectedRoute>} />
      <Route path="/admin/security-posts" element={<ProtectedRoute allowedRoles={['admin']}><SecurityPosts /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><ReportsAnalytics /></ProtectedRoute>} />
      <Route path="/admin/logs" element={<ProtectedRoute allowedRoles={['admin']}><ActivityLogs /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><Settings /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}