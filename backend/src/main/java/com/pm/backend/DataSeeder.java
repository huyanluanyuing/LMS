//package com.pm.backend;
//
//import com.pm.backend.entity.*;
//import com.pm.backend.repository.AssignmentRepository;
//import com.pm.backend.repository.CourseRepository;
//import com.pm.backend.repository.SubmissionRepository;
//import com.pm.backend.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.ArrayList;
//import java.util.Arrays;
//import java.util.List;
//
//@Component
//@RequiredArgsConstructor
//public class DataSeeder implements CommandLineRunner {
//
//    private final UserRepository userRepository;
//    private final CourseRepository courseRepository;
//    private final AssignmentRepository assignmentRepository;
//    private final SubmissionRepository submissionRepository;
//
//    @Override
//    @Transactional // 保证数据一致性，特别是处理关联关系时
//    public void run(String... args) throws Exception {
//        // 如果数据库已经有数据，就不执行了
//        if (userRepository.count() > 0) {
//            System.out.println("数据已存在，跳过初始化...");
//            return;
//        }
//
//        System.out.println("正在初始化测试数据...");
//
//        // --- 1. 创建老师 ---
//        User teacherMath = User.builder()
//                .username("teacher_math")
//                .password("password") // 暂时明文，如果集成了 Spring Security 需要 new BCryptPasswordEncoder().encode("password")
//                .fullName("Mr. Anderson") // 致敬黑客帝国
//                .role(UserRole.TEACHER)
//                .build();
//
//        User teacherScience = User.builder()
//                .username("teacher_science")
//                .password("password")
//                .fullName("Ms. Frizzle") // 致敬神奇校车
//                .role(UserRole.TEACHER)
//                .build();
//
//        userRepository.saveAll(Arrays.asList(teacherMath, teacherScience));
//
//        // --- 2. 创建学生 ---
//        User student1 = User.builder()
//                .username("student1")
//                .password("password")
//                .fullName("Timmy Turner")
//                .role(UserRole.STUDENT)
//                .enrolledCourses(new ArrayList<>()) // 初始化 List 防止空指针
//                .build();
//
//        User student2 = User.builder()
//                .username("student2")
//                .password("password")
//                .fullName("Jimmy Neutron")
//                .role(UserRole.STUDENT)
//                .enrolledCourses(new ArrayList<>())
//                .build();
//
//        userRepository.saveAll(Arrays.asList(student1, student2));
//
//        // --- 3. 创建课程并关联 ---
//
//        // 课程 1：数学基础 (由 Mr. Anderson 教)
//        Course mathCourse = Course.builder()
//                .title("Grade 5 Math: Fractions")
//                .description("Learn how to add and subtract fractions.")
//                .subject("Math")
//                .inviteCode("MATH101")
//                .teacher(teacherMath)
//                .students(new ArrayList<>()) // 初始化
//                .build();
//
//        // 课程 2：科学实验 (由 Ms. Frizzle 教)
//        Course scienceCourse = Course.builder()
//                .title("Junior Science: Photosynthesis")
//                .description("Understanding how plants eat sunlight.")
//                .subject("Science")
//                .inviteCode("SCI202")
//                .teacher(teacherScience)
//                .students(new ArrayList<>())
//                .build();
//
//        // --- 4. 建立选课关系 (Enrollment) ---
//        // 这是一个 ManyToMany 关系。
//        // 在 JPA 中，通常建议维护关系的“拥有方” (Owning Side)。
//        // 在 User.java 中我们定义了 enrolledCourses 是 JoinTable，所以 User 是拥有方。
//
//        // 让 Timmy 选修两门课
//        student1.getEnrolledCourses().add(mathCourse);
//        student1.getEnrolledCourses().add(scienceCourse);
//
//        // 让 Jimmy 只选修数学
//        student2.getEnrolledCourses().add(mathCourse);
//
//        // 注意：因为 Course 里有 students 列表 (mappedBy)，为了保持对象状态一致性，最好双向都 add 一下
//        // 虽然存数据库主要靠 owning side，但为了防止此时内存中逻辑错误，建议加上：
//        mathCourse.getStudents().add(student1);
//        mathCourse.getStudents().add(student2);
//        scienceCourse.getStudents().add(student1);
//
//        // 先保存课程 (因为 User 引用了 Course)
//        courseRepository.saveAll(Arrays.asList(mathCourse, scienceCourse));
//
//        // 再更新并保存学生 (更新他们的关联表)
//        userRepository.saveAll(Arrays.asList(student1, student2));
//
//        Assignment assignment1 = Assignment.builder()
//                .title("Homework 1: Add Fractions")
//                .description("Solve page 10-12 in your textbook.")
//                .maxScore(100)
//                .dueDate(java.time.LocalDateTime.now().plusDays(7)) // 一周后截止
//                .course(mathCourse)
//                .build();
//
//        // 这个作业是 "AI 生成" 的例子
//        Assignment assignment2 = Assignment.builder()
//                .title("Quiz: Photosynthesis Basics")
//                .description("Explain the role of Chlorophyll in 3 sentences.")
//                .maxScore(10)
//                .dueDate(java.time.LocalDateTime.now().plusDays(3))
//                .course(scienceCourse)
//                .build();
//
//        assignmentRepository.saveAll(Arrays.asList(assignment1, assignment2));
//
//        // --- 6. 创建提交 (Submissions) ---
//
//        // Timmy 提交了数学作业
//        Submission sub1 = Submission.builder()
//                .assignment(assignment1)
//                .student(student1)
//                .content("1/2 + 1/4 = 3/4. I think this is correct.")
//                .status(SubmissionStatus.SUBMITTED)
//                .submittedAt(java.time.LocalDateTime.now())
//                .build();
//
//        // Jimmy 也提交了数学作业，而且老师已经批改了 (展示已完成状态)
//        Submission sub2 = Submission.builder()
//                .assignment(assignment1)
//                .student(student2)
//                .content("1/2 + 1/4 = 2/6") // 错误的答案
//                .grade(50)
//                .feedback("Remember to find the common denominator!")
//                .status(SubmissionStatus.GRADED)
//                .submittedAt(java.time.LocalDateTime.now().minusHours(2))
//                .build();
//
//        submissionRepository.saveAll(Arrays.asList(sub1, sub2));
//
//        System.out.println("测试数据初始化完成！");
//        System.out.println("老师账号: teacher_math / password");
//        System.out.println("学生账号: student1 / password");
//    }
//}