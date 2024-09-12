import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import { operatorAlmostPalindrome } from "./rulesEngine";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
	res.send("Hello from Express with TypeScript");
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

app.post("/almost-palindrome", (req: Request, res: Response) => {
	const data = req.body.data;
  console.log({data}); 

	try {
		const result = operatorAlmostPalindrome(data);
		res.json({ result });
	} catch (error) {
		res.status(400).json({ error });
	}
});
