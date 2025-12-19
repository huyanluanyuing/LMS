import React from 'react';
import type { Course } from '../types';
import { Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  course: Course;
}

// 给不同科目分配不同的颜色 (视觉糖果)
const getSubjectColor = (subject: string) => {
  const colors: Record<string, string> = {
    Math: 'bg-blue-500',
    Science: 'bg-green-500',
    History: 'bg-yellow-500',
    Art: 'bg-purple-500',
    English: 'bg-pink-500'
  };
  return colors[subject] || 'bg-indigo-500'; // 默认颜色
};

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate();
  const colorClass = getSubjectColor(course.subject || '');

  return (
    <div 
      onClick={() => navigate(`/courses/${course.id}`)} // 点击跳转到详情
      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
    >
      {/* 彩色顶部装饰条 */}
      <div className={`h-24 ${colorClass} p-4 flex items-start justify-between relative`}>
        <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
          {course.subject || 'General'}
        </span>
        {/* 邀请码显示 (如果是老师可以看到) */}
        {course.inviteCode && (
           <span className="text-white/80 text-xs font-mono tracking-wider">
             CODE: {course.inviteCode}
           </span>
        )}
      </div>

      {/* 内容区域 */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">
          {course.description || "No description provided."}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Users className="w-4 h-4" />
            <span>{course.teacher?.fullName || 'Teacher'}</span>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default CourseCard;