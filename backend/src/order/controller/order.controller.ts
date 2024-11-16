import { Body, Controller, Post } from '@nestjs/common';
import { CreateOrderDTO } from '../dto/order.dto';
import { OrderService } from '../service/order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Body() createOrderDTO: CreateOrderDTO) {
    return this.orderService.createOrder(createOrderDTO);
  }
}
