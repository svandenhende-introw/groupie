# Groupie

Programma'tje om het verdelen van leiding over verschillende groepen te automatiseren op basis van een persoonlijke score (0-100) per groep.

Deze score omvat het gewicht waarmee een bepaald persoon leiding wil geven aan een bepaalde groep.

## Meest courante problemen bij typische top 3

- Indien meerdere personen eenzelfde groep als 1e keuze hebben aangeduid, kan enkel een naieve, willekeurige verdeling gemaakt worden.

  > **Stel**: 7 mensen hebben de aspi's als 1e keuze. Hoe determineer je welke 2 mensen leiding mogen geven aan de aspi's, en welke 5 hun 2e of 3e keuze krijgen?

  > **Stel**: 4 mensen hebben exact dezelfde top 3. Hoe determineer je wie welke keuze krijgt?

- Indien een bepaalde groep in niemand zijn top 3 staat, is het onmogelijk om te beslissen welke mensen hier leiding aan zullen geven.

- Het is onmogelijk om aan te geven hoe gelukkig je zou zijn met je 2e of 3e keuze. Sommige mensen zijn subjectief gelukkiger met hun 3e keuze dan andere met hun 2e keuze.

  > **Stel**: Voor persoon A maakt de groep eigenlijk niet veel uit. Deze persoon zou heel graag de Aspi's leiding geven maar tergelijk ook de Sloebers of de Keti's.

  > **Stel**: Persoon B is daarentegen helemaal gek van de Rakkers. Deze persoon zou eventueel ook wel leiding willen geven aan Speelclub meisjes maar ziet daarnaast eigenlijk weinig groepen zitten. Als 3e keuze zet deze persoon dan maar Speelclub jongens om tot 3 te komen.

Deze nuances zijn in een klassiek top-3 model onmogelijk te achterhalen. Dit heeft als gevolg dat er veel minder rekening kan gehouden worden met individuele wensen

## Voorbeeld score model:

Indien je heel graag een bepaalde groep wilt begeleiden geef je deze een score dicht tegen de 100%. Indien je ook een andere groep graag zou begeleiden, kan je deze eveneens een hoge score geven.

Indien je sommige groepen wel ziet zitten kan je dit aangeven door een lagere score te geven, zo kan je het bv 70% zien zitten om leiding te geven aan de keti's en slechts 45% zien zitten om leiding te geven aan de tito's.

Als laatst kan je ook aangeven welke groepen je totaal niet ziet zitten, deze zou je eerder richting de 0% scoren. Zo kan je het bv maar 5% zien zitten om leiding te geven aan de Sloebers of de Rakkers.

Deze manier van scoring laat je toe om **nuances** aan te geven over de verschillende groepen. Het schetst een beter beeld over hoe tevreden je bent met je 2e of 3e keuze, waardoor het programma een betere inschatting kan maken over het geven van je 1e, 2e, of 3e keuze.
