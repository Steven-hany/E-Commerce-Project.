const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");

signupForm?.addEventListener("submit", e => {
  e.preventDefault();
  const users = getData("users") || [];
  const newUser = {
    id: generateId("user"),
    username: document.getElementById("signup-username").value,
    email: document.getElementById("signup-email").value,
    password: document.getElementById("signup-password").value,
    isAdmin: document.getElementById("signup-is-admin").checked
  };
  users.push(newUser);
  saveData("users", users);
  alert("Signup successful! Please login.");
});

loginForm?.addEventListener("submit", e => {
  e.preventDefault();
  const users = getData("users") || [];
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    setCurrentUser(user);
    alert("Login successful!");
    window.location.href = "../index.html";
  } else {
    alert("Invalid credentials.");
  }
});
