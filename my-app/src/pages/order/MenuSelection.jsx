import { ThemeProvider } from '@mui/material/styles';
import "./order.css"
import theme from "../../createTheme"
import Banner from '../../components/order/Banner';
import MenuDisplay from '../../components/order/MenuDisplay';
import OrderArea from '../../components/order/OrderArea';

function MenuSelection( {view, setAuthentication} ){
    return (
        <ThemeProvider theme={theme}>
            <div className='menu-items'>
                <div className='banner'>
                    <Banner view={view} setAuthentication={setAuthentication}/>
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

export default MenuSelection;
