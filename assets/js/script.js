const excursionFile = document.querySelector(".uploader__input");
excursionFile.addEventListener("change", readFile);
const excursionList = document.querySelector(".excursions");
excursionList.addEventListener("click", addToBasket);
const basket = [];
const clearBasketBtn = document.querySelector(".summary__btn-clear");
document.addEventListener("DOMContentLoaded", updateTotalPrice);
const emptyMessageSummary = document.querySelector(".summary__empty");
const emptyMessageExcursions = document.querySelector(".excursions__empty");
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
    excursionFile.disabled = true;
    emptyMessageExcursions.classList.add("hidden");
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
    const btnParent = e.target.parentElement;
    const formElement = btnParent.parentElement;
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
      if (basket.length > 0) {
        emptyMessageSummary.classList.add("hidden");
      }
      updateTotalPrice();
      displaySummary();
      formElement.reset();
    } else {
      addToBasketMessage.innerText =
        "You have to add at least one person to be able to add excursion to the basket";
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
  totalPrice.innerText = `${totalPriceAll} EUR`;
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
    const summaryPriceDetailsAdults =
      summaryListItemPrototypeClone.querySelector(".summary__prices-adults");
    const summaryPriceDetailsChildren =
      summaryListItemPrototypeClone.querySelector(".summary__prices-children");

    summaryList.appendChild(summaryListItemPrototypeClone);
    summaryListItemPrototypeClone.classList.remove("summary__item--prototype");
    summaryPriceDetailsAdults.innerText = `adults: ${item.nrOfAdults} x ${item.pricePerAdult} EUR`;
    summaryPriceDetailsChildren.innerText = `children: ${item.nrOfChildren} x ${item.pricePerChild} EUR`;
    summaryElementTitle.innerText = item.title;
    summaryElementTotalPrice.innerText = `Total: ${item.totalPrice} EUR`;
  });
  clearBasketBtn.classList.add("active");
  clearBasketBtn.addEventListener("click", removeAllFromBasket);
}

function removeFromBasket(event, index) {
  event.preventDefault();
  basket.splice(index, 1);
  displaySummary();
  updateTotalPrice();
}
function removeAllFromBasket(event) {
  event.preventDefault();
  basket.length = 0;
  displaySummary();
  updateTotalPrice();
  clearBasketBtn.classList.remove("active");
  emptyMessageSummary.classList.remove("hidden");
}
function placeOrder(e) {
  e.preventDefault();
  const orderNameField = document.querySelector("input[name='fullName']");
  const orderNameFieldValue = orderNameField.value;
  const orderEmailField = document.querySelector("input[name='email']");
  const orderEmailFieldValue = orderEmailField.value;
  const errors = isFormValid(orderNameFieldValue, orderEmailFieldValue);
  const errorMessage = orderForm.querySelectorAll(".validation-error");
  errorMessage.forEach(function (errorMessage) {
    errorMessage.innerText = "";
  });

  if (errors.length > 0) {
    displayErrors(errors);
  } else if (basket.length !== 0) {
    const totalOrderPrice = document.querySelector(
      ".order__total-price-value",
    ).textContent;
    alert(
      `${orderNameFieldValue}, thank you for placing the order with a value of ${totalOrderPrice}. Order details have been sent to the email address: ${orderEmailFieldValue}`,
    );
    orderForm.reset();
    basket.length = 0;
    displaySummary();
    updateTotalPrice();
    clearBasketBtn.classList.remove("active");
    emptyMessageSummary.classList.remove("hidden");
  } else {
    alert(
      `You have to add at least one excursion to the basket to be able to place an order`,
    );
  }
}

function isFormValid(name, email) {
  const errors = [];
  if (name.length < 1) {
    errors.push({ field: "name", message: "Write name and last name" });
  }
  if (!email.includes("@")) {
    errors.push({
      field: "email",
      message: "Write correct e-mail address",
    });
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
