// 应用常量定义
export const APP_CONSTANTS = {
  APP_NAME: "LearnSync",
  VERSION: "1.0.0",
  SUPPORT_EMAIL: "support@learnsync.com",
};

// API 端点
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    PROFILE: "/api/auth/profile",
  },
  GROUPS: {
    LIST: "/api/groups",
    CREATE: "/api/groups",
    DETAIL: "/api/groups/:id",
  },
  MESSAGES: {
    LIST: "/api/groups/:id/messages",
    SEND: "/api/groups/:id/messages",
  },
};

// 本地存储键名
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
  THEME: "theme",
};
