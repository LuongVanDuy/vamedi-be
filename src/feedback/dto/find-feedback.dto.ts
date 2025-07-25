import { Pageable, Sort } from "src/common/types";

export class FindFeedbackDto {
  search?: string;
  status?: string;
  pageable?: Pageable;
  sort?: Sort;
  contentLength?: number;
  customerId?: number;
  orderId?: string;
}
