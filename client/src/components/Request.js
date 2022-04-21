import { useState, useEffect } from 'react';
import { Card, CardActions, CardContent, Grid, Divider, Button, Typography, TextField } from '@mui/material';
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

const textHeading = {
    // flexGrow: 1,
    fontWeight: 'bold',
    fontSize: 40,
    color: colorQuaternary,
    flex: '1 1 100%'
}

const textLabel = {
    flexGrow: 1,
    fontWeight: 'bold',
    fontSize: 24,
    color: colorText3
}

const textStyle = {
    '& label.Mui-focused': {
      color: colorQuaternary  ,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: colorQuaternary,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: colorQuinary,
      },
      '&:hover fieldset': {
        borderColor: colorPrimary,
      },
      '&.Mui-focused fieldset': {
        borderColor: colorQuaternary,
      },
    },
}

const headCells = [
    {
      id: 'id',
      label: 'ID',
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
    completed: 'boolean',
    createdAt: 'value',
    completedAt: 'value',
    view: 'button'
}

const validationSchemaFetch = yup.object({
    id: yup
    .number('Enter a valid id')
    .integer('Enter a valid id please')
    .min(1, 'ID should not be None')
    .required('ID is required')
});

function Request({requestId, setRequestId, setPassId, setSnackbar}) {
    const [rows, setRows] = useState([]); // {id: 1, completed: 1, completedAt: '01-01-2022', createdAt: '31-12-2021'}, {id: 2, completed: 0, completedAt: '', createdAt: '31-12-2021'}, {id: 3, completed: 1, completedAt: '01-01-2022', createdAt: '31-12-2021'}, {id: 4, completed: 0, completedAt: '', createdAt: '31-12-2021'}, {id: 5, completed: 1, completedAt: '01-01-2022', createdAt: '31-12-2021'}, {id: 6, completed: 0, completedAt: '', createdAt: '31-12-2021'}, {id: 7, completed: 1, completedAt: '01-01-2022', createdAt: '31-12-2021'}, {id: 8, completed: 0, completedAt: '', createdAt: '31-12-2021'}, {id: 9, completed: 1, completedAt: '01-01-2022', createdAt: '31-12-2021'}, {id: 10, completed: 0, completedAt: '', createdAt: '31-12-2021'}

    useEffect(() => {
        if (requestId !== undefined) {
            apiCaller('/api/recon/request/fetch', {requestId: requestId}).then(([data, err]) => {
                if (err === undefined) {
                    setSnackbar({msg: 'Request: Fetch Successful!', type: 'success'});
                    setRows(data.passes);
                } else {
                    console.log(err);
                    setSnackbar({msg: 'Request Error: ' + err, type: 'error'});
                }
            });
        }
    }, [requestId]);

    const formikFetch = useFormik({
        initialValues: {
            id: requestId,
        },
        validationSchema: validationSchemaFetch,
        onSubmit: (values) => {
            setRequestId(values.id);
        }
    });

    return (
        <Grid container direction='column' justifyContent='center' alignItems='center' alignContent='center' alignSelf='center' pt={12} spacing={2}>
            <Grid item>
                <Card elevation={2} sx={{backgroundColor: colorSecondary, width: 520, maxHeight: 600,}}>
                    <CardContent>
                        <Grid container direction='column' spacing={1}>
                            <Grid item>
                                <Typography sx={textHeading}>Request</Typography>
                            </Grid>
                            <Grid item>
                                <Typography sx={textLabel}>ID</Typography>
                                <TextField
                                fullWidth
                                margin="dense"
                                id="id"
                                name="id"
                                label="ID"
                                type='number'
                                value={formikFetch.values.id}
                                placeholder="1"
                                onChange={formikFetch.handleChange}
                                error={formikFetch.touched.id && Boolean(formikFetch.errors.id)}
                                helperText={formikFetch.touched.id && formikFetch.errors.id}
                                color="background"
                                variant="outlined"
                                sx={textStyle}
                                InputProps={{sx: {fontSize: 16, color: colorText1}}}
                                InputLabelProps={{sx: {fontSize: 16, color: colorText2}}}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Divider sx={{backgroundColor: colorPrimary}}/>
                    <CardActions>
                        <Grid container justifyContent='flex-end' alignItems='right' spacing={2}>
                            <Grid item>
                                <Button variant='contained' sx={{color: colorText1, backgroundColor: colorQuinary, '&:hover': {backgroundColor: colorPrimary}}} onClick={formikFetch.handleSubmit}>Fetch</Button>
                            </Grid>
                        </Grid>
                    </CardActions>
                </Card>
            </Grid>    
            <Grid item>
                <EnhancedTable rows={rows} tableName='Passes' headCells={headCells} keys={keys} link='/pass' setId={setPassId}/>
            </Grid>
        </Grid>
    );
}

export default Request;