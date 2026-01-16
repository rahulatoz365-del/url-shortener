package org.url_shortener_spring.backend.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name="users",uniqueConstraints = {
        @UniqueConstraint(columnNames = "email"),
        @UniqueConstraint(columnNames = "username")
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String username;

    @Column(nullable = true)
    private String password;

    @Column(nullable = false)
    private String role = "ROLE_USER";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthProvider authProvider= AuthProvider.LOCAL;

    @Column(nullable = true)
    private String providerId;

    @Column(nullable = true)
    private String imageUrl;

    @Column(nullable = true)
    private LocalDateTime createdDate;


    @Column(nullable = true)
    private LocalDateTime updatedDate;

    @OneToMany(mappedBy = "user" , cascade=CascadeType.ALL)
    private List<UrlMapping>  urlMappings;

    @PrePersist
    protected void onCreate()
    {
        createdDate = LocalDateTime.now();
        updatedDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate()
    {
        updatedDate = LocalDateTime.now();
    }

    public User(String username, String email, String providerId, String imageUrl,AuthProvider authProvider) {
        this.username=username;
        this.email=email;
        this.authProvider=authProvider;
        this.providerId=providerId;
        this.imageUrl=imageUrl;
        this.role="ROLE_USER";
    }
}
