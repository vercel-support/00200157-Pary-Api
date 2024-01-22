import { Injectable } from "@nestjs/common";
import { Party, PartyType } from "@prisma/client";
import { User } from "app/types";
import Expo, { ExpoPushMessage } from "expo-server-sdk";
import { PrismaService } from "../../db/services/prisma.service";
import { ExpoService } from "../../expo/services/expo.service";

@Injectable()
export class MailService {
	constructor(private prisma: PrismaService) {}

	async sendMailVerificationToken(mail: string) {}
}
