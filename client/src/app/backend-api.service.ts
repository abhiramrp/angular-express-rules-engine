import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

interface OperatorResponse {
  result: string;
}

@Injectable({
  providedIn: 'root'
})

export class BackendAPIService {
  url = "http://localhost:3000";

  constructor(private http: HttpClient) {}

  async getExpress(): Promise<any> {
    try {
      const response = await this.http.get(`${this.url}/`, { responseType: 'text' }).toPromise();
      return response; // Now the response is returned as a resolved promise
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async palindromeOperator(almostPalindrome: string): Promise<any | null> {
    try {
      const response = await this.http.post<OperatorResponse>(`${this.url}/almost-palindrome`, {almostPalindrome}).toPromise();
      console.log(response);
      if (response) {
        console.log(response.result); // This will print the value of the 'result' field
        return response.result; // Return the 'result' field
      } else {
        console.error("Response is undefined");
        return null;
      }

    } catch (error) {
      console.error(error); 
      return null; 
    }
  }

  async textSimilarityOperator(text1: string, text2: string): Promise<any | null> {
    try {
      const response = await this.http.post<OperatorResponse>(`${this.url}/text-similarity`, {text1, text2}).toPromise();
      console.log(response);
      if (response) {
        console.log(response.result); // This will print the value of the 'result' field
        return response.result; // Return the 'result' field
      } else {
        console.error("Response is undefined");
        return "Response is undefined";
      }

    } catch (error) {
      console.error(error); 
      return error; 
    }
  }

  async geolocationOperator(ipAddress: string): Promise<any | null> {
    try {
      console.log({ipAddress});
      const response = await this.http.post<OperatorResponse>(`${this.url}/geolocation`, {ipAddress}).toPromise();
      console.log(response);
      if (response) {
        console.log(response.result); // This will print the value of the 'result' field
        return response.result; // Return the 'result' field
      } else {
        console.error("Response is undefined");
        return null;
      }

    } catch (error) {
      console.error(error); 
      return error; 
    }
  }

  async languageOperator(text: string): Promise<any | null> {
    try {
      const response = await this.http.post<OperatorResponse>(`${this.url}/language`, {text}).toPromise();
      console.log(response);
      if (response) {
        console.log(response.result); // This will print the value of the 'result' field
        return response.result; // Return the 'result' field
      } else {
        console.error("Response is undefined");
        return null;
      }

    } catch (error) {
      console.error(error); 
      return error; 
    }
  }

  async dateComparisonOperator(date1: string, date2: string): Promise<any | null> {
    try {
      const response = await this.http.post<OperatorResponse>(`${this.url}/date-comparison`, {date1, date2}).toPromise();
      console.log(response);
      if (response) {
        console.log(response.result); // This will print the value of the 'result' field
        return response.result; // Return the 'result' field
      } else {
        console.error("Response is undefined");
        return null;
      }

    } catch (error) {
      console.error(error); 
      return error; 
    }

  }



}
