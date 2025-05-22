import { Navigate } from 'react-router-dom';
import { authService } from '../../services/user.service';

const AdminGuard = ({ children }) => {
  const user = authService.getCurrentUser();
  
  // Check if user is logged in and has admin role
  if (!user || user.role !== 'ETMF_ADMIN') {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminGuard; 