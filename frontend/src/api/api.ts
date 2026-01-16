import axios, { AxiosInstance } from "axios";

// Extend ImportMeta interface to include custom Vite environment variables
interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
}

// Augment the ImportMeta interface used by Vite
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Create and export a pre-configured Axios instance with base URL from environment
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export default api;