const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) console.log("DB Connect Failed:", err);
    else console.log("DB Connected Successfully!");
});

app.get("/employees", (req, res) => {
    db.query("SELECT * FROM employees", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});


app.get("/employees/:id", (req, res) => {
    db.query("SELECT * FROM employees WHERE id=?", [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result[0]);
    });
});

app.post("/employees", (req, res) => {
    const { name, dob, joining_date, salary_year } = req.body;
    const sql = "INSERT INTO employees (name, dob, joining_date, salary_year) VALUES (?,?,?,?)";
    db.query(sql, [name, dob, joining_date, salary_year], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Employee Added Successfully!");
    });
});

app.put("/employees/:id", (req, res) => {
    const { name, dob, joining_date, salary_year } = req.body;
    const sql = "UPDATE employees SET name=?, dob=?, joining_date=?, salary_year=? WHERE id=?";
    db.query(sql, [name, dob, joining_date, salary_year, req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Employee Updated Successfully!");
    });
});

app.delete("/employees/:id", (req, res) => {
    db.query("DELETE FROM employees WHERE id=?", [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Employee Deleted Successfully!");
    });
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
