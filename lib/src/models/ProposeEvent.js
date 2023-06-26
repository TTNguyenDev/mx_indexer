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
exports.DAOProposal = exports.ProposeEvent = void 0;
var typeorm_1 = require("typeorm");
var ProposeEvent = exports.ProposeEvent = /** @class */ (function () {
    function ProposeEvent() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], ProposeEvent.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], ProposeEvent.prototype, "txHash", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], ProposeEvent.prototype, "timestamp", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], ProposeEvent.prototype, "contractAddress", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], ProposeEvent.prototype, "data", void 0);
    ProposeEvent = __decorate([
        (0, typeorm_1.Entity)()
    ], ProposeEvent);
    return ProposeEvent;
}());
var DAOProposal = exports.DAOProposal = /** @class */ (function () {
    function DAOProposal() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], DAOProposal.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], DAOProposal.prototype, "proposer", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Buffer)
    ], DAOProposal.prototype, "metadata", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DAOProposal.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], DAOProposal.prototype, "total_supply", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], DAOProposal.prototype, "yes_vote", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], DAOProposal.prototype, "no_vote", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], DAOProposal.prototype, "executed_at", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", String)
    ], DAOProposal.prototype, "executed_by", void 0);
    DAOProposal = __decorate([
        (0, typeorm_1.Entity)()
    ], DAOProposal);
    return DAOProposal;
}());
//# sourceMappingURL=ProposeEvent.js.map