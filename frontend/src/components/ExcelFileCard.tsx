import { FileSpreadsheet, MoreHorizontal, Globe2, Lock, ArrowUpRight, Download, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { formatFileSize } from '@/utils/fileSize';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { CHANGE_FILE_VISIBILITY } from '@/graphql/mutations/admin';
import { toast } from 'sonner';
import { DELETE_FILE, GET_ALL_EXCEL_FILES } from '@/graphql/query/admin';

interface fileProp {
    _id: string,
    visibility: string,
    uploadedBy: string,
    size: number,
    filename: string,
    createdAt: string
}

export default function DarkNaturalFileCard(file: fileProp) {

    const isPublic = file?.visibility === "public";
    const navigate = useNavigate();
    const [changeVisibility, { loading }] = useMutation(CHANGE_FILE_VISIBILITY, {
        onCompleted: () => {
            toast.success('Visibility changed successfully');
        }, onError: (err) => {
            const message = err.message || "Something went wrong";
            toast.error(message);
        },
        refetchQueries: [{
            query: GET_ALL_EXCEL_FILES
        }]
    });

    const [deleteFile, { loading: deleteLoading }] = useMutation(DELETE_FILE, {
        onCompleted: () => {
            toast.success('File deleted successfully');
        }, onError: (err) => {
            const message = err.message || "Something went wrong";
            toast.error(message);
        },
        refetchQueries: [{
            query: GET_ALL_EXCEL_FILES
        }]
    })

    // handleOpenFile
    const handleOpenFile = (id: string) => {
        navigate(`/admin/excel-editor/${id}`);
    }

    const handleChangeVisibility = (id: string, visibility: string) => {
        changeVisibility({
            variables: {
                fileId: id,
                visibility: visibility === "public" ? "private" : "public"
            }
        })
    };

    // handleDelete
    const handleDelete = (id: string) => {
        deleteFile({
            variables: {
                fileId: id
            }
        })
    }

    const handleDownload = (fileId: string) => {
        window.open(`${import.meta.env.VITE_API_BASE_URL}/api/admin/download?fileId=${fileId}`);
    };


    return (
        <div className="group relative w-full sm:max-w-75 bg-[#161716] border border-white/5 rounded-sm p-3 transition-all duration-500 hover:border-emerald-500/30">
            <div className="flex items-center justify-between mb-5 relative z-2">
                <div className={`flex items-center gap-2 px-2 py-1 rounded-sm border transition-colors ${isPublic
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-zinc-800 border-zinc-700 text-zinc-400"
                    }`}>
                    {isPublic ? <Globe2 size={12} /> : <Lock size={12} />}
                    <span className="text-[10px] font-bold tracking-widest uppercase">{isPublic ? "Public" : "Private"}</span>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-9 w-9 rounded-full cursor-pointer text-zinc-500">
                            <MoreHorizontal size={18} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-sm border-zinc-800 bg-[#1C1D1C] text-zinc-300 p-1 backdrop-blur-xl">
                        <DropdownMenuItem onClick={() => handleOpenFile(file?._id)} className="rounded-sm gap-2 py-2 text-xs focus:bg-emerald-500/10 focus:text-emerald-400 cursor-pointer"><ArrowUpRight size={16} />Open</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(file?._id)} className="rounded-sm gap-2 py-2 text-xs focus:bg-white/5 cursor-pointer">
                            <Download size={16} /> Download
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleChangeVisibility(file?._id, file?.visibility)} className="rounded-sm gap-2 py-2 text-xs focus:bg-white/5 cursor-pointer">
                            {
                                loading ? 'Loading...' : (
                                    <>
                                        {isPublic ? <>
                                            <Lock size={16} />Private
                                        </> : (
                                            <>
                                                <Globe2 size={16} />Public
                                            </>
                                        )}
                                    </>
                                )
                            }
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(file?._id)} className="rounded-sm gap-2 py-2 text-xs text-rose-400 focus:bg-rose-500/10 focus:text-rose-400 cursor-pointer">
                            {
                                deleteLoading ? 'Loading...' : (
                                    <>
                                        <Trash2 size={16} /> Delete
                                    </>
                                )
                            }
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex flex-col gap-5 relative z-2">
                <div className="relative w-14 h-14">
                    <div className="relative w-full h-full bg-linear-to-tr from-emerald-600 to-emerald-400 rounded-sm flex items-center justify-center">
                        <FileSpreadsheet size={28} className="text-white" strokeWidth={2} />
                    </div>
                </div>

                <div className="space-y-1">
                    <h3 className="text-sm text-zinc-100 tracking-tight leading-tight line-clamp-1 font-semibold">{file?.filename}</h3>
                    <p className="text-xs text-zinc-500 font-semibold">Excel Spreadsheet • {formatFileSize(file?.size || 0)}</p>
                </div>
            </div>
        </div>
    );
}