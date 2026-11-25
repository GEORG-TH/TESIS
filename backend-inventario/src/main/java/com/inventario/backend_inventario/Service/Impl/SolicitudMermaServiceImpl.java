package com.inventario.backend_inventario.Service.Impl;

import com.inventario.backend_inventario.Dto.MermaMasivaDto;
import com.inventario.backend_inventario.Dto.SolicitudMermaRequestDto;
import com.inventario.backend_inventario.Enum.EstadoSolicitud;
import com.inventario.backend_inventario.Exception.ResourceConflictException;
import com.inventario.backend_inventario.Model.*;
import com.inventario.backend_inventario.Repository.*;
import com.inventario.backend_inventario.Service.InventarioService;
import com.inventario.backend_inventario.Service.SolicitudMermaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SolicitudMermaServiceImpl implements SolicitudMermaService {

    @Autowired private SolicitudMermaRepository solicitudRepo;
    @Autowired private SedeRepository sedeRepo;
    @Autowired private UsuarioRepository usuarioRepo;
    @Autowired private ProductoRepository productoRepo;
    @Autowired private com.inventario.backend_inventario.Security.SedeAcceso sedeAcceso;
    @Autowired private InventarioService inventarioService; // Para ejecutar el descuento real de stock al aprobar

    @Override
    @Transactional
    public SolicitudMerma crearSolicitud(SolicitudMermaRequestDto dto, Integer usuarioId) {
        sedeAcceso.validar(dto.getSedeId());
        SolicitudMerma solicitud = new SolicitudMerma();

        Sede sede = sedeRepo.findById(dto.getSedeId())
                .orElseThrow(() -> new ResourceConflictException("Sede no encontrada"));
        Usuario solicitante = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new ResourceConflictException("Usuario no encontrado"));

        solicitud.setSede(sede);
        solicitud.setUsuarioSolicitante(solicitante);
        solicitud.setFechaSolicitud(LocalDateTime.now());
        solicitud.setEstado(EstadoSolicitud.PENDIENTE);

        List<DetalleSolicitudMerma> detalles = new ArrayList<>();
        for (SolicitudMermaRequestDto.ItemMerma item : dto.getItems()) {
            DetalleSolicitudMerma detalle = new DetalleSolicitudMerma();
            Producto prod = productoRepo.findById(item.getProductoId())
                    .orElseThrow(() -> new ResourceConflictException("Producto no encontrado ID: " + item.getProductoId()));

            detalle.setProducto(prod);
            detalle.setCantidad(item.getCantidad());
            detalle.setMotivo(item.getMotivo());
            detalle.setObservacion(item.getObservacion());
            detalle.setSolicitud(solicitud);
            detalles.add(detalle);
        }

        solicitud.setDetalles(detalles);
        return solicitudRepo.save(solicitud);
    }

    @Override
    public List<SolicitudMerma> listarPendientes() {
        return sedeAcceso.filtrar(solicitudRepo.findByEstado(EstadoSolicitud.PENDIENTE),
                s -> List.of(s.getSede().getIdSede()));
    }

    @Override
    @Transactional
    public void aprobarSolicitud(Long solicitudId) {
        SolicitudMerma solicitud = solicitudRepo.findById(solicitudId)
                .orElseThrow(() -> new ResourceConflictException("Solicitud no encontrada"));

        if (solicitud.getEstado() != EstadoSolicitud.PENDIENTE) {
            throw new ResourceConflictException("La solicitud ya fue procesada anteriormente");
        }
        sedeAcceso.validar(solicitud.getSede().getIdSede());

        // Traduce la solicitud aprobada al DTO que ya sabe descontar stock y registrar el Kardex
        MermaMasivaDto mermaDto = new MermaMasivaDto();
        mermaDto.setSedeId(solicitud.getSede().getIdSede());
        mermaDto.setDetalles(solicitud.getDetalles().stream().map(det -> {
            MermaMasivaDto.DetalleItem item = new MermaMasivaDto.DetalleItem();
            item.setProductoId(det.getProducto().getId_producto());
            item.setCantidad(det.getCantidad());
            item.setMotivo(det.getMotivo());
            item.setObservacion(det.getObservacion());
            return item;
        }).collect(Collectors.toList()));

        // Si el stock actual ya no alcanza, esto lanza IllegalArgumentException y revierte la transacción
        inventarioService.registrarMerma(mermaDto);

        solicitud.setEstado(EstadoSolicitud.APROBADO);
        solicitud.setFechaAprobacion(LocalDateTime.now());
        solicitudRepo.save(solicitud);
    }

    @Override
    @Transactional
    public void rechazarSolicitud(Long solicitudId, String motivo) {
        SolicitudMerma solicitud = solicitudRepo.findById(solicitudId)
                .orElseThrow(() -> new ResourceConflictException("Solicitud no encontrada"));

        if (solicitud.getEstado() != EstadoSolicitud.PENDIENTE) {
            throw new ResourceConflictException("La solicitud no está pendiente");
        }
        sedeAcceso.validar(solicitud.getSede().getIdSede());

        solicitud.setMotivoRechazo(motivo);
        solicitud.setEstado(EstadoSolicitud.RECHAZADO);
        solicitud.setFechaAprobacion(LocalDateTime.now());
        solicitudRepo.save(solicitud);
    }

    @Override
    public List<SolicitudMerma> listarHistorial() {
        return sedeAcceso.filtrar(solicitudRepo.findByEstadoNotOrderByFechaSolicitudDesc(EstadoSolicitud.PENDIENTE),
                s -> List.of(s.getSede().getIdSede()));
    }
}
