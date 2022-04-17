const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/' , (req , res) => {
    return res.send({
        error: false , 
        message: 'Welcome to RESTful CRUD API with nodejs expressjs mysql',
        written_by: 'bunlung',
        published_on: 'https://google.com'
    });
});

const dbCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_api'
});
dbCon.connect(err => {
    if(err){
        throw err;
    }else{
        console.log('Connected to db');
    }
});

// Read
app.get('/books' , (req , res) => {
    dbCon.query("SELECT * FROM books" , (err , results , fields) => {
        if(err){
            throw err;
        }
        let message = '';
        if(results === undefined || results.length === 0){
            message = 'Books table is empty';
        }else{
            message = 'Successfully retrieved all books';
        }
        return res.send({
            error: false,
            data: results,
            message: message
        });
    });
});

// Create
app.post('/book' , (req , res) => {
    let name = req.body.name;
    let author = req.body.author;

    if(!name || !author){
        return res.status(400).send({
            error: true, 
            message: 'Please provide book name and author.'
        });
    }else{
       dbCon.query("INSERT INTO books (name , author) VALUES(? , ?)", [name , author] , (err , results , fields) => {
           if(err){
            throw err;
           }
           return res.send({
               error: false,
               data: results,
               message: 'Book successfully added'
           });
       }); 
    }
});

// Read with id
app.get('/book/:id' , (req , res) => {
    let id = req.params.id;

    if(!id){
        return res.status(400).send({
            error: true,
            message: 'Please provide book id'
        });
    }else{
        dbCon.query("SELECT * FROM books WHERE id = ?" , id , (err , results , fields) => {
            if(err){
                throw err;
            }

            let message = '';
            if(results === undefined || results.length === 0){
                message = 'Book not found'
            }else{
                message = 'Successfully retrieved book data'
            }
            return res.send({
                error: false,
                data: results[0],
                message: message
            });
        });
    }
});

// Update
app.put('/book' , (req , res) => {
    let id = req.body.id;
    let name = req.body.name;
    let author = req.body.author;

    if(!id || !name || !author){
        return res.status(400).send({
            error: true,
            message: 'Please provide book id , name , author'
        });
    }else{
        dbCon.query("UPDATE books SET name = ? , author = ? WHERE id = ?" , [name , author , id] , (err , results , fields) => {
            if(err){
                throw err;
            }
            let message = '';
            if(results.changedRows === 0){
                message = 'Book not found or data are same';
            }else{
                message = 'Successfully to updated';
            }
            return res.send({
                error: false,
                data: results,
                message: message
            });
        });
    }
});

// Delete
app.delete('/book' , (req , res) => {
    let id = req.body.id;
    if(!id){
        return res.status(400).send({
            error: true,
            message: 'Please provide book id'
        });
    }else{
        dbCon.query("DELETE FROM books WHERE id = ?" , id , (err , results , fields) => {
            if(err){
                throw err;
            }
            let message = '';
            if(results.affectedRows === 0){
                message = 'Book not found';
            }else{
                message = 'Book successfully deleted';
            }
            return res.send({
                error: false,
                data: results,
                message: message
            });
        });
    }
});

app.listen(3000 , () => {
    console.log('Start server...');
});

module.exports = app;