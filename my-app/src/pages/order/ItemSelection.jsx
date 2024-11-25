// import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { useLocation } from "react-router-dom";
import "./order.css"
import theme from "../../createTheme"
import Banner from '../../components/order/Banner';
import OrderArea from '../../components/order/OrderArea';
import SelectItem from '../../components/order/SelectItem';
import { useDispatch, useSelector } from 'react-redux';

function ItemSelection(props) {
    // Fetch current values of subtotal and order from redux storage
    const {state} = useLocation();
    let item = "";
    if (state.item.length > 2) {
        item = state?.item.slice(0, -4);
    }
    else {
        item = state?.item;
    }
    const view = props.view;
    const setAuthentication = props.setAuthentication;
    
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
