import {createTheme} from '@mui/material/styles';

// A custom theme for this app
export const light = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#00bd7e',
        },
        secondary: {
            main: '#de004d',
        },
        background: {
            default: '#e6e6e6',
            paper: '#f8f8f8',
        },
        text: {
            primary: '#2c3e50',
            secondary: 'rgba(0,0,0,0.54)',
        },
        divider: 'rgba(60,60,60,0.12)',
    },
});

export const dark = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: 'rgb(0, 132, 88)',
        },
        secondary: {
            main: '#f50057',
        },
        divider: 'rgba(84,84,84,0.48)',
        background: {
            default: '#181818',
            paper: '#222222',
        },
        text: {
            primary: '#d2d2d2',
            secondary: 'rgba(235,235,235,0.64)',
        },
    },
});