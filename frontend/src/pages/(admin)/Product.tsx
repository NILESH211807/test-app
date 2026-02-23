import AddProduct from "@/components/(admin)/AddProduct";
import ProductCard, { type ProductType } from "@/components/(admin)/ProductCard";
import { Button } from "@/components/ui/button";
import { useGetAllProductsQuery } from "@/redux/features/api/oauthSlice";
import { useState } from "react";

const Product = () => {

    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState<boolean>(false);

    const { data, isLoading, isError } = useGetAllProductsQuery(undefined);
    const products = data?.products;

    return (
        <div className="w-full mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Products Management</h3>
                <Button onClick={() => setIsAddProductModalOpen(true)}
                    className='cursor-pointer rounded-full uppercase font-semibold tracking-wide'
                    variant='outline'>
                    Add product
                </Button>
            </div>

            {
                isLoading ? (
                    <p className="text-center my-5">Loading products...</p>
                ) : isError ? (
                    <p className="text-center my-5">Error loading products. Please try again.</p>
                ) : products?.length === 0 ? (
                    <p className="text-center my-5">No products found. Click "Add product" to create one.</p>
                ) : (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
                        {products && products?.map((product: ProductType) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )
            }


            {/* isAddProductModalOpen */}
            {
                isAddProductModalOpen && <AddProduct
                    isAddProductModalOpen={isAddProductModalOpen}
                    setIsAddProductModalOpen={setIsAddProductModalOpen}
                />
            }
        </div>
    )
}

export default Product;