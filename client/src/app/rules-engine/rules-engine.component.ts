import { Component, OnInit } from '@angular/core';
import { BackendAPIService } from '../backend-api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-rules-engine',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rules-engine.component.html',
  styleUrls: ['./rules-engine.component.scss'],
})
export class RulesEngineComponent implements OnInit {
  user: any = null;  // Holds the user details
  items: string[] = [
    'Text Similarity',
    'Geolocation Identification',
    'Almost Palindrome',
    'Language Detection',
    'Date Comparison',
    'Timezone Conversion',
    'Date Conversion',
  ];

  selectedItem: string | null = null;
  inputs: any[] = [];
  output: string = '';
  loggedIn: boolean = false;



    clientId = environment.cognitoClientId;
    cognitoDomain = environment.cognitoDomain;
    redirectUri = environment.redirectUri;

  constructor(private api: BackendAPIService, private http: HttpClient) {}

  ngOnInit(): void {
    this.checkUser();
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      this.exchangeCodeForToken(code);
    }
  }

  // Check if user is already logged in
  async checkUser() {
    try {
      this.user = localStorage.getItem('access_token') ? { username: 'Authenticated User' } : null;
      this.loggedIn = !!this.user;
    } catch (error) {
      this.user = null;
    }
  }

  // Sign-in method using Cognito Hosted UI
async signIn() {
  const url = `https://${this.cognitoDomain}/login?client_id=${this.clientId}&response_type=code&scope=email+openid+phone&redirect_uri=${this.redirectUri}`;
  window.location.href = url;
}


  // Sign-out method
  async signOut() {
    localStorage.removeItem('access_token');
    this.user = null;
    this.loggedIn = false;
  }

  // Exchange authorization code for access token
  exchangeCodeForToken(code: string) {
    const url = `https://${this.cognitoDomain}/oauth2/token`;

    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('client_id', this.clientId)
      .set('code', code)
      .set('redirect_uri', this.redirectUri);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    this.http.post<{ access_token: string }>(url, body.toString(), { headers })
      .subscribe(response => {
        if (response.access_token) {
          this.storeAccessToken(response.access_token);
          this.loggedIn = true;
          this.user = { username: 'Authenticated User' };  // Customize based on actual user data
        }
      });
  }


  // Store access token in local storage
  storeAccessToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  // Handle dropdown item selection
  onSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedItem = target.value;
    this.inputs = this.getInputsForItem(this.selectedItem);
    this.output = '';
  }

  // Get input fields for each selected item
  getInputsForItem(item: string): any[] {
    switch (item) {
      case 'Text Similarity':
        return [
          { label: 'Text 1', type: 'text', placeholder: 'Text 1' },
          { label: 'Text 2', type: 'text', placeholder: 'Text 2' },
        ];
      case 'Geolocation Identification':
        return [
          { label: 'IP Address', type: 'text', placeholder: 'IP Address' },
        ];
      case 'Almost Palindrome':
        return [
          { label: 'Enter Palindrome', type: 'text', placeholder: 'Text' },
        ];
      case 'Language Detection':
        return [
          { label: 'Language Text', type: 'text', placeholder: 'Enter in any language' },
        ];
      case 'Date Comparison':
        return [
          { label: 'Date & Time', type: 'datetime-local' },
          { label: 'Date & Time', type: 'datetime-local' },
        ];
      case 'Timezone Conversion':
        return [
          { label: 'Date & Time', type: 'datetime-local' },
          { label: 'Timezone', type: 'datalist', options: this.api.aryIanaTimeZones },
        ];
      case 'Date Conversion':
        return [
          { label: 'Date', type: 'date' },
          { label: 'Date Format', type: 'dropdown', options: ["MM/DD/YYYY", "DD/MM/YYYY", "Mon Day, Year", "Day Mon Year", "Weekday, Month Day, Year", "Weekday Day Month Year"] },
        ];
      default:
        return [];
    }
  }

  // Execute selected function
  async executeFunction() {
    if (this.selectedItem) {
      this.output = await this.performAction(this.selectedItem, this.inputs);
    }
  }

  // Perform action based on selected item
  async performAction(item: string, inputs: any[]): Promise<any> {
    switch (item) {
      case 'Text Similarity':
        return await this.api.textSimilarityOperator(inputs[0].value, inputs[1].value);
      case 'Geolocation Identification':
        return await this.api.geolocationOperator(inputs[0].value);
      case 'Almost Palindrome':
        return await this.api.palindromeOperator(inputs[0].value);
      case 'Language Detection':
        return await this.api.languageOperator(inputs[0].value);
      case 'Date Comparison':
        return await this.api.dateComparisonOperator(inputs[0].value, inputs[1].value);
      case 'Timezone Conversion':
        return this.api.timezoneConversionOperator(inputs[0].value, inputs[1].value);
      case 'Date Conversion':
        return this.api.dateConversionOperator(inputs[0].value, inputs[1].value);
      default:
        return 'No action defined';
    }
  }
}
