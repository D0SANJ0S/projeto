// Função de registro usando Firebase Authentication
async function register() {
    const user = document.getElementById("regUser").value;
    const pass = document.getElementById("regPass").value;

    if (!user || !pass) {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        // Criar usuário no Firebase Authentication
        const userCredential = await auth.createUserWithEmailAndPassword(user + "@projeto.com", pass);
        
        // Salvar informações adicionais no Firestore
        await db.collection("users").doc(userCredential.user.uid).set({
            username: user,
            email: user + "@projeto.com",
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert("Conta criada com sucesso!");
        window.location = "index.html";
    } catch (error) {
        console.error("Erro ao registrar:", error);
        if (error.code === "auth/email-already-in-use") {
            alert("Usuário já existe!");
        } else {
            alert("Erro ao criar conta: " + error.message);
        }
    }
}

// Função de login usando Firebase Authentication
async function login() {
    const user = document.getElementById("loginUser").value;
    const pass = document.getElementById("loginPass").value;

    if (!user || !pass) {
        alert("Preencha todos os campos!");
        return;
    }

    try {
        // Fazer login no Firebase Authentication
        const userCredential = await auth.signInWithEmailAndPassword(user + "@projeto.com", pass);
        
        // Buscar username do Firestore
        const userDoc = await db.collection("users").doc(userCredential.user.uid).get();
        const username = userDoc.exists ? userDoc.data().username : user;
        
        // Salvar username no localStorage para uso posterior
        localStorage.setItem("loggedUser", username);
        
        window.location = "dashboard.html";
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
            alert("Usuário ou senha inválidos!");
        } else {
            alert("Erro ao fazer login: " + error.message);
        }
    }
}

// Função de logout usando Firebase Authentication
function logout() {
    auth.signOut().then(() => {
        localStorage.removeItem("loggedUser");
        window.location = "index.html";
    }).catch((error) => {
        console.error("Erro ao fazer logout:", error);
        localStorage.removeItem("loggedUser");
        window.location = "index.html";
    });
}
