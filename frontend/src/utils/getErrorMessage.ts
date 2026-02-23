export const getErrorMessage = (error: any) => {
    if (error?.graphQLErrors?.length) {
        return error.graphQLErrors[0].message;
    }

    if (error?.networkError) {
        return "Server unreachable. Try again.";
    }

    return "Something went wrong";
};
