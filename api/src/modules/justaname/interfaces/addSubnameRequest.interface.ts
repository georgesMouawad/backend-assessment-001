export interface AddSubnameRequest {
    username: string;
    address: string;
    signature: string;
    message: string;
    isAdmin?: boolean;
}