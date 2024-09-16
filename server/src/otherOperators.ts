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


// OPERATORS
const operatorDateComparison = async (date1: Date,date2: Date): Promise<string> => {
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
  
    const newDate = new Intl.DateTimeFormat('en-us', {dateStyle: 'full', timeStyle: 'long', timeZone: timezone}).format(date); 
    return newDate;

  } catch(error) {
    console.error("Error running timezone operator: ", error);
		throw new Error("Internal error processing timezone logic.");
  }

};

const operatorDateConversion = async (date: Date, datetype: string): Promise<string> => {
  try {
    const dateFormatsData = require('../jsonfiles/dateconversion.json');
    console.log(dateFormatsData); 

    const v =  dateFormatsData[datetype];

    const newDate = new Date(date).toLocaleDateString(v["locale"], v["options"]);
    return newDate; 

  } catch(error) {
    console.error("Error running date conversion operator: ", error);
		throw new Error("Internal error processing date conversion logic.");
  }
}; 

export { operatorDateComparison, operatorTimezoneConversion, operatorDateConversion };
