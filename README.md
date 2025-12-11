# Projeto de Dashboard de Manutenções

Sistema web para gerenciamento de manutenções com autenticação e banco de dados online usando Firebase.

## 🚀 Configuração do Firebase

Para que o site funcione online, você precisa configurar o Firebase. Siga os passos abaixo:

### 1. Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto" ou "Create a project"
3. Digite um nome para o projeto (ex: "projeto-manutencoes")
4. Siga as instruções para criar o projeto

### 2. Habilitar Authentication

1. No menu lateral, clique em **Authentication**
2. Clique em **Get Started**
3. Vá na aba **Sign-in method**
4. Habilite **Email/Password** (primeira opção)
5. Clique em **Enable** e depois em **Save**

### 3. Criar Banco de Dados Firestore

1. No menu lateral, clique em **Firestore Database**
2. Clique em **Create database**
3. Escolha **Start in test mode** (para desenvolvimento)
4. Selecione uma localização (escolha a mais próxima do Brasil, ex: `southamerica-east1`)
5. Clique em **Enable**

### 4. Configurar Regras de Segurança do Firestore

1. Ainda na página do Firestore, vá na aba **Rules**
2. Substitua as regras por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para a coleção 'users'
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Regras para a coleção 'cards'
    match /cards/{cardId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.user == request.auth.token.email.split('@')[0];
    }
  }
}
```

3. Clique em **Publish**

### 5. Obter Credenciais do Firebase

1. No menu lateral, clique no ícone de **engrenagem** (⚙️) ao lado de "Project Overview"
2. Clique em **Project settings**
3. Role até a seção **Your apps**
4. Clique no ícone **Web** (`</>`)
5. Registre um app com um nome (ex: "projeto-web")
6. **NÃO** marque a opção "Also set up Firebase Hosting"
7. Clique em **Register app**
8. Copie as credenciais que aparecem (firebaseConfig)

### 6. Configurar o Projeto

1. Abra o arquivo `firebase-config.js` no projeto
2. Substitua os valores com as credenciais que você copiou:

```javascript
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-project-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};
```

## 📁 Estrutura do Projeto

- `index.html` - Página de login
- `register.html` - Página de registro
- `dashboard.html` - Dashboard principal
- `auth.js` - Funções de autenticação (Firebase Auth)
- `dashboard.js` - Lógica do dashboard
- `utils.js` - Funções utilitárias e acesso ao Firestore
- `firebase-config.js` - Configuração do Firebase
- `styles.css` - Estilos CSS

## 🔐 Como Funciona

### Autenticação
- Os usuários se registram com um nome de usuário e senha
- O sistema usa Firebase Authentication para gerenciar autenticação
- O email é gerado automaticamente como `usuario@projeto.com`

### Banco de Dados
- **Coleção `users`**: Armazena informações dos usuários
- **Coleção `cards`**: Armazena os cards de manutenção
- Todos os dados são sincronizados em tempo real com o Firestore

## 🛠️ Funcionalidades

- ✅ Registro e login de usuários
- ✅ Criação de cards de manutenção
- ✅ Edição e exclusão de cards (apenas pelo autor)
- ✅ Filtro por usuário
- ✅ Exportação para PDF
- ✅ Dados sincronizados online

## 📝 Notas Importantes

1. **Segurança**: As regras do Firestore garantem que:
   - Apenas usuários autenticados podem ler/escrever
   - Usuários só podem editar/excluir seus próprios cards

2. **Modo de Teste**: O Firestore está configurado em modo de teste, que permite leitura/escrita por 30 dias. Para produção, ajuste as regras de segurança.

3. **Hosting (Opcional)**: Você pode hospedar o site no Firebase Hosting:
   - Instale Firebase CLI: `npm install -g firebase-tools`
   - Execute: `firebase init hosting`
   - Execute: `firebase deploy`

## 🐛 Solução de Problemas

### Erro: "Firebase: Error (auth/email-already-in-use)"
- O usuário já existe. Use outro nome de usuário ou faça login.

### Erro: "Firebase: Error (auth/user-not-found)"
- O usuário não existe. Verifique se você se registrou primeiro.

### Dados não aparecem
- Verifique se o Firebase está configurado corretamente
- Verifique o console do navegador (F12) para erros
- Certifique-se de que as regras do Firestore estão publicadas

## 📞 Suporte

Se tiver problemas, verifique:
1. Se todas as credenciais do Firebase estão corretas
2. Se Authentication está habilitado
3. Se Firestore está criado e as regras estão publicadas
4. Se há erros no console do navegador (F12)

