import { useParams, Link } from '@/next/router-shim';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import SEO, { buildProductSchema, buildBreadcrumbSchema } from '../components/SEO';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, Shield, Sun, Eye, Certificate, Tag } from '@phosphor-icons/react';
import { prodottiData } from '../data/siteContent';
import { useWPData } from '../hooks/useWPData';
import { useState, useEffect } from 'react';
import { PRODUCT_VISUALS } from '../utils/assetMaps';
const UNIFIED_DATA_COLOR = '#2563EB';

const PRODUCT_PAGE_OVERRIDES = {
  'madico-sb-20-e-ps-sr': {
    panoramicaBody: `Le pellicole antisolari sputtered SB 20 E PS SR Madico sono formate da una base di poliestere trasparente trattata con un processo chiamato sputtering che permette di raccogliere ed incorporare nella superficie della pellicola atomi di metallo, garantendo durata e prestazioni. Infine su questi viene posto un doppio trattamento antigraffio brevettato per proteggerlo da abrasioni e corrosioni.

Grazie alla sofisticata tecnologia con la quale sono realizzate garantiscono resistenza e durata nel tempo.
Riflettono fino al 88% dell energia solare rendendo gli ambienti piu freschi e confortevoli, con una elevata trasmissione luminosa e una maggiore riflessione energetica.
Pellicole piu armoniche che consentono una buona schermatura solare lasciando quasi inalterata la trasparenza e visibilita ed con effetto speculare meno invasivo.
Prodotto unico con doppio rivestimento antigraffio brevettato.
Struttura rivoluzionaria con doppio strato antigraffio per una lunga durata.
Trasforma la vetrata esterna da 4 mm in un vetro di sicurezza con certificazione a norma UNI EN 12600 in classe 3B3.
Pellicole antisolari che conferiscono a un normale vetro eccellenti prestazioni di controllo solare e sicurezza.`,
    contextBody: `Questa pellicola e consigliata per ambienti dove si vuole alte prestazioni di respinta energetica ma allo stesso tempo si richiede alta luminosita ed un aspetto estetico integrato nel contesto architettonico grazie all effetto brunito del film. E un prodotto molto adatto in contesti di pregio architettonico, centri storici e casali.`,
    caratteristiche: [
      'Resistenza e durata nel tempo grazie alla sofisticata tecnologia sputtering',
      'Riflettono fino all 88% dell energia solare',
      'Buona schermatura solare lasciando quasi inalterata la trasparenza dall interno',
      'Prodotto unico con doppio rivestimento antigraffio brevettato',
      'Struttura rivoluzionaria con doppio strato antigraffio per una lunga durata',
      'Trasforma la vetrata esterna da 4 mm in vetro di sicurezza UNI EN 12600 classe 3B3',
    ],
    technicalSheetUrl: '/assets/tech-sheets/sb-20-e-ps-sr.pdf',
    faq: [
      { q: 'A cosa serve Madico SB 20 E PS SR 75 micron?', a: 'E pensata per il controllo solare e comfort interno, riduce il calore e l abbaglio sulle superfici vetrate mantenendo alta luminosita e con basso impatto architettonico.' },
      { q: 'Su quali vetri conviene installarla?', a: 'Questa pellicola esprime la sua massima efficienza in vetri di nuova generazione con Ug inferiore a 1.10, ma puo essere installata su ogni vetrata nel lato esterno.' },
      { q: 'Quali prestazioni e utile confrontare?', a: 'Le prestazioni di una pellicola variano a seconda del tipo di vetro sul quale viene applicata. Sicuramente e importante usare pellicole che hanno prestazioni certificate come tutti i prodotti MADICO.' },
      { q: 'Che garanzia e prevista?', a: 'La garanzia e 10 anni ma soggetta a limitazioni. Per approfondire si consiglia di consultare la sezione dedicata all interno di questo sito.' },
      { q: 'Come si arriva alla scelta finale?', a: 'Si parte dall obiettivo, si verifica compatibilita del vetro e si conferma la soluzione con indicazioni chiare su posa e risultato atteso. La nostra esperienza vi aiutera a scegliere il prodotto giusto per ottenere il miglior risultato.' },
    ],
  },
  'madico-sb-35-e-ps-sr': {
    panoramicaBody: `Le pellicole antisolari sputtered SB 35 E PS SR Madico sono formate da una base di poliestere trasparente trattata con un processo chiamato sputtering che permette di raccogliere ed incorporare nella superficie della pellicola atomi di metallo, garantendo durata e prestazioni. Infine su questi viene posto un doppio trattamento antigraffio brevettato per proteggerlo da abrasioni e corrosioni.

Grazie alla sofisticata tecnologia con la quale sono realizzate garantiscono resistenza e durata nel tempo.
Riflettono fino al 80% dell energia solare rendendo gli ambienti piu freschi e confortevoli, con una elevata trasmissione luminosa e una maggiore riflessione energetica.
Pellicole piu chiare che consentono una buona schermatura solare lasciando quasi inalterata la trasparenza e visibilita ed riducendo effetti speculari.
Prodotto unico con doppio rivestimento antigraffio brevettato.
Struttura rivoluzionaria con doppio strato antigraffio per una lunga durata.
Trasforma la vetrata esterna da 4 mm in un vetro di sicurezza con certificazione a norma UNI EN 12600 in classe 3B3.
Pellicole antisolari che conferiscono a un normale vetro eccellenti prestazioni di controllo solare e sicurezza.`,
    contextBody: `Questa pellicola e consigliata per ambienti dove si vuole alte prestazioni di respinta energetica ma allo stesso tempo si richiede alta luminosita ed un aspetto estetico integrato nel contesto architettonico grazie all effetto brunito del film. E un prodotto molto adatto in contesti di pregio architettonico, centri storici e casali.`,
    technicalSheetUrl: '/assets/tech-sheets/sb-35-e-ps-sr.pdf',
    caratteristiche: [
      'Resistenza e durata nel tempo grazie alla sofisticata tecnologia sputtering',
      'Riflettono fino all 80% dell energia solare',
      'Maggiore trasmissione luminosa rispetto a SB 20 E PS SR',
      'Prodotto unico con doppio rivestimento antigraffio brevettato',
      'Doppio strato antigraffio per lunga durata',
      'Trasforma la vetrata esterna da 4 mm in vetro di sicurezza UNI EN 12600 classe 3B3',
    ],
    faq: [
      { q: 'A cosa serve Madico SB 35 E PS SR 75 micron?', a: 'E pensata per il controllo solare e comfort interno, riduce il calore e l abbaglio sulle superfici vetrate mantenendo alta luminosita e con basso impatto architettonico.' },
      { q: 'Su quali vetri conviene installarla?', a: 'Questa pellicola esprime la sua massima efficienza in vetri di nuova generazione con Ug inferiore a 1.10, ma puo essere installata su ogni vetrata nel lato esterno.' },
      { q: 'Quali prestazioni e utile confrontare?', a: 'Le prestazioni di una pellicola variano a seconda del tipo di vetro sul quale viene applicata. Sicuramente e importante usare pellicole che hanno prestazioni certificate come tutti i prodotti MADICO.' },
      { q: 'Che garanzia e prevista?', a: 'La garanzia e 10 anni ma soggetta a limitazioni. Per approfondire si consiglia di consultare la sezione dedicata all interno di questo sito.' },
      { q: 'Come si arriva alla scelta finale?', a: 'Si parte dall obiettivo, si verifica compatibilita del vetro e si conferma la soluzione con indicazioni chiare su posa e risultato atteso. La nostra esperienza vi aiutera a scegliere il prodotto giusto per ottenere il miglior risultato.' },
    ],
  },
  'madico-sg-20-e-ps-sr': {
    panoramicaBody: `Le pellicole antisolari sputtered SG 20 E PS SR Madico sono formate da una base di poliestere trasparente trattata con un processo chiamato sputtering che permette di raccogliere ed incorporare nella superficie della pellicola atomi di metallo, garantendo durata e prestazioni. Infine su questi viene posto un doppio trattamento antigraffio brevettato per proteggerlo da abrasioni e corrosioni.

Grazie alla sofisticata tecnologia con la quale sono realizzate garantiscono resistenza e durata nel tempo.
Riflettono fino all 84% dell energia solare rendendo gli ambienti piu freschi e confortevoli, con buona trasmissione luminosa e tono neutro grigio fume.
Pellicole piu armoniche che consentono una buona schermatura solare lasciando quasi inalterata la trasparenza e visibilita ed con effetto speculare meno invasivo.
Prodotto unico con doppio rivestimento antigraffio brevettato.
Struttura rivoluzionaria con doppio strato antigraffio per una lunga durata.
Trasforma la vetrata esterna da 4 mm in un vetro di sicurezza con certificazione a norma UNI EN 12600 in classe 3B3.
Pellicole antisolari che conferiscono a un normale vetro eccellenti prestazioni di controllo solare e sicurezza.`,
    contextBody: `Questa pellicola e consigliata per ambienti dove si vuole alte prestazioni di respinta energetica ma allo stesso tempo si richiede alta luminosita ed un aspetto estetico integrato nel contesto architettonico grazie al tono neutro grigio fume del film. E un prodotto molto adatto in contesti tipo aziende, uffici, scuole, banche, industrie e ospedali.`,
    technicalSheetUrl: '/assets/tech-sheets/sg-20-e-ps-sr.pdf',
    caratteristiche: [
      'Resistenza e durata nel tempo grazie alla sofisticata tecnologia sputtering',
      'Riflettono fino all 84% dell energia solare',
      'Buona schermatura solare lasciando quasi inalterata la trasparenza',
      'Prodotto unico con doppio rivestimento antigraffio brevettato',
      'Doppio strato antigraffio per lunga durata',
      'Trasforma la vetrata esterna da 4 mm in vetro di sicurezza UNI EN 12600 classe 3B3',
    ],
    faq: [
      { q: 'A cosa serve Madico SG 20 E PS SR 75 micron?', a: 'E pensata per il controllo solare e comfort interno, riduce il calore e l abbaglio sulle superfici vetrate mantenendo alta luminosita e con basso impatto architettonico.' },
      { q: 'Su quali vetri conviene installarla?', a: 'Questa pellicola esprime la sua massima efficienza in vetri di nuova generazione con Ug inferiore a 1.10, ma puo essere installata su ogni vetrata nel lato esterno.' },
      { q: 'Quali prestazioni e utile confrontare?', a: 'Le prestazioni di una pellicola variano a seconda del tipo di vetro sul quale viene applicata. Sicuramente e importante usare pellicole che hanno prestazioni certificate come tutti i prodotti MADICO.' },
      { q: 'Che garanzia e prevista?', a: 'La garanzia e 10 anni ma soggetta a limitazioni. Per approfondire si consiglia di consultare la sezione dedicata all interno di questo sito.' },
      { q: 'Come si arriva alla scelta finale?', a: 'Si parte dall obiettivo, si verifica compatibilita del vetro e si conferma la soluzione con indicazioni chiare su posa e risultato atteso. La nostra esperienza vi aiutera a scegliere il prodotto giusto per ottenere il miglior risultato.' },
    ],
  },
  'madico-sl-8-e-ps-sr': {
    panoramicaBody: `Le pellicole antisolari Madico SL 8 sono consigliate per il rivestimento di grandi superfici vetrate che richiedono una elevata riflessione dell irraggiamento solare e protezione dall abbaglio. Il secondo rivestimento fume permette alla pellicola di abbattere i riflessi all interno degli ambienti, in particolar modo sui videoterminali.

Respingendo fino al 94% dell irraggiamento solare offre il massimo in termini di protezione, limitando da una parte l incremento del calore e dall altra riducendo drasticamente l abbaglio. Questo dona agli ambienti un comfort termico e visivo impareggiabile rispetto ai prodotti analoghi presenti sul mercato.
E una pellicola innovativa, caratterizzata da un effetto estetico speculare colore argento verso l esterno e colore fume all interno.
Prodotto unico con doppio rivestimento antigraffio brevettato.
Struttura rivoluzionaria con doppio strato antigraffio per una lunga durata.
Pellicola antisolare che conferisce a un normale vetro eccellenti prestazioni di controllo solare e sicurezza.
Trasforma la vetrata esterna da 4 mm in un vetro di sicurezza con certificazione a norma UNI EN 12600 in classe 3B3.
La pellicola antisolare Sunscape Madico SL 8 e realizzata con l avanzato processo di metallizzazione sputtering, che permette di raccogliere ed incorporare nella superficie della pellicola atomi di metallo, garantendo durata e prestazioni. Infine su questi viene posto un doppio trattamento antigraffio brevettato per proteggerlo da abrasioni e corrosioni.`,
    contextBody: `Questa pellicola e consigliata nelle vetrate a tetto e dove si vuole ridurre in maniera efficace l abbaglio. Sono ideali per uffici, scuole, banche, industrie, ospedali, alberghi, ristoranti, servizi pubblici e palestre. E adatta a contesti professionali e pubblici in cui servono controllo solare elevato, comfort visivo e continuita operativa degli ambienti.`,
    technicalSheetUrl: '/assets/tech-sheets/sl-8-e-ps-sr.pdf',
    caratteristiche: [
      'Respingono fino al 94% dell irraggiamento solare',
      'Effetto estetico speculare argento esterno, fume interno',
      'Consigliato nelle vetrate a tetto e dove si vuole ridurre in maniera efficace l abbaglio',
      'Prodotto unico con doppio rivestimento antigraffio brevettato',
      'Doppio strato antigraffio per lunga durata',
      'Trasforma la vetrata esterna da 4 mm in vetro di sicurezza UNI EN 12600 classe 3B3',
    ],
    faq: [
      { q: 'A cosa serve Madico SL 8 E PS SR 75 Micron?', a: 'E pensata per il controllo solare e comfort interno, riduce il calore e l abbaglio sulle superfici vetrate mantenendo un elevata efficacia schermante.' },
      { q: 'Su quali vetri conviene installarla?', a: 'Questa pellicola e adatta soprattutto a grandi superfici vetrate e vetrate a tetto, con posa sul lato esterno per massimizzare la resa in condizioni di forte irraggiamento.' },
      { q: 'Quali prestazioni e utile confrontare?', a: 'Le prestazioni cambiano in base al tipo di vetro. Per una scelta corretta conviene leggere energia respinta, riduzione abbaglio e compatibilita con il vetro esistente, utilizzando dati certificati come quelli dei prodotti MADICO.' },
      { q: 'Che garanzia e prevista?', a: 'La garanzia e 10 anni ma soggetta a limitazioni. Per approfondire si consiglia di consultare la sezione dedicata all interno di questo sito.' },
      { q: 'Come si arriva alla scelta finale?', a: 'Si parte dall obiettivo, si verifica compatibilita del vetro e si conferma la soluzione con indicazioni chiare su posa e risultato atteso. La nostra esperienza vi aiutera a scegliere il prodotto giusto per ottenere il miglior risultato.' },
    ],
  },
  'ssn-70-te-sr': {
    panoramicaBody: `Le pellicole antisolari spettro selettive Hi-Tec-Clear SSN 70 TE SR sono consigliate per vetrate che fanno entrare molto calore negli ambienti interni, ma si ha l esigenza di mantenere inalterata la trasparenza e l aspetto estetico delle vetrate.

La pellicola Hi-Tec-Clear SSN 70 TE SR e una pellicola per vetri spettro selettiva estremamente resistente specifica per applicazioni in esterno. Il rivestimento esterno utilizza una innovativa tecnologia brevettata particolarmente resistente ai graffi.
Bloccando oltre l 84% dei raggi infrarossi (calore) e lasciando passare un elevata quantita di luce visibile garantisce ambienti interni piu freschi e confortevoli, costi di condizionamento ridotti ed un elevata trasparenza, preservando l aspetto estetico originale del vetro.
L ultima evoluzione tecnologica nel campo delle pellicole per vetri e rappresentata dalle pellicole antisolari spettro selettive della serie Hi-Tec-Clear, distribuite in esclusiva da Solaris.`,
    contextBody: `Sono ideali per vetrine, uffici, musei, show room, scuole, banche e per tutti gli edifici dove vi sono vincoli storici, paesaggistici o ambientali.`,
    technicalSheetUrl: '/assets/tech-sheets/ssn-70-te-sr.pdf',
    caratteristiche: [
      'Elegante aspetto neutro ed elevata trasparenza ottica',
      'Elevata trasmissione della luce visibile: ambienti freschi e luminosi',
      'Scherma il 59% del calore solare su vetrocamera 6 mm',
      'Blocca oltre il 99% dei raggi ultravioletti',
      'Bassa riflessione interna ed esterna, visuale inalterata',
    ],
    faq: [
      { q: 'A cosa serve SSN 70 TE SR?', a: 'E pensata per il controllo solare e comfort interno, riduce il calore e l abbaglio sulle superfici vetrate mantenendo alta luminosita e con basso impatto architettonico.' },
      { q: 'Su quali vetri conviene installarla?', a: 'Questa pellicola esprime la sua massima efficienza su vetrocamera. In questa scheda i dati principali sono riferiti a vetrocamera 6 mm, con posa sul lato esterno.' },
      { q: 'Quali prestazioni e utile confrontare?', a: 'Le prestazioni di una pellicola variano a seconda del tipo di vetro sul quale viene applicata. Sicuramente e importante usare pellicole che hanno prestazioni certificate come tutti i prodotti MADICO.' },
      { q: 'Che garanzia e prevista?', a: 'La garanzia e 10 anni ma soggetta a limitazioni. Per approfondire si consiglia di consultare la sezione dedicata all interno di questo sito.' },
      { q: 'Come si arriva alla scelta finale?', a: 'Si parte dall obiettivo, si verifica compatibilita del vetro e si conferma la soluzione con indicazioni chiare su posa e risultato atteso. La nostra esperienza vi aiutera a scegliere il prodotto giusto per ottenere il miglior risultato.' },
    ],
  },
  'madico-rs-20-e-ps-sr': {
    panoramicaBody: `La pellicola antisolare riflettente RS 20 E PS SR e consigliata per vetrate con grossi problemi di insolazione, abbaglio e conseguente surriscaldamento degli ambienti interni.

Consentono di ridurre l ingresso di calore fino all 89% ottenendo ambienti piu freschi e confortevoli.
In presenza di impianti di condizionamento offrono un notevole risparmio energetico consentendo l ammortamento della spesa in pochi anni.
Riducono l abbaglio, offrendo un maggiore comfort visivo.
Sono ideali per la difesa della privacy, consentendo di vedere dall interno verso l esterno ma evitando la visione dall esterno verso l interno nelle ore diurne.
Garantiscono una maggiore eleganza all edificio.
Esiste anche in versione di sicurezza, da 4Mil e da 8Mil che permette di ottemperare alle disposizioni previste dal Testo Unico D.Lgs 81/2008 in materia di sicurezza.
Prodotto unico, con brevetto esclusivo.
Struttura rivoluzionaria con doppio strato antigraffio per una lunga durata.
Trasforma la vetrata esterna da 4 mm in un vetro di sicurezza con certificazione a norma UNI EN 12600 in classe 3B3.`,
    contextBody: `E ideale per uffici, scuole, banche, industrie, ospedali, alberghi, ristoranti, servizi pubblici e palestre, dove si vuole ottenere un effetto moderno e specchiante.`,
    technicalSheetUrl: '/assets/tech-sheets/rs-20-e-ps-sr.pdf',
    caratteristiche: [
      'Riduce l ingresso di calore fino all 89%',
      'Risparmio energetico con ammortamento in pochi anni',
      'Riduzione abbaglio e maggiore comfort visivo',
      'Privacy diurna con visione interna verso esterno',
      'Prodotto unico con brevetto esclusivo',
      'Doppio strato antigraffio e certificazione UNI EN 12600 classe 3B3',
    ],
    faq: [
      { q: 'A cosa serve Madico RS 20 E PS SR 75 Micron?', a: 'E pensata per il controllo solare e comfort interno, riduce il calore e l abbaglio sulle superfici vetrate con effetto riflettente e buon livello di privacy diurna.' },
      { q: 'Su quali vetri conviene installarla?', a: 'Questa pellicola e consigliata su vetrate con forte irraggiamento e surriscaldamento interno. Per questa scheda i dati principali sono riferiti a vetro singolo 6 mm con posa esterna.' },
      { q: 'Quali prestazioni e utile confrontare?', a: 'Le prestazioni di una pellicola variano a seconda del tipo di vetro sul quale viene applicata. Conviene confrontare energia respinta, riduzione abbaglio, riflessione luminosa e compatibilita con il vetro esistente.' },
      { q: 'Che garanzia e prevista?', a: 'La garanzia e 10 anni ma soggetta a limitazioni. Per approfondire si consiglia di consultare la sezione dedicata all interno di questo sito.' },
      { q: 'Come si arriva alla scelta finale?', a: 'Si parte dall obiettivo, si verifica compatibilita del vetro e si conferma la soluzione con indicazioni chiare su posa e risultato atteso. La nostra esperienza vi aiutera a scegliere il prodotto giusto per ottenere il miglior risultato.' },
    ],
  },
  'madico-rs-40-e-ps-sr': {
    panoramicaBody: `Le pellicole antisolari riflettenti Madico RS 40 E PS SR sono consigliate dove non si vuole un effetto specchio molto marcato.

Consentono di ridurre l ingresso di calore fino al 61% ottenendo ambienti piu freschi e confortevoli.
In presenza di impianti di condizionamento offrono un notevole risparmio energetico consentendo l ammortamento della spesa in pochi anni.
Riducono il calore con basso effetto speculare.
Struttura rivoluzionaria con doppio strato antigraffio brevettato per una lunga durata.
Trasforma la vetrata esterna da 4 mm in un vetro di sicurezza con certificazione a norma UNI EN 12600 in classe 3B3.
Le pellicole antisolari riflettenti dell americana Madico, distribuite da Solaris, sono formate da una base di materiale poliestere trasparente sulla quale viene posto un rivestimento estremamente sottile di alluminio vaporizzato a densita controllata. Su questo viene posto un ulteriore strato di poliestere con un successivo trattamento antigraffio per proteggerlo da abrasioni e corrosioni. L effetto esterno che si ottiene e speculare di colore argento.`,
    contextBody: `Sono ideali per uffici, scuole, banche, industrie, ospedali, alberghi, ristoranti, servizi pubblici e palestre. Soluzione adatta quando si cerca riduzione calore e un prodotto elegante a basso impatto estetico. Garantiscono una maggiore eleganza all estetica dell edificio. Esiste anche in versione di sicurezza, che permette di ottemperare alle disposizioni previste dal Testo Unico D.Lgs 81/2008 in materia di sicurezza. Prodotto unico, con brevetto esclusivo.`,
    technicalSheetUrl: '/assets/tech-sheets/rs-40-e-ps-sr.pdf',
    caratteristiche: [
      'Riduce l ingresso di calore fino al 61%',
      'Risparmio energetico con ammortamento in pochi anni',
      'Riduzione calore con basso effetto speculare',
      'Prodotto elegante a basso impatto estetico',
      'Prodotto unico con brevetto esclusivo',
      'Doppio strato antigraffio brevettato e certificazione UNI EN 12600 classe 3B3',
    ],
    faq: [
      { q: 'A cosa serve Madico RS 40 E PS SR?', a: 'E pensata per ridurre il calore in ingresso con un effetto specchiante piu contenuto rispetto alle versioni piu riflettenti, mantenendo comfort interno e buona resa estetica.' },
      { q: 'Su quali vetri conviene installarla?', a: 'E consigliata su vetrate esposte a forte irraggiamento dove si vuole contenere il surriscaldamento senza un effetto specchio molto marcato. La posa prevista e sul lato esterno.' },
      { q: 'Quali prestazioni e utile confrontare?', a: 'Per una scelta corretta conviene confrontare totale energia respinta, trasmissione luminosa, riduzione abbaglio e livello di riflessione, sempre in base al tipo di vetro esistente.' },
      { q: 'Che garanzia e prevista?', a: 'La garanzia e 10 anni ma soggetta a limitazioni. Per approfondire si consiglia di consultare la sezione dedicata all interno di questo sito.' },
      { q: 'Come si arriva alla scelta finale?', a: 'Si parte dall obiettivo, si verifica compatibilita del vetro e si conferma la soluzione con indicazioni chiare su posa e risultato atteso. La nostra esperienza vi aiutera a scegliere il prodotto giusto per ottenere il miglior risultato.' },
    ],
  },
  'madico-rs-30-e-ps-sr': {
    panoramicaBody: `Le pellicole antisolari riflettenti Madico RS 30 E PS SR sono pensate come soluzione intermedia tra RS 20 e RS 40.

Consentono di ridurre l ingresso di calore fino al 71% ottenendo ambienti piu freschi e confortevoli.
In presenza di impianti di condizionamento offrono un buon risparmio energetico e una gestione piu stabile del comfort interno.
Riduzione abbaglio con effetto speculare moderato, quindi adatta quando si cerca una resa piu equilibrata tra schermatura e luminosita.
Struttura rivoluzionaria con doppio strato antigraffio brevettato per una lunga durata.
Trasforma la vetrata esterna da 4 mm in un vetro di sicurezza con certificazione a norma UNI EN 12600 in classe 3B3.
Le pellicole antisolari riflettenti dell americana Madico, distribuite da Solaris, sono formate da una base di materiale poliestere trasparente con rivestimento metallico a densita controllata e protezione antigraffio per uso esterno.`,
    contextBody: `Sono ideali per uffici, scuole, banche, industrie, ospedali, alberghi, ristoranti, servizi pubblici e palestre. Soluzione adatta quando serve un livello intermedio tra effetto specchiante marcato e basso impatto estetico.`,
    caratteristiche: [
      'Riduce l ingresso di calore fino al 71%',
      'Buon equilibrio tra schermatura e luminosita interna',
      'Riduzione abbaglio con effetto speculare moderato',
      'Prodotto elegante a basso impatto estetico',
      'Prodotto unico con brevetto esclusivo',
      'Doppio strato antigraffio brevettato e certificazione UNI EN 12600 classe 3B3',
    ],
    faq: [
      { q: 'A cosa serve Madico RS 30 E PS SR?', a: 'E pensata per ridurre il calore in ingresso e migliorare il comfort visivo con una riflessione intermedia tra RS 20 e RS 40.' },
      { q: 'Su quali vetri conviene installarla?', a: 'E consigliata su vetrate esposte a irraggiamento elevato quando si cerca una soluzione equilibrata tra schermatura solare e resa estetica. La posa prevista e sul lato esterno.' },
      { q: 'Quali prestazioni e utile confrontare?', a: 'Per una scelta corretta conviene confrontare totale energia respinta, trasmissione luminosa, riduzione abbaglio e livello di riflessione, sempre in base al tipo di vetro esistente.' },
      { q: 'Che garanzia e prevista?', a: 'La garanzia e 10 anni ma soggetta a limitazioni. Per approfondire si consiglia di consultare la sezione dedicata all interno di questo sito.' },
      { q: 'Come si arriva alla scelta finale?', a: 'Si parte dall obiettivo, si verifica compatibilita del vetro e si conferma la soluzione con indicazioni chiare su posa e risultato atteso. La nostra esperienza vi aiutera a scegliere il prodotto giusto per ottenere il miglior risultato.' },
    ],
  },
  'madico-rs-20-ps-sr-4mil': {
    panoramicaBody: `La pellicola certificata antisolare di sicurezza Madico RS 20 PS SR 4 MIL e testata e certificata in conformita alla Norma europea EN 12600, classe 2B2 su lastra singola da 2, 3, 4 e 6 mm. Le proprieta riflettenti la rendono ideale per vetrate con grossi problemi di insolazione, abbaglio e conseguente surriscaldamento degli ambienti interni.

Prodotta con processi produttivi tecnologicamente innovativi, utilizzando collanti e poliestere di alta qualita, si colloca ai massimi livelli per affidabilita. La struttura nasce da una base di poliestere trasparente su cui viene applicato un rivestimento estremamente sottile di alluminio vaporizzato. Un ulteriore strato di poliestere con trattamento antigraffio protegge il film da abrasioni e corrosioni e conferisce l effetto specchiato argento.

Consente la messa in sicurezza delle superfici vetrate nei luoghi di lavoro in conformita al Testo Unico D.Lgs. 81/2008.`,
    contextBody: `Consigliata per uffici, scuole, banche, industrie, ospedali, servizi pubblici e aree di passaggio dove serve protezione antinfortunistica insieme a controllo solare. Offre un ambiente piu sicuro, fresco e confortevole: riduce il calore, limita l abbaglio, scherma oltre il 99% dei raggi UV e mantiene una visuale cristallina senza distorsioni ottiche.`,
    caratteristiche: [
      'Certificata UNI EN 12600 classe 2B2 su vetro singolo da 2, 3, 4 e 6 mm',
      'Riduzione del calore e miglior comfort interno',
      'Riduzione abbaglio su superfici vetrate esposte',
      'Contenimento frammenti in caso di rottura del vetro',
      'Schermatura oltre il 99% dei raggi UV',
      'Supporto alla conformita D.Lgs 81/2008',
    ],
    technicalSheetUrl: '/assets/tech-sheets/rs-20-e-ps-sr-4-mil.pdf',
    faq: [
      { q: 'A cosa serve Madico RS 20 PS SR 4 MIL?', a: 'Serve a combinare controllo solare e sicurezza del vetro: riduce calore e abbaglio, e allo stesso tempo trattiene i frammenti in caso di rottura.' },
      { q: 'Quando conviene scegliere la versione 4 MIL?', a: 'Quando serve un buon livello di protezione antinfortunistica certificata con una soluzione piu leggera rispetto agli spessori superiori, mantenendo equilibrio tra resa tecnica e impatto estetico.' },
      { q: 'Su quali vetri va verificata prima della posa?', a: 'Va verificata sul vetro reale in opera. In questa scheda il riferimento principale e vetro singolo, ma la compatibilita finale dipende da composizione del serramento, esposizione e dimensioni della lastra.' },
      { q: 'Che garanzia e prevista?', a: 'La garanzia e 10 anni ma soggetta a limitazioni. Per approfondire si consiglia di consultare la sezione dedicata all interno di questo sito.' },
      { q: 'Come si conferma la scelta corretta?', a: 'Si parte dall obiettivo, si verifica compatibilita del vetro e si conferma la soluzione con indicazioni chiare su posa e risultato atteso. La nostra esperienza vi aiutera a scegliere il prodotto giusto per ottenere il miglior risultato.' },
    ],
  },
  'madico-rs-20-ps-sr-8mil': {
    panoramicaBody: `La pellicola certificata antisolare di sicurezza Madico RS 20 PS SR 8 MIL e testata e certificata in conformita alla Norma europea EN 12600, classe 1B1 su lastra singola da 2, 3, 4 e 6 mm. Le proprieta riflettenti la rendono ideale per vetrate con grossi problemi di insolazione, abbaglio e conseguente surriscaldamento degli ambienti interni.

Prodotta con processi produttivi tecnologicamente innovativi, utilizzando collanti e poliestere di alta qualita, si colloca ai massimi livelli per affidabilita. La struttura nasce da una base di poliestere trasparente su cui viene applicato un rivestimento estremamente sottile di alluminio vaporizzato. Un ulteriore strato di poliestere con trattamento antigraffio protegge il film da abrasioni e corrosioni e conferisce l effetto specchiato argento.

Consente la messa in sicurezza delle superfici vetrate nei luoghi di lavoro in conformita al Testo Unico D.Lgs. 81/2008.`,
    contextBody: `Consigliata per uffici, scuole, banche, industrie, ospedali, servizi pubblici e aree di passaggio dove serve un livello di sicurezza superiore insieme al controllo solare. Offre un ambiente piu sicuro, fresco e confortevole: riduce il calore, limita l abbaglio, scherma oltre il 99% dei raggi UV e mantiene una visuale cristallina senza distorsioni ottiche.`,
    caratteristiche: [
      'Certificata UNI EN 12600 classe 1B1 su vetro singolo da 2, 3, 4 e 6 mm',
      'Maggiore spessore con protezione antinfortunistica rinforzata',
      'Riduzione del calore e miglior comfort interno',
      'Riduzione abbaglio su superfici vetrate esposte',
      'Schermatura oltre il 99% dei raggi UV',
      'Supporto alla conformita D.Lgs 81/2008',
    ],
    technicalSheetUrl: '/assets/tech-sheets/rs-20-e-ps-sr-8-mil.pdf',
    faq: [
      { q: 'A cosa serve Madico RS 20 PS SR 8 MIL?', a: 'Serve a combinare controllo solare e sicurezza rinforzata del vetro: riduce calore e abbaglio e offre una trattenuta frammenti piu elevata rispetto agli spessori inferiori.' },
      { q: 'Qual e il vantaggio principale rispetto alla 4 MIL?', a: 'La 8 MIL raggiunge una classe di sicurezza superiore (1B1), con maggiore capacita di contenimento in caso di rottura del vetro.' },
      { q: 'Su quali vetri e certificata?', a: 'La certificazione riportata e su lastra singola da 2, 3, 4 e 6 mm. La compatibilita finale va sempre verificata sul vetro reale in opera.' },
      { q: 'Che garanzia e prevista?', a: 'La garanzia e 10 anni ma soggetta a limitazioni. Per approfondire si consiglia di consultare la sezione dedicata all interno di questo sito.' },
      { q: 'Come si conferma la scelta corretta?', a: 'Si parte dall obiettivo, si verifica compatibilita del vetro e si conferma la soluzione con indicazioni chiare su posa e risultato atteso. La nostra esperienza vi aiutera a scegliere il prodotto giusto per ottenere il miglior risultato.' },
    ],
  },
  'madico-rs-40-ps-sr-4mil': {
    panoramicaBody: `La pellicola antisolare di sicurezza Madico RS 40 PS SR 4 Mil e testata e certificata in conformita alla Norma europea EN12600, classe 2B2 su lastra singola da 3, 4 e 6 mm. Le proprieta riflettenti la rendono ideale per vetrate con grossi problemi di insolazione, abbaglio e conseguente surriscaldamento degli ambienti interni.

Prodotta con processi produttivi tecnologicamente innovativi utilizzando i migliori collanti ed il miglior poliestere, si colloca al primo posto per qualita ed affidabilita. Le pellicole antisolari riflettenti Madico RS 40 PS SR 4 Mil sono formate da una base di poliestere trasparente sulla quale viene posto un rivestimento estremamente sottile di alluminio vaporizzato. Viene aggiunto un ulteriore strato di poliestere con un trattamento antigraffio per proteggerlo da abrasioni e corrosioni. Questo conferisce l aspetto specchiato di colore argento.

Consente la messa in sicurezza di qualsiasi superficie vetrata obbligatoria sui luoghi di lavoro in conformita al Testo Unico D.lgs. 81/2008.`,
    contextBody: `Offre una costante protezione antinfortunistica in caso di rottura del vetro. Riflette il calore solare riducendo l utilizzo dei climatizzatori e i costi estivi. Rende l ambiente piu sicuro, fresco e confortevole, riduce l abbaglio, scherma oltre il 99% dei raggi UV e garantisce una visuale cristallina senza distorsioni ottiche. E la versione piu chiara della serie RS rispetto alla RS 20.`,
    caratteristiche: [
      'Certificata UNI EN 12600 classe 2B2 su vetro singolo',
      'Versione piu chiara della serie RS rispetto alla RS 20',
      'Riduzione del calore con maggiore trasmissione luminosa',
      'Protezione antinfortunistica in caso di rottura',
      'Schermatura oltre il 99% dei raggi UV',
      'Supporto alla conformita D.Lgs 81/2008',
    ],
    technicalSheetUrl: '/assets/tech-sheets/rs-40-ps-sr-4-mil.pdf',
    faq: [
      { q: 'A cosa serve Madico RS 40 PS SR 4 MIL?', a: 'Serve a combinare sicurezza e controllo solare mantenendo piu luce naturale rispetto alla versione RS 20.' },
      { q: 'Qual e la differenza principale rispetto alla RS 20 PS SR 4 MIL?', a: 'La RS 40 PS SR 4 MIL e la variante piu chiara: riduce il calore ma con trasmissione luminosa superiore.' },
      { q: 'Su quali vetri e certificata?', a: 'La certificazione riportata e EN 12600 classe 2B2 su lastra singola da 3, 4 e 6 mm.' },
      { q: 'Che garanzia e prevista?', a: 'La garanzia e 10 anni ma soggetta a limitazioni. Per approfondire si consiglia di consultare la sezione dedicata all interno di questo sito.' },
      { q: 'Come si conferma la scelta corretta?', a: 'Si parte dall obiettivo, si verifica compatibilita del vetro e si conferma la soluzione con indicazioni chiare su posa e risultato atteso. La nostra esperienza vi aiutera a scegliere il prodotto giusto per ottenere il miglior risultato.' },
    ],
  },
  'madico-rs-40-ps-sr-8mil': {
    panoramicaBody: `La pellicola antisolare di sicurezza Madico RS 40 PS SR 8 Mil e testata e certificata in conformita alla Norma europea EN12600, classe 1B1 su lastra singola da 3, 4 e 6 mm. Le proprieta riflettenti la rendono ideale per vetrate con grossi problemi di insolazione, abbaglio e conseguente surriscaldamento degli ambienti interni.

Prodotta con processi produttivi tecnologicamente innovativi utilizzando i migliori collanti ed il miglior poliestere, si colloca al primo posto per qualita ed affidabilita. Le pellicole antisolari riflettenti Madico RS 40 PS SR 8 Mil sono formate da una base di poliestere trasparente sulla quale viene posto un rivestimento estremamente sottile di alluminio vaporizzato. Viene aggiunto un ulteriore strato di poliestere con un trattamento antigraffio per proteggerlo da abrasioni e corrosioni. Questo conferisce l aspetto specchiato di colore argento.

Consente la messa in sicurezza di qualsiasi superficie vetrata obbligatoria sui luoghi di lavoro in conformita al Testo Unico D.lgs. 81/2008.`,
    contextBody: `Offre una costante protezione antinfortunistica in caso di rottura del vetro. Riflette il calore solare riducendo l utilizzo dei climatizzatori e i costi estivi. Rende l ambiente piu sicuro, fresco e confortevole, riduce l abbaglio, scherma oltre il 99% dei raggi UV e garantisce una visuale cristallina senza distorsioni ottiche. E la versione piu chiara della serie RS rispetto alla RS 20.`,
    caratteristiche: [
      'Certificata UNI EN 12600 classe 1B1 su vetro singolo',
      'Versione piu chiara rispetto alla RS 20',
      'Spessore 8 MIL per protezione rinforzata',
      'Riduzione del calore e miglior comfort interno',
      'Schermatura oltre il 99% dei raggi UV',
      'Supporto alla conformita D.Lgs 81/2008',
    ],
    technicalSheetUrl: '/assets/tech-sheets/rs-40-ps-sr-8-mil.pdf',
    faq: [
      { q: 'A cosa serve Madico RS 40 PS SR 8 MIL?', a: 'Serve a combinare sicurezza rinforzata e controllo solare con una resa piu chiara rispetto alla famiglia RS 20.' },
      { q: 'Qual e la differenza principale rispetto alla RS 20 PS SR 8 MIL?', a: 'La RS 40 PS SR 8 MIL mantiene un orientamento piu luminoso, quindi e utile quando vuoi piu luce interna senza rinunciare alla protezione.' },
      { q: 'Su quali vetri e certificata?', a: 'La certificazione riportata e EN 12600 classe 1B1 su lastra singola da 3, 4 e 6 mm.' },
      { q: 'Che garanzia e prevista?', a: 'La garanzia e 10 anni ma soggetta a limitazioni. Per approfondire si consiglia di consultare la sezione dedicata all interno di questo sito.' },
      { q: 'Come si conferma la scelta corretta?', a: 'Si parte dall obiettivo, si verifica compatibilita del vetro e si conferma la soluzione con indicazioni chiare su posa e risultato atteso. La nostra esperienza vi aiutera a scegliere il prodotto giusto per ottenere il miglior risultato.' },
    ],
  },
  'madico-cl-400-ps-sr': {
    panoramicaBody: `La pellicola di sicurezza Madico CL 400 PS SR e testata e certificata in conformita alla Norma Europea EN12600, classe 2B2 su lastra singola da 2, 3, 4 e 6 mm. E la versione da interno della famiglia CL 400, neutra e trasparente, pensata per aumentare la sicurezza del vetro senza alterarne l aspetto.

Prodotta con processi tecnologicamente innovativi, con collanti e poliestere di alta qualita, offre affidabilita nel tempo. La struttura e singolo strato con adesivo acrilico sensibile alla pressione.

Consente la messa in sicurezza delle superfici vetrate nei luoghi di lavoro in conformita al Testo Unico D.lgs. 81/2008.`,
    contextBody: `Ideale per uffici, scuole, banche, aree comuni e ambienti professionali dove serve protezione antinfortunistica con trasparenza quasi totale. L intervento e rapido, non invasivo e non richiede la sostituzione degli infissi.`,
    caratteristiche: [
      'Certificata UNI EN 12600 classe 2B2 su vetro singolo da 2, 3, 4 e 6 mm',
      'Protezione antinfortunistica in caso di rottura del vetro',
      'Trasparenza elevata con resa visiva neutra',
      'Applicazione rapida senza modificare gli infissi',
      'Schermatura oltre il 99% dei raggi UV',
      'Supporto alla conformita D.Lgs 81/2008',
    ],
    technicalSheetUrl: '/assets/tech-sheets/cl-400-ps-sr.pdf',
    faq: [
      { q: 'A cosa serve Madico CL 400 PS SR?', a: 'Serve a mettere in sicurezza il vetro mantenendo una resa neutra e trasparente, riducendo il rischio di lesioni in caso di rottura.' },
      { q: 'Quando conviene scegliere una pellicola neutra CL?', a: 'Quando la priorita e la sicurezza del vetro ma si vuole preservare luminosita e aspetto originale della vetrata.' },
      { q: 'Su quali vetri e certificata?', a: 'La certificazione indicata e EN12600 classe 2B2 su lastra singola da 2, 3, 4 e 6 mm.' },
      { q: 'Che garanzia e prevista?', a: 'La garanzia e 10 anni ma soggetta a limitazioni. Per approfondire si consiglia di consultare la sezione dedicata all interno di questo sito.' },
      { q: 'Come si conferma la scelta corretta?', a: 'Si parte dall obiettivo, si verifica compatibilita del vetro e si conferma la soluzione con indicazioni chiare su posa e risultato atteso. La nostra esperienza vi aiutera a scegliere il prodotto giusto per ottenere il miglior risultato.' },
    ],
  },
  'madico-cl-400-e-ps-sr': {
    panoramicaBody: `La pellicola di sicurezza Madico CL 400 E PS SR e testata e certificata in conformita alla Norma Europea EN12600, classe 2B2 su lastra singola da 2, 3, 4 e 6 mm. E la versione da esterno della CL 400. Esiste anche la versione da interno CL 400 PS SR.

Prodotta con processi produttivi tecnologicamente innovativi con l utilizzo dei migliori collanti e del miglior poliestere, si colloca al primo posto per qualita e affidabilita.

Consente la messa in sicurezza di qualsiasi superficie vetrata obbligatoria sui luoghi di lavoro in conformita al Testo Unico D.lgs. 81/2008.`,
    contextBody: `Offre una costante protezione antinfortunistica in caso di rottura del vetro. Puo essere applicata su vetri esistenti con un operazione semplice, veloce, sicura ed economica, senza modificare gli infissi o interrompere l attivita. Mantiene trasparenza elevata con visuale cristallina e intervento praticamente invisibile.`,
    caratteristiche: [
      'Certificata UNI EN 12600 classe 2B2 su vetro singolo da 2, 3, 4 e 6 mm',
      'Versione da esterno della serie CL 400',
      'Protezione antinfortunistica in caso di rottura',
      'Applicazione rapida su vetri esistenti',
      'Trasparenza elevata senza distorsioni ottiche',
      'Supporto alla conformita D.Lgs 81/2008',
    ],
    technicalSheetUrl: '/assets/tech-sheets/cl-400-e-ps-sr.pdf',
    faq: [
      { q: 'A cosa serve Madico CL 400 E PS SR?', a: 'Serve a mettere in sicurezza il vetro con applicazione esterna, mantenendo trasparenza e continuita estetica della facciata.' },
      { q: 'Qual e la differenza rispetto alla CL 400 PS SR?', a: 'La CL 400 E PS SR e la versione per esterno; la CL 400 PS SR e la versione per interno.' },
      { q: 'Su quali vetri e certificata?', a: 'La certificazione indicata e EN12600 classe 2B2 su lastra singola da 2, 3, 4 e 6 mm.' },
      { q: 'Che garanzia e prevista?', a: 'La garanzia e 10 anni ma soggetta a limitazioni. Per approfondire si consiglia di consultare la sezione dedicata all interno di questo sito.' },
      { q: 'Come si conferma la scelta corretta?', a: 'Si parte dall obiettivo, si verifica compatibilita del vetro e si conferma la soluzione con indicazioni chiare su posa e risultato atteso. La nostra esperienza vi aiutera a scegliere il prodotto giusto per ottenere il miglior risultato.' },
    ],
  },
  'madico-cl-700-ps-sr': {
    panoramicaBody: `La pellicola certificata di sicurezza Madico CL 700 PS SR e testata e certificata in conformita alla Norma Europea EN12600, classe 1B1 su lastra singola da 3, 4 e 6 mm. Esiste anche la versione da esterno CL 700 E PS SR.

Prodotta con processi produttivi tecnologicamente innovativi con l utilizzo dei migliori collanti e del miglior poliestere si colloca al primo posto per qualita ed affidabilita.

Consente la messa in sicurezza di qualsiasi superficie vetrata obbligatoria sui luoghi di lavoro in conformita al Testo Unico D.lgs. 81/2008.`,
    contextBody: `Offre una costante protezione antinfortunistica in caso di rottura del vetro. Puo essere applicata su vetri gia esistenti con un operazione semplice, veloce, sicura ed economica, senza modificare gli infissi o interrompere la normale attivita lavorativa. Mantiene una visuale cristallina, con assenza di distorsioni ottiche e intervento praticamente invisibile.`,
    caratteristiche: [
      'Certificata UNI EN 12600 classe 1B1 su vetro singolo da 3, 4 e 6 mm',
      'Versione per applicazione interna',
      'Protezione antinfortunistica in caso di rottura del vetro',
      'Applicazione rapida su vetri esistenti',
      'Trasparenza elevata senza distorsioni ottiche',
      'Supporto alla conformita D.Lgs 81/2008',
    ],
    technicalSheetUrl: '/assets/tech-sheets/cl-700-ps-sr.pdf',
    faq: [
      { q: 'A cosa serve Madico CL 700 PS SR?', a: 'Serve a mettere in sicurezza il vetro con una classe di protezione elevata, mantenendo una resa neutra e trasparente.' },
      { q: 'Qual e la differenza rispetto alla CL 700 E PS SR?', a: 'La CL 700 PS SR e la versione per interno; la CL 700 E PS SR e la versione per esterno.' },
      { q: 'Su quali vetri e certificata?', a: 'La certificazione indicata e EN12600 classe 1B1 su lastra singola da 3, 4 e 6 mm.' },
      { q: 'Che garanzia e prevista?', a: 'La garanzia e 10 anni ma soggetta a limitazioni. Per approfondire si consiglia di consultare la sezione dedicata all interno di questo sito.' },
      { q: 'Come si conferma la scelta corretta?', a: 'Si parte dall obiettivo, si verifica compatibilita del vetro e si conferma la soluzione con indicazioni chiare su posa e risultato atteso. La nostra esperienza vi aiutera a scegliere il prodotto giusto per ottenere il miglior risultato.' },
    ],
  },
  'madico-cl-700-e-ps-sr': {
    panoramicaBody: `La pellicola certificata di sicurezza Madico CL 700 E PS SR e testata e certificata in conformita alla Norma Europea EN12600, classe 1B1 su lastra singola da 3, 4 e 6 mm. Esiste anche la versione da interno CL 700 PS SR.

Prodotta con processi produttivi tecnologicamente innovativi con l utilizzo dei migliori collanti e del miglior poliestere si colloca al primo posto per qualita ed affidabilita.

Consente la messa in sicurezza di qualsiasi superficie vetrata obbligatoria sui luoghi di lavoro in conformita al Testo Unico D.lgs. 81/2008.`,
    contextBody: `Offre una costante protezione antinfortunistica in caso di rottura del vetro. Puo essere applicata su vetri gia esistenti con un operazione semplice, veloce, sicura ed economica, senza modificare gli infissi o interrompere la normale attivita lavorativa. Mantiene una visuale cristallina, con assenza di distorsioni ottiche e intervento praticamente invisibile.`,
    caratteristiche: [
      'Certificata UNI EN 12600 classe 1B1 su vetro singolo da 3, 4 e 6 mm',
      'Versione per applicazione esterna',
      'Protezione antinfortunistica in caso di rottura del vetro',
      'Applicazione rapida su vetri esistenti',
      'Trasparenza elevata senza distorsioni ottiche',
      'Supporto alla conformita D.Lgs 81/2008',
    ],
    technicalSheetUrl: '/assets/tech-sheets/cl-700-e-ps-sr.pdf',
    faq: [
      { q: 'A cosa serve Madico CL 700 E PS SR?', a: 'Serve a mettere in sicurezza il vetro con applicazione esterna, mantenendo trasparenza e continuita estetica della facciata.' },
      { q: 'Qual e la differenza rispetto alla CL 700 PS SR?', a: 'La CL 700 E PS SR e la versione per esterno; la CL 700 PS SR e la versione per interno.' },
      { q: 'Su quali vetri e certificata?', a: 'La certificazione indicata e EN12600 classe 1B1 su lastra singola da 3, 4 e 6 mm.' },
      { q: 'Che garanzia e prevista?', a: 'La garanzia e 10 anni ma soggetta a limitazioni. Per approfondire si consiglia di consultare la sezione dedicata all interno di questo sito.' },
      { q: 'Come si conferma la scelta corretta?', a: 'Si parte dall obiettivo, si verifica compatibilita del vetro e si conferma la soluzione con indicazioni chiare su posa e risultato atteso. La nostra esperienza vi aiutera a scegliere il prodotto giusto per ottenere il miglior risultato.' },
    ],
  },
};

