const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");

beforeAll(async () => {});

afterEach(async () => {});

afterAll(async () => {
	await mongoose.connection.close();
});

describe("GET /notes", () => {
	it("should return the blogs from the Docker snapshot", async () => {
		const response = await request(app).get("/api/notes");

		expect(response.statusCode).toBe(200);
		expect(response.body.length).toBeGreaterThan(0);
		expect(response.body[0].content).toBe("HTML is easy");
	});
});
