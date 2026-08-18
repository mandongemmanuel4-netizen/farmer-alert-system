import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import { RegisterProvider } from './context/RegisterContext';
import DeviceFrame from './components/common/DeviceFrame';

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
import VillagesManagement from './pages/admin/VillagesManagement';
import SecurityPosts from './pages/admin/SecurityPosts';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';
import ActivityLogs from './pages/admin/ActivityLogs';
import Settings from './pages/admin/Settings';

// Small helper so route definitions below stay readable —
// wraps a page in the desktop DeviceFrame without touching the page's own JSX/CSS at all.
const framed = (el) => <DeviceFrame>{el}</DeviceFrame>;

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={framed(<Splash />)} />
      <Route path="/welcome" element={framed(<Welcome />)} />
      <Route path="/register" element={framed(<RegisterProvider><RegisterStep1 /></RegisterProvider>)} />
      <Route path="/register/location" element={framed(<RegisterProvider><RegisterStep2 /></RegisterProvider>)} />
      <Route path="/register/pin" element={framed(<RegisterProvider><CreatePin /></RegisterProvider>)} />
      <Route path="/login" element={framed(<Login />)} />

      {/* Farmer portal */}
      <Route path="/farmer" element={framed(<ProtectedRoute allowedRoles={['farmer']}><FarmerDashboard /></ProtectedRoute>)} />
      <Route path="/farmer/farms" element={framed(<ProtectedRoute allowedRoles={['farmer']}><MyFarms /></ProtectedRoute>)} />
      <Route path="/farmer/farms/add" element={framed(<ProtectedRoute allowedRoles={['farmer']}><AddFarm /></ProtectedRoute>)} />
      <Route path="/farmer/contacts" element={framed(<ProtectedRoute allowedRoles={['farmer']}><EmergencyContacts /></ProtectedRoute>)} />
      <Route path="/farmer/checkin" element={framed(<ProtectedRoute allowedRoles={['farmer']}><CheckIn /></ProtectedRoute>)} />
      <Route path="/farmer/session" element={framed(<ProtectedRoute allowedRoles={['farmer']}><ActiveSession /></ProtectedRoute>)} />
      <Route path="/farmer/history" element={framed(<ProtectedRoute allowedRoles={['farmer']}><History /></ProtectedRoute>)} />
      <Route path="/farmer/profile" element={framed(<ProtectedRoute allowedRoles={['farmer']}><Profile /></ProtectedRoute>)} />
      <Route path="/farmer/change-pin" element={framed(<ProtectedRoute allowedRoles={['farmer']}><ChangePin /></ProtectedRoute>)} />

      {/* Coordinator (CSO) portal */}
      <Route path="/coordinator" element={framed(<ProtectedRoute allowedRoles={['coordinator']}><CsoDashboard /></ProtectedRoute>)} />
      <Route path="/coordinator/farmers" element={framed(<ProtectedRoute allowedRoles={['coordinator']}><ActiveFarmers /></ProtectedRoute>)} />
      <Route path="/coordinator/farmers/:id" element={framed(<ProtectedRoute allowedRoles={['coordinator']}><FarmerDetails /></ProtectedRoute>)} />
      <Route path="/coordinator/map" element={framed(<ProtectedRoute allowedRoles={['coordinator']}><LiveMap /></ProtectedRoute>)} />
      <Route path="/coordinator/alerts" element={framed(<ProtectedRoute allowedRoles={['coordinator']}><AlertsList /></ProtectedRoute>)} />
      <Route path="/coordinator/alerts/:id" element={framed(<ProtectedRoute allowedRoles={['coordinator']}><AlertDetails /></ProtectedRoute>)} />
      <Route path="/coordinator/reports" element={framed(<ProtectedRoute allowedRoles={['coordinator']}><CsoReports /></ProtectedRoute>)} />
      <Route path="/coordinator/profile" element={framed(<ProtectedRoute allowedRoles={['coordinator']}><CsoProfile /></ProtectedRoute>)} />

      {/* Admin portal — NOT wrapped in DeviceFrame; it already has its own desktop sidebar layout */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/farmers" element={<ProtectedRoute allowedRoles={['admin']}><FarmersList /></ProtectedRoute>} />
      <Route path="/admin/csos" element={<ProtectedRoute allowedRoles={['admin']}><CSOsList /></ProtectedRoute>} />
      <Route path="/admin/states" element={<ProtectedRoute allowedRoles={['admin']}><StatesManagement /></ProtectedRoute>} />
      <Route path="/admin/lgas" element={<ProtectedRoute allowedRoles={['admin']}><LGAsManagement /></ProtectedRoute>} />
      <Route path="/admin/wards" element={<ProtectedRoute allowedRoles={['admin']}><WardsManagement /></ProtectedRoute>} />
      <Route path="/admin/villages" element={<ProtectedRoute allowedRoles={['admin']}><VillagesManagement /></ProtectedRoute>} />
      <Route path="/admin/security-posts" element={<ProtectedRoute allowedRoles={['admin']}><SecurityPosts /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><ReportsAnalytics /></ProtectedRoute>} />
      <Route path="/admin/logs" element={<ProtectedRoute allowedRoles={['admin']}><ActivityLogs /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><Settings /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
