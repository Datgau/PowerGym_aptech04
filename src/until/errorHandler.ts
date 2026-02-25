// src/utils/errorHandler.ts
import { AxiosError } from "axios";
import type { ApiResponse } from "../@type/apiResponse";

export function getApiErrorMessage(error: unknown): string {
    if (error instanceof AxiosError) {
        const data = error.response?.data as ApiResponse<any> | undefined;
        return data?.message || "Có lỗi xảy ra";
    }
    return "Lỗi không xác định";
}


// dùng như này
// catch (error) {
//     setFeedback({
//         type: "error",
//         message: getApiErrorMessage(error),
//     });
// }
