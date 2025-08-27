
> ⭐ ***README** to coś więcej niż opis. Poprzez nie **pokazujesz swoje mocne strony** – swoją dokładność, sposób myślenia i podejście do rozwiązywania problemów. Niech Twoje README pokaże, że masz **świetne predyspozycje do rozwoju!***
> 
> 🎁 *Zacznij od razu. Skorzystaj z **[szablonu README i wskazówek](https://github.com/devmentor-pl/readme-template)**.* 

&nbsp;


# JavaScript: Formularze

Zdobyliśmy zlecenie, które zostało porzucone przez poprzedniego programistę. Polega ono na składaniu zamówienia na wycieczki importowane z [pliku CSV](https://pl.wikipedia.org/wiki/CSV_(format_pliku)).

Część kodu HTML i CSS już napisano. Naszym zadaniem jest utworzenie logiki i wyglądu. 

To oznacza, że tym razem nie tylko działamy w JavaScripcie, ale musimy też ostylować poszczególne elementy według własnego uznania, aby lepiej się prezentowały.

## Wymagania klienta

Klient oczekuje, że użytkownik strony będzie mógł załadować sobie za pomocą formularza (`.uploader__input`) plik CSV, na podstawie którego zostaną do strony dodane wycieczki.

W pliku [`./example.csv`](./example.csv) w każdym wierszu mamy dane na temat jednej wycieczki. Wartości te są rozdzielone przecinakami. Są to kolejno: **id**, **nazwa**, **opis**, **cena za dorosłego** oraz **cena za dziecko**.

Po załadowaniu oferty użytkownik może wybrać dowolną wycieczkę. Wystarczy, że w polach formularza tej wycieczki wprowadzi liczbę osób dorosłych oraz dzieci i kliknie przycisk „dodaj do zamówienia” (`.excursions__field-input--submit`).

Wówczas „w koszyku” na liście (`.summary`) pojawi się kolejny element zawierający podsumowanie danych wybranej wycieczki. Jednocześnie cena za całość (`.order__total-price-value`) ulegnie zmianie.

Każda zamówiona wycieczka może zostać usunięta z listy po kliknięciu X (`.summary__btn-remove`).

Po dokonaniu wyboru wycieczek użytkownik może złożyć zamówienie. W tym celu wypełnia formularz zamówienia (`.order`).

Przed wysłaniem formularza musimy sprawdzić, czy pola zostały prawidłowo wypełnione, m.in. czy pole z imieniem i nazwiskiem nie jest puste i czy adres e-mail jest prawidłowy (np. zawiera znak @).

Jeśli dane są niepoprawne, to należy utworzyć w kodzie HTML stosowne miejsce i tam dodać odpowiednie komunikaty.

Gdy użytkownik prawidłowo złoży zamówienie, wyświetlamy `alert()` z komunikatem: 

> Dziękujemy za złożenie zamówienia o wartości [kwota zamówienia] PLN. Szczegóły zamówienia zostały wysłane na adres e-mail: adres@wpisanywformularzu.pl.

Następnie czyścimy pola wszystkich formularzy i listę wybranych wycieczek.

## Implementacja

Potraktuj opis powyżej jako wytyczne, o których klient sam Ci opowiedział. Aby efektywnie pracować, powinieneś przed zabraniem się za realizację projektu uporządkować problemy i podzielić je na mniejsze części.

Tutaj widzimy trzy główne zagadnienia:
* ładowanie wycieczek
* dodawanie wycieczek do listy zamówionych
* obsługę formularza zamówienia.

Za każde kolejne zagadnienie z takiej listy powinniśmy zabierać się dopiero wtedy, gdy wcześniejsze zostało wykonane prawidłowo (działa).

Poszczególne elementy, np. „ładowanie wycieczek” też możemy podzielić na mniejsze części. Zawsze zastanówmy się, jakie jest kolejne (najbliższe) działanie niezbędne do osiągnięcia celu.

W przypadku „ładowania wycieczek” powinniśmy zrealizować następujące zadania:
* obsługa wybierania pliku przez użytkownika
* pobranie zawartości pliku
* podział tej zawartości na wiersze (wycieczki)
* podział wiersza na poszczególne elementy (id, nazwa itp.)
* utworzenie odpowiednich elementów HTML i wypełnienie ich danymi
* dodanie ich do drzewa DOM

W ten sposób powinniśmy rozplanować pozostałe kroki.

### CSV

Przyjrzyjmy się plikowi [`./example.csv`](./example.csv):

```
"1","Ogrodzieniec","Zamek Ogrodzieniec – ruiny zamku leżącego na Jurze Krakowsko-Częstochowskiej, wybudowanego w systemie tzw. Orlich Gniazd, we wsi Podzamcze w województwie śląskim, w powiecie zawierciańskim, około 2 km na wschód od Ogrodzieńca. Zamek został wybudowany w XIV – XV w. przez ród Włodków Sulimczyków.","99","50"
"2","Ojców","wieś w województwie małopolskim, w powiecie krakowskim, w gminie Skała, na terenie Wyżyny Krakowsko-Częstochowskiej, w Dolinie Prądnika, na Szlaku Orlich Gniazd. W Królestwie Polskim istniała gmina Ojców. W latach 1975–1998 miejscowość położona była w województwie krakowskim. W latach 1928–1966 Ojców miał status uzdrowiska posiadającego charakter użyteczności publicznej.","40","15"
```

Jeśli te dane mielibyśmy zapisane w zmiennej `const text`, to zamienienie tego ciągu znaków na tablicę, w której każdy element to wiersz, mogłoby wyglądać tak:

```
const lines = text.split(/[\r\n]+/gm);
```

W zależności od systemu operacyjnego znak nowej linii to `\n`, `\r` lub `\r\n`, dlatego używamy wyrażenia regularnego w celu podzielenia tekstu na wiersze.

Podział na „kolumny” (czyli wyodrębnienie danych takich jak id, nazwa itp.) będzie trochę trudniejszy. Podział względem przecinka nie zadziała za dobrze, ponieważ ten znak może się też znajdować w treści opisu.

Jak rozwiązać ten problem? To zostawiam już Tobie ;)

### Zdarzenia

Zauważ, że wycieczki są tworzone dynamicznie przez wybranie odpowiedniego pliku. To powoduje, że w momencie załadowania drzewa DOM nie możemy ich wyszukać ani tym bardziej utworzyć nasłuchiwania.

Jednak od czego jest propagacja? Może warto zrobić nasłuchiwanie na elemencie, który istnieje w drzewie DOM (`.excursions`) i sprawdzać, co wywołuje dane zdarzenie (`e.target` lub `e.currentTarget`)?

### Koszyk

Przechowywanie wybranych wycieczek na liście to pewna forma koszyka – jak w sklepie internetowym. Mamy przedmiot oraz jego cenę i ilość (x2 – bo dla dorosłych i dzieci).

Możesz utworzyć sobie zmienną `const basket = []` i tam `push`ować obiekt z odpowiednimi danymi:

```
{
    title: 'Ogrodzieniec',
    adultNumber: 1,
    adultPrice: 99,
    childNumber: 2,
    childPrice: 50,
}
```

### Prototypy

Zauważ, że w kodzie występują prototypy (`.*--prototype`). Są one używane tylko po to, aby ułatwić prezentację danych. Możesz je modyfikować, jeśli uważasz, że to Ci pomoże w tworzeniu logiki (np. dodać `dataset`).

Docelowo mają być one niewidoczne – możesz je ukryć przy pomocy CSS (`display: none`). Warto je jednak wykorzystać do skopiowania struktury kodu HTML, aby nie musieć budować jej od podstaw w kodzie JS.

## Jak usprawnić sobie implementację?

Jeśli dojdziesz do etapu, gdzie ładowanie wycieczek już Ci działa i przechodzisz do następnego to warto zastanowić się jak nie musieć za każdym razem ładować zawartości pliku.

Tutaj wystarczy, że w kodzie przekleisz jego zawartość do zmiennej i to ją będziesz parsował. To będzie tymczasowe rozwiązanie, ale dzięki niemu zaoszczędzisz mnóstwo czasu.

Poniżej znajdziesz przykładowe rozwiązanie (nie jest ono idelane więc skopiuj jedynie koncepcję):
> Zwróć uwagę, że wszystkie czynności dot. zdarzenia zostały zakomentowane.
```
function readFileMock() {
    // const file = e.target.files[0]
    // if (file && file.name.endsWith('.csv')) {
        // const reader = new FileReader();
        const prototypeEl = document.querySelector('.excursions__item--prototype');
        const ulEl = document.querySelector('.excursions');
        // reader.onload = function (readerEvent) {


            const mock = `"1","Ogrodzieniec","Zamek Ogrodzieniec – ruiny zamku leżącego na Jurze Krakowsko-Częstochowskiej, wybudowanego w systemie tzw. Orlich Gniazd, we wsi Podzamcze w województwie śląskim, w powiecie zawierciańskim, około 2 km na wschód od Ogrodzieńca. Zamek został wybudowany w XIV – XV w. przez ród Włodków Sulimczyków.","99","50"
"2","Ojców","wieś w województwie małopolskim, w powiecie krakowskim, w gminie Skała, na terenie Wyżyny Krakowsko-Częstochowskiej, w Dolinie Prądnika, na Szlaku Orlich Gniazd. W Królestwie Polskim istniała gmina Ojców. W latach 1975–1998 miejscowość położona była w województwie krakowskim. W latach 1928–1966 Ojców miał status uzdrowiska posiadającego charakter użyteczności publicznej.","40","15"`
            const rows = mock.split(/[\r\n]+/gm);
            // const rows = readerEvent.target.result.split(/[\r\n]+/gm);
            const data = rows.map(row => row.split('","'));
            data.forEach(function (item) {
                const protoClone = prototypeEl.cloneNode(true);
                protoClone.querySelector('.excursions__title').innerText = item[1];
                protoClone.querySelector('.excursions__description').innerText = item[2];
                const pricesList = protoClone.querySelectorAll('.excursions__price');
                pricesList[0].innerText = item[3];
                pricesList[1].innerText = parseInt(item[4]);
                ulEl.appendChild(protoClone)
                protoClone.classList.remove('excursions__item--prototype');
            });
        // };
        // reader.readAsText(file);

    // } else {
        // alert('Wybierz plik CSV');
    // }
}
```


&nbsp;

> ⭐ ***README** to coś więcej niż opis. Poprzez nie **pokazujesz swoje mocne strony** – swoją dokładność, sposób myślenia i podejście do rozwiązywania problemów. Niech Twoje README pokaże, że masz **świetne predyspozycje do rozwoju!***
> 
> 🎁 *Zacznij od razu. Skorzystaj z **[szablonu README i wskazówek](https://github.com/devmentor-pl/readme-template)**.* 

