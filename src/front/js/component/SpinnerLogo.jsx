import React from "react";
import logo from "../../img/logotipo_sin_texto.png";


const SpinnerLogo = () => {
    return ( 
    <div className="text-center">
        <img src={logo} alt="Cargando..." className="image-spinner" />
        <p className="mt-2 text-sm">Cargando, por favor espera...</p>
    </div>
     );
}
 
export default SpinnerLogo;