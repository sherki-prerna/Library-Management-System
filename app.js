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
