import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from './containers/Layout';
import Header from './components/Header/Header';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Users from './pages/Users/Users';
import SignUp from './pages/SignUp/SignUp';
import SignIn from './pages/SignIn/SignIn';
import Profile from './pages/Profile/Profile';
import EditProfile from './pages/EditProfile/EditProfile';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { useStateValue } from './StateProvider';
import { AUTHENTICATED_USER } from './actionTypes';

function App() {
  const [{ authenticated, apiPath }, dispatch] = useStateValue();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let authenticatedUser = localStorage.getItem('user');
    if (!authenticated && authenticatedUser) {
      let user = JSON.parse(authenticatedUser);
      fetch(`${apiPath}/auth/signin_with_token`, {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.code === 404) {
            let { errors } = data;
            localStorage.removeItem('user');
          } else {
            dispatch({
              type: AUTHENTICATED_USER,
              user: data,
            });
            navigate(pathname);
          }
        });
    }
  }, []);
  return (
    <Layout>
      <Header />
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route
          path="/"
          element={<ProtectedRoute authenticated={authenticated} />}
        >
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Route>
        <Route
          path="/users/:user_id"
          element={<PrivateRoute authenticated={authenticated} />}
        >
          <Route path="/users/:user_id" element={<Profile />} />
        </Route>
        <Route
          path="/users/:user_id/edit"
          element={<PrivateRoute authenticated={authenticated} />}
        >
          <Route path="/users/:user_id/edit" element={<EditProfile />} />
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;
