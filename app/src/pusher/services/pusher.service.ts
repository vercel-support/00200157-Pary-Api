import { Injectable } from "@nestjs/common";
import * as Pusher from "pusher";

@Injectable()
export class PusherService {
	pusher: Pusher;

	constructor() {
		this.pusher = new Pusher({
			appId: process.env.PUSHER_APP_ID,
			key: process.env.PUSHER_KEY,
			secret: process.env.PUSHER_SECRET,
			cluster: process.env.PUSHER_CLUSTER
		});
	}
	async trigger(channel: string, event: string, data: any) {
		return await this.pusher.trigger(channel, event, data);
	}

	async triggerToUser(userId: string, event: string, data: any) {
		return await this.pusher.trigger(`user-${userId}`, event, data);
	}
}
