const inputs = [...document.querySelectorAll("input")];
const width = 30;
const height = 15;

function ranCheck() {
  const input = ~~(Math.random() * inputs.length);
  inputs[input].checked = !inputs[input].checked;
  //setTimeout(ranCheck, 10);
}

function getTurnt(el) {
  const toggle = window.getComputedStyle(el, null);
  const matrix = toggle.getPropertyValue("transform");

  if (!matrix) {
    return;
  }

  let values = matrix.split("(")[1];
  values = values.split(")")[0];
  values = values.split(",");

  const angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
  el.style.transform = `rotate(${angle + 45}deg)`;
}

function evenOdd() {
  for (let i = 0; i <= inputs.length; i++) {
    if (i % 2) {
      inputs[i].checked = !inputs[i].checked;
      getTurnt(inputs[i]);
    }
  }
  inputs.push(inputs.shift());
  setTimeout(evenOddCol, 1000);
}

function evenOddCol() {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (y % 2) {
        inputs[y * width + x].checked = !inputs[y * width + x].checked;
        getTurnt(inputs[y * width + x]);
      }
    }
  }
  inputs.push(inputs.shift());
  setTimeout(evenOdd, 1000);
}

evenOddCol();
