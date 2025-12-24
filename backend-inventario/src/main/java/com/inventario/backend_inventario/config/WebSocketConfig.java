package com.inventario.backend_inventario.config;

import com.inventario.backend_inventario.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.Collections;
import java.util.List;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("http://localhost:3000")
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    System.out.println(">>> 🔌 INTENTO DE CONEXIÓN DETECTADO");
                    
                    List<String> authorization = accessor.getNativeHeader("Authorization");
                    
                    if (authorization != null && !authorization.isEmpty()) {
                        String rawToken = authorization.get(0);
                        System.out.println(">>> 🔑 Header Authorization recibido: " + rawToken);
                        
                        if (rawToken.startsWith("Bearer ")) {
                            String token = rawToken.substring(7);
                            try {
                                if (jwtUtil.validateToken(token) != null) {
                                    String email = jwtUtil.getEmailFromToken(token);
                                    System.out.println(">>> ✅ Token VÁLIDO. Usuario: " + email);
                                    
                                    UsernamePasswordAuthenticationToken auth = 
                                        new UsernamePasswordAuthenticationToken(email, null, Collections.emptyList());
                                    
                                    accessor.setUser(auth);
                                } else {
                                    System.out.println(">>> ❌ Token RECHAZADO por jwtUtil (return null)");
                                }
                            } catch (Exception e) {
                                System.out.println(">>> 💥 Error al validar token: " + e.getMessage());
                            }
                        } else {
                            System.out.println(">>> ⚠️ El token no empieza con 'Bearer '");
                        }
                    } else {
                        System.out.println(">>> 🚫 NO SE RECIBIÓ HEADER AUTHORIZATION (Conexión Anónima)");
                    }
                }
                return message;
            }
        });
    }
}