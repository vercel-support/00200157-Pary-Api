import { Module } from "@nestjs/common";
import { PusherService } from "./services/pusher.service";

@Module({
	providers: [PusherService],
	exports: [PusherService]
})
export class PusherModule {}
