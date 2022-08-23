import bike from '../../images/bike.jpg'; 
const Home = props => {
    return <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Home Page</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
                <img src={bike} alt="Mern skeleton bike" />
            </div>
            <div className="px-4 py-4 sm:px-6">
                <p>Welcome to the MERN Skeleton home page.</p>
            </div>
        </div>
    </div>;
}

export default Home;
