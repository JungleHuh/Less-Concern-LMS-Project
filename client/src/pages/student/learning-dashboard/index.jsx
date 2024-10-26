import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Brain, Book, Trophy, Clock } from 'lucide-react';

const StudentDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // 샘플 학습 데이터
  const progressData = [
    { subject: '회계원리', completed: 75, total: 100 },
    { subject: '세무회계', completed: 45, total: 100 },
    { subject: '재무회계', completed: 60, total: 100 },
  ];

  const performanceData = [
    { month: '1월', score: 65 },
    { month: '2월', score: 72 },
    { month: '3월', score: 78 },
    { month: '4월', score: 85 },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 학습 통계 카드 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">총 학습시간</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128시간</div>
            <p className="text-xs text-gray-500">이번 달</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">완료한 문제</CardTitle>
            <Trophy className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">524문제</div>
            <p className="text-xs text-gray-500">전체 진도율 78%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI 학습 추천</CardTitle>
            <Brain className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-md font-medium">재무회계 심화</div>
            <p className="text-xs text-gray-500">취약점 보완 필요</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">다음 모의고사</CardTitle>
            <Book className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-md font-medium">5일 후</div>
            <p className="text-xs text-gray-500">4월 모의고사</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 과목별 진도율 */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>과목별 진도율</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progressData.map((subject) => (
                <div key={subject.subject} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{subject.subject}</span>
                    <span>{(subject.completed / subject.total * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={subject.completed} max={subject.total} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 학습 캘린더 */}
        <Card>
          <CardHeader>
            <CardTitle>학습 캘린더</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>

      {/* 성적 추이 그래프 */}
      <Card>
        <CardHeader>
          <CardTitle>성적 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <BarChart
              width={800}
              height={300}
              data={performanceData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#8884d8" name="평균 점수" />
            </BarChart>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;