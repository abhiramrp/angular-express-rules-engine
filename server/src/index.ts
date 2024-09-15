import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import { operatorAlmostPalindrome } from "./rulesEngine";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.send("Hello from Express with TypeScript");
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

app.post("/almost-palindrome", async (req: Request, res: Response) => {
	
	const {almostPalindrome} = req.body;

	console.log(almostPalindrome);

	if (!almostPalindrome) {
    return res.status(400).json({ error: 'String value is required.' });
  }

	try {
		const result = await operatorAlmostPalindrome(almostPalindrome);
		console.log({result});
		res.json({result} );
	} catch (error) {
		res.status(400).json({ error });
	}
});
