import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonDataParserComponent } from './json-data-parser.component';

describe('JsonDataParserComponent', () => {
  let component: JsonDataParserComponent;
  let fixture: ComponentFixture<JsonDataParserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JsonDataParserComponent]
    });
    fixture = TestBed.createComponent(JsonDataParserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
