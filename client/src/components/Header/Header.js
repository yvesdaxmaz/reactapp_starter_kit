import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdHome } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';
import { useStateValue } from '../../StateProvider';
import { SIGNOUT_USER } from '../../actionTypes';
const Header = props => {
  const [{ name, authenticated, user }, dispatch] = useStateValue();
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const profileOptionsRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleShowOptions = () => {
    setShowProfileOptions(prev => !showProfileOptions);
  };

  const hideProfileOptions = event => {
    if (
      profileOptionsRef.current &&
      !profileOptionsRef.current.contains(event.target)
    ) {
      setShowProfileOptions(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('user');

    dispatch({
      type: SIGNOUT_USER,
    });

    setShowProfileOptions(false);

    navigate('/', { replace: true });
  };
  useEffect(() => {
    window.addEventListener('mousedown', hideProfileOptions);
    return () => {
      window.removeEventListener('mousedown', () => {});
    };
  }, []);

  return (
    <header>
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  className="hidden h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex-shrink-0 flex items-center">
                <Link
                  to="/"
                  role="logo"
                  className={
                    pathname === '/'
                      ? 'flex space-x-2 items-center text-2xl font-bold text-red-600'
                      : 'flex space-x-2 items-center text-2xl font-bold text-white'
                  }
                >
                  <span>{name}</span>
                  <MdHome />
                </Link>
              </div>
              <div className="hidden sm:block sm:ml-6">
                <div className="flex space-x-4">
                  <Link
                    to="/users"
                    className={
                      pathname === '/users'
                        ? 'bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                    }
                    aria-current="page"
                  >
                    Users
                  </Link>
                  {!authenticated && (
                    <>
                      <Link
                        to="/signup"
                        className={
                          pathname === '/signup'
                            ? 'bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                        }
                      >
                        Sign Up
                      </Link>
                      <Link
                        to="/signin"
                        className={
                          pathname === '/signin'
                            ? 'bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                        }
                      >
                        Sign In
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                type="button"
                className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <span className="sr-only">View notifications</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>

              {authenticated && (
                <div className="ml-3 relative">
                  <div>
                    <button
                      type="button"
                      className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                      id="user-menu-button"
                      onClick={handleShowOptions}
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </button>
                  </div>
                  <div
                    className={`${
                      showProfileOptions
                        ? 'transition ease-out duration-100 opacity-100 scale-100'
                        : 'transition ease-in duration-75 opacity-0 scale-95'
                    }  origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                    ref={profileOptionsRef}
                  >
                    <Link
                      to={`/users/${user.user.id}`}
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      tabIndex="-1"
                      id="user-menu-item-0"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/"
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      tabIndex="-1"
                      id="user-menu-item-1"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      tabIndex="-1"
                      id="user-menu-item-2"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/users"
              className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
              aria-current="page"
            >
              Users
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
