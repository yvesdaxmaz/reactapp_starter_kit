import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../InputField/InputField';
import { AUTHENTICATED_USER } from '../../actionTypes';
import { useStateValue } from '../../StateProvider';

const SignInForm = props => {
  const [{ apiPath }, dispatch] = useStateValue();
  const [isValid, setIsValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [authError, setAuthError] = useState('');
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = e => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleAuthenticateUser = e => {
    e.preventDefault();

    if (userData.email != '' && userData.password != '') {
      setIsValid(true);
    }

    if (isValid && !isSubmitted) {
      authenticateUser();
    }
  };

  const authenticateUser = () => {
    setIsSubmitted(true);
    fetch(`${apiPath}/auth/signin`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(res => res.json())
      .then(data => {
        if (data.code === 404) {
          let { errors } = data;
          setAuthError(data.message);
        } else {
          setAuthError('');

          setUserData({
            email: '',
            password: '',
          });

          dispatch({
            type: AUTHENTICATED_USER,
            user: data,
          });

          localStorage.setItem('user', JSON.stringify(data));
          navigate('/', { replace: true });

          setIsSubmitted(false);
        }
      });
  };

  let { email, password } = userData;
  return (
    <form method="post" className="space-y-6">
      <InputField
        name="email"
        type="email"
        value={email}
        handleChange={handleChange}
      />

      <InputField
        name="password"
        type="password"
        value={password}
        error={authError}
        handleChange={handleChange}
      />

      <div>
        <button
          onClick={handleAuthenticateUser}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign in
        </button>
      </div>
    </form>
  );
};

export default SignInForm;
