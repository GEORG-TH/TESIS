import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { createUsuario } from "../../api/usuarioApi";
import LayoutDashboard from "../../components/Layouts/LayoutDashboard";
import "../../components/styles/styleRegistrar.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoles } from "../../api/rolApi";
import { getSedes } from "../../api/sedeApi";
import { IngresarUsuarioSchema } from "../../Utils/usuarioSchema";

const MySwal = withReactContent(Swal);
const usuarioSchema = IngresarUsuarioSchema;

function RegistrarUsuario() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { 
    data: rolesData, 
    isLoading: isLoadingRoles 
  } = useQuery({
    queryKey: ['roles'], 
    queryFn: getRoles
  });
  const roles = rolesData || [];
  const { data: sedesData, isLoading: isLoadingSedes } = useQuery({
    queryKey: ["sedes"],
    queryFn: getSedes,
  });
  const sedes = sedesData || [];
  
  const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
		setError,
		setValue,
	} = useForm({
		resolver: zodResolver(usuarioSchema),
    defaultValues: { 
      dni: "",
      nombre_u: "",
      apellido_pat: "",
      apellido_mat: "",
      telefono: "",
      email: "",
      pass: "",
      id_rol: "",
      id_sede: "",
    }
	});
  // Solo el rol Administrador es multisede: el resto debe pertenecer a una sede.
  const rolSeleccionado = roles.find((r) => String(r.id_rol) === watch("id_rol"));
  const esAdminSeleccionado = rolSeleccionado?.nombreRol === "Administrador";
  const createUsuarioMutation = useMutation({
		mutationFn: createUsuario,
		onSuccess: () => {
			MySwal.fire("Éxito", "Usuario registrado correctamente", "success");
			queryClient.invalidateQueries(["usuarios"]);
			reset();
		},
		onError: (error) => {
			console.error(error);
			if (error.response?.data?.errors) {
				const errores = error.response.data.errors;
				const mensajes = Object.entries(errores)
					.map(([campo, msg]) => `${campo.toUpperCase()}: ${msg}`)
					.join("<br>");
				MySwal.fire({
					icon: "error",
					title: "Errores de validación",
					html: mensajes,
				});
			} else {
				const msg =
					error.response?.data?.message || "No se pudo registrar el usuario";
				MySwal.fire("Error", msg, "error");
			}
		},
	});
  const onSubmit = (data) => {
		if (!esAdminSeleccionado && !data.id_sede) {
			setError("id_sede", { message: "Debes seleccionar la sede del usuario" });
			return;
		}
		const payload = {
			dni: data.dni,
			nombre_u: data.nombre_u,
			apellido_pat: data.apellido_pat,
			apellido_mat: data.apellido_mat,
      telefono: data.telefono,
			email: data.email,
			pass: data.pass,
			estado_u: 1,
			rol: { id_rol: parseInt(data.id_rol, 10) }, 
			sede: esAdminSeleccionado || !data.id_sede ? null : { idSede: parseInt(data.id_sede, 10) },
		};

		createUsuarioMutation.mutate(payload);
	};
  return (
    <LayoutDashboard>
      <div className="form-panel-container">
        <button
          type="button"
          className="form-panel-back"
          onClick={() => navigate("/lista-usuarios")}
        >
          Volver
        </button>
        <h2>Registrar Nuevo Usuario</h2>
        <form className="form-panel" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>DNI:</label>
            <input type="text" {...register("dni")} />
            {errors.dni && <span className="error-message">{errors.dni.message}</span>}
          </div>

          <div className="form-group">
            <label>Nombre:</label>
            <input type="text" {...register("nombre_u")} />
            {errors.nombre_u && <span className="error-message">{errors.nombre_u.message}</span>}
          </div>

          <div className="form-group">
            <label>Apellido Paterno:</label>
            <input type="text" {...register("apellido_pat")}/>
          </div>

          <div className="form-group">
            <label>Apellido Materno:</label>
            <input type="text" {...register("apellido_mat")} />
          </div>

          <div className="form-group">
            <label>Teléfono:</label>
            <input type="text" {...register("telefono")} />
            {errors.telefono && <span className="error-message">{errors.telefono.message}</span>}
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" {...register("email")} />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label>Contraseña:</label>
            <input type="password" {...register("pass")} />
            {errors.pass && <span className="error-message">{errors.pass.message}</span>}
          </div>

          <div className="form-group">
            <label>Rol:</label>
            <select {...register("id_rol", { onChange: (e) => {
                const r = roles.find((x) => String(x.id_rol) === e.target.value);
                if (r?.nombreRol === "Administrador") setValue("id_sede", "");
              } })}
              disabled={isLoadingRoles} >
              <option value="">{isLoadingRoles ? "Cargando roles..." : "Seleccione un rol"}</option>
              {roles.map((r) => (
                <option key={r.id_rol} value={r.id_rol}>
                  {r.nombreRol}
                </option>
              ))}
            </select>
            {errors.id_rol && <span className="error-message">{errors.id_rol.message}</span>}
          </div>

          <div className="form-group">
            <label>Sede:</label>
            <select {...register("id_sede")} disabled={isLoadingSedes || esAdminSeleccionado}>
              <option value="">
                {esAdminSeleccionado
                  ? "Todas las sedes (Administrador)"
                  : isLoadingSedes ? "Cargando sedes..." : "Seleccione una sede"}
              </option>
              {!esAdminSeleccionado && sedes.map((s) => (
                <option key={s.idSede} value={s.idSede}>
                  {s.nombreSede}
                </option>
              ))}
            </select>
            {errors.id_sede && <span className="error-message">{errors.id_sede.message}</span>}
          </div>

          <button type="submit" className="form-panel-submit" disabled={isLoadingRoles || createUsuarioMutation.isPending}>{createUsuarioMutation.isPending ? "Registrando..." : "Registrar Usuario"}</button>
        </form>
      </div>
    </LayoutDashboard>
  );
}

export default RegistrarUsuario;
