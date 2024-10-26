import { useParams } from 'react-router-dom';
import { EXAM_CONFIG } from '@/config/board';  
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
  
function ExamBoard() {
    const { examType } = useParams();
    const boardConfig = EXAM_CONFIG[examType];
  
    if (!boardConfig) {
      return <div>존재하지 않는 게시판입니다.</div>;
    }
  
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{boardConfig.title} 게시판</CardTitle>
            <p className="text-muted-foreground">{boardConfig.description}</p>
          </CardHeader>
          {/* 나머지 컴포넌트 내용 */}
        </Card>
      </div>
    );
  }
  
  export default ExamBoard;