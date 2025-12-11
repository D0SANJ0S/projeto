// Função para obter o usuário logado
function getLoggedUser() {
    return localStorage.getItem("loggedUser");
}

// Função para obter cards do Firestore
async function getCards() {
    try {
        const snapshot = await db.collection("cards").orderBy("created", "desc").get();
        const cards = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            cards.push({
                id: doc.id,
                ...data,
                created: data.created ? data.created.toDate().toLocaleString() : new Date().toLocaleString()
            });
        });
        return cards;
    } catch (error) {
        console.error("Erro ao buscar cards:", error);
        return [];
    }
}

// Função para salvar cards no Firestore
async function saveCards(cards) {
    // Esta função não é mais usada diretamente
    // Os cards são salvos individualmente através de addCard, editCard, etc.
    console.warn("saveCards() está obsoleta. Use as funções específicas do dashboard.js");
}

// Função para adicionar um card no Firestore
async function addCardToFirestore(card) {
    try {
        const docRef = await db.collection("cards").add({
            ...card,
            created: firebase.firestore.FieldValue.serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Erro ao adicionar card:", error);
        throw error;
    }
}

// Função para atualizar um card no Firestore
async function updateCardInFirestore(cardId, updates) {
    try {
        await db.collection("cards").doc(cardId).update(updates);
    } catch (error) {
        console.error("Erro ao atualizar card:", error);
        throw error;
    }
}

// Função para deletar um card do Firestore
async function deleteCardFromFirestore(cardId) {
    try {
        await db.collection("cards").doc(cardId).delete();
    } catch (error) {
        console.error("Erro ao deletar card:", error);
        throw error;
    }
}

// Função para obter lista de usuários do Firestore
async function getUsers() {
    try {
        const snapshot = await db.collection("users").get();
        const users = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.username) {
                users.push({ user: data.username });
            }
        });
        return users;
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        return [];
    }
}

function formatarCusto(valor) {
    if (valor === undefined || valor === null || isNaN(valor)) return "R$ 0,00";

    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}
