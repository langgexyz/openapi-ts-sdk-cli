// API 客户端主入口文件

export * from './src/types';

export { Admindashboard } from './src/admindashboard';
export { Analyticshandler } from './src/analyticshandler';
export { Api } from './src/api';
export { Internalgateway } from './src/internalgateway';
export { Order } from './src/order';
export { Productservice } from './src/productservice';
export { Publicendpoint } from './src/publicendpoint';
export { Status } from './src/status';
export { User } from './src/user';
export { Warehousemanager } from './src/warehousemanager';


import { HttpBuilder } from 'openapi-ts-sdk';
import { Admindashboard } from './src/admindashboard';
import { Analyticshandler } from './src/analyticshandler';
import { Api } from './src/api';
import { Internalgateway } from './src/internalgateway';
import { Order } from './src/order';
import { Productservice } from './src/productservice';
import { Publicendpoint } from './src/publicendpoint';
import { Status } from './src/status';
import { User } from './src/user';
import { Warehousemanager } from './src/warehousemanager';

export class Client {
  public readonly admindashboard: Admindashboard.Client;
  public readonly analyticshandler: Analyticshandler.Client;
  public readonly api: Api.Client;
  public readonly internalgateway: Internalgateway.Client;
  public readonly order: Order.Client;
  public readonly productservice: Productservice.Client;
  public readonly publicendpoint: Publicendpoint.Client;
  public readonly status: Status.Client;
  public readonly user: User.Client;
  public readonly warehousemanager: Warehousemanager.Client;


  constructor(httpBuilder: HttpBuilder) {
    this.admindashboard = new Admindashboard.Client(httpBuilder);
    this.analyticshandler = new Analyticshandler.Client(httpBuilder);
    this.api = new Api.Client(httpBuilder);
    this.internalgateway = new Internalgateway.Client(httpBuilder);
    this.order = new Order.Client(httpBuilder);
    this.productservice = new Productservice.Client(httpBuilder);
    this.publicendpoint = new Publicendpoint.Client(httpBuilder);
    this.status = new Status.Client(httpBuilder);
    this.user = new User.Client(httpBuilder);
    this.warehousemanager = new Warehousemanager.Client(httpBuilder);
  }
}
