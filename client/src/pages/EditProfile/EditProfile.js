import { useEffect, useState } from 'react';
import { useStateValue } from '../../StateProvider';
import InputField from '../../components/InputField/InputField';
const EditProfile = props => {
  const [isValid, setIsValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [{ user: authenticatedUser }, dispatch] = useStateValue();

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

  const checkEmail = email => {
    const res = /^(([^<>()\[\]\\.:\s@"]+(\.[^<>()\[\]\\.:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return res.test(String(email).toLowerCase());
  };

  const handleUpdateUser = e => {
    e.preventDefault();

    validateName();
    validateEmail();
    if (
      formErrors.name === null &&
      formErrors.email === null &&
      userData.name != '' &&
      userData.email != ''
    ) {
      setIsValid(true);
    }
    if (isValid && !isSubmitted) {
      updateUser();
    }
  };
  const updateUser = () => {
    fetch(`http://localhost:3000/api/users/${authenticatedUser.user.id}`, {
      method: 'put',
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

  useEffect(() => {
    setUserData(prev => {
      return {
        ...prev,
        name: authenticatedUser.user.name,
        email: authenticatedUser.user.email,
      };
    });
  }, []);

  let { name, email, password } = userData;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Edit Profile
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md"></div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <form method="post" className="space-y-6">
                <InputField
                  name="name"
                  type="text"
                  value={name}
                  error={formErrors.name}
                  handleChange={handleChange}
                />

                <InputField
                  name="email"
                  type="email"
                  value={email}
                  errors={formErrors.email}
                  handleChange={handleChange}
                />

                <InputField
                  name="password"
                  type="password"
                  value={password}
                  error={formErrors.password}
                  handleChange={handleChange}
                />

                <div>
                  <button
                    onClick={handleUpdateUser}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditProfile;
