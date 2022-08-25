import { useStateValue } from '../../StateProvider';
import User from './User/User';

const UsersList = props => {
  const [{ users }, dispatch] = useStateValue();

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6"
    >
      {users && users.map(user => <User user={user} key={user.id} />)}
    </ul>
  );
};

export default UsersList;
