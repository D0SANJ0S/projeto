// Configuração do Firebase
// IMPORTANTE: Substitua estas configurações pelas suas credenciais do Firebase

const firebaseConfig = {
  apiKey: "AIzaSyDFPi9N6f6L4LjIc9NYJpWGcirYB6382OA",
  authDomain: "projeto-4326c.firebaseapp.com",
  projectId: "projeto-4326c",
  storageBucket: "projeto-4326c.firebasestorage.app",
  messagingSenderId: "988975337508",
  appId: "1:988975337508:web:75ccf39757111fe9be88b1",
  measurementId: "G-FNPZB5QDNP"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar serviços (variáveis globais para uso em outros arquivos)
const auth = firebase.auth();
const db = firebase.firestore();

// Tornar disponível globalmente (caso necessário)
window.auth = auth;
window.db = db;

