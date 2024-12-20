import { ThemeProvider } from '@mui/material/styles';
import { useLoaderData, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "./order.css"
import theme from "../../createTheme"
import Banner from '../../components/order/Banner';
import MenuDisplay from '../../components/order/MenuDisplay';
import OrderArea from '../../components/order/OrderArea';
import { useDispatch, useSelector } from 'react-redux';

// Purpose: displays all menu options
// ex: bowl, plate, a la carte

function MenuSelection(props) {
    const view = props.view;
    const setAuthentication = props.setAuthentication;
    const employeeID = props.employeeID;
    
    return (
        <ThemeProvider theme={theme}>
            <div className='menu-items'>
                <div className='banner'>
                    <Banner view={view} setAuthentication={setAuthentication}/>
                </div>
                <div className='order-menu-content'>
                    <div>
                        <MenuDisplay view={view}/>
                    </div>
                    <div>
                        <OrderArea view={view} employeeID={employeeID}/>
                    </div>
                </div>
            </div>
       </ThemeProvider>
    );
}

export default MenuSelection;
