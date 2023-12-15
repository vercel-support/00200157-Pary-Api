import { AuthRefreshTokenMiddleware } from "./auth-refresh-token.middleware";

describe("AuthRefreshTokenMiddleware", () => {
	it("should be defined", () => {
		expect(new AuthRefreshTokenMiddleware()).toBeDefined();
	});
});
