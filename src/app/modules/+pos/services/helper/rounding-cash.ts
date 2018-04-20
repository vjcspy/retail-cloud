import * as _ from 'lodash';

export class RoundingCash {
  static ROUND_MIDPOINT_DOWN = 1;
  static ROUND_MIDPOINT_UP   = 2;
  static ALWAYS_ROUND_DOWN   = 3;
  static ALWAYS_ROUND_UP     = 4;
  
  config = {
    roundTo: '0.01_cash_denomination',
    roundingRule: 'round_midpoint_down'
  };
  constructor() {}
  
  setConfigRoundingCash(roundingCashConfig) {
    this.config.roundTo = roundingCashConfig.roundTo;
    this.config.roundingRule = roundingCashConfig.roundingRule;
  }
  
  getRoundingCash(money) {
    let _roundingRule = this.getRoundingRule();
    let _roundTo = this.getRoundTo();
    
    if (_roundTo === 0.01)
      return money;
    
    switch (_roundingRule) {
      case 1:
        return this.getRoundingCashForMidpointRound(money);
      case 2:
        return this.getRoundingCashForMidpointRound(money);
      case 3:
        return this.getRoundingCashForAlwaysRound(money);
      case 4:
        return this.getRoundingCashForAlwaysRound(money);
      default:
        return this.getRoundingCashForMidpointRound(money);
    }
  }
  
  getRoundingCashForMidpointRound(money) {
    let _roundTo   = this.getRoundTo();
    let _midPoints = this.getMidPoint();
    
    switch (_roundTo) {
      case 0.01:
        return money;
      case 0.05:
        let money005;
          money005 = this.decimalAdjust('floor', money, -1);
        let [_midPoint1005, _midPoint2005] = _.map(_midPoints, (n) => {
          return this.round(n + money005, 3);
        });
        
        if (money == _midPoint1005) {
          if (this.getRoundingRule() === 1) {
            money = money005;
          } else if (this.getRoundingRule() === 2) {
            money = money005 + 0.05;
          }
        }
        if (money == _midPoint2005) {
          if (this.getRoundingRule() === 1) {
            money = money005 + 0.05;
          } else if (this.getRoundingRule() === 2) {
            money = money005 + 0.05 * 2;
          }
        }
        if (money < _midPoint1005) {
          money = money005;
        } else if ((_midPoint1005 < money) && (money < _midPoint2005)) {
          money = money005 + 0.05;
        } else if (_midPoint2005 < money) {
          money = money005 + 0.05 * 2;
        }
        return this.round(money);
      case 0.1:
        let money01;
        money01 = this.decimalAdjust('floor', money, -1);
        let [_midPoint101, _midPoint201] = _.map(_midPoints, (n) => {
          return this.round(n + money01);
        });
        
        if (money == _midPoint101) {
          if (this.getRoundingRule() === 1) {
            money = money01;
          } else if (this.getRoundingRule() === 2) {
            money = money01 + 0.1;
          }
        }
        if (money < _midPoint101) {
          money = money01;
        } else if (_midPoint101 < money) {
          money = money01 + 0.1;
        }
        return this.round(money);
      case 0.5:
        let money05;
          money05 = this.decimalAdjust('floor', money, 0);
        let [_midPoint105, _midPoint205] = _.map(_midPoints, (n) => {
          return this.round(n + money05);
        });
        
        if (money == _midPoint105) {
          if (this.getRoundingRule() === 1) {
            money = money05;
          } else if (this.getRoundingRule() === 2) {
            money = money05 + 0.5;
          }
        }
        if (money == _midPoint205) {
          if (this.getRoundingRule() === 1) {
            money = money05 + 0.5;
          } else if (this.getRoundingRule() === 2) {
            money = money05 + 0.5 * 2;
          }
        }
        if (money < _midPoint105) {
          money = money05;
        } else if ((_midPoint105 < money) && (money < _midPoint205)) {
          money = money05 + 0.5;
        } else if (_midPoint205 < money) {
          money = money05 + 0.5 * 2;
        }
        return this.round(money);
      case 1:
        let money1;
          money1 = this.decimalAdjust('floor', money, 0);
        let [_midPoint11, _midPoint21] = _.map(_midPoints, (n) => {
          return this.round(n + money1);
        });
        
        if (money == _midPoint11) {
          if (this.getRoundingRule() === 1) {
            money = money1;
          } else if (this.getRoundingRule() === 2) {
            money = money1 + 1;
          }
        }
        if (money < _midPoint11) {
          money = money1;
        } else if (_midPoint11 < money) {
          money = money1 + 1;
        }
        return this.round(money);
      default:
        return this.round(money);
    }
  }
  
  getRoundingCashForAlwaysRound(money) {
    let _roundTo   = this.getRoundTo();
    let _roundingRule = this.getRoundingRule();
    let _number;
    
    switch (_roundingRule) {
      case 3:
        if (money > 0) {
          _number = Math.floor(money / _roundTo);
        } else {
          _number = Math.ceil(money / _roundTo);
        }
        return _number * _roundTo;
      case 4:
        if (money > 0) {
          _number = Math.ceil(money / _roundTo);
        } else {
          _number = Math.floor(money / _roundTo);
        }
        return _number * _roundTo;
      default:
        if (money > 0) {
          _number = Math.floor(money / _roundTo);
        } else {
          _number = Math.ceil(money / _roundTo);
        }
        return _number * _roundTo;
    }
  }
  
  round(number: number, places: number = 2): number {
    return +(Math.round(parseFloat(parseFloat(number + "") + "e+" + places)) + "e-" + places)
  }
  
  decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (value === null || isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }
  
  getRoundTo() {
    let _roundTo;
  
    switch (this.config.roundTo) {
      case '0.01_cash_denomination':
        _roundTo = 0.01;
        break;
      case '0.05_cash_denomination':
        _roundTo = 0.05;
        break;
      case '0.10_cash_denomination':
        _roundTo = 0.10;
        break;
      case '0.50_cash_denomination':
        _roundTo = 0.50;
        break;
      case '1_cash_denomination':
        _roundTo = 1;
        break;
      default:
        _roundTo = 0.01;
        break;
    }
    return _roundTo;
  }
  
  getRoundingRule() {
    switch (this.config.roundingRule) {
      case 'round_midpoint_down':
        return RoundingCash.ROUND_MIDPOINT_DOWN;
      case 'round_midpoint_up':
        return RoundingCash.ROUND_MIDPOINT_UP;
      case 'always_round_down':
        return RoundingCash.ALWAYS_ROUND_DOWN;
      case 'always_round_up':
        return RoundingCash.ALWAYS_ROUND_UP;
      default:
        return RoundingCash.ROUND_MIDPOINT_DOWN;
    }
  }
  
  getMidPoint() {
    let _midPoint = [];
    let _roundTo = this.getRoundTo();
    
    if (_roundTo) {
      _midPoint.push(_roundTo / 2);
      _midPoint.push(_.head(_midPoint) + _roundTo);
    }
    
    return _midPoint;
  }
}
