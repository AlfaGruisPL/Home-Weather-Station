import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirInfoComponent } from './air-info.component';

describe('AirInfoComponent', () => {
  let component: AirInfoComponent;
  let fixture: ComponentFixture<AirInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AirInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
