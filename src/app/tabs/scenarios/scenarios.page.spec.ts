import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ScenariosPage } from './scenarios.page';

describe('ScenariosPage', () => {
  let component: ScenariosPage;
  let fixture: ComponentFixture<ScenariosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenariosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScenariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
