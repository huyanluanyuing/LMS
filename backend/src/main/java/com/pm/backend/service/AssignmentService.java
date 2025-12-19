package com.pm.backend.service;

import com.pm.backend.entity.Assignment;
import com.pm.backend.entity.Course;
import com.pm.backend.entity.User;
import com.pm.backend.repository.AssignmentRepository;
import com.pm.backend.repository.CourseRepository;
import com.pm.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;


    public List<Assignment> getAssignmentsByCourse(Long courseId) {
        return assignmentRepository.findByCourseId(courseId);
    }


    public Assignment getAssignmentById(Long assignmentId) {
        return assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
    }


    @Transactional
    public Assignment createAssignment(Long teacherId, Long courseId, Assignment assignmentData) {
        // find teacher
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        // find course
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // check if the teacher is the owner of the course
        if (!course.getTeacher().getId().equals(teacher.getId())) {
            throw new RuntimeException("Not authorized: You are not the teacher of this course");
        }

        // set course to assignment
        assignmentData.setCourse(course);

        // save assignment
        return assignmentRepository.save(assignmentData);
    }
}