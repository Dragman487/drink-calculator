let total = 0;
let selectedDrinks = {};
let drinkHistory = [];

const btnContainer = document.getElementById("buttonContainer");
const selectedDrinksContainer = document.getElementById("selectedDrinks");

const availableDrinks = [
    { id: 'LongIsland', name: 'Long Island', price: 6.5 },
    { id: 'LongDrink', name: 'Long Drink',   price: 7 },
    { id: 'CubaLibre', name: 'Cuba Libre',   price: 7.5 },
    { id: 'Hausschnaps',name: 'Hausschnaps',  price: 1.5 },
    { id: 'Mexikaner',  name: 'Mexikaner',    price: 2 },
    { id: 'Sourz',      name: 'Sourz',        price: 2.5 },
    { id: 'Tequilla',   name: 'Tequilla',     price: 2.9 },
    { id: 'klBier',   name: 'kl. Bier',     price: 3.6 },
    { id: 'grBier',   name: 'gr. Bier',     price: 5.6 },
    { id: 'klCorona', name: 'kl. Corona',   price: 4.2 },
    { id: 'grCorona', name: 'gr. Corona',   price: 6 },
    { id: 'Rakete',     name: 'Rakete',       price: 4.1 }
  ];

document.getElementById("openDrinksBtn").disabled = true;

buildDrinkButtons();

function buildDrinkButtons() {
    const buttonContainer = document.getElementById("buttonContainer")
    for(let drink of availableDrinks) {
        const button = document.createElement("button");
        button.addEventListener('click', () => {addDrink(drink.id, drink.name, drink.price)} )
        button.id = drink.id

        const name = document.createElement("p")
        name.classList.add("name")
        name.innerHTML = drink.name

        const price = document.createElement("p")
        price.innerHTML = drink.price +  "€"

        button.appendChild(name);
        button.appendChild(price);
        buttonContainer.appendChild(button);
    }

}
function addDrink(id, name, price) {


  if (selectedDrinks[id]) {
    selectedDrinks[id].amount++;
  } else {
    selectedDrinks[id] = { amount: 1, price, id, name };
  }

  setNewButtonName(id, name);

  drinkHistory.push({id, name, price, type: "ADDED" });
  updateSelectedDrinks();
}

function undoLastDrink() {
  if (drinkHistory.length > 0) {
    const lastDrink = drinkHistory.pop();

    if(lastDrink.type === "ADDED") {
      selectedDrinks[lastDrink.id].amount--;

      if (selectedDrinks[lastDrink.id].amount === 0) {
        delete selectedDrinks[lastDrink.id];
      }
    }else {

      if(!selectedDrinks[lastDrink.id]){
        selectedDrinks[lastDrink.id] = { amount: 1, price: lastDrink.price, id:lastDrink.id, name: lastDrink.name }
      }else {
        selectedDrinks[lastDrink.id].amount++;
      }

    }

    updateSelectedDrinks();
    setNewButtonName(lastDrink.id, lastDrink.name);
  }
}

function setNewButtonName(id) {
  const buttonElement = document.getElementById(id)
  const oldBadgeElement = document.getElementById('badgeAmount' + id)

  if(oldBadgeElement) {
    buttonElement.removeChild(oldBadgeElement)
  }

  if(selectedDrinks[id]?.amount) {
    const newBadgeElement= document.createElement("div")
    newBadgeElement.classList.add('badgeAmount')
    newBadgeElement.id =  "badgeAmount" + id
    newBadgeElement.innerHTML = selectedDrinks[id].amount
    buttonElement.appendChild(newBadgeElement);
  }

}

function resetTotal() {
  const historyLength = drinkHistory.length;
  for(let i = 0; i < historyLength; i++) {
    undoLastDrink();
  }
}


function updateSelectedDrinks() {
  const selectedDrinksDiv = document.getElementById("selectedDrinks");
  selectedDrinksDiv.innerHTML = "";


  total = 0;
  for (const [id, {name, amount, price }] of  Object.entries(selectedDrinks)) {
    total += price * amount;
    const drinkTotal = (amount * price).toFixed(2);
    const drinkItem = document.createElement("div");
    drinkItem.classList.add("drink-item");

    const drinkamount = document.createElement("span");
    drinkamount.classList.add("drink-amount");
    drinkamount.textContent = amount;

    const drinkInfo = document.createElement("span");
    drinkInfo.textContent = `${name}: ${drinkTotal}€`;

    const reduceButton = document.createElement("i")
    reduceButton.classList.add('reduce');
    reduceButton.classList.add('material-icons');
    reduceButton.addEventListener('click', () => {reduceDrink(id, name, price)})
    reduceButton.innerHTML="remove";


    drinkItem.appendChild(drinkamount);
    drinkItem.appendChild(drinkInfo);
    drinkItem.appendChild(reduceButton);
    selectedDrinksDiv.appendChild(drinkItem);
  }

  document.getElementById("total").innerHTML = `${total.toFixed(2)}€`;

  if (!Object.entries(selectedDrinks).length) {
    document.getElementById("openDrinksBtn").disabled = true;
  } else {
    document.getElementById("openDrinksBtn").disabled = false;
  }
}

function reduceDrink(id, name, price) {
  selectedDrinks[id].amount--

  if(!selectedDrinks[id].amount) {
    delete selectedDrinks[id];
  }

  drinkHistory.push({id, name, price, type: "REDUCED" });
  setNewButtonName(id);
  updateSelectedDrinks();
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

        // If there are no selected drinks disable swipe up function.
        if(!Object.entries(selectedDrinks).length) {
            return;
        }
      // IF  the button container is scroll able we disable the swipe up function
      if (btnContainer.scrollHeight > btnContainer.clientHeight) {
        return;
      }

      /* up swipe */
      openDrinks();
    } else {
      // IF  the selectedDrinks container is scroll able we disable the swipe down function
      if (
        selectedDrinksContainer.scrollHeight >
        selectedDrinksContainer.clientHeight 
      ) {
        return;
      }
      /* down swipe */
      closeDrinks();
    }
  }

  xDown = null;
  yDown = null;
}
