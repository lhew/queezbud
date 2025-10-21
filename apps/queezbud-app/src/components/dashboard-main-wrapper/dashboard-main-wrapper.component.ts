import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';


@Component({
    selector: 'app-dashboard-main-wrapper',
    templateUrl: './dashboard-main-wrapper.component.html',
    standalone: true,
    imports: [RouterOutlet, RouterLink],
})
export class DashboardMainWrapperComponent {} 