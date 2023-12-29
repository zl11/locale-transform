import { v4 as uuid } from "uuid";

export function getSingleKey() {
  return uuid().split("-")[0];
}
