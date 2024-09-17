import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

const cors = require("cors");

import {
	operatorAlmostPalindrome,
	operatorTextSimilarity,
} from "./rulesEngine";
import {
	operatorDateComparison,
	operatorDateConversion,
	operatorGeolocation,
	operatorTimezoneConversion,
} from "./otherOperators";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(
	cors({
		origin: "http://localhost:4200",
	})
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
	res.send("Hello from Express with TypeScript");
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

// OPERATOR ROUTES
app.post("/text-similarity", async (req: Request, res: Response) => {
	const { text1, text2 } = req.body;
	console.log(text1, text2);

	if (!text1 || !text2) {
		return res.status(400).json({ error: "String value is required." });
	}

	try {
		const result = await operatorTextSimilarity(text1, text2);
		console.log({ result });
		res.json({ result });
	} catch (error) {
		res.status(400).json({ error });
	}
});

app.post("/almost-palindrome", async (req: Request, res: Response) => {
	const { almostPalindrome } = req.body;

	console.log(almostPalindrome);

	if (!almostPalindrome) {
		return res.status(400).json({ error: "String value is required." });
	}

	try {
		const result = await operatorAlmostPalindrome(almostPalindrome);
		console.log({ result });
		res.json({ result });
	} catch (error) {
		res.status(400).json({ error });
	}
});

app.post("/date-comparison", async (req: Request, res: Response) => {
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
		const result = await operatorDateComparison(d1, d2);
		console.log({ result });
		res.json({ result });
	} catch (error) {
		res.status(400).json({ error });
	}
});

app.post("/timezone-conversion", async (req: Request, res: Response) => {
	const { date, timezone } = req.body;

	if (!date || !timezone) {
		return res.status(400).json({ error: "Inputs are required." });
	}

	const d = new Date(date);

	if (isNaN(d.getTime())) {
		return res.status(400).json({ error: "Invalid date format." });
	}

	try {
		const result = await operatorTimezoneConversion(d, timezone);
		console.log({ result });
		res.json({ result });
	} catch (error) {
		res.status(400).json({ error });
	}
});

app.post("/date-conversion", async (req: Request, res: Response) => {
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
		const result = await operatorDateConversion(date, datetype);
		console.log({ result });
		res.json({ result });
	} catch (error) {
		res.status(400).json({ error });
	}
});

app.post("/geolocation", async (req: Request, res: Response) => {
	const { ipAddress } = req.body;

	console.log(ipAddress);

	if (!ipAddress) {
		return res.status(400).json({ error: "Inputs required." });
	}

	try {
		const result = await operatorGeolocation(ipAddress);
		console.log({ result });
		res.json({ result });
	} catch (error) {
		res.status(400).json({ error });
	}
});
