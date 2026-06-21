import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Simulator} from './features/simulator/simulator';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Simulator,
  ],
  templateUrl: './app.html',
})
export class App {

}
