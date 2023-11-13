import {Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UsePipes, ValidationPipe} from "@nestjs/common";
import {CreatePartyDto} from "app/dtos/party/CreateParty.dto";
import {PartyService} from "app/services/party/party.service";

@Controller("party")
export class PartyController {
    constructor(private readonly partyService: PartyService) {}

    @Post("create")
    @UsePipes(new ValidationPipe())
    async createParty(@Body("party") party: CreatePartyDto, @Req() request: any) {
        return this.partyService.createParty(party, request.raw.decoded.id);
    }

    @Get("own-parties")
    async getOwnParties(
        @Query("page", ParseIntPipe) page: number,
        @Query("limit", ParseIntPipe) limit: number,
        @Req() request: any,
    ) {
        return this.partyService.getOwnParties(page, limit, request.raw.decoded.id);
    }

    @Post("upload-party-image")
    @UsePipes(new ValidationPipe())
    async uploadPartyImage(@Body() body: any) {
        return this.partyService.uploadPartyImage(body);
    }

    @Get("invited-parties")
    async getInvitedParties(
        @Query("page", ParseIntPipe) page: number,
        @Query("limit", ParseIntPipe) limit: number,
        @Req() request: any,
    ) {
        return this.partyService.getInvitedParties(page, limit, request.raw.decoded.id);
    }

    @Get("join-requests")
    async getJoinRequests(@Req() request: any) {
        return this.partyService.getJoinRequests(request.raw.decoded.id);
    }
    @Get("invitations")
    async getRequests(@Req() request: any) {
        return this.partyService.getPartyInvitations(request.raw.decoded.id);
    }

    @Get(":partyId")
    async getParty(@Param("partyId") partyId: string, @Req() request: any) {
        return this.partyService.getParty(partyId, request.raw.decoded.id);
    }

    @Post(":partyId/leave")
    async leaveParty(@Param("partyId") partyId: string, @Req() request: any) {
        return this.partyService.leaveParty(partyId, request.raw.decoded.id);
    }

    @Post(":partyId/accept-invitation")
    async acceptInvitation(@Param("partyId") partyId: string, @Req() request: any) {
        return this.partyService.acceptInvitation(partyId, request.raw.decoded.id);
    }

    @Post(":partyId/decline-invitation")
    async declineInvitation(@Param("partyId") partyId: string, @Req() request: any) {
        return this.partyService.declineInvitation(partyId, request.raw.decoded.id);
    }

    @Post(":partyId/accept-join-request")
    async acceptJoinRequest(@Param("partyId") partyId: string, @Body("userId") userId: string,@Body("groupId") groupId: string,@Body("type") type: string, @Req() request: any) {
        return this.partyService.acceptJoinRequest(partyId, request.raw.decoded.id, type,userId,groupId);
    }

    @Post(":partyId/decline-join-request")
    async declineJoinRequest(@Param("partyId") partyId: string, @Body("userId") userId: string, @Req() request: any) {
        return this.partyService.declineJoinRequest(partyId, request.raw.decoded.id, userId);
    }

    @Post(":partyId/request-join")
    async requestJoin(@Param("partyId") partyId: string, @Req() request: any, @Body("groupId") groupId?: string) {
        console.log(groupId, partyId);
        return this.partyService.requestJoin(partyId, request.raw.decoded.id, groupId);
    }
}
