import { expect, test } from "@playwright/test";

test("Your share splits the state's cut by budget destination, as an estimate", async ({
  page,
}) => {
  await page.goto("/your-share/");
  const section = page.getByRole("region", {
    name: "What 1 leu of your taxes buys",
  });
  await expect(section).toBeVisible();
  await expect(section.getByText("Estimate", { exact: true })).toBeVisible();
  await expect(section.getByText(/taxes are not earmarked/)).toBeVisible();
  const rows = section.getByTestId("leu-bridge").locator("tbody tr");
  await expect(rows.first()).toBeVisible();
  expect(await rows.count()).toBeGreaterThan(3);
  await expect(rows.first()).toContainText("Pensii");
  await expect(rows.first()).toContainText(/bani/);
});

test("the Romanian page labels it an estimate too", async ({ page }) => {
  await page.goto("/ro/felia-ta/");
  const section = page.getByRole("region", {
    name: "Ce cumpără 1 leu din taxele tale",
  });
  await expect(section.getByText("Estimare", { exact: true })).toBeVisible();
});

test("the leu band writes whole bani on every segment, 100 in all", async ({
  page,
}) => {
  await page.goto("/your-share/");
  const segments = page.getByTestId("leu-band").locator("span");
  await expect(segments.first()).toHaveText(/^\d+$/);
  const values = (await segments.allTextContents()).map(Number);
  expect(values.length).toBeGreaterThan(3);
  expect(values.reduce((a, b) => a + b, 0)).toBe(100);
});
