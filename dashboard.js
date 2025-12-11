window.onload = async () => {
    // Verificar autenticação
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            window.location = "index.html";
        } else {
            // Garantir que o username está salvo
            if (!getLoggedUser()) {
                const userDoc = await db.collection("users").doc(user.uid).get();
                if (userDoc.exists) {
                    const username = userDoc.data().username;
                    localStorage.setItem("loggedUser", username);
                }
            }
            loadUserFilter();
            loadCards();
        }
    });
};

async function loadUserFilter() {
    const users = await getUsers();
    const sel = document.getElementById("filterUser");
    sel.innerHTML = "<option value=''>Todos</option>";

    users.forEach(u => {
        const op = document.createElement("option");
        op.value = u.user;
        op.textContent = u.user;
        sel.appendChild(op);
    });
}

async function addCard() {
    const newCard = {
        user: getLoggedUser(),
        tipo: document.getElementById("tipo").value,
        escopo: document.getElementById("escopo").value,
        custo: Number(document.getElementById("custo").value),
        prazo: Number(document.getElementById("prazo").value),
        obs: document.getElementById("obs").value,
        editing: false
    };

    if (!newCard.tipo || !newCard.escopo) {
        alert("Preencha pelo menos o tipo e o escopo!");
        return;
    }

    try {
        await addCardToFirestore(newCard);
        
        // Limpar formulário
        document.getElementById("tipo").value = "";
        document.getElementById("escopo").value = "";
        document.getElementById("custo").value = "";
        document.getElementById("prazo").value = "";
        document.getElementById("obs").value = "";
        
        await loadCards();
    } catch (error) {
        console.error("Erro ao adicionar card:", error);
        alert("Erro ao criar card. Tente novamente.");
    }
}

async function loadCards() {
    const filter = document.getElementById("filterUser")?.value || "";
    const cards = await getCards();
    const logged = getLoggedUser();

    const container = document.getElementById("cardsContainer");
    if (!container) return;
    
    container.innerHTML = "";

    if (cards.length === 0) {
        container.innerHTML = "<p>Nenhum card encontrado.</p>";
        return;
    }

    cards
        .filter(c => !filter || c.user === filter)
        .forEach(card => {
            const div = document.createElement("div");
            div.className = "card";

            if (window.editingCardId === card.id) {
                div.classList.add("editing");
                div.innerHTML = `
                    <h4>${card.tipo}</h4>

                    <label>Escopo</label>
                    <textarea id="edit-escopo-${card.id}">${card.escopo}</textarea>

                    <label>Custo (R$)</label>
                    <input type="number" step="0.01" id="edit-custo-${card.id}" value="${card.custo}">

                    <label>Prazo (dias)</label>
                    <input type="number" id="edit-prazo-${card.id}" value="${card.prazo}">

                    <label>Observações</label>
                    <textarea id="edit-obs-${card.id}">${card.obs}</textarea>

                    <button onclick="saveEdit('${card.id}')">Salvar</button>
                    <button onclick="cancelEdit('${card.id}')">Cancelar</button>
                `;
            } else {
                div.innerHTML = `
                    <h4>${card.tipo}</h4>

                    <div class="card-row">
                        <span class="card-label">Escopo:</span>
                        <span class="card-value">${card.escopo}</span>
                    </div>

                    <div class="card-row">
                        <span class="card-label">Custo:</span>
                        <span class="card-value">${formatarCusto(Number(card.custo))}</span>
                    </div>

                    <div class="card-row">
                        <span class="card-label">Prazo:</span>
                        <span class="card-value">${card.prazo} dias</span>
                    </div>

                    <div class="card-row">
                        <span class="card-label">Observações:</span>
                        <span class="card-value">${card.obs}</span>
                    </div>

                    <small>Criado em: ${card.created}</small><br>
                    <small>Autor: ${card.user}</small><br>
                `;
            }

            if (card.user === logged && window.editingCardId !== card.id) {
                const btnEdit = document.createElement("button");
                btnEdit.textContent = "Editar";
                btnEdit.onclick = () => editCard(card.id);

                const btnDel = document.createElement("button");
                btnDel.textContent = "Excluir";
                btnDel.onclick = () => deleteCard(card.id);

                div.appendChild(btnEdit);
                div.appendChild(btnDel);
            }

            container.appendChild(div);
        });
}

async function deleteCard(id) {
    if (!confirm("Tem certeza que deseja excluir este card?")) {
        return;
    }
    
    try {
        await deleteCardFromFirestore(id);
        await loadCards();
    } catch (error) {
        console.error("Erro ao deletar card:", error);
        alert("Erro ao excluir card. Tente novamente.");
    }
}

async function editCard(id) {
    // Armazenar o ID do card sendo editado
    window.editingCardId = id;
    await loadCards();
}

async function saveEdit(id) {
    const updates = {
        escopo: document.getElementById(`edit-escopo-${id}`).value,
        custo: Number(document.getElementById(`edit-custo-${id}`).value),
        prazo: Number(document.getElementById(`edit-prazo-${id}`).value),
        obs: document.getElementById(`edit-obs-${id}`).value
    };

    try {
        await updateCardInFirestore(id, updates);
        window.editingCardId = null;
        await loadCards();
    } catch (error) {
        console.error("Erro ao salvar edição:", error);
        alert("Erro ao salvar alterações. Tente novamente.");
    }
}

async function cancelEdit(id) {
    window.editingCardId = null;
    await loadCards();
}

async function exportarPDF() {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();
    let y = 10; // posição vertical

    const cards = await getCards();

    doc.setFontSize(18);
    doc.text("Relação de Manutenções", 10, y);
    y += 10;

    doc.setFontSize(12);

    cards.forEach(card => {
        doc.text(`Tipo: ${card.tipo}`, 10, y); y += 7;
        doc.text(`Escopo: ${card.escopo}`, 10, y); y += 7;
        doc.text(`Custo: R$ ${card.custo}`, 10, y); y += 7;
        doc.text(`Prazo: ${card.prazo} dias`, 10, y); y += 7;
        doc.text(`Observações: ${card.obs}`, 10, y); y += 7;
        doc.text(`Criado em: ${card.created}`, 10, y); y += 7;
        doc.text(`Autor: ${card.user}`, 10, y); y += 10;

        if (y > 270) {
            doc.addPage();
            y = 10;
        }
    });

    doc.save("manutencoes.pdf");
}
