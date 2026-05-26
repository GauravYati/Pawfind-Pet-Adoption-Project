import { expect, test } from "@playwright/test";
import { PetAdoptionPage } from "../page-objects/PetAdoptionPage.js";

test.describe("Pet adoption app", () => {
  let adoptionPage;

  test.beforeEach(async ({ page }) => {
    adoptionPage = new PetAdoptionPage(page);
    await adoptionPage.openWithDemoData();
  });

  test("renders the adoption dashboard with starter pets", async () => {
    await adoptionPage.expectDashboardReady();
    await adoptionPage.expectStarterPetsVisible();
  });

  test("keeps filtered pet cards at the designed size", async () => {
    await adoptionPage.filterBySpecies("Rabbit");
    await adoptionPage.expectSingleCardForPet("Pepper");

    const { cardBox, imageBox } = await adoptionPage.getFirstCardMeasurements();
    expect(cardBox.width).toBeLessThanOrEqual(281);
    expect(cardBox.height).toBe(344);
    expect(imageBox.height).toBe(218);
  });

  test("searches pets and updates the detail panel", async () => {
    await adoptionPage.searchFor("Milo");

    await adoptionPage.expectSingleCardForPet("Milo");
    await expect(adoptionPage.detailHeading("Milo")).toBeVisible();
    await expect(adoptionPage.detailSummary("Domestic Shorthair - 2 years - Male")).toBeVisible();
  });

  test("submits an inquiry in demo fallback mode", async () => {
    await adoptionPage.selectPet("Milo");
    await adoptionPage.fillInquiry({
      petName: "Milo",
      name: "Gaurav",
      email: "gaurav@example.com",
      phone: "9999999999",
      message: "Milo seems like a calm companion."
    });
    await adoptionPage.submitInquiry();

    await expect(
      adoptionPage.statusMessage("Thanks, Gaurav. Start MongoDB and seed pets to save this inquiry.")
    ).toBeVisible();
  });
});
