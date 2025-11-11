CREATE DATABASE employee_app_db;
USE employee_app_db;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dob DATE NOT NULL,
    joining_date DATE NOT NULL,
    salary_year DECIMAL(10,2) NOT NULL
);
INSERT INTO employees (name, dob, joining_date, salary_year) VALUES
('Arun', '1995-04-10', '2021-06-15', 350000),
('Suresh', '1992-11-20', '2020-01-10', 420000),
('Priya', '1998-08-05', '2022-09-05', 300000),
('Kumar', '1990-02-25', '2019-03-18', 500000),
('Meena', '1996-12-12', '2023-01-01', 280000);
SELECT * FROM employees;
