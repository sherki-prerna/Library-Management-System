# 📚 Library Management System – Full Stack (C++ Crow + PostgreSQL + JS)

A role-based full-stack Library Management System built using **C++ Crow REST API**, **PostgreSQL**, and a **dynamic frontend UI** inspired by WhatsApp Web. Designed for both **students and teachers**, this project allows users to seamlessly manage books – add, issue, return, search, and delete – with role-specific access.

---

## 🚀 Features

- 👩‍🏫 **Role-Based Login** – Students and Teachers select their role via a smooth popup and submit name, ID, and mobile number
- 🧠 **Crow C++ Backend** – RESTful API powered by [Crow](https://github.com/CrowCpp/crow), a lightweight C++ web framework
- 💾 **PostgreSQL Integration** – Persistent data storage using `libpqxx` with relational tables for users and books
- 🎨 **Modern Frontend UI** – Built using HTML, CSS, and Vanilla JS with SweetAlert2 for sleek modals and input prompts
- 🛡️ **Role-Aware Access Control** – Teachers can add/delete books, students can issue/return them
- 🔍 **Book Management** – Add, search, list, issue, return, and delete books using real-time frontend/backend communication

---

## 🧱 Tech Stack

| Layer      | Tech |
|------------|------|
| Frontend   | HTML, CSS, JavaScript, SweetAlert2 |
| Backend    | C++ with Crow Framework |
| Database   | PostgreSQL + libpqxx |
| Tools      | CMake, Git, LocalStorage, Fetch API |

---

## 📂 Project Structure

📦 Library-Management-System
├── backend/
│ ├── server.cpp # Crow server with routes
│ ├── Database.cpp/.h # PostgreSQL logic via libpqxx
│ └── CMakeLists.txt
├── frontend/
│ ├── index.html # Main UI
│ ├── styles.css # Responsive layout & animations
│ └── app.js # JS logic + API calls
└── README.md # You're reading it 😉

Developer's Note:

This project was originally created in my second year as a purely command-line-based application. But I felt that keeping it solely CLI-driven made it look a bit boring and limited in 
terms of user experience.So, I decided to add a fun twist and make it more presentable by turning it into a full-stack project. I deliberately chose technologies I wasn’t familiar
with — just to learn something new and get my hands dirty by practicing. That’s how I landed on the tech stack mentioned above. 

From shelves to servers — managing libraries smarter. 📕📚
