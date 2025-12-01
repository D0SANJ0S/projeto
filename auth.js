import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

function register() {
    const user = document.getElementById("regUser").value;
    const pass = document.getElementById("regPass").value;

    try {
        await createUserWithEmailAndPassword(auth, user, pass);

        alert("Conta criada com sucesso!");
        window.location = "index.html";

    } catch (error) {
        console.error(error);

        if (error.code === "auth/email-already-in-use") {
            alert("Este login já está registrado.");
        } else if (error.code === "auth/invalid-email") {
            alert("login inválido.");
        } else if (error.code === "auth/weak-password") {
            alert("A senha deve ter pelo menos 6 caracteres.");
        } else {
            alert("Erro ao criar a conta.");
        }
    }
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

