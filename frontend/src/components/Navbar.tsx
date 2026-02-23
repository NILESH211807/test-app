/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    LogOutIcon,
    UserIcon,
} from "lucide-react"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useMutation } from "@apollo/client/react";
import { LOGOUT_MUTATION } from "@/graphql/mutations/auth";
import { Activity, useState } from "react";
import { CreatePostModal } from "./CreatePost";

const Navbar = () => {

    const navigate = useNavigate();
    // const client = useApolloClient();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [mutate, { loading }] = useMutation(LOGOUT_MUTATION, {
        onCompleted: async () => {
            toast.success('Logout successfully');
            // await client.resetStore();
            navigate('/login', { replace: true });
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })

    const profileImageUrl = "https://github.com/shadcn.png";

    const handleLogout = async () => mutate({})

    return (
        <>
            <div className='w-full h-15 px-8 py-5 border-b flex items-center justify-between fixed top-0 backdrop-blur-sm'>
                <h1 className='font-bold text-lg capitalize'>Blogs</h1>
                <div className="flex items-center gap-5">
                    <Button className="cursor-pointer" onClick={() => setIsModalOpen(true)}>Create Post</Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="cursor-pointer">
                                <AvatarImage src={profileImageUrl} />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40" align="end">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
                                <UserIcon />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" variant="destructive" onClick={handleLogout}>
                                <LogOutIcon />
                                {loading ? 'Loading...' : 'Logout'}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* create post modal */}
            <Activity mode={isModalOpen ? 'visible' : 'hidden'}>
                <CreatePostModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            </Activity>
        </>
    )
}

export default Navbar;
