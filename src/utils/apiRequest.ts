import axios, { AxiosError, Method } from "axios";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest<T = any>(
  method: Method,
  url: string,
  body: any = {},
  router?: any,
): Promise<T> {
  try {
    const { data } = await axios({
      method,
      url,
      data: body,
      withCredentials: true,
      // headers: { "Content-Type": "application/json" },
    });

    // success: return EXACT backend response
    return data as T;
  } catch (err) {
    const error = err as AxiosError<any>;

    if (error?.status === 401) {
      router.push("/user-login");
    }
    // throw the backend error as-is, or fallback
    throw (
      error.response?.data || {
        message: "Something went wrong",
        success: false,
        statusCode: 500,
      }
    );
  }
}

export async function refreshToken(): Promise<boolean> {
  try {
    await axios.post(
      `${apiUrl}/api/v1/users/refresh-token`,
      {},
      {
        withCredentials: true,
      },
    );

    return true;
  } catch (err) {
    const error = err as AxiosError;

    if (error.response?.status === 401) {
      return false;
    }

    return false;
  }
}
