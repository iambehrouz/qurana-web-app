import fr from "./fr.json";
import en from "./en.json";

export const getPhrases = (code = "fr") => {
  if (code == "fr") return fr;
  else if (code == "en") return en;
};