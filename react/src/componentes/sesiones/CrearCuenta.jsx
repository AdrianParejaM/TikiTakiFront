import React, { useState } from "react";
import useSesion from "../../hooks/useSesion.jsx";

const CrearCuenta = () => {
  const { crearCuenta, actualizarDato, datosSesion } = useSesion();
  const [error, setError] = useState("");

  const manejarCrearCuenta = async () => {
    if (!datosSesion.nickname || datosSesion.nickname.length < 3) {
      return setError("El nombre de usuario debe tener al menos 3 caracteres.");
    }
    if (!datosSesion.name) {
      return setError("El nombre no puede estar vacío.");
    }
    if (!datosSesion.email.includes("@")) {
      return setError("Introduce un correo válido.");
    }
    if (!datosSesion.password || datosSesion.password.length < 6) {
      return setError("La contraseña debe tener al menos 6 caracteres.");
    }

    const errorRespuesta = await crearCuenta();
    if (errorRespuesta) setError(errorRespuesta);
  };

  return (
    <div className="flex flex-col items-center justify-center h-1/5">
      <h2 className="mt-10 text-4xl font-bold text-[#7bb369] mb-4">Crea una nueva cuenta</h2>

      <div className="w-full mt-5 max-w-xl p-0">
        <div className="mb-4 flex items-center">
          <label htmlFor="nickname" className="w-1/3 font-medium text-[#EEEEEE]">
            Nombre de usuario
          </label>
          <input
            type="text"
            name="nickname"
            id="nickname"
            placeholder="Su nombre de usuario..."
            onChange={actualizarDato}
            className="w-2/3 p-2 rounded-lg focus:outline-none focus:border-green-500 border border-gray-300"
          />
        </div>

        <div className="mb-4 flex items-center">
          <label htmlFor="name" className="w-1/3 font-medium text-[#EEEEEE]">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Su nombre..."
            onChange={actualizarDato}
            className="w-2/3 p-2 rounded-lg focus:outline-none focus:border-green-500 border border-gray-300"
          />
        </div>

        <div className="mb-4 flex items-center">
          <label htmlFor="email" className="w-1/3 font-medium text-[#EEEEEE]">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Su correo electrónico..."
            onChange={actualizarDato}
            className="w-2/3 p-2 rounded-lg focus:outline-none focus:border-green-500 border border-gray-300"
          />
        </div>

        <div className="mb-6 flex items-center">
          <label htmlFor="password" className="w-1/3 font-medium text-[#EEEEEE]">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Su contraseña..."
            onChange={actualizarDato}
            className="w-2/3 p-2 rounded-lg focus:outline-none focus:border-green-500 border border-gray-300"
          />
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="flex justify-center">
          <button
            className="mt-6 bg-[#7bb369] text-white py-2 px-6 rounded-lg hover:bg-[#7AA369] transition"
            onClick={manejarCrearCuenta}
          >
            Crear cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrearCuenta;
