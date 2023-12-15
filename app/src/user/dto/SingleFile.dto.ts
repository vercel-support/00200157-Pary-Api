import {ApiProperty} from "@nestjs/swagger";

// you can add validate using class-validator
export class SingleFileDto {
    @ApiProperty({type: "string", format: "binary"})
    photo_url: string;

    @ApiProperty({example: "Rom"})
    username: string;

    @ApiProperty({example: "12345678"})
    password: string;
}
