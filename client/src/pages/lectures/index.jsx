import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLecturesService, enrollLectureService } from "@/services/lecture";
import { useToast } from "@/hooks/use-toast";
import { EXAM_CONFIG } from "@/config/board";
import {
 Card,
 CardContent,
 CardHeader,
 CardTitle,
 CardDescription,
 CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function LectureListPage() {
 const { examType } = useParams();
 const { toast } = useToast();
 const [lectures, setLectures] = useState([]);
 const [loading, setLoading] = useState(true);
 const navigate = useNavigate();
 const [selectedLecture, setSelectedLecture] = useState(null);
 const [showPaymentDialog, setShowPaymentDialog] = useState(false);

 useEffect(() => {
   const fetchLectures = async () => {
     try {
       setLoading(true);
       const response = await getLecturesService(examType);
       if (response.success) {
         setLectures(response.data);
       }
     } catch (error) {
       console.error('Lectures fetch error:', error);
       toast({
         variant: "destructive",
         title: "오류",
         description: "강의 목록을 불러오는데 실패했습니다."
       });
     } finally {
       setLoading(false);
     }
   };

   if (examType) {
     fetchLectures();
   }
 }, [examType, toast]);

 const handleEnrollment = async () => {
   try {
     const response = await enrollLectureService(selectedLecture._id);
     if (response.success) {
       toast({
         title: "수강신청 완료",
         description: "학습 공간에서 강의를 시청하실 수 있습니다."
       });
       navigate('/learning-space');
     }
   } catch (error) {
     toast({
       variant: "destructive",
       title: "오류",
       description: "수강신청에 실패했습니다."
     });
   } finally {
     setShowPaymentDialog(false);
     setSelectedLecture(null);
   }
 };

 const handlePaymentClick = (lecture) => {
   setSelectedLecture(lecture);
   setShowPaymentDialog(true);
 };

 if (loading) {
   return (
     <div className="flex items-center justify-center min-h-screen">
       <div>로딩 중...</div>
     </div>
   );
 }

 return (
   <>
     <div className="max-w-7xl mx-auto p-4">
       <div className="mb-8">
         <h1 className="text-3xl font-bold mb-2">
           {EXAM_CONFIG[examType]?.name} 강의
         </h1>
         <p className="text-muted-foreground">
           {EXAM_CONFIG[examType]?.name} 전문가의 고품질 강의를 만나보세요
         </p>
       </div>

       {lectures.length === 0 ? (
         <div className="text-center py-10">
           <p className="text-muted-foreground">
             현재 등록된 강의가 없습니다.
           </p>
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {lectures.map((lecture) => (
             <Card key={lecture._id} className="flex flex-col">
               <div className="aspect-video overflow-hidden bg-muted">
                 {lecture.videos?.[0]?.videoUrl ? (
                   <video
                     src={lecture.videos[0].videoUrl}
                     className="w-full h-full object-cover"
                     poster={lecture.thumbnail}
                   />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                     미리보기 없음
                   </div>
                 )}
               </div>

               <CardHeader>
                 <div className="flex items-center justify-between">
                   <CardTitle className="line-clamp-2">{lecture.title}</CardTitle>
                   <Badge variant="secondary">
                     {lecture.videos?.length || 0}개 강의
                   </Badge>
                 </div>
                 <CardDescription className="line-clamp-2">
                   {lecture.description}
                 </CardDescription>
               </CardHeader>

               <CardContent className="flex-grow">
                 <div className="space-y-4">
                   <div className="text-sm text-muted-foreground">
                     <div>총 강의 시간: {formatDuration(lecture.totalDuration)}</div>
                     <div>강사: {lecture.instructor?.name || "Unknown"}</div>
                   </div>

                   <div className="space-y-2">
                     <div className="font-medium">강의 목록</div>
                     <ul className="text-sm space-y-1">
                       {lecture.videos?.slice(0, 3).map((video, index) => (
                         <li key={index} className="line-clamp-1">
                           • {video.title}
                         </li>
                       ))}
                       {lecture.videos?.length > 3 && (
                         <li className="text-muted-foreground">
                           외 {lecture.videos.length - 3}개 강의
                         </li>
                       )}
                     </ul>
                   </div>
                 </div>
               </CardContent>

               <CardFooter className="border-t bg-muted/50">
                 <div className="w-full space-y-2">
                   <div className="flex justify-between items-center">
                     <span className="text-lg font-semibold">
                       {Number(lecture.price).toLocaleString()}원
                     </span>
                     <Button onClick={() => handlePaymentClick(lecture)}>
                       수강신청
                     </Button>
                   </div>
                 </div>
               </CardFooter>
             </Card>
           ))}
         </div>
       )}
     </div>

     <AlertDialog 
       open={showPaymentDialog} 
       onOpenChange={setShowPaymentDialog}
     >
       <AlertDialogContent>
         <AlertDialogHeader>
           <AlertDialogTitle>수강신청 확인</AlertDialogTitle>
           <AlertDialogDescription>
             {selectedLecture?.title} 강의를{' '}
             {Number(selectedLecture?.price).toLocaleString()}원에 
             수강하시겠습니까?
           </AlertDialogDescription>
         </AlertDialogHeader>
         <AlertDialogFooter>
           <AlertDialogCancel onClick={() => {
             setShowPaymentDialog(false);
             setSelectedLecture(null);
           }}>
             취소
           </AlertDialogCancel>
           <AlertDialogAction onClick={handleEnrollment}>
             결제하기
           </AlertDialogAction>
         </AlertDialogFooter>
       </AlertDialogContent>
     </AlertDialog>
   </>
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