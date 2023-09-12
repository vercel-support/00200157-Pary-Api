import {Test, TestingModule} from "@nestjs/testing";
import {UserController} from "./user.controller";
import {UserService} from "app/services/user/user.service";

describe("UserController", () => {
    let controller: UserController;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserService],
        }).compile();

        controller = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);
    });

    describe("checkUsername", () => {
        it("should return available true if username is not taken", async () => {
            const username = "testuser";
            jest.spyOn(userService, "checkUsername").mockResolvedValue(true);

            const result = await controller.checkUsername(username);

            expect(result).toEqual({available: true});
            expect(userService.checkUsername).toHaveBeenCalledWith(username);
        });

        it("should return available false if username is taken", async () => {
            const username = "testuser";
            jest.spyOn(userService, "checkUsername").mockResolvedValue(false);

            const result = await controller.checkUsername(username);

            expect(result).toEqual({available: false});
            expect(userService.checkUsername).toHaveBeenCalledWith(username);
        });
    });
});
