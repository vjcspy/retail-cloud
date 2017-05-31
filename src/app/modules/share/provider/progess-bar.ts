import {Injectable} from '@angular/core';
import * as NProgress from "nprogress";

@Injectable()
export class ProgressBarService {
  start(): void {
    NProgress.start();
  }
  
  done(force: boolean = false): void {
    NProgress.done(force);
  }
  
  remove(): void {
    NProgress.remove();
  }
  
  randomIncrements(): void {
    NProgress.inc();
  }
  
  set(percent: number): void {
    NProgress.set(percent / 100);
  }
}
