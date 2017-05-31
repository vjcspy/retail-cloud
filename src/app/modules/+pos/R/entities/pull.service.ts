import {Injectable} from '@angular/core';
import {ProgressBarService} from "../../../share/provider/progess-bar";

@Injectable()
export class PosPullService {
  
  constructor(protected progressBar: ProgressBarService) { }
}
