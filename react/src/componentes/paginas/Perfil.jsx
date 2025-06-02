import React from "react";
import useSesion from "../../hooks/useSesion.jsx";
import "./Perfil.css";

const Perfil = () => {
  const { datosSesion } = useSesion();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-full max-w-xl bg-[#7bb369] rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Bienvenido a tu perfil
        </h1>

        <div className="bg-[#046942] rounded-lg p-6 text-[#EEEEEE] shadow-inner">
          <p className="mb-4">
            <span className="font-semibold text-[#7bb369]">Nombre completo:</span>{" "}
            {datosSesion.name || "No disponible"}
          </p>
          <p className="mb-4">
            <span className="font-semibold text-[#7bb369]">Nickname:</span>{" "}
            {datosSesion.nickname || "No disponible"}
          </p>
          <p className="mb-4">
            <span className="font-semibold text-[#7bb369]">Correo electrónico:</span>{" "}
            {datosSesion.email || "No disponible"}
          </p>
        </div>

        <div className="mt-6 text-center text-white text-sm italic">
          Aquí encontrarás tu información personal registrada.
        </div>
      </div>
    </div>
  );
};

export default Perfil;
