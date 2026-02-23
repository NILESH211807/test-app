import 'react-data-grid/lib/styles.css';
import { DataGrid } from 'react-data-grid';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { GET_EXCEL_FILES } from '@/graphql/query/admin';
import Loader from '@/components/Loader';

interface ExcelFileData {
    getExcelFiles?: {
        rows: Record<string, unknown>[];
        length: number;
    };
}

const ExcelFileEditor = () => {

    const { fid } = useParams();
    const [currentPage] = useState<number>(1);
    // const [rows, setRows] = useState([]);

    const { data, loading, error } = useQuery<ExcelFileData>(GET_EXCEL_FILES, {
        skip: !fid,
        variables: {
            fileId: fid,
            page: currentPage,
            limit: 20,
        },
    });

    const fileData = useMemo(() => data?.getExcelFiles?.rows ?? [], [data]);

    const handleDownload = () => {
        window.open(`${import.meta.env.VITE_API_BASE_URL}/api/admin/download?fileId=${fid}`);
    };

    const columns = useMemo(() => {
        if (fileData.length === 0) return [];
        return Object.keys(fileData[0]).map(key => ({
            key,
            name: key,
            editable: true
        }));
    }, [fileData]);

    // useEffect(() => {
    //     if (loading || !fileData) return;
    //     setRows(fileData)
    // }, [loading, fileData]);

    // console.log(row)

    if (loading) {
        return (
            <Loader />
        )
    }

    if (error) {
        return (
            <div className='w-full h-screen flex items-center justify-center'>
                <div className="text-red-600 text-xl">
                    {error?.message || "Something went wrong"}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex justify-center flex-col">
            <div className="flex items-center justify-between rounded-[5px] bg-[#212121] border border-white/5 p-3 mb-4">
                <div className="text-xl font-medium text-zinc-200">
                    Spreadsheet
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleDownload} className='cursor-pointer'>
                        Download
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="rounded-lg">
                <DataGrid
                    columns={columns}
                    rows={fileData}
                    // onRowsChange={setRows}
                    style={{ height: 400, borderRadius: '5px' }}
                />
            </div>
        </div>

    )
}

export default ExcelFileEditor;
