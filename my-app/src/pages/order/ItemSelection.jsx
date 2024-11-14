// import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { useLocation } from "react-router-dom";
import "./order.css"
import theme from "../../createTheme"
import Banner from '../../components/order/Banner';
import OrderArea from '../../components/order/OrderArea';
import SelectItem from '../../components/order/SelectItem';
import { useDispatch, useSelector } from 'react-redux';

function ItemSelection() {
    const {state} = useLocation();
    const item = state?.item.slice(0, -4);
    const view = state.view;
    const setAuthentication = state.setAuthentication;
    const subtotal = useSelector((state) => state.subtotal);
    const order = useSelector((state) => state.order);
    
    return (
        <ThemeProvider theme={theme}>
            <div className='menu-items'>
                <div className='banner'>
                    <Banner view={view} setAuthentication={setAuthentication}/>
                </div>
                <div className='order-menu-content'>
                    <div>
                        <SelectItem item={item} view={view}/> 
                    </div>
                    <div>
                        <OrderArea view={view}/>
                    </div>
                </div>
            </div>
       </ThemeProvider>
    );
}

export default ItemSelection;
