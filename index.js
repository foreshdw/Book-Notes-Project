import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000;
const API_URL = "https://covers.openlibrary.org/b/id/";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
db.connect();

function generateRandomNumber() {
    return Math.floor(Math.random() * (1254799 - 1254701 + 1)) + 1254701;
}

async function getBookCover() {
    const coverId = generateRandomNumber();
    try {
        const response = await axios.get(`${API_URL}${coverId}-L.jpg`);
        if (response.status === 200) {
            return `${API_URL}${coverId}-L.jpg`;
        }
    } catch (error) {
        console.error("Error fetching book cover:", error);
    }
    return "https://covers.openlibrary.org/b/id/1254701-L.jpg";
}

app.get("/", async (req, res) => {
    try {
        let sortBy = req.query.sort;
        let orderByClause = "ORDER BY id ASC";

        if (sortBy === "rating") {
            orderByClause = "ORDER BY rating DESC";
        } else if (sortBy === "date_read") {
            orderByClause = "ORDER BY date_read DESC";
        } else if (sortBy === "title") {
            orderByClause = "ORDER BY title ASC";
        }

        const result = await db.query(`SELECT * FROM notes ${orderByClause}`);
        res.render("index.ejs", { listItems: result.rows });
    } catch (err) {
        console.error("Error fetching notes:", err);
        res.status(500).send("Server error");
    }
});

app.get('/new', (req, res) => {
    res.render('new.ejs');
});

app.get('/edit/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.query("SELECT * FROM notes WHERE id = $1", [id]);
        if (result.rows.length > 0) {
            res.render("modify.ejs", { post: result.rows[0] });
        } else {
            res.status(404).send("Post not found");
        }
    } catch (err) {
        console.error("Error fetching note for edit:", err);
        res.status(500).send("Server error");
    }
});

app.post("/newpost", async (req, res) => {
    const { title, dateRead, content, rating } = req.body;

    if (!title || !dateRead || !content || !rating) {
        return res.status(400).send("All fields are required");
    }

    try {
        const coverUrl = await getBookCover();

        await db.query(
            "INSERT INTO notes (title, date_read, content, cover_url, rating) VALUES ($1, $2, $3, $4, $5)",
            [title, dateRead, content, coverUrl, rating]
        );
        res.redirect("/");
    } catch (err) {
        console.error("Error inserting note:", err);
        res.status(500).send("Server error");
    }
});

app.post("/edit/:id", async (req, res) => {
    const title = req.body.title;
    const date = req.body.dateRead;
    const content = req.body.content;
    const rating = req.body.rating;
    const id = req.params.id;

    if (!title || !date || !content || !rating) {
        return res.status(400).send("All fields are required");
    }

    try {
        await db.query("UPDATE notes SET title=$1, date_read=$2, content=$3, rating=$4 WHERE id=$5",
            [title, date, content, rating, id]
        );
        res.redirect("/");
    } catch (err) {
        console.error("Error updating note:", err);
        res.status(500).send("Server error");
    }
});

app.post("/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        await db.query("DELETE FROM notes WHERE id = $1", [id]);
        res.redirect("/");
    } catch (err) {
        console.error("Error deleting note:", err);
        res.status(500).send("Server error");
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});