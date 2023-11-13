import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Req,
    UsePipes,
    ValidationPipe,
} from "@nestjs/common";
import {CreateGroupDto} from "app/dtos/group/CreateGroup.dto";
import {GroupService} from "app/services/group/group.service";

@Controller("group")
export class GroupController {
    constructor(private readonly groupService: GroupService) {}

    @Post("create")
    @UsePipes(new ValidationPipe())
    async createGroup(@Body("group") group: CreateGroupDto, @Req() request: any) {
        return await this.groupService.createGroup(group, request.raw.decoded.id);
    }

    @Get("own-groups")
    async getOwnGroups(
        @Query("page", ParseIntPipe) page: number,
        @Query("limit", ParseIntPipe) limit: number,
        @Req() request: any,
    ) {
        return await this.groupService.getOwnGroups(page, limit, request.raw.decoded.id);
    }

    @Get("invited-groups")
    async getInvitedGroups(
        @Query("page", ParseIntPipe) page: number,
        @Query("limit", ParseIntPipe) limit: number,
        @Req() request: any,
    ) {
        return this.groupService.getInvitedGroups(page, limit, request.raw.decoded.id);
    }

    @Get("join-requests")
    async getJoinRequests(@Req() request: any) {
        return await this.groupService.getJoinRequests(request.raw.decoded.id);
    }

    @Get(":groupId")
    async getGroup(@Param("groupId") groupId: string) {
        return await this.groupService.getGroup(groupId);
    }

    @Put(":groupId")
    async updateGroup(@Param("groupId") groupId: string, @Body("group") group: CreateGroupDto, @Req() request: any) {
        return await this.groupService.updateGroup(groupId, group, request.raw.decoded.id);
    }

    @Delete(":groupId")
    async deleteGroup(@Param("groupId") groupId: string, @Req() request: any) {
        return await this.groupService.deleteGroup(groupId, request.raw.decoded.id);
    }

    @Post(":groupId/invite")
    async inviteToGroup(
        @Param("groupId") groupId: string,
        @Body("userIdToInvite") userIdToInvite: string,
        @Req() request: any,
    ) {
        return await this.groupService.inviteToGroup(groupId, userIdToInvite, request.raw.decoded.id);
    }

    @Post(":groupId/accept-invitation")
    async acceptInvitation(@Param("groupId") groupId: string, @Req() request: any) {
        console.log("acceptInvitation", groupId, request.raw.decoded.id);
        return await this.groupService.acceptInvitation(groupId, request.raw.decoded.id);
    }

    @Post(":groupId/decline-invitation")
    async declineInvitation(@Param("groupId") groupId: string, @Req() request: any) {
        return await this.groupService.declineInvitation(groupId, request.raw.decoded.id);
    }

    @Post(":groupId/cancel-invitation")
    async cancelInvitation(@Param("groupId") groupId: string, @Req() request: any) {
        return await this.groupService.cancelInvitation(groupId, request.raw.decoded.id);
    }

    @Post(":groupId/leave")
    async leaveGroup(@Param("groupId") groupId: string, @Req() request: any) {
        return await this.groupService.leaveGroup(groupId, request.raw.decoded.id);
    }
}
