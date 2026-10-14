import { expect, test } from "@playwright/test";

const ORIGIN = "https://budget.cristian-nichifor.com";

test.describe("static head without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("a Romanian route ships its own lang, canonical and meta", async ({
    page,
  }) => {
    await page.goto("/ro/energie/");
    await expect(page.locator("html")).toHaveAttribute("lang", "ro");
    await expect(page).toHaveTitle("Energie — Bugetul României");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${ORIGIN}/ro/energie/`
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /Eurostat/
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      `${ORIGIN}/og-image.png`
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image"
    );
  });

  test("an English route ships lang en", async ({ page }) => {
    await page.goto("/justice/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveTitle("Justice in numbers — Romania's Budget");
  });
});

test("client-side navigation keeps title and description current", async ({
  page,
}) => {
  await page.goto("/ro/felia-ta/");
  await page.getByRole("link", { name: "Economie" }).click();
  await expect(page).toHaveURL(/\/ro\/economie\/$/);
  await expect(page).toHaveTitle("Economie — Bugetul României");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /Inflație/
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
});

test("robots.txt and sitemap.xml are real files", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.headers()["content-type"]).toContain("text/plain");
  expect(await robots.text()).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.headers()["content-type"]).toContain("xml");
  expect(await sitemap.text()).toContain(`<loc>${ORIGIN}/ro/energie/</loc>`);
});
