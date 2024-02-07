import { IsOptional, IsString } from "class-validator";

export class OptionalGroupIdDto {
	@IsOptional()
	@IsString()
	groupId?: string;
}

export class RequestJoinPartyDto {
	@IsString()
	ticketId: string;
	@IsOptional()
	@IsString()
	groupId?: string;
}
