import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { ApiError } from "../utils";

export class BaseApi {
  protected client: AxiosInstance;

  constructor(baseURL: string, defaultHeaders: Record<string, string> = {}) {
    this.client = axios.create({
      baseURL,
      headers: defaultHeaders,
    });
  }

  protected async get<T>(
    url: string,
    params?: Record<string, unknown>
  ): Promise<T> {
    try {
      const response = await this.client.get<T>(url, { params });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.response?.data?.message ||
            "An error occurred during GET request",
          error.response?.status
        );
      }
      throw new ApiError("Unknown error during GET request");
    }
  }

  protected async post<T>(
    url: string,
    data: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(
          error.response?.data?.message ||
            "An error occurred during POST request",
          error.response?.status
        );
      }
      throw new ApiError("Unknown error during POST request");
    }
  }
}
