import { expect, test } from "@playwright/test";

const TABS = [
  "/ro/felia-ta/",
  "/ro/bilantul-national/",
  "/ro/companii-de-stat/",
  "/ro/economie/",
  "/ro/societate/",
  "/ro/energie/",
  "/ro/piata-muncii/",
  "/ro/justitie/",
];

test("every tab renders without crashing", async ({ page }) => {
  for (const path of TABS) {
    await page.goto(path);
    await expect(page).toHaveTitle(/Bugetul României/);
    await expect(page.getByText("Ceva nu a mers bine")).toHaveCount(0);
    await expect(page.locator("h2").first()).toBeVisible();
  }
});

test("new Eurostat tabs render their headings without a backend", async ({
  page,
}) => {
  await page.goto("/ro/piata-muncii/");
  await expect(page.getByText("Piața muncii").first()).toBeVisible();

  await page.goto("/ro/justitie/");
  await expect(page.getByText("Justiția în cifre").first()).toBeVisible();
});

test("salary tab renders the waterfall and KPIs from static data", async ({
  page,
}) => {
  await page.goto("/ro/felia-ta/");
  await expect(page.getByText("Situația ta fiscală")).toBeVisible();
  await expect(page.getByText("Salariu brut (lei/lună)")).toBeVisible();
  await expect(page.locator("svg.recharts-surface").first()).toBeVisible();
});

test("the salary waterfall labels every bar with its category and value", async ({
  page,
}) => {
  await page.goto("/ro/felia-ta/");
  const chart = page.getByTestId("salary-waterfall");
  for (const label of [
    "CAS — pensii (25%)",
    "Impozit pe venit (10%)",
    "Net salariat",
  ]) {
    await expect(chart.locator("svg").getByText(label)).toBeVisible();
  }
  await expect(chart.locator(".recharts-label-list text")).toHaveCount(7);
  await expect(page.getByText(/lei \/ lună/)).toHaveCount(1);
});

test("locale switcher links to the English counterpart route", async ({
  page,
}) => {
  await page.goto("/ro/felia-ta/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ro");
  await page.getByRole("link", { name: "EN", exact: true }).click();
  await expect(page).toHaveURL(/\/your-share\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByText("Your fiscal situation")).toBeVisible();
});

test("the root defaults to Romanian; English stays at its own paths", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/ro\/felia-ta\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ro");

  await page.goto("/your-share/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");

  await page.goto("/ro/");
  await expect(page).toHaveURL(/\/ro\/felia-ta\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ro");
});

test("each route links its canonical and hreflang pair", async ({ page }) => {
  const origin = "https://budget.cristian-nichifor.com";
  await page.goto("/ro/energie/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${origin}/ro/energie/`
  );
  await expect(
    page.locator('link[rel="alternate"][hreflang="en"]')
  ).toHaveAttribute("href", `${origin}/energy/`);
  await expect(
    page.locator('link[rel="alternate"][hreflang="x-default"]')
  ).toHaveAttribute("href", `${origin}/ro/energie/`);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
});

test("sections built from the bundled seed are labelled demo data", async ({
  page,
}) => {
  await page.goto("/ro/bilantul-national/");
  await expect(
    page.getByText("date demo", { exact: true }).first()
  ).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
});

test("every page links to the about page from its footer", async ({ page }) => {
  for (const path of TABS) {
    await page.goto(path);
    await expect(
      page.getByRole("contentinfo").getByRole("link", { name: "Despre" })
    ).toHaveAttribute("href", "/ro/despre/");
  }
  await page.goto("/energy/");
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "About" })
    .click();
  await expect(page).toHaveURL(/\/about\/$/);
});

test("the about page names sources, licences and the no-tracking policy", async ({
  page,
}) => {
  await page.goto("/ro/despre/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ro");
  await expect(
    page.getByRole("heading", { level: 2, name: "Despre" })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Eurostat" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "CC BY 4.0" }).first()
  ).toBeVisible();
  await expect(page.getByText("nu folosește cookie-uri")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /GitHub/ }).first()
  ).toHaveAttribute(
    "href",
    "https://github.com/CristianNichifor/romania-budget-dashboard/issues"
  );

  await page.goto("/about/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByText("does not use cookies")).toBeVisible();
});
