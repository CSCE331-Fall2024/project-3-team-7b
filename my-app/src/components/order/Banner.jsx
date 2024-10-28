import banner from "../../images/banner.PNG"
import Button from '@mui/material/Button';
// import { useNavigate } from "react-router-dom";
import "./orderComponents.css"

function Banner(){
    // const navigate = useNavigate();
    

    return (
        <div className="banner">
            <img className="banner-image" src={banner} alt="Panda Express Banner w/ Logo" ></img>
            <div className="accesible-buttons">
                <Button variant="contained">SELECT A LANGUAGE</Button>
                <Button variant="contained">ENLARGE TEXT</Button>
            </div>
        </div>
    );
}

export default Banner;
