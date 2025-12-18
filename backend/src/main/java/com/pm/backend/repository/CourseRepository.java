package com.pm.backend.repository;

import com.pm.backend.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    // 方便查询：找某个老师教的所有课
    List<Course> findByTeacherId(Long teacherId);
}