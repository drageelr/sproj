import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardActions, Typography, Grid, TextField, Button, NativeSelect, Divider } from '@mui/material';    
import { useFormik } from 'formik';
import * as yup from 'yup';
import { apiCaller } from '../apiCaller';

const validationSchemaSubmit = yup.object({
    id: yup
    .number('Select a valid attribute')
    .integer('Select a valid attribute please')
    .min(1, 'Attribute should not be None')
    .required('Attribute is required'),
    value: yup
    .string('Enter the value')
    .min(1, 'Value should be of minimum 1 character length')
    .max(100, 'Value should be of maximum 100 characters length')
    .required('Value is required'),
    maxPasses: yup
    .number('Enter a valid max pass value')
    .integer('Enter a valid max pass value please')
    .min(1, 'Max passes should be greater than 0')
    .max(10, 'Max passes should be less than or equal to 10')
    .required('Attribute is required')
});

function Home({setSnackbar, setRequestId}) {
    const [attrs, setAttrs] = useState([]); // {id: 1, name: 'Email'}, {id: 2, name: 'Phone Number'}

    const navigate = useNavigate();

    const colorText1 = '#fcfefe';
    const colorText2 = '#97989c';
    const colorText3 = '#b0b4be';
    const colorPrimary = '#00abc6';
    const colorQuaternary = '#17c0dc';
    const colorQuinary = '#277a8f';

    useEffect(() => {
        apiCaller('/api/recon/attribute/list/fetch').then(([data, err]) => {
            if (err === undefined) {
                setSnackbar({msg: 'Attribute: Fetch Successful!', type: 'success'});
                setAttrs(data.data.attributes);
            } else {
                console.log(err);
                setSnackbar({msg: 'Attribute Error: ' + err, type: 'error'});
            }
        });
    }, []);

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

    const selectColor = {
        '&:before': {
            borderColor: colorQuinary,
        },
        '&:not(.Mui-disabled):hover::before': {
            borderColor: colorQuaternary,
        },
        '&:after': {
            borderColor: colorPrimary,
        },
        color: colorText3
    }

    const formikSubmit = useFormik({
        initialValues: {
            id: 0,
            value: '',
            maxPasses: undefined
        },
        validationSchema: validationSchemaSubmit,
        onSubmit: async (values) => {
            const [data, err] = await apiCaller('/api/recon/request/submit', {attribute: {id: values.id, value: values.value}, maxPasses: values.maxPasses});
            if (err === undefined) {
                setSnackbar({msg: 'Request: Submit Successful!', type: 'success'});
                setRequestId(data.data.id);
                navigate('/request', { replace: true });
            } else {
                console.log(err);
                setSnackbar({msg: 'Submission Error: ' + err, type: 'error'});
            }
        }
    });

    return (
        <Grid container direction='column' justifyContent='center' alignItems='center' alignContent='center' alignSelf='center' pt={12}>
            <Grid item>
                <Card elevation={2} sx={{backgroundColor: '#282835', width: 520, maxHeight: 600,}}>
                    <CardContent>
                        <Grid container direction='column' spacing={2}>
                            <Grid item>
                                <Typography sx={textHeading}>New Request</Typography>
                            </Grid>
                            <Grid item>
                                <Typography sx={textLabel}>Attribute</Typography>
                                <NativeSelect
                                    variant = "outlined"
                                    style={{ width: 490, fontSize: 12}}
                                    inputProps={{
                                      name: 'Attribute',
                                      id: 'uncontrolled-native',
                                    }}
                                    sx={selectColor}
                                    onChange={formikSubmit.handleChange('id')}
                                    value={formikSubmit.values.id}
                                    error={formikSubmit.touched.id && Boolean(formikSubmit.errors.id)}
                                    helperText={formikSubmit.touched.id && formikSubmit.errors.id}
                                  >
                                    <option style={{fontSize: 16}} value={0}>None</option>
                                    {
                                        attrs.map((obj, i) => (
                                            <option style={{fontSize: 16}} value={obj.id}>{obj.name}</option>
                                        ))
                                    }
                                  </NativeSelect>
                            </Grid>
                            <Grid item>
                                <Typography sx={textLabel}>Value</Typography>
                                <TextField
                                  fullWidth
                                  margin="dense"
                                  id="value"
                                  name="value"
                                  label="Value"
                                  value={formikSubmit.values.value}
                                  placeholder="xyz@gmail.com"
                                  onChange={formikSubmit.handleChange}
                                  error={formikSubmit.touched.value && Boolean(formikSubmit.errors.value)}
                                  helperText={formikSubmit.touched.value && formikSubmit.errors.value}
                                  color="background"
                                  variant="outlined"
                                  sx={textStyle}
                                  InputProps={{sx: {fontSize: 16, color: colorText1}}}
                                  InputLabelProps={{sx: {fontSize: 16, color: colorText2}}}
                                  />                
                            </Grid>
                            <Grid item>
                                <Typography sx={textLabel}>Max Passes</Typography>
                                <TextField
                                  fullWidth
                                  margin="dense"
                                  id="maxPasses"
                                  name="maxPasses"
                                  label="Max Passes"
                                  type='number'
                                  value={formikSubmit.values.maxPasses}
                                  placeholder="5"
                                  onChange={formikSubmit.handleChange}
                                  error={formikSubmit.touched.maxPasses && Boolean(formikSubmit.errors.maxPasses)}
                                  helperText={formikSubmit.touched.maxPasses && formikSubmit.errors.maxPasses}
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
                                <Button variant='contained' sx={{color: colorText1, backgroundColor: colorQuinary, '&:hover': {backgroundColor: colorPrimary}}} onClick={formikSubmit.handleSubmit}>Submit</Button>
                            </Grid>
                        </Grid>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    );
}

export default Home;