import { Routes } from '@angular/router';
import { RulesEngineComponent } from './rules-engine/rules-engine.component';
import { AuthGuard } from './auth.guard';  // Import AuthGuard

export const routes: Routes = [
    {
        path: 'json-rules-engine',
        title: 'JSON Rules Engine',
        component: RulesEngineComponent,
        canActivate: [AuthGuard]  // Protect the route with AuthGuard
    },
    { path: '', redirectTo: 'json-rules-engine', pathMatch: 'full' }
];
