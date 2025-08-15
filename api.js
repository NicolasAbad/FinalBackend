const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Uncomment if you use a .env file
// setups
const app = express();

app.use(cors());
app.use(express.json());
// --- MongoDB Connection ---
// It's a good practice to store your URI in environment variables
const port = process.env.PORT || 3000;
const URI = process.env.MONGO_URI;
// Changed database name to 'documents'
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
console.log('Connected to MongoDB');
// Start your Express server once connected to MongoDB
app.listen(port, () => {
console.log(`Server is running on port ${port}`);
});
})
.catch((error) => {
console.error('Error connecting to MongoDB:', error);
});
// --- Schema and Model Definition ---
// define Schema Class
const Schema = mongoose.Schema;
// Create a Schema object for a document with a single 'text' field
const documentSchema = new Schema({
text: { type: String, required: true },
}, {
timestamps: true, // Adds createdAt and updatedAt timestamps automatically
});
// Create the Mongoose model from the schema
const Document = mongoose.model("Document", documentSchema);
// --- API Router Setup ---
const router = express.Router();
// Mount the router middleware at the '/documents' path for clarity
app.use('/documents', router);
// --- API Routes for CRUD Operations ---
// GET: Fetch all documents
router.route("/")
.get((req, res) => {
Document.find()
.then((docs) => res.json(docs))
.catch((err) => res.status(400).json("Error: " + err));
});
// GET: Fetch a single document by its ID

router.route("/:id")
.get((req, res) => {
Document.findById(req.params.id)
.then((doc) => res.json(doc))
.catch((err) => res.status(400).json("Error: " + err));
});
// POST: Add a new document
router.route("/add")
.post((req, res) => {
const { text } = req.body; // Destructure the 'text' field from the request body
// create a new Document object
const newDocument = new Document({
text,
});
// save the new object (newDocument)
newDocument
.save()
.then(() => res.json("Document added!"))
.catch((err) => res.status(400).json("Error: " + err));
});
// PUT: Update an existing document by its ID
router.route("/update/:id")
.put((req, res) => {
Document.findById(req.params.id)
.then((doc) => {
if (!doc) {
return res.status(404).json("Error: Document not found");
}
doc.text = req.body.text; // Update only the 'text' field 
doc
.save()
.then(() => res.json("Document updated!"))
.catch((err) => res.status(400).json("Error: " + err));
})
.catch((err) => res.status(400).json("Error: " + err));
});
// DELETE: Remove a document by its ID
router.route("/delete/:id")
.delete((req, res) => {
Document.findByIdAndDelete(req.params.id)
.then((doc) => {
if (!doc) {
return res.status(404).json("Error: Document not found");
}
res.json("Document deleted.")
})
.catch((err) => res.status(400).json("Error: " + err));
});