import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, User } from 'lucide-react';
import { login } from '../services/api';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (id: number, role: 'TEACHER' | 'STUDENT') => {
    login(id, role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <BookOpen className="w-10 h-10 text-blue-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">K-12 LMS Prototype</h1>
        <p className="text-gray-500 mb-8">Select a persona to demo</p>

        <div className="space-y-4">
          {/* teacher login */}
          <button
            onClick={() => handleLogin(5, 'TEACHER')}
            className="w-full flex items-center justify-between p-4 border-2 border-blue-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800">Teacher</p>
                <p className="text-sm text-gray-500">Mr. Anderson</p>
              </div>
            </div>
            <span className="text-blue-600 font-medium">Login &rarr;</span>
          </button>

          {/* student login */}
          <button
            onClick={() => handleLogin(7, 'STUDENT')}
            className="w-full flex items-center justify-between p-4 border-2 border-green-100 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800">Student</p>
                <p className="text-sm text-gray-500">Timmy Turner</p>
              </div>
            </div>
            <span className="text-green-600 font-medium">Login &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;