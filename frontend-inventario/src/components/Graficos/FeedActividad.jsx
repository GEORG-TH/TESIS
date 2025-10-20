import React, { useState, useEffect } from 'react';
import { getHistorialActividad } from '../../api/historialActividadApi';
import './css/FeedActividad.css'; 
import { FaUserCircle, FaClock, FaTag } from 'react-icons/fa';
const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

const FeedActividad = () => {
    const [actividades, setActividades] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActividades = async () => {
            try {
                setLoading(true);
                const response = await getHistorialActividad();
                setActividades(response.data);
            } catch (error) {
                console.error("Error al cargar el feed de actividad:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActividades();
    }, []);

    const formatRelativeTime = (fecha) => {
        const now = new Date();
        const activityDate = new Date(fecha);
        const diffInSeconds = Math.floor((now - activityDate) / 1000);

        if (diffInSeconds < 60) return `hace ${diffInSeconds} seg`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `hace ${diffInMinutes} min`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `hace ${diffInHours} h`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `hace ${diffInDays} d`;
    };

    if (loading) {
        return <div className="feed-container">Cargando actividades...</div>;
    }

    return (
        <div className="feed-container">
            <h3>Actividad Reciente</h3>
            <ul className="feed-list">
                {actividades.length > 0 ? (
                    actividades.map(act => (
                        <li key={act.id} className="feed-item">
                            <div className="feed-item-header">
                                <span className="feed-user">
                                    <FaUserCircle /> {act.nombreUsuario || 'Usuario'}
                                </span>
                                <span className="feed-time">
                                    <FaClock /> {formatRelativeTime(act.fechaHora)}
                                </span>
                            </div>
                            <p className="feed-description">{act.descripcion}</p>
                            <div className="feed-item-footer">
                                <span className={`feed-action-type feed-action-${act.tipoAccion?.toLowerCase()}`}>
                                    <FaTag /> {capitalize(act.tipoAccion)}
                                </span>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No hay actividad reciente.</p>
                )}
            </ul>
        </div>
    );
};

export default FeedActividad;