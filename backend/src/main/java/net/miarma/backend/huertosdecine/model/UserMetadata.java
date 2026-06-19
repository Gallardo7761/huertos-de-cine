package net.miarma.backend.huertosdecine.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.miarma.backend.huertosdecine.enumerate.CineRoleType;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType;
import java.time.Instant;

@Entity
@Table(name = "cine_user_metadata", schema = "huertos_de_cine")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserMetadata {
    @Id
    @Column(name = "user_id", length = 255)
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    @JdbcType(PostgreSQLEnumJdbcType.class)
    private CineRoleType role = CineRoleType.USER;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "deactivated_at")
    private Instant deactivatedAt;
}