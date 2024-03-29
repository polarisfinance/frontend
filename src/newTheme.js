//Your theme for the new stuff using material UI has been copied here so it doesn't conflict
import { createMuiTheme } from '@material-ui/core/styles';

const newTheme = createMuiTheme({
  palette: {
    type: 'dark',
    text: {
      primary: '#FFF',
    },
    background: {
      default: '#121212',
      paper: 'rgba(71,32,123,0.9)',
      paper2: 'rgba(71,32,123,0.9)',
    },
    primary: {
      light: '#757ce8',
      main: '#70D44B',
      dark: '#2c2560',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#3636BA',
      dark: '#ba000d',
      contrastText: '#FFF',
    },
    action: {
      disabledBackground: '#CDCDCD',
      active: '#000',
      hover: '#000',
      disabled: '#FFF',
    },
  },
  typography: {
    color: '#2c2560',
    fontFamily: ['"Rajdhani"', 'sans-serif'].join(','),
  },
});

export default newTheme;
