import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Create from './pages/Create';
import Saved from './pages/Saved';
import Navbar from './components/Navbar';
function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/auth' element={<Auth />} />
          <Route path='/create' element={<Create />} />
          <Route path='/saved' element={<Saved/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
