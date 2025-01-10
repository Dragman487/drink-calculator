let total = 0;
let selectedDrinks = {};
let drinkHistory = [];

document.getElementById("openDrinksBtn").disabled = true;
function addDrink(name, price) {
  total += price;
  document.getElementById("total").innerHTML = `${total.toFixed(2)}€`;

  if (selectedDrinks[name]) {
    selectedDrinks[name].count++;
  } else {
    selectedDrinks[name] = { count: 1, price: price };
  }

  drinkHistory.push({ name, price });
  updateSelectedDrinks();
}

function undoLastDrink() {
  if (drinkHistory.length > 0) {
    const lastDrink = drinkHistory.pop();
    total -= lastDrink.price;
    document.getElementById("total").innerHTML = `${total.toFixed(2)}€`;

    selectedDrinks[lastDrink.name].count--;
    if (selectedDrinks[lastDrink.name].count === 0) {
      delete selectedDrinks[lastDrink.name];
    }

    updateSelectedDrinks();
  }
}

function resetTotal() {
  total = 0;
  document.getElementById("total").innerHTML = `${total.toFixed(2)}€`;
  selectedDrinks = {};
  drinkHistory = [];
  updateSelectedDrinks();
}

function updateSelectedDrinks() {
  const selectedDrinksDiv = document.getElementById("selectedDrinks");
  selectedDrinksDiv.innerHTML = "";

  const sortedDrinks = Object.entries(selectedDrinks).sort(
    ([, a], [, b]) => b.count - a.count
  );

  for (const [name, { count, price }] of sortedDrinks) {
    const drinkTotal = (count * price).toFixed(2);
    const drinkItem = document.createElement("div");
    drinkItem.classList.add("drink-item");

    const drinkCount = document.createElement("span");
    drinkCount.classList.add("drink-count");
    drinkCount.textContent = count;

    const drinkInfo = document.createElement("span");
    drinkInfo.textContent = `${name}: ${drinkTotal}€`;

    drinkItem.appendChild(drinkCount);
    drinkItem.appendChild(drinkInfo);
    selectedDrinksDiv.appendChild(drinkItem);
  }

  if(!Object.entries(selectedDrinks).length) {
    console.log("DISABLED")
    document.getElementById("openDrinksBtn").disabled = true;
}else {
    console.log("ENABLE")
      document.getElementById("openDrinksBtn").disabled = false;

  }
}

function openDrinks() {
  document.getElementById("selectedDrinksContainer").classList.add("open");
}

function closeDrinks() {
  document.getElementById("selectedDrinksContainer").classList.remove("open");
}

document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", handleTouchMove, false);

let xDown = null;
let yDown = null;

function getTouches(evt) {
  return evt.touches || evt.originalEvent.touches;
}

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  const xUp = evt.touches[0].clientX;
  const yUp = evt.touches[0].clientY;

  const xDiff = xDown - xUp;
  const yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      /* left swipe */
    } else {
      /* right swipe */
    }
  } else {
    if (yDiff > 0) {
      /* up swipe */
      openDrinks();
    } else {
      /* down swipe */
      // closeDrinks();
    }
  }

  xDown = null;
  yDown = null;
}
