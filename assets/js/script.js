const excursionFile = document.querySelector(".uploader__input");
excursionFile.addEventListener("change", readFile);
const excursionList = document.querySelector(".excursions");
excursionList.addEventListener("click", addToBasket);
const basket = [];

document.addEventListener("DOMContentLoaded", updateTotalPrice);
const orderForm = document.querySelector(".panel__order");
orderForm.addEventListener("submit", placeOrder);

function readFile(e) {
  const file = e.target.files[0];

  if (file && file.name.endsWith(".csv")) {
    const reader = new FileReader();

    reader.onload = function (readerEvent) {
      const excursionFileResult = readerEvent.target.result;
      /* Divide file into separate rows */
      const excursionFileSingleRow = excursionFileResult.split(/[\r\n]+/gm);
      excursionFileSingleRow.forEach(function (el) {
        /* Divide strings */
        const singleElement = el.split('","');
        singleElement[0] = singleElement[0].slice(1);
        singleElement[singleElement.length - 1] = singleElement[
          singleElement.length - 1
        ].slice(0, -1);
        const excursionTitle = singleElement[1];
        const excursionDesc = singleElement[2];
        const priceAdult = singleElement[3];
        const priceChild = singleElement[4];
        clonePrototype(excursionTitle, excursionDesc, priceChild, priceAdult);
      });
    };
    reader.readAsText(file);
  }
}

function clonePrototype(title, desc, priceChild, priceAdult) {
  const prototype = document.querySelector(".excursions__item--prototype");
  const newElement = prototype.cloneNode(true);

  excursionList.appendChild(newElement);
  newElement.classList.remove("excursions__item--prototype");
  const excursionTitle = newElement.querySelector(".excursions__title");
  excursionTitle.innerText = title;
  const excursionDesc = newElement.querySelector(".excursions__description");
  excursionDesc.innerText = desc;
  const prices = newElement.querySelectorAll(".excursions__price");
  const priceChildElement = prices[1];
  const priceAdultElement = prices[0];
  const formElement = newElement.querySelector("form");
  formElement.dataset.priceChild = priceChild;
  formElement.dataset.priceAdult = priceAdult;
  priceChildElement.innerText = priceChild;
  priceAdultElement.innerText = priceAdult;
  return newElement;
}

function addToBasket(e) {
  e.preventDefault();

  if (e.target.classList.contains("excursions__field-input--submit")) {
    const divParent = e.target.parentElement;
    const formElement = divParent.parentElement;
    const priceAdult = formElement.dataset.priceAdult;
    const priceChild = formElement.dataset.priceChild;

    const nrOfAdults = formElement.querySelector("input[name='adults']").value;
    const nrOfChildren = formElement.querySelector(
      "input[name='children']",
    ).value;
    const prices = calculatePrice(
      nrOfAdults,
      priceAdult,
      nrOfChildren,
      priceChild,
    );
    const excursionTitleParent = formElement.parentElement;
    const excursionTitle =
      excursionTitleParent.querySelector(".excursions__title").textContent;
    const addToBasketMessage = formElement.querySelector(".validation-error");

    if (nrOfAdults > 0 || nrOfChildren > 0) {
      addToBasketMessage.innerText = "";
      basket.push({
        title: excursionTitle,
        nrOfAdults,
        nrOfChildren,
        pricePerAdult: priceAdult,
        pricePerChild: priceChild,
        totalPrice: prices.sumPriceAll,
      });
      updateTotalPrice();
      displaySummary();
      formElement.reset();
    } else {
      addToBasketMessage.innerText =
        "Musisz wpisać co najmniej jedną osobę, żeby dodać wycieczkę do koszyka";
    }
  }
}

function calculatePrice(nrOfAdults, priceAdult, nrOfChildren, priceChild) {
  const sumAdultPrice = nrOfAdults * priceAdult;
  const sumChildrenPrice = nrOfChildren * priceChild;
  const sumPriceAll = sumAdultPrice + sumChildrenPrice;
  return { sumAdultPrice, sumChildrenPrice, sumPriceAll };
}
function updateTotalPrice() {
  const totalPrice = document.querySelector(".order__total-price-value");
  let totalPriceAll = 0;
  basket.forEach(function (excursion) {
    totalPriceAll += excursion.totalPrice;
  });
  totalPrice.innerText = `${totalPriceAll}PLN`;
}

function displaySummary() {
  const summaryList = document.querySelector(".summary");
  const summaryListItemPrototype = summaryList.querySelector(
    ".summary__item--prototype",
  );

  summaryList
    .querySelectorAll(".summary__item:not(.summary__item--prototype)")
    .forEach((item) => item.remove());
  basket.forEach(function (item, index) {
    const summaryListItemPrototypeClone =
      summaryListItemPrototype.cloneNode(true);
    const removeButton = summaryListItemPrototypeClone.querySelector(
      ".summary__btn-remove",
    );
    removeButton.addEventListener("click", (event) =>
      removeFromBasket(event, index),
    );
    const summaryElementTitle =
      summaryListItemPrototypeClone.querySelector(".summary__name");
    const summaryElementTotalPrice =
      summaryListItemPrototypeClone.querySelector(".summary__total-price");
    const summaryPriceDetails =
      summaryListItemPrototypeClone.querySelector(".summary__prices");

    summaryList.appendChild(summaryListItemPrototypeClone);
    summaryListItemPrototypeClone.classList.remove("summary__item--prototype");
    summaryPriceDetails.innerText = `dorośli: ${item.nrOfAdults} x ${item.pricePerAdult}PLN, dzieci: ${item.nrOfChildren} x ${item.pricePerChild}PLN`;
    summaryElementTitle.innerText = item.title;
    summaryElementTotalPrice.innerText = `${item.totalPrice}PLN`;
  });
}

function removeFromBasket(event, index) {
  event.preventDefault();
  basket.splice(index, 1);
  displaySummary();
  updateTotalPrice();
}

function placeOrder(e) {
  e.preventDefault();
  const errors = isFormValid();
  const errorMessage = orderForm.querySelectorAll(".validation-error");
  errorMessage.forEach(function (errorMessage) {
    errorMessage.innerText = "";
  });

  if (errors.length > 0) {
    displayErrors(errors);
  } else {
    alert("Zamówienie zostało złożone.");
    orderForm.reset();
  }
}

function isFormValid() {
  const errors = [];
  const orderNameField = document.querySelector("input[name='name']");
  const orderNameFieldValue = orderNameField.value;
  const orderEmailField = document.querySelector("input[name='email']");
  const orderEmailFieldValue = orderEmailField.value;
  if (orderNameFieldValue.length < 1) {
    errors.push({ field: "name", message: "Wpisz imię i nazwisko" });
  }
  if (!orderEmailFieldValue.includes("@")) {
    errors.push({ field: "email", message: "Wpisz poprawny adres e-mail" });
  }
  return errors;
}

function displayErrors(errors) {
  errors.forEach(function (error) {
    const formField = document.querySelector(
      `input[name="${error.field}"]`,
    ).parentElement;
    const errorField =
      formField.parentElement.querySelector(".validation-error");
    errorField.innerText = error.message;
  });
}
