import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddBubblePage } from './add-bubble.page';

describe('AddBubblePage', () => {
  let component: AddBubblePage;
  let fixture: ComponentFixture<AddBubblePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBubblePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddBubblePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
