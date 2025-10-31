
const logsTemplates = [
  '[ПЕРСОНАЖ №1] згадав щось важливе, але раптом [ПЕРСОНАЖ №2], злякавшись до нестями, вдарив у передпліччя ворога.',
  '[ПЕРСОНАЖ №1] поперхнувся, і за це [ПЕРСОНАЖ №2] від страху врізав прямим ударом коліном у лоб супротивнику.',
  '[ПЕРСОНАЖ №1] замріявся, але в цей час нахабний [ПЕРСОНАЖ №2], прийнявши вольове рішення, тихцем підкрався ззаду й ударив.',
  '[ПЕРСОНАЖ №1] опанував себе, але несподівано [ПЕРСОНАЖ №2] випадково наніс потужний удар.',
  '[ПЕРСОНАЖ №1] поперхнувся, але в цей момент [ПЕРСОНАЖ №2] нехотя розтрощив кулаком <вилучено цензурою> суперника.',
  '[ПЕРСОНАЖ №1] здивувався, а [ПЕРСОНАЖ №2], похитнувшись, вліпив підлий удар.',
  '[ПЕРСОНАЖ №1] висякався, але раптом [ПЕРСОНАЖ №2] провів дроблячий удар.',
  '[ПЕРСОНАЖ №1] похитнувся, і зненацька нахабний [ПЕРСОНАЖ №2] без причини вдарив у ногу противника.',
  '[ПЕРСОНАЖ №1] засмутився, як раптом [ПЕРСОНАЖ №2] випадково врізав ногою в живіт суперника.',
  '[ПЕРСОНАЖ №1] намагався щось сказати, але раптом [ПЕРСОНАЖ №2] від нудьги розбив брову супротивнику.'
];

function getRandomLogTemplate() {
  const index = Math.floor(Math.random() * logsTemplates.length);
  return logsTemplates[index];
}

function formatLog(template, attacker, defender) {
  return template
    .replace(/\[ПЕРСОНАЖ №2\]/g, attacker)
    .replace(/\[ПЕРСОНАЖ №1\]/g, defender);
}

export function addLogEntry(text) {
  const logsContainer = document.getElementById('logs');
  if (!logsContainer) return;
  const line = document.createElement('div');
  line.className = 'log-line';
  line.textContent = text;
  logsContainer.prepend(line);
}

export function getBattleLog(attacker, defender, damage, defenderHP, defenderMaxHP) {
  const template = getRandomLogTemplate();
  const text = formatLog(template, attacker, defender);
  const info = ` ${attacker} завдав ${damage} шкоди → ${defender}: ${defenderHP}/${defenderMaxHP}`;
  addLogEntry(text + info);
}
