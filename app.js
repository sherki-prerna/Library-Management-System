// let userData = {
//     role: "",
//     name: "",
//     id: "",
//     mobile:"",
// };
// window.onload = function (){
// Swal.fire({
//     title: "Who are you?",
//     text: "Please select your role",
//     icon:"question",
//     showDenyButton:true,
//     confirmButtonText:"Teacher 👨‍🏫👩‍🏫",
//     denyButtonText: "Student 👩‍🎓",
//     denyButtonColor:"#3085d6",
// }).then((result) => {
//     if(result.isConfirmed){
//         userRole = "teacher";
//     }
//     else if(result.isDenied){
//         userRole="student";
//     }
//     showDetailsForm();
//     // localStorage.setItem("userRole",userRole);
//     // alert("Logged in as "+userRole);
// });

// };

// function showDetailsForm() {
//     Swal.fire({
//         title: `Welcome ${userData.Role}`,
//         html:
//         `<input id="swal-name" class="swal12-input" placeholder="Your Name">
//         <input id="swal-id" class="swal12-input" placeholder="Your ID">
//         <input id="swal-phone" class="swal12-input" placeholder="Mobile Number">`,
//         confirmedButtonText: "Continue",
//         focusConfirm: false,
//         preConfirm: () => {
//             const name = document.getElementById("swal-name").value;
//             const id = document.getElementById("swal-id").value;
//             const mobile = document.getElementById("swal-phone").value;

//             if(!name || !id || !mobile){
//                 Swal.showValidationMessage("Please fill out all fields");
//                 return false;
//             }
//             userData.name = name;
//             userData.id=id;
//             userData.mobile=mobile;

//             localStorage.setItem("userData", JSON.stringify(userData));
 

//         }
        
//     }).then(() => {
//          Swal.fire(`🎉 Welcome, ${userData.name} (${userData.role})`);
//         setupDashboard();
// });
// }