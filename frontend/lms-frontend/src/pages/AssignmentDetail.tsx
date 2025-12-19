import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import api, { getCurrentUserId, getCurrentUserRole } from '../services/api';
import type { Assignment, Submission } from '../types';
import { 
  Loader2, Calendar, FileText, CheckCircle2, 
  AlertCircle, Sparkles, Send, ArrowLeft 
} from 'lucide-react';

const AssignmentDetail: React.FC = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  const role = getCurrentUserRole();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [mySubmission, setMySubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  // 学生提交用的 State
  const [answerContent, setAnswerContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [aiHint, setAiHint] = useState<string | null>(null);

  // 老师打分用的 State
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(0);
  const [feedbackInput, setFeedbackInput] = useState('');

  // 1. 初始化数据加载
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!assignmentId) return;

        // 获取作业详情
        const assignRes = await api.get<Assignment>(`/assignments/${assignmentId}`);
        setAssignment(assignRes.data);

        // 获取该作业的所有提交 (老师看全班，学生滤自己)
        // 注意：生产环境学生不应有权访问此接口，原型演示为了方便复用接口
        const subRes = await api.get<Submission[]>(`/assignments/${assignmentId}/submissions`);
        setSubmissions(subRes.data);

        if (role === 'STUDENT' && userId) {
          const mine = subRes.data.find(s => s.student?.id === userId);
          if (mine) {
            setMySubmission(mine);
            setAnswerContent(mine.content); // 回填内容
          }
        }
      } catch (error) {
        console.error("Failed to load assignment data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [assignmentId, userId, role]);

  // --- Actions ---

  // 学生：提交作业
  const handleStudentSubmit = async () => {
    if (!assignmentId || !userId) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/assignments/${assignmentId}/submit?studentId=${userId}`, {
        content: answerContent
      });
      setMySubmission(res.data); // 更新本地状态显示已提交
      alert("Assignment submitted successfully!");
    } catch (error) {
      alert("Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  // 学生：AI 提示 (Mock)
  const handleGetAIHint = () => {
    setAiHint("💡 AI Hint: Try breaking down the problem into smaller steps. For fractions, remember to find the common denominator first!");
  };

  // 老师：点击某个学生进行打分
  const openGradingPanel = (submission: Submission) => {
    setSelectedSubmission(submission);
    setGradeInput(submission.grade || 0);
    setFeedbackInput(submission.feedback || '');
  };

  // 老师：AI 自动批改 (Mock)
  const handleAutoGrade = () => {
    // 模拟 AI 分析过程
    setFeedbackInput("AI Review: Good effort! The calculation process is clear, but check the final simplification. (Auto-generated)");
    setGradeInput(85);
  };

  // 老师：保存分数
  const handleSaveGrade = async () => {
    if (!selectedSubmission) return;
    try {
      const res = await api.put(`/submissions/${selectedSubmission.id}/grade`, {
        grade: gradeInput,
        feedback: feedbackInput
      });
      
      // 更新本地列表
      setSubmissions(prev => prev.map(s => s.id === res.data.id ? res.data : s));
      setSelectedSubmission(null); // 关闭面板
    } catch (error) {
      alert("Failed to save grade");
    }
  };

  // --- Render Helpers ---

  if (loading || !assignment) {
    return (
      <Layout>
        <div className="flex justify-center pt-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </Layout>
    );
  }

  const isOverdue = new Date(assignment.dueDate) < new Date();

  return (
    <Layout>
       <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Course
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：作业详情 (所有人都看得到) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{assignment.title}</h1>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">
                {assignment.maxScore} Points
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-slate-500 mb-6 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Due: {new Date(assignment.dueDate).toLocaleString()}
              </span>
              {isOverdue && <span className="text-red-500">Overdue</span>}
            </div>

            <div className="prose prose-slate max-w-none">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Instructions</h3>
              <p className="text-gray-600 whitespace-pre-line">{assignment.description}</p>
            </div>
          </div>

          {/* --- 学生视角：答题区域 --- */}
          {role === 'STUDENT' && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Your Work
                </h2>
                
                {mySubmission?.status === 'GRADED' ? (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Graded: {mySubmission.grade}/{assignment.maxScore}
                  </span>
                ) : mySubmission ? (
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
                    Submitted
                  </span>
                ) : (
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-bold">
                    Assigned
                  </span>
                )}
              </div>

              {/* 答题框 */}
              <textarea
                value={answerContent}
                onChange={(e) => setAnswerContent(e.target.value)}
                placeholder="Type your answer here..."
                disabled={mySubmission?.status === 'GRADED'} // 批改后不能改
                className="w-full h-40 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mb-4 resize-none"
              />

              {/* AI 提示显示区 */}
              {aiHint && (
                <div className="mb-4 p-4 bg-purple-50 border border-purple-100 rounded-xl text-purple-700 text-sm flex gap-3 animate-fadeIn">
                   <Sparkles className="w-5 h-5 flex-shrink-0" />
                   {aiHint}
                </div>
              )}

              {/* 按钮区 */}
              <div className="flex justify-between items-center">
                 <button 
                   type="button"
                   onClick={handleGetAIHint}
                   className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
                 >
                   <Sparkles className="w-4 h-4" />
                   Ask AI for a Hint
                 </button>

                 <button
                   onClick={handleStudentSubmit}
                   disabled={submitting || mySubmission?.status === 'GRADED'}
                   className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-white transition-all ${
                     mySubmission?.status === 'GRADED' 
                       ? 'bg-slate-400 cursor-not-allowed' 
                       : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
                   }`}
                 >
                   <Send className="w-4 h-4" />
                   {submitting ? 'Submitting...' : (mySubmission ? 'Resubmit' : 'Turn In')}
                 </button>
              </div>

              {/* 老师评语显示 */}
              {mySubmission?.feedback && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-gray-700 mb-2">Teacher Feedback:</h4>
                  <p className="text-slate-600 bg-slate-50 p-4 rounded-xl italic">
                    "{mySubmission.feedback}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- 老师视角：右侧提交列表 --- */}
        {role === 'TEACHER' && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  Student Submissions
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                    {submissions.length}
                  </span>
                </h3>
              </div>
              
              <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                {submissions.length === 0 ? (
                   <p className="p-8 text-center text-slate-400 text-sm">No submissions yet.</p>
                ) : (
                  submissions.map(sub => (
                    <div 
                      key={sub.id} 
                      onClick={() => openGradingPanel(sub)}
                      className="p-4 hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      <div className="flex justify-between items-start mb-1">
                         <span className="font-medium text-gray-700">{sub.student?.fullName || "Student"}</span>
                         {sub.status === 'GRADED' ? (
                           <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                             {sub.grade} / {assignment.maxScore}
                           </span>
                         ) : (
                           <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">
                             Needs Grading
                           </span>
                         )}
                      </div>
                      <p className="text-xs text-slate-400 truncate">
                        {sub.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- 老师视角：打分 Modal/Panel --- */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">
                  Grading: {selectedSubmission.student?.fullName}
                </h3>
                <button onClick={() => setSelectedSubmission(null)} className="text-slate-400 hover:text-slate-600">✕</button>
             </div>
             
             <div className="p-6 space-y-4">
               <div>
                 <label className="text-sm font-medium text-slate-500">Student Answer</label>
                 <div className="mt-1 p-4 bg-slate-50 rounded-xl text-gray-800 text-sm border border-slate-200 max-h-40 overflow-y-auto">
                   {selectedSubmission.content}
                 </div>
               </div>

               <div className="grid grid-cols-4 gap-4">
                 <div className="col-span-1">
                   <label className="text-sm font-medium text-slate-500">Grade</label>
                   <input 
                     type="number" 
                     value={gradeInput}
                     onChange={(e) => setGradeInput(Number(e.target.value))}
                     className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                   />
                 </div>
                 <div className="col-span-3 flex items-end">
                    <button 
                      onClick={handleAutoGrade}
                      className="w-full py-2 bg-purple-50 text-purple-600 border border-purple-100 rounded-lg hover:bg-purple-100 text-sm font-medium flex justify-center items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      AI Auto-Grade
                    </button>
                 </div>
               </div>

               <div>
                 <label className="text-sm font-medium text-slate-500">Feedback</label>
                 <textarea 
                   rows={3}
                   value={feedbackInput}
                   onChange={(e) => setFeedbackInput(e.target.value)}
                   className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm"
                   placeholder="Enter feedback..."
                 />
               </div>
             </div>

             <div className="p-4 bg-slate-50 flex justify-end gap-3">
               <button 
                 onClick={() => setSelectedSubmission(null)}
                 className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleSaveGrade}
                 className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md transition-colors"
               >
                 Save Grade
               </button>
             </div>
          </div>
        </div>
      )}

    </Layout>
  );
};

export default AssignmentDetail;