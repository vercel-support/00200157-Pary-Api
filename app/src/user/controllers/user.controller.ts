import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Req,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import {Location} from "@prisma/client";
import {UpdateUserDto} from "app/src/user/dto/UpdateUser.dto";
import {UserService} from "app/src/user/services/user.service";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";

@ApiTags("User")
@ApiBearerAuth()
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("check-username/:username")
    async checkUsername(@Param("username") username: string) {
        if (!username) {
            return false;
        }
        return await this.userService.checkUsername(username);
    }

    @Post("update")
    @UsePipes(new ValidationPipe())
    async updateUser(@Body("user") user: UpdateUserDto, @Req() request: any) {
        return this.userService.updateUser(user, request.raw.decoded.id);
    }

    @Get("basic-user-info/:username")
    async getBasicUserInfo(@Param("username") username: string) {
        return await this.userService.getBasicUserInfo(username);
    }

    @Post("upload-profile-picture")
    async uploadProfilePicture(@Body() body: any, @Req() request: any) {
        return await this.userService.uploadProfilePicture(body, request.raw.decoded.id);
    }

    @Delete("delete-profile-picture")
    @UsePipes(new ValidationPipe())
    async deleteProfilePicture(@Query("url") url: string, @Query("id") id: string, @Req() request: any) {
        console.log("deleteProfilePicture", id, url, request.raw.decoded.id);
        return await this.userService.deleteProfilePicture(id, url, request.raw.decoded.id);
    }

    @Post("/follow/:username")
    async followUser(@Param("username") username: string, @Req() request: any) {
        if (!username) {
            throw new NotFoundException("User not found");
        }
        return await this.userService.followUser(username, request.raw.decoded.id);
    }

    @Delete("/unfollow/:username")
    async unFollowUser(@Param("username") username: string, @Req() request: any) {
        if (!username) {
            throw new NotFoundException("User not found");
        }
        return await this.userService.unFollowUser(username, request.raw.decoded.id);
    }

    @Get("follower-user-info/:username")
    async getFollowerUserInfo(@Param("username") username: string) {
        if (!username) {
            throw new NotFoundException("User not found");
        }
        return await this.userService.getFollowerUserInfo(username);
    }

    @Get("search-users")
    async searchUsers(
        @Query("page", ParseIntPipe) page: number,
        @Query("limit", ParseIntPipe) limit: number,
        @Query("search") search: string,
    ) {
        return await this.userService.searchUsers(page, limit, search);
    }

    @Get(":id")
    async getUserById(
        @Param("id") id: string,
        @Query("location") location: string,
        @Query("expoPushToken") expoPushToken: string,
    ) {
        if (!id) {
            throw new NotFoundException("User not found");
        }

        if (location && expoPushToken) {
            const newLocation: Location = JSON.parse(location);
            return await this.userService.updateAndGetUserById(id, newLocation, expoPushToken);
        }
        return await this.userService.getUserById(id);
    }
}
