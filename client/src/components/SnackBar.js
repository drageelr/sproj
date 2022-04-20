import React from 'react';
import { Snackbar, Slide } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
}
  
function SnackBar({snackbar, setSnackbar}) {

    function handleSnackbarClose() {
        setSnackbar({msg: '', type: ''});
    }

    return (
        <Snackbar open={snackbar.msg !== ''} TransitionComponent={TransitionDown} onClose={handleSnackbarClose} anchorOrigin={{vertical: 'top', horizontal: 'center'}} autoHideDuration={6000} sx={{pt: 8}}>
            <Alert onClose={handleSnackbarClose} severity={snackbar.type}>
                {snackbar.msg}
            </Alert>
        </Snackbar>
    );
}
  
export default SnackBar;