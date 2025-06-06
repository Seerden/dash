import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import localeData from "dayjs/plugin/localeData";
import relativeTime from "dayjs/plugin/relativeTime";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(tz);
dayjs.extend(utc);
dayjs.extend(localeData);
dayjs.extend(customParseFormat);

const day = dayjs;

export default day;
