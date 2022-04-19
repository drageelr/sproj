import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

const theme = createTheme({
    palette: {
        primary: {
            main: '#00abc6',
        },
        secondary: {
            main: '#282835',
        },
        tertiary: {
            main: '#1d2027'
        },
        quaternary: {
            main: '#17c0dc'
        },
        textColor: {
            main: '#fcfefe'
        },
        textColor2: {
            main: '#97989c'
        },
        error: {
            main: red.A400,
        },
        background: {
            // default: '#717486',
            default: '#333344'
        },
    }
});

export default theme;