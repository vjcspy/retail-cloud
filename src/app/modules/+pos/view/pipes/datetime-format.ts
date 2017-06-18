import {Pipe, PipeTransform} from '@angular/core';
import * as moment from "moment";

@Pipe({
        name: 'datetimeFormat'
      })

export class DateTimeFormatPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    let m = moment(value);
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
