package net.miarma.backend.huertosdecine.model;

import jakarta.persistence.*;
import lombok.*;
import net.miarma.backend.huertosdecine.enumerate.RoleType;
import net.miarma.backend.huertosdecine.enumerate.StatusType;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;
import java.time.Instant;

@Entity
@Table(name = "users", schema = "core")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @Column(name = "sub")
    private String sub;

    @Column(name = "name", nullable = false, length = 256)
    private String name;

    @Column(name = "given_name", length = 128)
    private String givenName;

    @Column(name = "family_name", length = 128)
    private String familyName;

    @Column(name = "preferred_username", unique = true, length = 64)
    private String preferredUsername;

    @Column(name = "picture", length = 512)
    private String picture;

    @Column(name = "email", nullable = false, unique = true, length = 256)
    private String email;

    @Column(name = "email_verified", nullable = false)
    private Boolean emailVerified = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "global_role", nullable = false)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private RoleType globalRole = RoleType.USER;

    @Enumerated(EnumType.STRING)
    @Column(name = "global_status", nullable = false)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private StatusType globalStatus = StatusType.ACTIVE;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}