import banner from "../images/banner.PNG"
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import "./Home.css"
import theme from "../createTheme"

function Home(){
    return (
        <ThemeProvider theme={theme}>
            <div>
                <div className="banner-div">
                    <img className="banner" src={banner} alt="Panda Express Banner"></img>
                </div>

                <div className="button-div">
                    <Button variant="contained">Customer View</Button>
                    <Button variant="contained">Cashier View</Button>
                    <Button variant="contained">Manager View</Button>
                    <Button variant="contained">Menu View</Button>
                </div>
            </div>
       </ThemeProvider>
    );
}

export default Home;
