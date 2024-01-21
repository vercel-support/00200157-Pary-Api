import { NestMiddleware } from "@nestjs/common";
export declare class AuthRefreshTokenMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void): void;
}
