# Groupie

Programma'tje om het verdelen van leiding over verschillende groepen te automatiseren op basis van een persoonlijke score (0-100) per groep.

Deze score omvat het gewicht waarmee een bepaald persoon leiding wil geven aan een bepaalde groep.

### Bijvoorbeeld:

Indien je heel graag een bepaalde groep wilt begeleiden geef je deze een score dicht tegen de 100%. Indien je ook een andere groep graag zou begeleiden, kan je deze eveneens een hoge score geven.

Indien je sommige groepen wel ziet zitten kan je dit aangeven door een lagere score te geven, zo kan je het bv 70% zien zitten om leiding te geven aan de keti's en slechts 45% zien zitten om leiding te geven aan de tito's.

Als laatst kan je ook aangeven welke groepen je totaal niet ziet zitten, deze zou je eerder richting de 0% scoren. Zo kan je het bv maar 5% zien zitten om leiding te geven aan de Sloebers of de Rakkers.

Deze manier van scoring laat je toe om **nuances** aan te geven over de verschillende groepen. Het schetst een beter beeld over hoe tevreden je bent met je 2e of 3e keuze, waardoor het programma een betere inschatting kan maken over het geven van je 1e, 2e, of 3e keuze.

---

Onderstaande output wordt gerenderd in de console met de gegeven sample data en geeft een beeld op de denkwijze / het proces van het programma.

## Data (random)

Amber  
-> 100 | Aspis  
-> 99 | Sloebers  
-> 20 | Ketis

Eli  
-> 100 | Aspis  
-> 90 | Ketis  
-> 10 | Sloebers

Rube  
-> 100 | Aspis  
-> 30 | Ketis  
-> 10 | Sloebers

Renee  
-> 100 | Aspis  
-> 80 | Sloebers  
-> 40 | Ketis

Margaux  
-> 90 | Ketis  
-> 80 | Sloebers  
-> 30 | Aspis

Mouton  
-> 100 | Aspis  
-> 90 | Ketis  
-> 20 | Sloebers

---

## Iteratie 1

Sloebers  
-> Niemand

Ketis  
-> Margaux (score: 90, keuze: 1)

Aspis  
-> Amber (score: 100, keuze: 1)  
-> Eli (score: 100, keuze: 1)  
-> Rube (score: 100, keuze: 1)  
-> Renee (score: 100, keuze: 1)  
-> Mouton (score: 100, keuze: 1)

---

Te veel mensen willen leiding geven aan de Aspis (5)

> - Amber wordt verhuisd naar de volgende keuze Sloebers met score 99
> - Eli wordt verhuisd naar de volgende keuze Ketis met score 90
> - Mouton wordt verhuisd naar de volgende keuze Ketis met score 90

## Iteratie 2

Sloebers  
-> Amber (score: 99, keuze: 2)

Ketis  
-> Margaux (score: 90, keuze: 1)  
-> Eli (score: 90, keuze: 2)  
-> Mouton (score: 90, keuze: 2)

Aspis  
-> Renee (score: 100, keuze: 1)  
-> Rube (score: 100, keuze: 1)

---

Te veel mensen willen leiding geven aan de Ketis (3)

> - Margaux wordt verhuisd naar de volgende keuze Sloebers met score 80

## Iteratie 3

Sloebers  
-> Amber (score: 99, keuze: 2)  
-> Margaux (score: 80, keuze: 2)

Ketis  
-> Mouton (score: 90, keuze: 2)  
-> Eli (score: 90, keuze: 2)

Aspis  
-> Renee (score: 100, keuze: 1)  
-> Rube (score: 100, keuze: 1)

---

Optimale oplossing gevonden 🎉
