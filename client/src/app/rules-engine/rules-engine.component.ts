import { Component, inject } from '@angular/core';
import { BackendAPIService } from '../backend-api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rules-engine',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rules-engine.component.html',
  styleUrl: './rules-engine.component.scss',
})
export class RulesEngineComponent {
  constructor(private api: BackendAPIService) {}

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

  onSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedItem = target.value;
    this.inputs = this.getInputsForItem(this.selectedItem);
    this.output = '';
  }

  getInputsForItem(item: string): any[] {
    // Define different input structures for each item here
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
          {
            label: 'Language Text',
            type: 'text',
            placeholder: 'Enter in any language',
          },
        ];
      case 'Date Comparison':
        return [
          { label: 'Date & Time', type: 'datetime-local'},
          { label: 'Date & Time', type: 'datetime-local'},
        ];
      case 'Timezone Conversion':
        return [
          { label: 'Date & Time', type: 'datetime-local'},
          { label: 'Timezone', type: 'datalist', options:this.api.aryIanaTimeZones}, 
        ]
      case 'Date Conversion':
        return [
          { label: 'Date', type: 'date'},
          { label: 'Date Format', type: 'dropdown', options:["MM/DD/YYYY", "DD/MM/YYYY", "Mon Day, Year", "Day Mon Year", "Weekday, Month Day, Year", "Weekday Day Month Year"]},
        ];

      default:
        return [];
    }
  }

  async executeFunction() {
    if (this.selectedItem) {
      this.output = await this.performAction(this.selectedItem, this.inputs);
    }
  }

  async performAction(item: string, inputs: any[]): Promise<any> {
    switch (item) {
      case 'Text Similarity':
        return await this.api.textSimilarityOperator(
          inputs[0].value,
          inputs[1].value
        );
      case 'Geolocation Identification':
        return await this.api.geolocationOperator(inputs[0].value);
      case 'Almost Palindrome':
        return await this.api.palindromeOperator(inputs[0].value);
      case 'Language Detection':
        return await this.api.languageOperator(inputs[0].value);
      case 'Date Comparison':
        return await this.api.dateComparisonOperator(inputs[0].value,
          inputs[1].value);
      case 'Timezone Conversion':
        return this.api.timezoneConversionOperator(inputs[0].value, inputs[1].value);
      case 'Date Conversion':
        return this.api.dateConversionOperator(inputs[0].value, inputs[1].value);
      default:
        return 'No action defined';
    }
  }
}
