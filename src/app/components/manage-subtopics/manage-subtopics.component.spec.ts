import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSubtopicsComponent } from './manage-subtopics.component';

describe('ManageSubtopicsComponent', () => {
  let component: ManageSubtopicsComponent;
  let fixture: ComponentFixture<ManageSubtopicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSubtopicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSubtopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
