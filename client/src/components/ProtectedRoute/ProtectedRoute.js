import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ authenticated }) => {
  return authenticated ? <Navigate to="/" /> : <Outlet />;
};

export default ProtectedRoute;
