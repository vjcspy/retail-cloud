import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, EventEmitter, Output, ChangeDetectionStrategy} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'iz-bootstrap-switch',
             templateUrl: 'bootstrap-switch.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })
export class IZBootstrapSwitchComponent implements OnInit, AfterViewInit {
  @ViewChild('bootstrapSwitchElem') protected bootstrapSwitchElem: ElementRef;
  @Input() protected model: boolean                      = false;
  @Output() protected modelChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  constructor() { }
  
  ngOnInit() {
  }
  
  ngAfterViewInit(): void {
    let vm = this;
    $(this.bootstrapSwitchElem.nativeElement)['bootstrapSwitch']({
                                                                   offText: "No",
                                                                   onText: "Yes",
                                                                   state: this.model,
                                                                   onSwitchChange: (event, state) => {
                                                                     vm.model = state;
                                                                     vm.modelChange.emit(state);
                                                                   }
                                                                 });
  }
}
