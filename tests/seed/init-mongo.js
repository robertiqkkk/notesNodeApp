// tests/seed/init-mongo.js
db = db.getSiblingDB("test_db"); // Switch to the test database

db.createCollection("notes");

db.notes.insertMany([
	{
		content: "HTML is easy",
		important: true,
	},
	{
		content: "JS is hard",
		important: false,
	},
]);
