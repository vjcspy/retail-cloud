import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ShiftState} from "../../../R/sales/shifts/shift.state";
import {NotifyManager} from "../../../../../../services/notify-manager";
import {AbstractSubscriptionComponent} from "../../../../../../code/AbstractSubscriptionComponent";
import {ShiftDetailService} from "../../../R/sales/shifts/detail/detail.service";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-shifts-report',
             templateUrl: 'report.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesShiftsReportComponent extends AbstractSubscriptionComponent implements OnInit {
  @ViewChild('receiptElem') receiptElem: ElementRef;
  @Input() shiftState: ShiftState;
  
  constructor(private notify: NotifyManager, private shiftDetailService: ShiftDetailService) {
    super();
  }
  
  ngOnInit() {
    this.subscribePrintReport();
  }
  
  protected subscribePrintReport() {
    this.subscribeObservable('print_shift_report', () => this.shiftDetailService
                                                             .getPrintReportObservable()
                                                             .subscribe(() => {
                                                               this.print();
                                                             }));
  }
  
  protected getHtml() {
    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800" rel="stylesheet">
    <link rel="stylesheet" href="style.css" media="all" />        
    <link rel="stylesheet" href="styles/print-style.css" media="all" /> 

</head>

<body>` + jQuery(this.receiptElem.nativeElement).html() + `</body>
</html>`;
  }
  
  protected print() {
    let myWindow = window.open('', '', 'width=600,height=800');
    if (myWindow) {
      myWindow.document.write(this.getHtml());
      myWindow.document.close();
      myWindow.focus();
      setTimeout(() => {
        myWindow.print();
        myWindow.close();
      }, 1000);
    } else {
      this.notify.info("allow_new_page_print_receipt");
    }
  }
}
