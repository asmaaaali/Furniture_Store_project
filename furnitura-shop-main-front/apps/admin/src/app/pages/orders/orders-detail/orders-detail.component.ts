import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrdersService, ORDER_STATUS } from '@furnitura/orders';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'admin-orders-detail',
  templateUrl: './orders-detail.component.html',
  styles: [
  ]
})
export class OrdersDetailComponent implements OnInit, OnDestroy {

  order: any;
  orderStatuses = [];
  selectedStatus:any;
  endsubs$: Subject<void> = new Subject();

  constructor(
    private orderService : OrdersService,
    private route : ActivatedRoute,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this._mapOrderStatus();
    this._getOrder();
  }

  ngOnDestroy(): void {
      this.endsubs$.next();
      this.endsubs$.complete();
  }

  private _getOrder()
  { 
    this.route.params.pipe(takeUntil(this.endsubs$)).subscribe(params => {
      if(params.id)
      {
        this.orderService.getOrder(params.id).pipe(takeUntil(this.endsubs$)).subscribe(responseOrder => {
          this.order = responseOrder;
          this.selectedStatus = this.order.status;
        });
      }
    });
  }

  private _mapOrderStatus()
  {
    this.orderStatuses =  Object.keys(ORDER_STATUS).map(key => {
      return {
        id: key,
        name: ORDER_STATUS[key].label
      };
    });
  }

  onStatusChange(event)
  {
    this.orderService.updateOrder({status: event.value}, this.order._id).pipe(takeUntil(this.endsubs$)).subscribe( (responseOrder) => {
      this.messageService.add({
        severity: 'success',
        summary:'Success',
        detail: `Order Status is Updated to ${ORDER_STATUS[responseOrder.status].label}`
      });
    }, () => {
      this.messageService.add({
        severity: 'failure',
        summary:'Failure',
        detail: `Order Status is not Updated`
      });
    });
  }

}
