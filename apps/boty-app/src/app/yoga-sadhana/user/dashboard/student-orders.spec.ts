import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentOrders } from './student-orders';

describe('StudentOrders', () => {
  let component: StudentOrders;
  let fixture: ComponentFixture<StudentOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentOrders],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
