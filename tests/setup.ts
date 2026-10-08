import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { activateLocale } from "../src/i18n-core";

// Component tests assert the Romanian source copy; jsdom's path is "/"
// (English), so pin the locale the way a `/ro/` path would.
activateLocale("ro");

afterEach(() => {
  cleanup();
});
