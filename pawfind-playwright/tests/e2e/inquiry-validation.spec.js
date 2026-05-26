import { expect, test } from "@playwright/test";
import { PetAdoptionPage } from "../page-objects/PetAdoptionPage.js";

test.describe("Inquiry validation", () => {
  let adoptionPage;

  test.beforeEach(async ({ page }) => {
    adoptionPage = new PetAdoptionPage(page);
    await adoptionPage.openWithDemoData();
    await adoptionPage.selectPet("Milo");
  });

  test("blocks an empty inquiry form", async () => {
    await adoptionPage.submitInquiry();

    await expect(adoptionPage.nameInput).toBeFocused();
    expect(await adoptionPage.firstInvalidFieldName()).toBe("name");
    expect(await adoptionPage.fieldValidity(adoptionPage.nameInput)).toMatchObject({
      valid: false,
      valueMissing: true
    });
  });

  test("rejects incorrect name, email, and phone values", async () => {
    await adoptionPage.fillInquiry({
      petName: "Milo",
      name: "1234",
      email: "not-an-email",
      phone: "12ab",
      message: "Milo seems like a calm companion."
    });
    await adoptionPage.submitInquiry();

    expect(await adoptionPage.fieldValidity(adoptionPage.nameInput)).toMatchObject({
      valid: false,
      patternMismatch: true
    });
    expect(await adoptionPage.fieldValidity(adoptionPage.emailInput)).toMatchObject({
      valid: false,
      typeMismatch: true
    });
    expect(await adoptionPage.fieldValidity(adoptionPage.phoneInput)).toMatchObject({
      valid: false,
      patternMismatch: true
    });
  });

  test("enforces maximum input lengths", async () => {
    const longText = "a".repeat(400);

    await adoptionPage.nameInput.fill(longText);
    await adoptionPage.emailInput.fill(`${"a".repeat(100)}@example.com`);
    await adoptionPage.phoneInput.fill("123456789012345");
    await adoptionPage.messageInputForPet("Milo").fill(longText);

    await expect(adoptionPage.nameInput).toHaveValue("a".repeat(49));
    await expect(adoptionPage.emailInput).toHaveValue("a".repeat(80));
    await expect(adoptionPage.phoneInput).toHaveValue("1234567890");
    await expect(adoptionPage.messageInputForPet("Milo")).toHaveValue("a".repeat(300));

    await adoptionPage.searchFor(longText);
    await expect(adoptionPage.searchInput).toHaveValue("a".repeat(60));
  });
});
