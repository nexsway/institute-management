import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageChaptersComponent } from './manage-chapters.component';

describe('ManageChaptersComponent', () => {
  let component: ManageChaptersComponent;
  let fixture: ComponentFixture<ManageChaptersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageChaptersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageChaptersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
