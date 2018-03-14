import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {AbstractSubscriptionComponent} from "../../../../../../../code/AbstractSubscriptionComponent";
import {TutorialService} from "../../../../../modules/+tutorial/tutorial.service";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-grid-product-image',
             templateUrl: 'product-image.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush,
           })
export class PosDefaultSalesCheckoutGridProductImageComponent extends AbstractSubscriptionComponent implements OnInit, AfterViewInit {
  @Input('imageUrl') protected imageUrl: string;
  @ViewChild('productImgElem') protected productImgElem: ElementRef;
  protected img          = new Image();
  private _resizeSubject = new Subject();
  
  constructor(private tourService: TutorialService) {
    super();
  }
  
  get resizeSubject(): Observable<any> {
    return this._resizeSubject.asObservable().share();
  }
  
  ngOnInit() {
    this.tourService.enableNextButton();
    if (!this.imageUrl) {
      this.imageUrl = "../assets/img/no-image1.png";
    }
    
    this.subscribeObservable('handle_resize', () => this._resizeSubject.debounceTime(250).subscribe(() => {
      if (!!this.img) {
        this.resizeMyImg(this.img.width, this.img.height);
      }
    }));
  }
  
  ngAfterViewInit(): void {
    if (!!this.imageUrl) {
      const div       = jQuery(this.productImgElem.nativeElement);
      this.img.onload = () => {
        const imgw = this.img.width;
        const imgh = this.img.height;
        
        // after its loaded and you got the size..
        // you need to call it the first time of course here and make it visible:
        
        this.resizeMyImg(imgw, imgh);
        div.find('img').show();
      };
      this.img.src    = this.imageUrl;
    }
  }
  
  onResize() {
    this._resizeSubject.next();
  }
  
  private resizeMyImg(w, h) {
    const div = jQuery(this.productImgElem.nativeElement);
    // the width is larger
    if (w > h) {
      // resize the image to the div
      div.find('img').width(div.innerWidth() + 'px').height('auto');
    } else {
      // the height is larger or the same
      // resize the image to the div
      div.find('img').height(div.innerHeight() + 'px').width('auto');
    }
    
  }
}
