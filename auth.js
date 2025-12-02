function register() {
    const user = document.getElementById("regUser").value;
    const pass = document.getElementById("regPass").value;

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find(u => u.user === user)) {
        alert("Usuário já existe!");
        return;
    }

    users.push({ user, pass });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Conta criada!");
    window.location = "index.html";
}

function login() {
    const user = document.getElementById("loginUser").value;
    const pass = document.getElementById("loginPass").value;

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const valid = users.find(u => u.user === user && u.pass === pass);

    if (!valid) {
        alert("Usuário ou senha inválidos!");
        return;
    }

    localStorage.setItem("loggedUser", user);
    window.location = "dashboard.html";
}

function logout() {
    localStorage.removeItem("loggedUser");
    window.location = "index.html";
}
