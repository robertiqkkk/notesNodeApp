require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Note = require("./models/note");

const app = express();

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(express.static("dist"));
app.use(express.json());
app.use(
	morgan(
		":method :url :status :res[content-length] - :response-time ms :body"
	)
);

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
	Note.find({}).then((notes) => {
		response.json(notes);
	});
});

app.get("/api/notes/:id", (request, response) => {
	Note.findById(request.params.id)
		.then((note) => {
			if (note) {
				response.json(note);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.delete("/api/notes/:id", (request, response) => {
	Note.findByIdAndDelete(request.params.id)
		.then((result) => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

app.post("/api/notes", (request, response, next) => {
	const body = request.body;

	if (!body.content) {
		return response.status(400).json({
			error: "content missing",
		});
	}

	const note = new Note({
		content: body.content,
		important: body.important || false,
	});

	note.save()
		.then((savedNote) => response.json(savedNote))
		.catch((error) => next(error));
});

app.put("/api/notes/:id", (request, response, next) => {
	const { content, important } = request.body;

	Note.findById(request.params.id)
		.then((note) => {
			if (!note) {
				return response.status(404).end();
			}

			note.content = content;
			note.important = important;

			return note.save();
		})
		.then((updatedNote) => {
			response.json(updatedNote);
		})
		.catch((error) => next(error));
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

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
