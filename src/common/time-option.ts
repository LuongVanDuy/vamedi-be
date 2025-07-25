import { ApiProperty } from "@nestjs/swagger";
import * as moment from "moment";

export class TimeOption {
  @ApiProperty()
  startDate: string;

  @ApiProperty()
  endDate: string;
}

export type DateRange = {
  from: Date;
  to: Date;
};

export function getDateRange(timeOption: TimeOption): DateRange {
  return {
    from: moment(timeOption.startDate).toDate(),
    to: moment(timeOption.endDate).toDate(),
  };
}
