import { json } from "body-parser";
import { Engine } from "json-rules-engine";

const engine = new Engine();

const jsonRules = require("../operators/almostPalindrome.json");

console.log(jsonRules);

engine.addRule(jsonRules);

// OPERATORS LOGIC
function isAlmostPalindrome(str: string): boolean {
	const isPalindrome = (s: string) => s === s.split("").reverse().join("");

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

function addPalindromeOperator(): void {
	engine.addOperator(
		"almostPalindrome",
		(factValue: string, jsonValue: boolean) => {
			return isAlmostPalindrome(factValue) === jsonValue;
		}
	);
}

const operatorAlmostPalindrome = async (palindromeString: string): Promise<string> => {
	const facts = { palindromeString };

	console.log({ facts });

	addPalindromeOperator();

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
		console.error("Error running palindrome engine: ", error);
		throw new Error("Internal error processing palindrome logic.");
	}
};

export { operatorAlmostPalindrome };
