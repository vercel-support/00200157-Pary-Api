import {Body, Controller, Get, Param, Post, Req, ValidationPipe, UsePipes} from "@nestjs/common";
import {UpdateUserDto} from "app/dtos/user/UpdateUser.dto";
import {UserService} from "app/services/user/user.service";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("check-username/:username")
    async checkUsername(@Param("username") username: string) {
        const available = await this.userService.checkUsername(username);
        return {
            available,
        };
    }

    @Post("update")
    @UsePipes(new ValidationPipe())
    async updateUser(@Body("user") user: UpdateUserDto, @Req() request: any) {
        return this.userService.updateUser(user, request.raw.decoded.id);
    }

    @Get("basic-user-info/:username")
    async getBasicUserInfo(@Param("username") username: string) {
        const user = await this.userService.getBasicUserInfo(username);
        return {
            user,
        };
    }
}
