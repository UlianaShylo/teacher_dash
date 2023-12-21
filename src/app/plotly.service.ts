import { Injectable } from '@angular/core';
import * as Plotly from "plotly.js-dist-min";

@Injectable({
  providedIn: 'root',
})
export class PlotlyService {
  constructor() {}

  plot(elementId: string, data: any[], layout: any) {
    Plotly.newPlot(elementId, data, layout);
  }
}
