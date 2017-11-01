import {Pipe, PipeTransform} from '@angular/core';
import * as moment from "moment";
import {TranslateService} from "@ngx-translate/core";

@Pipe({
        name: 'datetimeFormat'
      })

export class DateTimeFormatPipe implements PipeTransform {
  constructor(protected translate: TranslateService) {}
  
  transform(value: any, ...args: any[]): any {
    const date = new Date(value);
    moment.locale(this.translate.getDefaultLang());
    let m = moment(date);
    switch (args[0]) {
      case "order_list":
        return m.format("dddd, MMMM Do YYYY");
      case "detail":
        return m.format("dddd, MMM Do YYYY, h:mm:ss a");
      case "date":
        return m.format("dddd, MMM Do YYYY");
      case "short-date":
        return m.format("MMM DD");
      case "time":
        return m.format("h:mm:ss a");
      case "short-time":
        return m.format("h:mm a");
      default:
        return m.format("dddd, MMM Do YYYY, h:mm:ss a");
    }
  }
}
