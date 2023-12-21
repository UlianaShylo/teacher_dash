import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { JsonDataParserComponent } from './json-data-parser/json-data-parser.component';
import { StudentGraphComponent } from './student-graph/student-graph.component';
import { PlotlyService } from "./plotly.service";

@NgModule({
  declarations: [
    AppComponent,
    JsonDataParserComponent,
    StudentGraphComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [PlotlyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
