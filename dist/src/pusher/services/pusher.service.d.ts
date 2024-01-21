import * as Pusher from "pusher";
export declare class PusherService {
    pusher: Pusher;
    constructor();
    trigger(channel: string, event: string, data: any): Promise<Pusher.Response>;
    triggerToUser(userId: string, event: string, data: any): Promise<Pusher.Response>;
}
