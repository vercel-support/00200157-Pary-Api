import { AgeRange } from "@prisma/client";
export declare class UpdateGroupDto {
    id: string;
    name: string;
    description: string;
    ageRange: AgeRange;
    isPrivate: boolean;
    showInFeed: boolean;
}
