import { Injectable } from "@nestjs/common";
import * as Pusher from "pusher";

@Injectable()
export class PusherService {
	pusher: Pusher;

	constructor() {
		this.pusher = new Pusher({
			appId: "1739436",
			key: "a55eb409c047fc6b53c0",
			secret: "df61837d925570f85035",
			cluster: "sa1"
		});
	}
	async trigger(channel: string, event: string, data: any) {
		console.log("triggering pusher", channel, event, data);
		return await this.pusher.trigger(channel, event, data);
	}
}
