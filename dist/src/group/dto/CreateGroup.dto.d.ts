import { AgeRange } from "@prisma/client";
export declare class CreateGroupDto {
    name: string;
    description: string;
    inviteUserNames: string[];
    ageRange: AgeRange;
    isPrivate: boolean;
    showInFeed: boolean;
}
