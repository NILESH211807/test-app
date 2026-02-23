import { AddUser } from '@/components/(admin)/AddUser';
import { UserTable } from '@/components/(admin)/UserTable'
import { Button } from '@/components/ui/button'
import { Activity, useState } from 'react'

const Users = () => {

    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState<boolean>(false);

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">User Management</h3>
                    <Button onClick={() => setIsAddUserModalOpen(true)}
                        className='cursor-pointer rounded-full'
                        variant='outline'>
                        Add user
                    </Button>
                </div>
                <UserTable />
            </div>

            <Activity mode={isAddUserModalOpen ? 'visible' : 'hidden'}>
                <AddUser isAddUserModalOpen={isAddUserModalOpen} setIsAddUserModalOpen={setIsAddUserModalOpen} />
            </Activity>
        </>
    )
}

export default Users;
