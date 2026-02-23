export const formatDate = (date: string | number | Date) => {
    const newDate = new Date(Number(date)); // ensures timestamp works
    if (isNaN(newDate.getTime())) return "Invalid Date";

    const formatted = newDate.toLocaleDateString('en-GB');
    return formatted.replace(/\//g, '-');
};
