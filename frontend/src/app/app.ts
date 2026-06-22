import {ChangeDetectionStrategy, Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Simulator} from './features/simulator/simulator';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Simulator,
  ],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {

}
