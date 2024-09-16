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
Object.defineProperty(exports, "__esModule", { value: true });
exports.operatorTextSimilarity = exports.operatorAlmostPalindrome = void 0;
const json_rules_engine_1 = require("json-rules-engine");
const levenshtein = require("fast-levenshtein");
const engine = new json_rules_engine_1.Engine();
// OPERATORS LOGIC
function calculateSimilarity(text1, text2) {
    // Normalize by removing extra whitespace and converting to lowercase
    const normalizedText1 = text1.trim().replace(/\s+/g, " ").toLowerCase();
    const normalizedText2 = text2.trim().replace(/\s+/g, " ").toLowerCase();
    // Calculate Levenshtein distance
    const distance = levenshtein.get(normalizedText1, normalizedText2);
    // Calculate the maximum possible length for normalization
    const maxLength = Math.max(normalizedText1.length, normalizedText2.length);
    // Calculate similarity percentage
    const similarity = ((maxLength - distance) / maxLength) * 100;
    return similarity;
}
function isAlmostPalindrome(str) {
    const isPalindrome = (s) => s === s.split("").reverse().join("");
    if (isPalindrome(str)) {
        return true;
    }
    for (let i = 0; i < str.length; i++) {
        const modifiedStr = str.slice(0, i) + str.slice(i + 1);
        if (isPalindrome(modifiedStr)) {
            return true;
        }
    }
    return false;
}
function getDateDifference(date1, date2) {
    if (date1 > date2) {
        [date1, date2] = [date2, date1];
    }
    let years = date2.getFullYear() - date1.getFullYear();
    let months = date2.getMonth() - date1.getMonth();
    let days = date2.getDate() - date1.getDate();
    let hours = date2.getHours() - date1.getHours();
    let minutes = date2.getMinutes() - date1.getMinutes();
    let seconds = date2.getSeconds() - date1.getSeconds();
    console.log(years, months, days, hours, minutes, seconds);
    if (seconds < 0) {
        seconds += 60;
        minutes -= 1;
    }
    if (minutes < 0) {
        minutes += 60;
        hours -= 1;
    }
    if (hours < 0) {
        hours += 24;
        days -= 1;
    }
    if (days < 0) {
        const prevMonth = new Date(date2.getFullYear(), date2.getMonth() - 1, 0);
        days += prevMonth.getDate();
        months -= 1;
    }
    if (months < 0) {
        months += 12;
        years -= 1;
    }
    let arr = [years, months, days, hours, minutes, seconds];
    return arr;
}
// OPERATORS
const operatorTextSimilarity = (text1, text2) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const jsonRulesData = require("../operators/textSimilarity.json");
    engine.addRule(jsonRulesData);
    const facts = { texts: { text1, text2 } };
    console.log({ facts });
    engine.addOperator("textSimilarity", (factValue, jsonValue) => {
        return calculateSimilarity(factValue.text1, factValue.text2) >= jsonValue;
    });
    try {
        const results = yield engine.run(facts);
        const message = results.events.length > 0
            ? ((_a = results.events[0].params) === null || _a === void 0 ? void 0 : _a["message"]) ||
                "The two strings are similar, but no message."
            : "The two strings are not similar.";
        console.log({ message });
        return message;
    }
    catch (error) {
        console.error("Error running text similiary operator: ", error);
        throw new Error("Internal error processing text similarity logic.");
    }
});
exports.operatorTextSimilarity = operatorTextSimilarity;
const operatorAlmostPalindrome = (palindromeString) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const jsonRulesData = require("../operators/almostPalindrome.json");
    engine.addRule(jsonRulesData);
    const facts = { palindromeString };
    console.log({ facts });
    engine.addOperator("almostPalindrome", (factValue, jsonValue) => {
        return isAlmostPalindrome(factValue) === jsonValue;
    });
    try {
        const results = yield engine.run(facts);
        const message = results.events.length > 0
            ? ((_a = results.events[0].params) === null || _a === void 0 ? void 0 : _a["message"]) ||
                "Almost palindrome, but no message."
            : "Not an almost palindrome";
        console.log({ message });
        return message;
    }
    catch (error) {
        console.error("Error running palindrome operator: ", error);
        throw new Error("Internal error processing palindrome logic.");
    }
});
exports.operatorAlmostPalindrome = operatorAlmostPalindrome;
