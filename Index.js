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
    database: process.env.DB_NAME,
    dateStrings: true
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
    const empId = req.params.id;

    db.query("SELECT * FROM employees WHERE id=?", [empId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: `Employee with ID ${empId} not found` });
        }
        res.status(200).json(result[0]);
    });
});

app.post("/employees", (req, res) => {
    const { name, dob, joining_date, salary_year } = req.body;

    if (!name || !dob || !joining_date || !salary_year) {
        return res.status(400).json({ message: "All fields (name, dob, joining_date, salary_year) are required." });
    }

    const sql = "INSERT INTO employees (name, dob, joining_date, salary_year) VALUES (?,?,?,?)";
    db.query(sql, [name, dob, joining_date, salary_year], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err });
        }

        res.status(201).json({ message: "Employee Added Successfully!", insertedId: result.insertId });
    });
});

app.put("/employees/:id", (req, res) => {
    const empId = req.params.id;

    if (isNaN(empId)) {
        return res.status(400).json({ 
            message: "Invalid employee ID — must be a number." 
        });
    }

    const { name, dob, joining_date, salary_year } = req.body;
    const sql = "UPDATE employees SET name=?, dob=?, joining_date=?, salary_year=? WHERE id=?";
    
    db.query(sql, [name, dob, joining_date, salary_year, empId], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: `Employee with ID ${empId} not found` });
        res.json({ message: "Employee Updated Successfully!" });
    });
});


app.delete("/employees/:id", (req, res) => {
    const empId = req.params.id;
    if (isNaN(empId)) {
        return res.status(400).json({ 
            message: "Invalid employee ID — must be a number." 
        });
    }

    db.query("DELETE FROM employees WHERE id=?", [empId], (err, result) => {
        if (err) {
            return res.status(500).json({ 
                message: "Database error", 
                error: err 
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                message: `Employee with ID ${empId} not found` 
            });
        }

        res.json({ 
            message: "Employee Deleted Successfully!" 
        });
    });
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
