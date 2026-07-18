let i = 0;
let ans = new Array(questions.length).fill(null);

const app = document.getElementById("app");

function transition(render){
    app.style.opacity="0";
    app.style.transform="translateY(20px)";
    setTimeout(()=>{
        render();
        app.style.opacity="1";
        app.style.transform="translateY(0)";
    },250);
}

function startScreen(){
    app.innerHTML=`
    <div class="start-screen">
        <h1>Test Finale</h1>
        <p>
            Prenditi il tuo tempo per rispondere!<br>
            Ogni domanda riguarda un argomento trattato nelle lezioni precedenti.<br>
            Se superi il test, ti verrà rilasciato il Certificato di Stregoneria!✨
        </p>
        <button id="startButton">INIZIA</button>
    </div>`;

    document.getElementById("startButton").onclick=()=>{
        i=0;
        transition(draw);
    };
}

function draw(){

    if(i>=questions.length){
        transition(end);
        return;
    }

    const q=questions[i];

    app.innerHTML=`
        <div class="progress-text">Domanda ${i+1} di ${questions.length}</div>
        <h2>${q.question}</h2>
    `;

    q.answers.forEach((text,index)=>{
        const b=document.createElement("button");
        b.className="answer";
        b.textContent=text;

        if(ans[i]===index) b.classList.add("selected");

        b.onclick=()=>{
            ans[i]=index;
            document.querySelectorAll(".answer").forEach(x=>x.classList.remove("selected"));
            b.classList.add("selected");
        };

        app.appendChild(b);
    });

    const nav=document.createElement("div");
    nav.className="nav-buttons";

    const next=document.createElement("button");
    next.textContent=i===questions.length-1?"CONCLUDI":"AVANTI ❯";
    next.onclick=()=>{
        if(ans[i]===null){
            alert("Seleziona una risposta.");
            return;
        }
        i++;
        transition(draw);
    };

    const prev=document.createElement("button");
    prev.textContent="❮ INDIETRO";
    if(i===0) prev.style.visibility="hidden";
    prev.onclick=()=>{
        if(i>0){
            i--;
            transition(draw);
        }
    };

    nav.appendChild(next);
    nav.appendChild(prev);
    app.appendChild(nav);
}

function end(){

    let score=0;

    ans.forEach((a,n)=>{
        if(a===questions[n].correct) score++;
    });

    if(score>=6){
        app.innerHTML=`
        <div class="result">
            <h1>🎉 Complimenti!</h1>
            <br><p>Hai risposto correttamente a <b>${score}</b> domande su <b>${questions.length}</b>.</p>
            <a href="download/pdf.pdf" download>
                <button>📜 Scarica il Certificato</button>
            </a>
        </div>`;
    }else{
        app.innerHTML=`
        <div class="result">
            <h2>📚 Test non superato</h2>
            <p>Hai risposto correttamente a <b>${score}</b> domande su <b>${questions.length}</b>.</p>
            <p>Devi ottenere almeno <b>6 risposte corrette su ${questions.length}</b>.</p>
            <br><button id="retryButton">🔄 Ritenta il test</button>
        </div>`;

        document.getElementById("retryButton").onclick=()=>{
            i=0;
            ans=new Array(questions.length).fill(null);
            transition(startScreen);
        };
    }
}

app.style.transition="opacity .25s ease, transform .25s ease";
startScreen();
