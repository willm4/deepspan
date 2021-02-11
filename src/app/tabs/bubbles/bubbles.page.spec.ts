import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BubblesPage } from './bubbles.page';

describe('BubblesPage', () => {
  let component: BubblesPage;
  let fixture: ComponentFixture<BubblesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BubblesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BubblesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
