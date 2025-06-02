import React from "react";
import "./Login.css";
import IniciarSesion from "../sesiones/IniciarSesion.jsx";

const Login = () => {

  return (
    <>
      <div className='inicioSesion'>
        <IniciarSesion />
      </div>
      <div className="error">
      </div>
    </>
  );
};

export default Login;
