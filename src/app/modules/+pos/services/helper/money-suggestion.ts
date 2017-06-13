export class MoneySuggestionService {
  config = {
    needNumberOfSuggestion: 3,
    multiple: 1
  };
  
  constructor() { }
  
  getSuggestion(money: number) {
    if (money < 0)
      return [];
    let _s = [];
    let _next;
    if (money < 1) {
      _s.push(money);
      _next = 1;
      _s.push(_next);
      for (let i = 1; i < this.config.needNumberOfSuggestion - 1; i++) {
        _next = this.getNextNumber(_next);
        _s.push(_next);
      }
    } else {
      let _beaty = Math.ceil(money);
      if (_beaty == money) {
      } else {
        _s.push(money);
      }
      _next = _beaty;
      _s.push(_next);
      for (let i = 1; i < this.config.needNumberOfSuggestion - 1; i++) {
        _next = this.getNextNumber(_next);
        _s.push(_next);
      }
    }
    return _s;
  }
  
  getNextNumber(number: number) {
    let [_number, _mul] = this.getMultiple(number);
    let _next;
    let _d              = 0;
    if (_number > 10) {
      _d      = Math.floor(_number / 10);
      _number = parseInt(<any>(_number - _d * 10));
    }
    switch (_number) {
      case 1:
      case 6:
        _next = Math.floor(_number / 5) * 5 + 2;
        break;
      case 2:
      case 4:
      case 7:
      case 9:
        _next = Math.floor(_number / 5) * 5 + 5;
        break;
      case 5:
        if (_mul == 0)
          _next = 6;
        else
          _next = 10;
        break;
      case 3:
      case 8:
        _next = Math.floor(_number / 5) * 5 + 4;
        break;
    }
    return Math.pow(10, _mul) * (_next + _d * 10);
  }
  
  getMultiple(number: number, mul = 0) {
    if (number % 10 == 0) {
      ++mul;
      number        = number / 10;
      [number, mul] = this.getMultiple(number, mul);
    }
    return [number, mul];
  }
}
