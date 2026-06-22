import {Component, input, model} from '@angular/core';

@Component({
  selector: 'pkb-discrete-slider',
  imports: [],
  templateUrl: './discrete-slider.html',
  styleUrl: './discrete-slider.css',
})
export class DiscreteSlider {
  inputId = input<string>('month-slider');
  step = input<number>(1);
  min = input<number>(1);
  max = input<number>(10);
  value = model<number>(this.min());

  updateValue(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.value.set(Number(inputElement.value));
  }
}
