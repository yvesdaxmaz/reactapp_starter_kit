import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
const User = ({ user: { id, name, email } }) => (
  <li className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
    <div className="w-full flex items-center justify-between p-6 space-x-6">
      <div className="flex-1 truncate">
        <div className="flex items-center space-x-3">
          <Link to={`/users/${id}`}>
            <h3 className="text-gray-900 text-sm font-medium truncate">
              {name}
            </h3>
          </Link>
        </div>
        <p className="mt-1 text-gray-500 text-sm truncate">{email}</p>
      </div>
      <FaUserCircle className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" />
    </div>
  </li>
);

export default User;
