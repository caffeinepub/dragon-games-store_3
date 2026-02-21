import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Game {
    id: string;
    name: string;
    description: string;
    platform: Platform;
    trailerVideoUrl?: string;
    image: ExternalBlob;
    price: bigint;
    onSale: boolean;
}
export interface UserProfile {
    name: string;
}
export enum Platform {
    pc = "pc",
    ps4 = "ps4",
    ps5 = "ps5",
    xbox = "xbox"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addGame(game: Game): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteGame(id: string): Promise<void>;
    getAllGames(): Promise<Array<Game>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getGame(id: string): Promise<Game | null>;
    getGamesByPlatform(platform: Platform): Promise<Array<Game>>;
    getOnSaleGames(): Promise<Array<Game>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateGame(id: string, updatedGame: Game): Promise<void>;
}
