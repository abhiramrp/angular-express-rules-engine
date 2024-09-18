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
