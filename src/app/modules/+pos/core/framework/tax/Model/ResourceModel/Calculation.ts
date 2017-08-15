import {DataObject} from "../../../General/DataObject";
import {TaxDB} from "../../../../../database/xretail/db/tax";
import * as _ from "lodash";

export class Calculation extends TaxDB {

    _getRates(request: DataObject) {
        return this.getRateAsync(
            request.getData('customer_class_id'),
            _.isArray(request.getData('product_class_id')) ? request.getData('product_class_id') : [request.getData('product_class_id')],
            request.getData('country_id'),
            request.getData('region_id'),
            request.getData('postcode')
        );
    }

    getRateInfo(request: DataObject) {
        let rates = this._getRates(request);
        return {
            process: this.getCalculationProcess(request, <TaxDB[]>rates),
            value: this._calculateRate(<TaxDB[]>rates)
        };
    }

    getCalculationProcess(request: DataObject, rates: TaxDB[] = null) {
        if (rates == null) {
            rates = this._getRates(request);
        }

        let result               = [];
        let row: any             = {rates: []};
        let ids                  = []; // rule_id
        let currentRate: number  = 0;
        let totalPercent: number = 0;
        let countedRates         = rates.length;

        for (let i = 0; i < countedRates; i++) {
            let rate  = rates[i];
            let value = rate.hasOwnProperty('rate') ? parseFloat(rate['rate'] + '') : parseFloat(rate['percent'] + '');

            let oneRate = {
                code: rate.code,
                percent: value,
                position: rate.position, // Sort Order
                priority: rate.priority,
            };

            if (rate.hasOwnProperty('tax_calculation_rule_id') && rate.tax_calculation_rule_id)
                oneRate['tax_calculation_rule_id'] = rate.tax_calculation_rule_id;

            if (rate.hasOwnProperty('hidden') && rate['hidden'])
                oneRate['hidden'] = rate['hidden'];

            if (rate.hasOwnProperty('amount') && rate['amount'])
                oneRate['amount'] = rate['amount'];

            if (rate.hasOwnProperty('base_amount') && rate['base_amount'])
                oneRate['base_amount'] = rate['base_amount'];

            if (rate.hasOwnProperty('base_real_amount') && rate['base_real_amount'])
                oneRate['base_real_amount'] = rate['base_real_amount'];

            row.rates.push(oneRate);

            let priority = rate.priority;
            ids.push(rate.code);
  
          /*
           * Đi đến rule cuối cùng. Vì 1 trường hợp có thể thỏa mãn nhiều tax NHƯNG LẠI CÙNG 1 rule.
           * Lý do: các rule khác nhau bởi tax_rate mà các tax rate này có post_code khác nhau nhưng đều thỏa mãn => Từ đó sẽ sinh ra nhiều rate
           * trùng rule.
           * CHỈ LẤY RATES CỦA RULE ĐẦU TIÊN THEO SỰ SẮP XẾP CỦA API
           */
          let ruleId = null;
  
          if (typeof rates[i + 1] != "undefined" && rates[i + 1].hasOwnProperty('tax_calculation_rule_id')) {
            ruleId = rate.tax_calculation_rule_id;
          }
          if (typeof rates[i + 1] != "undefined" && rates[i + 1].hasOwnProperty('tax_calculation_rule_id')) {
            while (typeof rates[i + 1] != "undefined" && rates[i + 1]['tax_calculation_rule_id'] == ruleId) {
              i++;
            }
          }
          
            currentRate += value;
  
          /*
           *  Các rate cùng priority và khác rule thì sẽ được cộng dồn.(Tức là sẽ xét từng bậc priority và khác rule)
           *  Còn khác priority thì sẽ xem xét xem setting là gì có phải là calculate_subtotal không. Nếu có thì + dồn không thì theo %
           */
  
          /*
           *  Giải thích được vấn đề tại sao có nhiều rule nhưng khi hiển thị ở tax detail nó lại 1 dòng => Là bởi vì nó cùng priority.
           *  Mỗi một row là 1 mức priority và trong 1 row thì có thể có nhiều rates
           */
            if (
                typeof rates[i + 1] == "undefined"
                || rates[i + 1]['priority'] != priority
                || (typeof rates[i + 1]['process'] != "undefined") && rates[i + 1]['process'] != rate['process']) {
                if (parseFloat(rates[i].calculate_subtotal + "") !== 0) {
                    row['percent']   = parseFloat(currentRate + "");
                    let _currentRate = parseFloat(currentRate + "");
                    totalPercent     = totalPercent + _currentRate;
                } else {
                    row['percent']      = this._collectPercent(totalPercent, currentRate);
                    let _currentPercent = parseFloat(row['percent'] + "");
                    totalPercent        = totalPercent + _currentPercent;
                }
                row['id'] = ids.join(', ');
                result.push(row);
                row         = {rates: []};
                ids         = [];
                currentRate = 0;
            }
        }
        return result;
    }

    _collectPercent(totalPercent: number, currentRate: number): number {
        return (100 + totalPercent) * (currentRate / 100);
    }

    _calculateRate(rates: TaxDB[]) {
        let result: number       = 0;
        let currentRate: number  = 0;
        let countedRates: number = rates.length;

        for (let i = 0; i < countedRates; i++) {
            let rate     = rates[i];
            let rule     = rate.tax_calculation_rule_id;
            let value    = parseFloat(rate.rate + "");
            let priority = rate.priority;

            while (typeof rates[i + 1] != "undefined" && rates[i + 1].tax_calculation_rule_id == rule) {
                i++;
            }
            currentRate += value;

            /*
            * Rate sau khi được tính cho các priority khác nhau sẽ được cộng dồn. Điều này chứng mình được. Đêu bằng giá ban đầu * với từng rate(giao hoán, kết hợp)
            * Chỉ có việc khác priority thì rate sẽ bằng bao nhiêu mới cần phải để ý setting của rule có calculate_subtotal hay không.
            */
            
            if (typeof rates[i + 1] == "undefined" || rates[i + 1].priority != priority) {
                if (rates[i].calculate_subtotal != "0") {
                    result += parseFloat(currentRate + "");
                } else {
                    result += this._collectPercent(result, currentRate);
                }
                currentRate = 0;
            }
        }
        return result;
    }
}
