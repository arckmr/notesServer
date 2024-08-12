// import app from '../index.mjs';  // Assuming your app is exported in index.mjs
// import Note from '../models/Note.mjs';
// Configure chai
let chai;
let chaiHttp;
let mongoose;
let app;
let Note;
(async()=>{
chai = await import('chai');
chaiHttp = await import('chaiHttp');
mongoose =await  import ('mongoose');
app = await import('../index.js')
Note = await import('../models/Note.js')

chai.use(chaiHttp);
chai.should(); // Use should style assertions

        describe("Notes API", () => {
            // Before each test, we empty the database
            console.log('inside');
            beforeEach((done) => {
                Note.deleteMany({}, (err) => { 
                done();           
                });        
            });

            // Test the POST /addNotes route
            describe("POST /api/addNote", () => {
                it("should create a new note", (done) => {
                    const note = {
                        title: "Test Note",
                        body: "This is a test note."
                    };
                    chai.request(app)
                        .post('/api/addNote')
                        .send(note)
                        .end((err, res) => {
                            res.should.have.status(201);
                            res.body.should.be.a('object');
                            res.body.should.have.property('title').eql(note.title);
                            res.body.should.have.property('body').eql(note.body);
                            done();
                        });
                });

                it("should not create a note without title and body", (done) => {
                    const note = {};
                    chai.request(app)
                        .post('/api/addNote')
                        .send(note)
                        .end((err, res) => {
                            res.should.have.status(400);
                            res.body.should.be.a('object');
                            res.body.should.have.property('message');
                            done();
                        });
                });
            });

            // Test the GET /notes/:id route
            describe("GET /api/fetchNote/:id", () => {
                it("should fetch a note by ID", (done) => {
                    const note = new Note({ title: "Fetch Note", body: "This note will be fetched." });
                    note.save((err, note) => {
                        chai.request(app)
                            .get(`/api/fetchNote/${note._id}`)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.should.have.property('title').eql(note.title);
                                res.body.should.have.property('body').eql(note.body);
                                done();
                            });
                    });
                });

                it("should return 404 when note is not found", (done) => {
                    const invalidId = mongoose.Types.ObjectId();
                    chai.request(app)
                        .get(`/api/fetchNote/${invalidId}`)
                        .end((err, res) => {
                            res.should.have.status(404);
                            res.body.should.have.property('message').eql('Note not found');
                            done();
                        });
                });
            });

            // Test the GET /notes?title=<substring> route
            describe("GET /notes?title=<substring>", () => {
                it("should fetch notes by title substring", (done) => {
                    const notes = [
                        { title: "First Note", body: "This is the first note." },
                        { title: "Second Note", body: "This is the second note." }
                    ];
                    Note.insertMany(notes, () => {
                        chai.request(app)
                            .get('/notes?title=First')
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('array');
                                res.body.length.should.be.eql(1);
                                res.body[0].should.have.property('title').eql("First Note");
                                done();
                            });
                    });
                });

                it("should return an empty array when no notes match", (done) => {
                    chai.request(app)
                        .get('/notes?title=Nonexistent')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('array');
                            res.body.length.should.be.eql(0);
                            done();
                        });
                });
            });

            // Test the PUT /notes/:id route
            describe("PUT /updateNote/:id", () => {
                it("should update an existing note", (done) => {
                    const note = new Note({ title: "Original Title", body: "Original body." });
                    note.save((err, note) => {
                        const updatedData = { title: "Updated Title", body: "Updated body." };
                        chai.request(app)
                            .put(`/notes/${note._id}`)
                            .send(updatedData)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.should.have.property('title').eql(updatedData.title);
                                res.body.should.have.property('body').eql(updatedData.body);
                                done();
                            });
                    });
                });

                it("should return 404 when trying to update a non-existent note", (done) => {
                    const invalidId = mongoose.Types.ObjectId();
                    const updatedData = { title: "Updated Title", body: "Updated body." };
                    chai.request(app)
                        .put(`/notes/${invalidId}`)
                        .send(updatedData)
                        .end((err, res) => {
                            res.should.have.status(404);
                            res.body.should.have.property('message').eql('Note not found');
                            done();
                        });
                });
            });
        });
})()