
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./server');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Book API', () => {
    let bookId;

    it('should POST a book', (done) => {
        const book = { id: '1', title: 'Test Book', author: 'Test Author' };
        chai.request(server)
            .post('/books')
            .send(book)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('title');
                expect(res.body).to.have.property('author');
                bookId = res.body.id;
                done();
            });
    });

    it('should GET all books', (done) => {
        chai.request(server)
            .get('/books')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                done();
            });
    });

    it('should GET a single book', (done) => {
        chai.request(server)
            .get(`/books/${bookId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('title');
                expect(res.body).to.have.property('author');
                done();
            });
    });

    it('should PUT an existing book', (done) => {
        const updatedBook = { id: bookId, title: 'Update Test Book', author: 'Update Test Author' };
        chai.request(server)
            .put(`/books/${bookId}`)
            .send(updatedBook)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body.title).to.equal('Update Test Book');
                expect(res.body.author).to.equal('Update Test Author');
                done();
            });
    });

    it('should return 404 when trying to GET, PUT, or DELETE a non-existing book', (done) => {
        const nonExistingBookId = '9999';

        // Create an array of promises for each request
        const promises = [
            chai.request(server).get(`/books/${nonExistingBookId}`),
            chai.request(server).put(`/books/${nonExistingBookId}`).send({ title: 'Non-existing Book', author: 'Non-existing Author' }),
            chai.request(server).delete(`/books/${nonExistingBookId}`)
        ];

        // Wait for all promises to resolve
        Promise.all(promises)
            .then((results) => {
                // Check each result for 404 status
                results.forEach((res) => {
                    expect(res).to.have.status(404);
                });
                done();
            })
            .catch((err) => {
                done(err); // In case any promise rejects with an error
            });
    });
});


