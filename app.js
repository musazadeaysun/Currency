const status = document.querySelector(".status");
const toButtons = document.querySelectorAll("#to-seg .segButton");
const fromSub = document.querySelector(".fromSub");
const toSub = document.querySelector(".toSub");
const fromInput = document.querySelector(".fromInput");
const toAmount = document.querySelector(".toAmount");
const fromButtons = document.querySelectorAll(".card:first-child .segButton");
const buyRate = document.querySelector(".buyRate");
const sellRate = document.querySelector(".sellRate");
const bankButtons = document.querySelectorAll("#bankSeg .segButton");

let fromCurrency = "RUB";
let toCurrency = "USD";
let selectedBank = "NEW";
let activeSide = "from";

const API_KEY = "5810a6aa7bbdadd908909c474bb5e617";

const banks = {
  ABC: {
    buy: 0.995,
    sell: 1.01,
  },

  NEW: {
    buy: 0.99,
    sell: 1.02,
  },

  AME: {
    sell: 1.015,
    buy: 0.985,
  },

  RED: {
    sell: 1.005,
    buy: 0.995,
  },
};

async function convert() {
  const rate = await getRate(fromCurrency, toCurrency);

  if (fromCurrency === toCurrency) {
    if (activeSide === "from") {
      toAmount.value = fromInput.value;
    } else {
      fromInput.value = toAmount.value;
    }

    fromSub.innerText = `1 ${fromCurrency} = 1 ${toCurrency}`;

    toSub.innerText = `1 ${toCurrency} = 1 ${fromCurrency}`;

    return;
  }

  if (activeSide === "from") {
    let amount = fromInput.value;

    amount = Number(amount.replace(",", "."));

    if (amount > 10000) {
      amount = 10000;

      fromInput.value = 10000;
    }

    const result = amount * rate;

    toAmount.value = result.toFixed(4);
  } else {
    let amount = toAmount.value;

    amount = Number(amount.replace(",", "."));

    if (amount > 10000) {
      amount = 10000;
      toAmount.value = 10000;
    }

    const result = amount / rate;

    fromInput.value = result.toFixed(4);
  }

  fromSub.innerText = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;

  toSub.innerText = `1 ${toCurrency} = ${(1 / rate).toFixed(4)} ${fromCurrency}`;

  const bank = banks[selectedBank];

  const amount = Number(fromInput.value.replace(",", "."));

  const baseResult = amount * rate;
  const bankBuyValue = baseResult * bank.buy;
  const bankSellValue = baseResult * bank.sell;

  buyRate.innerText = bankBuyValue.toFixed(4);
  sellRate.innerText = bankSellValue.toFixed(4);
}

fromInput.addEventListener("input", () => {
  activeSide = "from";
  convert();
});

toAmount.addEventListener("input", () => {
  activeSide = "to";
  convert();
});

function connection() {
  if (!navigator.onLine) {
    status.innerText = "İnternet yoxdur, offline rejimdəsən";
    status.style.color = "red";
    status.style.fontSize = "20px";
    status.style.fontSize = "20px";
    status.style.fontWeight = "bold";
    status.style.backgroundColor = "#e5e5e5";
    status.style.width = "200px";
    status.style.textAlign = "center";
    status.style.padding = "5px";
    status.style.borderRadius = "10px";
    status.style.border = "1px solid red";
    return false;
  } else {
    status.innerText = "Online rejim";
    status.style.color = "green";
    status.style.fontSize = "20px";
    status.style.fontWeight = "bold";
    status.style.backgroundColor = "#e5e5e5";
    status.style.width = "150px";
    status.style.textAlign = "center";
    status.style.padding = "5px";
    status.style.borderRadius = "10px";
    status.style.border = "1px solid green";
    return true;
  }
}
async function getRate(from, to) {
  const key = `${from}_${to}`;

  try {
    if (!connection()) {
      const Localsaved = localStorage.getItem(key);

      if (Localsaved) {
        return Number(Localsaved);
      }
      alert("Offline və data yoxdur");
      return 0;
    }

    const response = await fetch(
      `https://api.currencylayer.com/live?access_key=${API_KEY}`,
    );
    const data = await response.json();
    let fromRate;
    let toRate;

    if (from === "USD") {
      fromRate = 1;
    } else {
      fromRate = data.quotes[`USD${from}`];
    }
    if (to === "USD") {
      toRate = 1;
    } else {
      toRate = data.quotes[`USD${to}`];
    }

    const rate = toRate / fromRate;
    localStorage.setItem(key, rate);

    return rate;
  } catch (error) {
    console.log(error);

    const Localsaved = localStorage.getItem(key);

    if (Localsaved) {
      return Number(Localsaved);
    }

    alert("Xəta baş verdi");
    return 0;
  }
}

fromButtons.forEach((button) => {
  button.addEventListener("click", () => {
    fromButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    fromCurrency = button.innerText;
    convert();
  });
});

toButtons.forEach((button) => {
  button.addEventListener("click", () => {
    toButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    toCurrency = button.innerText;
    convert();
  });
});

bankButtons.forEach((button) => {
  button.addEventListener("click", () => {
    bankButtons.forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");

    selectedBank = button.innerText;
    convert();
  });
});

convert();
