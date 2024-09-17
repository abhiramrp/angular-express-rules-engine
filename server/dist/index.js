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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors = require("cors");
const rulesEngine_1 = require("./rulesEngine");
const otherOperators_1 = require("./otherOperators");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(cors({
    origin: "http://localhost:4200",
}));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello from Express with TypeScript");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// OPERATOR ROUTES
app.post("/text-similarity", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text1, text2 } = req.body;
    console.log(text1, text2);
    if (!text1 || !text2) {
        return res.status(400).json({ error: "String value is required." });
    }
    try {
        const result = yield (0, rulesEngine_1.operatorTextSimilarity)(text1, text2);
        console.log({ result });
        res.json({ result });
    }
    catch (error) {
        res.status(400).json({ error });
    }
}));
app.post("/almost-palindrome", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { almostPalindrome } = req.body;
    console.log(almostPalindrome);
    if (!almostPalindrome) {
        return res.status(400).json({ error: "String value is required." });
    }
    try {
        const result = yield (0, rulesEngine_1.operatorAlmostPalindrome)(almostPalindrome);
        console.log({ result });
        res.json({ result });
    }
    catch (error) {
        res.status(400).json({ error });
    }
}));
app.post("/date-comparison", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date1, date2 } = req.body;
    console.log(date1, date2);
    if (!date1 || !date2) {
        return res.status(400).json({ error: "Inputs required." });
    }
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
        return res.status(400).json({ error: "Invalid date format." });
    }
    try {
        const result = yield (0, otherOperators_1.operatorDateComparison)(d1, d2);
        console.log({ result });
        res.json({ result });
    }
    catch (error) {
        res.status(400).json({ error });
    }
}));
app.post("/timezone-conversion", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, timezone } = req.body;
    if (!date || !timezone) {
        return res.status(400).json({ error: "Inputs are required." });
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) {
        return res.status(400).json({ error: "Invalid date format." });
    }
    try {
        const result = yield (0, otherOperators_1.operatorTimezoneConversion)(d, timezone);
        console.log({ result });
        res.json({ result });
    }
    catch (error) {
        res.status(400).json({ error });
    }
}));
app.post("/date-conversion", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, datetype } = req.body;
    console.log(date, datetype);
    if (!date || !datetype) {
        return res.status(400).json({ error: "Inputs required." });
    }
    const d = new Date(date);
    if (isNaN(d.getTime())) {
        return res.status(400).json({ error: "Invalid date format." });
    }
    try {
        const result = yield (0, otherOperators_1.operatorDateConversion)(date, datetype);
        console.log({ result });
        res.json({ result });
    }
    catch (error) {
        res.status(400).json({ error });
    }
}));
app.post("/geolocation", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ipAddress } = req.body;
    console.log(ipAddress);
    if (!ipAddress) {
        return res.status(400).json({ error: "Inputs required." });
    }
    try {
        const result = yield (0, otherOperators_1.operatorGeolocation)(ipAddress);
        console.log({ result });
        res.json({ result });
    }
    catch (error) {
        res.status(400).json({ error });
    }
}));
app.post("/language", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text } = req.body;
    console.log(text);
    if (!text) {
        return res.status(400).json({ error: "Inputs required." });
    }
    try {
        const result = yield (0, otherOperators_1.operatorLanguage)(text);
        console.log({ result });
        res.json({ result });
    }
    catch (error) {
        res.status(400).json({ error });
    }
}));
