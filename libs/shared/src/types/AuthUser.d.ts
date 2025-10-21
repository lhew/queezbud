export type AuthUser = {
    auth_time: number;
    user_id: string;
    sub: string;
    email: string;
    iat: number;
    exp: number;
}