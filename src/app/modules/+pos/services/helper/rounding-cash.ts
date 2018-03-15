import * as _ from 'lodash';

export class RoundingCash {
  config = {
    roundTo: '0.01_cash_denomination',
    roundingRule: 'round_midpoint_down'
  };
  constructor() { }
  
  getRoundingCash(money) {
    let [_midPoint1, _midPoint2] = this.getMidPoint();
    
  }
  
  getMidPoint() {
    let _midPoint = [];
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
    
    if (_roundTo) {
      _midPoint.push(_roundTo / 2);
      _midPoint.push(_.head(_midPoint) + _roundTo);
    }
    
    return _midPoint;
  }
}
