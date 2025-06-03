import React, { useContext } from "react";
import "./Inicio.css";
import { contextoSesion } from "../../contextos/ProveedorSesion.jsx";
import { useNavigate } from "react-router-dom";

const Inicio = () => {
  const { sesionIniciada } = useContext(contextoSesion);
  const navigate = useNavigate();

  return (
    <>
      <h2 className="mt-10 text-center text-6xl font-extrabold text-[#7bb369] drop-shadow-lg mb-6">
        ⚽ TIKI TAKI ⚽
      </h2>

      {!sesionIniciada ? (
        <div className="bg-[#7bb369] p-10 rounded-xl shadow-lg w-11/12 md:w-3/4 lg:w-1/2 mx-auto my-10 text-center">
          <h2 className="bg-[#046942] text-[#eeeeee] py-5 text-2xl md:text-4xl font-bold rounded-t-xl shadow">
            ¡Bienvenido a TIKI TAKI!
          </h2>
          <p className="text-[#eeeeee] text-xl mt-6 leading-relaxed">
            Entra al emocionante universo del fútbol fantasy. Aquí puedes:
          </p>
          <ul className="text-[#eeeeee] text-lg mt-4 list-disc list-inside space-y-2">
            <li>Formar tu equipo soñado con jugadores reales</li>
            <li>Competir en ligas con tus amigos</li>
            <li>Planear estrategias y dominar la clasificación</li>
          </ul>
          <p className="text-[#eeeeee] text-xl mt-6 font-semibold">
            ¡Inicia sesión y prepárate para convertirte en el mánager del año!
          </p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-center gap-10 my-12 px-4">
          <div
            className="cursor-pointer bg-[#7bb369] p-8 rounded-xl shadow-lg w-full max-w-md transform transition-transform hover:scale-105 hover:shadow-xl"
            onClick={() => navigate("/clasificacion")}
          >
            <h2 className="bg-[#046942] text-white text-3xl text-center font-bold py-5 rounded-t-xl shadow">
              🏆 Clasificación
            </h2>
            <p className="text-[#eeeeee] text-lg mt-6 text-center leading-relaxed">
              Consulta cómo va tu liga en tiempo real. ¿Estás en la cima o necesitas una remontada épica?
            </p>
          </div>

          <div
            className="cursor-pointer bg-[#7bb369] p-8 rounded-xl shadow-lg w-full max-w-md transform transition-transform hover:scale-105 hover:shadow-xl"
            onClick={() => navigate("/plantilla")}
          >
            <h2 className="bg-[#046942] text-white text-3xl text-center font-bold py-5 rounded-t-xl shadow">
              📝 Mi Plantilla
            </h2>
            <p className="text-[#eeeeee] text-lg mt-6 text-center leading-relaxed">
              Gestiona tu once titular, cambia jugadores y construye el equipo campeón que todos temerán.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Inicio;
