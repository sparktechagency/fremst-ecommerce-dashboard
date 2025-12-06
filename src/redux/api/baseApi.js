import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

// Enhanced base query to handle token refresh
const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: "https://www.api.fremst.nu/api/v1",
    // baseUrl: "http://164.90.205.5:5001/api/v1",
    // baseUrl: "http://10.10.7.26:5010/api/v1",
    prepareHeaders: (headers) => {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  const refreshToken = Cookies.get("refreshToken");

  // Make the original request
  let result = await baseQuery(args, api, extraOptions);

  // Log the result to debug
  // console.log("API request result:", result);

  // If the access token is expired, handle token refresh
  if (result.error) {
    if (result.error.status === 401) {
      // Call the refresh token API
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          body: { refreshToken: refreshToken },
        }, // No body needed
        api,
        extraOptions
      );

      // console.log("Refresh token API result:", refreshResult);

      if (refreshResult?.data?.data) {
        // Save the new access token to localStorage
        // localStorage.removeItem("authToken");
        localStorage.setItem(
          "authToken",
          refreshResult?.data?.data?.accessToken
        );

        // Retry the original request with the new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh token failed or expired, log out the user
        console.error("Refresh token invalid or expired. Logging out...");
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("refreshToken");
        toast("Access token has expired, Please login again.");
        window.location.replace("/auth/login");
      }
    } else if (result.error.status === 400) {
      // Handle bad request errors
      console.error("Bad request error:", result.error);
    } else {
      // Handle unexpected errors
      console.error("Unexpected error:", result.error);
    }
  }

  return result;
};

// Create the API with the enhanced base query
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Company",
    "AdminData",
    "Product",
    "Category",
    "Order",
    "Employee",
    "Notification",
  ],
  endpoints: () => ({}),
});

// Export the image URL as a constant
export const imageUrl = "https://www.api.fremst.nu";
// export const imageUrl = "http://164.90.205.5:5001";
// export const imageUrl = "http://10.10.7.26:5010";
