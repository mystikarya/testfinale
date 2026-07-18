let i = 0;
let ans = new Array(questions.length).fill(null);

const app = document.getElementById("app");

function startScreen() {

    app.innerHTML = `
        <div class="start-screen">

            <h1>Test Finale</h1>

            <p>
                Prenditi il tuo tempo per rispondere!<br>
                Ogni domanda riguarda un argomento trattato nelle lezioni precedenti.
                Se superi il test, ti verrà rilasciato il
                <strong>Certificato di Stregoneria!</strong> ✨
            </p>

            <button id="startButton">INIZIA</button>

        </div>
    `;

    document.getElementById("startButton").onclick = () => {
        i = 0;
        draw();
    };

}

function draw() {

    if (i >= questions.length) {
        end();
        return;
    }

    let q = questions[i];

    app.innerHTML = `
        <div class="progress-text">
            Domanda ${i + 1} di ${questions.length}
        </div>

        <h2>${q.question}</h2>
    `;

    // Risposte
    q.answers.forEach((a, n) => {

        const b = document.createElement("button");

        b.className = "answer";

        if (ans[i] === n) {
            b.classList.add("selected");
        }

        b.textContent = a;

        b.onclick = () => {
            ans[i] = n;
            draw();
        };

        app.appendChild(b);

    });

    // Contenitore pulsanti
    const nav = document.createElement("div");
    nav.className = "nav-buttons";

    // Pulsante Avanti
    const next = document.createElement("button");

    next.textContent =
        i === questions.length - 1
            ? "Concludi"
            : "Avanti ➜";

    next.onclick = () => {

        if (ans[i] === null) {

            alert("Seleziona una risposta.");

            return;

        }

        i++;

        draw();

    };

    // Pulsante Indietro
    const prev = document.createElement("button");

    prev.textContent = "⬅ Indietro";

    if (i === 0) {
        prev.style.visibility = "hidden";
    }

    prev.onclick = () => {

        if (i > 0) {

            i--;

            draw();

        }

    };

    // Ordine: Avanti sopra, Indietro sotto
    nav.appendChild(next);
    nav.appendChild(prev);

    app.appendChild(nav);

}

function end() {

    let s = 0;

    ans.forEach((a, n) => {

        if (a === questions[n].correct) {

            s++;

        }

    });

    if (s >= 6) {

        app.innerHTML = `
            <h2>🎉 Complimenti!</h2>

            <p>
                Hai risposto correttamente a
                <b>${s}</b> domande su
                <b>${questions.length}</b>.
            </p>

            <a href="download/pdf.pdf" download>
                <button>📜 Scarica il Certificato</button>
            </a>
        `;

    } else {

        app.innerHTML = `
            <h2>📚 Test non superato</h2>

            <p>
                Hai risposto correttamente a
                <b>${s}</b> domande su
                <b>${questions.length}</b>.
            </p>

            <p>
                Devi ottenere almeno
                <b>6 risposte corrette su ${questions.length}</b>.
            </p>

            <br><button onclick="location.reload()">
                🔄 Ritenta il test
            </button>
        `;

    }

}

startScreen();