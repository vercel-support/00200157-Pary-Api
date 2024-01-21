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
exports.GroupController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const CreateGroup_dto_1 = require("../dto/CreateGroup.dto");
const group_service_1 = require("../services/group.service");
const JoinRequestDto_1 = require("../../party/dto/JoinRequestDto");
const User_dto_1 = require("../../party/dto/User.dto");
const Pagination_dto_1 = require("../dto/Pagination.dto");
const UpdateGroup_dto_1 = require("../dto/UpdateGroup.dto");
let GroupController = class GroupController {
    constructor(groupService) {
        this.groupService = groupService;
    }
    async createGroup(group, request) {
        return await this.groupService.createGroup(group, request.raw.decoded.id);
    }
    async updateGroup(group, request) {
        return await this.groupService.updateGroup(group, request.raw.decoded.id);
    }
    async getOwnGroups(paginationDto, request) {
        return await this.groupService.getOwnGroups(paginationDto, request.raw.decoded.id);
    }
    async getInvitedGroups(paginationDto, request) {
        return this.groupService.getInvitedGroups(paginationDto, request.raw.decoded.id);
    }
    async getJoinRequests(request) {
        return await this.groupService.getJoinRequests(request.raw.decoded.id);
    }
    async getRequests(request) {
        return this.groupService.getGroupInvitations(request.raw.decoded.id);
    }
    async getGroup(groupId) {
        return await this.groupService.getGroup(groupId);
    }
    async deleteGroup(groupId, request) {
        return await this.groupService.deleteGroup(groupId, request.raw.decoded.id);
    }
    async inviteToGroup(groupId, inviteToGroupDto, request) {
        return await this.groupService.inviteToGroup(groupId, inviteToGroupDto, request.raw.decoded.id);
    }
    async acceptInvitation(groupId, request) {
        return await this.groupService.acceptInvitation(groupId, request.raw.decoded.id);
    }
    async declineInvitation(groupId, request) {
        return await this.groupService.declineInvitation(groupId, request.raw.decoded.id);
    }
    async cancelInvitation(groupId, inviteToGroupDto, request) {
        return await this.groupService.cancelInvitation(groupId, inviteToGroupDto, request.raw.decoded.id);
    }
    async acceptJoinRequest(groupId, joinRequestDto, request) {
        return this.groupService.acceptJoinRequest(groupId, request.raw.decoded.id, joinRequestDto);
    }
    async declineJoinRequest(groupId, joinRequestDto, request) {
        return this.groupService.declineJoinRequest(groupId, request.raw.decoded.id, joinRequestDto);
    }
    async leaveGroup(groupId, request) {
        return await this.groupService.leaveGroup(groupId, request.raw.decoded.id);
    }
    async requestJoin(groupId, request) {
        return this.groupService.requestJoin(groupId, request.raw.decoded.id);
    }
    async deleteMember(groupId, usernameDto, request) {
        return this.groupService.deleteMember(groupId, usernameDto, request.raw.decoded.id);
    }
    async deleteMod(groupId, usernameDto, request) {
        return this.groupService.deleteMod(groupId, usernameDto, request.raw.decoded.id);
    }
    async addMemberToModList(groupId, usernameDto, request) {
        return this.groupService.addMemberToModList(groupId, usernameDto, request.raw.decoded.id);
    }
};
exports.GroupController = GroupController;
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
    __metadata("design:paramtypes", [CreateGroup_dto_1.CreateGroupDto, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "createGroup", null);
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
    __metadata("design:paramtypes", [UpdateGroup_dto_1.UpdateGroupDto, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "updateGroup", null);
__decorate([
    (0, common_1.Get)("own-groups"),
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
], GroupController.prototype, "getOwnGroups", null);
__decorate([
    (0, common_1.Get)("invited-groups"),
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
], GroupController.prototype, "getInvitedGroups", null);
__decorate([
    (0, common_1.Get)("join-requests"),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "getJoinRequests", null);
__decorate([
    (0, common_1.Get)("invitations"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "getRequests", null);
__decorate([
    (0, common_1.Get)(":groupId"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)("groupId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "getGroup", null);
__decorate([
    (0, common_1.Delete)(":groupId"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 200, type: Boolean }),
    __param(0, (0, common_1.Param)("groupId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "deleteGroup", null);
__decorate([
    (0, common_1.Post)(":groupId/invite"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)("groupId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, User_dto_1.UsernameDto, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "inviteToGroup", null);
__decorate([
    (0, common_1.Post)(":groupId/accept-invitation"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Param)("groupId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "acceptInvitation", null);
__decorate([
    (0, common_1.Post)(":groupId/decline-invitation"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Param)("groupId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "declineInvitation", null);
__decorate([
    (0, common_1.Post)(":groupId/cancel-invitation"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)("groupId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, User_dto_1.UsernameDto, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "cancelInvitation", null);
__decorate([
    (0, common_1.Post)(":groupId/accept-join-request"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Param)("groupId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, JoinRequestDto_1.JoinRequestDto, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "acceptJoinRequest", null);
__decorate([
    (0, common_1.Post)(":groupId/decline-join-request"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Param)("groupId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, JoinRequestDto_1.JoinRequestDto, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "declineJoinRequest", null);
__decorate([
    (0, common_1.Post)(":groupId/leave"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Param)("groupId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "leaveGroup", null);
__decorate([
    (0, common_1.Post)(":groupId/request-join"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Param)("groupId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "requestJoin", null);
__decorate([
    (0, common_1.Post)(":groupId/delete-member"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)("groupId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, User_dto_1.UsernameDto, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "deleteMember", null);
__decorate([
    (0, common_1.Post)(":groupId/delete-mod"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)("groupId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, User_dto_1.UsernameDto, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "deleteMod", null);
__decorate([
    (0, common_1.Post)(":groupId/add-member-to-mod-list"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)("groupId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, User_dto_1.UsernameDto, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "addMemberToModList", null);
exports.GroupController = GroupController = __decorate([
    (0, swagger_1.ApiTags)("Group"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("group"),
    __metadata("design:paramtypes", [group_service_1.GroupService])
], GroupController);
//# sourceMappingURL=group.controller.js.map