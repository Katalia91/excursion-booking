const txt = `"1","Ogrodzieniec","Zamek Ogrodzieniec – ruiny zamku leżącego na Jurze Krakowsko-Częstochowskiej, wybudowanego w systemie tzw. Orlich Gniazd, we wsi Podzamcze w województwie śląskim, w powiecie zawierciańskim, około 2 km na wschód od Ogrodzieńca. Zamek został wybudowany w XIV – XV w. przez ród Włodków Sulimczyków.","99PLN","50PLN"
"2","Ojców","wieś w województwie małopolskim, w powiecie krakowskim, w gminie Skała, na terenie Wyżyny Krakowsko-Częstochowskiej, w Dolinie Prądnika, na Szlaku Orlich Gniazd. W Królestwie Polskim istniała gmina Ojców. W latach 1975–1998 miejscowość położona była w województwie krakowskim. W latach 1928–1966 Ojców miał status uzdrowiska posiadającego charakter użyteczności publicznej.","40PLN","15PLN`;

// console.log(txt.split(/[\r\n]+/gm));

const excursionFile = document.querySelector(".uploader__input");
excursionFile.addEventListener("change", readFile);
const excursionList = document.querySelector(".excursions");
excursionList.addEventListener("click", placeOrder);

function readFile(e) {
  const file = e.target.files[0];

  if (file && file.name.endsWith(".csv")) {
    const reader = new FileReader();

    reader.onload = function (readerEvent) {
      const excursionPanel = document.querySelector(".excursions__item");
      const excursionFileResult = readerEvent.target.result;
      /* Divide file into separate rows */
      const excursionFileSingleRow = excursionFileResult.split(/[\r\n]+/gm);
      excursionFileSingleRow.forEach(function (el) {
        /* Divide strings */
        const singleElement = el.split('","');
        console.log(singleElement);
        singleElement[0] = singleElement[0].slice(1);
        singleElement[singleElement.length - 1] = singleElement[
          singleElement.length - 1
        ].slice(0, -1);
        const excursionTitle = singleElement[1];
        const priceChild = singleElement[4];
        const excursionDesc = singleElement[2];
        const priceAdult = singleElement[3];
        clonePrototype(excursionTitle, excursionDesc, priceChild, priceAdult);
        console.log(singleElement);
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
  priceChildElement.innerText = priceChild;
  priceAdultElement.innerText = priceAdult;
  return newElement;
}

function placeOrder(e) {
  e.preventDefault();

  if (e.target.classList.contains("excursions__field-input--submit")) {
    const divParent = e.target.parentElement;
    const formElement = divParent.parentElement;
    const nrOfAdults = formElement.querySelector("input[name='adults']").value;
    const nrOfChildren = formElement.querySelector(
      "input[name='children']",
    ).value;
    console.log(`Number of adults: ${nrOfAdults}`);
    console.log(`Number of children: ${nrOfChildren}`);
  }
}
