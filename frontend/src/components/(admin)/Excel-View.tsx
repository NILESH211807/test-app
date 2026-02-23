/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import ExcelFileCard from '../ExcelFileCard'
import { Button } from '../ui/button'
import { Upload } from 'lucide-react'
import UploadExcelFile from '../UploadExcelFile'
import { useQuery } from '@apollo/client/react'
import { GET_ALL_EXCEL_FILES } from '@/graphql/query/admin'
import Loader from '../Loader';


interface ExcelFile {
    id: string;
    _id: string;
    filename: string;
    visibility: string;
    uploadedBy: string;
    size: number;
    createdAt: string;
    [key: string]: any;
}

interface GetAllExcelFileResponse {
    getAllExcelFile: {
        data: ExcelFile[];
    }
}

const ExcelView = () => {

    const [isModelOpen, setIsModelOpen] = useState<boolean>(false);
    const { data, loading, error } = useQuery<GetAllExcelFileResponse>(GET_ALL_EXCEL_FILES);
    const myFiles = data?.getAllExcelFile?.data;


    const { data: publicFile, loading: publicFileIsLoading, error: publicErr } = useQuery<GetAllExcelFileResponse>(GET_ALL_EXCEL_FILES, {
        variables: {
            isPublic: true
        }
    });
    const publicFiles = publicFile?.getAllExcelFile?.data;

    if (loading || publicFileIsLoading) {
        return <Loader />
    }

    // if (error) {
    //     return (
    //         <div className='w-full h-screen flex items-center justify-center'>
    //             <div className="text-red-600 text-xl">
    //                 {error?.message || "Something went wrong"}
    //             </div>
    //         </div>
    //     )
    // }

    return (
        <>
            <div className="w-full mx-auto space-y-8">
                <div className='w-full border-b pb-4 flex items-center justify-between'>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">Excel Files</h1>
                        <p className="text-muted-foreground -mt-2">
                            View and manage uploaded Excel files.
                        </p>
                    </div>
                    <Button onClick={() => setIsModelOpen(true)} className='mt-4 cursor-pointer rounded-full' variant='outline'>Upload New File <Upload /></Button>
                </div>
                <h1 className="text-xl font-semibold">Your uploaded Excel files.</h1>
                {
                    error ? (
                        <div className='w-full py- flex items-center justify-center'>
                            <div className="text-sm font-semibold my-5">
                                {error?.message || "Something went wrong"}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {myFiles?.map((file, index) => (
                                    <ExcelFileCard {...file} key={index} />
                                ))}
                            </div>
                        </>
                    )
                }

                <h1 className="text-xl font-semibold">All published files.</h1>
                {
                    publicErr?.message === "No file found" ? (
                        <div className='w-full py- flex items-center justify-center'>
                            <div className="text-sm font-semibold my-5">
                                {publicErr?.message || "Something went wrong"}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {publicFiles?.map((file, index) => (
                                <ExcelFileCard {...file} key={index} />
                            ))}
                        </div>
                    )
                }
            </div>

            {
                isModelOpen && (
                    <UploadExcelFile
                        isModelOpen={isModelOpen}
                        setIsModelOpen={setIsModelOpen} />
                )
            }
        </>
    )
}

export default ExcelView
