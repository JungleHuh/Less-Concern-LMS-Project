import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EXAM_CONFIG } from '@/config/board';
import { getPosts } from '@/services/posts';
import { useToast } from "@/hooks/use-toast";
import {
 Card,
 CardContent,
 CardHeader,
 CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
 Table,
 TableBody,
 TableCell,
 TableHead,
 TableHeader,
 TableRow,
} from "@/components/ui/table";

export default function ExamBoard() {
   const { toast } = useToast();
   const navigate = useNavigate();
   const { examType } = useParams();
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const boardConfig = EXAM_CONFIG[examType];

   const fetchPosts = async () => {
       try {
           setLoading(true);
           setError(null);
           
           console.log('Fetching posts for examType:', examType);
           
           const response = await getPosts(examType);
           console.log('Posts response:', response);
           
           if (response.success) {
               const postsData = Array.isArray(response.data) ? response.data : [];
               setPosts(postsData);
           } else {
               setError(response.error);
               toast({
                   variant: "destructive",
                   title: "오류",
                   description: response.error || "게시글을 불러오는데 실패했습니다."
               });
           }
       } catch (error) {
           console.error('Error:', error);
           setError('게시글을 불러오는데 실패했습니다.');
           toast({
               variant: "destructive",
               title: "오류",
               description: "게시글을 불러오는데 실패했습니다."
           });
       } finally {
           setLoading(false);
       }
   };

   useEffect(() => {
       if (examType && boardConfig) {
           fetchPosts();
       }
   }, [examType]);

   if (!boardConfig) {
       console.log('Board config not found for:', examType);
       return <div>존재하지 않는 게시판입니다.</div>;
   }

   return (
       <Card>
           <CardHeader className="flex flex-row items-center justify-between">
               <div>
                   <CardTitle>{boardConfig.title} 게시판</CardTitle>
                   <p className="text-muted-foreground mt-2">{boardConfig.description}</p>
               </div>
               <div className="flex items-center gap-2">
                <Button
                    className="flex-row gap-2"
                    onClick={() => navigate(`/community/`)}>
                        홈으로
                    </Button>
                <Button
                    onClick={() => navigate(`/community/${examType}/write`)}>
                        글쓰기
                  </Button> 
                </div>
           </CardHeader>
           <CardContent>
               <Table>
                   <TableHeader>
                       <TableRow>
                           <TableHead className="w-[100px]">번호</TableHead>
                           <TableHead>제목</TableHead>
                           <TableHead className="w-[150px]">작성자</TableHead>
                           <TableHead className="w-[150px]">작성일</TableHead>
                           <TableHead className="w-[100px]">조회수</TableHead>
                           <TableHead className="w-[100px]">댓글</TableHead>
                       </TableRow>
                   </TableHeader>
                   <TableBody>
                       {Array.isArray(posts) && posts.length > 0 ? (
                           posts.map((post, index) => (
                               <TableRow key={post._id || index}>
                                   <TableCell>{posts.length - index}</TableCell>
                                   <TableCell 
                                       className="font-medium cursor-pointer hover:text-primary"
                                       onClick={() => navigate(`/community/${examType}/post/${post._id}`)}
                                   >
                                       <div className="flex items-center gap-2">
                                           {post.category && (
                                               <Badge variant="outline">
                                                   {post.category}
                                               </Badge>
                                           )}
                                           {post.title}
                                       </div>
                                   </TableCell>
                                   <TableCell>{post.author?.userName}</TableCell>
                                   <TableCell>
                                       {new Date(post.createdAt).toLocaleDateString()}
                                   </TableCell>
                                   <TableCell>{post.views || 0}</TableCell>
                                   <TableCell>
                                       <Badge variant="secondary">
                                           {post.comments?.length || 0}
                                       </Badge>
                                   </TableCell>
                               </TableRow>
                           ))
                       ) : (
                           <TableRow>
                               <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                   게시글이 없습니다.
                               </TableCell>
                           </TableRow>
                       )}
                   </TableBody>
               </Table>
           </CardContent>
       </Card>
   );
}