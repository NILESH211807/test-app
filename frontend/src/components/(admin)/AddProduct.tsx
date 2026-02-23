import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useCreateNewProductMutation } from '@/redux/features/api/oauthSlice';
import { toast } from 'sonner';

const permissionsList = [
    { id: "read_profile", label: "Read Profile" },
    { id: "edit_profile", label: "Edit Profile" },
    { id: "personal_details", label: "Access Personal Details" },
];

interface AddProductProps {
    isAddProductModalOpen: boolean;
    setIsAddProductModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddProduct = ({ isAddProductModalOpen, setIsAddProductModalOpen }: AddProductProps) => {

    const [createNewProduct, { isLoading }] = useCreateNewProductMutation();

    const [productName, setProductName] = useState("");
    const [redirectURI, setRedirectURI] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    const handlePermissionChange = (id: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productName.trim() || !redirectURI.trim()) return;

        const data = {
            name: productName,
            redirectUrl: redirectURI,
            permissions: selectedPermissions,
        };

        try {
            await createNewProduct(data).unwrap();
            toast.success('Product created successfully');
            setIsAddProductModalOpen(false);
        } catch (error) {
            // console.log(error)
            const errorMessage = error &&
                typeof error === 'object' &&
                'data' in error ? (error as any)?.data?.message : 'An unknown error occurred';
            toast.error(errorMessage);
        }
    };

    return (
        <Dialog open={isAddProductModalOpen} onOpenChange={setIsAddProductModalOpen}>
            <DialogContent className="sm:max-w-106.25">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-primary/10 rounded-full">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                            </div>
                            <DialogTitle className="text-xl">Add New Product</DialogTitle>
                        </div>
                        <DialogDescription>
                            Configure the name and access scopes for your new product.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-6">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name" className="text-sm font-semibold px-1">
                                Product Name
                            </label>
                            <Input
                                id="name"
                                autoFocus
                                placeholder="Enter product name"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="name" className="text-sm font-semibold px-1">
                                Enter Redirect URI
                            </label>
                            <Input
                                id="redirect-uri"
                                autoFocus
                                placeholder="Enter redirect URI"
                                value={redirectURI}
                                onChange={(e) => setRedirectURI(e.target.value)}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-semibold px-1">Permissions</label>
                            <div className="grid gap-3 p-4 rounded-lg border bg-muted/30">
                                {permissionsList.map((permission) => (
                                    <div key={permission.id} className="flex items-center space-x-3">
                                        <Checkbox
                                            id={permission.id}
                                            checked={selectedPermissions.includes(permission.id)}
                                            onCheckedChange={() => handlePermissionChange(permission.id)}
                                        />
                                        <label
                                            htmlFor={permission.id}
                                            className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {permission.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="ghost" type="button" className='cursor-pointer' onClick={() => setIsAddProductModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!productName.trim() || isLoading}
                            className="min-w-25 cursor-pointer"
                        >
                            {isLoading ? "Creating..." : "Create Product"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddProduct;