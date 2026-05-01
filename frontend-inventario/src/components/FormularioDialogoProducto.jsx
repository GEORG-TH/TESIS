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
import { UpdateProductoSchema } from '../Utils/productoSchema';

const FormularioDialogoProducto = ({
    open,
    onClose,
    onConfirm,
    producto,
    areas,
    categorias,
    subcategorias,
    proveedores,
    isSaving
}) => {
    const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(UpdateProductoSchema),
        defaultValues: {
            sku: '', codEan: '', imagenUrl: '', nombre: '', marca: '', uni_medida: '',
            precio_venta: '', precio_compra: '',
            stockMinimo: '', stockIdeal: '',
            id_area: '', id_cat: '', id_subcat: '', id_proveedor: ''
        }
    });

    useEffect(() => {
        if (producto && open) {
            const areaInicial =
                producto.categoria?.area?.id_area ||
                producto.subcategoria?.categoria?.area?.id_area ||
                '';

            reset({
                sku: producto.sku,
                codEan: producto.codEan,
                imagenUrl: producto.imagenUrl || producto.imagen_url || '',
                nombre: producto.nombre || producto.nombre_producto,
                marca: producto.marca,
                uni_medida: producto.uni_medida,
                precio_venta: producto.precio_venta,
                precio_compra: producto.precio_compra,
                stockMinimo: producto.stockMinimo || '',
                stockIdeal: producto.stockIdeal || '',
                id_area: String(areaInicial),
                id_cat: String(
                    producto.categoria?.id_cat ||
                    producto.subcategoria?.categoria?.id_cat ||
                    producto.categoria?.id_categoria ||
                    ''
                ),
                id_subcat: String(producto.subcategoria?.id || ''),
                id_proveedor: String(producto.proveedor?.id_proveedor || '')
            });
        }
    }, [producto, open, reset]);

    const selectedAreaId = watch("id_area");
    const selectedCategoriaId = watch("id_cat");

    const categoriasDisponibles = useMemo(() => {
        if (!selectedAreaId) return [];
        const areaIdNum = parseInt(selectedAreaId, 10);
        return categorias.filter((cat) => {
            const catAreaId = cat.area?.id_area || cat.id_area;
            return Number(catAreaId) === areaIdNum;
        });
    }, [selectedAreaId, categorias]);

    const subcategoriasDisponibles = useMemo(() => {
        if (!selectedCategoriaId) return [];
        const categoriaIdNum = parseInt(selectedCategoriaId, 10);
        return subcategorias.filter((subcat) => {
            const subcatCategoriaId = Number(subcat.categoria?.id_cat || subcat.id_cat);
            return subcatCategoriaId === categoriaIdNum;
        });
    }, [selectedCategoriaId, subcategorias]);

    useEffect(() => {
        if (open && selectedAreaId) {
            const currentCat = watch('id_cat');
            const isCatValid = categoriasDisponibles.some(cat => (cat.id_cat || cat.id_categoria) == currentCat);
            if (!isCatValid && currentCat !== '') {
                setValue("id_cat", "");
                setValue("id_subcat", "");
            }
        }
    }, [selectedAreaId, setValue, categoriasDisponibles, open, watch]);

    useEffect(() => {
        if (open && selectedCategoriaId) {
            const currentSubcat = watch('id_subcat');
            const isSubcatValid = subcategoriasDisponibles.some((subcat) => String(subcat.id) === String(currentSubcat));
            if (!isSubcatValid && currentSubcat !== '') {
                setValue("id_subcat", "");
            }
        }
    }, [selectedCategoriaId, setValue, subcategoriasDisponibles, open, watch]);

    const onSubmit = (data) => {
        onConfirm(data);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Editar Producto</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit, (errors) => console.log("Errores de validación:", errors))}>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Controller
                                name="sku"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="SKU" fullWidth error={!!errors.sku} helperText={errors.sku?.message} disabled={true} />
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
                        <Grid item xs={12}><Controller name="nombre" control={control} render={({ field }) => (<TextField {...field} label="Nombre" fullWidth error={!!errors.nombre} helperText={errors.nombre?.message} />)} /></Grid>
                        <Grid item xs={12}><Controller name="imagenUrl" control={control} render={({ field }) => (<TextField {...field} type="url" label="URL de Imagen" placeholder="https://ejemplo.com/imagen.jpg" fullWidth error={!!errors.imagenUrl} helperText={errors.imagenUrl?.message} />)} /></Grid>
                        <Grid item xs={6}><Controller name="marca" control={control} render={({ field }) => (<TextField {...field} label="Marca" fullWidth error={!!errors.marca} helperText={errors.marca?.message} />)} /></Grid>
                        <Grid item xs={6}><Controller name="uni_medida" control={control} render={({ field }) => (<TextField {...field} label="Unidad de Medida" fullWidth error={!!errors.uni_medida} helperText={errors.uni_medida?.message} disabled={true} />)} /></Grid>

                        <Grid item xs={6}><Controller name="precio_venta" control={control} render={({ field }) => (<TextField {...field} type="number" label="Precio Venta" fullWidth error={!!errors.precio_venta} helperText={errors.precio_venta?.message} />)} /></Grid>
                        <Grid item xs={6}><Controller name="precio_compra" control={control} render={({ field }) => (<TextField {...field} type="number" label="Precio Compra" fullWidth error={!!errors.precio_compra} helperText={errors.precio_compra?.message} />)} /></Grid>

                        <Grid item xs={6}>
                            <Controller
                                name="stockMinimo"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="number"
                                        label="Stock Mínimo (Alerta)"
                                        fullWidth
                                        error={!!errors.stockMinimo}
                                        helperText={errors.stockMinimo?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="stockIdeal"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="number"
                                        label="Stock Ideal (Meta)"
                                        fullWidth
                                        error={!!errors.stockIdeal}
                                        helperText={errors.stockIdeal?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="id_area"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.id_area} sx={{ minWidth: { xs: '100%', sm: 100 } }}>
                                        <InputLabel id="area-label">Área</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="area-label"
                                            label="Área"
                                        >
                                            {areas.map((area) => (
                                                <MenuItem key={area.id_area} value={area.id_area}>
                                                    {area.nombreArea}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{errors.id_area?.message}</FormHelperText>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="id_cat"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.id_cat} sx={{ minWidth: { xs: '100%', sm: 120 } }}>
                                        <InputLabel id="categoria-label">Categoría</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="categoria-label"
                                            label="Categoría"
                                            disabled={!selectedAreaId}
                                        >
                                            {categoriasDisponibles.map((cat) => (
                                                <MenuItem key={cat.id_cat || cat.id_categoria} value={cat.id_cat || cat.id_categoria}>
                                                    {cat.nombreCat || cat.nombre_categoria}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{errors.id_cat?.message}</FormHelperText>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="id_subcat"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.id_subcat} sx={{ minWidth: { xs: '100%', sm: 120 } }}>
                                        <InputLabel id="subcategoria-label">Subcategoría</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="subcategoria-label"
                                            label="Subcategoría"
                                            disabled={!selectedCategoriaId}
                                        >
                                            {subcategoriasDisponibles.map((subcat) => (
                                                <MenuItem key={subcat.id} value={subcat.id}>
                                                    {subcat.nombreSubcat}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{errors.id_subcat?.message}</FormHelperText>
                                    </FormControl>
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