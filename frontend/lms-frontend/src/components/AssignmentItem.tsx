import React from 'react';
import type { Assignment, UserRole } from '../types';
import { FileText, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  assignment: Assignment;
  role: UserRole | null;
}

const AssignmentItem: React.FC<Props> = ({ assignment, role }) => {
  const navigate = useNavigate();
  
  // 简单的日期格式化
  const dueDate = new Date(assignment.dueDate).toLocaleDateString();
  const isOverdue = new Date(assignment.dueDate) < new Date();

  return (
    <div 
      onClick={() => navigate(`/assignments/${assignment.id}`)}
      className="bg-white border border-slate-200 rounded-xl p-4 mb-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex items-center justify-between group"
    >
      <div className="flex items-center gap-4">
        {/* 图标容器 */}
        <div className={`p-3 rounded-full ${role === 'TEACHER' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
          <FileText className="w-6 h-6" />
        </div>

        {/* 文本信息 */}
        <div>
          <h4 className="font-semibold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
            {assignment.title}
          </h4>
          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Due: {dueDate}
            </span>
            {/* 如果是过期任务，显示红色警告 */}
            {isOverdue && (
              <span className="text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded text-xs">
                Overdue
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 右侧状态/箭头 */}
      <div className="flex items-center gap-4">
        {role === 'STUDENT' && (
           // 这里未来可以根据 submission status 变色，现在先静态展示
           <span className="text-xs font-medium text-slate-400 border border-slate-200 px-2 py-1 rounded-full">
             Tap to view
           </span>
        )}
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500" />
      </div>
    </div>
  );
};

export default AssignmentItem;