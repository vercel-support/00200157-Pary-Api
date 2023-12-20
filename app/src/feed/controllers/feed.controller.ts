import { Controller, Get, Query, Req, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { FeedService } from "app/src/feed/services/feed.service";
import { FollowersFollowingDto } from "../dto/FollowersFollowing.dto";
import { PersonalizedPartiesDto } from "../dto/PersonalizedParties.dto";
import { SearchDto } from "../dto/Search.dto";

@ApiTags("Feed")
@ApiBearerAuth()
@Controller("feed")
export class FeedController {
	constructor(private readonly feedService: FeedService) {}

	@Get("search")
	@UsePipes(
		new ValidationPipe({
			transform: true,
			forbidNonWhitelisted: true,
			disableErrorMessages: false
		})
	)
	async search(@Query() searchDto: SearchDto, @Req() request: any) {
		return await this.feedService.search(searchDto, request.raw.decoded.id);
	}

	@Get("personalized-parties")
	@UsePipes(
		new ValidationPipe({
			transform: true,
			forbidNonWhitelisted: true,
			disableErrorMessages: false
		})
	)
	async getPersonalizedParties(@Query() personalizedParties: PersonalizedPartiesDto, @Req() request: any) {
		return await this.feedService.getPersonalizedParties(personalizedParties, request.raw.decoded.id);
	}

	@Get("followers")
	@UsePipes(
		new ValidationPipe({
			transform: true,
			forbidNonWhitelisted: true,
			disableErrorMessages: false
		})
	)
	async getFollowers(@Query() followerDto: FollowersFollowingDto) {
		return await this.feedService.getFollowers(followerDto);
	}

	@Get("following")
	@UsePipes(
		new ValidationPipe({
			transform: true,
			forbidNonWhitelisted: true,
			disableErrorMessages: false
		})
	)
	async getFollowing(@Query() followingDto: FollowersFollowingDto) {
		return await this.feedService.getFollowing(followingDto);
	}
}
