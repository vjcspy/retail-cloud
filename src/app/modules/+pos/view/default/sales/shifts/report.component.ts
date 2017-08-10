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
    <style>
      body {
          -webkit-text-size-adjust: 100% !important;
          -ms-text-size-adjust: 100% !important;
          -webkit-font-smoothing: antialiased !important;
          font-family: 'Open Sans', sans-serif;
          font-weight: 400;
          color: #000 !important;
          margin: 0;
          padding: 0;
          background: none !important;
          font-size: 12px;
          line-height: 1.2;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          color-adjust: exact;
          background: red;
      }
      *{
        box-sizing: border-box;
      }

      .ttu {
          text-transform: uppercase;
      }

      .tal {
          text-align: left;
      }

      .tar {
          text-align: right;
      }

      .tac {
          text-align: center;
      }


      table,
      tr,
      td {
          border-collapse: collapse;
          border-spacing: 0;
          vertical-align: top;
      }

      table {
          width: 100%;

      }
      .open-store td{
            font-size: 10px;
          }

      strong {
          font-weight: 700;
      }

      h1,
      h2,
      h3,
      h4 {
          text-align: center;
          text-transform: uppercase;
          font-size: 12px;
      }

      h1,
      h2,
      h4 {
          font-weight: 700;
      }

      h1 {
          font-size: 14px;
          margin: 6pt 0;
          font-weight: 800;
      }

      h2 {
          font-size: 14px;
          margin: 6pt 0;
      }

      h3 {
          /*font-size: 142%;*/
          margin: 6pt 0;          
      }

      h4 {
          /*font-size: 133%;*/
          margin: 6pt 0;
      }


      .invoice-print{
        max-width: 420px;
        background: white;
        margin: 0 auto;
        padding:0 10px 0 0px;


      }

      .star-line,
      .dot-line {
          white-space: nowrap;
          position: relative;
          overflow: hidden;
          color: #000 !important;
          margin: 5px 0;
      }

      .star-line:after,
      .dot-line:after {
          letter-spacing: 3px;
          font-size: 100%;
          display: inline-block;
          font-weight: 700;
      }

      .star-line:after {
          content: "*************************************************************************************************";
      }

      .dot-line:after {
          content: "------------------------------------------------------------------------------------------------";
      }

      .total-net-btn div {
          background-color: #000000 !important;
          color: #ffffff !important;
          font-size: 133%;
          margin: 9pt 0;
          padding: 6pt 11pt;
          border: none;
          outline: none;
          border-radius: 50px;
          display: inline-block;
      }
      .total-net-btn div strong{
        padding-left: 5px;
      }
      .payments table td:nth-child(1) {
          width: 68%;
      }

      .payments .summary td {
          /*font-size: 117%;*/
      }

      .activities table {
          margin: 2pt 0;
      }

      .activities{
        /*margin-top: 20px;*/
      }
      .activities .close-shift {
          font-size: 108%;
      }

      .activities .close-shift th {}

      .activities .close-shift .info {
          padding: 6pt 0;
      }
    </style>

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
