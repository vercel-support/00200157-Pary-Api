import { AgeRange, Consumable, Location, PartyPicture, PartyType, Ticket } from "@prisma/client";
export declare class CreatePartyDto {
    name: string;
    description: string;
    location: Location;
    date: Date;
    type: PartyType;
    tags: string[];
    participants: string[];
    image: PartyPicture;
    showAddressInFeed: boolean;
    ageRange: AgeRange;
    advertisement: boolean;
    consumables: Consumable[];
    covers: Consumable[];
    tickets: Ticket[];
}
