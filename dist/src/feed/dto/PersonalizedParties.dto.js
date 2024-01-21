"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalizedPartiesDto = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class PersonalizedPartiesDto {
    constructor() {
        this.partyPage = 0;
        this.partyLimit = 15;
        this.groupPage = 0;
        this.groupLimit = 10;
        this.maxAge = 100;
        this.minAge = 18;
        this.distanceLimit = 100;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { partyPage: { required: true, type: () => Object, default: 0, minimum: 0 }, partyLimit: { required: true, type: () => Object, default: 15, minimum: 1 }, groupPage: { required: false, type: () => Number, default: 0, minimum: 0 }, groupLimit: { required: false, type: () => Number, default: 10, minimum: 1 }, maxAge: { required: true, type: () => Object, default: 100, minimum: 0 }, minAge: { required: true, type: () => Object, default: 18, minimum: 0 }, distanceLimit: { required: true, type: () => Object, default: 100, minimum: 0 }, showGroups: { required: true, type: () => Boolean } };
    }
}
exports.PersonalizedPartiesDto = PersonalizedPartiesDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Object)
], PersonalizedPartiesDto.prototype, "partyPage", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Object)
], PersonalizedPartiesDto.prototype, "partyLimit", void 0);
__decorate([
    (0, common_1.Optional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PersonalizedPartiesDto.prototype, "groupPage", void 0);
__decorate([
    (0, common_1.Optional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PersonalizedPartiesDto.prototype, "groupLimit", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Object)
], PersonalizedPartiesDto.prototype, "maxAge", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Object)
], PersonalizedPartiesDto.prototype, "minAge", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Object)
], PersonalizedPartiesDto.prototype, "distanceLimit", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === "boolean") {
            return value;
        }
        return value === "true";
    }),
    __metadata("design:type", Boolean)
], PersonalizedPartiesDto.prototype, "showGroups", void 0);
//# sourceMappingURL=PersonalizedParties.dto.js.map