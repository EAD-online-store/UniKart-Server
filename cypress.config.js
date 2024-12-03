import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    MAILISK_API_KEY: "RywhjeUFgB9t_2qMsyG49zNhyt8dsvm8tlepNZ0fpRQ",
    MAILISK_NAMESPACE: "0l4n1hnojfpw", // we're also adding this
  },
});
