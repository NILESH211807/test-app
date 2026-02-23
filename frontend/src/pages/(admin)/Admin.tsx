import { AddNewAdmin } from '@/components/(admin)/AddAdmin';
import { AdminTable } from '@/components/(admin)/AdminTable'
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Admin = () => {

    const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState<boolean>(false);

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Admin Management</h3>
                    <Button onClick={() => setIsAddAdminModalOpen(true)}
                        className='cursor-pointer rounded-full'
                        variant='outline'>
                        Add new Admin
                    </Button>
                </div>
                <AdminTable />
            </div>

            <AddNewAdmin isAddAdminModalOpen={isAddAdminModalOpen}
                setIsAddAdminModalOpen={setIsAddAdminModalOpen} />
        </>
    )
}

export default Admin;
