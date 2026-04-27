import { z } from "zod";

export const recepcionMasivaSchema = z.object({
  sedeIdOrigen: z.coerce
    .number({ invalid_type_error: "Debes seleccionar una sede" })
    .min(1, "Debes seleccionar una sede"),

  descripcion: z.string().optional(),
  detalles: z
    .array(
      z.object({
        productoId: z.coerce
          .number({ invalid_type_error: "Seleccione un producto" })
          .min(1, "Seleccione un producto"),

        cantidad: z.coerce
          .number({ invalid_type_error: "Debe ser un número" })
          .min(1, "La cantidad debe ser al menos 1"),
      }),
    )
    .min(1, "Debes agregar al menos un producto a la recepción"),
});
