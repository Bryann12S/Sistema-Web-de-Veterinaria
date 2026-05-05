import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MascotaList } from './mascota-list';

describe('MascotaList', () => {
  let component: MascotaList;
  let fixture: ComponentFixture<MascotaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MascotaList],
    }).compileComponents();

    fixture = TestBed.createComponent(MascotaList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
