import { Consumable } from "@prisma/client";
export declare class TicketBaseDto {
    id: string;
    name: string;
    description: string;
    type: string;
}
export declare class CreateTicketDto {
    id: string;
    stock: number;
    price: number;
    tags: string[];
    base: TicketBaseDto;
    color: TicketColor;
    consumables: ConsumableStack[];
    payInDoor: boolean;
}
export declare class ConsumableStack {
    id: string;
    quantity: number;
    consumable: Consumable;
}
export type TicketColor = "blue" | "green" | "purple" | "yellow" | "orange" | "teal" | "pink" | "lightBlue" | "grey" | "red";
