package com.pm.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String subject; // e.g., "Math", "History"


    private String inviteCode;


    @ManyToOne(fetch = FetchType.EAGER) // foreign key
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @ManyToMany(mappedBy = "enrolledCourses", fetch = FetchType.LAZY)
    private List<User> students;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
