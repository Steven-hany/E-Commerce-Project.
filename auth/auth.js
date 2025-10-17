const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");

/**
 * دالة مساعدة لمسح قيم حقول الإدخال في نموذج التسجيل
 */
function clearSignupFields() {
    document.getElementById("signup-username").value = "";
    document.getElementById("signup-email").value = "";
    document.getElementById("signup-password").value = "";
    const adminCheckbox = document.getElementById("signup-is-admin");
    if (adminCheckbox) {
        adminCheckbox.checked = false;
    }
}

// Signup
signupForm?.addEventListener("submit", e => {
    e.preventDefault();

    const users = getData("users") || [];

    const newUser = {
        id: generateId("user"),
        username: document.getElementById("signup-username").value,
        email: document.getElementById("signup-email").value,
        password: document.getElementById("signup-password").value,
        is_admin: document.getElementById("signup-is-admin").checked // match navbar logic
    };

    // منع تكرار الإيميلات
    if (users.find(u => u.email === newUser.email)) {
        alert("User already exists!");
        return;
    }

    users.push(newUser);
    saveData("users", users);

    alert("Signup successful! Please login.");
    
    // **التعديل هنا: مسح حقول التسجيل لمنع حفظ البيانات**
    clearSignupFields(); 

    // الانتقال لصفحة الدخول
    window.location.href = "../auth/auth.html";
});

// Login
loginForm?.addEventListener("submit", e => {
    e.preventDefault();

    const users = getData("users") || [];
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        setCurrentUser(user); // store in localStorage as currentUser
        alert("Login successful!");
        
        // **التعديل هنا: مسح حقول الدخول بعد النجاح**
        document.getElementById("login-email").value = "";
        document.getElementById("login-password").value = "";

        window.location.href = "../index.html";
    } else {
        alert("Invalid credentials.");
    }
});