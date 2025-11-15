
import Person from './person.js';
import { random, initCounter } from './utils.js';
import { addLogEntry, getBattleLog } from './logs.js';
import { pokemons } from './hazbin.js'; 


function capitalizeWords(str = '') {
  return str
    .split(' ')
    .map(s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '')
    .join(' ');
}
function randomBetween(min = 0, max = 0) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function deepCopy(o) { return JSON.parse(JSON.stringify(o)); }


function ensureAttacksContainer(beforeEl, id) {
  let container = document.getElementById(id);
  if (!container) {
    container = document.createElement('div');
    container.id = id;
    container.className = 'attacks-container';
    if (beforeEl && beforeEl.parentNode) {
      beforeEl.parentNode.insertBefore(container, beforeEl);
    } else {
      document.body.appendChild(container);
    }
  } else {
    container.innerHTML = '';
  }
  return container;
}


function renderAttackButtons(attacks, actorPerson, targetPerson, containerEl, onAfterAction) {
  containerEl.innerHTML = '';
  attacks.forEach((attack) => {
    const btn = document.createElement('button');
  
    btn.className = `attack-btn button`;
    const niceName = capitalizeWords(attack.name);
    btn.textContent = `${niceName} (${attack.maxCount ?? '∞'})`;
    if (typeof attack.maxCount === 'number' && attack.maxCount <= 0) btn.disabled = true;

    btn.addEventListener('click', () => {
      if (typeof attack.maxCount === 'number' && attack.maxCount <= 0) return;

      const minD = attack.minDamage ?? 0;
      const maxD = attack.maxDamage ?? 0;
      const dmg = randomBetween(minD, maxD);

      
      const res = targetPerson.changeHP(dmg);
      
      if (typeof targetPerson.renderHP === 'function') targetPerson.renderHP();

      getBattleLog(actorPerson.name, targetPerson.name, dmg, res.damageHP, res.defaultHP);
      addLogEntry(`${actorPerson.name} использовал ${niceName} и нанёс ${dmg} урона ${targetPerson.name}`);

     
      if (typeof attack.maxCount === 'number') {
        attack.maxCount = Math.max(0, attack.maxCount - 1);
      }

      
      if (typeof onAfterAction === 'function') onAfterAction();

      
      if (res.died) {
        finishBattle(targetPerson);
        return;
      }
    });

    containerEl.appendChild(btn);
  });
}


let $btnGlobal, $btn2Global;
function finishBattle(loser) {
  addLogEntry(`${loser.name} програв бій!`);
  document.querySelectorAll('.attack-btn').forEach(b => b.disabled = true);
  if ($btnGlobal) $btnGlobal.disabled = true;
  if ($btn2Global) $btn2Global.disabled = true;
  alert(`Бідний ${loser.name} програв бій :)`);
}


