import { expect, test } from "@playwright/test";

test("the lei/€ toggle converts the wage charts and follows the tabs", async ({
  page,
}) => {
  await page.goto("/ro/felia-ta/");
  const waterfall = page.getByTestId("salary-waterfall");
  await expect(waterfall).toHaveAttribute("data-currency", "lei");
  await expect(waterfall).toContainText("lei");

  const toggle = page.getByRole("group", { name: "Monedă" });
  await toggle.getByRole("button", { name: "€" }).click();
  await expect(page).toHaveURL(/[?&]currency=eur/);
  await expect(toggle.getByRole("button", { name: "€" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await expect(waterfall).toHaveAttribute("data-currency", "eur");
  await expect(waterfall).toContainText("€");
  await expect(page.getByTestId("rate-note").first()).toContainText("5,0424");

  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Piața muncii" })
    .click();
  await expect(page).toHaveURL(/\/ro\/piata-muncii\/\?currency=eur/);
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Feliuța ta", exact: true })
    .click();
  await expect(page).toHaveURL(/\/ro\/felia-ta\/\?currency=eur/);
  await expect(page.getByTestId("salary-waterfall")).toHaveAttribute(
    "data-currency",
    "eur"
  );

  await page
    .getByRole("group", { name: "Monedă" })
    .getByRole("button", { name: "lei" })
    .click();
  await expect(page).not.toHaveURL(/currency=/);
});

test("the language switch keeps the currency", async ({ page }) => {
  await page.goto("/ro/felia-ta/?currency=eur");
  await page.getByRole("link", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL(/currency=eur/);
  await expect(
    page
      .getByRole("group", { name: "Currency" })
      .getByRole("button", { name: "€" })
  ).toHaveAttribute("aria-pressed", "true");
});

test("social context shows two labelled small multiples, no dual axis", async ({
  page,
}) => {
  await page.goto("/ro/bilantul-national/");
  const multiples = page.getByTestId("social-multiples");
  await expect(multiples).toBeVisible();
  await expect(multiples.getByRole("figure")).toHaveCount(2);
  await expect(multiples.getByRole("figure").first()).toContainText(
    "miliarde EUR"
  );
  await expect(multiples.locator(".recharts-yAxis")).toHaveCount(2);
  await expect(multiples.locator(".recharts-label")).toHaveCount(2);
});
