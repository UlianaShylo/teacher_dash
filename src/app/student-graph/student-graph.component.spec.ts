import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentGraphComponent } from './student-graph.component';

describe('StudentGraphComponent', () => {
  let component: StudentGraphComponent;
  let fixture: ComponentFixture<StudentGraphComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentGraphComponent]
    });
    fixture = TestBed.createComponent(StudentGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
