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
                <Route path='/request-list' element={<h1>Requests Page</h1>}/>
                <Route path='/request'/>
                <Route path='/pass'/>
            </Routes>
        </Router>
    )
}

export default App;
