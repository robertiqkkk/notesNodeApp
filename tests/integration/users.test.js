const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");

beforeAll(async () => {});

afterEach(async () => {});

afterAll(async () => {
	await mongoose.connection.close();
});

describe("Test user creation and get", () => {
	it("should create a User", async () => {
		const newUser = {
			username: "mluukkai",
			name: "Matti Luukkainen",
			password: "salainen",
		};

		await request(app)
			.post("/api/users")
			.send(newUser)
			.expect(201)
			.expect("Content-Type", /application\/json/);
	}, 300000);

	it("should get a User", async () => {
		const response = await request(app).get("/api/users");

		expect(response.statusCode).toBe(200);
		expect(response.body.length).toBeGreaterThan(0);
		expect(response.body[0].username).toBe("mluukkai");
	}, 300000);

	it("should create a User", async () => {
		const newUser = {
			username: "mluukkai",
			name: "Matti Luukkainen",
			password: "salainen",
		};

		const response = await request(app)
			.post("/api/users")
			.send(newUser)
			.expect(400)
			.expect("Content-Type", /application\/json/);

		expect(response.body.error).toBe("Username has to be unique");
	}, 300000);
});
