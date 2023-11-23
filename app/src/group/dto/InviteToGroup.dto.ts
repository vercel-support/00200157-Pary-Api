import {IsNotEmpty, IsString} from "class-validator";

export class InviteToGroupDto {
    @IsNotEmpty()
    @IsString()
    userIdToInvite: string;
}
