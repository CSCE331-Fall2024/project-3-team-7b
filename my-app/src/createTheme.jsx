import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#D95451',
      contrastText: '#FFFFFF',
    },
    secondary: {
        main: '#DBDBDB',
        contrastText: '#000000',
      },
      
  },
});

export default theme