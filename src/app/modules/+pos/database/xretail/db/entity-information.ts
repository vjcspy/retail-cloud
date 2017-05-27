import {Timezone} from "../../../core/framework/General/DateTime/Timezone";

export class EntityInformation {
    id: string;
    storeId: number;
    currentPage: number;
    pageSize: number;
    isFinished: boolean;
    cache_time: number;
    base_url: string;
    createdAt: string;
    updatedAt: string;

    static getFields(): string {
        return "id,storeId,currentPage,pageSize,isFinished,base_url,createdAt,updatedAt";
    }

    async save(createNew: boolean = false) {
        await  window['retailDB'].transaction(
          'rw', window['retailDB'].entityInformation, async () => {
            this.updatedAt = Timezone.getCurrentStringTime();
            if (createNew) {
              this.createdAt = Timezone.getCurrentStringTime();
            }
            this.id = await  window['retailDB'].entityInformation.put(this);
          });
        return this;
    }
}
