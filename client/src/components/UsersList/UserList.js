import { useStateValue } from '../../StateProvider';
import { FaUserCircle } from 'react-icons/fa';

const UsersList = props => {
  const [{ users }, dispatch] = useStateValue();
  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {users &&
        users.map(user => (
          <li
            key={user.id}
            className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
          >
            <div className="w-full flex items-center justify-between p-6 space-x-6">
              <div className="flex-1 truncate">
                <div className="flex items-center space-x-3">
                  <h3 className="text-gray-900 text-sm font-medium truncate">
                    {user.name}
                  </h3>
                </div>
                {/*
                    <p className="mt-1 text-gray-500 text-sm truncate">
                      Regional Paradigm Technician
                    </p>
                */}
              </div>
              <FaUserCircle className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" />
            </div>
          </li>
        ))}
    </ul>
  );
};

export default UsersList;
