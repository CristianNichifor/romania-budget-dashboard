import { expect, test } from "@playwright/test";

const SANKEY_NAME = "Fluxul banilor publici";

test("the sankey draws at most eight destination flows and groups the rest", async ({
  page,
}) => {
  await page.goto("/ro/bilantul-national/");
  const sankey = page.getByRole("img", { name: SANKEY_NAME });
  await expect(sankey).toBeVisible();

  // Node labels carry "· <amount>"; sources and the budget node do not.
  const labelled = sankey.locator("text").filter({ hasText: /·.*mld\. lei/ });
  const count = await labelled.count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThanOrEqual(9); // eight destinations + the rest node

  // The drill-down exists exactly when flows were grouped (live data has a
  // rest bucket; the bundled seed lists six destinations and none).
  const details = page.getByTestId("sankey-rest-details");
  if ((await details.count()) > 0) {
    await expect(details.locator("summary")).toContainText("Alte destinații");
    await details.locator("summary").click();
    await expect(details.locator("li").first()).toContainText(/mld\. lei/);
  } else {
    await expect(
      sankey.locator("text", { hasText: "Alte destinații" })
    ).toHaveCount(0);
  }
});
