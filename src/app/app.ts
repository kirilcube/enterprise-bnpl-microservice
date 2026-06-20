import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {InputCurrency} from './ui/input-currency/input-currency';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, InputCurrency],
  templateUrl: './app.html',
})
export class App {
}
