const txt = `"1","Ogrodzieniec","Zamek Ogrodzieniec – ruiny zamku leżącego na Jurze Krakowsko-Częstochowskiej, wybudowanego w systemie tzw. Orlich Gniazd, we wsi Podzamcze w województwie śląskim, w powiecie zawierciańskim, około 2 km na wschód od Ogrodzieńca. Zamek został wybudowany w XIV – XV w. przez ród Włodków Sulimczyków.","99PLN","50PLN"
"2","Ojców","wieś w województwie małopolskim, w powiecie krakowskim, w gminie Skała, na terenie Wyżyny Krakowsko-Częstochowskiej, w Dolinie Prądnika, na Szlaku Orlich Gniazd. W Królestwie Polskim istniała gmina Ojców. W latach 1975–1998 miejscowość położona była w województwie krakowskim. W latach 1928–1966 Ojców miał status uzdrowiska posiadającego charakter użyteczności publicznej.","40PLN","15PLN`;

// console.log(txt.split(/[\r\n]+/gm));

const excursionFile = document.querySelector(".uploader__input");
excursionFile.addEventListener("change", readFile);
const excursionList = document.querySelector(".excursions");
excursionList.addEventListener("click", addToBasket);
const basket = [];

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
    basket.push({
      title: excursionTitle,
      nrOfAdults,
      nrOfChildren,
      pricePerAdult: priceAdult,
      pricePerChild: priceChild,
      totalPrice: prices.sumPriceAll,
    });
    console.log(basket);
    updateTotalPrice();
    displaySummary();
    formElement.reset();
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
  basket.forEach(function (item) {
    const summaryListItemPrototypeClone =
      summaryListItemPrototype.cloneNode(true);
    const summaryElementTitle =
      summaryListItemPrototypeClone.querySelector(".summary__name");
    const summaryElementTotalPrice =
      summaryListItemPrototypeClone.querySelector(".summary__total-price");

    summaryList.appendChild(summaryListItemPrototypeClone);
    summaryListItemPrototypeClone.classList.remove("summary__item--prototype");
    summaryElementTitle.innerText = item.title;
    summaryElementTotalPrice.innerText = `${item.totalPrice}PLN`;
  });
}
