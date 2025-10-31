
export function random(max) {
  return Math.ceil(Math.random() * max);
}

export function initCounter(limit, button, baseLabel) {
  let count = 0;
  const updateLabel = () => {
    if (button) button.textContent = `${baseLabel} (залишилось: ${Math.max(limit - count, 0)})`;
  };
  updateLabel();
  return function () {
    if (count < limit) {
      count++;
      updateLabel();
      if (count >= limit && button) button.disabled = true;
      return true;
    }
    alert('Ліміт натискань досягнуто!');
    return false;
  };
}
