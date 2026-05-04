import { test, expect } from "@playwright/test";

const ADMIN_USER = process.env.ADMIN_USER ?? "seb";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

test.describe("admin publish round-trip", () => {
  test("availability change reflects on public", async ({ page, request }) => {
    test.skip(!ADMIN_PASSWORD, "ADMIN_PASSWORD not set");
    const headers = { Authorization: "Basic " + Buffer.from(`${ADMIN_USER}:${ADMIN_PASSWORD}`).toString("base64") };
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

    const r1 = await request.post("/api/admin/availability", { headers: { ...headers, "content-type": "application/json" }, data: { date: tomorrow, status: "blocked" }});
    expect(r1.ok()).toBe(true);

    await page.goto("/");
    await page.locator("#availability").scrollIntoViewIfNeeded();
    await expect(page.locator(`[data-date="${tomorrow}"]`)).toContainText(/blocked/i);
  });
});
