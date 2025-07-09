import { Component } from '@angular/core';
import {BasicWidgetComponent} from '../../widgets/basic-widget.component';
import {BarWidgetComponent} from '../../widgets/bar-widget.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    BasicWidgetComponent,
    BarWidgetComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
