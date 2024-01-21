import { ConsumableType } from "@prisma/client";
export declare class ConsumableItemDto {
    id: string;
    name: string;
    description: string;
    pictureUrl: string;
    type: ConsumableType;
}
export declare class CreateConsumableDto {
    id: string;
    brand: string;
    stock: number;
    price: number;
    tags: string[];
    weightOrVolume: number;
    item: ConsumableItemDto;
}