document.addEventListener('DOMContentLoaded', () => {
  const $btn = document.getElementById('btn-kick');
  const $btn2 = document.getElementById('btn-special');
  const $btn3 = document.getElementById('btn-reset');
  $btnGlobal = $btn; $btn2Global = $btn2;

  const heroNameEl = document.getElementById('name-character');
  const enemyNameEl = document.getElementById('name-enemy');

  const heroHP = document.getElementById('health-character');
  const heroBar = document.getElementById('progressbar-character');
  const enemyHP = document.getElementById('health-enemy');
  const enemyBar = document.getElementById('progressbar-enemy');

  const heroImgEl = document.getElementById('img-character');
  const enemyImgEl = document.getElementById('img-enemy');

  
  const attacksHeroContainer = ensureAttacksContainer($btn, 'attacks-character');
  
  let enemySection = document.querySelector('.pokemon.enemy') || document.body;
 const attacksEnemyContainer = document.getElementById('attacks-enemy') || (() => {
  const c = document.createElement('div');
  c.id = 'attacks-enemy';
  c.className = 'attacks-container enemy-attacks';
  
  attacksHeroContainer.parentNode.insertBefore(c, attacksHeroContainer.nextSibling);
  return c;
})();


  
  const heroData = pokemons.find(p => p.name === 'Alastor') || pokemons[0];
  let enemyData = pokemons.find(p => p.name === 'Lucifer') || pokemons.find(p => p.name !== heroData.name);

  
  let character = new Person({
    name: (heroNameEl && heroNameEl.textContent.trim()) || heroData.name,
    defaultHP: heroData.hp || 100,
    elHP: heroHP,
    elProgressbar: heroBar
  });
  let enemy = new Person({
    name: (enemyNameEl && enemyNameEl.textContent.trim()) || enemyData.name,
    defaultHP: enemyData.hp || 100,
    elHP: enemyHP,
    elProgressbar: enemyBar
  });

  
  let heroAttacks = deepCopy(heroData.attacks || []);
  let enemyAttacks = deepCopy(enemyData.attacks || []);

  
 function refreshHeroButtons() {
  renderAttackButtons(heroAttacks, character, enemy, attacksHeroContainer, () => {
   
    renderAttackButtons(heroAttacks, character, enemy, attacksHeroContainer, refreshHeroButtons);

    const available = enemyAttacks.filter(a => typeof a.maxCount !== 'number' || a.maxCount > 0);
    const pool = available.length ? available : enemyAttacks;
    if (pool.length) {
      const enemyAttack = pool[Math.floor(Math.random() * pool.length)];
      addLogEntry(`${enemy.name} (авто) выбрал атаку ${capitalizeWords(enemyAttack.name)}`);

      if (typeof enemyAttack.maxCount === 'number') {
        enemyAttack.maxCount = Math.max(0, enemyAttack.maxCount - 1);
      }
    }

    refreshEnemyButtons();


    if (enemy.HP <= 0) finishBattle(enemy);
  });
}

function refreshEnemyButtons() {
  renderAttackButtons(enemyAttacks, enemy, character, attacksEnemyContainer, () => {

    renderAttackButtons(enemyAttacks, enemy, character, attacksEnemyContainer, refreshEnemyButtons);

    if (typeof character.renderHP === 'function') character.renderHP();
    if (typeof enemy.renderHP === 'function') enemy.renderHP();

  });
}



  if (heroNameEl) heroNameEl.textContent = heroData.name;
  if (enemyNameEl) enemyNameEl.textContent = enemyData.name;
  if (heroImgEl && heroData.img) { heroImgEl.src = heroData.img; heroImgEl.alt = heroData.name; }
  if (enemyImgEl && enemyData.img) { enemyImgEl.src = enemyData.img; enemyImgEl.alt = enemyData.name; }

  if (heroImgEl) heroImgEl.onerror = () => { console.error('Hero image load failed', heroImgEl.src); heroImgEl.src = 'assets/placeholder.png'; };
  if (enemyImgEl) enemyImgEl.onerror = () => { console.error('Enemy image load failed', enemyImgEl.src); enemyImgEl.src = 'assets/placeholder.png'; };

 
  if ($btn) $btn.style.display = 'none';
  if ($btn2) $btn2.style.display = 'none';

  character.renderHP();
  enemy.renderHP();
  refreshHeroButtons();
  refreshEnemyButtons();

  addLogEntry('Бій розпочато!');

  $btn3.addEventListener('click', () => {
    const others = pokemons.filter(p => p.name !== heroData.name);
    const newEnemyData = others[Math.floor(Math.random() * others.length)];
    enemyData = newEnemyData;

    enemy = new Person({
      name: newEnemyData.name,
      defaultHP: newEnemyData.hp || 100,
      elHP: enemyHP,
      elProgressbar: enemyBar
    });

    enemyAttacks = deepCopy(newEnemyData.attacks || []);

    character.reset();
    heroAttacks = deepCopy(heroData.attacks || []);

    if (enemyNameEl) enemyNameEl.textContent = newEnemyData.name;
    if (enemyImgEl && newEnemyData.img) enemyImgEl.src = `${newEnemyData.img}?t=${Date.now()}`;

    character.renderHP();
    enemy.renderHP();
    refreshHeroButtons();
    refreshEnemyButtons();

    const logs = document.getElementById('logs');
    if (logs) logs.innerHTML = '';
    addLogEntry(`Противник змінений на ${newEnemyData.name}. Бій скинуто!`);
    console.log('Противник змінений:', newEnemyData.name);
  });

}); 
