
export default class Person {
  constructor({ name = 'Unknown', defaultHP = 100, elHP = null, elProgressbar = null } = {}) {
    this.name = name;
    this.defaultHP = defaultHP;
    this.damageHP = defaultHP;
    this.elHP = elHP;
    this.elProgressbar = elProgressbar;
  }

  renderHP() {
    if (this.elHP) this.elHP.innerText = `${this.damageHP} / ${this.defaultHP}`;
    if (this.elProgressbar) this.elProgressbar.style.width = `${this.damageHP}%`;
  }

  changeHP(damage) {
    this.damageHP -= damage;
    if (this.damageHP <= 0) {
      this.damageHP = 0;
      this.renderHP();
      return { died: true, damageHP: this.damageHP, defaultHP: this.defaultHP, damage };
    }
    this.renderHP();
    return { died: false, damageHP: this.damageHP, defaultHP: this.defaultHP, damage };
  }

  reset() {
    this.damageHP = this.defaultHP;
    this.renderHP();
  }
}
