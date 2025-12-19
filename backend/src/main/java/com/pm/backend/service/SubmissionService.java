package com.pm.backend.service;

import com.pm.backend.entity.Assignment;
import com.pm.backend.entity.Submission;
import com.pm.backend.entity.SubmissionStatus;
import com.pm.backend.entity.User;
import com.pm.backend.repository.AssignmentRepository;
import com.pm.backend.repository.SubmissionRepository;
import com.pm.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;

    @Transactional
    public Submission submitAssignment(Long studentId, Long assignmentId, String content) {
        // find assignment
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        // find student
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // check for existing submission
        Optional<Submission> existing = submissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId);

        Submission submission;
        if (existing.isPresent()) {
            submission = existing.get();
            submission.setContent(content);
            submission.setSubmittedAt(LocalDateTime.now());
            submission.setStatus(SubmissionStatus.SUBMITTED);
        } else {
            submission = Submission.builder()
                    .assignment(assignment)
                    .student(student)
                    .content(content)
                    .status(SubmissionStatus.SUBMITTED)
                    .submittedAt(LocalDateTime.now())
                    .build();
        }
        return submissionRepository.save(submission);
    }


    public List<Submission> getSubmissionsByAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }


    @Transactional
    public Submission gradeSubmission(Long submissionId, Integer grade, String feedback) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        submission.setGrade(grade);
        submission.setFeedback(feedback);
        submission.setStatus(SubmissionStatus.GRADED);

        return submissionRepository.save(submission);
    }
}
