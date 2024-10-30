import { ThemeProvider } from '@mui/material/styles';
import { useLoaderData, useLocation } from 'react-router-dom';
import "./order.css"
import theme from "../../createTheme"
import Banner from '../../components/order/Banner';
import MenuDisplay from '../../components/order/MenuDisplay';
import OrderArea from '../../components/order/OrderArea';

function MenuSelection(props) {
    const {state} = useLocation();
    const view = state.view;
    const setAuthentication = props.setAuthentication;
    
    return (
        <ThemeProvider theme={theme}>
            <div className='menu-items'>
                <div className='banner'>
                    <Banner view={view} setAuthentication={setAuthentication}/>
                </div>
                <div className='order-menu-content'>
                    <div>
                        <MenuDisplay/>
                    </div>
                    <div>
                        <OrderArea view={view}/>
                    </div>
                </div>
            </div>
       </ThemeProvider>
    );
}

export default MenuSelection;
