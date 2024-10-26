import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BOARD_CONFIGS } from '../../config/board';

export const ExamBoardList = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.values(BOARD_CONFIGS).map((board) => (
        <Card 
          key={board.examType}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate(`/community/${board.examType}`)}
        >
          <CardHeader className="flex flex-row items-center gap-2">
            {board.icon}
            <CardTitle>{board.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {board.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
