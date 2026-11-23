const screens=['home','football','pokedex','games','notes','tools','settings'];
function showScreen(id){
  screens.forEach(name=>{const el=document.getElementById(name);if(el)el.classList.toggle('active',name===id);});
  window.scrollTo({top:0,behavior:'smooth'});
}
function showFootball(section){
  const data={
    players:['👤 Jugadores','Fichas de tus jugadores con foto, nombre, posición, equipo y media general.'],
    teams:['🛡️ Equipos','Tus equipos con escudo, DT, plantel, presupuesto, valor y media general.'],
    coaches:['👔 Entrenadores','Fichas de tus DTs con equipo actual, rating, salario e historial.']
  };
  const item=data[section]||data.players;
  document.getElementById('football-content').innerHTML=`<h3>${item[0]}</h3><p>${item[1]}</p><button class="primary" onclick="alert('Esta sección queda preparada para el próximo desarrollo.')">Continuar</button>`;
}
function showPokedex(){alert('La sección Pokédex ya está habilitada. En el próximo paso podemos conectarla con tu Pokédex de Eonia.');}