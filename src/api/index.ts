import axiosInstance, { ApiResponse } from './axiosInstance';

/**
 * Generic API GET request
 */
export const apiGet = async <T = any>(
  url: string,
  config?: any,
): Promise<ApiResponse<T>> => {
  try {
    return await axiosInstance.get(url, config);
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * Generic API POST request
 */
export const apiPost = async <T = any>(
  url: string,
  data?: any,
  config?: any,
): Promise<ApiResponse<T>> => {
  try {
    return await axiosInstance.post(url, data, config);
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * Generic API PUT request
 */
export const apiPut = async <T = any>(
  url: string,
  data?: any,
  config?: any,
): Promise<ApiResponse<T>> => {
  try {
    return await axiosInstance.put(url, data, config);
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * Generic API PATCH request
 */
export const apiPatch = async <T = any>(
  url: string,
  data?: any,
  config?: any,
): Promise<ApiResponse<T>> => {
  try {
    return await axiosInstance.patch(url, data, config);
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * Generic API DELETE request
 */
export const apiDelete = async <T = any>(
  url: string,
  config?: any,
): Promise<ApiResponse<T>> => {
  try {
    return await axiosInstance.delete(url, config);
  } catch (error) {
    return Promise.reject(error);
  }
};

export default axiosInstance;
