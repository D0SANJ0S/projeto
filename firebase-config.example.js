// Arquivo de exemplo de configuração do Firebase
// Copie este arquivo para firebase-config.js e preencha com suas credenciais

const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_PROJETO.appspot.com",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar serviços (variáveis globais para uso em outros arquivos)
const auth = firebase.auth();
const db = firebase.firestore();

// Tornar disponível globalmente (caso necessário)
window.auth = auth;
window.db = db;

