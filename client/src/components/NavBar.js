import { useState, cloneElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Grid, IconButton, Drawer, Divider, Box } from '@mui/material';
import CameraIcon from '@mui/icons-material/Camera';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ViewListIcon from '@mui/icons-material/ViewList';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import DataUsageIcon from '@mui/icons-material/DataUsage';

function NavBar({resetStates}) {
    const [openDrawer, setOpenDrawer] = useState(false);

    const navigate = useNavigate();

    const colorText1 = '#fcfefe';
    const colorText2 = '#97989c';

    const handleOpenDrawer = () => {
        setOpenDrawer(true);
    }

    const handleCloseDrawer = () => {
        setOpenDrawer(false);
    }

    function RoundLinkButton({link, icon, title}) {
        const [color, setColor] = useState(colorText2);

        const onMouseEnter = () => {
            setColor(colorText1);
        }

        const onMouseLeave = () => {
            setColor(colorText2);
        }

        const onClick = () => {
            handleCloseDrawer();
            resetStates();
            navigate(link, { replace: true });
        }

        return (
            <Grid container direction='column' alignItems='center' sx={{pb: 2}}>
                <Grid item> 
                    <IconButton onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick} sx={{backgroundColor: '#1d2027', '&:hover, &.Mui-focusVisible': { backgroundColor: '#17c0dc'}}}>
                        {cloneElement(icon, {sx: {color: color}})}
                    </IconButton>
                </Grid>
                <Grid item>
                    <Typography variant='h6' sx={{color: color}}>
                    <Box fontSize={18} m={1} marginTop={0.2}>
                        {title}
                    </Box>
                    </Typography>
                </Grid>
            </Grid>
        );
    }

    return (
        <AppBar position='static' sx={{flexGrow: 1}}>
            <Toolbar>
                <IconButton edge='start' sx={{mr: 2}} color='textColor' onClick={handleOpenDrawer}>
                    <MenuIcon/>
                </IconButton>
                <Grid container direction='row' justifyContent='center' alignItems='center' alignContent='center' spacing={1}>
                    <Grid item mt={0.75}>
                        <CameraIcon color='textColor'/>
                    </Grid>
                    <Grid item>
                        <Typography fontWeightBold={100} sx={{flexGrow: 1, fontWeight: 'bold', fontSize: 26, color: colorText1}}>
                            Meta-Recon
                        </Typography>
                    </Grid>
                </Grid>
            </Toolbar>

            <Drawer PaperProps={{sx: {width: 120, background: '#1d2027'}}} anchor='left' open={openDrawer} onClose={handleCloseDrawer}>
                <Grid container direction='row' justifyContent='center' sx={{pt: 2}}>
                    <CameraIcon fontSize='large' color='quaternary'/>
                </Grid>
                <Divider sx={{backgroundColor: '#00abc6', mt: 1.5}}/>
                <Grid container direction='column' justifyContent='flex-end' sx={{pt: 2}}>
                    <RoundLinkButton link={'/'} icon={<HomeIcon fontSize='large'/>} title={'Home'}/>
                    <RoundLinkButton link={'/request-list'} icon={<ViewListIcon fontSize='large'/>} title={'Request List'}/>
                    <RoundLinkButton link={'/request'} icon={<FindInPageIcon fontSize='large'/>} title={'Request'}/>
                    <RoundLinkButton link={'/pass'} icon={<DataUsageIcon fontSize='large'/>} title={'Pass'}/>
                </Grid>
                <Divider sx={{backgroundColor: '#00abc6'}}/>
            </Drawer>
        </AppBar>
    );
}

export default NavBar;