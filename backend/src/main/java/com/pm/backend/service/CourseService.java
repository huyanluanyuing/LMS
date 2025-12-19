package com.pm.backend.service;
import com.pm.backend.entity.Course;
import com.pm.backend.entity.User;
import com.pm.backend.entity.UserRole;
import com.pm.backend.repository.CourseRepository;
import com.pm.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;


    public List<Course> getCoursesForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() == UserRole.TEACHER) {

            return courseRepository.findByTeacherId(userId);
        } else {
            return user.getEnrolledCourses();
        }
    }


    public Course getCourseById(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }


    @Transactional
    public Course createCourse(Long teacherId, Course courseData) {
        // find teacher
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        if (teacher.getRole() != UserRole.TEACHER) {
            throw new RuntimeException("Only teachers can create courses");
        }
        // set teacher to course
        courseData.setTeacher(teacher);

        if (courseData.getInviteCode() == null || courseData.getInviteCode().isEmpty()) {
            courseData.setInviteCode(UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        }
        // save course
        return courseRepository.save(courseData);
    }
}