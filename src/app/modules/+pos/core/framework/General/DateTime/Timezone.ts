import * as moment from "moment";
export class Timezone {
    isScopeDateInInterval(scope, dateFrom = null, dateTo = null): boolean {
        let _currentMoment = moment();

        let result = false;
        if (!!dateFrom && moment(dateFrom).isAfter(_currentMoment)) {

        }
        else if (!!dateTo) {
            let dateToAfterAddOneDay = moment(dateTo).add(86400, "s");
            if (dateToAfterAddOneDay.isAfter(_currentMoment))
                result = true;
        }
        else
            result = true;

        return result;
    }

    static getCurrentStringTime(): string {
        return moment().format("YYYY-MM-DD HH:mm:s");
    }

}