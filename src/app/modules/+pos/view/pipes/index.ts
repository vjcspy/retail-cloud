import {PriceFormatPipe} from "./price-format";
import {DateTimeFormatPipe} from "./datetime-format";
import {QtyFormatPipe} from "./qty-format";
import {PriceOrderDetailFormatPipe} from "./price-order-detail-format";

export const POS_PIPES = [
  PriceFormatPipe,
  PriceOrderDetailFormatPipe,
  DateTimeFormatPipe,
  QtyFormatPipe
];
