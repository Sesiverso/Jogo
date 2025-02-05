// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBCiQrrtx-69rppeMRY07PZokkatjNd3rI",
    authDomain: "jogo-bae80.firebaseapp.com",
    databaseURL: "https://jogo-bae80-default-rtdb.firebaseio.com",
    projectId: "jogo-bae80",
    storageBucket: "jogo-bae80.firebasestorage.app",
    messagingSenderId: "799584591971",
    appId: "1:799584591971:web:4c6026c9430ffdc724d856",
    measurementId: "G-1MJ1SHWYLX"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Criar uma nova partida
function criarPartida() {
    let partidaID = Date.now().toString();
    db.ref("partidas/" + partidaID).set({ jogador1: "Aguardando", jogador2: "Aguardando" });
}

// Listar partidas ativas
function listarPartidas() {
    const lista = document.getElementById("partidas");
    if (!lista) return;
    
    lista.innerHTML = "";
    db.ref("partidas").on("value", snapshot => {
        snapshot.forEach(partida => {
            let partidaID = partida.key;
            let dados = partida.val();
            let li = document.createElement("li");
            li.innerHTML = `Partida ${partidaID} - Jogadores: ${dados.jogador1}, ${dados.jogador2} 
                            <button onclick="entrarPartida('${partidaID}')">Entrar</button>`;
            lista.appendChild(li);
        });
    });
}

// Entrar em uma partida
function entrarPartida(partidaID) {
    let ref = db.ref("partidas/" + partidaID);
    ref.once("value").then(snapshot => {
        let partida = snapshot.val();
        if (partida.jogador1 === "Aguardando") {
            ref.update({ jogador1: "Jogador 1" });
        } else if (partida.jogador2 === "Aguardando") {
            ref.update({ jogador2: "Jogador 2" }).then(() => {
                window.location.href = `jogo.html?partida=${partidaID}`;
            });
        }
    });
}

// Monitorar o status da partida no jogo.html
function monitorarPartida() {
    const urlParams = new URLSearchParams(window.location.search);
    const partidaID = urlParams.get("partida");
    const statusEl = document.getElementById("status");
    
    if (partidaID && statusEl) {
        db.ref("partidas/" + partidaID).on("value", snapshot => {
            let partida = snapshot.val();
            if (partida.jogador1 !== "Aguardando" && partida.jogador2 !== "Aguardando") {
                statusEl.innerText = "O jogo começou!";
            }
        });
    }
}

// Voltar ao menu principal
function voltarMenu() {
    window.location.href = "index.html";
}

// Atualizar lista de partidas no index.html
listarPartidas();
monitorarPartida();
