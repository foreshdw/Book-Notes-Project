# Book-Notes-Project
This is my book notes app project using the Express/Node.js platform with the pg library for PostgreSQL database management and the Axios HTTP client to integrate the Open Library Covers API for fetching book covers. The app allows users to log, review, and manage books they have read with sorting features based on rating, recency, and title. The frontend is styled using Tailwind CSS for a clean and responsive user interface.

## 🚀 Features

- Add, edit, and delete book notes
- Store book cover images
- Rate books you've read
- Sort notes by rating, recency, or title

---

## 📦 Installation

Follow these steps to set up and run the project locally:

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/foreshdw/Book-Notes-Project.git
cd Book-Notes-Project
```

### 2️⃣ Install Required Dependencies

Make sure you have Node.js installed. Then, run:
```sh
npm install
```

### 3️⃣ Set Up the Database

Ensure you have PostgreSQL installed and create a database named booknotes.
Then, create a table using the following SQL:
```sh
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date_read DATE NOT NULL,
    content TEXT NOT NULL,
    cover_url TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5)
);
```

### 4️⃣ Configure Environment Variables

Create a .env file in the project root and add your database credentials:
```sh
DB_USER=your_username
DB_HOST=localhost
DB_DATABASE=booknotes
DB_PASSWORD=your_password
DB_PORT=5432
```

### 5️⃣ Start the Server

To start the development server with Nodemon, run:
```sh
npx nodemon index.js
```

If you don’t have Nodemon installed, install it globally using:
```sh
npm install -g nodemon
```

Then, open your browser and visit:
```sh
http://localhost:3000/
```

### 🔄 Sorting Feature
You can sort the book notes by selecting a category from the dropdown:
- Rating (highest to lowest)
- Recency (most recent books first)
- Title (alphabetical order)
Sorting is handled by sending a query parameter to the backend.

### 🤝 Contributing
If you want to contribute:

1. Fork this repository
2. Create a new branch (git checkout -b feature-branch)
3, Commit your changes (git commit -m "Add new feature")
4. Push to your branch (git push origin feature-branch)
5. Submit a pull request
