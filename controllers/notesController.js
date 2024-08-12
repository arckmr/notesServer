const Note = require('../models/Note.js');

// Controller for adding a new note
exports.addNote = async (req, res) => {
    try {
        const { title, body } = req.body;
        const newNote = new Note({ title, body });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        console.error('addNote error:', error);  // Log any errors
        res.status(400).json({ message: error.message });
    }
};

// Controller for updating an existing note by ID
exports.updateNote = async (req, res) => {
    try {
        const { title, body } = req.body;
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { title, body },
            { new: true }  // Return the updated document
        );

        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json(updatedNote);
    } catch (error) {
        console.error('updateNote error:', error);  // Log any errors
        res.status(400).json({ message: error.message });
    }
};

// Controller for fetching a note by ID
exports.fetchNotesById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json(note);
    } catch (error) {
        console.error('fetchNotesById error:', error);  // Log any errors
        res.status(400).json({ message: error.message });
    }
};

// Controller for querying notes by title substring
exports.fetchNotes = async (req, res) => {
    try {
        const { title } = req.query;
        const notes = await Note.find({ title: new RegExp(title, 'i') });
        res.status(200).json(notes);
    } catch (error) {
        console.error('fetchNotes error:', error);  // Log any errors
        res.status(400).json({ message: error.message });
    }
};
