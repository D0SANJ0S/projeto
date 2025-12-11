// Função de registro usando Firebase Authentication
async function register() {
    const user = document.getElementById("regUser").value.trim();
    const pass = document.getElementById("regPass").value;

    if (!user || !pass) {
        alert("Preencha todos os campos!");
        return;
    }

    if (pass.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres!");
        return;
    }

    // Limpar espaços e caracteres especiais do username
    const cleanUser = user.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (!cleanUser) {
        alert("Nome de usuário inválido! Use apenas letras e números.");
        return;
    }

    const email = cleanUser + "@projeto.com";

    try {
        console.log("Tentando registrar:", email);
        
        // Criar usuário no Firebase Authentication
        const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
        
        // Salvar informações adicionais no Firestore
        await db.collection("users").doc(userCredential.user.uid).set({
            username: cleanUser,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert("Conta criada com sucesso!\n\nVocê pode fazer login agora.");
        window.location = "index.html";
    } catch (error) {
        console.error("Erro ao registrar:", error);
        console.error("Código do erro:", error.code);
        
        if (error.code === "auth/email-already-in-use") {
            alert("Usuário já existe!\n\nEste nome de usuário já está em uso. Tente outro nome.");
        } else if (error.code === "auth/weak-password") {
            alert("Senha muito fraca! Use uma senha mais forte.");
        } else if (error.code === "auth/network-request-failed") {
            alert("Erro de conexão. Verifique sua internet e tente novamente.");
        } else {
            alert("Erro ao criar conta: " + error.message + "\n\nCódigo: " + error.code);
        }
    }
}

// Função de login usando Firebase Authentication
async function login() {
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value;

    if (!user || !pass) {
        alert("Preencha todos os campos!");
        return;
    }

    // Limpar espaços e caracteres especiais do username
    const cleanUser = user.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (!cleanUser) {
        alert("Nome de usuário inválido! Use apenas letras e números.");
        return;
    }

    const email = cleanUser + "@projeto.com";

    try {
        console.log("Tentando fazer login com:", email);
        
        // Fazer login no Firebase Authentication
        const userCredential = await auth.signInWithEmailAndPassword(email, pass);
        
        // Buscar username do Firestore
        const userDoc = await db.collection("users").doc(userCredential.user.uid).get();
        const username = userDoc.exists ? userDoc.data().username : cleanUser;
        
        // Salvar username no localStorage para uso posterior
        localStorage.setItem("loggedUser", username);
        
        window.location = "dashboard.html";
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        console.error("Código do erro:", error.code);
        
        // Firebase unificou os erros em auth/invalid-login-credentials nas versões mais recentes
        if (error.code === "auth/user-not-found" || 
            error.code === "auth/wrong-password" || 
            error.code === "auth/invalid-login-credentials" ||
            error.code === "auth/invalid-credential") {
            alert("Usuário ou senha inválidos!\n\n" +
                  "Possíveis causas:\n" +
                  "• Você ainda não se registrou no novo sistema\n" +
                  "• O nome de usuário está incorreto\n" +
                  "• A senha está incorreta\n\n" +
                  "Solução: Vá para a página de registro e crie uma nova conta.");
        } else if (error.code === "auth/user-disabled") {
            alert("Esta conta foi desabilitada.");
        } else if (error.code === "auth/too-many-requests") {
            alert("Muitas tentativas de login. Tente novamente mais tarde.");
        } else if (error.code === "auth/network-request-failed") {
            alert("Erro de conexão. Verifique sua internet e tente novamente.");
        } else {
            alert("Erro ao fazer login: " + error.message + "\n\nCódigo: " + error.code);
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
