package com.inventario.backend_inventario.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage(); 
        message.setTo(to); 
        message.setSubject("Restablecimiento de Contraseña - SWCI+"); 
        message.setText("Hola,\n\nHas solicitado restablecer tu contraseña."
            + " Haz clic en el siguiente enlace para continuar:\n\n" + resetLink
            + "\n\nSi no solicitaste esto, ignora este correo." +
            "\n\nSaludos,\nEl equipo de SWCI+");
        
        mailSender.send(message);
    }
}
