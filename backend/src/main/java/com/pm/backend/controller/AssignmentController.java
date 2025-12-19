package com.pm.backend.controller;

import com.pm.backend.entity.Assignment;
import com.pm.backend.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "http://localhost:5173") // 允许前端访问
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;


    // GET /api/assignments?courseId=1
    @GetMapping
    public ResponseEntity<List<Assignment>> getAssignments(@RequestParam Long courseId) {
        List<Assignment> assignments = assignmentService.getAssignmentsByCourse(courseId);
        return ResponseEntity.ok(assignments);
    }


    // GET /api/assignments/5
    @GetMapping("/{id}")
    public ResponseEntity<Assignment> getAssignment(@PathVariable Long id) {
        Assignment assignment = assignmentService.getAssignmentById(id);
        return ResponseEntity.ok(assignment);
    }

    // POST /api/assignments?userId=1&courseId=1
    // Body: { "title": "...", "description": "...", "dueDate": "2025-12-25T23:59:00" }
    @PostMapping
    public ResponseEntity<Assignment> createAssignment(
            @RequestParam Long userId,
            @RequestParam Long courseId,
            @RequestBody Assignment assignmentData) {

        Assignment created = assignmentService.createAssignment(userId, courseId, assignmentData);
        return ResponseEntity.ok(created);
    }
}