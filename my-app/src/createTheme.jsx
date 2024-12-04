import { createTheme } from '@mui/material/styles';

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