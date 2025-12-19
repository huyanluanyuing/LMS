import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api, { getCurrentUserRole, getCurrentUserId } from '../services/api';
import type { Course, Assignment } from '../types';
import { Loader2, Plus, ArrowLeft, Users, X, Sparkles } from 'lucide-react'; // 新增图标
import AssignmentItem from '../components/AssignmentItem';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const role = getCurrentUserRole();
  const userId = getCurrentUserId();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  // --- 新增：创建作业相关的 State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    maxScore: 100,
    dueDate: '' // datetime-local string
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!courseId || !userId) return;
        const [courseRes, assignmentsRes] = await Promise.all([
          api.get<Course>(`/courses/${courseId}`),
          api.get<Assignment[]>(`/assignments?courseId=${courseId}`)
        ]);
        setCourse(courseRes.data);
        setAssignments(assignmentsRes.data);
      } catch (error) {
        console.error("Failed to load details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId, userId]);

  // --- 新增：处理创建作业逻辑 ---
  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !courseId) return;

    setIsCreating(true);
    try {
      // 格式化日期：datetime-local 出来的格式是 "yyyy-MM-ddThh:mm"，Spring Boot 最好补上秒
      const formattedDate = new Date(newAssignment.dueDate).toISOString(); 

      const payload = {
        ...newAssignment,
        dueDate: formattedDate
      };

      // 调用后端 API
      const response = await api.post(
        `/assignments?userId=${userId}&courseId=${courseId}`, 
        payload
      );

      // 成功后，更新列表、关闭弹窗、重置表单
      setAssignments([...assignments, response.data]);
      setIsModalOpen(false);
      setNewAssignment({ title: '', description: '', maxScore: 100, dueDate: '' });
      
    } catch (error) {
      alert("Failed to create assignment. Are you the teacher of this course?");
    } finally {
      setIsCreating(false);
    }
  };

  // --- 新增：模拟 AI 辅助生成描述 ---
  const handleAIGenerate = () => {
    if (!newAssignment.title) {
      alert("Please enter a title first!");
      return;
    }
    // 模拟填充内容
    setNewAssignment(prev => ({
      ...prev,
      description: `[AI Generated]\nBased on the topic "${prev.title}", students should:\n1. Read Chapter 4 of the textbook.\n2. Answer the following discussion questions.\n3. Verify your sources.\n\nGood luck!`
    }));
  };

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
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* 课程 Header */}
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

          {/* 老师点击按钮 -> 打开 Modal */}
          {role === 'TEACHER' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              <Plus className="w-5 h-5" />
              New Assignment
            </button>
          )}
        </div>
      </div>

      {/* 作业列表 */}
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
              <p className="text-indigo-500 mt-2 text-sm cursor-pointer" onClick={() => setIsModalOpen(true)}>
                Click "New Assignment" to get started.
              </p>
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

      {/* --- Create Assignment Modal (新增) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-gray-900">Post New Assignment</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Weekly Math Quiz"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newAssignment.title}
                  onChange={e => setNewAssignment({...newAssignment, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                   <input 
                      type="datetime-local" 
                      required
                      className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                      value={newAssignment.dueDate}
                      onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Max Score</label>
                   <input 
                      type="number" 
                      required
                      min="1"
                      className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                      value={newAssignment.maxScore}
                      onChange={e => setNewAssignment({...newAssignment, maxScore: parseInt(e.target.value)})}
                   />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-slate-700">Description</label>
                  {/* AI 按钮 */}
                  <button 
                    type="button"
                    onClick={handleAIGenerate}
                    className="text-xs flex items-center gap-1 text-purple-600 hover:bg-purple-50 px-2 py-1 rounded transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    Auto-Generate
                  </button>
                </div>
                <textarea 
                  rows={4}
                  required
                  placeholder="Instructions for students..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  value={newAssignment.description}
                  onChange={e => setNewAssignment({...newAssignment, description: e.target.value})}
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex justify-center items-center gap-2"
                >
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Assign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CourseDetail;