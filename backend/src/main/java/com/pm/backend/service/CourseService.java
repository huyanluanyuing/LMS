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

    // 获取某人的课程列表 (根据角色自动区分)
    public List<Course> getCoursesForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == UserRole.TEACHER) {
            // 如果是老师，查他教的课
            return courseRepository.findByTeacherId(userId);
        } else {
            // 如果是学生，查他选的课
            // 注意：这里利用了 User 实体里的 @ManyToMany 懒加载，直接 get 即可触发查询
            return user.getEnrolledCourses();
        }
    }

    // 获取单门课程详情
    public Course getCourseById(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    // 创建课程 (老师专用)
    @Transactional
    public Course createCourse(Long teacherId, Course courseData) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        if (teacher.getRole() != UserRole.TEACHER) {
            throw new RuntimeException("Only teachers can create courses");
        }

        // 补全信息
        courseData.setTeacher(teacher);

        // 自动生成一个 6 位邀请码 (简单的随机字符串)
        if (courseData.getInviteCode() == null || courseData.getInviteCode().isEmpty()) {
            courseData.setInviteCode(UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        }

        return courseRepository.save(courseData);
    }
}