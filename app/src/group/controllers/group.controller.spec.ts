import { Test, TestingModule } from "@nestjs/testing";
import { GroupController } from "./group.controller";

describe("GroupController", () => {
	let controller: GroupController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [GroupController]
		}).compile();

		controller = module.get<GroupController>(GroupController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
/*
Group Creation template
"CreateGroupDto {\n" +
"  name: 'Los malditos sexo',\n" +
"  description: 'Naasheeee',\n" +
"  inviteUserNames: [ 'Nene' ],\n" +
"  isPrivate: false,\n" +
"  showInFeed: true,\n" +
"  ageRange: { min: 18, max: 44 }\n" +
"}"*/
