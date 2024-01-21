"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const upload_guard_1 = require("../../guard/upload.guard");
const CreateParty_dto_1 = require("../dto/CreateParty.dto");
const party_service_1 = require("../services/party.service");
const file_decorator_1 = require("../../decorators/file.decorator");
const Pagination_dto_1 = require("../../group/dto/Pagination.dto");
const Group_dto_1 = require("../dto/Group.dto");
const JoinRequestDto_1 = require("../dto/JoinRequestDto");
const UpdateParty_dto_1 = require("../dto/UpdateParty.dto");
const UploadImageDto_1 = require("../dto/UploadImageDto");
const User_dto_1 = require("../dto/User.dto");
let PartyController = class PartyController {
    constructor(partyService) {
        this.partyService = partyService;
    }
    async createParty(party, request) {
        return this.partyService.createParty(party, request.raw.decoded.id);
    }
    async updateParty(party, request) {
        return this.partyService.updateParty(party, request.raw.decoded.id);
    }
    async getOwnParties(paginationDto, request) {
        return this.partyService.getOwnParties(paginationDto, request.raw.decoded.id);
    }
    async uploadPartyImage(file) {
        return this.partyService.uploadPartyImage(file);
    }
    async getInvitedParties(paginationDto, request) {
        return this.partyService.getInvitedParties(paginationDto, request.raw.decoded.id);
    }
    async getJoinRequests(request) {
        return this.partyService.getJoinRequests(request.raw.decoded.id);
    }
    async getRequests(request) {
        return this.partyService.getPartyInvitations(request.raw.decoded.id);
    }
    async getParty(partyId, request) {
        return this.partyService.getParty(partyId, request.raw.decoded.id);
    }
    async leaveParty(partyId, request) {
        return this.partyService.leaveParty(partyId, request.raw.decoded.id);
    }
    async inviteToParty(partyId, inviteToPartyDto, request) {
        return await this.partyService.inviteToParty(partyId, inviteToPartyDto, request.raw.decoded.id);
    }
    async cancelInvitation(partyId, inviteToGroupDto, request) {
        return await this.partyService.cancelInvitation(partyId, inviteToGroupDto, request.raw.decoded.id);
    }
    async acceptInvitation(partyId, request) {
        return this.partyService.acceptInvitation(partyId, request.raw.decoded.id);
    }
    async declineInvitation(partyId, request) {
        return this.partyService.declineInvitation(partyId, request.raw.decoded.id);
    }
    async deleteMember(partyId, usernameDto, request) {
        return this.partyService.deleteMember(partyId, usernameDto, request.raw.decoded.id);
    }
    async deleteGroupMember(partyId, groupIdDto, request) {
        return this.partyService.deleteGroupMember(partyId, groupIdDto, request.raw.decoded.id);
    }
    async deleteMod(partyId, usernameDto, request) {
        return this.partyService.deleteMod(partyId, usernameDto, request.raw.decoded.id);
    }
    async acceptJoinRequest(partyId, joinRequestDto, request) {
        return this.partyService.acceptJoinRequest(partyId, request.raw.decoded.id, joinRequestDto);
    }
    async declineJoinRequest(partyId, joinRequestDto, request) {
        return this.partyService.declineJoinRequest(partyId, request.raw.decoded.id, joinRequestDto);
    }
    async cancelJoinRequest(partyId, request) {
        return this.partyService.cancelJoinRequest(partyId, request.raw.decoded.id);
    }
    async requestJoin(partyId, request, optionalGroupIdDto) {
        return this.partyService.requestJoin(partyId, request.raw.decoded.id, optionalGroupIdDto);
    }
    async replacePartyImage(partyId, uploadImageDto, request) {
        return this.partyService.replacePartyImage(partyId, uploadImageDto, request.raw.decoded.id);
    }
    async addMemberToModList(partyId, usernameDto, request) {
        return this.partyService.addMemberToModList(partyId, usernameDto, request.raw.decoded.id);
    }
};
exports.PartyController = PartyController;
__decorate([
    (0, common_1.Post)("create"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateParty_dto_1.CreatePartyDto, Object]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "createParty", null);
__decorate([
    (0, common_1.Post)("update"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateParty_dto_1.UpdatePartyDto, Object]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "updateParty", null);
__decorate([
    (0, common_1.Get)("own-parties"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_dto_1.PaginationDto, Object]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "getOwnParties", null);
__decorate([
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.Post)("upload-party-image"),
    (0, common_1.UseGuards)(upload_guard_1.UploadGuard),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, file_decorator_1.File)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "uploadPartyImage", null);
__decorate([
    (0, common_1.Get)("invited-parties"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Pagination_dto_1.PaginationDto, Object]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "getInvitedParties", null);
__decorate([
    (0, common_1.Get)("join-requests"),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "getJoinRequests", null);
__decorate([
    (0, common_1.Get)("invitations"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "getRequests", null);
__decorate([
    (0, common_1.Get)(":partyId"),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)("partyId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "getParty", null);
__decorate([
    (0, common_1.Post)(":partyId/leave"),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Param)("partyId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "leaveParty", null);
__decorate([
    (0, common_1.Post)(":partyId/invite"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)("partyId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, User_dto_1.UsernameDto, Object]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "inviteToParty", null);
__decorate([
    (0, common_1.Post)(":partyId/cancel-invitation"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)("partyId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, User_dto_1.UsernameDto, Object]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "cancelInvitation", null);
__decorate([
    (0, common_1.Post)(":partyId/accept-invitation"),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Param)("partyId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "acceptInvitation", null);
__decorate([
    (0, common_1.Post)(":partyId/decline-invitation"),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Param)("partyId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "declineInvitation", null);
__decorate([
    (0, common_1.Post)(":partyId/delete-member"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)("partyId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, User_dto_1.UsernameDto, Object]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "deleteMember", null);
__decorate([
    (0, common_1.Post)(":partyId/delete-group"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)("partyId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Group_dto_1.OptionalGroupIdDto, Object]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "deleteGroupMember", null);
__decorate([
    (0, common_1.Post)(":partyId/delete-mod"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)("partyId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, User_dto_1.UsernameDto, Object]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "deleteMod", null);
__decorate([
    (0, common_1.Post)(":partyId/accept-join-request"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Param)("partyId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, JoinRequestDto_1.JoinRequestDto, Object]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "acceptJoinRequest", null);
__decorate([
    (0, common_1.Post)(":partyId/decline-join-request"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Param)("partyId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, JoinRequestDto_1.JoinRequestDto, Object]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "declineJoinRequest", null);
__decorate([
    (0, common_1.Post)(":partyId/cancel-join-request"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Param)("partyId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "cancelJoinRequest", null);
__decorate([
    (0, common_1.Post)(":partyId/request-join"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Param)("partyId")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Group_dto_1.OptionalGroupIdDto]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "requestJoin", null);
__decorate([
    (0, common_1.Post)(":partyId/replace-party-image"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)("partyId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UploadImageDto_1.UploadImageDto, Object]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "replacePartyImage", null);
__decorate([
    (0, common_1.Post)(":partyId/add-member-to-mod-list"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)("partyId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, User_dto_1.UsernameDto, Object]),
    __metadata("design:returntype", Promise)
], PartyController.prototype, "addMemberToModList", null);
exports.PartyController = PartyController = __decorate([
    (0, swagger_1.ApiTags)("Party"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("party"),
    __metadata("design:paramtypes", [party_service_1.PartyService])
], PartyController);
//# sourceMappingURL=party.controller.js.map