import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrdersService } from '@furnitura/orders';
import { ProductsService } from '@furnitura/products';
import { UsersService } from '@furnitura/users';
import { combineLatest, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  statistics = [];
  endsubs$: Subject<void> = new Subject();

  constructor(
    private userService: UsersService,
    private productService: ProductsService,
    private orderService: OrdersService
  ) { }

  ngOnInit(): void {
    combineLatest([
      this.orderService.getOrdersCount(),
      this.productService.getProductsCount(),
      this.userService.getUsersCount(),
      this.orderService.getTotalSales(),
    ]).pipe(takeUntil(this.endsubs$))
      .subscribe( (values) => {
        this.statistics = values;
      });

    // this._getStatistics();
  }

  ngOnDestroy(): void {
      this.endsubs$.next();
      this.endsubs$.complete();
  }

  private _getStatistics()
  {
    this.orderService.getOrdersCount().pipe(takeUntil(this.endsubs$)).subscribe( (resOrdCount) => {
      this.statistics[0] = resOrdCount;
    });

    this.productService.getProductsCount().pipe(takeUntil(this.endsubs$)).subscribe( (resProdCount) => {
      this.statistics[1] = resProdCount;
    });

    this.userService.getUsersCount().pipe(takeUntil(this.endsubs$)).subscribe( (resUsrCount) => {
      this.statistics[2] = resUsrCount;
    });

    this.orderService.getTotalSales().pipe(takeUntil(this.endsubs$)).subscribe( (resOrdTotalSales) => {
      this.statistics[3] = resOrdTotalSales;
    });
  }

}
