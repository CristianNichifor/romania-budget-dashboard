import { expect, test } from "@playwright/test";

test("English pages format amounts in English", async ({ page }) => {
  await page.goto("/national-balance/");
  await expect(page.getByText(/\d\.\d bn lei/).first()).toBeVisible();
  await expect(page.getByText(/mld\. lei/)).toHaveCount(0);

  await page.goto("/your-share/");
  await expect(page.getByText(/\d,\d{3} lei/).first()).toBeVisible();
});

test("Romanian pages format amounts in Romanian", async ({ page }) => {
  await page.goto("/ro/bilantul-national/");
  await expect(page.getByText(/\d,\d mld\. lei/).first()).toBeVisible();
  await expect(page.getByText(/bn lei/)).toHaveCount(0);

  await page.goto("/ro/felia-ta/");
  await expect(page.getByText(/\d\.\d{3} lei/).first()).toBeVisible();
});
