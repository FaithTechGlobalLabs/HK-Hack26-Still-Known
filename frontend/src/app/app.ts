import { Component } from '@angular/core';
import { CityMap } from './feature/city-map/city-map';

@Component({
  imports: [CityMap],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
