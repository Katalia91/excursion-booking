const txt = `"1","Ogrodzieniec","Zamek Ogrodzieniec – ruiny zamku leżącego na Jurze Krakowsko-Częstochowskiej, wybudowanego w systemie tzw. Orlich Gniazd, we wsi Podzamcze w województwie śląskim, w powiecie zawierciańskim, około 2 km na wschód od Ogrodzieńca. Zamek został wybudowany w XIV – XV w. przez ród Włodków Sulimczyków.","99PLN","50PLN"
"2","Ojców","wieś w województwie małopolskim, w powiecie krakowskim, w gminie Skała, na terenie Wyżyny Krakowsko-Częstochowskiej, w Dolinie Prądnika, na Szlaku Orlich Gniazd. W Królestwie Polskim istniała gmina Ojców. W latach 1975–1998 miejscowość położona była w województwie krakowskim. W latach 1928–1966 Ojców miał status uzdrowiska posiadającego charakter użyteczności publicznej.","40PLN","15PLN`;

// console.log(txt.split(/[\r\n]+/gm));

const excursionFile = document.querySelector(".uploader__input");
excursionFile.addEventListener("change", readFile);

function readFile(e) {
  const file = e.target.files[0];

  if (file && file.name.endsWith(".csv")) {
    const reader = new FileReader();

    reader.onload = function (readerEvent) {
      const excursionPanel = document.querySelector(".excursions__item");
      const excursionFileResult = readerEvent.target.result;
      /* Divide file into separate rows */
      const excursionFileSingle = excursionFileResult.split(/[\r\n]+/gm);
      excursionFileSingle.forEach(function (el) {
        /* Divide strings */
        const newEl = el.split('","');
        /* Remove first apostrophe */
        const cleanedNewEl = newEl[0].slice(1);
        console.log(newEl);
        console.log(cleanedNewEl);
      });
    };
    reader.readAsText(file);
  }
}
