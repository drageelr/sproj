import { useState } from 'react';
import { Card, CardContent, CardActions, Typography, Grid, TextField, Button } from '@mui/material';    
import { useFormik } from 'formik';
import * as yup from 'yup';

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

function Home() {
    const [attrs, setAttrs] = useState([]);

    const colorText1 = '#fcfefe';
    const colorText2 = '#97989c';
    const colorText3 = '#b0b4be';
    const colorPrimary = '#00abc6';
    const colorQuaternary = '#17c0dc';
    const colorQuinary = '#277a8f';

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

    const formikSubmit = useFormik({
        initialValues: {
            id: 0,
            value: '',
            maxPasses: undefined
        },
        validationSchema: validationSchemaSubmit,
        onSubmit: async (values) => {
          
        }
    });

    return (
        <Grid container direction='column' justifyContent='center' alignItems='center' alignContent='center' alignSelf='center' pt={20}>
            <Grid item>
                <Card elevation={2} sx={{backgroundColor: '#282835', width: 520, maxHeight: 500,}}>
                    <CardContent>
                        <Grid container direction='column' spacing={2}>
                            <Grid item>
                                <Typography sx={textLabel}>Attribute</Typography>
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
                                  InputProps={{sx: {fontSize: 16}}}
                                  InputLabelProps={{sx: {fontSize: 16}}}
                                  />                                
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions>

                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    );
}

export default Home;