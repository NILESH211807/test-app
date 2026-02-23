import { navigateTo } from "@/services/navigation";
import { baseApi } from "../../../services/createApi";

export const userApiSlice = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getUser: build.query({
            query: () => '/api/user',
            providesTags: ["getUser"],
        }),
        logout: build.mutation({
            query: (body) => ({
                url: '/api/user/logout',
                method: 'POST',
                body
            }),
            onQueryStarted: async () => {
                navigateTo('/login')
            },
        }),
        updateProfile: build.mutation({
            query: (body) => ({
                url: '/api/user/update-profile',
                method: 'PUT',
                body
            }),
            invalidatesTags: ["getUser"]
        }),
        changePassword: build.mutation({
            query: (body) => ({
                url: '/api/user/change-password',
                method: 'PUT',
                body
            })
        }),
        uploadPicture: build.mutation({
            query: (body) => ({
                url: '/api/user/upload-picture',
                method: 'POST',
                body,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
            invalidatesTags: ["getUser"]
        }),
    }),
});

export const { useGetUserQuery, useLogoutMutation, useUpdateProfileMutation, useChangePasswordMutation, useUploadPictureMutation } = userApiSlice;