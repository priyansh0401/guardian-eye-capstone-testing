import axios from "axios"

// Create an axios instance with default config
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle token refresh or logout on 401
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // In a real app, this would call the refresh token endpoint
        // const refreshToken = localStorage.getItem("refreshToken")
        // const response = await axios.post("/api/auth/token/refresh/", { refresh: refreshToken })
        // localStorage.setItem("token", response.data.access)

        // Retry the original request with the new token
        // return api(originalRequest)

        // For demo purposes, we'll just logout
        localStorage.removeItem("token")
        window.location.href = "/auth/login"
      } catch (refreshError) {
        // If refresh fails, logout
        localStorage.removeItem("token")
        window.location.href = "/auth/login"
      }
    }

    return Promise.reject(error)
  },
)
