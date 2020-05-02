import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardinglayoutComponent } from './onboardinglayout.component';

describe('OnboardinglayoutComponent', () => {
  let component: OnboardinglayoutComponent;
  let fixture: ComponentFixture<OnboardinglayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnboardinglayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardinglayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
