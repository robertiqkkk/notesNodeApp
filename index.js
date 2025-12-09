const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :body"
	)
);
app.use(express.json());
app.use(cors({origin: "http://localhost:5173"}));

let notes = [
	{
		id: "1",
		content: "HTML is easy",
		important: true,
	},
	{
		id: "2",
		content: "Browser can execute only JavaScript",
		important: false,
	},
	{
		id: "3",
		content: "GET and POST are the most important methods of HTTP protocol",
		important: true,
	},
];

let persons = [
	{
		id: "1",
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: "2",
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: "3",
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: "4",
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

const generateId = (nodes, key) => {
	const maxId =
		nodes.length > 0 ? Math.max(...nodes.map((n) => Number(n[key]))) : 0;
	return String(maxId + 1);
};

const checkValueUniqueness = (nodes, key, value) => {
	return nodes.every((node) => node[key] !== value);
};

app.get("/", (request, response) => {
	response.send("<h1>Hello World!!</h1>");
});

// START OF Notes API

app.get("/api/notes", (request, response) => {
	response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
	const id = request.params.id;
	const note = notes.find((note) => note.id === id);

	if (note) {
		response.json(note);
	} else {
		response.status(404).end();
	}
});

app.delete("/api/notes/:id", (request, response) => {
	const id = request.params.id;
	notes = notes.filter((note) => note.id !== id);

	response.status(204).end();
});

app.post("/api/notes", (request, response) => {
	const body = request.body;

	if (!body.content) {
		return response.status(400).json({
			error: "content missing",
		});
	}

	const note = {
		id: generateId(notes, "id"),
		content: body.content,
		important: body.important || false,
	};

	notes = notes.concat(note);

	response.json(note);
});

// END OF Notes API

// START OF Persons API

app.get("/info", (request, response) => {
	response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
    `);
});

app.get("/api/persons", (request, response) => {
	response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	const person = persons.find((person) => person.id === id);

	if (person) {
		response.json(person);
	} else {
		response.status(404).end();
	}
});

app.delete("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	persons = persons.filter((person) => person.id !== id);

	response.status(204).end();
});

app.post("/api/persons", (request, response) => {
	const body = request.body;
	let incompleteBodyMsg = "";

	if (!body.name) incompleteBodyMsg = "Name is missing";
	if (!body.number) incompleteBodyMsg = "Number is missing";
	if (incompleteBodyMsg) {
		return response.status(400).json({
			error: incompleteBodyMsg,
		});
	}

	if (!checkValueUniqueness(persons, "name", body.name)) {
		return response.status(400).json({
			error: "Person with the same 'Name' already exists!",
		});
	}

	const person = {
		id: generateId(persons, "id"),
		name: body.name,
		number: body.number,
	};

	persons = persons.concat(person);

	response.json(person);
});

// END OF Persons API

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
