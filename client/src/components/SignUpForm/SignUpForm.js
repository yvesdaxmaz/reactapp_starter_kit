import { useState } from 'react';
import InputField from './InputField/InputField';

const SignUpForm = props => {
  const [isValid, setIsValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: null,
    email: null,
    password: null,
  });
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = e => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const validateName = () => {
    if (userData.name === '') {
      setFormErrors(prev => {
        return { ...prev, name: 'Name is required' };
      });
    } else {
      setFormErrors(prev => {
        return { ...prev, name: null };
      });
    }
  };

  const validateEmail = () => {
    if (userData.email === '') {
      setFormErrors(prev => {
        return { ...prev, email: 'Email is required' };
      });
    } else if (!checkEmail(userData.email)) {
      setFormErrors(prev => {
        return { ...prev, email: 'Provide a valid email address.' };
      });
    } else {
      setFormErrors(prev => {
        return { ...prev, email: null };
      });
    }
  };

  const validatePassword = () => {
    if (userData.password.length < 6) {
      setFormErrors(prev => {
        return {
          ...prev,
          password: 'Your password must have at least 6 characters.',
        };
      });
    } else {
      setFormErrors(prev => {
        return { ...prev, password: null };
      });
    }
  };

  const handleRegisterUser = e => {
    e.preventDefault();

    validateName();
    validateEmail();
    validatePassword();

    if (
      formErrors.name === null &&
      formErrors.email === null &&
      formErrors.password === null &&
      userData.name != '' &&
      userData.email != '' &&
      userData.password != ''
    ) {
      setIsValid(true);
    }
    if (isValid && !isSubmitted) {
      registerUser();
    }
  };

  const registerUser = () => {
    setIsSubmitted(true);
    fetch('http://localhost:3000/api/users', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(res => res.json())
      .then(data => {
        if (data.code === 400 || data.code === 409) {
          let { errors } = data;
          Object.keys(errors).forEach(error => {
            setFormErrors(prev => {
              return { ...prev, [error]: errors[error].errors[0] };
            });
          });
        } else {
          setFormErrors({
            name: null,
            email: null,
            password: null,
          });

          setUserData({
            name: '',
            email: '',
            password: '',
          });
          setIsSubmitted(false);
        }
      });
  };

  const checkEmail = email => {
    const res = /^(([^<>()\[\]\\.:\s@"]+(\.[^<>()\[\]\\.:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return res.test(String(email).toLowerCase());
  };

  return (
    <form method="post" className="space-y-6">
      <InputField
        name="name"
        type="text"
        value={userData.name}
        error={formErrors.name}
        handleChange={handleChange}
      />

      <InputField
        name="email"
        type="email"
        value={userData.email}
        error={formErrors.email}
        handleChange={handleChange}
      />

      <InputField
        name="password"
        type="password"
        value={userData.password}
        error={formErrors.password}
        handleChange={handleChange}
      />

      <div>
        <button
          type="submit"
          onClick={handleRegisterUser}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default SignUpForm;
