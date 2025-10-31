
import Person from './person.js';
import { random, initCounter } from './utils.js';
import { addLogEntry, getBattleLog } from './logs.js';

document.addEventListener('DOMContentLoaded', () => {
  const $btn = document.getElementById('btn-kick');
  const $btn2 = document.getElementById('btn-special');
  const $btn3 = document.getElementById('btn-reset');

  const heroNameEl = document.getElementById('name-character');
  const enemyNameEl = document.getElementById('name-enemy');

  const heroHP = document.getElementById('health-character');
  const heroBar = document.getElementById('progressbar-character');
  const enemyHP = document.getElementById('health-enemy');
  const enemyBar = document.getElementById('progressbar-enemy');

  const character = new Person({
    name: (heroNameEl && heroNameEl.textContent.trim()) || 'Alastor',
    defaultHP: 100,
    elHP: heroHP,
    elProgressbar: heroBar
  });

  const enemy = new Person({
    name: (enemyNameEl && enemyNameEl.textContent.trim()) || 'Lucifer',
    defaultHP: 100,
    elHP: enemyHP,
    elProgressbar: enemyBar
  });

  let kickCounter = initCounter(5, $btn, 'Fight');
  let specialCounter = initCounter(3, $btn2, 'Special');

  function finishBattle(loser) {
    addLogEntry(`${loser.name} програв бій!`);
    $btn.disabled = true;
    $btn2.disabled = true;
    alert(`Бідний ${loser.name} програв бій :)`);
  }

  $btn.addEventListener('click', () => {
    if (!kickCounter()) return;
    const dmgToEnemy = random(20);
    const dmgToCharacter = random(20);

    const resEnemy = enemy.changeHP(dmgToEnemy);
    getBattleLog(character.name, enemy.name, dmgToEnemy, resEnemy.damageHP, resEnemy.defaultHP);

    const resChar = character.changeHP(dmgToCharacter);
    getBattleLog(enemy.name, character.name, dmgToCharacter, resChar.damageHP, resChar.defaultHP);

    if (resEnemy.died) finishBattle(enemy);
    if (resChar.died) finishBattle(character);
  });

  $btn2.addEventListener('click', () => {
    if (!specialCounter()) return;
    const dmgToEnemy = random(50);
    const dmgToCharacter = random(50);

    const resEnemy = enemy.changeHP(dmgToEnemy);
    getBattleLog(character.name, enemy.name, dmgToEnemy, resEnemy.damageHP, resEnemy.defaultHP);

    const resChar = character.changeHP(dmgToCharacter);
    getBattleLog(enemy.name, character.name, dmgToCharacter, resChar.damageHP, resChar.defaultHP);

    if (resEnemy.died) finishBattle(enemy);
    if (resChar.died) finishBattle(character);
  });

  $btn3.addEventListener('click', () => {
    character.reset();
    enemy.reset();

    $btn.disabled = false;
    $btn2.disabled = false;

    const logs = document.getElementById('logs');
    if (logs) logs.innerHTML = '';
    addLogEntry('Бій скинуто!');

    kickCounter = initCounter(5, $btn, 'Fight');
    specialCounter = initCounter(3, $btn2, 'Special');
    console.log('Лічильники оновлено після ресету');
  });

  character.renderHP();
  enemy.renderHP();
  addLogEntry('Бій розпочато!');
});
