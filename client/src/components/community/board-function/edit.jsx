import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPost, updatePost } from '@/services/posts';
import { EXAM_CONFIG } from '@/config/board';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
 Card,
 CardContent,
 CardHeader,
 CardTitle,
 CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";

function EditPost() {
 const { toast } = useToast();
 const navigate = useNavigate();
 const { examType, postId } = useParams();
 const [loading, setLoading] = useState(true);
 const [formData, setFormData] = useState({
   title: '',
   content: '',
   category: ''
 });

 const boardConfig = EXAM_CONFIG[examType];

 useEffect(() => {
   const fetchPost = async () => {
     try {
       const response = await getPost(postId);
       if (response.success) {
         const { title, content, category } = response.data;
         setFormData({ title, content, category });
       } else {
         toast({
           variant: "destructive",
           title: "오류",
           description: "게시글을 불러오는데 실패했습니다."
         });
         navigate(`/community/${examType}`);
       }
     } catch (error) {
       toast({
         variant: "destructive",
         title: "오류",
         description: "게시글을 불러오는데 실패했습니다."
       });
       navigate(`/community/${examType}`);
     } finally {
       setLoading(false);
     }
   };

   fetchPost();
 }, [postId, examType, navigate, toast]);

 const handleSubmit = async (e) => {
   e.preventDefault();

   try {
     const response = await updatePost(postId, {
       ...formData,
       examType
     });

     if (response.success) {
       toast({
         title: "성공",
         description: "게시글이 수정되었습니다."
       });
       navigate(`/community/${examType}/post/${postId}`);
     } else {
       toast({
         variant: "destructive",
         title: "오류",
         description: response.error || "게시글 수정에 실패했습니다."
       });
     }
   } catch (error) {
     toast({
       variant: "destructive",
       title: "오류",
       description: "게시글 수정에 실패했습니다."
     });
   }
 };

 if (!boardConfig) return (
   <>
     <Toaster />
     <div>존재하지 않는 게시판입니다.</div>
   </>
 );
 
 if (loading) return (
   <>
     <Toaster />
     <div>Loading...</div>
   </>
 );

 return (
   <>
     <Toaster />
     <Card>
       <form onSubmit={handleSubmit}>
         <CardHeader>
           <CardTitle>게시글 수정</CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
           <div className="space-y-2">
             <Select
               value={formData.category}
               onValueChange={(value) => 
                 setFormData(prev => ({ ...prev, category: value }))
               }
             >
               <SelectTrigger>
                 <SelectValue placeholder="카테고리 선택" />
               </SelectTrigger>
               <SelectContent>
                 {boardConfig.categories.map((category) => (
                   <SelectItem key={category} value={category}>
                     {category}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>

           <div className="space-y-2">
             <Input
               placeholder="제목"
               value={formData.title}
               onChange={(e) => 
                 setFormData(prev => ({ ...prev, title: e.target.value }))
               }
               required
             />
           </div>

           <div className="space-y-2">
             <Textarea
               placeholder="내용을 입력하세요"
               value={formData.content}
               onChange={(e) => 
                 setFormData(prev => ({ ...prev, content: e.target.value }))
               }
               required
               rows={15}
             />
           </div>
         </CardContent>

         <CardFooter className="flex justify-between">
           <Button 
             type="button"
             variant="outline" 
             onClick={() => navigate(`/community/${examType}/post/${postId}`)}
           >
             취소
           </Button>
           <Button type="submit">수정하기</Button>
         </CardFooter>
       </form>
     </Card>
   </>
 );
}

export default EditPost;