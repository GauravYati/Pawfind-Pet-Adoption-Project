import { expect } from "@playwright/test";

export class PetAdoptionPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: "Find a companion who fits your home." });
    this.demoDataStatus = page.getByText("Demo data");
    this.petCards = page.locator(".pet-card");
    this.speciesTabs = page.locator(".species-tabs");
    this.searchInput = page.getByPlaceholder("Search by name, breed, or city");
    this.nameInput = page.getByPlaceholder("Your name");
    this.emailInput = page.getByPlaceholder("Email address");
    this.phoneInput = page.getByPlaceholder("Phone number");
    this.sendInquiryButton = page.getByRole("button", { name: "Send inquiry" });
  }

  async openWithDemoData() {
    await this.page.route("**/api/pets**", (route) => route.abort());
    await this.page.goto("/");
  }

  petCard(name) {
    return this.page.getByRole("button", { name: new RegExp(name) });
  }

  speciesButton(species) {
    return this.speciesTabs.getByRole("button", { name: species });
  }

  detailHeading(name) {
    return this.page.getByRole("heading", { name });
  }

  detailSummary(summary) {
    return this.page.getByText(summary);
  }

  messageInputForPet(name) {
    return this.page.getByPlaceholder(`Tell us why ${name} feels like a fit`);
  }

  statusMessage(message) {
    return this.page.getByText(message);
  }

  async expectDashboardReady() {
    await expect(this.heading).toBeVisible();
    await expect(this.demoDataStatus).toBeVisible();
    await expect(this.petCards).toHaveCount(6);
  }

  async expectStarterPetsVisible() {
    await expect(this.petCard("Luna")).toBeVisible();
    await expect(this.petCard("Milo")).toBeVisible();
    await expect(this.petCard("Pepper")).toBeVisible();
  }

  async filterBySpecies(species) {
    await this.speciesButton(species).click();
  }

  async searchFor(query) {
    await this.searchInput.fill(query);
  }

  async reload() {
    await this.page.reload();
  }

  async selectPet(name) {
    await this.petCard(name).click();
  }

  async expectSingleCardForPet(name) {
    await expect(this.petCards).toHaveCount(1);
    await expect(this.petCards.first()).toContainText(name);
  }

  async getFirstCardMeasurements() {
    const card = this.petCards.first();
    return {
      cardBox: await card.boundingBox(),
      imageBox: await card.locator("img").boundingBox()
    };
  }

  async fillInquiry({ petName, name, email, phone, message }) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
    await this.messageInputForPet(petName).fill(message);
  }

  async submitInquiry() {
    await this.sendInquiryButton.click();
  }

  async firstInvalidFieldName() {
    return this.page.locator("input:invalid, textarea:invalid").first().getAttribute("name");
  }

  async fieldValidity(locator) {
    return locator.evaluate((element) => ({
      valid: element.validity.valid,
      valueMissing: element.validity.valueMissing,
      patternMismatch: element.validity.patternMismatch,
      typeMismatch: element.validity.typeMismatch,
      tooShort: element.validity.tooShort,
      tooLong: element.validity.tooLong,
      valueLength: element.value.length
    }));
  }
}
