import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrdersService, ORDER_STATUS } from '@furnitura/orders';
import {MessageService, ConfirmationService} from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'admin-orders-list',
  templateUrl: './orders-list.component.html',
  styles: [
  ]
})
export class OrdersListComponent implements OnInit, OnDestroy {

  orders: Order[] = [];
  endsubs$: Subject<void> = new Subject();
  
  orderStatus = ORDER_STATUS;

  constructor(
    private ordersService : OrdersService,
    private confirmationService : ConfirmationService,
    private messageService : MessageService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this._getOrders();
  }

  ngOnDestroy(): void {
      this.endsubs$.next();
      this.endsubs$.complete();
  }

  private _getOrders()
  {
    this.ordersService.getOrders().pipe(takeUntil(this.endsubs$)).subscribe( response => {
      this.orders = response;
    });
  }

  showOrder(orderID)
  {
    this.router.navigateByUrl(`orders/${orderID}`);
  }

  confirmDelete(event: Event,orderID:string) {
    this.confirmationService.confirm({
        target: event.target,
        message: 'Are you sure that you want to delete this Order?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._acceptDeleteBehavior(orderID);
        }
    });
  }

  private _acceptDeleteBehavior(orderID:string)
  {
    this.ordersService.deleteOrder(orderID).pipe(takeUntil(this.endsubs$)).subscribe( () => {
      this._getOrders();
      this.messageService.add({
        severity:'success', 
        summary:'Success', 
        detail:'Order Is Deleted'
      });
      }, 
      () => {
        this.messageService.add({
          severity:'error', 
          summary:'Fail', 
          detail:'Order Is not Deleted'
        });
      });
  }

}
