import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NxbComponent } from './nxb.component';

describe('NxbComponent', () => {
  let component: NxbComponent;
  let fixture: ComponentFixture<NxbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NxbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NxbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
