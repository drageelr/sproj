import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import SnackBar from './components/SnackBar';
import Home from './components/Home';
import RequestList from './components/RequestList';
import Request from './components/Request';
import Pass from './components/Pass';

function App() {
    const [snackbar, setSnackbar] = useState({msg: '', type: ''});
    const [requestId, setRequestId] = useState(undefined);
    const [passId, setPassId] = useState(undefined);

    const resetStates = () => {
        setRequestId(undefined);
        setPassId(undefined);
    }

    return (
        <Router>
            <NavBar resetStates={resetStates}/>
            <SnackBar snackbar={snackbar} setSnackbar={setSnackbar}/>
            <Routes>
                <Route path='/' element={<Home setSnackbar={setSnackbar} setRequestId={setRequestId}/>}/>
                <Route path='/request-list' element={<RequestList setSnackbar={setSnackbar} setRequestId={setRequestId}/>}/>
                <Route path='/request' element={<Request setSnackbar={setSnackbar} requestId={requestId} setRequestId={setRequestId} setPassId={setPassId}/>}/>
                <Route path='/pass' element={<Pass setSnackbar={setSnackbar} requestId={requestId} setRequestId={setRequestId} passId={passId} setPassId={setPassId}/>}/>
            </Routes>
        </Router>
    )
}

export default App;
