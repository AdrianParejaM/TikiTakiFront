import React from "react";
import { Routes, Route } from "react-router-dom";
import Inicio from "../paginas/Inicio.jsx";
import Plantilla from "../paginas/Plantilla.jsx";
import Mercado from "../paginas/Mercado.jsx";
import Clasificacion from "../paginas/Clasificacion.jsx";
import SobreNosotros from "../paginas/SobreNosotros.jsx";
import Login from "../paginas/Login.jsx";
import Error from "../paginas/Error.jsx";
import CrearCuenta from "../sesiones/CrearCuenta.jsx";

const Rutas = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Inicio />} />
        <Route path='/login' element={<Login />} />
        <Route path='/registro' element={<CrearCuenta />} />
        <Route path='*' element={<Error />} />
        <Route path='/plantilla' element={<Plantilla />} />
        <Route path='/mercado' element={<Mercado />} />
        <Route path='/clasificacion' element={<Clasificacion />} />
        <Route path='/sobrenosotros' element={<SobreNosotros />} />
      </Routes>
    </>
  );
};

export default Rutas;