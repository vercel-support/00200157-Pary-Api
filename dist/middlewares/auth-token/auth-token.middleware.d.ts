import { NestMiddleware } from "@nestjs/common";
export declare class AuthTokenMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void): void;
}
