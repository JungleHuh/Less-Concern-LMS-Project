import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EXAM_CONFIG } from '@/config/board';

export default function Navbar() {
const navigate = useNavigate();
const [activeMenu, setActiveMenu] = useState(null);

return (
  <div className="bg-background border-b mb-6">
    <div className="max-w-7xl mx-auto">
      <div className="flex space-x-6">
        {/* 학습 공간 */}
        <div 
          className="px-4 py-3 cursor-pointer hover:bg-accent transition-colors"
          onClick={() => navigate('/learning-space')}
        >
          <span className="font-medium">학습 공간</span>
        </div>

        {/* 강의 영상 */}
        <div 
          className="relative"
          onMouseEnter={() => setActiveMenu('lectures')}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="px-4 py-3 cursor-pointer hover:bg-accent transition-colors">
            <span className="font-medium">강의 영상</span>
          </div>
          
          {/* 드롭다운 메뉴 */}
          {activeMenu === 'lectures' && (
            <div className="absolute left-0 top-full w-64 bg-background border rounded-md shadow-lg p-2 z-50">
              {Object.entries(EXAM_CONFIG).map(([key, exam]) => (
                <div
                  key={key}
                  className="p-2 hover:bg-accent rounded-sm cursor-pointer"
                  onClick={() => navigate(`/lectures/${key}`)}
                >
                  <div className="font-medium">{exam.title} 강의</div>
                  <div className="text-sm text-muted-foreground">
                    {exam.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 멘토링 */}
        <div 
          className="relative"
          onMouseEnter={() => setActiveMenu('mentoring')}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="px-4 py-3 cursor-pointer hover:bg-accent transition-colors">
            <span className="font-medium">멘토링</span>
          </div>

          {/* 드롭다운 메뉴 */}
          {activeMenu === 'mentoring' && (
            <div className="absolute left-0 top-full w-64 bg-background border rounded-md shadow-lg p-2 z-50">
              {Object.entries(EXAM_CONFIG).map(([key, exam]) => (
                <div
                  key={key}
                  className="p-2 hover:bg-accent rounded-sm cursor-pointer"
                  onClick={() => navigate(`/mentoring/${key}`)}
                >
                  <div className="font-medium">{exam.title} 멘토링</div>
                  <div className="text-sm text-muted-foreground">
                    1:1 전문가 멘토링
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 멘토 등록 */}
      <div 
      className="relative"
      onMouseEnter={() => setActiveMenu('mentor-register')}
      onMouseLeave={() => setActiveMenu(null)}
      >
        <div 
          className="px-4 py-3 cursor-pointer hover:bg-accent transition-colors"
          onClick={() => navigate('/mentoring')}
        >
        <span className="font-medium">멘토 등록</span>
      </div>
        </div>
      </div>
    </div>
  </div>
);
}