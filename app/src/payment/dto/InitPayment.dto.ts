import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class InitPaymentDto {
	@IsNotEmpty()
	@IsString()
	partyId: string;
	@IsNotEmpty()
	@IsString()
	ticketId: string;
	@IsOptional()
	@IsString()
	groupId: string;
	@IsOptional()
	@IsArray()
	selectedGroupMembers: string[];
}
