import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Post,
    Query,
    Req,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import {Location} from "@prisma/client";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {UploadImageDto} from "../../party/dto/UploadImageDto";
import {DeleteUserProfilePictureDto} from "../../party/dto/DeleteUserProfilePicture.dto";
import {SearchDto} from "../../feed/dto/Search.dto";
import {UserService} from "../services/user.service";
import {UpdateUser} from "../dto/UpdateUser";

@ApiTags("User")
@ApiBearerAuth()
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("check-username/:username")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async checkUsername(@Param("username") username: string) {
        if (!username) {
            return false;
        }
        return await this.userService.checkUsername(username);
    }

    @Post("update")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async updateUser(@Body() user: UpdateUser, @Req() request: any) {
        return this.userService.updateUser(user, request.raw.decoded.id);
    }

    @Get("basic-user-info/:username")
    async getBasicUserInfo(@Param("username") username: string) {
        return await this.userService.getBasicUserInfo(username);
    }

    @Post("upload-profile-picture")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async uploadProfilePicture(@Body() uploadImageDto: UploadImageDto, @Req() request: any) {
        return await this.userService.uploadProfilePicture(uploadImageDto, request.raw.decoded.id);
    }

    @Delete("delete-profile-picture")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async deleteProfilePicture(@Query() deleteUserProfilePictureDto: DeleteUserProfilePictureDto, @Req() request: any) {
        return await this.userService.deleteProfilePicture(deleteUserProfilePictureDto, request.raw.decoded.id);
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
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async searchUsers(@Query() searchDto: SearchDto) {
        return await this.userService.searchUsers(searchDto);
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

    @Get(":id/purge")
    async purgeUserById(@Param("id") id: string) {
        if (!id) {
            throw new NotFoundException("User not found");
        }

        return await this.userService.purgeUserById(id);
    }
}
