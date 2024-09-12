import { Engine } from "json-rules-engine";

const engine = new Engine();

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
	const jsonRules = require("./operators/almostPalindrome.json");

	engine.addRule(jsonRules);
	engine.addOperator(
		"almostPalindrome",
		(factValue: string, jsonValue: boolean) => {
			return isAlmostPalindrome(factValue) === jsonValue;
		}
	);
}

const operatorAlmostPalindrome = async (
	palindromeString: string
): Promise<string | undefined> => {
	const facts = { palindromeString };

	addPalindromeOperator();

	return new Promise((resolve, reject) => {
		engine
			.run(facts)
			.then((results) => {
				let message: string | undefined = undefined;
				message = results.events.length
					? results.events[0].params?.["message"]
					: "Not an almost palindrome";
				resolve(message);
			})
			.catch((error) => {
				console.log(error);
				reject(error); // Reject the promise in case of an error
			});
	});
};

export { operatorAlmostPalindrome };
