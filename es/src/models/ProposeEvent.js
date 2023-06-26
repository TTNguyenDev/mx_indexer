var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
export let ProposeEvent = class ProposeEvent {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ProposeEvent.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], ProposeEvent.prototype, "txHash", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], ProposeEvent.prototype, "timestamp", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], ProposeEvent.prototype, "contractAddress", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], ProposeEvent.prototype, "data", void 0);
ProposeEvent = __decorate([
    Entity()
], ProposeEvent);
export let DAOProposal = class DAOProposal {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], DAOProposal.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], DAOProposal.prototype, "proposer", void 0);
__decorate([
    Column(),
    __metadata("design:type", Buffer)
], DAOProposal.prototype, "metadata", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], DAOProposal.prototype, "created_at", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], DAOProposal.prototype, "total_supply", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], DAOProposal.prototype, "yes_vote", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], DAOProposal.prototype, "no_vote", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], DAOProposal.prototype, "executed_at", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], DAOProposal.prototype, "executed_by", void 0);
DAOProposal = __decorate([
    Entity()
], DAOProposal);
//# sourceMappingURL=ProposeEvent.js.map