import { useState, useEffect } from 'react';
import { AUTH_SIGNUP_USER } from '../../actionTypes';

const SignUp = props => {
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
    setUserData(prev => {
      return { ...prev, [e.target.name]: e.target.value };
    });
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
      formErrors.password === null
    ) {
      setIsValid(prev => !prev);
    }

    if (isValid && !isSubmitted) {
      registerUser();
    }
  };
  const registerUser = () => {
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
          console.log(data.message);
        }
      });
  };

  const checkEmail = email => {
    const res = /^(([^<>()\[\]\\.:\s@"]+(\.[^<>()\[\]\\.:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return res.test(String(email).toLowerCase());
  };

  useEffect(() => {
    console.count('render');
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Sign Up
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <img
                className="mx-auto h-12 w-auto"
                src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
                alt="Workflow"
              />
              <h2 className="mt-6 text-center text-3xl tracking-tight font-bold text-gray-900">
                Register a new account
              </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form method="post" className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="name"
                        value={userData.name}
                        onChange={handleChange}
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    {formErrors.name && (
                      <p className="mt-2 text-sm text-red-600" id="name-error">
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        value={userData.email}
                        onChange={handleChange}
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    {formErrors.email && (
                      <p className="mt-2 text-sm text-red-600" id="name-error">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        value={userData.password}
                        onChange={handleChange}
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    {formErrors.password && (
                      <p className="mt-2 text-sm text-red-600" id="name-error">
                        {formErrors.password}
                      </p>
                    )}
                  </div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
