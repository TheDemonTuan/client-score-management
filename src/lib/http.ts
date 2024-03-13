import axios, { AxiosError } from "axios";

interface SuccessResponse<T> {
	code: number;
	message: string;
	data: T;
}

interface ErrorResponse {
	code: number;
	message: string;
	data: null;
}

const http = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_API_URI}/api/`,
	timeout: 10000,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

export type ApiErrorResponse = AxiosError<ErrorResponse>;

export default http;
