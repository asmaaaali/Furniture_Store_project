import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ui-banner',
  templateUrl: './banner.component.html'
})
export class BannerComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  seeMore()
  {
    this.router.navigate(['/products']);
  }

}
