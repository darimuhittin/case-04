import axios from "axios";
import {
  ApiResponse,
  LoginResponse,
  FinancialSummary,
  WorkingCapitalPayload,
  WalletResponse,
  RecentTransactionsPayload,
  ScheduledTransfersPayload,
} from "./types";

// PDF'te belirtilen Production Base URL
const API_URL = "/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // HttpOnly cookie'lerin (Refresh Token) gönderilebilmesi için gerekli
  withCredentials: true,
});

// --- REFRESH TOKEN STATE ---
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- REQUEST INTERCEPTOR ---
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Eğer hata 401 ise ve bu istek zaten bir "tekrar deneme" değilse
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Eğer hata veren istek zaten Refresh Token isteğiyse, sonsuz döngüye girme -> Logout yap
      if (originalRequest.url === "/users/refresh-token") {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          window.location.href = "/sign-in";
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Eğer şu an zaten token yenileniyorsa, bu isteği kuyruğa ekle
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // FIX: 400 Bad Request Hatası Çözümü
        // Axios, post metodunda ikinci parametre (body) verilmezse bazen Content-Type header'ını
        // yanlış yönetebilir veya sunucu boş body'i parse edemeyebilir.
        // Bu yüzden boş bir obje {} gönderiyoruz.
        const { data } = await api.post<ApiResponse<{ accessToken: string }>>(
          "/users/refresh-token",
          {}
        );

        console.log("refresh token response", data.data);

        const newAccessToken = data.data.accessToken;

        // Yeni token'ı kaydet
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", newAccessToken);
        }

        // Header'ı güncelle
        api.defaults.headers.common["Authorization"] =
          "Bearer " + newAccessToken;
        originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;

        // Bekleyen kuyruğu işle
        processQueue(null, newAccessToken);

        // Orijinal isteği tekrarla
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh başarısız olduysa (Token süresi tamamen dolmuş veya cookie yok)
        processQueue(refreshError, null);

        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          // Sadece auth sayfalarında değilsek login sayfasına yönlendir
          if (
            !window.location.pathname.startsWith("/sign-in") &&
            !window.location.pathname.startsWith("/sign-up")
          ) {
            window.location.href = "/sign-in";
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// --- API ÇAĞRILARI ---

export const authApi = {
  login: async (data: any) =>
    (await api.post<LoginResponse>("/users/login", data)).data,
  register: async (data: any) => (await api.post("/users/register", data)).data,
  logout: async () => (await api.post("/users/logout")).data,
  getProfile: async () => (await api.get("/users/profile")).data,
};

export const financialApi = {
  getSummary: async () =>
    (await api.get<ApiResponse<FinancialSummary>>("/financial/summary")).data,
  getWorkingCapital: async () =>
    (
      await api.get<ApiResponse<WorkingCapitalPayload>>(
        "/financial/working-capital"
      )
    ).data,
  getWallet: async () =>
    (await api.get<WalletResponse>("/financial/wallet")).data,
  getRecentTransactions: async (limit: number = 20) =>
    (
      await api.get<ApiResponse<RecentTransactionsPayload>>(
        "/financial/transactions/recent",
        {
          params: { limit },
        }
      )
    ).data,
  getScheduledTransfers: async () =>
    (
      await api.get<ApiResponse<ScheduledTransfersPayload>>(
        "/financial/transfers/scheduled"
      )
    ).data,
};
