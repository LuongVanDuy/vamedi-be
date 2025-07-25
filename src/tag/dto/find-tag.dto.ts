import { Pageable, Sort } from "src/common/types";

export class FindTagDto {
  search?: string;
  status?: number;
  pageable?: Pageable;
  sort?: Sort;
}
