import { Test, TestingModule } from "@nestjs/testing";
import { PartyController } from "./party.controller";

describe("PartyController", () => {
	let controller: PartyController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PartyController]
		}).compile();

		controller = module.get<PartyController>(PartyController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});

/* Party creation*/
/*
{
    name: 'Carrete de mega prueba ',
        description: 'Naaa tranquilos que este sera el mejor carrete de la vida existencia de todos los tiempos',
    image: {
    url: 'https://jerxlwr0kfoy9du0.public.blob.vercel-storage.com/party-182e6a0f-d78c-4897-86b9-80a83f414be5-4T4EJlDjFL1jfhjyvdQIvysDvGLOEt.jpeg'
},
    date: '2023-11-22T23:31:49.558Z',
        location: {
    latitude: -33.4179933,
        longitude: -70.60639,
        name: 'Providencia',
        address: 'Avenida Andrés Bello 2425, Providencia',
        timestamp: '2023-11-22T23:43:39.085Z'
},
    participants: [ 'Nene' ],
        moderators: [],
    advertisement: false,
    tags: [],
    type: 'carrete',
    createdAt: '2023-11-22T23:43:56.485Z',
    showAddressInFeed: false,
    ageRange: { min: 18, max: 100 }
} 654d47b264b1d2770cbcaacc*/
