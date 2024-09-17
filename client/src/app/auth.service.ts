import { Injectable } from '@angular/core';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  login() {
    if (this.isBrowser()) {
      // Redirect the user to the AWS Cognito hosted UI
      window.location.href = environment.cognito.hostedUI;
    }
  }

  logout() {
    if (this.isBrowser()) {
      // Log out the user by redirecting to the Cognito logout URL
      window.location.href = 'https://hrushikesh.auth.us-east-2.amazoncognito.com/logout?client_id=45hrc14o258efargko3bn6tnpk&logout_uri=http://localhost:4200';
    }
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser()) {
      return false;
    }

    // Check if the user has a valid authentication token in localStorage
    const token = localStorage.getItem('id_token');
    return !!token;
  }

  setToken(token: string) {
    if (this.isBrowser()) {
      // Save the token in localStorage when the user logs in
      localStorage.setItem('id_token', token);
    }
  }

  clearToken() {
    if (this.isBrowser()) {
      // Clear the token on logout
      localStorage.removeItem('id_token');
    }
  }

  private isBrowser(): boolean {
    // Check if the code is running in the browser (client-side) or server-side (Node.js)
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
