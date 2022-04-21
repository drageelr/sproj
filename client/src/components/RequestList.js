import { useState, useEffect } from 'react';
import { Card, CardContent, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { apiCaller } from '../apiCaller';
import EnhancedTable from './EnhancedTable';

const colorText1 = '#fcfefe';
const colorText2 = '#97989c';
const colorText3 = '#b0b4be';
const colorPrimary = '#00abc6';
const colorSecondary = '#282835';
const colorTertiary = '#1d2027';
const colorQuaternary = '#17c0dc';
const colorQuinary = '#277a8f';

const headCells = [
    {
      id: 'id',
      label: 'ID',
    },
    {
      id: 'maxPasses',
      label: 'Max Passes',
    },
    {
      id: 'completed',
      label: 'Completed',
    },
    {
        id: 'createdAt',
        label: 'Created At'
    },
    {
      id: 'completedAt',
      label: 'Completed At',
    },
    {
      id: 'view',
      label: 'View',
    }
];

const keys = {
    id: 'value',
    maxPasses: 'value',
    completed: 'boolean',
    createdAt: 'value',
    completedAt: 'value',
    view: 'button'
}

function RequestList({setRequestId, setSnackbar}) {
    const [rows, setRows] = useState([]); // {id: 1, maxPasses: 5, completed: 1, completedAt: '01-01-2022', createdAt: '31-12-2021'}, {id: 2, maxPasses: 4, completed: 0, completedAt: '', createdAt: '31-12-2021'}, {id: 3, maxPasses: 5, completed: 1, completedAt: '01-01-2022', createdAt: '31-12-2021'}, {id: 4, maxPasses: 4, completed: 0, completedAt: '', createdAt: '31-12-2021'}, {id: 5, maxPasses: 5, completed: 1, completedAt: '01-01-2022', createdAt: '31-12-2021'}, {id: 6, maxPasses: 4, completed: 0, completedAt: '', createdAt: '31-12-2021'}, {id: 7, maxPasses: 5, completed: 1, completedAt: '01-01-2022', createdAt: '31-12-2021'}, {id: 8, maxPasses: 4, completed: 0, completedAt: '', createdAt: '31-12-2021'}, {id: 9, maxPasses: 5, completed: 1, completedAt: '01-01-2022', createdAt: '31-12-2021'}, {id: 10, maxPasses: 4, completed: 0, completedAt: '', createdAt: '31-12-2021'}

    useEffect(() => {
        apiCaller('/api/recon/request/list/fetch').then(([data, err]) => {
            if (err === undefined) {
                setSnackbar({msg: 'Request List: Fetch Successful!', type: 'success'});
                setRows(data.requests);
            } else {
                console.log(err);
                setSnackbar({msg: 'Request List Error: ' + err, type: 'error'});
            }
        });
    }, [])

    return (
        <Grid container direction='column' justifyContent='center' alignItems='center' alignContent='center' alignSelf='center' pt={20}>
        <Grid item>
            <EnhancedTable rows={rows} tableName='Requests' headCells={headCells} keys={keys} link='/request' setId={setRequestId}/>
        </Grid>
    </Grid>
    );
}

export default RequestList;