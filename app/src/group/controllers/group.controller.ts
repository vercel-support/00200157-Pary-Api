import {Body, Controller, Delete, Get, Param, Post, Query, Req, UsePipes, ValidationPipe} from "@nestjs/common";
import {CreateGroupDto} from "app/src/group/dto/CreateGroup.dto";
import {GroupService} from "app/src/group/services/group.service";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {PaginationDto} from "../dto/Pagination.dto";
import {InviteToGroupDto} from "../dto/InviteToGroup.dto";
import {JoinRequestDto} from "../../party/dto/JoinRequestDto";
import {UpdateGroupDto} from "../dto/UpdateGroup.dto";
import {UsernameDto} from "../../party/dto/User.dto";

@ApiTags("Group")
@ApiBearerAuth()
@Controller("group")
export class GroupController {
    constructor(private readonly groupService: GroupService) {}

    @Post("create")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async createGroup(@Body() group: CreateGroupDto, @Req() request: any) {
        return await this.groupService.createGroup(group, request.raw.decoded.id);
    }

    @Post("update")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async updateGroup(@Body() group: UpdateGroupDto, @Req() request: any) {
        return await this.groupService.updateGroup(group, request.raw.decoded.id);
    }

    @Get("own-groups")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async getOwnGroups(@Query() paginationDto: PaginationDto, @Req() request: any) {
        return await this.groupService.getOwnGroups(paginationDto, request.raw.decoded.id);
    }

    @Get("invited-groups")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async getInvitedGroups(@Query() paginationDto: PaginationDto, @Req() request: any) {
        return this.groupService.getInvitedGroups(paginationDto, request.raw.decoded.id);
    }

    @Get("join-requests")
    async getJoinRequests(@Req() request: any) {
        return await this.groupService.getJoinRequests(request.raw.decoded.id);
    }

    @Get("invitations")
    async getRequests(@Req() request: any) {
        return this.groupService.getGroupInvitations(request.raw.decoded.id);
    }

    @Get(":groupId")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async getGroup(@Param("groupId") groupId: string) {
        return await this.groupService.getGroup(groupId);
    }

    @Delete(":groupId")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async deleteGroup(@Param("groupId") groupId: string, @Req() request: any) {
        return await this.groupService.deleteGroup(groupId, request.raw.decoded.id);
    }

    @Post(":groupId/invite")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async inviteToGroup(
        @Param("groupId") groupId: string,
        @Body() inviteToGroupDto: InviteToGroupDto,
        @Req() request: any,
    ) {
        return await this.groupService.inviteToGroup(groupId, inviteToGroupDto, request.raw.decoded.id);
    }

    @Post(":groupId/accept-invitation")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async acceptInvitation(@Param("groupId") groupId: string, @Req() request: any) {
        return await this.groupService.acceptInvitation(groupId, request.raw.decoded.id);
    }

    @Post(":groupId/decline-invitation")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async declineInvitation(@Param("groupId") groupId: string, @Req() request: any) {
        return await this.groupService.declineInvitation(groupId, request.raw.decoded.id);
    }

    @Post(":groupId/cancel-invitation")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async cancelInvitation(@Param("groupId") groupId: string, @Req() request: any) {
        return await this.groupService.cancelInvitation(groupId, request.raw.decoded.id);
    }

    @Post(":groupId/accept-join-request")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async acceptJoinRequest(
        @Param("groupId") groupId: string,
        @Body() joinRequestDto: JoinRequestDto,
        @Req() request: any,
    ) {
        return this.groupService.acceptJoinRequest(groupId, request.raw.decoded.id, joinRequestDto);
    }

    @Post(":groupId/decline-join-request")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async declineJoinRequest(
        @Param("groupId") groupId: string,
        @Body() joinRequestDto: JoinRequestDto,
        @Req() request: any,
    ) {
        return this.groupService.declineJoinRequest(groupId, request.raw.decoded.id, joinRequestDto);
    }

    @Post(":groupId/leave")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async leaveGroup(@Param("groupId") groupId: string, @Req() request: any) {
        return await this.groupService.leaveGroup(groupId, request.raw.decoded.id);
    }

    @Post(":groupId/request-join")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async requestJoin(@Param("groupId") groupId: string, @Req() request: any) {
        return this.groupService.requestJoin(groupId, request.raw.decoded.id);
    }

    @Post(":groupId/delete-member")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async deleteMember(@Param("groupId") groupId: string, @Body() usernameDto: UsernameDto, @Req() request: any) {
        return this.groupService.deleteMember(groupId, usernameDto, request.raw.decoded.id);
    }

    @Post(":groupId/delete-mod")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async deleteMod(@Param("groupId") groupId: string, @Body() usernameDto: UsernameDto, @Req() request: any) {
        return this.groupService.deleteMod(groupId, usernameDto, request.raw.decoded.id);
    }

    @Post(":groupId/add-member-to-mod-list")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async addMemberToModList(@Param("groupId") groupId: string, @Body() usernameDto: UsernameDto, @Req() request: any) {
        return this.groupService.addMemberToModList(groupId, usernameDto, request.raw.decoded.id);
    }
}
