import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';

function App() {
    
    return (
        <Router>
            <NavBar/>
            <Routes>
                <Route path='/' element={<h1>Home Page</h1>}/>
                <Route path='/requests' element={<h1>Requests Page</h1>}/>
            </Routes>
        </Router>
    )
}

export default App;
