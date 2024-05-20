import { Poppins, Source_Serif_4 } from "next/font/google";

export const poppins = Poppins({
  weight: ["300", "400", "500"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});
export const serif = Source_Serif_4({
  weight: ["200", "400"],
  subsets: [
    "cyrillic",
    "cyrillic-ext",
    "greek",
    "latin",
    "latin-ext",
    "vietnamese",
  ],
  display: "swap",
});
