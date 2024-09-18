import { Engine } from "json-rules-engine";
const levenshtein = require("fast-levenshtein");

// OPERATORS LOGIC
function calculateSimilarity(text1: string, text2: string): number {
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

function isAlmostPalindrome(str: string, diff: number): boolean {
	const isPalindrome = (s: string) => s === s.split("").reverse().join("");

	function canBePalindrome(s: string, removalsLeft: number): boolean {
		if(removalsLeft < 0) {
			removalsLeft = 0; 
		}

		if (isPalindrome(s)) {
			return true;
		}

		// If no removals are left and it's not a palindrome, return false
		if (removalsLeft === 0) {
			return false;
		}

		// Try removing each character and recursively check
		for (let i = 0; i < s.length; i++) {
			const modifiedStr = s.slice(0, i) + s.slice(i + 1);
			if (canBePalindrome(modifiedStr, removalsLeft - 1)) {
				return true;
			}
		}

		return false;
	}

	return canBePalindrome(str, diff);
}

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

  let arr: number[] = [years, months, days, hours, minutes, seconds];

  return arr; 
}

// OPERATORS

const operatorTextSimilarity = async (text1: string, text2: string): Promise<string> => {
	const jsonRulesData = require("../jsonfiles/operators/textSimilarity.json");
	const engine = new Engine();
	engine.addRule(jsonRulesData);

	const facts = { texts: { text1, text2 } };

	console.log({ facts });

	engine.addOperator("textSimilarity", (factValue: any, jsonValue: number) => {
		return calculateSimilarity(factValue.text1, factValue.text2) >= jsonValue;
	});

	try {
		const results = await engine.run(facts);

		const message =
			results.events.length > 0
				? results.events[0].params?.["message"] ||
				  "The two strings are similar, but no message."
				: "The two strings are not similar.";

		console.log({ message });
		return message;

	} catch (error) {
		console.error("Error running text similiary operator: ", error);
		throw new Error("Internal error processing text similarity logic.");
	}


};

const operatorAlmostPalindrome = async (palindromeString: string): Promise<string> => {
	const jsonRulesData = require("../jsonfiles/operators/almostPalindrome.json");
	const engine = new Engine();
	engine.addRule(jsonRulesData);

	const facts = { palindromeString };

	console.log({ facts });

	engine.addOperator(
		"almostPalindrome",
		(factValue: string, jsonValue: number) => {
			return isAlmostPalindrome(factValue, jsonValue);
		}
	);

	try {
		const results = await engine.run(facts);

		const message =
			results.events.length > 0
				? results.events[0].params?.["message"] ||
				  "Almost palindrome, but no message."
				: "Not an almost palindrome";

		console.log({ message });
		return message;
	} catch (error) {
		console.error("Error running palindrome operator: ", error);
		throw new Error("Internal error processing palindrome logic.");
	}
};


export {operatorAlmostPalindrome, operatorTextSimilarity};
