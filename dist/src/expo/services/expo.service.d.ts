import { OnModuleInit } from "@nestjs/common";
import Expo from "expo-server-sdk";
export declare class ExpoService extends Expo implements OnModuleInit {
    constructor();
    onModuleInit(): Promise<void>;
}
