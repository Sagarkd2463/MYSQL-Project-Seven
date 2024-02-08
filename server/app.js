const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'r$$100200',
    database: 'employeedb',
});

db.connect((err) => {
    if (err) {
        console.log('Error in DB connection: ' + JSON.stringify(err, undefined, 2));
    } else {
        console.log('DB Connected Successfully...');
    }
});

app.get('/', (req, res) => {

    db.query("SELECT * FROM employee", (err, data) => {
        if (err) {
            res.send({ status: false, message: err.message });
        } else {
            res.send({ status: true, message: data });
        }
    });
});

app.get('/employee/:id', (req, res) => {

    db.query("SELECT * FROM employee WHERE ID = ?", [req.params.id], (err, data) => {
        if (err) {
            res.send({ status: false, message: err.message });
        } else {
            res.send({ status: true, message: data });
        }
    });
});

app.delete('/employee/:id', (req, res) => {

    db.query("DELETE FROM employee WHERE ID = ?", [req.params.id], (err) => {
        if (err) {
            res.send({ status: false, message: err.message });
        } else {
            res.send({ status: true, message: "Deleted data successfully!" });
        }
    });
});

app.post('/addemployee', (req, res) => {

    const values = [
        req.body.name,
        req.body.salary,
    ];

    db.query("INSERT INTO employee (name, salary) VALUES (?)", [values], (err, data) => {
        if (err) {
            res.send({ status: false, message: err.message });
        } else {
            res.send({ status: true, message: data });
        }
    });
});

app.patch('/updateemployee', (req, res) => {

    const values = req.body;

    db.query("UPDATE employee SET ? WHERE id =" + values.id, [values], (err, data) => {
        if (err) {
            res.send({ status: false, message: err.message });
        } else {
            res.send({ status: true, message: data });
        }
    });
});

app.put('/updateemployee', (req, res) => {
    const values = req.body;

    db.query("UPDATE employee SET ? WHERE id =" + values.id, [values], (err, data) => {
        if (err) {
            res.send({ status: false, message: err.message });
        } else {
            if (data.affectedRows == 0) {
                const values = [
                    req.body.name,
                    req.body.salary,
                ];

                db.query("INSERT INTO employee (name, salary) VALUES (?)", [values], (err, data) => {
                    if (err) {
                        res.send({ status: false, message: err.message });
                    } else {
                        res.send({ status: true, message: data });
                    }
                });
            } else {
                res.send({ status: true, message: data });
            }
        }
    });
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server running on port: http://localhost: ${PORT}`);
});