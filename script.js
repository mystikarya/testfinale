
let i=0,ans=new Array(questions.length).fill(null);
const app=document.getElementById("app");
function draw(){
 if(i>=questions.length){return end();}
 let q=questions[i];
 app.innerHTML=`<h2>Domanda ${i+1} di ${questions.length}</h2><h3>${q.question}</h3>`;
 q.answers.forEach((a,n)=>{
   let b=document.createElement("button");
   b.className="answer"+(ans[i]===n?" selected":"");
   b.textContent=a;
   b.onclick=()=>{ans[i]=n;draw();}
   app.appendChild(b);
 });
 let next=document.createElement("button");
 next.textContent=i===questions.length-1?"Concludi":"Avanti";
 next.onclick=()=>{if(ans[i]==null){alert("Seleziona una risposta");return;} i++; draw();};
 app.appendChild(next);
}
function end(){
 let s=0;
 ans.forEach((a,n)=>{if(a===questions[n].correct)s++;});
 if(s>=11){
 app.innerHTML=`<h2>🎉 Complimenti!</h2>
 <p>Hai risposto correttamente a <b>${s}</b> domande su ${questions.length}.</p>
 <a href="download/pdf.pdf" download><button>📥 Scarica il PDF</button></a>`;
 }else{
 app.innerHTML=`<h2>📚 Test non superato</h2>
 <p>Hai risposto correttamente a <b>${s}</b> domande su ${questions.length}.</p>
 <button onclick="location.reload()">🔄 Ritenta il test</button>`;
 }
}
draw();
