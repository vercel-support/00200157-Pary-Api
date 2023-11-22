import {Controller, Get, ParseIntPipe, Query, Req, UsePipes, ValidationPipe} from "@nestjs/common";
import {FeedService} from "app/src/feed/services/feed.service";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";

@ApiTags("Feed")
@ApiBearerAuth()
@Controller("feed")
export class FeedController {
    constructor(private readonly feedService: FeedService) {}

    @Get("search")
    @UsePipes(new ValidationPipe())
    async search(
        @Query("page", ParseIntPipe) page: number,
        @Query("limit", ParseIntPipe) limit: number,
        @Query("search") search: string,
        @Req() request: any,
    ) {
        return await this.feedService.search(page, limit, search, request.raw.decoded.id);
    }

    @Get("personalized-parties")
    @UsePipes(new ValidationPipe())
    async getPersonalizedParties(
        @Query("page", ParseIntPipe) page: number,
        @Query("limit", ParseIntPipe) limit: number,
        @Query("maxAge") maxAge: number,
        @Query("minAge") minAge: number,
        @Query("distanceLimit") distanceLimit: number,
        @Query("showGroups") showGroups: boolean,
        @Req() request: any,
    ) {
        return await this.feedService.getPersonalizedParties(
            page,
            limit,
            maxAge,
            minAge,
            distanceLimit,
            showGroups,
            request.raw.decoded.id,
        );
    }

    @Get("followers")
    @UsePipes(new ValidationPipe())
    async getFollowers(
        @Query("page", ParseIntPipe) page: number,
        @Query("limit", ParseIntPipe) limit: number,
        @Query("username") username: string,
    ) {
        return await this.feedService.getFollowers(page, limit, username);
    }

    @Get("following")
    @UsePipes(new ValidationPipe())
    async getFollowing(
        @Query("page", ParseIntPipe) page: number,
        @Query("limit", ParseIntPipe) limit: number,
        @Query("username") username: string,
    ) {
        return await this.feedService.getFollowing(page, limit, username);
    }
}
