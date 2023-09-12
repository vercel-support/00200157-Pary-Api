import {Injectable} from "@nestjs/common";
import {Storage} from "aws-amplify";
import {configureAmazonCognito} from "app/src/main";
import {Location} from "types";

@Injectable()
export class UtilsService {
    private imageCache = new Map<string, {url: string; expiry: number}>();
    private readonly CACHE_DURATION = 601800;
    private readonly AMAZON_CACHE_DURATION = 604800;

    async getFreshImageUrl(amazonId: string, retry: boolean = true): Promise<string> {
        try {
            const imageUrl = await Storage.get(amazonId, {
                level: "public",
                expires: this.AMAZON_CACHE_DURATION,
            });
            return imageUrl as string;
        } catch (error) {
            if (retry) {
                configureAmazonCognito();
                return this.getFreshImageUrl(amazonId, false);
            }
            return "";
        }
    }

    async getCachedImageUrl(amazonId: string): Promise<string> {
        // Comprobar si la URL ya está en el caché y aún es válida
        const cached = this.imageCache.get(amazonId);
        if (cached && cached.expiry > Date.now()) {
            return cached.url;
        }

        // Si no está en el caché o ha expirado, obtener una nueva URL
        const newUrl = await this.getFreshImageUrl(amazonId);

        if (newUrl === "") {
            return "";
        }

        // Almacenar la nueva URL en el caché con una fecha de caducidad
        this.imageCache.set(amazonId, {
            url: newUrl,
            expiry: Date.now() + this.CACHE_DURATION,
        });

        return newUrl;
    }

    haversineDistance(location1: Location, location2: Location): number {
        const R = 6371; // Radio de la Tierra en kilómetros
        const lat1 = (location1.latitude * Math.PI) / 180; // Convertir a radianes
        const lat2 = (location2.latitude * Math.PI) / 180; // Convertir a radianes
        const dLat = ((location2.latitude - location1.latitude) * Math.PI) / 180; // Convertir a radianes
        const dLon = ((location2.longitude - location1.longitude) * Math.PI) / 180; // Convertir a radianes

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance;
    }
    extractToken(bearerToken: string): string {
        return bearerToken.split(" ")[1];
    }
}
