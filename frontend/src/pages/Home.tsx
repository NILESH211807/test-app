/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BlogCard from "@/components/BlogCard";
import { GET_ALL_POST } from "@/graphql/query/post";
import { useQuery } from "@apollo/client/react";

interface GetAllPost {
    id: string,
    title: string,
    content: string,
    category: string,
    tags: string,
    isAuthor: string,
    author: {
        name: string,
        email: string
    }
}

interface GetAllPostResponse {
    getAllPost: GetAllPost[];
}


const Home = () => {

    const { data, loading } = useQuery<GetAllPostResponse>(GET_ALL_POST);
    const blogs = data?.getAllPost;

    return (
        <div className="w-full p-5 mt-18">
            {
                loading ? (
                    <div className="w-full h-screen -mt-18 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full border-4 animate-spin border-indigo-600 border-l-transparent"></div>
                    </div>
                ) : (
                    <>
                        <h1 className="text-2xl font-semibold">Blogs</h1>
                        <div className="container mx-auto p-6 max-sm:p-0 max-sm:mt-8">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {
                                    blogs?.map((blog: any) => (
                                        <BlogCard
                                            key={blog.id}
                                            {...blog} />
                                    ))
                                }
                            </div>
                        </div>
                        {/* <Activity mode={isModalOpen ? 'visible' : 'hidden'}>
                            <EditPostModal
                                isModalOpen={isModalOpen}
                                setIsModalOpen={setIsModalOpen} />
                        </Activity> */}
                    </>
                )
            }
        </div>
    )
}

export default Home
