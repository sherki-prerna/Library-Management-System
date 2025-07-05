let userData = {};

// 🔁 Page load: Check if user is already logged in
window.onload = function () {
  const savedUser = JSON.parse(localStorage.getItem("userData"));

  if (savedUser) {
    userData = savedUser;
    setupDashboard(userData.role);
  } else {
    showRolePopup();
  }
};

// 🎯 Step 1: Show popup to select role and enter user details
function showRolePopup() {
  Swal.fire({
    title: "Who are you?",
    text: "Please select your role to continue",
    icon: "question",
    showDenyButton: true,
    confirmButtonText: "Teacher 👨‍🏫",
    denyButtonText: "Student 👩‍🎓",
  }).then((result) => {
    if (result.isConfirmed) {
      userData.role = "teacher";
    } else if (result.isDenied) {
      userData.role = "student";
    }

    collectUserDetails();
  });
}

// 🎯 Step 2: Collect name, ID, and mobile number
function collectUserDetails() {
  Swal.fire({
    title: `Welcome ${userData.role}`,
    html:
      `<input id="swal-name" class="swal2-input" placeholder="Your Name">
       <input id="swal-id" class="swal2-input" placeholder="Your ID">
       <input id="swal-phone" class="swal2-input" placeholder="Mobile Number">`,
    confirmButtonText: "Continue",
    focusConfirm: false,
    preConfirm: () => {
      const name = document.getElementById("swal-name").value;
      const id = document.getElementById("swal-id").value;
      const mobile = document.getElementById("swal-phone").value;

      if (!name || !id || !mobile) {
        Swal.showValidationMessage("Please fill out all fields!");
        return false;
      }

      userData.name = name;
      userData.id = id;
      userData.mobile = mobile;

      localStorage.setItem("userData", JSON.stringify(userData));
    }
  }).then(() => {
    setupDashboard(userData.role);
  });
}

// 🎯 Step 3: Setup dashboard and show user info
function setupDashboard(role) {
  document.getElementById("user-bar").style.display = "block";
  document.getElementById("username").innerText = userData.name;

  // You can also conditionally show/hide other sections
  if (role === "teacher") {
    document.getElementById("teacher-actions").style.display = "block";
    document.getElementById("student-actions").style.display = "none";
  } else {
    document.getElementById("student-actions").style.display = "block";
    document.getElementById("teacher-actions").style.display = "none";
  }
}

// 🚪 Logout function
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
      location.reload(); // Reload to show role popup again
    }
  });
}


function handleAdd() {
 Swal.fire({
  title: "Add a Book",
  html: `
  <input id ="book-id" class="swal2-input" placeholder="Book ID">
  <input id = "book-title" class="swal2-input" placeholder="Title">
  <input id = "book-author" class="swal2-input" placeholder="Author">
  `,
  confirmButtonText : "Add a Book",
  preConfirm: () => {
    const id = document.getElementById("book-id").value;
    const title = document.getElementById("book-title").value;
    const author = document.getElementById("book-author").value;

    const user = JSON.parse(localStorage.getItem("userData"));

    return fetch("http://localhost:18080/addBook",{
      method: "POST",
      headers: { "Content-type": "application/json"},
      body: JSON.stringify({
        user,
        book: {id: Number(id),title,author}
      })
    })
    .then(res=>res.text())
    .then(msg => Swal.fire("✅ Added ",msg," success"))
    .catch(err=>Swal.fire("😑 Error ",err.message," error"));
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
      return fetch(`https://localhost:18080/searchBook?title=${encodeURIComponent(title)}`)
      .then(res => res.json())
      .then(data => {
        if(data.length===0){
          Swal.fire("Not Found","No books match that title.","info");

        }
        else{
          let results = data.map(b=> `${b.title} by ${b.author} [ID: ${b.id}]`).join("<br>");
          Swal.fire("Results",results,"success");
        }
      })
      .catch(err => Swal.fire("❌ Error ",err.message,"error"));
    }
  });
}

function handleIssue() {
  Swal.fire({
    title : "📕 Issue Book ",
    input: "text",
    inputLabel: "Enter Book ID",
    confirmButtonText: "Issue",
    preConfirm: (bookId) => {
      const user = JSON.parse(localStorage.getItem("userData"));
      return fetch("https://localhost:18080/issueBook", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({user,bookId: Number(bookId)})
      })
      .then(res=> res.text())
      .then(msg => Swal.fire("✅ Issued",msg,"success"))
      .catch(err => Swal.fire("❌ Error", err.message,"error"));
    }
  });
}

function handleReturn() {
  Swal.fire ( {
    title: "🔄 Return Book",
    input: "text",
    inputLabel: "Enter Book ID",
    confirmButtonText: "Return",
    preConfirm: (bookId) => {
      const user = JSON.parse(localStorage.getItem("userData"));
      return fetch("https://localhost:18080/returnBook",{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify({user,bookId:Number(bookId)})
      })
      .then(res=>res.text())
      .then(msg=> Swal.fire("✅Returned",msg,"success"))
      .catch(err=>Swal.fire("❌ Error",err.message,"error"));
    }
  });

}
function handleDelete() {
  Swal.fire({
    title: "🗑️ Delete Book",
    input: "text",
    inputLabel: "Enter Book ID",
    confirmButtonText: "Delete",
    preConfirm: (bookId) => {
      return fetch(`https://localhost:18080/deleteBook?id=${bookId}`,{
        method:"DELETE"
      })
      .then(res=> res.text())
      .then(msg=> Swal.fire("✅ Deleted",msg,"success"))
      .catch(err=> Swal.fire("❌ Error",err.message,"error"));
    }
  });
}

function handleList() {
  fetch("https://localhost:18080/listBooks")
  .then(res=> res.json())
  .then(data => {
    if(data.length===0) {
      Swal.fire("📚 Empty "," No books int he Library yet","info");

    }
    else{
      let books=data.map(b=> `${b.title} by ${b.author} [ID:${b.id}] -${b.is_issued ? "❌ Issued" : "✅ Available"}`).join("<br><br>");
      Swal.fire({
        title: "📚 Book List",
        html: books,
        width: 600
      });
    }
  })
  .catch(err => Swal.fire("❌ Error",err.message,"error"));
}