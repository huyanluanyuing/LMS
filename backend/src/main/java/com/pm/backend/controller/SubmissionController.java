package com.pm.backend.controller;

import com.pm.backend.entity.Submission;
import com.pm.backend.service.SubmissionService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    // POST /api/assignments/{assignmentId}/submit?studentId=5
    // Body: { "content": "..." }
    @PostMapping("/assignments/{assignmentId}/submit")
    public ResponseEntity<Submission> submitAssignment(
            @PathVariable Long assignmentId,
            @RequestParam Long studentId,
            @RequestBody Map<String, String> body) { //  Map -> JSON

        String content = body.get("content");
        Submission submission = submissionService.submitAssignment(studentId, assignmentId, content);
        return ResponseEntity.ok(submission);
    }


    // GET /api/assignments/{assignmentId}/submissions
    @GetMapping("/assignments/{assignmentId}/submissions")
    public ResponseEntity<List<Submission>> getSubmissions(@PathVariable Long assignmentId) {
        List<Submission> list = submissionService.getSubmissionsByAssignment(assignmentId);
        return ResponseEntity.ok(list);
    }


    // PUT /api/submissions/{submissionId}/grade
    // Body: { "grade": 95, "feedback": "Great work!" }
    @PutMapping("/submissions/{submissionId}/grade")
    public ResponseEntity<Submission> gradeSubmission(
            @PathVariable Long submissionId,
            @RequestBody GradeRequest request) {

        Submission updated = submissionService.gradeSubmission(submissionId, request.getGrade(), request.getFeedback());
        return ResponseEntity.ok(updated);
    }

    @Data
    public static class GradeRequest {
        private Integer grade;
        private String feedback;
    }
}