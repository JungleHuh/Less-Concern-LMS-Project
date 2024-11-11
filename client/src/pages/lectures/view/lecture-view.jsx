// pages/LectureViewPage.jsx
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getLectureByIdService } from "@/services/lecture";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, ChevronRight } from "lucide-react";

export default function LectureViewPage() {
  const { lectureId } = useParams();
  const { toast } = useToast();
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        setLoading(true);
        const response = await getLectureByIdService(lectureId);
        if (response.success) {
          setLecture(response.data);
          setCurrentVideo(response.data.videos[0]); // 첫 번째 비디오 선택
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "오류",
          description: "강의를 불러오는데 실패했습니다."
        });
      } finally {
        setLoading(false);
      }
    };

    if (lectureId) {
      fetchLecture();
    }
  }, [lectureId, toast]);

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
    setIsPlaying(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>로딩 중...</div>
      </div>
    );
  }

  if (!lecture) return null;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 비디오 플레이어 섹션 */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{lecture.title}</CardTitle>
              <CardDescription>{lecture.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 비디오 플레이어 */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {currentVideo && (
                  <>
                    <video
                      ref={videoRef}
                      src={currentVideo.videoUrl}
                      className="w-full h-full"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="flex items-center justify-between">
                        <div className="text-white">
                          <h3 className="font-medium">{currentVideo.title}</h3>
                          <p className="text-sm opacity-80">
                            {currentVideo.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={handleVideoPlay}
                        >
                          {isPlaying ? (
                            <Pause className="h-6 w-6" />
                          ) : (
                            <Play className="h-6 w-6" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* 현재 강의 정보 */}
              {currentVideo && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">{currentVideo.title}</h2>
                  <p className="text-muted-foreground">
                    {currentVideo.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 강의 목록 사이드바 */}
        <Card className="lg:h-[calc(100vh-2rem)] flex flex-col">
          <CardHeader>
            <CardTitle>강의 목록</CardTitle>
          </CardHeader>
          <ScrollArea className="flex-grow">
            <CardContent className="space-y-2">
              {lecture.videos.map((video, index) => (
                <Button
                  key={video._id}
                  variant={currentVideo?._id === video._id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleVideoSelect(video)}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 text-center">{index + 1}</span>
                    <div className="flex-grow text-left">
                      <div className="font-medium line-clamp-1">
                        {video.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDuration(video.duration)}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Button>
              ))}
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}

// 시간 포맷팅 헬퍼 함수는 이전과 동일
function formatDuration(seconds) {
  if (!seconds) return "0분";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}시간 ${minutes}분`;
  }
  return `${minutes}분`;
}