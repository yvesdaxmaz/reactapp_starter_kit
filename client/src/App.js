import Layout from  './containers/Layout';
import Header from './components/Header/Header';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';

function App() {
  return (
      <Layout>
        <Header />
        <Routes>
            <Route path="/" element={<Home />} />
        </Routes>
      </Layout>
  );
}

export default App;
