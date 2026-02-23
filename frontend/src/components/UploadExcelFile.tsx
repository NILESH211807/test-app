import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BadgeCheck, Upload } from 'lucide-react';
import { Button } from "./ui/button";
import { toast } from "sonner";
import { formatFileSize } from "@/utils/fileSize";
import { useParseExcelFileMutation } from "@/redux/features/api/adminSlice";
import { useNavigate } from "react-router-dom";
import { useApolloClient } from "@apollo/client/react";
import { GET_ALL_EXCEL_FILES } from "@/graphql/query/admin";

interface UploadExcelFileProps {
    isModelOpen: boolean;
    setIsModelOpen: (open: boolean) => void;
}

export default function UploadExcelFile({ isModelOpen, setIsModelOpen }: UploadExcelFileProps) {
    const [file, setFile] = useState<File | null>(null);
    const [onDragHover, setOnDragHover] = useState<boolean>(false);
    const [uploadExcelFile, { isLoading }] = useParseExcelFileMutation();
    const navigate = useNavigate();
    const client = useApolloClient();



    const handleFileUpload = async (selectedFile: File | null) => {
        const fileType = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];

        try {

            if (!selectedFile) {
                toast.error("No file selected. Please choose an Excel file to upload.");
                return;
            } else if (!fileType.includes(selectedFile.type)) {
                toast.error("Invalid file type. Please upload a valid Excel file (.xlsx or .xls).");
                return;
            } else {
                setFile(selectedFile);
                toast.success("File selected successfully.");
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : "An unknown error occurred.";
            console.error("File upload failed:", message);
            toast.error(message);
        } finally {
            setOnDragHover(false);
        }
    }

    // handleFileOnChange
    const handleFileOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        handleFileUpload(file);
    }

    // handleFileClose
    const handleFileClose = () => {
        setFile(null);
        setIsModelOpen(false);
        setOnDragHover(false);
    }

    // handleOnDragHover
    const handleOnDragHover = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setOnDragHover(true);
    }

    // handleOnDragLeave
    const handleOnDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setOnDragHover(false);
    }

    // handleOnFileDrop
    const handleOnFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const droppedFile = event.dataTransfer.files ? event.dataTransfer.files[0] : null;
        handleFileUpload(droppedFile);
    }

    // handleUploadClick
    const handleUploadClick = async () => {
        if (!file) {
            toast.error("No file selected. Please choose an Excel file to upload.");
            return;
        }

        try {

            const formData = new FormData();
            formData.append("excelFile", file);
            const response = await uploadExcelFile(formData);
            const data = response.data;
            const fileId = data?.fileId;
            client.refetchQueries({
                include: [GET_ALL_EXCEL_FILES],
            });
            navigate(`/admin/excel-editor/${fileId}`);
        } catch (err) {
            const message = err instanceof Error ? err.message : "An unknown error occurred.";
            console.error("File upload failed:", message);
            toast.error(message);
        }
    }

    return (
        <Dialog open={isModelOpen} onOpenChange={setIsModelOpen}>
            <DialogContent className="sm:max-w-115 rounded-[32px] border border-white/5 bg-[#0C0D0C]/95 backdrop-blur-2xl p-8 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-zinc-100 tracking-tight">Upload Excel File</DialogTitle>
                    <p className="text-zinc-500 text-sm">Select an Excel file to import into your workspace.</p>
                </DialogHeader>

                <div className="mt-8">
                    <div onDragOver={handleOnDragHover}
                        onDragLeave={handleOnDragLeave}
                        onDrop={handleOnFileDrop}
                        className={`group relative border-2 border-dashed hover:border-emerald-500/50 rounded-[28px] p-10 transition-all bg-zinc-900/30 flex flex-col items-center justify-center cursor-pointer ${onDragHover ? "border-emerald-500/50 bg-emerald-500/10" : "border-zinc-800"}`}>
                        <input
                            onChange={handleFileOnChange}
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept=".xlsx,.xls" />

                        {!file ? (
                            <>
                                <div className="mb-4 h-16 w-16 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-all">
                                    <Upload size={32} />
                                </div>
                                <p className="text-zinc-400 text-sm font-medium">Drop your .xlsx here</p>
                            </>
                        ) : (
                            <div className="text-center animate-in zoom-in-95 duration-300">
                                <BadgeCheck className="text-emerald-500 mx-auto mb-4" size={48} />
                                <p className="text-zinc-100 font-medium tracking-tight">File uploaded successfully!</p>
                                <p className="text-zinc-500 text-sm mt-2">{file.name}</p>
                                <p className="text-zinc-500 text-sm mt-2">{formatFileSize(file?.size || 0)}</p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <Button variant="outline" onClick={handleFileClose} className="rounded-xl py-5 cursor-pointer text-zinc-500 hover:text-zinc-200 hover:bg-white/5">Cancel</Button>
                        <Button disabled={isLoading} className="rounded-xl py-5 cursor-pointer font-bold" onClick={handleUploadClick}>
                            {isLoading ? "Uploading..." : "Upload File"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}