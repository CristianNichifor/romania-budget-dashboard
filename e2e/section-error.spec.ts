import { expect, test } from "@playwright/test";

/**
 * Runs against the `remote` project: the app calls a BFF host that only
 * exists through `page.route`, so every answer here is deterministic.
 */
const BFF = "http://bff.e2e.invalid";

const inflation = {
  targetPercent: 2.5,
  monthly: [
    { ym: "2026-07", annualRate: 7.8 },
    { ym: "2026-08", annualRate: 7.4 },
  ],
  sourceUpdated: "2026-09-30",
};

test("a failed section shows an error card and recovers on retry", async ({
  page,
}) => {
  let inflationHealthy = false;
  await page.route(`${BFF}/**`, async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname === "/api/macro/inflation" && inflationHealthy) {
      await route.fulfill({ json: inflation });
      return;
    }
    await route.fulfill({ status: 500, body: "upstream down" });
  });

  await page.goto("/ro/economie/");

  const inflationError = page
    .getByRole("alert")
    .filter({ hasText: "Inflația anuală" });
  await expect(inflationError).toBeVisible({ timeout: 15_000 });
  await expect(inflationError).toContainText(
    "Datele nu au putut fi încărcate."
  );
  await expect(page.getByText("Ceva nu a mers bine")).toHaveCount(0);

  inflationHealthy = true;
  await inflationError.getByRole("button", { name: "Reîncearcă" }).click();

  await expect(inflationError).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Inflația anuală" })
  ).toBeVisible();
});

test("budget sections show errors, not the demo seed, when the BFF fails", async ({
  page,
}) => {
  await page.route(`${BFF}/**`, (route) =>
    route.fulfill({ status: 500, body: "upstream down" })
  );

  await page.goto("/ro/bilantul-national/");

  await expect(page.getByRole("alert").first()).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByText("date demo", { exact: true })).toHaveCount(0);
});
