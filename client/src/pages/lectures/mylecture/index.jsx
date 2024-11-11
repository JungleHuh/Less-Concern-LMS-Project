// pages/LearningSpacePage.jsx
import { useEffect, useState } from "react";
import { getMyLecturesService } from "@/services/lecture";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

export default function LearningSpacePage() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyLectures = async () => {
      try {
        const response = await getMyLecturesService();
        if (response.success) {
          setLectures(response.data);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "오류",
          description: "강의 목록을 불러오는데 실패했습니다."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMyLectures();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">내 학습 공간</h1>
      
      {lectures.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">
            수강 중인 강의가 없습니다.
          </p>
          <Button onClick={() => navigate('/lectures')}>
            강의 둘러보기
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lectures.map((lecture) => (
            <Card key={lecture._id}>
              <CardHeader>
                <CardTitle className="line-clamp-2">{lecture.title}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {lecture.watchedVideos || 0} / {lecture.videos?.length} 강의 수강
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress 
                  value={
                    (lecture.watchedVideos / lecture.videos?.length) * 100
                  } 
                />
                <Button 
                  className="w-full"
                  onClick={() => navigate(`/lecture/view/${lecture._id}`)}
                >
                  학습 계속하기
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}