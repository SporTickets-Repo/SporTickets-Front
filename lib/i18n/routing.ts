import { defineRouting } from "next-intl/routing";

const routing = defineRouting({
  locales: ["en", "pt"],
  defaultLocale: "pt",
});

export default routing;