const splitKeepUnitTogether = (name = '') => {
  const match = String(name).match(/^(.*?)(\s\d+\s(?:micron|Micron|MIL))$/);
  if (!match) return { main: name, unit: '' };
  return { main: match[1], unit: match[2].trim() };
};

const EnergyBar = ({ label, value, color = '#EAB308', light = false }) => {
  const numVal = parseInt(value) || 0;
  return (
    <div className="flex items-center gap-3">
      <span className={`text-sm w-44 shrink-0 ${light ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>{label}</span>
      <div className={`flex-1 h-2.5 rounded-full overflow-hidden ${light ? 'bg-[#E2E8F0]' : 'bg-white/5'}`}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${numVal}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <span className={`text-sm font-medium w-12 text-right ${light ? 'text-[#0A0F1C]' : 'text-white'}`}>{value}</span>
    </div>
  );
};

const SpecCard = ({ icon: Icon, label, value, light = false }) => {
  const SafeIcon = Icon || Shield;
  return (
  <div className={`${light ? 'bg-white border border-[#E2E8F0]' : 'card-glass'} rounded-xl p-5 text-center`}>
    <SafeIcon size={24} weight="fill" className={`mx-auto mb-2 ${light ? 'text-[#2563EB]' : 'text-[#EAB308]'}`} />
    <p className={`text-xs mb-1 ${light ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>{label}</p>
    <p className={`text-lg font-medium ${light ? 'text-[#0A0F1C]' : 'text-white'}`}>{value}</p>
  </div>
  );
};

const cleanLiveText = (value = '') => {
  return String(value || '')
    .replace(/&#8217;|&#39;|&rsquo;/gi, '\'')
    .replace(/\s+/g, ' ')
    .replace(/â€™|’/g, '\'')
    .replace(/Ã¨/g, 'è')
    .replace(/Ã /g, 'à')
    .replace(/Ã¹/g, 'ù')
    .replace(/Ã¬/g, 'ì')
    .replace(/Ã²/g, 'ò')
    .replace(/Ã©/g, 'é')
    .replace(/\btecnosolar\b/gi, 'Solaris')
    .replace(/\bStratum\b/gi, '')
    .replace(/\bStartum\b/gi, '')
    .trim();
};

const normalizePath = (path = '/') => (path.endsWith('/') ? path : `${path}/`);
const LIVE_SITE_ORIGIN = 'https://www.solarisfilms.it';

const resolveLiveHref = (href = '') => {
  if (!href) return '';
  if (/^https?:\/\//i.test(href)) return href;
  if (href.startsWith('//')) return `https:${href}`;
  if (href.startsWith('/')) return `${LIVE_SITE_ORIGIN}${href}`;
  return `${LIVE_SITE_ORIGIN}/${href.replace(/^\/+/, '')}`;
};

const pdfHrefFromBlock = (block = {}) => {
  if (block.href && /\.pdf($|\?)/i.test(block.href)) return block.href;
  const match = String(block.html || '').match(/href=["']([^"']+\.pdf(?:\?[^"']*)?)["']/i);
  return match?.[1] || '';
};

const extractLiveProductSections = (pageJson) => {
  const blocks = Array.isArray(pageJson?.contentBlocks) ? pageJson.contentBlocks : [];
  const takeParagraphAfterHeading = (headingText) => {
    const index = blocks.findIndex((b) => b.type === 'heading' && cleanLiveText(b.text).toLowerCase() === headingText.toLowerCase());
    if (index < 0) return '';
    const paragraph = blocks.slice(index + 1).find((b) => b.type === 'paragraph');
    return cleanLiveText(paragraph?.text || '');
  };

  const utilizzi = takeParagraphAfterHeading('Utilizzi');
  const specifiche = takeParagraphAfterHeading('Specifiche tecniche');
  const caratteristicheBlock = blocks.find(
    (b) => b.type === 'list'
      && Array.isArray(b.items)
      && b.items.length > 0
      && blocks.some((h) => h.type === 'heading' && cleanLiveText(h.text).toLowerCase() === 'caratteristiche distintive')
  );
  const caratteristiche = Array.isArray(caratteristicheBlock?.items)
    ? caratteristicheBlock.items.map((item) => cleanLiveText(item.text)).filter(Boolean).slice(0, 10)
    : [];

  return { utilizzi, specifiche, caratteristiche };
};

const buildProductFaq = (prodotto, dt) => {
  const overrides = PRODUCT_PAGE_OVERRIDES[prodotto?.slug];
  if (Array.isArray(overrides?.faq) && overrides.faq.length) return overrides.faq;

  const categoria = (prodotto?.categoria || '').toLowerCase();
  const categoriaLabel = prodotto?.categoria || 'questa pellicola';
  const applicazione = prodotto?.applicazione ? ` ${prodotto.applicazione}` : '';
  const garanzia = prodotto?.garanzia ? `La garanzia indicata e ${prodotto.garanzia}.` : 'La durata dipende dal tipo di vetro, dall esposizione e dalla posa.';
  const certificazione = prodotto?.certificazione ? `Il prodotto e associato a ${prodotto.certificazione}.` : 'Valutiamo il contesto per proporre la soluzione piu adatta.';
  const uv = dt?.uvTrasmessi ? `Il dato UV trasmessi e ${dt.uvTrasmessi}, utile per ridurre l impatto dei raggi UV.` : '';
  const energia = dt?.energiaRespinta ? `Il totale energia respinta arriva a ${dt.energiaRespinta}.` : '';
  const tipoVetro = prodotto?.tipoVetro ? `Il test principale e su ${prodotto.tipoVetro}.` : '';
  const caratteristiche = Array.isArray(prodotto?.caratteristiche) ? prodotto.caratteristiche.slice(0, 2).join('; ') : '';

  const firstAnswer =
    categoria.includes('sicurezza')
      ? `E pensata per aumentare la protezione del vetro e contenere i frammenti in caso di rottura.${tipoVetro}`
      : categoria.includes('privacy')
        ? `E pensata per migliorare riservatezza e resa visiva, mantenendo coerenza con il contesto del vetro.${tipoVetro}`
        : `E pensata per controllo solare e comfort interno, riducendo calore e abbaglio sulle superfici vetrate.${tipoVetro}`;

  return [
    {
      q: `A cosa serve ${prodotto?.nome || 'questa pellicola'}?`,
      a: firstAnswer,
    },
    {
      q: `Su quali vetri si valuta l installazione di ${prodotto?.nome || 'questo prodotto'}?`,
      a: `La valutazione parte sempre dal vetro esistente e dall uso reale dello spazio.${applicazione ? ` Ambito consigliato:${applicazione}.` : ''} ${tipoVetro}`.trim(),
    },
    {
      q: `Quali prestazioni conviene leggere per scegliere ${categoriaLabel.toLowerCase()}?`,
      a: `${energia} ${uv} ${caratteristiche ? `Tra le caratteristiche principali: ${caratteristiche}.` : ''}`.trim(),
    },
    {
      q: 'Che garanzia e certificazioni sono previste?',
      a: `${garanzia} ${certificazione}`.trim(),
    },
    {
      q: 'Come si arriva alla scelta finale?',
      a: 'Si parte dall obiettivo, si verifica compatibilita del vetro e si conferma la soluzione con indicazioni chiare su posa e risultato atteso.',
    },
  ];
};

const ProductFaqSection = ({ items = [] }) => {
  const [openIndex, setOpenIndex] = useState(0);
  if (!items.length) return null;

  return (
    <section className="py-12 section-light border-y border-[#E2E8F0]" data-testid="product-faq-section">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <h2 className="text-xl sm:text-2xl font-medium text-[#0A0F1C] mb-3">Domande frequenti</h2>
        <p className="text-[#475569] text-[15px] mb-8">Le risposte essenziali per decidere in modo chiaro e senza ambiguita.</p>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="rounded-xl overflow-hidden border border-[#E2E8F0] bg-white">
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F8FAFC] transition-colors"
              >
                <span className="text-[#0A0F1C] font-medium pr-4">{item.q}</span>
                <span className="text-[#64748B] text-lg leading-none">{openIndex === index ? '-' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 pt-0">
                  <div className="h-px bg-[#E2E8F0] mb-3" />
                  <p className="text-[#475569] leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProdottoPagina = () => {
  const { slug } = useParams();
  const { data: allProdotti } = useWPData('prodotti');
  const prodotto = allProdotti.find(p => p.slug === slug) || prodottiData.find(p => p.slug === slug);
  const [liveSections, setLiveSections] = useState({ utilizzi: '', specifiche: '', caratteristiche: [] });
  const [technicalSheetUrl, setTechnicalSheetUrl] = useState('');

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!prodotto?.slug) return;
      try {
        const indexRes = await fetch('/wp-data/live-pages-index.json');
        if (!indexRes.ok) return;
        const indexJson = await indexRes.json();
        const targetPath = normalizePath(`/prodotti/${prodotto.slug}`);
        const entry = (indexJson?.pages || []).find((page) => normalizePath(page?.route?.newPath || '') === targetPath);
        if (!entry?.file) return;

        const pageRes = await fetch(`/wp-data/live-pages/${entry.file}`);
        if (!pageRes.ok) return;
        const pageJson = await pageRes.json();
        const extracted = extractLiveProductSections(pageJson);
        const blocks = Array.isArray(pageJson?.contentBlocks) ? pageJson.contentBlocks : [];
        const pdfHref = blocks.map(pdfHrefFromBlock).find(Boolean) || '';
        if (mounted) {
          setLiveSections(extracted);
          setTechnicalSheetUrl(resolveLiveHref(pdfHref));
        }
      } catch {
        // keep fallback content
      }
    };
    run();
    return () => { mounted = false; };
  }, [prodotto?.slug]);

  if (!prodotto) {
    return (
      <div className="min-h-screen bg-[#0A0F1C]">
        <Header />
        <main className="pt-24">
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
              <h1 className="text-4xl font-medium text-white mb-6">Prodotto non trovato</h1>
              <Link to="/prodotti" className="btn-yellow" data-testid="back-to-products">Tutti i prodotti</Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const dt = prodotto.datiTecnici;
  const pageOverrides = PRODUCT_PAGE_OVERRIDES[prodotto.slug] || null;
  const hasSpecs = dt && dt.energiaSolare;
  const faqItems = buildProductFaq(prodotto, dt);
  const productVisual = PRODUCT_VISUALS[prodotto.slug] || null;

  const caratteristicheToShow = (
    pageOverrides?.caratteristiche?.length
      ? pageOverrides.caratteristiche
      : (liveSections.caratteristiche?.length ? liveSections.caratteristiche : (prodotto.caratteristiche || []))
  );
  const descrizioneHero = (liveSections.utilizzi || prodotto.descrizione || '').replace(/&#8217;|&#39;|&rsquo;/gi, '\'');
  const specificheBody = liveSections.specifiche || prodotto.specificheTecniche || '';
  const panoramicaBody = pageOverrides?.panoramicaBody || specificheBody;
  const contextBody = pageOverrides?.contextBody || 'Questa scheda aiuta a capire in modo rapido compatibilita del vetro, livello di schermatura e risultato atteso prima della posa.';
  const downloadSheetUrl = pageOverrides?.technicalSheetUrl || technicalSheetUrl;
  const titleParts = splitKeepUnitTogether(prodotto.nome);

  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid={`prodotto-${prodotto.slug}`}>
      <SEO title={`${prodotto.nome} — Pellicola ${prodotto.categoria}`} description={prodotto.descrizione?.substring(0, 160)} path={`/prodotti/${prodotto.slug}`} type="product" jsonLd={buildProductSchema(prodotto)} />
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div className="max-w-3xl">
                <Link to="/prodotti" className="inline-flex items-center gap-2 text-[#94A3B8] hover:text-[#EAB308] transition-colors text-sm mb-8" data-testid="breadcrumb-prodotti">
                  <ArrowLeft size={16} />
                  Tutti i prodotti
                </Link>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-[#EAB308] text-sm font-medium uppercase tracking-wider">{prodotto.categoria}</span>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="text-[#94A3B8] text-sm">{prodotto.sottocategoria}</span>
                </div>
                <div className="accent-bar w-16 mb-6" />
                <h1 className="text-4xl sm:text-5xl font-medium text-white mb-4 leading-tight" data-testid="product-title">
                  {titleParts.main}
                  {titleParts.unit ? <> <span className="whitespace-nowrap">{titleParts.unit}</span></> : null}
                </h1>
                <p className="text-[#CBD5E1] text-lg leading-relaxed">{descrizioneHero}</p>

                <div className="flex flex-wrap gap-3 mt-6">
                  {prodotto.applicazione && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB]/15 border border-[#2563EB]/30 text-[#3B82F6] text-xs font-medium">
                      <Tag size={14} /> Applicazione: {prodotto.applicazione}
                    </span>
                  )}
                  {prodotto.certificazione && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EAB308]/10 border border-[#EAB308]/30 text-[#EAB308] text-xs font-medium">
                      <Certificate size={14} /> {prodotto.certificazione}
                    </span>
                  )}
                  {prodotto.garanzia && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                      <Shield size={14} /> Garanzia {prodotto.garanzia}
                    </span>
                  )}
                </div>

                {Array.isArray(caratteristicheToShow) && caratteristicheToShow.length > 0 && (
                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {caratteristicheToShow.slice(0, 4).map((item) => (
                      <div key={item} className="rounded-lg border border-white/10 bg-[#111827] p-3 text-sm text-[#CBD5E1]">
                        {item}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/preventivo" className="btn-primary group" data-testid="product-cta-preventivo-hero">
                    <span>Richiedi verifica tecnica</span>
                    <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  {downloadSheetUrl ? (
                    <a
                      href={downloadSheetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary text-sm"
                      data-testid="product-cta-download-sheet"
                    >
                      Scarica scheda tecnica
                    </a>
                  ) : (
                    <Link to="/contatti" className="btn-secondary text-sm" data-testid="product-cta-sheet-contact">
                      Scheda tecnica su richiesta
                    </Link>
                  )}
                </div>
              </div>

              {productVisual?.src && (
                <figure className="rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0F172A] to-[#111827]">
                  <div className="aspect-[4/3] w-full p-4">
                    <img
                      src={productVisual.src}
                      alt={productVisual.alt || prodotto.nome}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </figure>
              )}
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="py-16 section-light border-y border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid gap-5">
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#EAB308]">Panoramica</span>
                {panoramicaBody && (
                  <p className="mt-4 text-[#475569] text-[15px] leading-relaxed whitespace-pre-line">{panoramicaBody}</p>
                )}
              </div>
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#EAB308]">Contesto d uso consigliato</span>
                <p className="mt-4 text-[#475569] text-[15px] leading-relaxed">{contextBody}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {prodotto.applicazione && (
                    <span className="inline-flex items-center rounded-lg bg-[#2563EB]/10 px-3 py-1.5 text-xs font-medium text-[#2563EB]">
                      Applicazione: {prodotto.applicazione}
                    </span>
                  )}
                  {prodotto.tipoVetro && (
                    <span className="inline-flex items-center rounded-lg bg-[#0F172A]/5 px-3 py-1.5 text-xs font-medium text-[#334155]">
                      Test principale: {prodotto.tipoVetro}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Caratteristiche */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <h2 className="text-xl sm:text-2xl font-medium text-white mb-3">Punti chiave della soluzione</h2>
            <p className="text-[#94A3B8] text-[15px] mb-7">Una lettura rapida per capire benefici, contesto d uso e risultato atteso sul vetro.</p>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
              {caratteristicheToShow.map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 p-4 card-glass rounded-xl"
                  data-testid={`caratteristica-${i}`}
                >
                  <CheckCircle size={20} weight="fill" className="text-[#EAB308] flex-shrink-0 mt-0.5" />
                  <span className="text-white text-sm">{c}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Dati Tecnici */}
        {hasSpecs && (
          <section className="py-16 section-light" data-testid="dati-tecnici-section">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <h2 className="text-xl sm:text-2xl font-medium text-[#0A0F1C] mb-2">Prestazioni tecniche</h2>
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
                {dt.luceVisibile?.trasmessa && <SpecCard light icon={Eye} label="VLT" value={dt.luceVisibile.trasmessa} />}
                {dt.infrarossiRespinti && <SpecCard light icon={Sun} label="IR Respinti" value={dt.infrarossiRespinti} />}
                {dt.uvTrasmessi && <SpecCard light icon={Certificate} label="UV Trasmessi" value={dt.uvTrasmessi} />}
                {dt.energiaRespinta && <SpecCard light icon={Shield} label="Energia Respinta" value={dt.energiaRespinta} />}
              </div>

              {/* Energia Solare */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 mb-5">
                <h3 className="text-sm font-medium text-[#EAB308] uppercase tracking-wider mb-5">Bilancio energia solare</h3>
                <div className="space-y-3">
                  <EnergyBar light label="Trasmessa" value={dt.energiaSolare.trasmessa} color={UNIFIED_DATA_COLOR} />
                  <EnergyBar light label="Riflessa" value={dt.energiaSolare.riflessa} color={UNIFIED_DATA_COLOR} />
                  <EnergyBar light label="Assorbita" value={dt.energiaSolare.assorbita} color={UNIFIED_DATA_COLOR} />
                </div>
              </div>

              {/* Luce Visibile */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 mb-5">
                <h3 className="text-sm font-medium text-[#EAB308] uppercase tracking-wider mb-5">Comportamento luce visibile</h3>
                <div className="space-y-3">
                  {dt.luceVisibile.trasmessa && <EnergyBar light label="Trasmessa" value={dt.luceVisibile.trasmessa} color={UNIFIED_DATA_COLOR} />}
                  {dt.luceVisibile.riflessaEsterno && <EnergyBar light label="Riflessa - Esterno" value={dt.luceVisibile.riflessaEsterno} color={UNIFIED_DATA_COLOR} />}
                  {dt.luceVisibile.riflessaInterno && <EnergyBar light label="Riflessa - Interno" value={dt.luceVisibile.riflessaInterno} color={UNIFIED_DATA_COLOR} />}
                  {dt.luceVisibile.riduzioneAbbaglio && <EnergyBar light label="Riduzione Abbaglio" value={dt.luceVisibile.riduzioneAbbaglio} color={UNIFIED_DATA_COLOR} />}
                </div>
              </div>

              {(dt.coefficienteSchermatura || dt.fattoreSolareG) && (
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 mb-5">
                  <h3 className="text-sm font-medium text-[#EAB308] uppercase tracking-wider mb-5">Indicatori aggiuntivi</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {dt.coefficienteSchermatura && (
                      <div className="rounded-lg border border-[#E2E8F0] p-4">
                        <p className="text-xs text-[#64748B] uppercase tracking-wider">Coefficiente schermatura</p>
                        <p className="text-2xl font-semibold text-[#0A0F1C] mt-1">{dt.coefficienteSchermatura}</p>
                      </div>
                    )}
                    {dt.fattoreSolareG && (
                      <div className="rounded-lg border border-[#E2E8F0] p-4">
                        <p className="text-xs text-[#64748B] uppercase tracking-wider">Fattore solare g</p>
                        <p className="text-2xl font-semibold text-[#0A0F1C] mt-1">{dt.fattoreSolareG}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {prodotto.proprietaFisiche && (
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 mb-5">
                  <h3 className="text-sm font-medium text-[#EAB308] uppercase tracking-wider mb-5">Proprieta fisiche</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {prodotto.proprietaFisiche.spessore && (
                      <div className="rounded-lg border border-[#E2E8F0] p-4"><p className="text-xs text-[#64748B]">Spessore</p><p className="text-lg font-semibold text-[#0A0F1C]">{prodotto.proprietaFisiche.spessore}</p></div>
                    )}
                    {prodotto.proprietaFisiche.resistenzaTrazione && (
                      <div className="rounded-lg border border-[#E2E8F0] p-4"><p className="text-xs text-[#64748B]">Res. Trazione</p><p className="text-lg font-semibold text-[#0A0F1C]">{prodotto.proprietaFisiche.resistenzaTrazione}</p></div>
                    )}
                    {prodotto.proprietaFisiche.resistenzaRottura && (
                      <div className="rounded-lg border border-[#E2E8F0] p-4"><p className="text-xs text-[#64748B]">Res. Rottura</p><p className="text-lg font-semibold text-[#0A0F1C]">{prodotto.proprietaFisiche.resistenzaRottura}</p></div>
                    )}
                    {prodotto.proprietaFisiche.forzaAdesiva && (
                      <div className="rounded-lg border border-[#E2E8F0] p-4"><p className="text-xs text-[#64748B]">Forza adesiva</p><p className="text-lg font-semibold text-[#0A0F1C]">{prodotto.proprietaFisiche.forzaAdesiva}</p></div>
                    )}
                    {prodotto.proprietaFisiche.tipoAdesivo && (
                      <div className="rounded-lg border border-[#E2E8F0] p-4"><p className="text-xs text-[#64748B]">Tipo adesivo</p><p className="text-lg font-semibold text-[#0A0F1C]">{prodotto.proprietaFisiche.tipoAdesivo}</p></div>
                    )}
                    {prodotto.proprietaFisiche.struttura && (
                      <div className="rounded-lg border border-[#E2E8F0] p-4"><p className="text-xs text-[#64748B]">Struttura</p><p className="text-lg font-semibold text-[#0A0F1C]">{prodotto.proprietaFisiche.struttura}</p></div>
                    )}
                  </div>
                </div>
              )}

              {/* Totale Energia Respinta highlight */}
              {dt.energiaRespinta && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  className="rounded-xl p-6 text-center border border-[#2563EB]/20"
                  style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.10) 0%, rgba(37,99,235,0.03) 100%)' }}
                >
                  <p className="text-sm text-[#64748B] uppercase tracking-wider mb-1">Totale energia respinta</p>
                  <p className="text-4xl font-bold text-[#2563EB]">{dt.energiaRespinta}</p>
                </motion.div>
              )}
            </div>
          </section>
        )}

        <ProductFaqSection items={faqItems} />

        {/* Closing CTA */}
        <section className="py-14 section-light border-t border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 md:p-8">
              <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#EAB308]">Prossimo passo</span>
                  <h2 className="mt-2 text-2xl font-semibold text-[#020617]">Passiamo dal dato tecnico al caso reale</h2>
                  <p className="mt-3 text-[#1E293B]">
                    Inviaci il tipo di vetro, l esposizione e l obiettivo principale: ricevi una proposta coerente con prestazioni, posa e priorita del progetto.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 lg:justify-end">
                  <Link to="/preventivo" className="btn-primary group !text-white" data-testid="cta-preventivo">
                    <span className="!text-white">Richiedi preventivo</span>
                    <ArrowRight size={18} weight="bold" className="!text-white group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/contatti" className="btn-secondary text-[#0A0F1C] border-[#0A0F1C]/20 hover:border-[#EAB308]" data-testid="cta-contatti">
                    Contattaci
                  </Link>
                  {prodotto.focusTecnicoSlug && (
                    <Link
                      to={`/focus-tecnico/${prodotto.focusTecnicoSlug}`}
                      className="btn-secondary text-[#0A0F1C] border-[#0A0F1C]/20 hover:border-[#EAB308]"
                      data-testid="link-focus-tecnico"
                    >
                      Vai al focus tecnico
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

// Index Page - Catalogo Prodotti
export const ProdottiIndexPagina = () => {
  const { data: allProdotti } = useWPData('prodotti');
  const categorie = ['Antisolari', 'Sicurezza', 'Privacy'];

  const getCategoriaDesc = (cat) => {
    const descs = {
      'Antisolari': 'Pellicole antisolari per il controllo della radiazione solare, risparmio energetico e protezione UV.',
      'Sicurezza': 'Pellicole di sicurezza certificate per protezione anti-sfondamento, anti-esplosione e conformita normativa.',
      'Privacy': 'Pellicole privacy e decorative per personalizzare e proteggere le superfici vetrate.',
    };
    return descs[cat] || '';
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="prodotti-index">
      <SEO title="Catalogo Prodotti — Pellicole per Vetri MADICO" description="Catalogo completo pellicole per vetri MADICO: antisolari, sicurezza, anti-esplosione SafetyShield, privacy e decorative. Schede tecniche dettagliate." path="/prodotti" />
      <Header />
      <main className="pt-24">
        <section className="py-16 lg:py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="accent-bar w-16 mb-6" />
            <h1 className="text-4xl sm:text-5xl font-medium text-white mb-6">
              Catalogo <span className="text-gradient-gold">Prodotti</span>
            </h1>
            <p className="text-lg text-[#94A3B8] max-w-2xl">Tutte le pellicole per vetri MADICO distribuite in esclusiva da Solaris Films. Schede tecniche dettagliate per ogni prodotto.</p>
          </div>
        </section>

        {categorie.map((cat, catIndex) => {
          const prodotti = allProdotti.filter(p => p.categoria === cat);
          const sottocategorie = [...new Set(prodotti.map(p => p.sottocategoria))];
          const isLight = catIndex % 2 === 0;

          return (
            <section key={cat} className={`py-16 ${isLight ? 'section-light' : ''}`} data-testid={`categoria-${cat.toLowerCase()}`}>
              <div className="max-w-7xl mx-auto px-6 md:px-12">
                <h2 className={`text-3xl font-medium mb-2 ${isLight ? 'text-[#0A0F1C]' : 'text-white'}`}>
                  Pellicole {cat}
                </h2>
                <p className={`text-base mb-10 ${isLight ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>
                  {getCategoriaDesc(cat)}
                </p>

                {sottocategorie.map((sub) => (
                  <div key={sub} className="mb-10">
                    <h3 className={`text-lg font-medium mb-4 ${isLight ? 'text-[#334155]' : 'text-[#EAB308]'}`}>{sub}</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {prodotti.filter(p => p.sottocategoria === sub).map((p, i) => (
                        <motion.div key={p.slug} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                          <Link
                            to={`/prodotti/${p.slug}`}
                            className={`block h-full rounded-xl p-5 group transition-all ${isLight ? 'card-light' : 'card-glass'}`}
                            data-testid={`prodotto-link-${p.slug}`}
                          >
                            <h4 className={`font-medium mb-2 transition-colors ${isLight ? 'text-[#0A0F1C] group-hover:text-[#2563EB]' : 'text-white group-hover:text-[#EAB308]'}`}>
                              {p.nome}
                            </h4>
                            <p className={`text-sm line-clamp-2 mb-3 ${isLight ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>
                              {p.descrizione}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {p.applicazione && (
                                <span className={`text-xs px-2 py-0.5 rounded ${isLight ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'bg-[#2563EB]/15 text-[#3B82F6]'}`}>
                                  {p.applicazione}
                                </span>
                              )}
                              {p.datiTecnici?.energiaRespinta && (
                                <span className={`text-xs px-2 py-0.5 rounded ${isLight ? 'bg-[#EAB308]/10 text-[#92400E]' : 'bg-[#EAB308]/15 text-[#EAB308]'}`}>
                                  Energia respinta: {p.datiTecnici.energiaRespinta}
                                </span>
                              )}
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
            <h2 className="text-2xl font-medium text-white mb-4">Non sai quale pellicola scegliere?</h2>
            <p className="text-[#94A3B8] mb-8">I nostri tecnici specializzati ti aiuteranno a trovare la soluzione perfetta per le tue esigenze.</p>
            <Link to="/preventivo" className="btn-yellow group" data-testid="cta-preventivo-catalogo">
              <span>Richiedi un Preventivo Gratuito</span>
              <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default ProdottoPagina;
