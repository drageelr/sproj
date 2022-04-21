import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import SnackBar from './components/SnackBar';
import Home from './components/Home';
import RequestList from './components/RequestList';
function App() {
    const [snackbar, setSnackbar] = useState({msg: '', type: ''});
    const [requestId, setRequestId] = useState(undefined);

    return (
        <Router>
            <NavBar/>
            <SnackBar snackbar={snackbar} setSnackbar={setSnackbar}/>
            <Routes>
                <Route path='/' element={<Home setSnackbar={setSnackbar}/>}/>
                <Route path='/request-list' element={<RequestList setSnackbar={setSnackbar} setRequestId={setRequestId}/>}/>
                <Route path='/request'/>
                <Route path='/pass'/>
            </Routes>
        </Router>
    )
}

export default App;
