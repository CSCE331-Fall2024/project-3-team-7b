import banner from "../../images/banner.PNG"
// import Button from '@mui/material/Button';
// import { useNavigate } from "react-router-dom";
import "./orderComponents.css"

function Banner(){
    // const navigate = useNavigate();
    

    return (
        <div>
            <img className="banner-image" src={banner} alt="Panda Express Banner w/ Logo" ></img>
        </div>
    );
}

export default Banner;
