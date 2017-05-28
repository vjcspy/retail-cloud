export interface Entity {
  items: any[];
  pageSize: number;
  entityCode: string;
  apiUrlCode: string;
  entityPrimaryKey?: string;
  isLoading: boolean;
  isLoadComplete: boolean;
}
