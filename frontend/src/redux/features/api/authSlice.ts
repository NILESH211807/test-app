import { baseApi } from "../../../services/createApi";

export const authApiSlice = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendOTP: builder.mutation({
            query: (body) => ({
                url: '/api/auth/send-otp',
                method: 'POST',
                body,
            })
        }),
        resendOTP: (builder.mutation({
            query: (body) => ({
                url: '/api/auth/resend-otp',
                method: 'POST',
                body,
            })
        })),
        signup: builder.mutation({
            query: (body) => ({
                url: '/api/auth/signup',
                method: 'POST',
                body,
            }),
            invalidatesTags: ["getUser"]
        }),
        login: builder.mutation({
            query: (body) => ({
                url: '/api/auth/login',
                method: 'POST',
                body
            }),
            invalidatesTags: ["getUser"]
        }),
        forgotPassword: builder.mutation({
            query: (body) => ({
                url: '/api/auth/forgot-password',
                method: 'PUT',
                body
            }),
        }),
    })
});

export const { useSendOTPMutation, useResendOTPMutation, useSignupMutation, useLoginMutation, useForgotPasswordMutation } = authApiSlice;