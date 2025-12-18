package com.pm.backend.repository;

import com.pm.backend.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    // 查某个作业的所有提交（老师批改用）
    List<Submission> findByAssignmentId(Long assignmentId);

    // 查某个学生在某个作业的提交（防止重复提交）
    Optional<Submission> findByAssignmentIdAndStudentId(Long assignmentId, Long studentId);
}