//Proveedor de las sesiones
import React, { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";

const contextoSesion = createContext();

const ProveedorSesion = ({children}) => {

  //Creamos variables con datos vacíos.
  const datosSesionInicial = {
    nickname: "",
    name:"",
    email: "",
    password: "",
  };
  const usuarioInicial = {};
  const errorUsuarioInicial = "";
  const sesionIniciadaInicial = false;

  // Función para la navegación programática.
  const navigate = useNavigate();

  //Creamos los estados.
  const [datosSesion, setDatosSesion] = useState(datosSesionInicial);
  const [usuario, setUsuario] = useState(usuarioInicial);
  const [errorUsuario, setErrorUsuario] = useState(errorUsuarioInicial);
  // Estado para controlar el inicio de sesión.
  const [sesionIniciada, setSesionIniciada] = useState(sesionIniciadaInicial);

  //Creamos la función para crear la cuenta.
  const crearCuenta = async () => { 
    try {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Content-Type", "application/json");
  
      const raw = JSON.stringify({
        nickname: datosSesion.nickname,
        name: datosSesion.name,
        email: datosSesion.email,
        password: datosSesion.password,
      });
  
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };
  
      const response = await fetch("https://tikitaki.onrender.com/api/register", requestOptions);
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || "Error al crear la cuenta");
      }
  
      setErrorUsuario("Cuenta creada con éxito. Revisa tu correo electrónico.");
    } catch (error) {
      setErrorUsuario(`Error al crear cuenta: ${error.message}`);
      return error.message;
    }
    navigate(-1);
  };
  

  //Función para iniciar sesión con mail y contraseña.
  const iniciarSesion = async () => {
    setErrorUsuario("");
    try {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Content-Type", "application/json");
  
      const raw = JSON.stringify({
        email: datosSesion.email,
        password: datosSesion.password,
      });
  
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
  
      const response = await fetch("https://tikitaki.onrender.com/api/login", requestOptions);
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || "Error al iniciar sesión");
      }
  
      // Aquí se guarda el token en localStorage.
      localStorage.setItem("token", result.token);
      
      // Guardamos el usuario autenticado.
      setUsuario(result.user);
      
      setSesionIniciada(true);
      setErrorUsuario("Sesión iniciada correctamente.");
      navigate("/");
  
    } catch (error) {
      setErrorUsuario(`Error al iniciar sesión: ${error.message}`);
      return error.message;
    }
  };
  

  //Función para cerrar sesión.
  const cerrarSesion = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
  
      // Recuperamos el token de localStorage.
      const token = localStorage.getItem("token");
  
      if (!token) {
        throw new Error("No hay token de autenticación.");
      }
  
      myHeaders.append("Authorization", `Bearer ${token}`);
  
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };
  
      // Realizamos la solicitud al endpoint de logout.
      const response = await fetch("https://tikitaki.onrender.com/api/logout", requestOptions);
      const result = await response.text();
  
      if (!response.ok) {
        throw new Error(result || "Error al cerrar sesión");
      }
  
      // Eliminar el token después de cerrar sesión.
      localStorage.removeItem("token");
  
      // Limpiar el estado de la sesión.
      setUsuario({});
      setSesionIniciada(false);
      setErrorUsuario("Sesión cerrada correctamente.");
  
      // Redirigir al login.
      navigate("/login");
  
    } catch (error) {
      setErrorUsuario(`Error al cerrar sesión: ${error.message}`);
    }
  };

  //Función para actualizar los datos.
  const actualizarDato = (evento) => {
    const { name, value } = evento.target;
    setDatosSesion({ ...datosSesion, [name]: value });
  };

  //Exportamos todos los datos.
  const datosAExportar = {
    errorUsuario,
    crearCuenta,
    iniciarSesion,
    cerrarSesion,
    actualizarDato,
    sesionIniciada,
    usuario,
    datosSesion
  };

  return (
    <>
    <contextoSesion.Provider value={datosAExportar}>
    {children}
    </contextoSesion.Provider>
    </>
  );
};

export default ProveedorSesion;
export { contextoSesion };