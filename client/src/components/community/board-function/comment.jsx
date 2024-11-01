// src/components/community/Comments.jsx
import { useState, useContext } from 'react';
import { AuthContext } from '@/context/auth-context';
import { createComment, deleteComment } from '@/services/comment'
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

function Comments({ postId, comments, onCommentUpdate }) {
    const { auth } = useContext(AuthContext);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            setLoading(true);
            const response = await createComment({ content, postId });
            if (response.success) {
                toast.success('댓글이 작성되었습니다.');
                setContent('');
                onCommentUpdate();
            } else {
                toast.error(response.error);
            }
        } catch (error) {
            toast.error('댓글 작성에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

        try {
            const response = await deleteComment(commentId);
            if (response.success) {
                toast.success('댓글이 삭제되었습니다.');
                onCommentUpdate();
            } else {
                toast.error(response.error);
            }
        } catch (error) {
            toast.error('댓글 삭제에 실패했습니다.');
        }
    };

    return (
        <div className="space-y-4">
            {/* 댓글 작성 폼 */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                    placeholder="댓글을 입력하세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={loading}
                    rows={3}
                />
                <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                        {loading ? '작성 중...' : '댓글 작성'}
                    </Button>
                </div>
            </form>

            <Separator />

            {/* 댓글 목록 */}
            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment._id} className="p-4 bg-muted rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="font-medium">{comment.author.userName}</div>
                                <div className="text-sm text-muted-foreground">
                                    {new Date(comment.createdAt).toLocaleString()}
                                </div>
                                <p className="mt-2">{comment.content}</p>
                            </div>
                            {auth.user?._id === comment.author._id && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(comment._id)}
                                >
                                    삭제
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Comments;