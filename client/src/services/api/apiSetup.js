import { createApiInstance } from "./interceptor";

export const adminApi = createApiInstance("admin");
export const api = createApiInstance("user");
