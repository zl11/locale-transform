"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleKey = void 0;
const uuid_1 = require("uuid");
function getSingleKey() {
    return (0, uuid_1.v4)().split("-")[0];
}
exports.getSingleKey = getSingleKey;
//# sourceMappingURL=uuid.js.map