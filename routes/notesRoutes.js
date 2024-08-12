const express = require('express');
const router = express.Router();
const noteController =  require('../controllers/notesController');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');


// Swagger setup

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//Add a new note
router.post('/addNote',noteController.addNote);

//update an existing note by id
router.put('/updateNote/:id',noteController.updateNote);

//fetch an existing note by id
router.get('/fetchNote/:id',noteController.fetchNotesById);

//fetch notes by query substring of title
router.get('/notes',noteController.fetchNotes)

module.exports = router