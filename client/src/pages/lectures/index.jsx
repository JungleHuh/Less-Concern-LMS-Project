// src/pages/mentoring/index.jsx
import { useParams } from 'react-router-dom';
import { EXAM_CONFIG } from '@/config/board';
import {
 Card,
 CardContent,
 CardDescription,
 CardFooter,
 CardHeader,
 CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// 멘토 데이터 (Instructor 페이지에서, 멘토들이 자신 정보 등록할 수 있는 폼 만들어야 함)
const MENTORS = {
 cpa: [
   {
     id: 1,
     name: "김회계",
     image: "/person.png",
     title: "공인회계사 | 前 삼일회계법인",
     specialties: ["재무회계", "세무회계", "경영학"],
     experience: "경력 8년",
     description: "현직 공인회계사로서 실무 경험을 바탕으로 수험생 여러분의 합격을 도와드립니다.",
     achievements: [
       "공인회계사 1차 시험 최고득점",
       "세무사 자격증 보유",
       "멘티 80% 이상 합격"
     ],
     price: {
       hour: 50000,
       package: {
         sessions: 10,
         price: 450000,
         discount: "10%"
       }
     },
     rating: 4.9,
     reviewCount: 128
   },
   // ... 더 많은 멘토 데이터
 ],
 tax: [
   // 세무사 멘토 데이터
 ],
 // ... 다른 시험 유형의 멘토 데이터
};

export default function LecturePage() {
 const { examType } = useParams();
 const mentors = MENTORS[examType] || [];
 const examConfig = EXAM_CONFIG[examType];

 return (
   <div className="max-w-7xl mx-auto p-4">
     {/* 상단 헤더 */}
     <div className="mb-8">
       <h1 className="text-3xl font-bold mb-2">
         {examConfig?.title} 강의
       </h1>
       <p className="text-muted-foreground">
         현직 회계사의 최고의 쪽집게 강의
       </p>
     </div>

     {/* 강의 목록 */}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {mentors.map((mentor) => (
         <Card key={mentor.id} className="flex flex-col">
           <CardHeader>
             <div className="aspect-square mb-4 rounded-lg overflow-hidden">
               <img
                 src={mentor.image}
                 alt={mentor.name}
                 className="w-full h-full object-cover"
               />
             </div>
             <CardTitle className="flex items-center justify-between">
               <span>{mentor.name}</span>
               <Badge variant="secondary">{mentor.experience}</Badge>
             </CardTitle>
             <CardDescription>{mentor.title}</CardDescription>
           </CardHeader>

           <CardContent className="flex-grow">
             {/* 전문 분야 */}
             <div className="mb-4">
               <div className="font-medium mb-2">전문 분야</div>
               <div className="flex flex-wrap gap-2">
                 {mentor.specialties.map((specialty, index) => (
                   <Badge key={index} variant="outline">
                     {specialty}
                   </Badge>
                 ))}
               </div>
             </div>

             {/* 멘토 소개 */}
             <div className="mb-4">
               <div className="font-medium mb-2">멘토 소개</div>
               <p className="text-sm text-muted-foreground">
                 {mentor.description}
               </p>
             </div>

             {/* 주요 이력 */}
             <div className="mb-4">
               <div className="font-medium mb-2">주요 이력</div>
               <ul className="text-sm text-muted-foreground space-y-1">
                 {mentor.achievements.map((achievement, index) => (
                   <li key={index}>• {achievement}</li>
                 ))}
               </ul>
             </div>

             {/* 평점 */}
             <div className="flex items-center gap-2 mb-4">
               <div className="flex items-center">
                 {"★".repeat(Math.floor(mentor.rating))}
                 {mentor.rating % 1 !== 0 && "☆"}
                 {"☆".repeat(5 - Math.ceil(mentor.rating))}
               </div>
               <span className="text-muted-foreground text-sm">
                 ({mentor.reviewCount} 리뷰)
               </span>
             </div>
           </CardContent>

           <CardFooter className="bg-muted/50 rounded-b-lg pt-4">
             {/* 가격 정보 */}
             <div className="w-full space-y-2">
               <div className="flex justify-between items-center">
                 <span>1회 ({mentor.price.hour.toLocaleString()}원/시간)</span>
                 <Button variant="outline" size="sm">
                   신청하기
                 </Button>
               </div>
               <Separator />
               <div className="flex justify-between items-center">
                 <div>
                   <div>{mentor.price.package.sessions}회 패키지</div>
                   <div className="text-sm text-muted-foreground">
                     {mentor.price.package.discount} 할인
                   </div>
                 </div>
                 <Button size="sm">
                   {mentor.price.package.price.toLocaleString()}원
                 </Button>
               </div>
             </div>
           </CardFooter>
         </Card>
       ))}
     </div>
   </div>
 );
}