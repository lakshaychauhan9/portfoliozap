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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = getDb;
exports.testMongoConnection = testMongoConnection;
var mongodb_1 = require("mongodb");
var uri = process.env.MONGODB_URI;
var options = {
    maxPoolSize: 10, // Connection pooling for scalability
    minPoolSize: 2,
    connectTimeoutMS: 5000, // Fail fast if no server
};
if (!uri) {
    throw new Error("Please add your MongoDB URI to .env.local");
}
var client;
var clientPromise;
if (process.env.NODE_ENV === "development") {
    // In development, use a global variable to preserve connection across hot reloads
    if (!global._mongoClientPromise) {
        client = new mongodb_1.MongoClient(uri, options);
        global._mongoClientPromise = client.connect().catch(function (error) {
            console.error("MongoDB client connection failed:", error);
            throw error;
        });
    }
    clientPromise = global._mongoClientPromise;
}
else {
    // In production, create a new client
    client = new mongodb_1.MongoClient(uri, options);
    clientPromise = client.connect().catch(function (error) {
        console.error("MongoDB client connection failed:", error);
        throw error;
    });
}
// Get database instance
function getDb() {
    return __awaiter(this, void 0, void 0, function () {
        var client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, clientPromise];
                case 1:
                    client = _a.sent();
                    return [2 /*return*/, client.db("portfoliozap")];
            }
        });
    });
}
// Test MongoDB connection with a ping
function testMongoConnection() {
    return __awaiter(this, void 0, void 0, function () {
        var client_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, clientPromise];
                case 1:
                    client_1 = _a.sent();
                    return [4 /*yield*/, client_1.db("portfoliozap").command({ ping: 1 })];
                case 2:
                    _a.sent();
                    console.log("MongoDB connection successful");
                    return [2 /*return*/, true];
                case 3:
                    error_1 = _a.sent();
                    console.error("MongoDB connection failed:", {
                        message: error_1.message,
                        code: error_1.code,
                        name: error_1.name,
                        stack: error_1.stack,
                    });
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.default = clientPromise;
