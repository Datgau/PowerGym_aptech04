export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
    status: number;
};
export function unwrapApiResponse<T>(res: ApiResponse<T>): T {
    if (!res.success) {
        throw new Error(res.message || "API Error");
    }
    return res.data as T;
}
