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
      id: 'name',
      label: 'Attribute Name',
    },
    {
        id: 'value',
        label: 'Attribute Value',
    },
];

const keys = {
    name: 'value',
    value: 'value'
}

const validationSchemaFetch = yup.object({
    requestId: yup
    .number('Enter a valid request id')
    .integer('Enter a valid request id please')
    .min(1, 'Request ID should not be None')
    .required('Request ID is required'),
    passId: yup
    .number('Enter a valid pass id')
    .integer('Enter a valid pass id please')
    .min(0, 'Pass ID should not be greater than or equal to 0')
    .required('Pass ID is required')
});

function Pass({requestId, setRequestId, passId, setPassId, setSnackbar}) {
    const [matrix, setMatrix] = useState([]); // [{name: 'Primary Email', value: 'xyz@gmail.com'}, {name: 'Secondary Email', value: 'abc@gmail.com'}], [{name: 'Primary Phone', value: '+923111222333'}, {name: 'Secondary Phone', value: '+923444555666'}]
    const [tables, setTables] = useState([]); // {id: 1, name: 'Email Tool'}, {id: 2, name: 'Phone Tool'}

    useEffect(() => {
        if (requestId !== undefined && passId !== undefined) {
            apiFunc();
        }
    }, [requestId, passId]);

    const apiFunc = () => {
        apiCaller('/api/recon/request/pass/fetch', {requestId: requestId, passId: passId}).then(([data, err]) => {
            if (err === undefined) {
                console.log(data);
                const dataObj = data.data;
                setSnackbar({msg: 'Pass: Fetch Successful!', type: 'success'});
                const myTables = dataObj.tools.map((obj) => ({id: obj.id, name: obj.name}))
                const myMatrix = dataObj.tools.map((obj) => {
                    return obj.result.map((objR) => ({name: objR.name, value: objR.value}))
                })
                setMatrix(myMatrix);
                setTables(myTables);
            } else {
                console.log(err);
                setSnackbar({msg: 'Pass Error: ' + err, type: 'error'});
            }
        });
    }

    const formikFetch = useFormik({
        initialValues: {
            requestId: requestId,
            passId: passId
        },
        validationSchema: validationSchemaFetch,
        onSubmit: (values) => {
            if (values.requestId === requestId && values.passId === passId) {
                apiFunc();
            } else {
                setRequestId(values.requestId);
                setPassId(values.passId);
            }
        }
    });

    return (
        <Grid container direction='column' justifyContent='center' alignItems='center' alignContent='center' alignSelf='center' pt={12} spacing={2}>
            <Grid item>
                <Card elevation={2} sx={{backgroundColor: colorSecondary, width: 520, maxHeight: 600,}}>
                    <CardContent>
                        <Grid container direction='column' spacing={1}>
                            <Grid item>
                                <Typography sx={textHeading}>Pass</Typography>
                            </Grid>
                            <Grid item>
                                <Typography sx={textLabel}>Request ID</Typography>
                                <TextField
                                fullWidth
                                margin="dense"
                                id="requestId"
                                name="requestId"
                                label="Request ID"
                                type='number'
                                value={formikFetch.values.requestId}
                                placeholder="1"
                                onChange={formikFetch.handleChange}
                                error={formikFetch.touched.requestId && Boolean(formikFetch.errors.requestId)}
                                helperText={formikFetch.touched.requestId && formikFetch.errors.requestId}
                                color="background"
                                variant="outlined"
                                sx={textStyle}
                                InputProps={{sx: {fontSize: 16, color: colorText1}}}
                                InputLabelProps={{sx: {fontSize: 16, color: colorText2}}}
                                />
                            </Grid>
                            <Grid item>
                                <Typography sx={textLabel}>Pass ID</Typography>
                                <TextField
                                fullWidth
                                margin="dense"
                                id="passId"
                                name="passId"
                                label="Pass ID"
                                type='number'
                                value={formikFetch.values.passId}
                                placeholder="1"
                                onChange={formikFetch.handleChange}
                                error={formikFetch.touched.passId && Boolean(formikFetch.errors.passId)}
                                helperText={formikFetch.touched.passId && formikFetch.errors.passId}
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
                {
                    tables.map((t, i) => (
                        <EnhancedTable rows={matrix[i]} tableName={`${t.name} (ID: ${t.id})`} headCells={headCells} keys={keys} link='/' setId={setPassId}/>
                    ))
                }
            </Grid>
        </Grid>
    );
}

export default Pass;