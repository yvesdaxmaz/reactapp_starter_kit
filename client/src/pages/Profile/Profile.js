import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStateValue } from '../../StateProvider';
import UserCard from '../../components/UserCard/UserCard';

const Profile = props => {
  const [{ user, apiPath }, dispatch] = useStateValue();
  const { user_id } = useParams();

  useEffect(() => {
    fetch(`${apiPath}/api/users/${user_id}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    })
      .then(res => res.json())
      .then(data => {});
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Profile
          </h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md"></div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <UserCard user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
