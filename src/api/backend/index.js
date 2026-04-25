const API_BASE_URL = "https://mangaheist-backend.onrender.com/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { "Authorization": `Bearer ${token}` } : {};
};

export const api = {
    // Auth
    register: async (userData) => {
        const res = await fetch(`${API_BASE_URL}/user/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });
        return res.json();
    },
    login: async (credentials) => {
        const res = await fetch(`${API_BASE_URL}/user/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials)
        });
        return res.json();
    },

    // Bookmarks
    toggleBookmark: async (mangaData) => {
        const res = await fetch(`${API_BASE_URL}/bookmark/toggle`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify(mangaData)
        });
        return res.json();
    },
    getBookmarks: async () => {
        const res = await fetch(`${API_BASE_URL}/bookmark/all`, {
            headers: getAuthHeaders()
        });
        return res.json();
    },

    // History
    markAsRead: async (data) => {
        const res = await fetch(`${API_BASE_URL}/history/mark`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            body: JSON.stringify(data)
        });
        return res.json();
    },
    getHistory: async () => {
        const res = await fetch(`${API_BASE_URL}/history/all`, {
            headers: getAuthHeaders()
        });
        return res.json();
    },
    getReadChapters: async (mangaId) => {
        const res = await fetch(`${API_BASE_URL}/history/read/${mangaId}`, {
            headers: getAuthHeaders()
        });
        return res.json();
    }
};
