import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import documentService from '../services/document.service';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Reply } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

function DocumentComments({ documentId }) {
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const queryClient = useQueryClient();

    // Get user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const { data: comments = [], isLoading } = useQuery({
        queryKey: ['document', documentId, 'comments'],
        queryFn: () => documentService.getComments(documentId)
    });

    const addCommentMutation = useMutation({
        mutationFn: (content) => documentService.addComment(documentId, content, currentUser._id),
        onSuccess: () => {
            queryClient.invalidateQueries(['document', documentId, 'comments']);
            setNewComment('');
        }
    });

    const addReplyMutation = useMutation({
        mutationFn: ({ commentId, content }) => 
            documentService.addReply(documentId, commentId, content, currentUser._id),
        onSuccess: () => {
            queryClient.invalidateQueries(['document', documentId, 'comments']);
            setReplyContent('');
            setReplyingTo(null);
        }
    });

    const handleAddComment = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            addCommentMutation.mutate(newComment.trim());
        }
    };

    const handleAddReply = (e, commentId) => {
        e.preventDefault();
        if (replyContent.trim()) {
            addReplyMutation.mutate({ commentId, content: replyContent.trim() });
        }
    };

    if (isLoading) {
        return <div className="p-4 text-center">Loading comments...</div>;
    }

    return (
        <div className="h-full flex flex-col">
            {/* Comments List */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment._id} className="space-y-4">
                            {/* Main Comment */}
                            <div className="flex space-x-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={comment.user?.avatar} />
                                    <AvatarFallback>
                                        {comment.user?.userName?.charAt(0)?.toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-sm">
                                                {comment.user?.userName || 'Unknown User'}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700">{comment.content}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs text-gray-500 hover:text-gray-700 mt-1"
                                        onClick={() => setReplyingTo(comment._id)}
                                    >
                                        <Reply className="h-3 w-3 mr-1" />
                                        Reply
                                    </Button>
                                </div>
                            </div>

                            {/* Reply Form */}
                            {replyingTo === comment._id && (
                                <div className="ml-11 pl-3 border-l-2 border-gray-200">
                                    <form onSubmit={(e) => handleAddReply(e, comment._id)} className="flex space-x-2">
                                        <Textarea
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder="Write a reply..."
                                            className="flex-1 min-h-[80px]"
                                        />
                                        <Button
                                            type="submit"
                                            size="sm"
                                            className="self-end"
                                            disabled={!replyContent.trim() || addReplyMutation.isPending}
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </div>
                            )}

                            {/* Replies */}
                            {comment.replies?.length > 0 && (
                                <div className="ml-11 pl-3 border-l-2 border-gray-200 space-y-4">
                                    {comment.replies.map((reply) => (
                                        <div key={reply._id} className="flex space-x-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={reply.user?.avatar} />
                                                <AvatarFallback>
                                                    {reply.user?.userName?.charAt(0)?.toUpperCase() || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-medium text-sm">
                                                            {reply.user?.userName || 'Unknown User'}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {format(new Date(reply.createdAt), 'MMM d, yyyy h:mm a')}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-700">{reply.content}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {/* New Comment Form */}
            <div className="border-t p-4">
                <form onSubmit={handleAddComment} className="flex space-x-2">
                    <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 min-h-[80px]"
                    />
                    <Button
                        type="submit"
                        size="sm"
                        className="self-end"
                        disabled={!newComment.trim() || addCommentMutation.isPending}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default DocumentComments; 