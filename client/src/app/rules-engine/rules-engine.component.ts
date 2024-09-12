import { Component } from '@angular/core';
import { BackendAPIService } from '../services/backend-api.service';

@Component({
  selector: 'app-rules-engine',
  standalone: true,
  imports: [],
  templateUrl: './rules-engine.component.html',
  styleUrl: './rules-engine.component.scss'
})
export class RulesEngineComponent {

  constructor(private backendApi: BackendAPIService) {}

  items: string[] = [
    'Date Calculator',
    'Text Similarity',
    'Geolocation Identification',
    'Almost Palindrome',
    'Language Detection',
    'Traffic Predictor',
  ];

  selectedItem: string | null = null;
  inputs: any[] = [];
  output: string = '';

  onSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedItem = target.value;
    this.inputs = this.getInputsForItem(this.selectedItem);
    this.output = "";
  }

  getInputsForItem(item: string): any[] {
    // Define different input structures for each item here
    switch (item) {
      case 'Date Calculator':
        return [{ label: "L: ", type: 'text', placeholder: 'Input 1' }];
      case 'Text Similarity':
        return [
          { label: "L: ", type: 'text', placeholder: 'Text 1' },
          { label: "L: ", type: 'text', placeholder: 'Text 2' },
        ];
      case 'Geolocation Identification':
        return [
          { label: "L: ", type: 'number', placeholder: 'Input 3' },
          { label: "L: ", type: 'text', placeholder: 'Input 3 Text' },
        ];
      case 'Almost Palindrome':
        return [{ label: "Enter Palindrome: ", type: 'text', placeholder: 'Text' }];
      case 'Language Detection':
        return [{ label: "L: ", type: 'text', placeholder: 'Input 5' }];
      case 'Traffic Predictor':
        return [{ label: "L: ", type: 'text', placeholder: 'Input 6' }];

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
      case 'Date Calculator':
        return `Executed action for ${item} with input: ${inputs[0].value}`;
      /*
      case 'Text Similarity':
        return await this.backendApi.operatorTextSimilarity(
          inputs[0].value,
          inputs[1].value
        );
        */
      case 'Geolocation Identification':
        return `Executed action for ${item} with inputs: ${inputs[0].value}, ${inputs[1].value}`;
      case 'Almost Palindrome':
        return await this.backendApi.operatorAlmostPalindrome(inputs[0].value);
      case 'Language Detection':
        return `Executed action for ${item} with input: ${inputs[0].value}`;
      case 'Traffic Predictor':
        return `Executed action for ${item} with input: ${inputs[0].value}`;
      default:
        return 'No action defined';
    }
  }

}
