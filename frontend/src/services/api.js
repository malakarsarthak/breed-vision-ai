import axios from "axios";

/* ================================
   NODE BACKEND
   ================================ */

// ✅ FIX: Use ENV instead of localhost
const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL ||
    "https://breed-vision-ai-backend.onrender.com/api"; // fallback

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 600000,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/* ================================
   AUTH APIs
   ================================ */
export const authAPI = {
    login: async (credentials) => {
        try {
            const res = await api.post("/auth/login", credentials);
            if (res.data?.success && res.data?.token) {
                localStorage.setItem("authToken", res.data.token);
                localStorage.setItem("userData", JSON.stringify(res.data.user));
            }
            return res.data;
        } catch {
            return { success: false, error: "Login failed" };
        }
    },
};

/* ================================
   ANIMAL APIs
   ================================ */
export const animalAPI = {
    register: (data) => api.post("/animals/register", data).then(r => r.data),
    search: (params) => api.get("/animals/search", { params }).then(r => r.data),
    getHistory: (userId) => api.get(`/animals/history/${userId}`).then(r => r.data),
    delete: (id) => api.delete(`/animals/${id}`),
    deleteMultiple: (ids) => api.post("/animals/delete-multiple", { ids }),
};

/* ================================
   BREED AI API (KERAS – FASTAPI)
   ================================ */

// ⚠️ NOTE: This will NOT work until AI is deployed
const BREED_API_URL =
    process.env.REACT_APP_BREED_API_URL ||
    "http://127.0.0.1:8000/predict";

console.log("BREED_API_URL =>", BREED_API_URL);

export const breedAPI = {
    recognizeBase64: async (base64Image) => {
        try {
            const payload = { image: base64Image };
            const res = await axios.post(BREED_API_URL, payload, {
                timeout: 180000,
                headers: { "Content-Type": "application/json" },
            });
            return res.data;
        } catch (err) {
            console.error("breedAPI error:", err);
            return {
                success: false,
                error:
                    err.response?.data?.error ||
                    err.message ||
                    "Breed recognition failed",
            };
        }
    },

    saveManualBreed: async (breedName, flwId) => {
        try {
            return (
                await api.post("/breeds/manual", {
                    breedName,
                    flwId: flwId || null,
                })
            ).data;
        } catch {
            return { success: false, error: "Failed to save manual breed" };
        }
    },
};

/* ================================
   REPORT APIs
   ================================ */
export const reportsAPI = {
    registrationsTrend: async () =>
        (await api.get("/reports/registrations-trend")).data,
    breedDistribution: async () =>
        (await api.get("/reports/breed-distribution")).data,
    animalTypeSummary: async () =>
        (await api.get("/reports/animal-type-summary")).data,
    flwPerformance: async () =>
        (await api.get("/reports/flw-performance")).data,
};

export default api;