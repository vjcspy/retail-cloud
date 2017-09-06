import {Injectable} from '@angular/core';
import {AbstractCollection} from "../../code/meteor/AbstractCollection";

@Injectable()
export class RealtimeStorage extends AbstractCollection {
  $collection: string = "client_storages";
  
}
