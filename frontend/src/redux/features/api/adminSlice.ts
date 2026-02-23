import { baseApi } from "@/services/createApi";

export const adminApiSlice = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        parseExcelFile: builder.mutation({
            query: (body) => ({
                url: '/api/admin/parse-excel',
                method: 'POST',
                body: body,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }),
        })
    })
});

export const { useParseExcelFileMutation } = adminApiSlice;