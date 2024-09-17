import DetectLanguage from "detectlanguage";
import dotenv from "dotenv";

dotenv.config();

// OPERATORS LOGIC

function getDateDifference(date1: Date, date2: Date): number[] {
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

	let arr: number[] = [years, months, days, hours, minutes, seconds];

	return arr;
}

async function getGeoData(ipAddress: string): Promise<any> {
	try {
		const response = await fetch(`http://ip-api.com/json/${ipAddress}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				// Add any other headers if needed, like Authorization
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("IP API issue", error);
		throw new Error("IP API failed to fetch data");
	}
}

async function getLanguage(text: string): Promise<any> {
	const apiKey = process.env.LANGUAGE_APIKEY || "";

	try {
		const detectlanguage = new DetectLanguage(apiKey);

		let langCode = "";

		await detectlanguage.detectCode(text).then(function (result) {
			console.log(JSON.stringify(result));
			langCode = result || "";
		});

		if (langCode === "") {
			throw new Error("Language not detected");
		}

		let langList: any[] = [];

		await detectlanguage.languages().then(function (result) {
			langList = result;
		});

		const language = langList.find((lang) => lang.code === langCode);

		if (!language) {
			throw new Error("Language not found");
		}

		return language.name;
	} catch (error) {
		console.error("Language API issue", error);
		throw new Error("Language API failed to fetch data");
	}
}

// OPERATORS
const operatorDateComparison = async (date1: Date, date2: Date): Promise<string> => {
	try {
		const differenceArray = getDateDifference(date1, date2);

		let startZero = 0;

		for (let num of differenceArray) {
			if (num == 0) {
				startZero += 1;
			} else {
				break;
			}
		}

		if (startZero == 6) {
			return `Both dates and times are same with no difference.`;
		}

		let arr: string[] = [
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
	} catch (error) {
		console.error("Error running date comparison operator: ", error);
		throw new Error("Internal error processing date comparison logic.");
	}
};

const operatorTimezoneConversion = async (date: Date, timezone: string): Promise<string> => {
	try {
		const newDate = new Intl.DateTimeFormat("en-us", {
			dateStyle: "full",
			timeStyle: "long",
			timeZone: timezone,
		}).format(date);
		return newDate;
	} catch (error) {
		console.error("Error running timezone operator: ", error);
		throw new Error("Internal error processing timezone logic.");
	}
};

const operatorDateConversion = async (date: Date, datetype: string): Promise<string> => {
	try {
		const dateFormatsData = require("../jsonfiles/dateconversion.json");
		console.log(dateFormatsData);

		const v = dateFormatsData[datetype];

		const newDate = new Date(date).toLocaleDateString(
			v["locale"],
			v["options"]
		);
		return newDate;
	} catch (error) {
		console.error("Error running date conversion operator: ", error);
		throw new Error("Internal error processing date conversion logic.");
	}
};

const operatorGeolocation = async (ipAddress: string): Promise<string> => {
	try {
		const apiData = await getGeoData(ipAddress);
		console.log("apiData", apiData);

		if (apiData["status"] !== "success") {
			return `SSL unavailable for this endpoint. Try again or use a different IP Address`;
		}

		let message = `Coordinates: ${apiData["lat"]}, ${apiData["lon"]}\n`;
		message = message.concat(
			`Location: ${apiData["city"]}, ${apiData["region"]} ${apiData["country"]}\n`
		);
		message = message.concat(`${apiData["as"]}`);

		return message;
	} catch (error) {
		console.error("Error running geolocation operator: ", error);
		throw new Error("Internal error processing geolocation logic.");
	}
};

const operatorLanguage = async (text: string): Promise<string> => {
	try {
		return getLanguage(text);
	} catch (error) {
		console.error("Error running language operator: ", error);
		throw new Error("Internal error processing language logic.");
	}
};

export {
	operatorDateComparison,
	operatorTimezoneConversion,
	operatorDateConversion,
	operatorGeolocation,
	operatorLanguage,
};
