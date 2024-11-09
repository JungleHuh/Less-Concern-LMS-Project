import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMentorsService } from "@/services/mentor";
import { useToast } from "@/hooks/use-toast";
import { EXAM_CONFIG } from "@/config/board";
import {
 Card,
 CardContent,
 CardHeader,
 CardTitle,
 CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function MentoringListPage() {
  const { examType } = useParams();
  const { toast } = useToast();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        console.log('Fetching mentors for examType:', examType);  // 디버깅용
        
        const response = await getMentorsService(examType);
        if (response.success) {
          setMentors(response.data);
        }
      } catch (error) {
        console.error('Error fetching mentors:', error);
        toast({
          variant: "destructive",
          title: "오류",
          description: "멘토 목록을 불러오는데 실패했습니다."
        });
      } finally {
        setLoading(false);
      }
    };
  
    if (examType) {  // examType이 있을 때만 호출
      fetchMentors();
    }
  }, [examType, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {EXAM_CONFIG[examType]?.name} 멘토링
        </h1>
        <p className="text-muted-foreground">
          {EXAM_CONFIG[examType]?.name} 전문가와 1:1 멘토링을 시작하세요
        </p>
      </div>

      {mentors.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            현재 등록된 멘토가 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentors.map((mentor) => (
            <Card 
              key={mentor._id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={mentor.profileImage
                    ? `http://localhost:5000/uploads/${mentor.profileImage}`
                    : null
                  }
                  alt={mentor.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('Failed to load image:', mentor.profileImage);
                    e.target.src = null; // 에러 발생 시 기본 이미지로 대체
                  }}
                />
              </div>

              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{mentor.name}</CardTitle>
                  <Badge variant="secondary">{mentor.experience}</Badge>
                </div>
                <CardDescription className="line-clamp-1">
                  {mentor.jobInfo?.position || "멘토"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {mentor.introduction}
                  </p>
                  <div className="text-sm font-medium">
                    {mentor.mentoringInfo.duration}분 / {mentor.mentoringInfo.price.toLocaleString()}원
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}