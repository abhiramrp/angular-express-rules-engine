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
exports.operatorLanguage = exports.operatorGeolocation = exports.operatorDateConversion = exports.operatorTimezoneConversion = exports.operatorDateComparison = void 0;
const detectlanguage_1 = __importDefault(require("detectlanguage"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// OPERATORS LOGIC
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
function getGeoData(ipAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://ip-api.com/json/${ipAddress}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    // Add any other headers if needed, like Authorization
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error("IP API issue", error);
            throw new Error("IP API failed to fetch data");
        }
    });
}
function getLanguage(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiKey = process.env.LANGUAGE_APIKEY || "";
        try {
            const detectlanguage = new detectlanguage_1.default(apiKey);
            let langCode = "";
            yield detectlanguage.detectCode(text).then(function (result) {
                console.log(JSON.stringify(result));
                langCode = result || "";
            });
            if (langCode === "") {
                throw new Error("Language not detected");
            }
            let langList = [];
            yield detectlanguage.languages().then(function (result) {
                langList = result;
            });
            const language = langList.find((lang) => lang.code === langCode);
            if (!language) {
                throw new Error("Language not found");
            }
            return language.name;
        }
        catch (error) {
            console.error("Language API issue", error);
            throw new Error("Language API failed to fetch data");
        }
    });
}
// OPERATORS
const operatorDateComparison = (date1, date2) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const differenceArray = getDateDifference(date1, date2);
        let startZero = 0;
        for (let num of differenceArray) {
            if (num == 0) {
                startZero += 1;
            }
            else {
                break;
            }
        }
        if (startZero == 6) {
            return `Both dates and times are same with no difference.`;
        }
        let arr = [
            "years, ",
            "months, ",
            "days, ",
            "hours, ",
            "minutes, ",
            "seconds.",
        ];
        let message = "There is a difference of ";
        for (let i = startZero; i < 6; i++) {
            message = message.concat(`${differenceArray[i]} ${arr[i]}`);
        }
        return message;
    }
    catch (error) {
        console.error("Error running date comparison operator: ", error);
        throw new Error("Internal error processing date comparison logic.");
    }
});
exports.operatorDateComparison = operatorDateComparison;
const operatorTimezoneConversion = (date, timezone) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newDate = new Intl.DateTimeFormat("en-us", {
            dateStyle: "full",
            timeStyle: "long",
            timeZone: timezone,
        }).format(date);
        return newDate;
    }
    catch (error) {
        console.error("Error running timezone operator: ", error);
        throw new Error("Internal error processing timezone logic.");
    }
});
exports.operatorTimezoneConversion = operatorTimezoneConversion;
const operatorDateConversion = (date, datetype) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dateFormatsData = require("../jsonfiles/dateconversion.json");
        console.log(dateFormatsData);
        const v = dateFormatsData[datetype];
        const newDate = new Date(date).toLocaleDateString(v["locale"], v["options"]);
        return newDate;
    }
    catch (error) {
        console.error("Error running date conversion operator: ", error);
        throw new Error("Internal error processing date conversion logic.");
    }
});
exports.operatorDateConversion = operatorDateConversion;
const operatorGeolocation = (ipAddress) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apiData = yield getGeoData(ipAddress);
        console.log("apiData", apiData);
        if (apiData["status"] !== "success") {
            return `SSL unavailable for this endpoint. Try again or use a different IP Address`;
        }
        let message = `Coordinates: ${apiData["lat"]}, ${apiData["lon"]}\n`;
        message = message.concat(`Location: ${apiData["city"]}, ${apiData["region"]} ${apiData["country"]}\n`);
        message = message.concat(`${apiData["as"]}`);
        return message;
    }
    catch (error) {
        console.error("Error running geolocation operator: ", error);
        throw new Error("Internal error processing geolocation logic.");
    }
});
exports.operatorGeolocation = operatorGeolocation;
const operatorLanguage = (text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return getLanguage(text);
    }
    catch (error) {
        console.error("Error running language operator: ", error);
        throw new Error("Internal error processing language logic.");
    }
});
exports.operatorLanguage = operatorLanguage;
