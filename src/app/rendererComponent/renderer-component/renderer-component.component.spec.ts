import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RendererComponentComponent } from './renderer-component.component';

describe('RendererComponentComponent', () => {
  let component: RendererComponentComponent;
  let fixture: ComponentFixture<RendererComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RendererComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RendererComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
