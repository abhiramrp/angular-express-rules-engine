import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class BackendAPIService {
  constructor(private http: HttpClient) {}
  
  getMessage() {
    return this.http.get('http://localhost:3000/');
  }

  operatorAlmostPalindrome(palindromeString: string): any {
    console.log({palindromeString});
    return this.http.post('http://localhost:3000/almost-palindrome', {palindromeString});
  }

}
