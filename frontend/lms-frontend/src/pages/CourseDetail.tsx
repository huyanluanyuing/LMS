import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api, { getCurrentUserRole, getCurrentUserId } from '../services/api';
import type { Course, Assignment } from '../types';
import { Loader2, Plus, ArrowLeft, Users } from 'lucide-react';
import AssignmentItem from '../components/AssignmentItem';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams(); // 从 URL 获取 ID
  const navigate = useNavigate();
  const role = getCurrentUserRole();
  const userId = getCurrentUserId();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!courseId || !userId) return;

        // 并行请求：获取课程详情 + 获取作业列表
        const [courseRes, assignmentsRes] = await Promise.all([
          api.get<Course>(`/courses/${courseId}`),
          api.get<Assignment[]>(`/assignments?courseId=${courseId}`)
        ]);

        setCourse(courseRes.data);
        setAssignments(assignmentsRes.data);
      } catch (error) {
        console.error("Failed to load course details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, userId]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center pt-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </Layout>
    );
  }

  if (!course) return <Layout>Course not found</Layout>;

  return (
    <Layout>
      {/* 顶部面包屑导航 */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* 课程 Header 区域 */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
            <p className="text-gray-600 max-w-2xl">{course.description}</p>
            
            <div className="flex items-center gap-4 mt-6 text-sm text-slate-500">
               <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full">
                 <Users className="w-4 h-4" />
                 {course.subject}
               </span>
               {role === 'TEACHER' && (
                 <span className="font-mono bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full border border-yellow-200">
                   Invite Code: {course.inviteCode}
                 </span>
               )}
            </div>
          </div>

          {/* 老师专属按钮：创建作业 */}
          {role === 'TEACHER' && (
            <button 
              onClick={() => alert("Create Assignment Modal")}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              <Plus className="w-5 h-5" />
              New Assignment
            </button>
          )}
        </div>
      </div>

      {/* 作业列表区域 */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          Classwork
          <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">
            {assignments.length}
          </span>
        </h2>

        {assignments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-400">No assignments posted yet.</p>
            {role === 'TEACHER' && (
              <p className="text-indigo-500 mt-2 text-sm">Click "New Assignment" to get started.</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {assignments.map(assignment => (
              <AssignmentItem 
                key={assignment.id} 
                assignment={assignment} 
                role={role as any} 
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CourseDetail;