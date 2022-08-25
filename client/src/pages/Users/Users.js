import { useEffect } from 'react';
import { FETCH_USERS_LIST } from '../../actionTypes';
import { useStateValue } from '../../StateProvider';

const Users = props => {
  const [{ users }, dispatch] = useStateValue();
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetch('http://localhost:3000/api/users', { method: 'get', signal })
      .then(response => response.json())
      .then(users => {
        dispatch({ type: FETCH_USERS_LIST, users });
      })
      .catch(err => {
        console.log(err);
      });
    return () => {
      console.log('request aborted');
      controller.abort();
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            All Users
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6"></div>
      </div>
    </div>
  );
};

export default Users;
