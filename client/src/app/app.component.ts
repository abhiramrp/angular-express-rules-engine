import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RulesEngineComponent } from './rules-engine/rules-engine.component';
import { BackendAPIService } from './services/backend-api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RulesEngineComponent,  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'client';
}
