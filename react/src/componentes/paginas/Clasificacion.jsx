import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { contextoSesion } from "../../contextos/ProveedorSesion.jsx";

const Clasificacion = () => {
  const navigate = useNavigate();
  const { usuario, sesionIniciada } = useContext(contextoSesion);
  const [liga, setLiga] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name_league: "",
    description: ""
  });
  const [showForm, setShowForm] = useState(false);
  const [clasificacion, setClasificacion] = useState([]);
  const [miembrosLiga, setMiembrosLiga] = useState([]);

  useEffect(() => {
    if (!sesionIniciada) {
      navigate("/login");
      return;
    }

    const fetchUserLeague = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        // 1. Verificar si el usuario tiene liga
        const checkResponse = await fetch("https://tikitaki-backend.onrender.com/api/leagues/user/check", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });

        if (!checkResponse.ok) {
          throw new Error("Error al verificar liga del usuario");
        }

        const checkData = await checkResponse.json();

        // 2. Si tiene liga, cargar los datos completos
        if (checkData.hasLeague) {
          const leagueResponse = await fetch(`https://tikitaki-backend.onrender.com/api/leagues/${checkData.leagueId}`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json"
            }
          });

          if (!leagueResponse.ok) {
            throw new Error("Error al obtener datos de la liga");
          }

          const leagueData = await leagueResponse.json();
          setLiga(leagueData);

          // Cargar datos adicionales en paralelo
          await Promise.all([
            fetchClasificacion(checkData.leagueId),
            fetchMiembrosLiga(checkData.leagueId)
          ]);
        }
      } catch (err) {
        console.error("Error al obtener datos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserLeague();
  }, [sesionIniciada, navigate]);

  const fetchClasificacion = async (leagueId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://tikitaki-backend.onrender.com/api/leagues/${leagueId}/ranking`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Procesar la clasificación para asegurar que tenemos los datos correctos
        const clasificacionProcesada = data.map(item => ({
          nombre: item.usuario || item.nombre || "Usuario desconocido",
          puntos: item.puntos || 0
        }));
        
        setClasificacion(clasificacionProcesada);
      } else {
        // Si falla, crear una clasificación básica con los miembros
        const miembrosResponse = await fetch(`https://tikitaki-backend.onrender.com/api/leagues/${leagueId}/users`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });
        
        if (miembrosResponse.ok) {
          const miembrosData = await miembrosResponse.json();
          const clasificacionBasica = miembrosData.users?.map(user => ({
            nombre: user.nickname || user.name || "Usuario",
            puntos: 0
          })) || [];
          
          setClasificacion(clasificacionBasica);
        }
      }
    } catch (err) {
      console.error("Error al obtener clasificación:", err);
    }
  };

  const fetchMiembrosLiga = async (leagueId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://tikitaki-backend.onrender.com/api/leagues/${leagueId}/users`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        const usuariosOrdenados = data.users
          ?.map(u => u.nickname || u.name || "Usuario")
          .sort((a, b) => a.localeCompare(b)) || [];
        setMiembrosLiga(usuariosOrdenados);
      }
    } catch (err) {
      console.error("Error al obtener miembros de la liga:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.slice(0, 50) });
  };

  const handleCrearLiga = async () => {
  try {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    if (!token) throw new Error("No estás autenticado");
    if (!formData.name_league.trim()) throw new Error("El nombre es requerido");

    const response = await fetch("https://tikitaki-backend.onrender.com/api/leagues", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear liga");
    }

    const result = await response.json();
    setLiga(result.league);
    setShowForm(false);
    
    // Recargar datos de la liga recién creada
    await fetchClasificacion(result.league.id);
    await fetchMiembrosLiga(result.league.id);

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  if (!sesionIniciada) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#046942]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-center p-4 bg-red-100 rounded-lg">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
          <button 
            onClick={() => setError(null)} 
            className="mt-2 bg-[#046942] text-white px-4 py-2 rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (liga) {
    return (
      <div className="flex flex-col items-center rounded-lg shadow-md w-7/8 mx-auto my-8 p-8 bg-[#7bb369] text-[#EEEEEE]">
        <header className="w-full max-w-3xl mb-8 text-center">
          <h1 className="text-[2rem] font-extrabold tracking-wide text-white">
            {liga.name_league.toUpperCase()}
          </h1>
          <p className="text-white mt-2">Administrador: {usuario?.name || "Tú"}</p>
          {liga.description && <p className="text-white italic">"{liga.description}"</p>}
          {miembrosLiga.length > 0 && (
            <div className="mt-4 text-white">
              <h3 className="font-semibold text-lg mb-2">Miembros de la Liga</h3>
              <ul className="list-disc list-inside">
                {miembrosLiga.map((nombre, index) => <li key={index}>{nombre}</li>)}
              </ul>
            </div>
          )}
          <hr className="mt-4 h-1 w-32 mx-auto bg-[#046942] border-0 rounded" />
        </header>

        <div className="w-full max-w-3xl bg-[#046942] rounded-lg shadow-lg overflow-hidden">
          <h2 className="text-xl font-bold text-[#7bb369] p-4">Clasificación</h2>
          {clasificacion.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-[#035336] text-[#7bb369] text-sm uppercase">
                <tr>
                  <th className="px-4 py-3">Posición</th>
                  <th className="px-4 py-3">Usuario</th>
                  <th className="px-4 py-3 text-right">Puntos</th>
                </tr>
              </thead>
              <tbody className="text-[#EEEEEE]">
                {clasificacion.map((jugador, index) => (
                  <tr key={index} className={`${index % 2 === 0 ? 'bg-[#7bb369]/10' : 'bg-[#7bb369]/20'} hover:bg-[#7bb369]/30`}>
                    <td className="px-4 py-3 font-semibold">{index + 1}</td>
                    <td className="px-4 py-3">{jugador.nombre}</td>
                    <td className="px-4 py-3 text-right">{jugador.puntos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4 text-center text-white">
              No hay datos de clasificación disponibles
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="bg-[#7bb369] p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-4">No tienes ninguna liga creada</h2>
        <p className="text-white mb-6">Crea tu liga para empezar a competir</p>

        {!showForm ? (
          <button 
            onClick={() => setShowForm(true)} 
            className="bg-[#046942] hover:bg-[#035336] text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Crear Nueva Liga
          </button>
        ) : (
          <div className="mt-4 text-left">
            <div className="mb-4">
              <label className="block text-white mb-2">Nombre de la Liga (max 50 caracteres)</label>
              <input 
                type="text" 
                name="name_league" 
                value={formData.name_league} 
                onChange={handleInputChange} 
                className="w-full p-2 rounded bg-[#EEEEEE] text-gray-800"
                maxLength={50}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-white mb-2">Descripción (opcional, max 50 caracteres)</label>
              <input 
                type="text" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                className="w-full p-2 rounded bg-[#EEEEEE] text-gray-800"
                maxLength={50}
              />
            </div>

            {error && (
              <div className="text-red-300 mb-4 p-2 bg-white/10 rounded">
                {error}
              </div>
            )}

            <div className="flex justify-between">
              <button 
                onClick={() => setShowForm(false)} 
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCrearLiga} 
                className="bg-[#046942] hover:bg-[#035336] text-white font-bold py-2 px-4 rounded transition duration-300" 
                disabled={loading || !formData.name_league.trim()}
              >
                {loading ? 'Creando...' : 'Crear Liga'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clasificacion;