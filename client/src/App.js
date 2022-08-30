import { useEffect } from 'react';
import Layout from './containers/Layout';
import Header from './components/Header/Header';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Users from './pages/Users/Users';
import SignUp from './pages/SignUp/SignUp';
import SignIn from './pages/SignIn/SignIn';
import { useStateValue } from './StateProvider';
import { AUTHENTICATED_USER } from './actionTypes';

function ProtectedRoute({ authenticated }) {
  return !authenticated ? <Outlet /> : <Navigate to="/" />;
}

function App() {
  const [{ authenticated }, dispatch] = useStateValue();

  useEffect(() => {
    let authenticatedUser = localStorage.getItem('user');
    if (authenticatedUser) {
      dispatch({
        type: AUTHENTICATED_USER,
        user: JSON.parse(authenticatedUser),
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
