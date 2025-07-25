import { Pageable, Sort } from "src/common/types";

export class FindFileDto {
  search?: string;
  pageable?: Pageable;
  sort?: Sort;
}
