export function extractToken(bearerToken: string): string {
    return bearerToken.split(' ')[1];
}