import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-grid-product-image',
             templateUrl: 'product-image.component.html'
           })
export class PosDefaultSalesCheckoutGridProductImageComponent implements OnInit, AfterViewInit {
  @Input('imageUrl') protected imageUrl: string;
  @ViewChild('productImgElem') protected productImgElem: ElementRef;
  protected img = new Image();
  
  ngOnInit() {
    if (!this.imageUrl) {
      this.imageUrl = "../assets/img/no-image1.png";
    }
  }
  
  addToCart(product: any) {
    console.log('not implement');
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
  
  protected onResize() {
    const imgw = this.img.width;
    const imgh = this.img.height;
    this.resizeMyImg(imgw, imgh);
  }
  
  protected resizeMyImg(w, h) {
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
