package net.miarma.backend.huertosdecine.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

public class CinePrincipal implements UserDetails {
    private final UUID userId;
    private final Byte role;
    private final Byte serviceId;

    public CinePrincipal(UUID userId, Byte role, Byte serviceId) {
        this.userId = userId;
        this.role = role;
        this.serviceId = serviceId;
    }

    public UUID getUserId() { return userId; }
    public Byte getRole() { return role; }

    public Byte getServiceId() {
        return serviceId;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> auth = new ArrayList<>();

        String roleName = switch(role) {
            case 0 -> "USER";
            case 1 -> "ADMIN";
            case 2 -> "DEV";
            default -> "USER";
        };

        auth.add(new SimpleGrantedAuthority("ROLE_" + roleName));

        return auth;
    }

    @Override public String getPassword() { return ""; }
    @Override public String getUsername() { return userId.toString(); }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}
