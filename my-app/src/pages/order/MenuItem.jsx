// import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
// import { useNavigate } from "react-router-dom";
import "./order.css"
import theme from "../../createTheme"
import Banner from '../../components/order/Banner';
import MenuDisplay from '../../components/order/MenuDisplay';

function MenuItem(){
    // const navigate = useNavigate();
    

    return (
        <ThemeProvider theme={theme}>
            <div>
                <div className='banner'>
                    <Banner />
                </div>
                <div className='order-menu-content'>
                    <div>
                        <MenuDisplay />
                    </div>
                    <div>
                        {/* current order */}
                    </div>
                </div>
            </div>
       </ThemeProvider>
    );
}

export default MenuItem;
