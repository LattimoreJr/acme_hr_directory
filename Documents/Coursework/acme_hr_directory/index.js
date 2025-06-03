const express = require('express');
const app = express();
const pg = require('pg');
const client = new pg.Client("postgres://localhost/acme_hr_directory" || process.env.DATABASE_URL);

app.get('/api/departments', async (req,res,next) => {
    try {
        const SQL = `
            SELECT * 
            FROM department
        `
        const response = await client.query(SQL)
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

app.get('/api/employees', async (req,res,next) => {
    try {
        const SQL = `
            SELECT *
            FROM employee
        `
        const response = await client.query(SQL)
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})


const init = async () => {
   await client.connect();
   const SQL = `
        DROP TABLE IF EXISTS employee;
        DROP TABLE IF EXISTS department; 
        CREATE TABLE department (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL
        );
        
        CREATE TABLE employee (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            department_id INTEGER REFERENCES department(id)
        );
        
        INSERT INTO department(name) VALUES('hr');
        INSERT INTO department(name) VALUES('sales');
        INSERT INTO employee(name, department_id) VALUES('John', (SELECT id FROM department WHERE name='sales'));
        INSERT INTO employee(name, department_id) VALUES('Jane', (SELECT id FROM department WHERE name='sales'));
        INSERT INTO employee(name, department_id) VALUES('Jacob', (SELECT id FROM department WHERE name='hr'));
        INSERT INTO employee(name, department_id) VALUES('Jessica', (SELECT id FROM department WHERE name='hr'));

        `

       
    await client.query(SQL)
    const PORT = 3000 || process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

init()