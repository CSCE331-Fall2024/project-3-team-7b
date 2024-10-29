// import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { useLocation } from "react-router-dom";
import "./order.css"
import theme from "../../createTheme"
import Banner from '../../components/order/Banner';
import OrderArea from '../../components/order/OrderArea';
import SelectItem from '../../components/order/SelectItem';

function ItemSelection( {view, setAuthentication} ){
    const location = useLocation();
    const item = location.state?.item.slice(0, -4); 
    
    return (
        <ThemeProvider theme={theme}>
            <div className='menu-items'>
                <div className='banner'>
                    <Banner view={view} setAuthentication={setAuthentication}/>
                </div>
                <div className='order-menu-content'>
                    <div>
                        <SelectItem item={item} /> 
                    </div>
                    <div>
                        <OrderArea />
                    </div>
                </div>
            </div>
       </ThemeProvider>
    );
}

export default ItemSelection;
