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
exports.UserController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const upload_guard_1 = require("../../guard/upload.guard");
const Chat_dto_1 = require("../../pusher/dto/Chat.dto");
const file_decorator_1 = require("../../decorators/file.decorator");
const Search_dto_1 = require("../../feed/dto/Search.dto");
const DeleteUserProfilePicture_dto_1 = require("../../party/dto/DeleteUserProfilePicture.dto");
const CreateConsumableDto_1 = require("../dto/CreateConsumableDto");
const CreateTicketDto_1 = require("../dto/CreateTicketDto");
const UpdateUser_1 = require("../dto/UpdateUser");
const user_service_1 = require("../services/user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async checkUsername(username) {
        if (!username) {
            return false;
        }
        return await this.userService.checkUsername(username);
    }
    async updateUser(user, request) {
        return this.userService.updateUser(user, request.raw.decoded.id);
    }
    async getBasicUserInfo(username) {
        return await this.userService.getBasicUserInfo(username);
    }
    async uploadProfilePicture(file, request) {
        return await this.userService.uploadProfilePicture(file, request.raw.decoded.id);
    }
    async deleteProfilePicture(deleteUserProfilePictureDto, request) {
        return await this.userService.deleteProfilePicture(deleteUserProfilePictureDto, request.raw.decoded.id);
    }
    async followUser(username, request) {
        if (!username) {
            throw new common_1.NotFoundException("User not found");
        }
        return await this.userService.followUser(username, request.raw.decoded.id);
    }
    async unFollowUser(username, request) {
        if (!username) {
            throw new common_1.NotFoundException("User not found");
        }
        return await this.userService.unFollowUser(username, request.raw.decoded.id);
    }
    async getFollowerUserInfo(username) {
        if (!username) {
            throw new common_1.NotFoundException("User not found");
        }
        return await this.userService.getFollowerUserInfo(username);
    }
    async searchUsers(searchDto) {
        return await this.userService.searchUsers(searchDto);
    }
    async getUserById(id, location, expoPushToken) {
        if (!id) {
            throw new common_1.NotFoundException("User not found");
        }
        if (location && expoPushToken) {
            const locationDecoded = decodeURIComponent(location);
            const newLocation = JSON.parse(locationDecoded);
            return await this.userService.updateAndGetUserById(id, newLocation, expoPushToken);
        }
        return await this.userService.getUserById(id);
    }
    async purgeUserById(id) {
        if (!id) {
            throw new common_1.NotFoundException("User not found");
        }
        return await this.userService.purgeUserById(id);
    }
    async uploadConsumableImage(file) {
        return await this.userService.uploadConsumablemage(file);
    }
    async deleteConsumableImage(consumableId, request) {
        if (!consumableId) {
            throw new common_1.NotFoundException("consumableId not found");
        }
        return await this.userService.removeConsumableImage(consumableId, request.raw.decoded.id);
    }
    async createConsumable(createConsumableItemDto, request) {
        return this.userService.createConsumable(createConsumableItemDto, request.raw.decoded.id);
    }
    async updateConsumable(createConsumableItemDto, request) {
        return this.userService.updateConsumable(createConsumableItemDto, request.raw.decoded.id);
    }
    async getConsumables(request) {
        return this.userService.getConsumables(request.raw.decoded.id);
    }
    async getConsumableItems(request) {
        return this.userService.getConsumableItems(request.raw.decoded.id);
    }
    async createConsumableItem(createConsumableItemDto, request) {
        return this.userService.createConsumableItem(createConsumableItemDto, request.raw.decoded.id);
    }
    async deleteConsumableItem(itemId, request) {
        if (!itemId) {
            throw new common_1.NotFoundException("itemId not found");
        }
        return this.userService.deleteConsumableItem(itemId, request.raw.decoded.id);
    }
    async updateConsumableItem(createConsumableItemDto, request) {
        return this.userService.updateConsumableItem(createConsumableItemDto, request.raw.decoded.id);
    }
    async createTicket(createTicketDto, request) {
        return this.userService.createTicket(createTicketDto, request.raw.decoded.id);
    }
    async updateTicket(updateTicketDto, request) {
        return this.userService.updateTicket(updateTicketDto, request.raw.decoded.id);
    }
    async deleteTicket(ticketId, request) {
        if (!ticketId) {
            throw new common_1.NotFoundException("ticketId not found");
        }
        return this.userService.deleteTicket(ticketId, request.raw.decoded.id);
    }
    async getTickets(request) {
        return this.userService.getTickets(request.raw.decoded.id);
    }
    async getTicketBases(request) {
        return this.userService.getTicketBases(request.raw.decoded.id);
    }
    async createTicketBase(createTicketBaseDto, request) {
        return this.userService.createTicketBase(createTicketBaseDto, request.raw.decoded.id);
    }
    async deleteTicketBase(ticketId, request) {
        if (!ticketId) {
            throw new common_1.NotFoundException("ticketId not found");
        }
        return this.userService.deleteTicketBase(ticketId, request.raw.decoded.id);
    }
    async updateTicketBase(updateTicketBaseDto, request) {
        return this.userService.updateTicketBase(updateTicketBaseDto, request.raw.decoded.id);
    }
    async sendMessageToChannel(chatRoom, request) {
        return this.userService.sendMessageToChatRoom(chatRoom, request.raw.decoded.id);
    }
    async requestMessages(chatId, lastTimeChecked) {
        return this.userService.requestMessagesFromLastMessageId(chatId, lastTimeChecked);
    }
    async createChatRoom(username, request) {
        return this.userService.createChatRoom(username, request.raw.decoded.id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)("check-username/:username"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 200, type: Boolean }),
    __param(0, (0, common_1.Param)("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "checkUsername", null);
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
    __metadata("design:paramtypes", [UpdateUser_1.UpdateUser, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Get)("basic-user-info/:username"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getBasicUserInfo", null);
__decorate([
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.Post)("upload-profile-picture"),
    (0, common_1.UseGuards)(upload_guard_1.UploadGuard),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, file_decorator_1.File)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadProfilePicture", null);
__decorate([
    (0, common_1.Delete)("/delete-profile-picture"),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DeleteUserProfilePicture_dto_1.DeleteUserProfilePictureDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteProfilePicture", null);
__decorate([
    (0, common_1.Post)("/follow/:username"),
    openapi.ApiResponse({ status: 201, type: Boolean }),
    __param(0, (0, common_1.Param)("username")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "followUser", null);
__decorate([
    (0, common_1.Delete)("/unfollow/:username"),
    openapi.ApiResponse({ status: 200, type: Boolean }),
    __param(0, (0, common_1.Param)("username")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "unFollowUser", null);
__decorate([
    (0, common_1.Get)("follower-user-info/:username"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getFollowerUserInfo", null);
__decorate([
    (0, common_1.Get)("search-users"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Search_dto_1.SearchDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "searchUsers", null);
__decorate([
    (0, common_1.Get)(":id"),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("location")),
    __param(2, (0, common_1.Query)("expoPushToken")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Delete)(":id/purge"),
    openapi.ApiResponse({ status: 200, type: Boolean }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "purgeUserById", null);
__decorate([
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, common_1.Post)("upload-consumable-image"),
    (0, common_1.UseGuards)(upload_guard_1.UploadGuard),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, file_decorator_1.File)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadConsumableImage", null);
__decorate([
    (0, common_1.Delete)("/remove-consumable-image/:consumableId"),
    openapi.ApiResponse({ status: 200, type: Boolean }),
    __param(0, (0, common_1.Param)("consumableId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteConsumableImage", null);
__decorate([
    (0, common_1.Post)("create-consumable"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateConsumableDto_1.CreateConsumableDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createConsumable", null);
__decorate([
    (0, common_1.Post)("update-consumable"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateConsumableDto_1.CreateConsumableDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateConsumable", null);
__decorate([
    (0, common_1.Get)("consumables"),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getConsumables", null);
__decorate([
    (0, common_1.Get)("consumable-items"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getConsumableItems", null);
__decorate([
    (0, common_1.Post)("create-consumable-item"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateConsumableDto_1.ConsumableItemDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createConsumableItem", null);
__decorate([
    (0, common_1.Delete)("delete-consumable-item/:itemId"),
    openapi.ApiResponse({ status: 200, type: Boolean }),
    __param(0, (0, common_1.Param)("itemId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteConsumableItem", null);
__decorate([
    (0, common_1.Post)("update-consumable-item"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateConsumableDto_1.ConsumableItemDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateConsumableItem", null);
__decorate([
    (0, common_1.Post)("create-ticket"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTicketDto_1.CreateTicketDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createTicket", null);
__decorate([
    (0, common_1.Post)("update-ticket"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTicketDto_1.CreateTicketDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateTicket", null);
__decorate([
    (0, common_1.Delete)("delete-ticket/:ticketId"),
    openapi.ApiResponse({ status: 200, type: Boolean }),
    __param(0, (0, common_1.Param)("ticketId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteTicket", null);
__decorate([
    (0, common_1.Get)("tickets"),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTickets", null);
__decorate([
    (0, common_1.Get)("ticket-bases"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTicketBases", null);
__decorate([
    (0, common_1.Post)("create-ticket-base"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTicketDto_1.TicketBaseDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createTicketBase", null);
__decorate([
    (0, common_1.Delete)("delete-ticket-base/:ticketId"),
    openapi.ApiResponse({ status: 200, type: Boolean }),
    __param(0, (0, common_1.Param)("ticketId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteTicketBase", null);
__decorate([
    (0, common_1.Post)("update-ticket-base"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        disableErrorMessages: false
    })),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTicketDto_1.TicketBaseDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateTicketBase", null);
__decorate([
    (0, common_1.Post)("send-message-to-chat-room"),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Chat_dto_1.ChatRoom, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "sendMessageToChannel", null);
__decorate([
    (0, common_1.Get)("request-messages/:chatId"),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)("chatId")),
    __param(1, (0, common_1.Query)("lastTimeChecked")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "requestMessages", null);
__decorate([
    (0, common_1.Get)("create-chat-room/:username"),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)("username")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createChatRoom", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)("User"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("user"),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map