/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Trash2, User } from 'lucide-react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMutation } from '@apollo/client/react'
import { DELETE_POST } from '@/graphql/mutations/post'
import { toast } from 'sonner'
import type { Reference, StoreObject } from '@apollo/client'

interface BlogCardProps {
    id: string;
    title: string;
    content: string;
    likes: number;
    category: string[];
    isAuthor: boolean;
    author: {
        name: string
        email: string
    }
}

interface DeletePostResponse {
    deletePost: {
        success: boolean,
        message: string,
        data: {
            id: string,
            title: string,
            content: string,
            category: string,
            tags: string
        }
    }
};

interface DeletePostVars {
    postId: string;
}



export default function BlogCard({
    id,
    title,
    content,
    category,
    isAuthor,
    author
}: BlogCardProps) {

    const [mutate, { loading: deleting }] = useMutation<DeletePostResponse, DeletePostVars>(DELETE_POST, {
        onCompleted: () => {
            toast.success('Post deleted successfully');
        },
        onError: (err: any) => {
            const message = err?.message || "Something went wrong";
            toast.error(message);
        },
        update: (cache, { data }) => {
            if (!data) return;

            cache.modify({
                fields: {
                    getAllPost(existingPosts = [], { readField }) {
                        return existingPosts.filter(
                            (post: Reference | StoreObject | undefined) =>
                                readField("id", post) !== data.deletePost.data.id
                        );
                    },
                },
            });
        }
    });

    const [postId, setPostId] = useState<string>("");

    const handleDeletePost = async (id: string) => {
        setPostId(id);
        mutate({ variables: { postId: id } });
    }


    return (
        <Card className="w-full max-w-md overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="space-y-4">
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="capitalize">
                        {category}
                    </Badge>
                </div>
                <CardTitle className="line-clamp-2 text-2xl font-bold">{title}</CardTitle>
            </CardHeader>

            <CardContent>
                <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                    {content}
                </p>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={""} alt={"test"} />
                            <AvatarFallback><User size={16} /></AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                            {author?.name || "Author Name"}
                        </span>
                    </div>

                    {/* <Button variant="ghost" size="sm" className="flex gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>{likes}</span>
                    </Button> */}
                </div>

                <hr className="w-full border-t" />

                <div className="flex w-full justify-end gap-2">
                    {isAuthor && (
                        <>
                            {/* <Button variant="outline" size="sm" className="flex gap-2 cursor-pointer">
                                <Pencil className="h-4 w-4" /> Edit
                            </Button> */}
                            <Button onClick={() => handleDeletePost(id)} variant="destructive" size="sm" className="flex gap-2 cursor-pointer">
                                {postId === id && deleting ? (
                                    "Deleting..."
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4" /> Delete
                                    </>
                                )}
                            </Button>
                        </>
                    )}
                </div>
            </CardFooter>
        </Card>
    )
}