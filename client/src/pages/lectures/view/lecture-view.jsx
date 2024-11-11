// pages/LectureViewPage.jsx
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getLectureByIdService, updateProgressService } from "@/services/lecture";
import { useToast } from "@/hooks/use-toast";
import ReactPlayer from 'react-player';
import {
 Card,
 CardContent,
 CardHeader,
 CardTitle,
 CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";

export default function LectureViewPage() {
 const { lectureId } = useParams();
 const { toast } = useToast();
 const [lecture, setLecture] = useState(null);
 const [loading, setLoading] = useState(true);
 const [currentVideo, setCurrentVideo] = useState(null);
 const [playing, setPlaying] = useState(false);
 const [progress, setProgress] = useState(0);
 const playerRef = useRef(null);
 const [totalProgress, setTotalProgress] = useState(0);
 const progressUpdateTimeout = useRef(null);

 useEffect(() => {
   const fetchLecture = async () => {
     try {
       setLoading(true);
       const response = await getLectureByIdService(lectureId);
       console.log("Lecture response:", response); // 디버깅용
       if (response.success) {
         setLecture(response.data);
         if (response.data.videos && response.data.videos.length > 0) {
           setCurrentVideo(response.data.videos[0]);
         }
       }
     } catch (error) {
       console.error('Error fetching lecture:', error);
       toast({
         variant: "destructive",
         title: "오류",
         description: "강의를 불러오는데 실패했습니다."
       });
     } finally {
       setLoading(false);
     }
   };

   fetchLecture();
 }, [lectureId, toast]);

 // 진도율 업데이트 함수
 const updateProgress = async (progressData) => {
   if (!currentVideo || !lectureId) return;

   try {
     const response = await updateProgressService(lectureId, currentVideo._id, progressData);
     if (response.success) {
       setTotalProgress(response.data.totalProgress);
     }
   } catch (error) {
     console.error('Progress update error:', error);
   }
 };

 // 진행률 업데이트 핸들러
 const handleProgress = (state) => {
   setProgress(state.played);
   
   if (progressUpdateTimeout.current) {
     clearTimeout(progressUpdateTimeout.current);
   }

   progressUpdateTimeout.current = setTimeout(() => {
     updateProgress({
       played: state.played,
       playedSeconds: state.playedSeconds,
       loaded: state.loaded,
       loadedSeconds: state.loadedSeconds
     });
   }, 5000);
 };

 // 비디오 완료 핸들러
 const handleEnded = async () => {
   setPlaying(false);
   
   await updateProgress({
     played: 1,
     playedSeconds: playerRef.current?.getDuration() || 0,
     loaded: 1,
     loadedSeconds: playerRef.current?.getDuration() || 0
   });

   // 다음 비디오로 자동 이동
   if (lecture && lecture.videos) {
     const currentIndex = lecture.videos.findIndex(v => v._id === currentVideo._id);
     if (currentIndex < lecture.videos.length - 1) {
       setCurrentVideo(lecture.videos[currentIndex + 1]);
       setPlaying(true);
     }
   }
 };

 // 비디오 선택 핸들러
 const handleVideoSelect = (video) => {
   setCurrentVideo(video);
   setPlaying(true);
   setProgress(0);
 };

 if (loading) {
   return (
     <div className="flex items-center justify-center min-h-screen">
       <div>로딩 중...</div>
     </div>
   );
 }

 if (!lecture || !currentVideo) {
   return (
     <div className="flex items-center justify-center min-h-screen">
       <div>강의를 찾을 수 없습니다.</div>
     </div>
   );
 }

 return (
   <div className="max-w-7xl mx-auto p-4">
     <div className="mb-4">
       <h1 className="text-2xl font-bold mb-2">{lecture.title}</h1>
       <div className="text-sm text-muted-foreground">
         총 진도율: {Math.round(totalProgress)}%
       </div>
     </div>

     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       <div className="lg:col-span-2 space-y-4">
         <Card>
           <CardContent className="p-0">
             <div className="aspect-video">
               <ReactPlayer
                 ref={playerRef}
                 url={currentVideo.videoUrl}
                 width="100%"
                 height="100%"
                 playing={playing}
                 controls={true}
                 onProgress={handleProgress}
                 onEnded={handleEnded}
                 progressInterval={1000}
                 config={{
                   file: {
                     attributes: {
                       controlsList: 'nodownload',
                       onContextMenu: e => e.preventDefault()
                     }
                   }
                 }}
               />
             </div>
           </CardContent>
         </Card>

         <Card>
           <CardHeader>
             <CardTitle>{currentVideo.title}</CardTitle>
             <CardDescription>{currentVideo.description}</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="text-sm text-muted-foreground">
               진행률: {Math.round(progress * 100)}%
             </div>
           </CardContent>
         </Card>
       </div>

       <div className="lg:col-span-1">
         <Card className="h-full">
           <CardHeader>
             <CardTitle>강의 목록</CardTitle>
           </CardHeader>
           <CardContent>
             <ScrollArea className="h-[60vh]">
               <div className="space-y-2">
                 {lecture.videos.map((video, index) => (
                   <Button
                     key={video._id}
                     variant={currentVideo._id === video._id ? "secondary" : "ghost"}
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
               </div>
             </ScrollArea>
           </CardContent>
         </Card>
       </div>
     </div>
   </div>
 );
}

function formatDuration(seconds) {
 if (!seconds) return "0분";
 const hours = Math.floor(seconds / 3600);
 const minutes = Math.floor((seconds % 3600) / 60);
 
 if (hours > 0) {
   return `${hours}시간 ${minutes}분`;
 }
 return `${minutes}분`;
}