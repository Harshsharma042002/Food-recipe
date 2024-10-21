import React, { useState } from 'react';
import { useCookies } from "react-cookie";
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [cookies, setCookies, removeCookie] = useCookies(['access_token']);
  const [showLinks, setShowLinks] = useState(false); 
  
  const toggleLinks = () => {
    setShowLinks(!showLinks);
  }
  
  const logout = () => {
    removeCookie("access_token", { path: '/' });  
    window.localStorage.removeItem("userID");
    navigate('/auth');
  }
  
  return (
    <div className="navbar">
      <div className="navbar-header">
        <button className="navbar-toggle" onClick={toggleLinks}>
          Menu
        </button>
      </div>
      <div className={`navbar-links ${showLinks ? 'active' : ''}`}>
        <Link to='/' onClick={toggleLinks}>Home</Link>
        <Link to='/create' onClick={toggleLinks}>Create</Link>
        {cookies.access_token && <Link to='/saved' onClick={toggleLinks}>Saved</Link>}
        {!cookies.access_token ? (
          <Link to='/auth' onClick={toggleLinks}>Login</Link>
        ) : (
          <button onClick={logout}>Logout</button>  
        )}
      </div>
    </div>
  );
}

export default Navbar;



