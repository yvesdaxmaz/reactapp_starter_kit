import { useEffect } from 'react';
import Layout from './containers/Layout';
import Header from './components/Header/Header';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Users from './pages/Users/Users';
import SignUp from './pages/SignUp/SignUp';
import SignIn from './pages/SignIn/SignIn';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { useStateValue } from './StateProvider';
import { AUTHENTICATED_USER } from './actionTypes';

function App() {
  const [{ authenticated }, dispatch] = useStateValue();

  useEffect(() => {
    let authenticatedUser = localStorage.getItem('user');
    if (authenticatedUser) {
      let user = JSON.parse(authenticatedUser);
      fetch('http://localhost:3000/auth/signin_with_token', {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.code === 404) {
            let { errors } = data;
          } else {
            dispatch({
              type: AUTHENTICATED_USER,
              user: data,
            });
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
      </Routes>
    </Layout>
  );
}

export default App;
