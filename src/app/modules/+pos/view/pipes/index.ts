import {PriceFormatPipe} from "./price-format";
import {DateTimeFormatPipe} from "./datetime-format";
import {QtyFormatPipe} from "./qty-format";

export const POS_PIPES = [
  PriceFormatPipe,
  DateTimeFormatPipe,
  QtyFormatPipe
];
