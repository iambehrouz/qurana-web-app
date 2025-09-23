import ar from "./ar.json";
import en from "./en.json";

export const getPhrases = (code = "en") => {
  if (code == "en") return en;
  else if (code == "ar") return ar;
};