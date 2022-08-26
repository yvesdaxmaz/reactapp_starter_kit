import SignUpForm from '../../components/SignUpForm/SignUpForm';

const SignUp = props => {
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
                <SignUpForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
