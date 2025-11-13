import React, { useEffect, useMemo } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Grid
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IngresarProductoSchema } from '../Utils/productoSchema';

const FormularioDialogoProducto = ({
    open,
    onClose,
    onConfirm,
    producto,
    areas,
    categorias,
    proveedores,
    isSaving
}) => {
    const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(IngresarProductoSchema),
        defaultValues: {
            sku: '', codEan: '', nombre_producto: '', marca: '', uni_medida: '',
            precio_venta: '', precio_compra: '', id_area: '', id_cat: '', id_proveedor: ''
        }
    });

    useEffect(() => {
        if (producto && open) {
            const areaInicial = producto.categoria?.id_area || producto.categoria?.area?.id_area || '';

            reset({
                sku: producto.sku,
                codEan: producto.codEan,
                nombre_producto: producto.nombre || producto.nombre_producto,
                marca: producto.marca,
                uni_medida: producto.uni_medida,
                precio_venta: producto.precio_venta,
                precio_compra: producto.precio_compra,
                id_area: areaInicial,
                id_cat: producto.categoria?.id_cat || producto.categoria?.id_categoria || '',
                id_proveedor: producto.proveedor?.id_proveedor || ''
            });
        }
    }, [producto, open, reset]);

    const selectedAreaId = watch("id_area");

    const categoriasDisponibles = useMemo(() => {
        if (!selectedAreaId) return [];
        const areaIdNum = parseInt(selectedAreaId, 10);
        return categorias.filter((cat) => {
            const catAreaId = cat.area?.id_area || cat.id_area;
            return Number(catAreaId) === areaIdNum;
        });
    }, [selectedAreaId, categorias]);

    useEffect(() => {
        if (open && selectedAreaId) {
            const currentCat = watch('id_cat');
            const isCatValid = categoriasDisponibles.some(cat => (cat.id_cat || cat.id_categoria) == currentCat);
            if (!isCatValid && currentCat !== '') {
                setValue("id_cat", "");
            }
        }
    }, [selectedAreaId, setValue, categoriasDisponibles, open, watch]);

    const onSubmit = (data) => {
        onConfirm(data);
    };
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Editar Producto</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Controller
                                name="sku"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="SKU" fullWidth error={!!errors.sku} helperText={errors.sku?.message} />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="codEan"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="EAN" fullWidth error={!!errors.codEan} helperText={errors.codEan?.message} />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}><Controller name="nombre_producto" control={control} render={({ field }) => (<TextField {...field} label="Nombre" fullWidth error={!!errors.nombre_producto} helperText={errors.nombre_producto?.message} />)} /></Grid>
                        <Grid item xs={6}><Controller name="marca" control={control} render={({ field }) => (<TextField {...field} label="Marca" fullWidth error={!!errors.marca} helperText={errors.marca?.message} />)} /></Grid>
                        <Grid item xs={6}><Controller name="uni_medida" control={control} render={({ field }) => (<TextField {...field} label="Unidad de Medida" fullWidth error={!!errors.uni_medida} helperText={errors.uni_medida?.message} />)} /></Grid>

                        <Grid item xs={6}><Controller name="precio_venta" control={control} render={({ field }) => (<TextField {...field} type="number" label="Precio Venta" fullWidth error={!!errors.precio_venta} helperText={errors.precio_venta?.message} />)} /></Grid>
                        <Grid item xs={6}><Controller name="precio_compra" control={control} render={({ field }) => (<TextField {...field} type="number" label="Precio Compra" fullWidth error={!!errors.precio_compra} helperText={errors.precio_compra?.message} />)} /></Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="id_area"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Área"
                                        fullWidth
                                        error={!!errors.id_area}
                                        helperText={errors.id_area?.message}
                                    >
                                        {areas.map((area) => (
                                            <MenuItem key={area.id_area} value={area.id_area}>
                                                {area.nombreArea}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="id_cat"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        select
                                        label="Categoría"
                                        fullWidth
                                        disabled={!selectedAreaId}
                                        error={!!errors.id_cat}
                                        helperText={errors.id_cat?.message}
                                    >
                                        {categoriasDisponibles.map((cat) => (
                                            <MenuItem key={cat.id_cat || cat.id_categoria} value={cat.id_cat || cat.id_categoria}>
                                                {cat.nombreCat || cat.nombre_categoria}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth error={!!errors.id_proveedor}>
                                <InputLabel id="prov-label">Proveedor</InputLabel>
                                <Controller
                                    name="id_proveedor"
                                    control={control}
                                    render={({ field }) => (
                                        <Select {...field} labelId="prov-label" label="Proveedor" fullWidth>
                                            {proveedores.map((prov) => (
                                                <MenuItem key={prov.id_proveedor} value={prov.id_proveedor}>
                                                    {prov.nombre_proveedor}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                <FormHelperText>{errors.id_proveedor?.message}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="inherit" disabled={isSaving}>Cancelar</Button>
                    <Button type="submit" variant="contained" color="primary" disabled={isSaving}>
                        {isSaving ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default FormularioDialogoProducto;