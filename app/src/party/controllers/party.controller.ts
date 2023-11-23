import {Body, Controller, Get, Param, Post, Query, Req, UsePipes, ValidationPipe} from "@nestjs/common";
import {CreatePartyDto} from "app/src/party/dto/CreateParty.dto";
import {PartyService} from "app/src/party/services/party.service";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {PaginationDto} from "../../group/dto/Pagination.dto";
import {UploadImageDto} from "../dto/UploadImageDto";
import {JoinRequestDto} from "../dto/JoinRequestDto";
import {OptionalGroupIdDto} from "../dto/Group.dto";

@ApiTags("Party")
@ApiBearerAuth()
@Controller("party")
export class PartyController {
    constructor(private readonly partyService: PartyService) {}

    @Post("create")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async createParty(@Body() party: CreatePartyDto, @Req() request: any) {
        return this.partyService.createParty(party, request.raw.decoded.id);
    }

    @Get("own-parties")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async getOwnParties(@Query() paginationDto: PaginationDto, @Req() request: any) {
        return this.partyService.getOwnParties(paginationDto, request.raw.decoded.id);
    }

    @Post("upload-party-image")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async uploadPartyImage(@Body() uploadImageDto: UploadImageDto) {
        return this.partyService.uploadPartyImage(uploadImageDto);
    }

    @Get("invited-parties")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async getInvitedParties(@Query() paginationDto: PaginationDto, @Req() request: any) {
        return this.partyService.getInvitedParties(paginationDto, request.raw.decoded.id);
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
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async acceptJoinRequest(
        @Param("partyId") partyId: string,
        @Body() joinRequestDto: JoinRequestDto,
        @Req() request: any,
    ) {
        return this.partyService.acceptJoinRequest(partyId, request.raw.decoded.id, joinRequestDto);
    }

    @Post(":partyId/decline-join-request")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async declineJoinRequest(
        @Param("partyId") partyId: string,
        @Body() joinRequestDto: JoinRequestDto,
        @Req() request: any,
    ) {
        return this.partyService.declineJoinRequest(partyId, request.raw.decoded.id, joinRequestDto);
    }

    @Post(":partyId/request-join")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async requestJoin(
        @Param("partyId") partyId: string,
        @Req() request: any,
        @Body() optionalGroupIdDto: OptionalGroupIdDto,
    ) {
        return this.partyService.requestJoin(partyId, request.raw.decoded.id, optionalGroupIdDto);
    }

    @Post(":partyId/replace-party-image")
    @UsePipes(
        new ValidationPipe({
            transform: true,
            forbidNonWhitelisted: true,
            disableErrorMessages: false,
        }),
    )
    async replacePartyImage(
        @Param("partyId") partyId: string,
        @Body() uploadImageDto: UploadImageDto,
        @Req() request: any,
    ) {
        return this.partyService.replacePartyImage(partyId, uploadImageDto, request.raw.decoded.id);
    }
}
