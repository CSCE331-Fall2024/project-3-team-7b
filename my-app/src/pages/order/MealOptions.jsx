import { ThemeProvider } from '@mui/material/styles';
import { useLoaderData, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "./order.css"
import theme from "../../createTheme"
import Banner from '../../components/order/Banner';
import OrderArea from '../../components/order/OrderArea';
import { useDispatch, useSelector } from 'react-redux';
import ChooseMeal from '../../components/order/ChooseMeal';

// Purpose: displays options for panda cub meals and panda bundles

function MealOptions(props) {
    // Fetch current values of subtotal and order from redux storage
    const {state} = useLocation();
    const view = state.view;
    const item = state?.item.slice(0, -4);

    const setAuthentication = props.setAuthentication;
    
    return (
        <ThemeProvider theme={theme}>
            <div className='menu-items'>
                <div className='banner'>
                    <Banner view={view} setAuthentication={setAuthentication}/>
                </div>
                <div className='order-menu-content'>
                    <div>
                        <ChooseMeal item={item} view={view}/>
                    </div>
                    <div>
                        <OrderArea view={view}/>
                    </div>
                </div>
            </div>
       </ThemeProvider>
    );
}

export default MealOptions;
