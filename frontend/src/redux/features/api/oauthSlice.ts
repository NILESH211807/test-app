import { baseApi } from "@/services/createApi";

export const adminApiSlice = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllProducts: builder.query({
            query: () => ({
                url: '/api/oauth/products',
                method: 'GET',
            }),
            providesTags: ['GET_PRODUCTS']
        }),
        createNewProduct: builder.mutation({
            query: (body) => ({
                url: '/api/oauth/register',
                method: 'POST',
                body: body,
            }),
            invalidatesTags: ['GET_PRODUCTS']
        }),
        fetchAuthorize: builder.query({
            query: (params) => ({
                url: `api/oauth/authorize`,
                method: 'GET',
                params: params,
            }),
        }),
        approveAuthorization: builder.mutation({
            query: (body) => ({
                url: `api/oauth/authorize`,
                method: 'POST',
                body: body,
            }),
        }),

        deleteProduct: builder.mutation({
            query: (body) => ({
                url: `api/oauth/product-delete`,
                method: 'DELETE',
                body: body,
            }),
        }),
        checkPermission: builder.query({
            query: () => ({
                url: `api/oauth/check-permission`,
                method: 'GET',
            }),
        }),

        authorizeUser: builder.query({
            query: () => ({
                url: `api/oauth/authorize-user`,
                method: 'GET',
            }),
        }),
        userAccess: builder.mutation({
            query: (body) => ({
                url: `api/oauth/access`,
                method: 'POST',
                body: body,
            }),
        }),

    })
});

export const { useGetAllProductsQuery, useCreateNewProductMutation, useFetchAuthorizeQuery, useApproveAuthorizationMutation, useDeleteProductMutation, useCheckPermissionQuery, useAuthorizeUserQuery, useUserAccessMutation } = adminApiSlice;