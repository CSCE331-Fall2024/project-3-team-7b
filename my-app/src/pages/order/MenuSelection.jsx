import { ThemeProvider } from '@mui/material/styles';
import { useLoaderData, useLocation } from 'react-router-dom';
import { useState } from 'react';
import "./order.css"
import theme from "../../createTheme"
import Banner from '../../components/order/Banner';
import MenuDisplay from '../../components/order/MenuDisplay';
import OrderArea from '../../components/order/OrderArea';

function MenuSelection(props) {
    const {state} = useLocation();
    const [subtotal, setSubtotal] = useState(0.00);
    const [tax, setTax] = useState(0.00);
    const [total, setTotal] = useState(0.00);
    const [order, setOrder] = useState("");
    const view = state.view;
    const setAuthentication = props.setAuthentication;

    const handleUpdate = (_subtotal, _tax, _total, _order) => {
        setSubtotal(_subtotal);
        setTax(_tax);
        setTotal(_total);
        setOrder(_order);
    }
    
    return (
        <ThemeProvider theme={theme}>
            <div className='menu-items'>
                <div className='banner'>
                    <Banner view={view} setAuthentication={setAuthentication}/>
                </div>
                <div className='order-menu-content'>
                    <div>
                        <MenuDisplay subtotal={subtotal} tax={tax} total={total} order={order} update={handleUpdate}/>
                    </div>
                    <div>
                        <OrderArea subtotal={subtotal} tax={tax} total={total} order={order} view={view} />
                    </div>
                </div>
            </div>
       </ThemeProvider>
    );
}

export default MenuSelection;
