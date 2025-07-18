// public/app.js
const BASE_URL = "http://127.0.0.1:18081/api";

let userData = {};

window.onload = function () {
  const savedUser = JSON.parse(localStorage.getItem("userData"));
  if (savedUser) {
    userData = savedUser;
    setupDashboard(userData.role);
  } else {
    showRolePopup();
  }
};

function showRolePopup() {
  Swal.fire({
    title: "Who are you?",
    text: "Please select your role to continue",
    icon: "question",
    showDenyButton: true,
    confirmButtonText: "Teacher 👨‍🏫",
    denyButtonText: "Student 👩‍🎓",
  }).then((result) => {
    if (result.isConfirmed) userData.role = "teacher";
    else if (result.isDenied) userData.role = "student";
    handleLogin();
  });
}

function checkRole(allowedRole, actionName) {
  if (userData.role !== allowedRole) {
    Swal.fire("❌ Access Denied", `Only ${allowedRole}s can ${actionName}.`, "error");
    return false;
  }
  return true;
}

function handleLogin() {
  if (!userData.role) return Swal.fire("❌ Please select your role first!");

  Swal.fire({
    title: `Login as ${userData.role}`,
    html: `
      <input id="swal-username" class="swal2-input" placeholder="Username">
      <input id="swal-password" type="password" class="swal2-input" placeholder="Password">`,
    confirmButtonText: "Login",
    focusConfirm: false,
    preConfirm: () => {
      const username = document.getElementById("swal-username").value;
      const password = document.getElementById("swal-password").value;
      if (!username || !password) {
        Swal.showValidationMessage("Please enter both username and password!");
        return false;
      }

      return fetch(`${BASE_URL}/loginUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Invalid credentials");
        return data;
      })
      .then(data => {
        if (data.role !== userData.role) throw new Error("Incorrect role selected!");
        userData = data;
        localStorage.setItem("userData", JSON.stringify(userData));
        Swal.fire("✅ Logged in!", `Welcome ${data.username} (${data.role})`, "success");
        setupDashboard(data.role);
      })
      .catch(err => Swal.showValidationMessage("❌ " + err.message));
    }
  });
}

function handleRegister() {
  if (!checkRole("teacher", "register users")) return;

  Swal.fire({
    title: "➕ Register New User",
    html: `
      <input id="new-username" class="swal2-input" placeholder="Username">
      <input id="new-password" type="password" class="swal2-input" placeholder="Password">
      <select id="new-role" class="swal2-input">
        <option value="student">Student 👩‍🎓</option>
        <option value="teacher">Teacher 👨‍🏫</option>
      </select>`,
    confirmButtonText: "Register",
    preConfirm: () => {
      const username = document.getElementById("new-username").value;
      const password = document.getElementById("new-password").value;
      const role = document.getElementById("new-role").value;
      if (!username || !password || !role) {
        Swal.showValidationMessage("Fill in all fields");
        return false;
      }

      return fetch(`${BASE_URL}/registerUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requester_role: userData.role, username, password, role })
      })
      .then(res => res.text())
      .then(msg => Swal.fire("✅ Done", msg, "success"))
      .catch(err => Swal.fire("❌ Error", err.message, "error"));
    }
  });
}

function setupDashboard(role) {
  document.getElementById("user-bar").style.display = "block";
  document.getElementById("username").innerText = userData.username;
}

function handleLogout() {
  Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, logout"
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("userData");
      location.reload();
    }
  });
}

function handleAdd() {
  if (!checkRole("teacher", "add books")) return;

  Swal.fire({
    title: "Add a Book",
    html: `
      <input id="book-id" class="swal2-input" placeholder="Book ID">
      <input id="book-title" class="swal2-input" placeholder="Title">
      <input id="book-author" class="swal2-input" placeholder="Author">`,
    confirmButtonText: "Add",
    preConfirm: () => {
      const id = document.getElementById("book-id").value;
      const title = document.getElementById("book-title").value;
      const author = document.getElementById("book-author").value;
      return fetch(`${BASE_URL}/addBook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Number(id), title, author, user: userData })
      })
      .then(res => res.text())
      .then(msg => Swal.fire("✅ Added", msg, "success"))
      .catch(err => Swal.fire("❌ Error", err.message, "error"));
    }
  });
}

function handleSearch() {
  Swal.fire({
    title: "🔎 Search Book",
    input: "text",
    inputLabel: "Enter Book Title",
    confirmButtonText: "Search",
    preConfirm: (title) => {
      return fetch(`${BASE_URL}/searchBook?title=${encodeURIComponent(title)}`)
      .then(res => res.json())
      .then(data => {
        if (!data.length) return Swal.fire("Not Found", "No books match that title.", "info");
        let results = data.map(b => `${b.title} by ${b.author} [ID: ${b.id}]`).join("<br>");
        Swal.fire("Results", results, "success");
      })
      .catch(err => Swal.fire("❌ Error", err.message, "error"));
    }
  });
}

function handleIssue() {
  if (!checkRole("student", "issue books")) return;

  Swal.fire({
    title: "📕 Issue Book",
    input: "text",
    inputLabel: "Enter Book ID",
    confirmButtonText: "Issue",
    preConfirm: (bookId) => {
      return fetch(`${BASE_URL}/issueBook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userData, bookId: Number(bookId) })
      })
      .then(res => res.text())
      .then(msg => Swal.fire("✅ Issued", msg, "success"))
      .catch(err => Swal.fire("❌ Error", err.message, "error"));
    }
  });
}

function handleReturn() {
  if (!checkRole("student", "return books")) return;

  Swal.fire({
    title: "🔄 Return Book",
    input: "text",
    inputLabel: "Enter Book ID",
    confirmButtonText: "Return",
    preConfirm: (bookId) => {
      return fetch(`${BASE_URL}/returnBook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userData, bookId: Number(bookId) })
      })
      .then(res => res.text())
      .then(msg => Swal.fire("✅ Returned", msg, "success"))
      .catch(err => Swal.fire("❌ Error", err.message, "error"));
    }
  });
}
// prototype
function handleDelete() {
  if (!checkRole("teacher", "delete books")) return;

  Swal.fire({
    title: "🗑️ Delete Book",
    input: "text",
    inputLabel: "Enter Book ID",
    confirmButtonText: "Delete",
    preConfirm: (bookId) => {
      return fetch(`${BASE_URL}/deleteBook?id=${bookId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userData })
      })
      .then(res => res.text())
      .then(msg => Swal.fire("✅ Deleted", msg, "success"))
      .catch(err => Swal.fire("❌ Error", err.message, "error"));
    }
  });
}

function handleList() {
  fetch(`${BASE_URL}/listBooks`)
  .then(res => res.json())
  .then(data => {
    if (!data.length) return Swal.fire("📚 Empty", "No books in the Library yet", "info");
    let books = data.map(b => `${b.title} by ${b.author} [ID: ${b.id}] - ${b.is_issued ? "❌ Issued" : "✅ Available"}`).join("<br><br>");
    Swal.fire({ title: "📚 Book List", html: books, width: 600 });
  })
  .catch(err => Swal.fire("❌ Error", err.message, "error"));

  
}
