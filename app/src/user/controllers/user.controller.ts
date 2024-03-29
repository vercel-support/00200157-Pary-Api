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
	UseGuards,
	UsePipes,
	ValidationPipe
} from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { Location } from "@prisma/client";
import { UploadGuard } from "app/src/guard/upload.guard";
import { ChatRoom } from "app/src/pusher/dto/Chat.dto";
import { File } from "../../decorators/file.decorator";
import { SearchDto } from "../../feed/dto/Search.dto";
import { DeleteUserProfilePictureDto } from "../../party/dto/DeleteUserProfilePicture.dto";
import { ConsumableItemDto, CreateConsumableDto } from "../dto/CreateConsumableDto";
import { CreateTicketDto, TicketBaseDto } from "../dto/CreateTicketDto";
import { UpdateUser } from "../dto/UpdateUser";
import { UserService } from "../services/user.service";

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
			disableErrorMessages: false
		})
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
			disableErrorMessages: false
		})
	)
	async updateUser(@Body() user: UpdateUser, @Req() request: any) {
		return this.userService.updateUser(user, request.raw.decoded.id);
	}

	@Get("basic-user-info/:username")
	async getBasicUserInfo(@Param("username") username: string) {
		return await this.userService.getBasicUserInfo(username);
	}

	@ApiConsumes("multipart/form-data")
	@Post("upload-profile-picture")
	@UseGuards(UploadGuard)
	async uploadProfilePicture(@File() file, @Req() request: any) {
		return await this.userService.uploadProfilePicture(file, request.raw.decoded.id);
	}

	@Delete("/delete-profile-picture")
	async deleteProfilePicture(@Query() deleteUserProfilePictureDto: DeleteUserProfilePictureDto, @Req() request: any) {
		return await this.userService.deleteProfilePicture(deleteUserProfilePictureDto, request.raw.decoded.id);
	}

	@Post("/follow/:username")
	async followUser(@Param("username") username: string, @Req() request: any) {
		if (!username) {
			throw new NotFoundException("Usuario no encontrado");
		}
		return await this.userService.followUser(username, request.raw.decoded.id);
	}

	@Delete("/unfollow/:username")
	async unFollowUser(@Param("username") username: string, @Req() request: any) {
		if (!username) {
			throw new NotFoundException("Usuario no encontrado");
		}
		return await this.userService.unFollowUser(username, request.raw.decoded.id);
	}

	@Get("follower-user-info/:username")
	async getFollowerUserInfo(@Param("username") username: string) {
		if (!username) {
			throw new NotFoundException("Usuario no encontrado");
		}
		return await this.userService.getFollowerUserInfo(username);
	}

	@Get("search-users")
	@UsePipes(
		new ValidationPipe({
			transform: true,
			forbidNonWhitelisted: true,
			disableErrorMessages: false
		})
	)
	async searchUsers(@Query() searchDto: SearchDto) {
		return await this.userService.searchUsers(searchDto);
	}

	@Get(":id")
	async getUserById(
		@Param("id") id: string,
		@Query("location") location: string,
		@Query("expoPushToken") expoPushToken: string
	) {
		if (!id) {
			throw new NotFoundException("Usuario no encontrado");
		}

		if (location && expoPushToken) {
			const locationDecoded = decodeURIComponent(location);
			const newLocation: Location = JSON.parse(locationDecoded);
			return await this.userService.updateAndGetUserById(id, newLocation, expoPushToken);
		}
		return await this.userService.getUserById(id);
	}

	@Delete(":id/purge")
	async purgeUserById(@Param("id") id: string) {
		if (!id) {
			throw new NotFoundException("Usuario no encontrado");
		}
		return await this.userService.purgeUserById(id);
	}

	@ApiConsumes("multipart/form-data")
	@Post("upload-consumable-image")
	@UseGuards(UploadGuard)
	async uploadConsumableImage(@File() file) {
		return await this.userService.uploadConsumablemage(file);
	}

	@Delete("/remove-consumable-image/:consumableId")
	async deleteConsumableImage(@Param("consumableId") consumableId: string, @Req() request: any) {
		if (!consumableId) {
			throw new NotFoundException("consumableId not found");
		}
		return await this.userService.removeConsumableImage(consumableId, request.raw.decoded.id);
	}

	@Post("create-consumable")
	@UsePipes(
		new ValidationPipe({
			transform: true,
			forbidNonWhitelisted: true,
			disableErrorMessages: false
		})
	)
	async createConsumable(@Body() createConsumableItemDto: CreateConsumableDto, @Req() request: any) {
		return this.userService.createConsumable(createConsumableItemDto, request.raw.decoded.id);
	}

	@Post("update-consumable")
	@UsePipes(
		new ValidationPipe({
			transform: true,
			forbidNonWhitelisted: true,
			disableErrorMessages: false
		})
	)
	async updateConsumable(@Body() createConsumableItemDto: CreateConsumableDto, @Req() request: any) {
		return this.userService.updateConsumable(createConsumableItemDto, request.raw.decoded.id);
	}

	@Get("consumables")
	async getConsumables(@Req() request: any) {
		return this.userService.getConsumables(request.raw.decoded.id);
	}
	@Get("consumable-items")
	async getConsumableItems(@Req() request: any) {
		return this.userService.getConsumableItems(request.raw.decoded.id);
	}
	@Post("create-consumable-item")
	@UsePipes(
		new ValidationPipe({
			transform: true,
			forbidNonWhitelisted: true,
			disableErrorMessages: false
		})
	)
	async createConsumableItem(@Body() createConsumableItemDto: ConsumableItemDto, @Req() request: any) {
		return this.userService.createConsumableItem(createConsumableItemDto, request.raw.decoded.id);
	}

	@Delete("delete-consumable-item/:itemId")
	async deleteConsumableItem(@Param("itemId") itemId: string, @Req() request: any) {
		if (!itemId) {
			throw new NotFoundException("itemId not found");
		}
		return this.userService.deleteConsumableItem(itemId, request.raw.decoded.id);
	}

	@Post("update-consumable-item")
	@UsePipes(
		new ValidationPipe({
			transform: true,
			forbidNonWhitelisted: true,
			disableErrorMessages: false
		})
	)
	async updateConsumableItem(@Body() createConsumableItemDto: ConsumableItemDto, @Req() request: any) {
		return this.userService.updateConsumableItem(createConsumableItemDto, request.raw.decoded.id);
	}

	@Post("create-ticket")
	@UsePipes(
		new ValidationPipe({
			transform: true,
			forbidNonWhitelisted: true,
			disableErrorMessages: false
		})
	)
	async createTicket(@Body() createTicketDto: CreateTicketDto, @Req() request: any) {
		return this.userService.createTicket(createTicketDto, request.raw.decoded.id);
	}

	@Post("update-ticket")
	@UsePipes(
		new ValidationPipe({
			transform: true,
			forbidNonWhitelisted: true,
			disableErrorMessages: false
		})
	)
	async updateTicket(@Body() updateTicketDto: CreateTicketDto, @Req() request: any) {
		return this.userService.updateTicket(updateTicketDto, request.raw.decoded.id);
	}

	@Delete("delete-ticket/:ticketId")
	async deleteTicket(@Param("ticketId") ticketId: string, @Req() request: any) {
		if (!ticketId) {
			throw new NotFoundException("ticketId not found");
		}
		return this.userService.deleteTicket(ticketId, request.raw.decoded.id);
	}

	@Get("tickets")
	async getTickets(@Req() request: any) {
		return this.userService.getTickets(request.raw.decoded.id);
	}
	@Get("ticket-bases")
	async getTicketBases(@Req() request: any) {
		return this.userService.getTicketBases(request.raw.decoded.id);
	}
	@Post("create-ticket-base")
	@UsePipes(
		new ValidationPipe({
			transform: true,
			forbidNonWhitelisted: true,
			disableErrorMessages: false
		})
	)
	async createTicketBase(@Body() createTicketBaseDto: TicketBaseDto, @Req() request: any) {
		return this.userService.createTicketBase(createTicketBaseDto, request.raw.decoded.id);
	}

	@Delete("delete-ticket-base/:ticketId")
	async deleteTicketBase(@Param("ticketId") ticketId: string, @Req() request: any) {
		if (!ticketId) {
			throw new NotFoundException("ticketId not found");
		}
		return this.userService.deleteTicketBase(ticketId, request.raw.decoded.id);
	}

	@Post("update-ticket-base")
	@UsePipes(
		new ValidationPipe({
			transform: true,
			forbidNonWhitelisted: true,
			disableErrorMessages: false
		})
	)
	async updateTicketBase(@Body() updateTicketBaseDto: TicketBaseDto, @Req() request: any) {
		return this.userService.updateTicketBase(updateTicketBaseDto, request.raw.decoded.id);
	}

	@Post("send-message-to-chat-room")
	async sendMessageToChannel(@Body() chatRoom: ChatRoom, @Req() request: any) {
		return this.userService.sendMessageToChatRoom(chatRoom, request.raw.decoded.id);
	}

	@Get("request-messages/:chatId")
	async requestMessages(@Param("chatId") chatId: string, @Query("lastTimeChecked") lastTimeChecked: string | null) {
		return this.userService.requestMessagesFromLastMessageId(chatId, lastTimeChecked);
	}

	@Get("create-chat-room/:username")
	async createChatRoom(@Param("username") username: string, @Req() request: any) {
		return this.userService.createChatRoom(username, request.raw.decoded.id);
	}
}
