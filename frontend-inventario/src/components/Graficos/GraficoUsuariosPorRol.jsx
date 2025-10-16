import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getUsuarios } from "../../api/usuarioApi";
import "./css/GraficoUsuariosPorRol.css";

function GraficoUsuariosPorRol() {
  const [data, setData] = useState([]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const res = await getUsuarios();
      const usuarios = res.data;

      const conteoPorRol = usuarios.reduce((acc, usuario) => {
        const rol = usuario.rol?.nombreRol || "Sin Rol";
        acc[rol] = (acc[rol] || 0) + 1;
        return acc;
      }, {});

      const datosFormateados = Object.entries(conteoPorRol).map(([rol, cantidad]) => ({
        name: rol,
        value: cantidad,
      }));

      setData(datosFormateados);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  return (
    <div className="grafico-usuarios-container">
      <h3>Usuarios por Rol</h3>
      <ResponsiveContainer width="95%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            nameKey="name"
            label={({ name, value, percent }) =>
              `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
            }
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value} usuario${value > 1 ? "s" : ""}`, name]}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              marginTop: "10px",
              fontSize: "13px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficoUsuariosPorRol;
