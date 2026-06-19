package net.miarma.backend.huertosdecine.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "cine_votes", schema = "huertos_de_cine")
@IdClass(VoteId.class)
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vote {

    @Id
    @Column(name = "user_id", length = 255)
    private String userId;

    @Id
    @Column(name = "movie_id")
    private UUID movieId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", insertable = false, updatable = false)
    private Movie movie;

    @Column(name = "vote", nullable = false)
    private Short vote;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}