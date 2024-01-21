import { AgeRange, Consumable, Location, PartyPicture, PartyType, Ticket } from "@prisma/client";
export declare class UpdatePartyDto {
    id: string;
    name: string;
    description: string;
    location: Location;
    date: Date;
    type: PartyType;
    tags: string[];
    image: PartyPicture;
    oldImage: PartyPicture;
    showAddressInFeed: boolean;
    ageRange: AgeRange;
    advertisement: boolean;
    consumables: Consumable[];
    covers: Consumable[];
    tickets: Ticket[];
}
