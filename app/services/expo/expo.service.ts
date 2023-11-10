import {Injectable, OnModuleInit} from "@nestjs/common";
import {EXPO_ACCESS_TOKEN} from "app/src/main";
import Expo from "expo-server-sdk";

@Injectable()
export class ExpoService extends Expo implements OnModuleInit {
    constructor() {
        super({accessToken: EXPO_ACCESS_TOKEN});
    }

    async onModuleInit() {}
}
