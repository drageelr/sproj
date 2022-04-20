import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';

function App() {
    
    return (
        <Router>
            <NavBar/>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/requests' element={<h1>Requests Page</h1>}/>
            </Routes>
        </Router>
    )
}

export default App;
