import { expect, test } from "@playwright/test";
import { PetAdoptionPage } from "../page-objects/PetAdoptionPage.js";

test("refresh keeps the pet adoption page usable", async ({ page }) => {
  const adoptionPage = new PetAdoptionPage(page);
  await adoptionPage.openWithDemoData();
  await adoptionPage.filterBySpecies("Rabbit");
  await adoptionPage.expectSingleCardForPet("Pepper");

  await adoptionPage.reload();

  await adoptionPage.expectDashboardReady();
  await adoptionPage.expectStarterPetsVisible();
  await expect(adoptionPage.detailHeading("Luna")).toBeVisible();
});
