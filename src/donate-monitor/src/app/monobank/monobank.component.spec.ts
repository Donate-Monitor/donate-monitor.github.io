import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonobankComponent } from './monobank.component';

describe('MonobankComponent', () => {
  let component: MonobankComponent;
  let fixture: ComponentFixture<MonobankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonobankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonobankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
