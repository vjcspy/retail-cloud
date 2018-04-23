import {Timezone} from "../../../core/framework/General/DateTime/Timezone";

export class EntityInformation {
  id: string;
  storeId: number;
  warehouseId?: number;
  currentPage: number;
  pageSize: number;
  isFinished: boolean;
  cache_time: number;
  base_url: string;
  additionData: Object;
  createdAt: string;
  updatedAt: string;

  static getFields(): string {
    return "id,storeId,warehouseId,currentPage,pageSize,isFinished,base_url,additionData,createdAt,updatedAt";
  }

  async save(createNew: boolean = false) {
    this.updatedAt = Timezone.getCurrentStringTime();
    if (createNew) {
      this.createdAt = Timezone.getCurrentStringTime();
    }
    this.id = await window['retailDB'].entityInformation.put(this);

    return this;
  }
}
