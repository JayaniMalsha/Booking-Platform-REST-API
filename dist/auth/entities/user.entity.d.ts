import { RefreshToken } from './refresh-token.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    refreshTokens: RefreshToken[];
    createdAt: Date;
    updatedAt: Date;
}
