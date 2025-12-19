package com.pm.backend.controller;

import com.pm.backend.entity.Course;
import com.pm.backend.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    // GET /api/courses?userId=1
    @GetMapping
    public ResponseEntity<List<Course>> getCourses(@RequestParam Long userId) {
        List<Course> courses = courseService.getCoursesForUser(userId);
        return ResponseEntity.ok(courses);
    }

    // GET /api/courses/5
    @GetMapping("/{courseId}")
    public ResponseEntity<Course> getCourseDetail(@PathVariable Long courseId) {
        Course course = courseService.getCourseById(courseId);
        return ResponseEntity.ok(course);
    }

    //  POST /api/courses?userId=1  Body: { "title": "Art Class", "subject": "Art" }
    @PostMapping
    public ResponseEntity<Course> createCourse(
            @RequestParam Long userId,
            @RequestBody Course courseData) {
        Course newCourse = courseService.createCourse(userId, courseData);
        return ResponseEntity.ok(newCourse);
    }
}
