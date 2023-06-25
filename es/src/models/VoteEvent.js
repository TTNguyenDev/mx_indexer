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
export let VoteEvent = class VoteEvent {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], VoteEvent.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], VoteEvent.prototype, "txHash", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], VoteEvent.prototype, "timestamp", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], VoteEvent.prototype, "contractAddress", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], VoteEvent.prototype, "voting", void 0);
VoteEvent = __decorate([
    Entity()
], VoteEvent);
export let Voting = class Voting {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Voting.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Voting.prototype, "yes_vote", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Voting.prototype, "no_vote", void 0);
Voting = __decorate([
    Entity()
], Voting);
//# sourceMappingURL=VoteEvent.js.map