// import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
// import { useNavigate } from "react-router-dom";
import "./order.css"
import theme from "../../createTheme"
import Banner from '../../components/order/Banner';
import MenuDisplay from '../../components/order/MenuDisplay';
import OrderArea from '../../components/order/OrderArea';

function MenuItem(){
    // const navigate = useNavigate();
    

    return (
        <ThemeProvider theme={theme}>
            <div className='menu-items'>
                <div className='banner'>
                    <Banner />
                </div>
                <div className='order-menu-content'>
                    <div>
                        <MenuDisplay />
                    </div>
                    <div>
                        <OrderArea />
                    </div>
                </div>
            </div>
       </ThemeProvider>
    );
}

export default MenuItem;
