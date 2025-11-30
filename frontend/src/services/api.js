// src/services/api.js
import axios from "axios";

// Base URL for Node backend
const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/api";

// Axios instance for Node backend
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 600000,
    headers: { "Content-Type": "application/json" },
});

// Attach token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ------------------------------
// AUTH APIs
// ------------------------------
export const authAPI = {
    login: async (credentials) => {
        try {
            const response = await api.post("/auth/login", credentials);
            if (response.data.success && response.data.token) {
                localStorage.setItem("authToken", response.data.token);
                localStorage.setItem("userData", JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            return { success: false, error: error.response?.data?.error || "Login failed" };
        }
    },

    getUserDetails: async () => {
        try {
            const response = await api.get("/auth/me");
            return response.data;
        } catch (error) {
            return { success: false, error: error.response?.data?.error || "Failed to fetch user details" };
        }
    },

    logout: async () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        return { success: true };
    },

    verify: async () => {
        try {
            const response = await api.get("/auth/verify");
            return response.data;
        } catch (error) {
            return { success: false, error: "Token verification failed" };
        }
    },

    registerFLW: async (data) => {
        try {
            const response = await api.post("/users/register-flw", data);
            return response.data;
        } catch (error) {
            return { success: false, error: error.response?.data?.error || "FLW registration failed" };
        }
    },

    deleteFLW: async (id) => {
        try {
            const res = await api.delete(`/users/delete-flw/${id}`);
            return res.data;
        } catch (err) {
            console.error("Delete FLW Error:", err);
            return { success: false, error: err.response?.data?.error || "Server error" };
        }
    },

    
};

// ------------------------------
// ANIMAL APIs
// ------------------------------
export const animalAPI = {
    register: async (data) => {
        try {
            const response = await api.post("/animals/register", data);
            return response.data;
        } catch (error) {
            return { success: false, error: error.response?.data?.error || "Registration failed" };
        }
    },

    search: async (params) => {
        try {
            const response = await api.get("/animals/search", { params });
            return response.data;
        } catch (error) {
            return { success: false, error: error.response?.data?.error || "Search failed" };
        }
    },

    getHistory: async (userId) => {
        try {
            const response = await api.get(`/animals/history/${userId}`);
            return response.data;
        } catch (error) {
            return { success: false, error: error.response?.data?.error || "Failed to fetch history" };
        }
    },
};

// ------------------------------
// BREED AI API (FastAPI server)
// ------------------------------
const BREED_API_URL =
    process.env.REACT_APP_BREED_API_URL || "http://localhost:5000/predict";

export const breedAPI = {
    recognizeBase64: async (base64Image) => {
        try {
            const payload = { image: base64Image };
            const response = await axios.post(BREED_API_URL, payload, { timeout: 180000 });
            return response.data;
        } catch (error) {
            console.error("breedAPI error", error);
            return {
                success: false,
                error:
                    error.response?.data?.detail ||
                    error.message ||
                    "Breed recognition failed",
            };
        }
    },
};

export const reportsAPI = {
    registrationsTrend: async () => {
        return (await api.get("/reports/registrations-trend")).data;
    },
    breedDistribution: async () => {
        return (await api.get("/reports/breed-distribution")).data;
    },
    animalTypeSummary: async () => {
        return (await api.get("/reports/animal-type-summary")).data;
    },
    flwPerformance: async () => {
        return (await api.get("/reports/flw-performance")).data;
    }
};

export default api;
