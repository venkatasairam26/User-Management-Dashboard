const express = require("express");
const cors = require("cors");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const dbPath = path.join(__dirname, "data.db");
let db = null;

const initDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
        await db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT NOT NULL, last_name TEXT NOT NULL, email TEXT NOT NULL, department TEXT NOT NULL)");
    }
    catch (e) {
        console.log(e);
        process.exit(1);
    }
}
initDBAndServer();

const authToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, 'secretKey', (err, user) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            req.user = user;
            next();
        });
    }
    else {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

app.get("/users", async(req, res) => {
    const {search,filter} = req.query;

    try {
        let data;
        switch(filter){
            case "first_name":
                data = await db.all(`SELECT * FROM users WHERE first_name LIKE '%${search}%' or last_name LIKE '%${search}%' or email LIKE '%${search}%' or department LIKE '%${search}%' order by first_name`);
                break;
            case "last_name":
                data = await db.all(`SELECT * FROM users WHERE last_name LIKE '%${search}%' or first_name LIKE '%${search}%' or email LIKE '%${search}%' or department LIKE '%${search}%' order by last_name`);
                break;
            case "email":
                data = await db.all(`SELECT * FROM users WHERE email LIKE '%${search}%' or first_name LIKE '%${search}%' or last_name LIKE '%${search}%' or department LIKE '%${search}%' order by email`);
                break;
            case "department":
                data = await db.all(`SELECT * FROM users WHERE department LIKE '%${search}%' or first_name LIKE '%${search}%' or last_name LIKE '%${search}%' or email LIKE '%${search}%' order by department`);
                break;
            default:
                data = await db.all(`SELECT * FROM users WHERE first_name LIKE '%${search}%' or last_name LIKE '%${search}%' or email LIKE '%${search}%' or department LIKE '%${search}%'`);
                break;
        }
       
        res.json(data);
        
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.post("/users", async (req, res) => {
    const { first_name, last_name, email, department } = req.body;
    console.log(req.body);
    const getuser = await db.get("SELECT * FROM users WHERE email = ?", [email]);
    console.log(getuser);
    try {
        if (getuser !== undefined) {
            return res.status(400).json({ message: "User already exists" });

        }
        const data = db.run("INSERT INTO users (first_name, last_name, email, department) VALUES (?, ?, ?, ?)", [first_name, last_name, email, department]);
        res.json(data);
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.put('/users', async (req, res) => {
  const {first_name, last_name, email, department} = req.body;

  try{ 
    const data = db.run("UPDATE users SET first_name = ?, last_name = ?, email = ?, department = ? WHERE email = ?", [first_name, last_name, email, department, email]);
    res.json(data);
  } catch(e){
    console.log(e);
    res.status(500).json({message: "Internal Server Error"});
  }
})

app.delete('/users', async (req, res) => {
    const {email} = req.query;
    console.log(email);
    try{
        await db.run("DELETE FROM users WHERE email = ?", [email]);
        res.json({message: "User deleted successfully"});
    } catch(e){
        console.log(e);
        res.status(500).json({message: "Internal Server Error"});
    }
})