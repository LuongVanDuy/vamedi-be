import { Pageable, Sort } from "src/common/types";

export class FindOrderDto {
  search?: string;
  status?: string;
  pageable?: Pageable;
  sort?: Sort;
  contentLength?: number;
  customerId?: number;
}
