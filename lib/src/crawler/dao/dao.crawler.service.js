"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DaoCrawlerService = void 0;
var node_fetch_1 = require("node-fetch");
// import { ApiConfigService } from "src/common/api-config/api.config.service";
var out_1 = require("@multiversx/sdk-core/out");
var out_2 = require("@multiversx/sdk-network-providers/out");
var fs = require("fs");
var ProposeEvent_1 = require("./../../models/ProposeEvent");
var VoteEvent_1 = require("./../../models/VoteEvent");
// Defaults
var BASE_URL = "https://devnet-api.multiversx.com";
var DaoCrawlerService = /** @class */ (function () {
    function DaoCrawlerService(
    // private readonly apiConfigService: ApiConfigService,
    address, events, dataSource) {
        var abiPath = "./src/abi/dao.abi.json";
        var contractAddress = "erd1qqqqqqqqqqqqqpgqw9623l42csqht9apczzg7xr0x3nhgxt0jpqsyupewg";
        var provider = "https://devnet-api.multiversx.com";
        var abi = this.getAbiRegistry(abiPath);
        if (abi != undefined) {
            this.abi = abi;
            this.sm = new out_1.SmartContract({
                address: new out_1.Address(contractAddress),
                abi: this.getAbiRegistry(abiPath),
            });
            this.provider = new out_2.ApiNetworkProvider(provider);
        }
        this.address = address;
        this.events = events;
        this.dataSource = dataSource;
    }
    DaoCrawlerService.prototype.getAbiRegistry = function (path) {
        var data = fs.readFileSync(path, { encoding: "utf-8" });
        return out_1.AbiRegistry.create(JSON.parse(data));
    };
    DaoCrawlerService.prototype.txCount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var req;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, node_fetch_1.default)("".concat(BASE_URL, "/accounts/").concat(this.address, "/transfers/count"))];
                    case 1:
                        req = _a.sent();
                        return [4 /*yield*/, req.json()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DaoCrawlerService.prototype.TxHashes = function (from, size) {
        return __awaiter(this, void 0, void 0, function () {
            var req, txResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        req = "".concat(BASE_URL, "/accounts/").concat(this.address, "/transfers?from=").concat(from, "&size=").concat(size);
                        return [4 /*yield*/, (0, node_fetch_1.default)(req)];
                    case 1:
                        txResponse = _a.sent();
                        return [4 /*yield*/, txResponse.json()];
                    case 2: return [2 /*return*/, (_a.sent())
                            .map(function (tx) {
                            if (tx.status == "success") {
                                if (tx.type == "SmartContractResult") {
                                    return tx.originalTxHash;
                                }
                                else {
                                    return tx.txHash;
                                }
                            }
                            else {
                                return undefined;
                            }
                        })
                            .filter(function (v) { return v !== undefined; })];
                }
            });
        });
    };
    DaoCrawlerService.prototype.getTransactionDetail = function (transactionHash) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.abi;
                        return [4 /*yield*/, this.provider.getTransaction(transactionHash)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DaoCrawlerService.prototype.filterEvent = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var events;
            var _this = this;
            return __generator(this, function (_a) {
                if (data.logs.events != undefined) {
                    events = data.logs.events;
                    events = events.filter(function (v) {
                        var topic = Buffer.from(v.topics[0], "base64").toString("utf8");
                        if (_this.events.includes(topic)) {
                            return true;
                        }
                        return false;
                    });
                    events = events.map(function (item) {
                        console.log(typeof item.data);
                        console.log(Buffer.from(item.data));
                        var decodedValue = new out_1.BinaryCodec().decodeTopLevel(Buffer.from(item.data), _this.abi.getStruct("ProposeEvent"));
                        console.log("\n\n ");
                        console.log("".concat(JSON.stringify(decodedValue)));
                        var event = {
                            address: item.address.value,
                            topics: item.topics,
                            txHash: data.hash,
                            timestamp: data.timestamp,
                            data: item.data,
                            eventName: item.topics[0].toString(), // Decoded topic is stored in eventName
                        };
                        return event;
                    });
                    return [2 /*return*/, events];
                }
                else {
                    return [2 /*return*/, undefined];
                }
                return [2 /*return*/];
            });
        });
    };
    DaoCrawlerService.prototype.saveToDb = function (events) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, events_1, e, _a, proposeEvent, event_1, voteEvent, event_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, events_1 = events;
                        _b.label = 1;
                    case 1:
                        if (!(_i < events_1.length)) return [3 /*break*/, 7];
                        e = events_1[_i];
                        _a = e.eventName;
                        switch (_a) {
                            case this.events[0]: return [3 /*break*/, 2];
                            case this.events[1]: return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 6];
                    case 2:
                        proposeEvent = this.dataSource.getRepository(ProposeEvent_1.ProposeEvent);
                        event_1 = new ProposeEvent_1.ProposeEvent();
                        event_1.txHash = e.txHash;
                        event_1.timestamp = e.timestamp;
                        event_1.contractAddress = e.address;
                        return [4 /*yield*/, proposeEvent.save(event_1)];
                    case 3:
                        //TODO: Parse datas and map to ProposeEvent
                        event_1 = _b.sent();
                        console.log("\nEvent saved: ".concat(JSON.stringify(event_1)));
                        return [3 /*break*/, 6];
                    case 4:
                        voteEvent = this.dataSource.getRepository(VoteEvent_1.VoteEvent);
                        event_2 = new VoteEvent_1.VoteEvent();
                        event_2.txHash = e.txHash;
                        event_2.timestamp = e.timestamp;
                        event_2.contractAddress = e.address;
                        return [4 /*yield*/, voteEvent.save(event_2)];
                    case 5:
                        //TODO: Parse datas and map to ProposeEvent
                        event_2 = _b.sent();
                        console.log("\nEvent saved: ".concat(JSON.stringify(event_2)));
                        return [3 /*break*/, 6];
                    case 6:
                        _i++;
                        return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    DaoCrawlerService.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var txCount, size, from, txHashes, acceptedEvents, _i, txHashes_1, hash, txDetails, event_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.txCount()];
                    case 1:
                        txCount = _a.sent();
                        size = 1000;
                        from = 0;
                        _a.label = 2;
                    case 2:
                        if (!(from < txCount)) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.TxHashes(from, size)];
                    case 3:
                        txHashes = _a.sent();
                        acceptedEvents = [];
                        _i = 0, txHashes_1 = txHashes;
                        _a.label = 4;
                    case 4:
                        if (!(_i < txHashes_1.length)) return [3 /*break*/, 8];
                        hash = txHashes_1[_i];
                        return [4 /*yield*/, this.getTransactionDetail(hash)];
                    case 5:
                        txDetails = _a.sent();
                        return [4 /*yield*/, this.filterEvent(txDetails)];
                    case 6:
                        event_3 = _a.sent();
                        acceptedEvents = __spreadArray(__spreadArray([], acceptedEvents, true), event_3, true);
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 4];
                    case 8:
                        from += size;
                        return [3 /*break*/, 2];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return DaoCrawlerService;
}());
exports.DaoCrawlerService = DaoCrawlerService;
//# sourceMappingURL=dao.crawler.service.js.map