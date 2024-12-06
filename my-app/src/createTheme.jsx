import { createTheme } from '@mui/material/styles';

// sets up a consistent color scheme for all mui components used in the app

const theme = createTheme({
  palette: {
    primary: {
      main: '#bd3633',
      contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#DBDBDB',
        contrastText: '#000000',
      },
      
  },

  components: {
    MuiButton: {
        styleOverrides: {
            root: {
                fontWeight: 'bold',
            },
        },
    },
  },
});

export default theme