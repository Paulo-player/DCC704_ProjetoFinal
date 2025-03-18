import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Username</label>
            <p className="mt-1 text-lg text-gray-900">{user?.username}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600">Account Created</label>
            <p className="mt-1 text-lg text-gray-900">
              {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={logout}
            className="mt-6 w-full sm:w-auto px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage