# Groupie

Simpel scriptje om het verdelen van leiding over verschillende groepen te automatiseren op basis van een persoonlijke score per groep.

Deze score omvat het gewicht waarmee een bepaald persoon het ziet zitten om leiding te geven aan een bepaalde groep.

Onderstaande output wordt gerenderd in de console met de gegeven sample data

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

Floor  
-> 90 | Ketis  
-> 80 | Sloebers  
-> 30 | Aspis

Gaelle  
-> 100 | Aspis  
-> 90 | Ketis  
-> 20 | Sloebers

---

## Iteratie 1

Sloebers  
-> Niemand

Ketis  
-> Floor (score: 90, keuze: 1)

Aspis  
-> Amber (score: 100, keuze: 1)  
-> Eli (score: 100, keuze: 1)  
-> Rube (score: 100, keuze: 1)  
-> Renee (score: 100, keuze: 1)  
-> Gaelle (score: 100, keuze: 1)

---

Te veel mensen willen leiding geven aan de Aspis (5)

> - Amber wordt verhuisd naar de volgende keuze Sloebers met score 99
> - Eli wordt verhuisd naar de volgende keuze Ketis met score 90
> - Gaelle wordt verhuisd naar de volgende keuze Ketis met score 90

## Iteratie 2

Sloebers  
-> Amber (score: 99, keuze: 2)

Ketis  
-> Floor (score: 90, keuze: 1)  
-> Eli (score: 90, keuze: 2)  
-> Gaelle (score: 90, keuze: 2)

Aspis  
-> Renee (score: 100, keuze: 1)  
-> Rube (score: 100, keuze: 1)

---

Te veel mensen willen leiding geven aan de Ketis (3)

> - Floor wordt verhuisd naar de volgende keuze Sloebers met score 80

## Iteratie 3

Sloebers  
-> Amber (score: 99, keuze: 2)  
-> Floor (score: 80, keuze: 2)

Ketis  
-> Gaelle (score: 90, keuze: 2)  
-> Eli (score: 90, keuze: 2)

Aspis  
-> Renee (score: 100, keuze: 1)  
-> Rube (score: 100, keuze: 1)

---

Optimale oplossing gevonden 🎉
