import { expect, test } from "@playwright/test";

const apiUrl = "http://127.0.0.1:5000";

test.describe("Pet adoption API", () => {
  test("health endpoint responds", async ({ request }) => {
    const response = await request.get(`${apiUrl}/api/health`);
    const body = await response.json();

    expect(response.ok()).toBe(true);
    expect(body).toMatchObject({
      status: "ok",
      service: "pawfind-api"
    });
    expect(["connected", "disconnected"]).toContain(body.database);
  });

  test("rejects empty inquiry payloads", async ({ request }) => {
    const response = await request.post(`${apiUrl}/api/inquiries`, { data: {} });
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.message).toBe("All fields are required");
  });

  test("rejects malformed inquiry values before database lookup", async ({ request }) => {
    const response = await request.post(`${apiUrl}/api/inquiries`, {
      data: {
        pet: "not-a-valid-id",
        name: "1234",
        email: "bad-email",
        phone: "phone",
        message: "short"
      }
    });
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.message).toBe("A valid pet id is required");
  });

  test("rejects invalid email when payload has a valid object id", async ({ request }) => {
    const response = await request.post(`${apiUrl}/api/inquiries`, {
      data: {
        pet: "665000000000000000000001",
        name: "Gaurav",
        email: "bad-email",
        phone: "9999999999",
        message: "I would like to adopt this pet."
      }
    });
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.message).toBe("Enter a valid email address");
  });
});
