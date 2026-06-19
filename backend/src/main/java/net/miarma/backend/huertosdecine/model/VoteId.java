package net.miarma.backend.huertosdecine.model;

import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class VoteId implements Serializable {
    private String userId;
    private UUID movieId;
}