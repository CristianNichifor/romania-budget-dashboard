import { expect, test } from "@playwright/test";

test("the sankey groups small flows behind a drill-down", async ({ page }) => {
  await page.goto("/ro/bilantul-national/");
  const details = page.getByTestId("sankey-rest-details");
  await expect(details).toBeVisible();
  await expect(details.locator("summary")).toContainText("Alte destinații");
  await details.locator("summary").click();
  await expect(details.locator("li").first()).toBeVisible();
  await expect(details.locator("li").first()).toContainText(/mld\. lei/);
});

test("sankey destination nodes carry their amount in the label", async ({
  page,
}) => {
  await page.goto("/ro/bilantul-national/");
  const sankey = page.getByRole("img", { name: "Fluxul banilor publici" });
  await expect(sankey).toBeVisible();
  await expect(
    sankey
      .locator("text")
      .filter({ hasText: /·.*mld\. lei/ })
      .first()
  ).toBeVisible();
});
