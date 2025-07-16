# 🔗 URL Shortener API

A simple and clean RESTful API built using **Node.js**, **Express.js**, and **MySQL**. It allows users to shorten URLs, retrieve them, update/delete them, and view access statistics — with a responsive frontend using **Tailwind CSS**.

<img width="526" height="229" alt="Backend" src="https://github.com/user-attachments/assets/b33ce3b6-c0a4-4b32-af35-eb0f43494e69" />
<img width="694" height="505" alt="Frontend" src="https://github.com/user-attachments/assets/536155b6-5f04-44db-a48a-4593e48d2442" />
<img width="407" height="440" alt="workingfrontned" src="https://github.com/user-attachments/assets/9076c9c5-81d4-4683-8260-cca7d85be0ad" />
<img width="389" height="402" alt="workingfrontend2" src="https://github.com/user-attachments/assets/53b0a6a8-12c3-4da0-a8cd-07979fd73a5d" />
<img width="789" height="459" alt="sqldatabase" src="https://github.com/user-attachments/assets/40956afa-cf62-4467-9b6d-fa45c8c2d1c3" />
<img width="629" height="216" alt="databse1" src="https://github.com/user-attachments/assets/b733c753-61da-4a32-8290-617173570283" />





## 🚀 Local App

Runs locally at:  
👉 `http://localhost:5002`



## ⚙️ Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MySQL  
- **Frontend:** HTML + Tailwind CSS + Vanilla JavaScript  
- **Tools:** dotenv, mysql2



## 📁 Folder Structure

url-shortener/
├── config/
│ └── db.js # MySQL DB connection using dotenv
├── routes/
│ └── urlRoutes.js # API route handlers
├── public/
│ └── index.html # Frontend (Tailwind + JS)
├── .env # Environment variables 
├── database.sql # SQL script to create the DB + table
├── server.js # Main Express server
├── query-runner.js # Helper to run DB queries
├── setup-database.js # Optional: Script to run database.sql
├── test-db.js # Script to test DB connection
├── package.json
└── README.md

## 🔐 Environment Configuration

✅ `.env` file is already created. Just open it and **add your MySQL password**:

```env
PORT=5002
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=url_shortener
Make sure your MySQL service is running and the credentials are correct.

🧠 Database Setup
🗂️ A ready-made SQL file database.sql is available to auto-create the database and table:


📥 Option 1: Run SQL manually

mysql -u root -p < database.sql

Test MySQL Connection
Run this command to verify DB connection:
node test-db.js
✅ You should see a “Connected” message in the terminal.

📡 API Endpoints
Method	Endpoint        	Description
POST	/api/shorten	      Create short URL
GET	/api/shorten/:code	  Retrieve original URL
PUT	/api/shorten/:code	  Update existing short URL
DELETE	/api/shorten/:code	Delete short URL
GET	/api/stats/:code	    View access stats

💻 Frontend Features
Shorten any URL

Retrieve original URL by shortcode

Update an existing short URL

Delete a short URL

View stats: clicks, created/updated time

📍 Available at: http://localhost:5002
