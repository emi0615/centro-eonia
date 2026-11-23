const KEY="centroEoniaFootballV3";
let data=JSON.parse(localStorage.getItem(KEY)||"null")||{
 players:[],
 teams:[],
 coaches:[]
};
function save(){localStorage.setItem(KEY,JSON.stringify(data))}
function showPage(id){
 document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
 document.getElementById(id)?.classList.add("active");
 if(id==="football"){footballTab("players");refreshFilters();renderPlayers();renderTeams();renderCoaches();}
 window.scrollTo({top:0,behavior:"smooth"});
}
function footballTab(tab){
 document.querySelectorAll(".football-tab").forEach(x=>x.classList.remove("active"));
 document.getElementById(tab+"Tab")?.classList.add("active");
}
function refreshFilters(){
 const teamOptions=data.teams.map(t=>`<option value="${esc(t.id)}">${esc(t.name)}</option>`).join("");
 document.getElementById("playerTeamFilter").innerHTML='<option value="">Todos los equipos</option>'+teamOptions;
 document.getElementById("coachTeamFilter").innerHTML='<option value="">Todos los equipos</option>'+teamOptions;
 const coachOptions=data.coaches.map(c=>`<option value="${esc(c.id)}">${esc(c.first+" "+c.last)}</option>`).join("");
 document.getElementById("teamCoachFilter").innerHTML='<option value="">Todos los DT</option>'+coachOptions;
}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function teamName(id){return data.teams.find(t=>t.id===id)?.name||"Sin equipo"}
function coachName(id){const c=data.coaches.find(x=>x.id===id);return c?`${c.first} ${c.last}`:"Sin DT"}
function renderPlayers(){
 const q=(document.getElementById("playerSearch")?.value||"").toLowerCase();
 const pos=document.getElementById("playerPosition")?.value||"";
 const team=document.getElementById("playerTeamFilter")?.value||"";
 const arr=data.players.filter(p=>(`${p.first} ${p.last}`.toLowerCase().includes(q))&&(!pos||p.position===pos)&&(!team||p.team===team));
 document.getElementById("playersList").innerHTML=arr.length?arr.map(p=>`
 <div class="card"><div class="card-top"><div><h3>${esc(p.first)} ${esc(p.last)}</h3><div class="muted">${esc(p.nationality||"Sin nacionalidad")} · ${esc(p.position||"Sin posición")} · Nº ${esc(p.number||"-")}</div></div><div class="rating">${esc(p.overall||"-")}</div></div>
 <div><span class="tag">${esc(teamName(p.team))}</span><span class="tag">${esc(p.foot||"Pie no indicado")}</span><span class="tag">Pot. ${esc(p.potential||"-")}</span></div>
 <div class="muted">Edad: ${esc(p.age||"-")} · Valor: ${esc(p.value||"-")} · Salario: ${esc(p.salary||"-")}</div>
 <div class="actions"><button onclick="openPlayerForm('${p.id}')">Editar</button><button class="danger" onclick="deleteItem('players','${p.id}')">Eliminar</button></div></div>`).join(""):`<div class="empty-panel"><div>👤</div><h3>No hay jugadores</h3><p>Creá el primero para empezar tu base de datos.</p></div>`;
}
function renderTeams(){
 const q=(document.getElementById("teamSearch")?.value||"").toLowerCase();
 const coach=document.getElementById("teamCoachFilter")?.value||"";
 const arr=data.teams.filter(t=>t.name.toLowerCase().includes(q)&&(!coach||t.coach===coach));
 document.getElementById("teamsList").innerHTML=arr.length?arr.map(t=>`
 <div class="card"><div class="card-top"><div><h3>🛡️ ${esc(t.name)}</h3><div class="muted">${esc(t.country||"Sin país")} · Fundación ${esc(t.founded||"-")}</div></div><div class="rating">${esc(t.overall||"-")}</div></div>
 <div><span class="tag">DT: ${esc(coachName(t.coach))}</span><span class="tag">Presupuesto: ${esc(t.budget||"-")}</span><span class="tag">Valor: ${esc(t.value||"-")}</span></div>
 <div class="muted">Jugadores: ${data.players.filter(p=>p.team===t.id).length}</div>
 <div class="actions"><button onclick="openTeamForm('${t.id}')">Editar</button><button class="danger" onclick="deleteItem('teams','${t.id}')">Eliminar</button></div></div>`).join(""):`<div class="empty-panel"><div>🛡️</div><h3>No hay equipos</h3><p>Creá un equipo para empezar.</p></div>`;
}
function renderCoaches(){
 const q=(document.getElementById("coachSearch")?.value||"").toLowerCase();
 const team=document.getElementById("coachTeamFilter")?.value||"";
 const arr=data.coaches.filter(c=>`${c.first} ${c.last}`.toLowerCase().includes(q)&&(!team||c.team===team));
 document.getElementById("coachesList").innerHTML=arr.length?arr.map(c=>`
 <div class="card"><div class="card-top"><div><h3>👔 ${esc(c.first)} ${esc(c.last)}</h3><div class="muted">${esc(c.nationality||"Sin nacionalidad")} · ${esc(c.age||"-")} años</div></div><div class="rating">${esc(c.rating||"-")}</div></div>
 <div><span class="tag">Equipo: ${esc(teamName(c.team))}</span><span class="tag">Salario: ${esc(c.salary||"-")}</span></div>
 <div class="muted">PJ ${esc(c.matches||0)} · G ${esc(c.wins||0)} · E ${esc(c.draws||0)} · P ${esc(c.losses||0)} · Títulos ${esc(c.titles||0)}</div>
 <div class="actions"><button onclick="openCoachForm('${c.id}')">Editar</button><button class="danger" onclick="deleteItem('coaches','${c.id}')">Eliminar</button></div></div>`).join(""):`<div class="empty-panel"><div>👔</div><h3>No hay entrenadores</h3><p>Creá el primero para empezar.</p></div>`;
}
function modal(title,body){document.getElementById("modalContent").innerHTML=`<h2>${title}</h2>${body}`;document.getElementById("modal").classList.remove("hidden")}
function closeModal(){document.getElementById("modal").classList.add("hidden")}
function field(label,name,value="",type="text",full=false){return `<label class="${full?"full":""}">${label}<input name="${name}" type="${type}" value="${esc(value)}"></label>`}
function selectField(label,name,options,value="",full=false){return `<label class="${full?"full":""}">${label}<select name="${name}">${options.map(o=>`<option value="${esc(o.value)}" ${o.value===value?"selected":""}>${esc(o.label)}</option>`).join("")}</select></label>`}
function openPlayerForm(id=""){
 const p=data.players.find(x=>x.id===id)||{};
 const teams=[{value:"",label:"Sin equipo"},...data.teams.map(t=>({value:t.id,label:t.name}))];
 modal(id?"Editar jugador":"Crear jugador",`<form onsubmit="submitPlayer(event,'${id}')"><div class="form-grid">
 ${field("Nombre","first",p.first)}${field("Apellido","last",p.last)}${field("Edad","age",p.age,"number")}${field("Nacionalidad","nationality",p.nationality)}
 ${field("Número","number",p.number,"number")}${selectField("Posición","position",["POR","DEF","MED","DEL"].map(x=>({value:x,label:x})),p.position)}
 ${selectField("Pie dominante","foot",["Derecho","Izquierdo","Ambidiestro"].map(x=>({value:x,label:x})),p.foot)}${field("Media general","overall",p.overall,"number")}
 ${field("Potencial","potential",p.potential,"number")}${selectField("Equipo actual","team",teams,p.team)}
 ${field("DT","coach",p.coach||"")}${field("Valor","value",p.value)}${field("Salario","salary",p.salary)}
 ${field("Partidos","matches",p.matches||0,"number")}${field("Goles","goals",p.goals||0,"number")}
 ${field("Asistencias","assists",p.assists||0,"number")}${field("Tarjetas","cards",p.cards||0,"number")}
 ${field("Lesiones","injuries",p.injuries||0,"number")}${field("Historial de equipos","history",p.history||"","text",true)}
 </div><div class="form-actions"><button type="button" onclick="closeModal()">Cancelar</button><button class="save" type="submit">Guardar</button></div></form>`);
}
function submitPlayer(e,id){e.preventDefault();const f=new FormData(e.target);const p=Object.fromEntries(f.entries());p.id=id||crypto.randomUUID();const i=data.players.findIndex(x=>x.id===p.id);if(i>=0)data.players[i]=p;else data.players.push(p);save();closeModal();refreshFilters();renderPlayers();renderTeams()}
function openTeamForm(id=""){
 const t=data.teams.find(x=>x.id===id)||{};
 const coaches=[{value:"",label:"Sin DT"},...data.coaches.map(c=>({value:c.id,label:`${c.first} ${c.last}`}))];
 modal(id?"Editar equipo":"Crear equipo",`<form onsubmit="submitTeam(event,'${id}')"><div class="form-grid">
 ${field("Nombre","name",t.name)}${selectField("DT","coach",coaches,t.coach)}${field("Valoración general","overall",t.overall,"number")}${field("Presupuesto","budget",t.budget)}
 ${field("Valor del equipo","value",t.value)}${field("País","country",t.country)}${field("Año de fundación","founded",t.founded,"number")}${field("Escudo / URL de imagen","crest",t.crest)}
 ${field("Historial","history",t.history||"","text",true)}
 </div><div class="form-actions"><button type="button" onclick="closeModal()">Cancelar</button><button class="save" type="submit">Guardar</button></div></form>`);
}
function submitTeam(e,id){e.preventDefault();const f=new FormData(e.target);const t=Object.fromEntries(f.entries());t.id=id||crypto.randomUUID();const i=data.teams.findIndex(x=>x.id===t.id);if(i>=0)data.teams[i]=t;else data.teams.push(t);save();closeModal();refreshFilters();renderPlayers();renderTeams();renderCoaches()}
function openCoachForm(id=""){
 const c=data.coaches.find(x=>x.id===id)||{};
 const teams=[{value:"",label:"Sin equipo"},...data.teams.map(t=>({value:t.id,label:t.name}))];
 modal(id?"Editar entrenador":"Crear entrenador",`<form onsubmit="submitCoach(event,'${id}')"><div class="form-grid">
 ${field("Nombre","first",c.first)}${field("Apellido","last",c.last)}${field("Edad","age",c.age,"number")}${field("Nacionalidad","nationality",c.nationality)}
 ${selectField("Equipo actual","team",teams,c.team)}${field("Valoración","rating",c.rating,"number")}${field("Salario","salary",c.salary)}${field("Partidos","matches",c.matches||0,"number")}
 ${field("Victorias","wins",c.wins||0,"number")}${field("Empates","draws",c.draws||0,"number")}${field("Derrotas","losses",c.losses||0,"number")}${field("Títulos","titles",c.titles||0,"number")}
 ${field("Historial de equipos","history",c.history||"","text",true)}${field("Foto / URL de imagen","photo",c.photo,"text",true)}
 </div><div class="form-actions"><button type="button" onclick="closeModal()">Cancelar</button><button class="save" type="submit">Guardar</button></div></form>`);
}
function submitCoach(e,id){e.preventDefault();const f=new FormData(e.target);const c=Object.fromEntries(f.entries());c.id=id||crypto.randomUUID();const i=data.coaches.findIndex(x=>x.id===c.id);if(i>=0)data.coaches[i]=c;else data.coaches.push(c);save();closeModal();refreshFilters();renderPlayers();renderTeams();renderCoaches()}
function deleteItem(type,id){if(!confirm("¿Eliminar este registro?"))return;data[type]=data[type].filter(x=>x.id!==id);if(type==="teams")data.players.forEach(p=>{if(p.team===id)p.team=""});if(type==="coaches")data.teams.forEach(t=>{if(t.coach===id)t.coach=""});save();refreshFilters();renderPlayers();renderTeams();renderCoaches()}
document.addEventListener("DOMContentLoaded",()=>{showPage("home")});
