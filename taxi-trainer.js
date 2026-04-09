const APP_STATE_KEY = 'taxiTrainerState';
const USER_KEY = 'taxiUser';
const TOPIC_META = {
    airport: {
        label: 'Flygplats',
        icon: '✈️',
        scene: 'Hämtning, terminaler, bagage och lugna ankomster.',
        focus: 'Bekräfta identitet, hjälpa med bagage och skapa trygg start på resan.',
        coachTip: 'Börja alltid med namn, destination och praktisk hjälp innan du går vidare.',
        vocabulary: [
            { en: 'arrival hall', sv: 'ankomsthallen' },
            { en: 'suitcase', sv: 'resväska' },
            { en: 'trolley', sv: 'bagagevagn' },
            { en: 'flight delay', sv: 'flygförsening' }
        ]
    },
    tourism: {
        label: 'Turism & service',
        icon: '🏨',
        scene: 'Hotell, sevärdheter och lokal vägledning.',
        focus: 'Ge tydlig service, praktiska tips och trygg information om betalning.',
        coachTip: 'Turister uppskattar korta konkreta tips om plats, pris och nästa steg.',
        vocabulary: [
            { en: 'city centre', sv: 'centrum' },
            { en: 'check-in', sv: 'incheckning' },
            { en: 'receipt', sv: 'kvitto' },
            { en: 'walking distance', sv: 'gångavstånd' }
        ]
    },
    family: {
        label: 'Familj',
        icon: '👨‍👩‍👧',
        scene: 'Barnfamiljer, barnstol och lugn struktur.',
        focus: 'Skapa trygghet med enkla frågor om säkerhet och tid.',
        coachTip: 'När barn är med ska du tala lugnt, kontrollera säkerheten och hålla instruktionerna enkla.',
        vocabulary: [
            { en: 'child seat', sv: 'barnstol' },
            { en: 'stroller', sv: 'barnvagn' },
            { en: 'seat belt', sv: 'säkerhetsbälte' },
            { en: 'nursery', sv: 'förskola' }
        ]
    },
    accessibility: {
        label: 'Tillgänglighet',
        icon: '♿',
        scene: 'Rullstol, stöd och värdig service.',
        focus: 'Beskriv varje steg och ge tid till passageraren.',
        coachTip: 'Fråga före du rör utrustning och tala om vad du gör i varje steg.',
        vocabulary: [
            { en: 'wheelchair', sv: 'rullstol' },
            { en: 'ramp', sv: 'ramp' },
            { en: 'foldable', sv: 'vikbar' },
            { en: 'assistance', sv: 'assistans' }
        ]
    },
    hospital: {
        label: 'Sjukhus',
        icon: '🏥',
        scene: 'Brådskande resor, vård och lugn kommunikation.',
        focus: 'Samla rätt information utan att skapa mer stress.',
        coachTip: 'Bekräfta adress, tillstånd och om anhöriga eller personal behöver kontaktas.',
        vocabulary: [
            { en: 'high fever', sv: 'hög feber' },
            { en: 'emergency room', sv: 'akutmottagning' },
            { en: 'breathing', sv: 'andning' },
            { en: 'medication', sv: 'medicin' }
        ]
    },
    police: {
        label: 'Polis',
        icon: '👮',
        scene: 'Rapporter, borttappade saker och tydliga fakta.',
        focus: 'Beskriva plats, tid och observationer exakt.',
        coachTip: 'När polis är inblandad hjälper det att hålla sig till fakta utan gissningar.',
        vocabulary: [
            { en: 'incident report', sv: 'incidentrapport' },
            { en: 'statement', sv: 'utsaga' },
            { en: 'identification', sv: 'identifikation' },
            { en: 'pickup point', sv: 'upphämtningsplats' }
        ]
    },
    weather: {
        label: 'Väder & trafik',
        icon: '🌨️',
        scene: 'Halka, köer och säkra omvägar.',
        focus: 'Förklara förseningar tydligt utan att tappa kontroll.',
        coachTip: 'Säg vad som har förändrats, vilken väg du rekommenderar och när ni troligen anländer.',
        vocabulary: [
            { en: 'black ice', sv: 'svartis' },
            { en: 'detour', sv: 'omväg' },
            { en: 'road closure', sv: 'vägavstängning' },
            { en: 'estimated arrival', sv: 'beräknad ankomst' }
        ]
    },
    nightlife: {
        label: 'Nattkörning',
        icon: '🌃',
        scene: 'Trötta eller påverkade resenärer och tydliga gränser.',
        focus: 'Vara vänlig men bestämd kring säkerhet och betalning.',
        coachTip: 'Kort, tydlig och lugn kommunikation fungerar bäst sent på natten.',
        vocabulary: [
            { en: 'intoxicated', sv: 'berusad' },
            { en: 'front seat', sv: 'framsäte' },
            { en: 'cleaning fee', sv: 'saneringsavgift' },
            { en: 'confirm the route', sv: 'bekräfta rutten' }
        ]
    },
    emergency: {
        label: 'Akut',
        icon: '🚑',
        scene: '112-samtal, andning och snabb koordinering.',
        focus: 'Ge korta korrekta uppgifter under stark press.',
        coachTip: 'Vid akuta lägen kommer plats, symtom och medvetandegrad först.',
        vocabulary: [
            { en: 'chest pain', sv: 'bröstsmärta' },
            { en: 'unconscious', sv: 'medvetslös' },
            { en: 'ambulance', sv: 'ambulans' },
            { en: 'first aid', sv: 'första hjälpen' }
        ]
    },
    security: {
        label: 'Säkerhet',
        icon: '🛡️',
        scene: 'Misstänkta föremål, terminaler och riskbedömning.',
        focus: 'Rapportera exakt och hålla avstånd.',
        coachTip: 'Säkerhetsdialoger ska vara korta, faktabaserade och lugna.',
        vocabulary: [
            { en: 'suspicious bag', sv: 'misstänkt väska' },
            { en: 'evacuation', sv: 'evakuering' },
            { en: 'security cordon', sv: 'säkerhetsavspärrning' },
            { en: 'terminal staff', sv: 'terminalpersonal' }
        ]
    },
    conflict: {
        label: 'Konflikthantering',
        icon: '⚠️',
        scene: 'Höga känslor, trygghet och professionella gränser.',
        focus: 'Skydda passagerare och dig själv utan att eskalera läget.',
        coachTip: 'Erbjud säkra val och håll rösten neutral även när situationen är känslig.',
        vocabulary: [
            { en: 'safe location', sv: 'säker plats' },
            { en: 'stay calm', sv: 'behåll lugnet' },
            { en: 'threat', sv: 'hot' },
            { en: 'public entrance', sv: 'offentlig entré' }
        ]
    },
    business: {
        label: 'Affärsresa',
        icon: '💼',
        scene: 'VIP-gäster, fakturor och diskret service.',
        focus: 'Leverera effektiv och konfidentiell service.',
        coachTip: 'Affärsresenärer uppskattar diskretion, punktlighet och korta uppdateringar.',
        vocabulary: [
            { en: 'invoice', sv: 'faktura' },
            { en: 'confidential', sv: 'konfidentiell' },
            { en: 'meeting venue', sv: 'mötesplats' },
            { en: 'priority lane', sv: 'prioriterad fil' }
        ]
    },
    accident: {
        label: 'Olycka',
        icon: '🚧',
        scene: 'Kollisioner, försäkring och dokumentation.',
        focus: 'Förklara händelsen sakligt och ta rätt nästa steg.',
        coachTip: 'Efter en olycka bör du tänka i ordningen: säkerhet, skador, dokumentation, kontakt.',
        vocabulary: [
            { en: 'collision', sv: 'kollision' },
            { en: 'insurance claim', sv: 'försäkringsärende' },
            { en: 'witness', sv: 'vittne' },
            { en: 'damage report', sv: 'skaderapport' }
        ]
    },
    general: {
        label: 'Allmänt',
        icon: '📚',
        scene: 'Bred serviceengelska för taxiyrket.',
        focus: 'Träna tydlighet, vänlighet och professionell struktur.',
        coachTip: 'Utgå från att kunden vill känna sig trygg, förstådd och väl omhändertagen.',
        vocabulary: [
            { en: 'destination', sv: 'destination' },
            { en: 'fare', sv: 'pris' },
            { en: 'traffic', sv: 'trafik' },
            { en: 'schedule', sv: 'schema' }
        ]
    }
};
const DEFAULT_LIBRARY = [
    {
        title: '✈️ Terminal pickup and baggage support',
        level: 'beginner',
        topic: 'airport',
        icon: '✈️',
        scene: 'Arlanda pickup with luggage and first contact.',
        focus: 'Greeting, confirming identity and helping with heavy bags.',
        coachTip: 'Use short welcoming sentences and offer help before the passenger has to ask twice.',
        english: `Driver: Good evening. Are you Ms. Rahimi from Copenhagen?
Passenger: Yes, thank you for waiting for me.
Driver: Welcome to Stockholm. Did you have a comfortable flight?
Passenger: It was fine, but I am very tired now.
Driver: No problem. I can take your two suitcases to the trunk.
Passenger: That would be great. One bag is quite heavy.
Driver: I have it. Please follow me to the taxi just outside the terminal exit.
Passenger: Thank you. I also need to stop by the hotel reception first.`,
        swedish: `Förare: God kväll. Är ni fru Rahimi från Köpenhamn?
Passagerare: Ja, tack för att du väntade på mig.
Förare: Välkommen till Stockholm. Hade du en bekväm flygresa?
Passagerare: Den var okej, men jag är väldigt trött nu.
Förare: Inga problem. Jag kan ta dina två resväskor till bagageutrymmet.
Passagerare: Det vore jättebra. En väska är ganska tung.
Förare: Jag tar den. Följ gärna med mig till taxin precis utanför terminalutgången.
Passagerare: Tack. Jag behöver också stanna vid hotellets reception först.`
    },
    {
        title: '🏨 Hotel check-in and city guidance',
        level: 'beginner',
        topic: 'tourism',
        icon: '🏨',
        scene: 'Helping a tourist reach the hotel and understand the area.',
        focus: 'Simple service language, directions and reassurance about payment.',
        coachTip: 'Tourists appreciate short practical tips more than long stories.',
        english: `Passenger: Is this the correct taxi for Hotel Riverside?
Driver: Yes, absolutely. It is about fifteen minutes from here.
Passenger: Perfect. Can I pay by card when we arrive?
Driver: Yes, card works well, and I can print or send a receipt.
Passenger: Great. Is the old town far from the hotel?
Driver: No, it is within walking distance if the weather is good.
Passenger: That sounds nice. I would like a quiet area tonight.
Driver: Then this hotel is a good choice. It is central but still calm.`,
        swedish: `Passagerare: Är detta rätt taxi till Hotel Riverside?
Förare: Ja, absolut. Det är ungefär femton minuter härifrån.
Passagerare: Perfekt. Kan jag betala med kort när vi kommer fram?
Förare: Ja, kort fungerar bra, och jag kan skriva ut eller skicka ett kvitto.
Passagerare: Bra. Är Gamla stan långt från hotellet?
Förare: Nej, det ligger på gångavstånd om vädret är bra.
Passagerare: Det låter trevligt. Jag vill gärna ha ett lugnt område i kväll.
Förare: Då är detta hotell ett bra val. Det är centralt men ändå lugnt.`
    },
    {
        title: '👨‍👩‍👧 Family ride with child seat',
        level: 'beginner',
        topic: 'family',
        icon: '👨‍👩‍👧',
        scene: 'Family transport with bags, stroller and child safety.',
        focus: 'Asking clear safety questions and giving calm help.',
        coachTip: 'When parents are stressed, clear step-by-step language lowers tension quickly.',
        english: `Parent: Good morning. Do you have a child seat for my daughter?
Driver: Yes, I do. How old is she?
Parent: She is four, and we are going to the nursery first.
Driver: Great. I will secure the child seat before you get in.
Parent: Thank you. I also have a stroller in the back.
Driver: That is fine. I can fold it and place it carefully in the trunk.
Parent: I appreciate that. We are running a little late today.
Driver: I understand. I will drive smoothly and take the fastest safe route.`,
        swedish: `Förälder: God morgon. Har du en barnstol till min dotter?
Förare: Ja, det har jag. Hur gammal är hon?
Förälder: Hon är fyra år och vi ska först till förskolan.
Förare: Bra. Jag sätter fast barnstolen innan ni sätter er.
Förälder: Tack. Jag har också en barnvagn där bak.
Förare: Det går bra. Jag kan fälla ihop den och lägga den försiktigt i bagageutrymmet.
Förälder: Det uppskattar jag. Vi är lite sena idag.
Förare: Jag förstår. Jag kör lugnt och tar den snabbaste säkra vägen.`
    },
    {
        title: '♿ Wheelchair support with dignity',
        level: 'beginner',
        topic: 'accessibility',
        icon: '♿',
        scene: 'Assisting a passenger with a wheelchair and careful boarding.',
        focus: 'Explaining your actions and letting the passenger feel in control.',
        coachTip: 'Respectful service means asking before touching equipment and explaining every step.',
        english: `Passenger: Hello. I use a wheelchair. Is your car accessible?
Driver: Yes, I can help you safely. Would you like me to unfold the ramp?
Passenger: Yes, please. I can stand for a few seconds if needed.
Driver: Thank you for telling me. I will move slowly and explain each step.
Passenger: That helps a lot. My chair is foldable after I sit down.
Driver: Perfect. Once you are seated, I will place the chair in the back and secure it.
Passenger: Please tell me when the door is fully open.
Driver: Of course. The door is open now, and the support handle is on your left.`,
        swedish: `Passagerare: Hej. Jag använder rullstol. Är din bil tillgänglig?
Förare: Ja, jag kan hjälpa dig säkert. Vill du att jag fäller ut rampen?
Passagerare: Ja tack. Jag kan stå några sekunder om det behövs.
Förare: Tack för att du berättar det. Jag rör mig långsamt och förklarar varje steg.
Passagerare: Det hjälper mycket. Min stol är vikbar när jag har satt mig.
Förare: Perfekt. När du sitter ned lägger jag stolen där bak och säkrar den.
Passagerare: Säg gärna till när dörren är helt öppen.
Förare: Självklart. Dörren är öppen nu och stödhantaget finns till vänster om dig.`
    },
    {
        title: '🏥 Urgent ride to the children’s hospital',
        level: 'intermediate',
        topic: 'hospital',
        icon: '🏥',
        scene: 'Child with fever on the way to hospital care.',
        focus: 'Balancing urgency with calm questions and safe driving.',
        coachTip: 'Urgent situations need a calm voice, clear location check and one question at a time.',
        english: `Passenger: Please hurry. My son has a high fever and he is getting weaker.
Driver: I understand. Which hospital do you need?
Passenger: Astrid Lindgren Children’s Hospital in Solna.
Driver: We can get there quickly. Is he breathing normally right now?
Passenger: Yes, but he is very sleepy and not responding much.
Driver: Thank you. Please keep talking to him while I drive.
Passenger: Should I call the hospital before we arrive?
Driver: Yes, if you can, tell them his age, temperature and that you are five to ten minutes away.`,
        swedish: `Passagerare: Skynda dig, tack. Min son har hög feber och blir allt svagare.
Förare: Jag förstår. Vilket sjukhus behöver du?
Passagerare: Astrid Lindgrens barnsjukhus i Solna.
Förare: Vi kan komma dit snabbt. Andas han normalt just nu?
Passagerare: Ja, men han är väldigt sömnig och svarar knappt.
Förare: Tack. Fortsätt gärna prata med honom medan jag kör.
Passagerare: Bör jag ringa sjukhuset innan vi kommer fram?
Förare: Ja, om du kan, säg hans ålder, temperatur och att ni är fem till tio minuter bort.`
    },
    {
        title: '👮 Lost property and police report',
        level: 'intermediate',
        topic: 'police',
        icon: '👮',
        scene: 'A passenger left a passport wallet in the taxi.',
        focus: 'Reporting facts clearly with time, place and what you observed.',
        coachTip: 'A useful report always answers what, where, when and whose item it may be.',
        english: `Driver: Hello, I need advice about a lost item in my taxi.
Police: Tell me what you found.
Driver: A small passport wallet on the back seat after a ride from Central Station.
Police: Do you know who the passenger was?
Driver: I only know that she was a woman going to a hotel near Stureplan around 18:30.
Police: Did she pay by card or cash?
Driver: By card. I also have the pickup time and the car camera outside the station.
Police: Good. Please keep the item safe and file an incident report with those details.`,
        swedish: `Förare: Hej, jag behöver råd om ett borttappat föremål i min taxi.
Polis: Berätta vad du hittade.
Förare: En liten passplånbok på baksätet efter en resa från Centralstationen.
Polis: Vet du vem passageraren var?
Förare: Jag vet bara att hon var en kvinna som åkte till ett hotell nära Stureplan omkring 18:30.
Polis: Betalade hon med kort eller kontanter?
Förare: Med kort. Jag har också upphämtningstiden och bilkameran utanför stationen.
Polis: Bra. Förvara föremålet säkert och lämna en incidentrapport med de uppgifterna.`
    },
    {
        title: '🌨️ Winter delay and route explanation',
        level: 'intermediate',
        topic: 'weather',
        icon: '🌨️',
        scene: 'Heavy snow, slower traffic and a passenger with a deadline.',
        focus: 'Explaining delays honestly while keeping the passenger informed.',
        coachTip: 'In bad weather, say what has changed, what option you suggest and what arrival time you expect.',
        english: `Passenger: I am worried I will miss my meeting. Why are we moving so slowly?
Driver: There is black ice on the bridge and two lanes are closed ahead.
Passenger: Can we take another road instead?
Driver: Yes, I recommend a detour through the inner city even if it is longer on the map.
Passenger: Will that save time?
Driver: I believe so, because the main road is almost at a standstill.
Passenger: Please take the safer option and let me know the new arrival time.
Driver: Of course. My updated estimate is 09:05, and I will tell you if conditions change again.`,
        swedish: `Passagerare: Jag är orolig att jag missar mitt möte. Varför rör vi oss så långsamt?
Förare: Det är svartis på bron och två filer är avstängda längre fram.
Passagerare: Kan vi ta en annan väg i stället?
Förare: Ja, jag rekommenderar en omväg genom innerstan även om den är längre på kartan.
Passagerare: Sparar det tid?
Förare: Jag tror det, eftersom huvudvägen nästan står stilla.
Passagerare: Ta gärna det säkrare alternativet och säg till om den nya ankomsttiden.
Förare: Självklart. Min uppdaterade bedömning är 09:05, och jag säger till om läget ändras igen.`
    },
    {
        title: '🌃 Late-night ride with clear boundaries',
        level: 'intermediate',
        topic: 'nightlife',
        icon: '🌃',
        scene: 'A late passenger is confused about payment and seating.',
        focus: 'Maintaining professionalism and control during a messy situation.',
        coachTip: 'Friendly firmness is stronger than arguing with an intoxicated passenger.',
        english: `Passenger: Hey, can my friend sit in the front even if I am in the back?
Driver: I need everyone to sit where there is a seat belt and where I can drive safely.
Passenger: Fine, fine. How much do you think this ride will cost?
Driver: I can give you an estimate before we start and confirm the route on the map.
Passenger: OK, but I do not want any surprise fees.
Driver: I understand. The normal fare depends on time and traffic, and extra fees only apply for things like cleaning damage.
Passenger: That sounds fair. Let’s go to Södermalm first and then maybe another stop.
Driver: No problem. I will confirm each stop before I continue.`,
        swedish: `Passagerare: Hallå, kan min vän sitta fram även om jag sitter bak?
Förare: Alla behöver sitta där det finns säkerhetsbälte och där jag kan köra säkert.
Passagerare: Okej, okej. Hur mycket tror du att den här resan kommer att kosta?
Förare: Jag kan ge dig en uppskattning innan vi startar och bekräfta rutten på kartan.
Passagerare: Bra, men jag vill inte ha några överraskningsavgifter.
Förare: Jag förstår. Det vanliga priset beror på tid och trafik, och extra avgifter gäller bara sådant som saneringsskador.
Passagerare: Det låter rimligt. Åk till Södermalm först och kanske ett stopp till.
Förare: Inga problem. Jag bekräftar varje stopp innan jag fortsätter.`
    },
    {
        title: '🚑 112 call for chest pain in the taxi',
        level: 'advanced',
        topic: 'emergency',
        icon: '🚑',
        scene: 'A passenger develops severe chest pain during the ride.',
        focus: 'Giving rapid, structured information to emergency services.',
        coachTip: 'Under pressure, use short factual updates: symptom, age, breathing, address.',
        english: `Driver: Emergency services, I need an ambulance for a passenger with severe chest pain.
Operator: Is the passenger conscious and breathing?
Driver: Yes, but he is sweating heavily and says the pain is spreading to his left arm.
Operator: What is your exact location?
Driver: I am outside number 14 on Sveavägen, just before the intersection with Odengatan.
Operator: Keep the passenger seated and loosen tight clothing.
Driver: Understood. He is becoming dizzy. Should I stop the car completely?
Operator: Yes. Stop in a safe place immediately and stay on the line with me.`,
        swedish: `Förare: Larmcentralen, jag behöver en ambulans till en passagerare med svår bröstsmärta.
Operatör: Är passageraren vid medvetande och andas?
Förare: Ja, men han svettas kraftigt och säger att smärtan strålar ut i vänster arm.
Operatör: Vad är din exakta position?
Förare: Jag står utanför nummer 14 på Sveavägen, precis före korsningen med Odengatan.
Operatör: Låt passageraren sitta still och lossa åtsittande kläder.
Förare: Uppfattat. Han blir yr. Ska jag stanna bilen helt?
Operatör: Ja. Stanna på en säker plats omedelbart och stanna kvar i samtalet med mig.`
    },
    {
        title: '🛡️ Suspicious bag at the terminal',
        level: 'advanced',
        topic: 'security',
        icon: '🛡️',
        scene: 'An unattended bag near airport operations.',
        focus: 'Describing risk details without touching or speculating too much.',
        coachTip: 'Security calls should be precise, calm and free from guesswork.',
        english: `Driver: Security desk, I need to report an unattended bag outside Terminal 5.
Guard: What makes it suspicious?
Driver: It has been there for at least twenty minutes, and no one has returned for it.
Guard: Is it near a busy entrance?
Driver: Yes, it is beside the taxi pickup lane and close to the sliding doors.
Guard: Have you touched it or moved it?
Driver: No. I kept my distance and asked nearby drivers to stay clear.
Guard: Good. Stay back and point our staff to the exact location when they arrive.`,
        swedish: `Förare: Säkerhetscentralen, jag behöver rapportera en obevakad väska utanför Terminal 5.
Vakt: Vad gör den misstänkt?
Förare: Den har stått där i minst tjugo minuter och ingen har kommit tillbaka efter den.
Vakt: Är den nära en vältrafikerad entré?
Förare: Ja, den står bredvid taxihämtningsfilen och nära skjutdörrarna.
Vakt: Har du rört den eller flyttat den?
Förare: Nej. Jag höll avstånd och bad andra förare att hålla sig undan.
Vakt: Bra. Stå kvar på avstånd och visa vår personal exakt plats när de kommer fram.`
    },
    {
        title: '⚠️ Domestic conflict and safe drop-off',
        level: 'advanced',
        topic: 'conflict',
        icon: '⚠️',
        scene: 'A distressed passenger needs a safe public location.',
        focus: 'Supporting safety without escalating the conflict.',
        coachTip: 'Offer safe choices and avoid taking sides in emotional situations.',
        english: `Passenger: Please do not stop at my home address. I need to go somewhere public first.
Driver: I understand. Would you feel safer at a hotel entrance, a hospital or a police station?
Passenger: A hotel lobby would be best. I do not want the other person to find me immediately.
Driver: All right. I will take you to a well-lit entrance with staff present.
Passenger: Thank you. If someone calls my phone, I may panic.
Driver: You do not need to answer right now. Focus on staying calm and telling me if you want help contacting someone.
Passenger: Could you wait until I am inside?
Driver: Yes, I can wait outside until you are safely in the lobby.`,
        swedish: `Passagerare: Stanna inte vid min hemadress. Jag måste först till en offentlig plats.
Förare: Jag förstår. Känner du dig tryggast vid en hotellentré, ett sjukhus eller en polisstation?
Passagerare: En hotellobby är bäst. Jag vill inte att den andra personen hittar mig direkt.
Förare: Okej. Jag kör dig till en väl upplyst entré där personal finns på plats.
Passagerare: Tack. Om någon ringer min telefon kan jag få panik.
Förare: Du behöver inte svara just nu. Fokusera på att hålla dig lugn och säg till om du vill ha hjälp att kontakta någon.
Passagerare: Kan du vänta tills jag är inne?
Förare: Ja, jag kan vänta utanför tills du är tryggt inne i lobbyn.`
    },
    {
        title: '💼 Executive transfer with invoice and discretion',
        level: 'advanced',
        topic: 'business',
        icon: '💼',
        scene: 'Corporate passenger with strict timing and confidentiality.',
        focus: 'Delivering efficient premium service without unnecessary conversation.',
        coachTip: 'Premium service means anticipating needs without becoming intrusive.',
        english: `Passenger: I need to reach the conference venue by 08:25, and I may have to take a work call on the way.
Driver: Understood. I will keep the cabin quiet and use the fastest legal route.
Passenger: Thank you. Can your company send an invoice to our office instead of charging my card?
Driver: Yes, if you share the billing details, I can note them for our dispatch team.
Passenger: Good. Please also avoid discussing the company name near the entrance.
Driver: Of course. I understand that the meeting is confidential.
Passenger: Excellent. If traffic gets worse, let me know immediately.
Driver: I will update you in real time and suggest alternatives if needed.`,
        swedish: `Passagerare: Jag måste nå konferensanläggningen senast 08:25, och jag kan behöva ta ett jobbsamtal på vägen.
Förare: Uppfattat. Jag håller kupén tyst och använder den snabbaste lagliga rutten.
Passagerare: Tack. Kan ert företag skicka en faktura till vårt kontor i stället för att debitera mitt kort?
Förare: Ja, om du delar fakturauppgifterna kan jag notera dem till vår dispatch.
Passagerare: Bra. Undvik också att nämna företagsnamnet nära entrén.
Förare: Självklart. Jag förstår att mötet är konfidentiellt.
Passagerare: Utmärkt. Om trafiken blir värre, säg till direkt.
Förare: Jag uppdaterar dig i realtid och föreslår alternativ om det behövs.`
    },
    {
        title: '🚧 Collision report and insurance follow-up',
        level: 'advanced',
        topic: 'accident',
        icon: '🚧',
        scene: 'Minor collision with documentation after passenger safety is checked.',
        focus: 'Explaining the incident clearly for insurance and company reporting.',
        coachTip: 'A calm accident description should separate facts, damage and next administrative steps.',
        english: `Dispatcher: Can you explain what happened at the roundabout?
Driver: Another car entered from the right and clipped my rear door at low speed.
Dispatcher: Was anyone injured?
Driver: No injuries, but my passenger was shaken, so I first checked that she felt safe.
Dispatcher: Good. Did you exchange details with the other driver?
Driver: Yes, I took photos, licence plate information and the insurance number.
Dispatcher: Were there any witnesses?
Driver: One cyclist stopped and agreed to give a statement if needed, so I noted his phone number.`,
        swedish: `Dispatch: Kan du förklara vad som hände i rondellen?
Förare: En annan bil kom in från höger och skrapade min bakdörr i låg hastighet.
Dispatch: Blev någon skadad?
Förare: Nej, inga skador, men min passagerare blev skakad så jag kontrollerade först att hon kände sig trygg.
Dispatch: Bra. Bytte du uppgifter med den andra föraren?
Förare: Ja, jag tog bilder, registreringsnummer och försäkringsnummer.
Dispatch: Fanns det några vittnen?
Förare: En cyklist stannade och gick med på att lämna en utsaga vid behov, så jag noterade hans telefonnummer.`
    }
];
const EXTRA_LIBRARY = [
    {
        title: '🛄 Lost luggage support at the airport',
        level: 'beginner',
        topic: 'airport',
        icon: '🛄',
        scene: 'A passenger cannot find a suitcase after arrival.',
        focus: 'Show empathy, ask clear follow-up questions and guide the next step.',
        coachTip: 'When a traveler is stressed, calm structure matters more than long explanations.',
        english: `Passenger: Excuse me, I cannot find my suitcase anywhere.
Driver: I am sorry to hear that. Did you already speak to the baggage service desk?
Passenger: Not yet. I was hoping the bag would appear on the belt.
Driver: I understand. The best next step is to report it before leaving the terminal.
Passenger: Will that take a long time?
Driver: Usually not. They will ask for your baggage tag and flight number.
Passenger: Thank you. Can you wait for me outside after I finish?
Driver: Yes, I can wait near the pickup zone for a short time.`,
        swedish: `Passagerare: Ursäkta, jag hittar inte min resväska någonstans.
Förare: Det var tråkigt att höra. Har du redan pratat med bagageservicen?
Passagerare: Inte ännu. Jag hoppades att väskan skulle dyka upp på bandet.
Förare: Jag förstår. Nästa steg är att anmäla det innan du lämnar terminalen.
Passagerare: Tar det lång tid?
Förare: Vanligtvis inte. De kommer att fråga efter bagagetaggen och flightnumret.
Passagerare: Tack. Kan du vänta på mig utanför när jag är klar?
Förare: Ja, jag kan vänta nära upphämtningszonen en kort stund.`
    },
    {
        title: '🍽️ Restaurant recommendation and evening service',
        level: 'beginner',
        topic: 'tourism',
        icon: '🍽️',
        scene: 'A visitor wants dinner advice after hotel drop-off.',
        focus: 'Offer useful local guidance while staying short and clear.',
        coachTip: 'Give two or three options at most so the passenger can decide easily.',
        english: `Passenger: Before we arrive, can you recommend a good place for dinner?
Driver: Of course. Do you prefer Swedish food, seafood or something international?
Passenger: Swedish food would be nice, but not too expensive.
Driver: Then I suggest a traditional restaurant near your hotel and a smaller bistro by the square.
Passenger: Which one is quieter?
Driver: The bistro is calmer, especially on weekdays.
Passenger: That sounds perfect. Can you point it out on the map when we stop?
Driver: Absolutely. I will show you the street and the entrance.`,
        swedish: `Passagerare: Innan vi kommer fram, kan du rekommendera ett bra ställe för middag?
Förare: Självklart. Föredrar du svensk mat, seafood eller något internationellt?
Passagerare: Svensk mat vore trevligt, men inte för dyrt.
Förare: Då föreslår jag en traditionell restaurang nära hotellet och en mindre bistro vid torget.
Passagerare: Vilken är lugnare?
Förare: Bistron är lugnare, särskilt på vardagar.
Passagerare: Det låter perfekt. Kan du visa den på kartan när vi stannar?
Förare: Absolut. Jag visar gatan och entrén för dig.`
    },
    {
        title: '🧓 Elderly passenger to the clinic',
        level: 'intermediate',
        topic: 'accessibility',
        icon: '🧓',
        scene: 'An older passenger needs extra time and support at drop-off.',
        focus: 'Combine respectful language, pacing and practical assistance.',
        coachTip: 'Older passengers often value predictability, so explain each step before doing it.',
        english: `Passenger: Please do not rush me when we arrive. My legs are weak today.
Driver: Of course. I will stop as close to the clinic entrance as possible.
Passenger: Thank you. I also need a moment before I stand up.
Driver: That is no problem. I can open the door first and wait beside the car.
Passenger: My walker is in the trunk. Could you take it out for me?
Driver: Yes, I will place it next to the curb so you can hold it safely.
Passenger: I appreciate your patience. Appointments make me nervous.
Driver: I understand. We will take it step by step and make sure you feel steady.`,
        swedish: `Passagerare: Skynda mig inte när vi kommer fram. Mina ben är svaga idag.
Förare: Självklart. Jag stannar så nära klinikens entré som möjligt.
Passagerare: Tack. Jag behöver också en stund innan jag reser mig.
Förare: Det går bra. Jag kan öppna dörren först och vänta bredvid bilen.
Passagerare: Min rollator ligger i bagageutrymmet. Kan du ta ut den åt mig?
Förare: Ja, jag ställer den bredvid trottoarkanten så att du kan hålla den säkert.
Passagerare: Jag uppskattar ditt tålamod. Läkarbesök gör mig nervös.
Förare: Jag förstår. Vi tar det steg för steg och ser till att du känner dig stadig.`
    },
    {
        title: '✈️ Delayed flight and urgent connection',
        level: 'intermediate',
        topic: 'airport',
        icon: '🛫',
        scene: 'A traveler lands late and worries about a train connection.',
        focus: 'Gather key timing details and explain what is realistically possible.',
        coachTip: 'Never promise impossible timing; give honest alternatives instead.',
        english: `Passenger: My flight landed very late and I may miss my train to Uppsala.
Driver: I understand. What time does the train leave from the station?
Passenger: In thirty-five minutes, if everything goes perfectly.
Driver: Then we need to move efficiently. Do you already have the train ticket?
Passenger: Yes, on my phone, but I have not eaten since morning.
Driver: First let us get you to the station. If we are too late, I can show you the next departures.
Passenger: Thank you. Please tell me honestly if the connection is no longer possible.
Driver: I will. I prefer to give you a realistic plan rather than false hope.`,
        swedish: `Passagerare: Mitt flyg landade väldigt sent och jag kan missa mitt tåg till Uppsala.
Förare: Jag förstår. Vilken tid går tåget från stationen?
Passagerare: Om trettiofem minuter, om allt går perfekt.
Förare: Då måste vi arbeta effektivt. Har du redan tågbiljetten?
Passagerare: Ja, i mobilen, men jag har inte ätit sedan i morse.
Förare: Först tar vi dig till stationen. Om vi blir för sena kan jag visa nästa avgångar.
Passagerare: Tack. Säg ärligt till om anslutningen inte längre är möjlig.
Förare: Det gör jag. Jag ger hellre en realistisk plan än falskt hopp.`
    },
    {
        title: '👮 Passenger reporting phone theft',
        level: 'intermediate',
        topic: 'police',
        icon: '📱',
        scene: 'A passenger thinks the phone was stolen outside a club.',
        focus: 'Help organize facts for a useful report without guessing.',
        coachTip: 'Ask for the last known place, time and whether any tracking app is active.',
        english: `Passenger: I think someone stole my phone outside the club.
Driver: I am sorry. Do you remember the last moment you had it in your hand?
Passenger: Yes, about ten minutes ago when I was paying for my jacket.
Driver: That is helpful. Have you tried calling it or using the tracking app?
Passenger: My friend is calling now, but no one answers.
Driver: Then it may be best to go to the police station or at least file an online report immediately.
Passenger: Can you take me somewhere quiet first so I can cancel my bank cards?
Driver: Yes, that is a smart first step. We can stop at a hotel lobby or a late café.`,
        swedish: `Passagerare: Jag tror att någon stal min telefon utanför klubben.
Förare: Det var tråkigt. Minns du sista gången du hade den i handen?
Passagerare: Ja, för ungefär tio minuter sedan när jag betalade för min jacka.
Förare: Det hjälper. Har du försökt ringa den eller använda spårningsappen?
Passagerare: Min vän ringer nu, men ingen svarar.
Förare: Då är det bäst att åka till polisstationen eller åtminstone göra en anmälan direkt online.
Passagerare: Kan du köra mig till ett lugnt ställe först så jag kan spärra mina bankkort?
Förare: Ja, det är ett klokt första steg. Vi kan stanna vid en hotellobby eller ett nattöppet café.`
    },
    {
        title: '🚑 Suspected stroke during transport',
        level: 'advanced',
        topic: 'hospital',
        icon: '🧠',
        scene: 'A passenger shows stroke symptoms while speaking unclearly.',
        focus: 'Recognize warning signs and communicate urgently but precisely.',
        coachTip: 'With stroke symptoms, time matters. Speak clearly and act fast without panic.',
        english: `Passenger: I do not feel right. My arm feels strange and my words sound wrong.
Driver: Stay with me. Can you smile for me and lift both arms?
Passenger: I can lift one, but not the other very well.
Driver: I am calling emergency services now because these may be stroke symptoms.
Operator: What are you observing?
Driver: Sudden slurred speech, weakness on one side and confusion. We are on Norr Mälarstrand by the park entrance.
Operator: Good. Keep the passenger seated safely and note the time the symptoms started.
Driver: Understood. I will stay with the passenger and keep the airway clear.`,
        swedish: `Passagerare: Jag känner mig inte bra. Min arm känns konstig och orden låter fel.
Förare: Var kvar hos mig. Kan du le och lyfta båda armarna?
Passagerare: Jag kan lyfta den ena, men inte den andra så bra.
Förare: Jag ringer larmcentralen nu eftersom det kan vara strokesymtom.
Operatör: Vad observerar du?
Förare: Plötsligt sluddrigt tal, svaghet på ena sidan och förvirring. Vi är på Norr Mälarstrand vid parkentrén.
Operatör: Bra. Låt passageraren sitta säkert och notera tiden när symtomen började.
Förare: Uppfattat. Jag stannar hos passageraren och håller luftvägen fri.`
    },
    {
        title: '🧍 Suspicious person following a passenger',
        level: 'advanced',
        topic: 'security',
        icon: '🧍',
        scene: 'A hotel guest believes someone is following them after pickup.',
        focus: 'Protect the passenger while staying observant and factual.',
        coachTip: 'Avoid confrontation if possible; prioritize visibility, witnesses and safe destinations.',
        english: `Passenger: I think the man behind us has been following me since the station.
Driver: Thank you for telling me. I will not stop in an isolated place.
Passenger: Please do not drive directly to my apartment.
Driver: Understood. I suggest a hotel entrance with cameras and staff nearby.
Passenger: Yes, that would feel safer. Should I call someone now?
Driver: If you trust someone, yes. You can also message them our location and the car number.
Passenger: The other car just turned again. This is making me very uneasy.
Driver: I see it. I will keep driving toward a bright public area and contact security if needed.`,
        swedish: `Passagerare: Jag tror att mannen bakom oss har följt efter mig sedan stationen.
Förare: Tack för att du säger till. Jag kommer inte att stanna på en avskild plats.
Passagerare: Kör inte direkt till min lägenhet.
Förare: Uppfattat. Jag föreslår en hotellentré med kameror och personal i närheten.
Passagerare: Ja, det skulle kännas säkrare. Ska jag ringa någon nu?
Förare: Om du litar på någon, ja. Du kan också skicka vår plats och bilnumret.
Passagerare: Den andra bilen svängde igen. Det här gör mig väldigt orolig.
Förare: Jag ser det. Jag fortsätter mot en ljus offentlig plats och kontaktar säkerhet vid behov.`
    },
    {
        title: '💼 Investor visit with strict schedule changes',
        level: 'advanced',
        topic: 'business',
        icon: '📈',
        scene: 'A business guest changes the route between meetings and needs precision.',
        focus: 'Handle changing priorities without losing professionalism.',
        coachTip: 'Repeat the updated plan aloud so the passenger hears that you understood it correctly.',
        english: `Passenger: We need to change plans. First go to the legal office, then to the investor lunch, and finally back to the hotel.
Driver: Certainly. I will repeat the order to make sure I have it right.
Passenger: Please do. The schedule is moving fast today.
Driver: First the legal office, then the lunch meeting, and after that the hotel unless you update me again.
Passenger: Correct. Also, I may need five minutes of privacy for a confidential call before we arrive.
Driver: No problem. I will lower the music, avoid interruptions and tell you when we are five minutes away.
Passenger: Excellent. If we lose time in traffic, tell me which stop is easiest to shorten.
Driver: I will monitor that and suggest the most efficient adjustment.`,
        swedish: `Passagerare: Vi måste ändra planen. Kör först till juristkontoret, sedan till investerarlunchen och därefter tillbaka till hotellet.
Förare: Självklart. Jag upprepar ordningen så att jag har förstått rätt.
Passagerare: Gör gärna det. Schemat rör sig snabbt idag.
Förare: Först juristkontoret, sedan lunchmötet och därefter hotellet om du inte uppdaterar mig igen.
Passagerare: Korrekt. Jag kan också behöva fem minuters lugn för ett konfidentiellt samtal innan vi kommer fram.
Förare: Inga problem. Jag sänker musiken, undviker avbrott och säger till när vi är fem minuter bort.
Passagerare: Utmärkt. Om vi tappar tid i trafiken, säg vilket stopp som är lättast att korta ner.
Förare: Det följer jag och föreslår den mest effektiva justeringen.`
    },
    {
        title: '🚧 Multi-car incident and passenger reassurance',
        level: 'advanced',
        topic: 'accident',
        icon: '🚒',
        scene: 'Traffic stops because of a serious incident ahead.',
        focus: 'Inform passengers, choose a safe response and stay factual.',
        coachTip: 'When people are frightened, a calm factual update lowers stress quickly.',
        english: `Passenger: Why have we stopped completely? Is there a crash ahead?
Driver: Yes, it appears to be a multi-car incident with emergency vehicles on the scene.
Passenger: That sounds serious. Are we in any danger where we are?
Driver: At the moment, no. We are stationary at a safe distance and I am monitoring instructions from traffic control.
Passenger: Will we be trapped here for a long time?
Driver: It is possible, so I am already checking a secondary route if the police open the side road.
Passenger: Thank you for telling me clearly. I need to update my family.
Driver: Of course. I will let you know immediately if we move or if the route changes.`,
        swedish: `Passagerare: Varför har vi stannat helt? Är det en krasch längre fram?
Förare: Ja, det verkar vara en olycka med flera bilar och räddningsfordon på plats.
Passagerare: Det låter allvarligt. Är vi i fara där vi står?
Förare: Just nu nej. Vi står still på säkert avstånd och jag följer instruktioner från trafikinformationen.
Passagerare: Blir vi fast här länge?
Förare: Det är möjligt, så jag kontrollerar redan en alternativ väg om polisen öppnar sidovägen.
Passagerare: Tack för att du berättar tydligt. Jag behöver uppdatera min familj.
Förare: Självklart. Jag säger till direkt om vi börjar röra oss eller om rutten ändras.`
    },
    {
        title: '🏥 Night discharge from the emergency room',
        level: 'intermediate',
        topic: 'hospital',
        icon: '🌙',
        scene: 'A patient leaves the emergency room late at night and needs calm support.',
        focus: 'Use gentle practical questions after a stressful medical visit.',
        coachTip: 'After a hospital visit, the passenger may be tired or emotional, so use slower pacing.',
        english: `Passenger: I have just been discharged and I am still a little dizzy.
Driver: I understand. Please take your time getting into the car.
Passenger: Thank you. I also need to stop at a pharmacy that is still open.
Driver: That is fine. Do you know the address, or would you like me to find the nearest open one?
Passenger: Please find the nearest one. My doctor changed my medication tonight.
Driver: Of course. After the pharmacy, do you want to go straight home?
Passenger: Yes, and if possible, please stop close to the entrance.
Driver: I will do that and help make the last part of the trip as easy as possible.`,
        swedish: `Passagerare: Jag har just skrivits ut och är fortfarande lite yr.
Förare: Jag förstår. Ta den tid du behöver när du sätter dig i bilen.
Passagerare: Tack. Jag behöver också stanna vid ett apotek som fortfarande har öppet.
Förare: Det går bra. Kan du adressen, eller vill du att jag hittar det närmaste öppna?
Passagerare: Hitta gärna det närmaste. Min läkare ändrade min medicin ikväll.
Förare: Självklart. Efter apoteket, vill du åka direkt hem?
Passagerare: Ja, och stanna gärna nära entrén om det går.
Förare: Det gör jag och hjälper till att göra sista delen av resan så enkel som möjligt.`
    },
    {
        title: '🌃 Group pickup after concert closing time',
        level: 'intermediate',
        topic: 'nightlife',
        icon: '🎵',
        scene: 'A noisy group needs structure after a large event.',
        focus: 'Set order, confirm destination and keep the vehicle calm.',
        coachTip: 'With groups, repeat the destination and rules before the car starts moving.',
        english: `Passenger: We are all going to the same address, but one friend wants food first.
Driver: Before we start, let us confirm the main destination and whether there will be one extra stop.
Passenger: The main address is correct, and maybe a short stop for takeaway if it is open.
Driver: All right. Everyone needs a seat belt, and I need the loudest conversations to stay a bit lower.
Passenger: Fair enough. We are just excited after the concert.
Driver: I understand. I want the ride to stay fun but also safe and clear.
Passenger: That is reasonable. We will calm down.
Driver: Great. Once everyone is seated properly, we can get going.`,
        swedish: `Passagerare: Vi ska alla till samma adress, men en vän vill hämta mat först.
Förare: Innan vi startar, låt oss bekräfta huvudadressen och om det blir ett extra stopp.
Passagerare: Huvudadressen stämmer, och kanske ett kort stopp för takeaway om det är öppet.
Förare: Okej. Alla behöver säkerhetsbälte, och jag behöver att de högsta samtalen blir lite lugnare.
Passagerare: Rimligt. Vi är bara uppspelta efter konserten.
Förare: Jag förstår. Jag vill att resan ska vara rolig men också säker och tydlig.
Passagerare: Det är rimligt. Vi lugnar ner oss.
Förare: Bra. När alla sitter ordentligt kan vi åka.`
    }
];
const SPEAKER_TRANSLATIONS = {
    Driver: { english: 'Driver', swedish: 'Förare' },
    Passenger: { english: 'Passenger', swedish: 'Passagerare' },
    Parent: { english: 'Parent', swedish: 'Förälder' },
    Police: { english: 'Police', swedish: 'Polis' },
    Operator: { english: 'Operator', swedish: 'Operatör' },
    Guard: { english: 'Guard', swedish: 'Vakt' },
    Dispatcher: { english: 'Dispatcher', swedish: 'Dispatch' },
    Dispatch: { english: 'Dispatch', swedish: 'Dispatch' }
};
const STOP_WORDS = new Set(['driver', 'passenger', 'parent', 'police', 'operator', 'guard', 'dispatcher', 'dispatch', 'the', 'and', 'that', 'this', 'with', 'from', 'your', 'have', 'will', 'what', 'where', 'when', 'please', 'there', 'their', 'they', 'them', 'about', 'into', 'very', 'also', 'than', 'then', 'would', 'could', 'should', 'need', 'good', 'fine', 'well', 'here', 'after', 'before', 'while', 'förare', 'passagerare', 'förälder', 'polisen', 'och', 'det', 'att', 'som']);

let lessons = [];
let user = null;
let currentLesson = null;
let currentLessonIndex = 0;
let speechSpeed = 1;
let currentFilter = 'all';
let currentTopic = 'all';
let currentSearch = '';
let editingLessonId = null;
let voices = [];
let generatedQuestions = [];
let smartDraftMeta = null;
let currentAssessment = null;
let selectedParagraphIndex = 0;
let activeParagraphIndex = -1;
let currentHomeLessonsTab = 'library';
let currentLessonViewTab = 'reading';
let currentResultsTab = 'summary';
let currentAssessmentTab = 'exams';
const CHALLENGE_PRESETS = [
    {
        id: 'airport_sprint',
        title: '✈️ Airport Sprint',
        description: 'Snabb blandad utmaning om flygplats, hotell och första servicekontakten.',
        levels: ['beginner', 'intermediate'],
        topics: ['airport', 'tourism'],
        count: 8
    },
    {
        id: 'care_and_safety',
        title: '🚑 Care & Safety Cup',
        description: 'Fokuserar på sjukhus, akut, polis och säkerhetsfrågor under press.',
        levels: ['intermediate', 'advanced'],
        topics: ['hospital', 'emergency', 'police', 'security'],
        count: 10
    },
    {
        id: 'night_shift',
        title: '🌃 Night Shift Challenge',
        description: 'Tränar nattkörning, konflikthantering, trygghet och tydliga gränser.',
        levels: ['intermediate', 'advanced'],
        topics: ['nightlife', 'conflict', 'security'],
        count: 8
    },
    {
        id: 'vip_route',
        title: '💼 VIP Route Masters',
        description: 'Blandar affärsresor, planändringar, diskretion och professionell service.',
        levels: ['intermediate', 'advanced'],
        topics: ['business', 'tourism', 'airport'],
        count: 9
    }
];
const BADGE_DEFINITIONS = [
    {
        id: 'first_lesson',
        icon: '🎓',
        title: 'Första steget',
        description: 'Slutför din första lektion.',
        isUnlocked: stats => stats.completedLessons >= 1
    },
    {
        id: 'listener',
        icon: '🎧',
        title: 'Lyssnaren',
        description: 'Genomför minst 10 träningsrundor.',
        isUnlocked: stats => stats.totalAttempts >= 10
    },
    {
        id: 'exam_ready',
        icon: '📝',
        title: 'Provklar',
        description: 'Genomför ditt första nivåprov.',
        isUnlocked: stats => stats.examCount >= 1
    },
    {
        id: 'challenger',
        icon: '🏆',
        title: 'Utmanaren',
        description: 'Slutför minst 3 utmaningar.',
        isUnlocked: stats => stats.challengeCount >= 3
    },
    {
        id: 'topic_master',
        icon: '🧭',
        title: 'Temasamlaren',
        description: 'Träna minst 6 olika ämnen.',
        isUnlocked: stats => stats.trainedTopics >= 6
    },
    {
        id: 'consistent_pro',
        icon: '⭐',
        title: 'Stabil prestation',
        description: 'Nå 75% eller mer i minst 3 prov eller utmaningar.',
        isUnlocked: stats => stats.strongScores >= 3
    }
];

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function shuffleArray(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function splitLines(text) {
    return String(text || '').split('\n').map(line => line.trim()).filter(Boolean);
}

function getTopicMeta(topic) {
    return TOPIC_META[topic] || TOPIC_META.general;
}

function titleFromTopic(topic) {
    return getTopicMeta(topic).label;
}

function levelLabel(level) {
    if (level === 'beginner') return '⭐ Börjare';
    if (level === 'intermediate') return '⭐⭐ Medel';
    return '⭐⭐⭐ Avancerad';
}

function setReadingMessage(message, hint) {
    const indicator = document.getElementById('readingIndicator');
    const readingHint = document.getElementById('readingHint');
    if (indicator) indicator.textContent = message;
    if (readingHint) readingHint.textContent = hint;
}

function updateReadingControlInfo() {
    const info = document.getElementById('readingControlInfo');
    if (!info || !currentLesson) return;
    const totalLines = splitLines(currentLesson.english).length;
    const selectedNumber = Math.min(selectedParagraphIndex + 1, totalLines || 1);
    if (activeParagraphIndex > -1) info.textContent = `Rad ${activeParagraphIndex + 1} spelas nu`;
    else info.textContent = `Rad ${selectedNumber} vald för snabb repetition`;
}

function updateParagraphStates() {
    document.querySelectorAll('.paragraph-item').forEach((item, index) => {
        item.classList.toggle('selected', index === selectedParagraphIndex);
        item.classList.toggle('active', index === activeParagraphIndex);
        item.classList.toggle('completed', activeParagraphIndex > -1 && index < activeParagraphIndex);
    });
    updateReadingControlInfo();
}

function selectParagraph(index, options = {}) {
    if (!currentLesson) return;
    const totalLines = splitLines(currentLesson.english).length;
    if (!totalLines) return;
    selectedParagraphIndex = Math.min(Math.max(index, 0), totalLines - 1);
    if (!options.keepActive) activeParagraphIndex = -1;
    updateParagraphStates();
    if (!options.silent) {
        setReadingMessage(`🎯 Rad ${selectedParagraphIndex + 1} är markerad`, 'Du kan nu upprepa den markerade raden eller fortsätta läsa.');
    }
}

function createPerformanceShape() {
    return {
        totalCorrect: 0,
        totalIncorrect: 0,
        topics: {},
        levels: {},
        questionTypes: {}
    };
}

function ensureUserShape(candidate) {
    if (!candidate) return null;
    const performance = candidate.performance || {};
    return {
        name: candidate.name || 'Taxi Student',
        email: candidate.email || '',
        phone: candidate.phone || '',
        level: candidate.level || 'beginner',
        completed: Array.isArray(candidate.completed) ? candidate.completed : [],
        examHistory: Array.isArray(candidate.examHistory) ? candidate.examHistory : [],
        challengeHistory: Array.isArray(candidate.challengeHistory) ? candidate.challengeHistory : [],
        reviewHistory: Array.isArray(candidate.reviewHistory) ? candidate.reviewHistory : [],
        badges: Array.isArray(candidate.badges) ? candidate.badges : [],
        points: Number(candidate.points) || 0,
        performance: {
            totalCorrect: performance.totalCorrect || 0,
            totalIncorrect: performance.totalIncorrect || 0,
            topics: performance.topics || {},
            levels: performance.levels || {},
            questionTypes: performance.questionTypes || {}
        },
        startedAt: candidate.startedAt || new Date().toISOString()
    };
}

function getUserStats() {
    const completedLessons = user?.completed?.length || 0;
    const examCount = user?.examHistory?.length || 0;
    const challengeCount = user?.challengeHistory?.length || 0;
    const reviewCount = user?.reviewHistory?.length || 0;
    const totalAttempts = lessons.reduce((sum, lesson) => sum + (lesson.attempts?.length || 0), 0);
    const trainedTopics = new Set(lessons.filter(lesson => user?.completed?.includes(lesson.id)).map(lesson => lesson.topic)).size;
    const strongScores = [...(user?.examHistory || []), ...(user?.challengeHistory || [])].filter(item => item.percent >= 75).length;
    return {
        completedLessons,
        examCount,
        challengeCount,
        reviewCount,
        totalAttempts,
        trainedTopics,
        strongScores,
        points: user?.points || 0
    };
}

function awardPoints(amount, reason) {
    if (!user || !amount) return;
    user.points = (user.points || 0) + amount;
    unlockEligibleBadges();
    if (reason) showToast(`+${amount} poäng · ${reason}`, 'success');
}

function unlockEligibleBadges() {
    if (!user) return;
    const stats = getUserStats();
    let unlockedAny = false;
    BADGE_DEFINITIONS.forEach(badge => {
        if (badge.isUnlocked(stats) && !user.badges.includes(badge.id)) {
            user.badges.push(badge.id);
            unlockedAny = true;
            showToast(`🏅 Nytt märke: ${badge.title}`, 'success');
        }
    });
    return unlockedAny;
}

function getBadgeState() {
    const stats = getUserStats();
    return BADGE_DEFINITIONS.map(badge => ({
        ...badge,
        unlocked: user?.badges?.includes(badge.id) || badge.isUnlocked(stats)
    }));
}

function ensurePerformanceBucket(collection, key) {
    if (!collection[key]) {
        collection[key] = { correct: 0, incorrect: 0 };
    }
    return collection[key];
}

function trackPerformanceEvent(lesson, question, isCorrect, source = 'lesson') {
    if (!user || !lesson || !question) return;
    if (!user.performance) user.performance = createPerformanceShape();
    const performance = user.performance;
    if (isCorrect) performance.totalCorrect += 1;
    else performance.totalIncorrect += 1;
    const topicBucket = ensurePerformanceBucket(performance.topics, lesson.topic || 'general');
    const levelBucket = ensurePerformanceBucket(performance.levels, lesson.level || 'beginner');
    const typeKey = `${source}:${question.type || 'mcq'}`;
    const typeBucket = ensurePerformanceBucket(performance.questionTypes, typeKey);
    [topicBucket, levelBucket, typeBucket].forEach(bucket => {
        if (isCorrect) bucket.correct += 1;
        else bucket.incorrect += 1;
    });
}

function buildWeaknessEntries() {
    if (!user?.performance) return [];
    const entries = [];
    const pushEntries = (collection, kind, labelResolver) => {
        Object.entries(collection || {}).forEach(([key, stats]) => {
            const attempts = (stats.correct || 0) + (stats.incorrect || 0);
            if (!attempts) return;
            const weaknessScore = ((stats.incorrect || 0) / attempts) * attempts;
            entries.push({
                kind,
                key,
                label: labelResolver(key),
                attempts,
                percent: Math.round(((stats.incorrect || 0) / attempts) * 100),
                weaknessScore
            });
        });
    };
    pushEntries(user.performance.topics, 'topic', key => `${getTopicMeta(key).icon} ${titleFromTopic(key)}`);
    pushEntries(user.performance.levels, 'level', key => levelLabel(key));
    pushEntries(user.performance.questionTypes, 'questionType', key => {
        const [, type] = key.split(':');
        return type === 'fill' ? 'Fyll i / detaljförståelse' : 'Flerval / situationsval';
    });
    return entries.sort((a, b) => b.weaknessScore - a.weaknessScore).slice(0, 6);
}

function focusActionForWeakness(item) {
    if (item.kind === 'topic') return `openWeaknessFocus('${item.kind}','${item.key}')`;
    if (item.kind === 'level') return `openWeaknessFocus('${item.kind}','${item.key}')`;
    return `openWeaknessFocus('questionType','${item.key}')`;
}

function openWeaknessFocus(kind, key) {
    if (kind === 'topic') {
        currentTopic = key;
        currentFilter = 'all';
        showSection('home');
        document.getElementById('topicFilterSelect').value = key;
        renderTopicOverview();
        updateLessonsGrid();
        showToast(`Fokus flyttat till ${titleFromTopic(key)}.`, 'success');
        return;
    }
    if (kind === 'level') {
        currentTopic = 'all';
        showSection('home');
        filterLessons(key);
        showToast(`Fokus flyttat till ${levelLabel(key)}.`, 'success');
        return;
    }
    if (key.endsWith('fill')) {
        startVocabularyTraining();
        return;
    }
    startListeningTraining();
}

function getCoachRecommendations() {
    const weaknesses = buildWeaknessEntries();
    if (!weaknesses.length) {
        return [
            {
                title: 'Stabil grund',
                description: 'Du har ännu inte samlat tillräckligt med feldata. Fortsätt träna så bygger coachen din profil.',
                score: '—',
                actionLabel: 'Öppna lektion',
                actionKey: 'openRecommendedLesson'
            }
        ];
    }
    return weaknesses.slice(0, 3).map(item => ({
        title: item.label,
        description: `Felandel ${item.percent}% över ${item.attempts} försök. Programmet rekommenderar riktad återträning här.`,
        score: `${item.percent}%`,
        actionLabel: 'Fokusera här',
        actionKey: 'openWeaknessFocus',
        actionPayload: `${item.kind}::${item.key}`
    }));
}

function getCurriculumStages() {
    const completedByLevel = level => lessons.filter(lesson => lesson.level === level && user?.completed?.includes(lesson.id)).length;
    const latestExamPercent = level => (user?.examHistory || []).filter(item => item.level === level).slice(-1)[0]?.percent || 0;
    return [
        {
            stage: 'Bas 1',
            title: 'Service och trygg start',
            description: 'Arbeta med hälsning, bagage, hotell, betalning och enkel vägledning.',
            progress: `${completedByLevel('beginner')} lektioner klara · prov ${latestExamPercent('beginner')}%`,
            actionLabel: 'Börjarnivå',
            actionKey: 'filterLessons',
            actionPayload: 'beginner'
        },
        {
            stage: 'Bas 2',
            title: 'Situationskontroll',
            description: 'Gå vidare till sjukhus, polis, väder, tillgänglighet och professionella följdfrågor.',
            progress: `${completedByLevel('intermediate')} lektioner klara · prov ${latestExamPercent('intermediate')}%`,
            actionLabel: 'Medelnivå',
            actionKey: 'filterLessons',
            actionPayload: 'intermediate'
        },
        {
            stage: 'Bas 3',
            title: 'Press, säkerhet och beslutsförmåga',
            description: 'Träna akuta lägen, säkerhetsdialoger, konflikthantering och affärsdiskretion.',
            progress: `${completedByLevel('advanced')} lektioner klara · prov ${latestExamPercent('advanced')}%`,
            actionLabel: 'Avancerad',
            actionKey: 'filterLessons',
            actionPayload: 'advanced'
        }
    ];
}

function translateSpeakerLabel(label, language) {
    const entry = SPEAKER_TRANSLATIONS[label.trim()];
    if (!entry) return label.trim();
    return language === 'swedish' ? entry.swedish : entry.english;
}

function normalizeLessonText(text, language) {
    const normalized = String(text || '').replace(/\r/g, '').trim();
    if (!normalized) return '';
    const rawLines = normalized.includes('\n') ? normalized.split('\n') : (normalized.match(/[^.!?]+[.!?]?/g) || [normalized]);
    const cycle = language === 'swedish' ? ['Förare', 'Passagerare', 'Förare', 'Passagerare'] : ['Driver', 'Passenger', 'Driver', 'Passenger'];
    return rawLines.map((rawLine, index) => {
        const cleaned = rawLine.replace(/^\s*[-•]\s*/, '').trim();
        if (!cleaned) return '';
        const match = cleaned.match(/^([^:]{2,25})\s*:\s*(.+)$/);
        if (match) {
            return `${translateSpeakerLabel(match[1], language)}: ${match[2].trim()}`;
        }
        return `${cycle[index % cycle.length]}: ${cleaned}`;
    }).filter(Boolean).join('\n');
}

function inferTopic(text) {
    const source = String(text || '').toLowerCase();
    const rules = {
        airport: ['airport', 'terminal', 'flight', 'luggage', 'arlanda', 'bag', 'suitcase'],
        tourism: ['hotel', 'tourist', 'old town', 'city centre', 'receipt', 'check-in'],
        family: ['child', 'daughter', 'son', 'nursery', 'stroller', 'parent'],
        accessibility: ['wheelchair', 'ramp', 'accessible', 'assist', 'foldable'],
        hospital: ['hospital', 'fever', 'pain', 'doctor', 'nurse', 'medicine'],
        police: ['police', 'report', 'passport', 'wallet', 'statement', 'incident'],
        weather: ['snow', 'ice', 'detour', 'bridge', 'road closure', 'traffic'],
        nightlife: ['night', 'drunk', 'intoxicated', 'front seat', 'surprise fees'],
        emergency: ['ambulance', '112', 'chest pain', 'unconscious', 'breathing'],
        security: ['suspicious', 'terminal 5', 'evacuation', 'security'],
        conflict: ['safe location', 'panic', 'threat', 'public first'],
        business: ['invoice', 'confidential', 'meeting', 'conference', 'office'],
        accident: ['collision', 'insurance', 'witness', 'damage', 'roundabout']
    };
    let best = 'general';
    let bestScore = 0;
    Object.entries(rules).forEach(([topic, keywords]) => {
        const score = keywords.reduce((sum, keyword) => sum + (source.includes(keyword) ? 1 : 0), 0);
        if (score > bestScore) {
            bestScore = score;
            best = topic;
        }
    });
    return best;
}

function inferLevel(text) {
    const lower = String(text || '').toLowerCase();
    const words = lower.split(/\s+/).filter(Boolean).length;
    if (['ambulance', 'confidential', 'insurance', 'evacuation', 'unconscious', 'threat'].some(item => lower.includes(item)) || words > 140) return 'advanced';
    if (['hospital', 'report', 'detour', 'invoice', 'fever', 'traffic'].some(item => lower.includes(item)) || words > 80) return 'intermediate';
    return 'beginner';
}

function inferTitle(topic, english) {
    const firstLine = splitLines(english)[0] || '';
    const core = firstLine.replace(/^.*?:\s*/, '').replace(/[.!?]$/, '').slice(0, 36).trim();
    return `${getTopicMeta(topic).icon} ${titleFromTopic(topic)}${core ? ' – ' + core : ''}`;
}

function normalizeVocabulary(vocabulary, topic) {
    if (Array.isArray(vocabulary) && vocabulary.length) {
        return vocabulary.map(item => typeof item === 'string' ? { en: item, sv: '' } : { en: item.en || '', sv: item.sv || '' }).filter(item => item.en).slice(0, 6);
    }
    return clone(getTopicMeta(topic).vocabulary || []);
}

function getSpeakerFromLine(line) {
    const match = String(line || '').match(/^([^:]+):/);
    return match ? match[1].trim() : '';
}

function getSpokenText(line) {
    return String(line || '').replace(/^([^:]+):\s*/, '').trim();
}

function getContentWords(line) {
    return (getSpokenText(line).toLowerCase().match(/[a-zåäö]+/gi) || []).filter(word => word.length > 3 && !STOP_WORDS.has(word));
}

function buildMcqQuestion(text, correctValue, pool, explanation) {
    const options = Array.from(new Set([correctValue, ...(pool || [])].filter(Boolean)));
    while (options.length < 4) options.push(`Alternativ ${options.length + 1}`);
    const shuffled = shuffleArray(options).slice(0, 4);
    if (!shuffled.includes(correctValue)) shuffled[0] = correctValue;
    return { type: 'mcq', text, options: shuffled, correct: shuffled.indexOf(correctValue), explanation: explanation || '' };
}

function createFillQuestion(line) {
    const words = getContentWords(line).sort((a, b) => b.length - a.length);
    const missing = words.find(word => word.length > 4);
    if (!missing) return null;
    const full = getSpokenText(line);
    const prompt = full.replace(new RegExp(`\\b${missing}\\b`, 'i'), '_______');
    return { type: 'fill', text: `Complete the sentence: "${prompt}"`, correct: missing.toLowerCase(), explanation: `Full sentence: "${full}"` };
}

function createTranslationQuestion(line, swedishLine, allSwedishLines) {
    if (!line || !swedishLine) return null;
    return buildMcqQuestion(`Choose the best Swedish translation for: "${getSpokenText(line)}"`, swedishLine, shuffleArray(allSwedishLines.filter(item => item && item !== swedishLine)).slice(0, 3), `Correct translation: "${swedishLine}"`);
}

function createSpeakerQuestion(lines) {
    const candidate = lines.find(line => getSpeakerFromLine(line));
    if (!candidate) return null;
    const speaker = getSpeakerFromLine(candidate);
    const speakers = Array.from(new Set(lines.map(getSpeakerFromLine).filter(Boolean)));
    return buildMcqQuestion(`Who says this line? "${getSpokenText(candidate)}"`, speaker, shuffleArray(['Driver', 'Passenger', 'Parent', 'Police', 'Operator', ...speakers]).filter(item => item !== speaker).slice(0, 3), `The speaker label is "${speaker}".`);
}

function createResponseQuestion(lines) {
    for (let i = 0; i < lines.length - 1; i++) {
        if (getSpeakerFromLine(lines[i]) && getSpeakerFromLine(lines[i + 1]) && getSpeakerFromLine(lines[i]) !== getSpeakerFromLine(lines[i + 1])) {
            const correct = getSpokenText(lines[i + 1]);
            const decoys = shuffleArray(lines.map(getSpokenText).filter(text => text && text !== correct)).slice(0, 3);
            return buildMcqQuestion(`A professional reply to "${getSpokenText(lines[i])}" is:`, correct, decoys, 'The best reply answers the concern directly and politely.');
        }
    }
    return null;
}

function createFocusQuestion(lesson) {
    return buildMcqQuestion('What is the main communication focus in this lesson?', lesson.focus, shuffleArray(DEFAULT_LIBRARY.map(item => item.focus).filter(item => item !== lesson.focus)).slice(0, 3), `Main focus: ${lesson.focus}`);
}

function createTopicQuestion(lesson) {
    return buildMcqQuestion('What type of taxi situation is this lesson mainly about?', titleFromTopic(lesson.topic), shuffleArray(Object.keys(TOPIC_META).filter(key => key !== lesson.topic && key !== 'general').map(key => TOPIC_META[key].label)).slice(0, 3), `Topic: ${titleFromTopic(lesson.topic)}`);
}

function createVocabularyQuestion(lesson) {
    const item = normalizeVocabulary(lesson.vocabulary, lesson.topic)[0];
    if (!item?.sv) return null;
    const decoys = shuffleArray(Object.values(TOPIC_META).flatMap(meta => meta.vocabulary || []).map(vocab => vocab.sv).filter(value => value && value !== item.sv)).slice(0, 3);
    return buildMcqQuestion(`What is the Swedish meaning of "${item.en}"?`, item.sv, decoys, `${item.en} = ${item.sv}`);
}

function generateQuestionsForLesson(lesson) {
    const englishLines = splitLines(lesson.english);
    const swedishLines = splitLines(lesson.swedish).map(getSpokenText);
    return [
        createFillQuestion(englishLines[0] || ''),
        createFillQuestion(englishLines[2] || englishLines[1] || ''),
        createTranslationQuestion(englishLines[1], swedishLines[1], swedishLines),
        createTranslationQuestion(englishLines[3], swedishLines[3], swedishLines),
        createSpeakerQuestion(englishLines),
        createResponseQuestion(englishLines),
        createFocusQuestion(lesson),
        createTopicQuestion(lesson),
        createVocabularyQuestion(lesson)
    ].filter(Boolean).slice(0, 8);
}

function normalizeQuestion(question) {
    if (question.type === 'fill') {
        return { type: 'fill', text: question.text || 'Complete the sentence', correct: String(question.correct || '').trim(), explanation: question.explanation || '' };
    }
    return {
        type: 'mcq',
        text: question.text || 'Choose the correct answer',
        options: Array.isArray(question.options) ? question.options.map(String) : ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correct: Number.isInteger(question.correct) ? question.correct : 0,
        explanation: question.explanation || ''
    };
}

function normalizeLessonRecord(lesson, index) {
    const topic = TOPIC_META[lesson.topic] ? lesson.topic : inferTopic(`${lesson.title || ''} ${lesson.english || ''} ${lesson.swedish || ''}`);
    const normalized = {
        id: lesson.id || index + 1,
        title: lesson.title || inferTitle(topic, lesson.english || ''),
        level: lesson.level || inferLevel(lesson.english || ''),
        topic,
        icon: lesson.icon || getTopicMeta(topic).icon,
        scene: lesson.scene || getTopicMeta(topic).scene,
        focus: lesson.focus || getTopicMeta(topic).focus,
        coachTip: lesson.coachTip || getTopicMeta(topic).coachTip,
        vocabulary: normalizeVocabulary(lesson.vocabulary, topic),
        english: normalizeLessonText(lesson.english || '', 'english'),
        swedish: normalizeLessonText(lesson.swedish || '', 'swedish'),
        attempts: Array.isArray(lesson.attempts) ? lesson.attempts : [],
        isCustom: Boolean(lesson.isCustom),
        createdAt: lesson.createdAt || new Date().toISOString()
    };
    normalized.questions = Array.isArray(lesson.questions) && lesson.questions.length ? lesson.questions.map(normalizeQuestion) : generateQuestionsForLesson(normalized);
    return normalized;
}

function buildDefaultLessons() {
    lessons = [...DEFAULT_LIBRARY, ...EXTRA_LIBRARY].map((lesson, index) => normalizeLessonRecord(lesson, index));
}

function buildCuratedLibrary() {
    return [...DEFAULT_LIBRARY, ...EXTRA_LIBRARY].map((lesson, index) => normalizeLessonRecord(lesson, index));
}

function saveAppState() {
    localStorage.setItem(APP_STATE_KEY, JSON.stringify({ lessons, user }));
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
}

function loadAppState() {
    try {
        const saved = JSON.parse(localStorage.getItem(APP_STATE_KEY) || 'null');
        if (saved?.lessons?.length) {
            const savedLessons = saved.lessons.map((lesson, index) => normalizeLessonRecord(lesson, index));
            const curatedLessons = buildCuratedLibrary();
            const savedCustomLessons = savedLessons.filter(lesson => lesson.isCustom);
            const remappedIds = new Map();
            let nextId = curatedLessons.reduce((maxId, lesson) => Math.max(maxId, Number(lesson.id) || 0), 0) + 1;
            const customLessons = savedCustomLessons.map(lesson => {
                const newId = nextId++;
                remappedIds.set(lesson.id, newId);
                return { ...lesson, id: newId };
            });
            lessons = [...curatedLessons, ...customLessons];
            user = ensureUserShape(saved.user);
            if (user?.completed?.length) {
                user.completed = user.completed
                    .map(id => remappedIds.get(id) || id)
                    .filter(id => lessons.some(lesson => lesson.id === id));
            }
        } else {
            buildDefaultLessons();
            user = ensureUserShape(JSON.parse(localStorage.getItem(USER_KEY) || 'null'));
        }
    } catch (error) {
        buildDefaultLessons();
        user = null;
    }
    if (!lessons.length) buildDefaultLessons();
    saveAppState();
}

function getRecommendedLesson() {
    const incomplete = lessons.filter(lesson => !user?.completed?.includes(lesson.id));
    return incomplete.find(lesson => lesson.level === (user?.level || 'beginner')) || incomplete[0] || lessons[0] || null;
}

function getRandomLessonByCriteria(level, topics) {
    const topicSet = topics ? new Set(Array.isArray(topics) ? topics : [topics]) : null;
    const candidates = lessons.filter(lesson => {
        const levelMatch = !level || lesson.level === level;
        const topicMatch = !topicSet || topicSet.has(lesson.topic);
        return levelMatch && topicMatch;
    });
    return shuffleArray(candidates)[0] || getRecommendedLesson();
}

function openRecommendedLesson() {
    const lesson = getRecommendedLesson();
    if (!lesson) return;
    openLesson(lesson.id);
}

function startListeningTraining() {
    const lesson = getRandomLessonByCriteria(user?.level || 'beginner');
    if (!lesson) return;
    openLesson(lesson.id);
    showToast('Lyssningsläge öppnat. Börja med "Rad för rad".', 'success');
}

function startVocabularyTraining() {
    const lesson = getRandomLessonByCriteria(user?.level || 'beginner', ['airport', 'hospital', 'business', 'police', 'tourism']);
    if (!lesson) return;
    openLesson(lesson.id);
    showToast('Ordförrådsläge öppnat. Läs chipsen med nyckelord först.', 'success');
}

function startWeaknessReview() {
    const weakness = buildWeaknessEntries()[0];
    let criteria = {};
    let title = '🔁 Smart repetition';
    let meta = ['Smart repetition', 'Fokus på dina svagheter', 'Resultat sparas'];
    if (weakness?.kind === 'topic') {
        criteria = { topics: [weakness.key] };
        title = `🔁 Repetition · ${weakness.label}`;
    } else if (weakness?.kind === 'level') {
        criteria = { levels: [weakness.key] };
        title = `🔁 Repetition · ${weakness.label}`;
    } else if (weakness?.kind === 'questionType') {
        const targetType = weakness.key.endsWith('fill') ? 'fill' : 'mcq';
        const questions = shuffleArray(buildAssessmentPool({}).filter(question => question.type === targetType)).slice(0, 8);
        if (questions.length < 4) {
            showToast('För få frågor för repetition just nu.', 'error');
            return;
        }
        currentAssessment = {
            type: 'review',
            title: `🔁 Repetition · ${targetType === 'fill' ? 'Detaljförståelse' : 'Situationsval'}`,
            questions,
            meta: [...meta, targetType === 'fill' ? 'Fyll i' : 'Flerval']
        };
        showSection('assessment');
        renderAssessment();
        return;
    }
    const questions = buildAssessmentQuestions(criteria, 8);
    if (questions.length < 4) {
        showToast('För få frågor för repetition just nu.', 'error');
        return;
    }
    currentAssessment = {
        type: 'review',
        title,
        questions,
        meta
    };
    showSection('assessment');
    renderAssessment();
}

function getStudyPlanSteps() {
    const recommended = getRecommendedLesson();
    const level = user?.level || 'beginner';
    const completed = user?.completed?.length || 0;
    return [
        {
            badge: completed > 0 ? '✅ Påbörjad' : '🚀 Start',
            title: 'Steg 1 · Dagens lektion',
            description: recommended ? `Öppna ${recommended.title} och förstå scenen innan du svarar på frågorna.` : 'Välj en lektion och starta dagens träning.',
            actionLabel: 'Öppna lektion',
            actionKey: 'openRecommendedLesson'
        },
        {
            badge: '🎧 Träna örat',
            title: 'Steg 2 · Lyssna och upprepa',
            description: 'Kör en lektion rad för rad för att vänja örat vid tydlig engelska och yrkesfraser.',
            actionLabel: 'Lyssningsläge',
            actionKey: 'startListeningTraining'
        },
        {
            badge: '🧪 Kontroll',
            title: 'Steg 3 · Gör nivåprov',
            description: `Gör ett prov på ${levelLabel(level).toLowerCase()} för att se om du är redo att gå vidare.`,
            actionLabel: 'Starta prov',
            actionKey: 'startLevelExam',
            actionPayload: level
        },
        {
            badge: '🏆 Utmaning',
            title: 'Steg 4 · Gå in i arenan',
            description: 'Avsluta passet med en utmaning som blandar flera ämnen och pressade situationer.',
            actionLabel: 'Öppna arena',
            actionKey: 'showSection',
            actionPayload: 'challenge'
        }
    ];
}

function executeUiAction(actionKey, actionPayload = '') {
    if (actionKey === 'openRecommendedLesson') return openRecommendedLesson();
    if (actionKey === 'startListeningTraining') return startListeningTraining();
    if (actionKey === 'startVocabularyTraining') return startVocabularyTraining();
    if (actionKey === 'startWeaknessReview') return startWeaknessReview();
    if (actionKey === 'showSection') return showSection(actionPayload);
    if (actionKey === 'startLevelExam') return startLevelExam(actionPayload);
    if (actionKey === 'filterLessons') return filterLessons(actionPayload);
    if (actionKey === 'openWeaknessFocus') {
        const [kind, key] = String(actionPayload || '').split('::');
        return openWeaknessFocus(kind, key);
    }
}

function bindDelegatedUiActions() {
    if (window.__taxiTrainerDelegatedUiBound) return;
    let lastHandledAt = 0;
    const handler = event => {
        const target = event.target instanceof Element ? event.target : event.target?.parentElement;
        if (!target) return;
        const now = Date.now();
        if (now - lastHandledAt < 350) return;
        const actionTarget = target.closest('[data-ui-action]');
        if (actionTarget) {
            event.preventDefault();
            event.stopPropagation();
            lastHandledAt = now;
            executeUiAction(actionTarget.dataset.uiAction, actionTarget.dataset.uiPayload || '');
            return;
        }
        const editTarget = target.closest('[data-edit-lesson-id]');
        if (editTarget) {
            event.preventDefault();
            event.stopPropagation();
            lastHandledAt = now;
            editLesson(Number(editTarget.dataset.editLessonId));
            return;
        }
        const lessonTarget = target.closest('[data-lesson-id]');
        if (lessonTarget) {
            event.preventDefault();
            event.stopPropagation();
            lastHandledAt = now;
            openLesson(Number(lessonTarget.dataset.lessonId));
        }
    };
    document.addEventListener('click', handler);
    document.addEventListener('touchend', handler, { passive: false });
    window.__taxiTrainerDelegatedUiBound = true;
}

function toggleSubtabGroup(buttonAttribute, panelAttribute, activeTab) {
    const buttons = [...document.querySelectorAll(`[${buttonAttribute}]`)];
    const panels = [...document.querySelectorAll(`[${panelAttribute}]`)];
    if (!buttons.length || !panels.length) return;
    const availableTabs = new Set([
        ...buttons.map(button => button.getAttribute(buttonAttribute)),
        ...panels.map(panel => panel.getAttribute(panelAttribute))
    ]);
    const fallbackTab = buttons[0].getAttribute(buttonAttribute);
    const nextTab = availableTabs.has(activeTab) ? activeTab : fallbackTab;
    buttons.forEach(button => {
        button.classList.toggle('active', button.getAttribute(buttonAttribute) === nextTab);
    });
    panels.forEach(panel => {
        panel.classList.toggle('active', panel.getAttribute(panelAttribute) === nextTab);
    });
}

function setHomeLessonsTab(tab) {
    currentHomeLessonsTab = tab || currentHomeLessonsTab;
    toggleSubtabGroup('data-home-lessons-tab-button', 'data-home-lessons-tab-panel', currentHomeLessonsTab);
}

function setLessonViewTab(tab) {
    currentLessonViewTab = tab || currentLessonViewTab;
    toggleSubtabGroup('data-lesson-view-tab-button', 'data-lesson-view-tab-panel', currentLessonViewTab);
}

function setResultsTab(tab) {
    currentResultsTab = tab || currentResultsTab;
    toggleSubtabGroup('data-results-tab-button', 'data-results-tab-panel', currentResultsTab);
}

function setAssessmentTab(tab) {
    currentAssessmentTab = tab || currentAssessmentTab;
    toggleSubtabGroup('data-assessment-tab-button', 'data-assessment-tab-panel', currentAssessmentTab);
}

function syncTabState() {
    setHomeLessonsTab(currentHomeLessonsTab);
    setLessonViewTab(currentLessonViewTab);
    setResultsTab(currentResultsTab);
    setAssessmentTab(currentAssessmentTab);
}

function renderTrainingModes() {
    const container = document.getElementById('trainingModesGrid');
    if (!container) return;
    const modes = [
        {
            title: '🎯 Rekommenderad lektion',
            description: 'Programmet väljer nästa bästa lektion baserat på din nivå och ditt resultat.',
            actionLabel: 'Starta nu',
            actionKey: 'openRecommendedLesson'
        },
        {
            title: '🎧 Lyssningsträning',
            description: 'Öppnar en passande lektion för fokus på uttal, tempo och förståelse rad för rad.',
            actionLabel: 'Träna lyssning',
            actionKey: 'startListeningTraining'
        },
        {
            title: '📚 Ordförrådsfokus',
            description: 'Väljer en lektion med tydligt yrkesordförråd så att du stärker centrala begrepp.',
            actionLabel: 'Träna ord',
            actionKey: 'startVocabularyTraining'
        },
        {
            title: '📝 Nivåprov',
            description: 'Gå direkt till proven och testa om du klarar nästa nivå.',
            actionLabel: 'Öppna prov',
            actionKey: 'showSection',
            actionPayload: 'exam'
        },
        {
            title: '🏆 Arena',
            description: 'Spela utmaningar med blandade teman, olika svårighetsgrader och snabb återkoppling.',
            actionLabel: 'Öppna arena',
            actionKey: 'showSection',
            actionPayload: 'challenge'
        },
        {
            title: '🔁 Smart repetition',
            description: 'Systemet bygger en fokuserad runda utifrån dina svagaste områden och frågetyper.',
            actionLabel: 'Starta repetition',
            actionKey: 'startWeaknessReview'
        }
    ];
    container.innerHTML = modes.map(mode => `
        <div class="training-mode-card">
            <h4>${mode.title}</h4>
            <p>${mode.description}</p>
            <button type="button" class="btn-primary" data-ui-action="${mode.actionKey}" data-ui-payload="${mode.actionPayload || ''}">${mode.actionLabel}</button>
        </div>
    `).join('');
}

function renderStudyPlan() {
    const container = document.getElementById('studyPlanGrid');
    if (!container) return;
    container.innerHTML = getStudyPlanSteps().map(step => `
        <div class="plan-card">
            <div class="plan-badge">${step.badge}</div>
            <h4>${step.title}</h4>
            <p>${step.description}</p>
            <button type="button" class="btn-secondary" data-ui-action="${step.actionKey}" data-ui-payload="${step.actionPayload || ''}">${step.actionLabel}</button>
        </div>
    `).join('');
}

function renderAdaptiveFocus() {
    const container = document.getElementById('adaptiveFocusGrid');
    if (!container) return;
    container.innerHTML = getCoachRecommendations().map(item => `
        <div class="focus-card">
            <div class="focus-score">${item.score}</div>
            <h4>${item.title}</h4>
            <p>${item.description}</p>
            <button type="button" class="btn-secondary" data-ui-action="${item.actionKey}" data-ui-payload="${item.actionPayload || ''}">${item.actionLabel}</button>
        </div>
    `).join('');
}

function renderProgressReports() {
    const container = document.getElementById('reportGrid');
    if (!container) return;
    const stats = getUserStats();
    const correct = user?.performance?.totalCorrect || 0;
    const incorrect = user?.performance?.totalIncorrect || 0;
    const accuracy = correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;
    const reportCards = [
        {
            score: `${stats.points}`,
            title: 'Poängsaldo',
            description: 'Samlas genom lektioner, prov, utmaningar och smart repetition.'
        },
        {
            score: `${accuracy}%`,
            title: 'Total träffsäkerhet',
            description: 'Bygger på alla besvarade frågor i lektioner, prov och utmaningar.'
        },
        {
            score: `${stats.reviewCount}`,
            title: 'Repetitionspass',
            description: 'Visar hur ofta du har arbetat riktat med dina svaga punkter.'
        }
    ];
    container.innerHTML = reportCards.map(item => `
        <div class="report-card">
            <div class="report-score">${item.score}</div>
            <h4>${item.title}</h4>
            <p>${item.description}</p>
        </div>
    `).join('');
}

function renderBadges() {
    const container = document.getElementById('badgeGrid');
    if (!container) return;
    container.innerHTML = getBadgeState().map(badge => `
        <div class="badge-card ${badge.unlocked ? '' : 'locked'}">
            <div class="badge-icon">${badge.icon}</div>
            <h4>${badge.title}</h4>
            <p>${badge.description}</p>
        </div>
    `).join('');
}

function renderCurriculumRoadmap() {
    const container = document.getElementById('curriculumGrid');
    if (!container) return;
    container.innerHTML = getCurriculumStages().map(stage => `
        <div class="curriculum-card">
            <div class="curriculum-stage">${stage.stage}</div>
            <h4>${stage.title}</h4>
            <p>${stage.description}</p>
            <div class="lesson-summary">${stage.progress}</div>
            <button type="button" class="btn-secondary" data-ui-action="${stage.actionKey}" data-ui-payload="${stage.actionPayload || ''}">${stage.actionLabel}</button>
        </div>
    `).join('');
}

function updateCounts() {
    document.getElementById('totalLessonsCount').textContent = lessons.length;
    document.getElementById('beginnerCount').textContent = lessons.filter(lesson => lesson.level === 'beginner').length;
    document.getElementById('intermediateCount').textContent = lessons.filter(lesson => lesson.level === 'intermediate').length;
    document.getElementById('advancedCount').textContent = lessons.filter(lesson => lesson.level === 'advanced').length;
}

function renderDashboard() {
    const completed = user?.completed?.length || 0;
    const completionRate = lessons.length ? Math.round((completed / lessons.length) * 100) : 0;
    const attempts = lessons.reduce((sum, lesson) => sum + (lesson.attempts?.length || 0), 0);
    const topicsCount = new Set(lessons.map(lesson => lesson.topic)).size;
    const stats = getUserStats();
    const recommended = getRecommendedLesson();
    document.getElementById('dashboardTitle').textContent = user ? `Hej ${user.name.split(' ')[0]} – bygg trygg och professionell taxi-engelska` : 'Bygg stark taxi-engelska steg för steg';
    document.getElementById('dashboardSubtitle').textContent = recommended ? `Nästa rekommenderade ämne är ${titleFromTopic(recommended.topic).toLowerCase()} med fokus på ${recommended.focus.toLowerCase()}.` : 'Träna verkliga situationer med tydlig struktur, varierade scenarier och smarta rekommendationer.';
    document.getElementById('heroCompletionPercent').textContent = `${completionRate}%`;
    document.getElementById('dailyCoachTip').textContent = recommended?.coachTip || TOPIC_META.general.coachTip;
    document.getElementById('nextLessonHint').textContent = recommended ? recommended.title : 'Välj valfri lektion för att starta din nästa träningsrunda.';
    document.getElementById('homeInsightCards').innerHTML = [
        { icon: '🎯', value: `${completed}/${lessons.length}`, label: 'Slutförda lektioner' },
        { icon: '🧭', value: topicsCount, label: 'Ämnen i biblioteket' },
        { icon: '🧠', value: attempts, label: 'Träningsrundor' },
        { icon: '🏅', value: `${stats.points}`, label: 'Poängsaldo' }
    ].map(card => `
        <div class="insight-card">
            <div class="insight-icon">${card.icon}</div>
            <div>
                <div class="insight-value">${card.value}</div>
                <div class="insight-label">${card.label}</div>
            </div>
        </div>
    `).join('');
    renderTrainingModes();
    renderStudyPlan();
    renderAdaptiveFocus();
    renderCurriculumRoadmap();
}

function populateTopicFilter() {
    const select = document.getElementById('topicFilterSelect');
    select.innerHTML = '<option value="all">Alla ämnen</option>' + Object.keys(TOPIC_META).filter(key => key !== 'general').map(key => `<option value="${key}">${TOPIC_META[key].icon} ${TOPIC_META[key].label}</option>`).join('');
    select.value = currentTopic;
}

function renderTopicOverview() {
    const counts = lessons.reduce((acc, lesson) => {
        acc[lesson.topic] = (acc[lesson.topic] || 0) + 1;
        return acc;
    }, {});
    document.getElementById('topicOverview').innerHTML = Object.keys(counts).map(topic => {
        const meta = getTopicMeta(topic);
        return `<button class="topic-chip ${currentTopic === topic ? 'active' : ''}" onclick="quickFilterTopic('${topic}')">${meta.icon} ${meta.label} · ${counts[topic]}</button>`;
    }).join('');
}

function getFilteredLessons() {
    return lessons.filter(lesson => {
        const levelMatch = currentFilter === 'all' || lesson.level === currentFilter;
        const topicMatch = currentTopic === 'all' || lesson.topic === currentTopic;
        const searchSource = `${lesson.title} ${lesson.scene} ${lesson.focus} ${titleFromTopic(lesson.topic)}`.toLowerCase();
        const searchMatch = !currentSearch || searchSource.includes(currentSearch.toLowerCase());
        return levelMatch && topicMatch && searchMatch;
    });
}

function updateLessonsGrid() {
    const filtered = getFilteredLessons();
    const grid = document.getElementById('lessonsGrid');
    if (!filtered.length) {
        grid.innerHTML = '<div class="empty-state">Inga lektioner matchar dina filter just nu. Prova att rensa sökningen eller byt ämne.</div>';
        return;
    }
    grid.innerHTML = filtered.map(lesson => {
        const meta = getTopicMeta(lesson.topic);
        const completedClass = user?.completed?.includes(lesson.id) ? 'completed' : '';
        return `
            <div class="lesson-card ${lesson.level} ${completedClass}" data-lesson-id="${lesson.id}">
                <div class="lesson-header">
                    <span class="level-badge ${lesson.level}">${levelLabel(lesson.level)}</span>
                    <span class="lesson-icon">${escapeHtml(lesson.icon || meta.icon)}</span>
                </div>
                <div class="lesson-title">${escapeHtml(lesson.title)}</div>
                <div class="lesson-meta-row">
                    <span class="lesson-meta-chip">${meta.icon} ${meta.label}</span>
                    <span class="lesson-meta-chip">${lesson.isCustom ? '🧠 Egna innehåll' : '🎓 Kuraterad lektion'}</span>
                </div>
                <div class="lesson-summary">${escapeHtml(lesson.focus)}</div>
                <div class="lesson-stats">
                    <span>📝 ${lesson.questions.length} frågor</span>
                    <span>🔄 ${lesson.attempts?.length || 0} rundor</span>
                    <span>📍 ${escapeHtml(lesson.scene)}</span>
                </div>
                <div class="lesson-actions">
                    <button type="button" class="btn-secondary" data-edit-lesson-id="${lesson.id}">✎ Redigera</button>
                </div>
            </div>
        `;
    }).join('');
}

function updateSearch(value) {
    currentSearch = value.trim();
    updateLessonsGrid();
}

function setTopicFilter(value) {
    currentTopic = value;
    renderTopicOverview();
    updateLessonsGrid();
}

function quickFilterTopic(topic) {
    currentTopic = topic;
    document.getElementById('topicFilterSelect').value = topic;
    renderTopicOverview();
    updateLessonsGrid();
}

function applyLevelActiveState(level) {
    document.querySelectorAll('.level-btn').forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('onclick')?.includes(`'${level}'`)) button.classList.add('active');
    });
}

function filterLessons(level, button) {
    currentFilter = level;
    document.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('active'));
    if (button) button.classList.add('active');
    else applyLevelActiveState(level);
    updateLessonsGrid();
}

function clearSearchFilters() {
    currentSearch = '';
    currentTopic = 'all';
    currentFilter = 'all';
    document.getElementById('lessonSearch').value = '';
    document.getElementById('topicFilterSelect').value = 'all';
    applyLevelActiveState('all');
    renderTopicOverview();
    updateLessonsGrid();
}

function renderDialogueLine(line) {
    const speaker = getSpeakerFromLine(line);
    const text = getSpokenText(line);
    return speaker ? `<span class="speaker-tag">${escapeHtml(speaker)}</span>${escapeHtml(text)}` : escapeHtml(line);
}

function renderLessonInsights(lesson) {
    const meta = getTopicMeta(lesson.topic);
    document.getElementById('lessonMetaChips').innerHTML = `
        <span class="lesson-meta-chip">${meta.icon} ${meta.label}</span>
        <span class="lesson-meta-chip">${levelLabel(lesson.level)}</span>
        <span class="lesson-meta-chip">${lesson.isCustom ? '🧠 Smart skapad' : '🎓 Expertlektion'}</span>
    `;
    document.getElementById('lessonCoachPanel').innerHTML = `<h3>Coach tip</h3><p>${escapeHtml(lesson.coachTip || meta.coachTip)}</p>`;
    document.getElementById('lessonScene').textContent = lesson.scene || meta.scene;
    document.getElementById('lessonFocus').textContent = lesson.focus || meta.focus;
    document.getElementById('lessonVocabulary').innerHTML = normalizeVocabulary(lesson.vocabulary, lesson.topic).map(item => `<div class="vocab-chip"><strong>${escapeHtml(item.en)}</strong>${item.sv ? ` · ${escapeHtml(item.sv)}` : ''}</div>`).join('');
}

function displayParagraphs(lesson) {
    const english = splitLines(lesson.english);
    const swedish = splitLines(lesson.swedish);
    document.getElementById('paragraphsContainer').innerHTML = english.map((line, index) => `
        <div class="paragraph-item" id="p-item-${index}" onclick="selectParagraph(${index})">
            <div class="paragraph-header">
                <span class="paragraph-number">#${index + 1}</span>
            </div>
            <div class="english-paragraph">${renderDialogueLine(line)}</div>
            <div class="swedish-paragraph">${swedish[index] ? renderDialogueLine(swedish[index]) : ''}</div>
        </div>
    `).join('');
    selectedParagraphIndex = 0;
    activeParagraphIndex = -1;
    updateParagraphStates();
}

function displayQuestions() {
    document.getElementById('questionsContainer').innerHTML = currentLesson.questions.map((question, index) => `
        <div class="question-card pending" id="q${index}">
            <div class="question-text">${index + 1}. ${escapeHtml(question.text)}</div>
            ${question.type === 'fill' ? `
                <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                    <input type="text" id="ans${index}" class="answer-input" placeholder="Skriv svaret här..." style="margin:0;">
                    <button class="btn-primary" onclick="checkFill(${index})" style="width:auto; padding:12px 24px;">Kontrollera</button>
                </div>
            ` : `
                <div class="options-grid">
                    ${question.options.map((option, optionIndex) => `<button class="option-btn" onclick="checkMCQ(${index}, ${optionIndex})">${escapeHtml(option)}</button>`).join('')}
                </div>
            `}
            <div id="fb${index}" class="feedback-message"></div>
            <div id="exp${index}" class="explanation-text">${escapeHtml(question.explanation || '')}</div>
        </div>
    `).join('');
    currentLesson.completionLogged = false;
    updateProgress();
}

function checkFill(index) {
    const question = currentLesson.questions[index];
    const input = document.getElementById(`ans${index}`);
    const feedback = document.getElementById(`fb${index}`);
    const explanation = document.getElementById(`exp${index}`);
    const card = document.getElementById(`q${index}`);
    const answer = input.value.trim().toLowerCase();
    if (!answer) {
        feedback.className = 'feedback-message error';
        feedback.textContent = 'Skriv ett svar först.';
        return;
    }
    if (answer === String(question.correct || '').trim().toLowerCase()) {
        card.classList.add('correct');
        card.classList.remove('pending');
        input.disabled = true;
        trackPerformanceEvent(currentLesson, question, true, 'lesson');
        feedback.className = 'feedback-message success';
        feedback.textContent = '✅ Rätt! Bra läst och lyssnat.';
        explanation.style.display = 'block';
    } else {
        trackPerformanceEvent(currentLesson, question, false, 'lesson');
        feedback.className = 'feedback-message error';
        feedback.textContent = `❌ Inte riktigt. Rätt ord är "${question.correct}".`;
        explanation.style.display = 'block';
    }
    updateProgress();
}

function checkMCQ(index, selected) {
    const question = currentLesson.questions[index];
    const card = document.getElementById(`q${index}`);
    if (card.classList.contains('correct')) return;
    const feedback = document.getElementById(`fb${index}`);
    const explanation = document.getElementById(`exp${index}`);
    const options = [...card.querySelectorAll('.option-btn')];
    options.forEach(button => button.classList.remove('selected', 'correct', 'wrong'));
    options[selected].classList.add('selected');
    if (selected === question.correct) {
        options[selected].classList.add('correct');
        options.forEach(button => button.disabled = true);
        card.classList.add('correct');
        card.classList.remove('pending');
        trackPerformanceEvent(currentLesson, question, true, 'lesson');
        feedback.className = 'feedback-message success';
        feedback.textContent = '✅ Rätt svar! Fortsätt så.';
        explanation.style.display = 'block';
    } else {
        options[selected].classList.add('wrong');
        trackPerformanceEvent(currentLesson, question, false, 'lesson');
        feedback.className = 'feedback-message error';
        feedback.textContent = '❌ Inte rätt ännu. Läs dialogen igen och prova igen.';
        explanation.style.display = 'block';
    }
    updateProgress();
}

function recordLessonCompletion() {
    if (!currentLesson || currentLesson.completionLogged) return;
    currentLesson.completionLogged = true;
    currentLesson.attempts = currentLesson.attempts || [];
    currentLesson.attempts.push({ date: new Date().toISOString(), score: currentLesson.questions.length, total: currentLesson.questions.length });
    if (user && !user.completed.includes(currentLesson.id)) {
        user.completed.push(currentLesson.id);
        awardPoints(20, 'Lektion slutförd');
    }
    saveAppState();
    renderDashboard();
    updateLessonsGrid();
    updateResults();
    showToast('🎉 Lektionen är slutförd!', 'success');
}

function updateProgress() {
    const total = currentLesson?.questions?.length || 0;
    const correct = document.querySelectorAll('.question-card.correct').length;
    document.getElementById('lessonProgress').textContent = `${correct}/${total} frågor klara`;
    if (total > 0 && correct === total) recordLessonCompletion();
}

function editLesson(id) {
    const lesson = lessons.find(item => item.id === id);
    if (!lesson) return;
    currentLesson = lesson;
    editCurrentLesson();
}

function editCurrentLesson() {
    if (!currentLesson) return;
    editingLessonId = currentLesson.id;
    document.getElementById('editLessonTitle').textContent = currentLesson.title;
    document.getElementById('editTitle').value = currentLesson.title;
    document.getElementById('editLevel').value = currentLesson.level;
    document.getElementById('editIcon').value = currentLesson.icon || getTopicMeta(currentLesson.topic).icon;
    document.getElementById('editQuestionsContainer').innerHTML = currentLesson.questions.map((question, index) => `
        <div class="question-editor" id="editQ${index}">
            <div class="question-editor-header">
                <strong>Fråga ${index + 1} (${question.type})</strong>
                <select class="question-type-select" onchange="changeQuestionType(${index}, this.value)">
                    <option value="mcq" ${question.type === 'mcq' ? 'selected' : ''}>Flerval</option>
                    <option value="fill" ${question.type === 'fill' ? 'selected' : ''}>Fyll i</option>
                </select>
            </div>
            <input type="text" class="answer-input" value="${escapeHtml(question.text)}" onchange="updateQuestionText(${index}, this.value)">
            ${question.type === 'mcq' ? `
                <div class="options-grid">
                    ${question.options.map((option, optionIndex) => `
                        <div style="display:flex; gap:10px; align-items:center;">
                            <input type="text" class="answer-input" value="${escapeHtml(option)}" style="flex:1;" onchange="updateQuestionOption(${index}, ${optionIndex}, this.value)">
                            <input type="radio" name="correctQ${index}" ${optionIndex === question.correct ? 'checked' : ''} onchange="setCorrectAnswer(${index}, ${optionIndex})">
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div>
                    <label style="font-size:12px; color:#666;">Correct answer</label>
                    <input type="text" class="answer-input" value="${escapeHtml(question.correct)}" onchange="updateQuestionCorrectText(${index}, this.value)">
                </div>
            `}
        </div>
    `).join('');
    showSection();
    document.getElementById('editSection').style.display = 'block';
}

function updateQuestionText(index, value) {
    if (currentLesson?.questions[index]) currentLesson.questions[index].text = value;
}

function updateQuestionOption(questionIndex, optionIndex, value) {
    if (currentLesson?.questions[questionIndex]) currentLesson.questions[questionIndex].options[optionIndex] = value;
}

function setCorrectAnswer(questionIndex, optionIndex) {
    if (currentLesson?.questions[questionIndex]) currentLesson.questions[questionIndex].correct = optionIndex;
}

function updateQuestionCorrectText(index, value) {
    if (currentLesson?.questions[index]) currentLesson.questions[index].correct = value;
}

function changeQuestionType(index, type) {
    if (!currentLesson?.questions[index]) return;
    if (type === 'fill') currentLesson.questions[index] = { type: 'fill', text: currentLesson.questions[index].text, correct: typeof currentLesson.questions[index].correct === 'string' ? currentLesson.questions[index].correct : '', explanation: currentLesson.questions[index].explanation || '' };
    else currentLesson.questions[index] = { type: 'mcq', text: currentLesson.questions[index].text, options: currentLesson.questions[index].options || ['Option 1', 'Option 2', 'Option 3', 'Option 4'], correct: Number.isInteger(currentLesson.questions[index].correct) ? currentLesson.questions[index].correct : 0, explanation: currentLesson.questions[index].explanation || '' };
    editCurrentLesson();
}

function saveEditedLesson() {
    const lessonIndex = lessons.findIndex(lesson => lesson.id === editingLessonId);
    if (lessonIndex === -1) return;
    lessons[lessonIndex].title = document.getElementById('editTitle').value.trim() || lessons[lessonIndex].title;
    lessons[lessonIndex].level = document.getElementById('editLevel').value;
    lessons[lessonIndex].icon = document.getElementById('editIcon').value.trim() || lessons[lessonIndex].icon;
    lessons[lessonIndex].questions = currentLesson.questions.map(normalizeQuestion);
    saveAppState();
    refreshAllUi();
    showSection('home');
    showToast('✅ Lektionen är uppdaterad!', 'success');
}

function deleteCurrentLesson() {
    if (!currentLesson || !confirm('Vill du ta bort den här lektionen?')) return;
    lessons = lessons.filter(lesson => lesson.id !== currentLesson.id);
    if (user) user.completed = user.completed.filter(id => id !== currentLesson.id);
    currentLesson = null;
    saveAppState();
    refreshAllUi();
    showSection('home');
    showToast('🗑️ Lektionen är borttagen.', 'success');
}

function buildSmartDraft(rawEnglish, rawSwedish) {
    const english = normalizeLessonText(rawEnglish, 'english');
    const swedish = normalizeLessonText(rawSwedish, 'swedish');
    const topic = inferTopic(`${english}\n${swedish}`);
    const level = inferLevel(english);
    return normalizeLessonRecord({
        title: inferTitle(topic, english),
        level,
        topic,
        icon: getTopicMeta(topic).icon,
        scene: getTopicMeta(topic).scene,
        focus: getTopicMeta(topic).focus,
        coachTip: getTopicMeta(topic).coachTip,
        vocabulary: getTopicMeta(topic).vocabulary,
        english,
        swedish,
        isCustom: true
    }, lessons.length);
}

function renderSmartAnalysis(draft) {
    document.getElementById('smartAnalysisPanel').innerHTML = `
        <div class="analysis-grid">
            <div class="analysis-card">
                <strong>Föreslagen titel</strong>
                <div>${escapeHtml(draft.title)}</div>
            </div>
            <div class="analysis-card">
                <strong>Nivå & ämne</strong>
                <div>${levelLabel(draft.level)} · ${getTopicMeta(draft.topic).icon} ${titleFromTopic(draft.topic)}</div>
            </div>
            <div class="analysis-card">
                <strong>Fokus</strong>
                <div>${escapeHtml(draft.focus)}</div>
            </div>
            <div class="analysis-card">
                <strong>Frågor</strong>
                <div>${draft.questions.length} automatiskt skapade övningar</div>
            </div>
        </div>
    `;
}

function analyzeSmartLessonInput() {
    const rawEnglish = document.getElementById('smartInputText').value.trim();
    const rawSwedish = document.getElementById('smartInputSwedish').value.trim();
    if (!rawEnglish) {
        showToast('Klistra in engelsk text först.', 'error');
        return;
    }
    const draft = buildSmartDraft(rawEnglish, rawSwedish);
    smartDraftMeta = { topic: draft.topic, scene: draft.scene, focus: draft.focus, coachTip: draft.coachTip, vocabulary: draft.vocabulary };
    document.getElementById('addTitle').value = draft.title;
    document.getElementById('addLevel').value = draft.level;
    document.getElementById('addIcon').value = draft.icon;
    document.getElementById('addEnglish').value = draft.english;
    document.getElementById('addSwedish').value = draft.swedish;
    generatedQuestions = draft.questions;
    renderSmartAnalysis(draft);
    displayGeneratedQuestions();
    showToast('🧠 Smart analys klar!', 'success');
}

function clearSmartInputs() {
    document.getElementById('smartInputText').value = '';
    document.getElementById('smartInputSwedish').value = '';
    document.getElementById('smartAnalysisPanel').innerHTML = '';
    smartDraftMeta = null;
}

function generateQuestionsFromText() {
    const english = document.getElementById('addEnglish').value.trim();
    const swedish = document.getElementById('addSwedish').value.trim();
    if (!english) {
        showToast('Skriv eller analysera en engelsk text först.', 'error');
        return;
    }
    const topic = smartDraftMeta?.topic || inferTopic(`${english}\n${swedish}`);
    const draft = normalizeLessonRecord({
        title: document.getElementById('addTitle').value.trim() || inferTitle(topic, english),
        level: document.getElementById('addLevel').value || inferLevel(english),
        topic,
        icon: document.getElementById('addIcon').value.trim() || getTopicMeta(topic).icon,
        scene: smartDraftMeta?.scene || getTopicMeta(topic).scene,
        focus: smartDraftMeta?.focus || getTopicMeta(topic).focus,
        coachTip: smartDraftMeta?.coachTip || getTopicMeta(topic).coachTip,
        vocabulary: smartDraftMeta?.vocabulary || getTopicMeta(topic).vocabulary,
        english,
        swedish,
        isCustom: true
    }, lessons.length);
    generatedQuestions = draft.questions;
    displayGeneratedQuestions();
    showToast('Frågor genererade!', 'success');
}

function displayGeneratedQuestions() {
    const container = document.getElementById('generatedQuestionsContainer');
    if (!generatedQuestions.length) {
        container.innerHTML = '<div class="empty-state">Inga frågor kunde genereras ännu. Prova mer text eller använd smart analys.</div>';
        return;
    }
    container.innerHTML = generatedQuestions.map((question, index) => `
        <div class="question-editor">
            <div class="question-editor-header">
                <strong>Fråga ${index + 1} (${question.type})</strong>
            </div>
            <input type="text" class="answer-input" value="${escapeHtml(question.text)}" onchange="updateGeneratedQuestionText(${index}, this.value)">
            ${question.type === 'mcq' ? `
                <div class="options-grid">
                    ${question.options.map((option, optionIndex) => `
                        <div style="display:flex; gap:10px; align-items:center;">
                            <input type="text" class="answer-input" value="${escapeHtml(option)}" style="flex:1;" onchange="updateGeneratedOption(${index}, ${optionIndex}, this.value)">
                            <input type="radio" name="correctGen${index}" ${optionIndex === question.correct ? 'checked' : ''} onchange="setGeneratedCorrect(${index}, ${optionIndex})">
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div>
                    <label style="font-size:12px; color:#666;">Correct answer</label>
                    <input type="text" class="answer-input" value="${escapeHtml(question.correct)}" onchange="updateGeneratedCorrectText(${index}, this.value)">
                </div>
            `}
        </div>
    `).join('');
}

function updateGeneratedQuestionText(index, value) {
    if (generatedQuestions[index]) generatedQuestions[index].text = value;
}

function updateGeneratedOption(questionIndex, optionIndex, value) {
    if (generatedQuestions[questionIndex]) generatedQuestions[questionIndex].options[optionIndex] = value;
}

function setGeneratedCorrect(questionIndex, optionIndex) {
    if (generatedQuestions[questionIndex]) generatedQuestions[questionIndex].correct = optionIndex;
}

function updateGeneratedCorrectText(index, value) {
    if (generatedQuestions[index]) generatedQuestions[index].correct = value;
}

function saveNewLesson() {
    const english = document.getElementById('addEnglish').value.trim();
    const swedish = document.getElementById('addSwedish').value.trim();
    const title = document.getElementById('addTitle').value.trim();
    if (!title || !english) {
        showToast('Titel och engelsk text krävs.', 'error');
        return;
    }
    const topic = smartDraftMeta?.topic || inferTopic(`${english}\n${swedish}`);
    const newLesson = normalizeLessonRecord({
        id: lessons.reduce((maxId, lesson) => Math.max(maxId, Number(lesson.id) || 0), 0) + 1,
        title,
        level: document.getElementById('addLevel').value || inferLevel(english),
        topic,
        icon: document.getElementById('addIcon').value.trim() || getTopicMeta(topic).icon,
        scene: smartDraftMeta?.scene || getTopicMeta(topic).scene,
        focus: smartDraftMeta?.focus || getTopicMeta(topic).focus,
        coachTip: smartDraftMeta?.coachTip || getTopicMeta(topic).coachTip,
        vocabulary: smartDraftMeta?.vocabulary || getTopicMeta(topic).vocabulary,
        english,
        swedish,
        questions: generatedQuestions.length ? generatedQuestions.map(normalizeQuestion) : undefined,
        isCustom: true,
        createdAt: new Date().toISOString()
    }, lessons.length);
    lessons.push(newLesson);
    saveAppState();
    refreshAllUi();
    resetAddForm();
    showSection('home');
    showToast('✅ Ny lektion tillagd!', 'success');
}

function resetAddForm() {
    document.getElementById('addTitle').value = '';
    document.getElementById('addEnglish').value = '';
    document.getElementById('addSwedish').value = '';
    document.getElementById('addIcon').value = '✈️';
    document.getElementById('addLevel').value = 'beginner';
    generatedQuestions = [];
    smartDraftMeta = null;
    document.getElementById('generatedQuestionsContainer').innerHTML = '';
    document.getElementById('smartAnalysisPanel').innerHTML = '';
    document.getElementById('smartInputText').value = '';
    document.getElementById('smartInputSwedish').value = '';
}

function openLesson(id) {
    currentLesson = lessons.find(lesson => lesson.id === id);
    currentLessonIndex = lessons.findIndex(lesson => lesson.id === id);
    if (!currentLesson) return;
    setLessonViewTab('reading');
    showSection('lesson');
    document.getElementById('lessonTitle').textContent = currentLesson.title;
    renderLessonInsights(currentLesson);
    displayParagraphs(currentLesson);
    displayQuestions();
    setReadingMessage('🎧 Ingen uppläsning aktiv ännu', 'Tryck på en rad för att markera den och repetera snabbare.');
    updateNavButtons();
    window.scrollTo({ top: 0, behavior: 'auto' });
    document.getElementById('lessonView').scrollIntoView({ block: 'start', behavior: 'auto' });
}

function buildAssessmentPool(criteria = {}) {
    const levels = criteria.levels ? new Set(criteria.levels) : null;
    const topics = criteria.topics ? new Set(criteria.topics) : null;
    return lessons
        .filter(lesson => {
            const levelMatch = !levels || levels.has(lesson.level);
            const topicMatch = !topics || topics.has(lesson.topic);
            return levelMatch && topicMatch;
        })
        .flatMap(lesson => (lesson.questions || []).map(question => ({
            ...clone(question),
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            lessonLevel: lesson.level,
            lessonTopic: lesson.topic
        })));
}

function buildAssessmentQuestions(criteria, count) {
    return shuffleArray(buildAssessmentPool(criteria)).slice(0, count);
}

function renderChallengeModes() {
    const container = document.getElementById('challengeModesGrid');
    if (!container) return;
    container.innerHTML = CHALLENGE_PRESETS.map(challenge => `
        <div class="assessment-config-card">
            <h4>${challenge.title}</h4>
            <p>${challenge.description}</p>
            <div class="assessment-meta">
                <span class="assessment-meta-chip">${challenge.count} frågor</span>
                <span class="assessment-meta-chip">${challenge.levels.map(levelLabel).join(' / ')}</span>
            </div>
            <button class="btn-primary" onclick="startChallenge('${challenge.id}')">Starta utmaning</button>
        </div>
    `).join('');
}

function renderAssessment() {
    if (!currentAssessment) return;
    document.getElementById('assessmentTitle').textContent = currentAssessment.title;
    document.getElementById('assessmentProgress').textContent = `${currentAssessment.questions.length} frågor`;
    document.getElementById('assessmentMeta').innerHTML = currentAssessment.meta.map(item => `<span class="assessment-meta-chip">${item}</span>`).join('');
    document.getElementById('assessmentQuestions').innerHTML = currentAssessment.questions.map((question, index) => `
        <div class="question-card pending" id="assessmentCard${index}">
            <div class="question-text">${index + 1}. ${escapeHtml(question.text)}</div>
            <div class="lesson-meta-row">
                <span class="lesson-meta-chip">${escapeHtml(question.lessonTitle)}</span>
                <span class="lesson-meta-chip">${getTopicMeta(question.lessonTopic).icon} ${titleFromTopic(question.lessonTopic)}</span>
            </div>
            ${question.type === 'fill' ? `
                <input type="text" id="assessmentInput${index}" class="answer-input" placeholder="Skriv ditt svar här...">
            ` : `
                <div class="options-grid">
                    ${question.options.map((option, optionIndex) => `
                        <label class="option-btn" style="display:flex; align-items:center; gap:8px;">
                            <input type="radio" name="assessmentQ${index}" value="${optionIndex}">
                            <span>${escapeHtml(option)}</span>
                        </label>
                    `).join('')}
                </div>
            `}
            <div id="assessmentFeedback${index}" class="feedback-message"></div>
        </div>
    `).join('');
    document.getElementById('assessmentResult').style.display = 'none';
}

function startLevelExam(level) {
    const questions = buildAssessmentQuestions({ levels: [level] }, 10);
    if (questions.length < 5) {
        showToast('För få frågor för att starta provet.', 'error');
        return;
    }
    currentAssessment = {
        type: 'exam',
        level,
        questions,
        title: `${levelLabel(level)} · Nivåprov`,
        meta: ['Nivåprov', `${questions.length} frågor`, 'Blandade lektioner', 'Resultat sparas']
    };
    showSection('assessment');
    renderAssessment();
}

function startChallenge(challengeId) {
    const config = CHALLENGE_PRESETS.find(item => item.id === challengeId);
    if (!config) return;
    const questions = buildAssessmentQuestions({ levels: config.levels, topics: config.topics }, config.count);
    if (questions.length < 5) {
        showToast('För få frågor för att starta utmaningen.', 'error');
        return;
    }
    currentAssessment = {
        type: 'challenge',
        challengeId: config.id,
        title: config.title,
        questions,
        meta: ['Utmaning', `${questions.length} frågor`, 'Tidspress i fokus', 'Resultat sparas']
    };
    showSection('assessment');
    renderAssessment();
}

function closeAssessment() {
    const fallbackTab = currentAssessment?.type === 'challenge' ? 'challenges' : 'exams';
    currentAssessment = null;
    showSection('assessmentHub');
    setAssessmentTab(fallbackTab);
}

function calculateAssessmentResult() {
    const answers = currentAssessment.questions.map((question, index) => {
        if (question.type === 'fill') {
            return (document.getElementById(`assessmentInput${index}`)?.value || '').trim();
        }
        const selected = document.querySelector(`input[name="assessmentQ${index}"]:checked`);
        return selected ? Number(selected.value) : null;
    });
    let correctCount = 0;
    currentAssessment.questions.forEach((question, index) => {
        const card = document.getElementById(`assessmentCard${index}`);
        const feedback = document.getElementById(`assessmentFeedback${index}`);
        let isCorrect = false;
        if (question.type === 'fill') {
            isCorrect = answers[index].toLowerCase() === String(question.correct || '').trim().toLowerCase();
            feedback.textContent = isCorrect ? '✅ Rätt svar' : `❌ Rätt svar: ${question.correct}`;
        } else {
            isCorrect = answers[index] === question.correct;
            feedback.textContent = isCorrect ? '✅ Rätt svar' : `❌ Rätt svar: ${question.options[question.correct]}`;
        }
        feedback.className = `feedback-message ${isCorrect ? 'success' : 'error'}`;
        card.classList.remove('pending');
        if (isCorrect) {
            card.classList.add('correct');
            correctCount += 1;
        }
        const sourceLesson = lessons.find(lesson => lesson.id === question.lessonId) || {
            topic: question.lessonTopic,
            level: question.lessonLevel
        };
        trackPerformanceEvent(sourceLesson, question, isCorrect, currentAssessment.type);
    });
    const total = currentAssessment.questions.length;
    const percent = Math.round((correctCount / total) * 100);
    return { correctCount, total, percent };
}

function getAssessmentVerdict(percent) {
    if (percent >= 90) return 'Utmärkt nivå';
    if (percent >= 75) return 'Stark prestation';
    if (percent >= 60) return 'Godkänd men med utvecklingspotential';
    return 'Fortsätt träna innan nästa steg';
}

function submitAssessment() {
    if (!currentAssessment) return;
    if (currentAssessment.submitted) {
        showToast('Det här provet är redan rättat.', 'success');
        return;
    }
    const result = calculateAssessmentResult();
    currentAssessment.submitted = true;
    const resultBox = document.getElementById('assessmentResult');
    resultBox.style.display = 'block';
    resultBox.innerHTML = `
        <div class="assessment-result-score">${result.correctCount}/${result.total} · ${result.percent}%</div>
        <div style="font-weight:700; margin-bottom:8px;">${getAssessmentVerdict(result.percent)}</div>
        <div style="color: var(--text-secondary);">
            ${currentAssessment.type === 'exam' ? 'Nivåprovet är sparat i dina resultat.' : 'Utmaningen är sparad i din historik.'}
        </div>
    `;
    if (user) {
        const historyItem = {
            date: new Date().toISOString(),
            title: currentAssessment.title,
            level: currentAssessment.level || null,
            score: result.correctCount,
            total: result.total,
            percent: result.percent
        };
        if (currentAssessment.type === 'exam') {
            user.examHistory.push(historyItem);
            awardPoints(result.percent >= 75 ? 40 : 25, 'Nivåprov klart');
        } else if (currentAssessment.type === 'challenge') {
            user.challengeHistory.push(historyItem);
            awardPoints(result.percent >= 75 ? 35 : 20, 'Utmaning klar');
        } else {
            user.reviewHistory.push(historyItem);
            awardPoints(15, 'Smart repetition klar');
        }
    }
    unlockEligibleBadges();
    saveAppState();
    updateResults();
    renderDashboard();
}

function showSection(section) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    ['homeSection', 'resultsSection', 'assessmentHubSection', 'helpSection', 'profileSection', 'addSection', 'lessonView', 'editSection', 'assessmentSection'].forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = 'none';
    });
    if (section === 'home') {
        document.getElementById('homeSection').style.display = 'block';
        document.querySelectorAll('.nav-item')[0].classList.add('active');
        renderDashboard();
        updateLessonsGrid();
    } else if (section === 'results') {
        document.getElementById('resultsSection').style.display = 'block';
        document.querySelectorAll('.nav-item')[1].classList.add('active');
        updateResults();
        setResultsTab(currentResultsTab);
    } else if (section === 'assessmentHub' || section === 'exam' || section === 'challenge') {
        document.getElementById('assessmentHubSection').style.display = 'block';
        document.querySelectorAll('.nav-item')[2].classList.add('active');
        renderChallengeModes();
        updateAssessmentHub();
        setAssessmentTab(section === 'challenge' ? 'challenges' : section === 'exam' ? 'exams' : currentAssessmentTab);
    } else if (section === 'profile') {
        document.getElementById('profileSection').style.display = 'block';
        document.querySelectorAll('.nav-item')[3].classList.add('active');
        updateUserDisplay();
    } else if (section === 'add') {
        document.getElementById('addSection').style.display = 'block';
        document.querySelectorAll('.nav-item')[4].classList.add('active');
    } else if (section === 'help') {
        document.getElementById('helpSection').style.display = 'block';
        document.querySelectorAll('.nav-item')[5].classList.add('active');
    } else if (section === 'assessment') {
        document.getElementById('assessmentSection').style.display = 'block';
    } else if (section === 'lesson') {
        document.getElementById('lessonView').style.display = 'block';
    }
}

function backToHome() {
    stopSpeech();
    showSection('home');
}

function goToNextLesson() {
    if (currentLessonIndex < lessons.length - 1) openLesson(lessons[currentLessonIndex + 1].id);
}

function goToPrevLesson() {
    if (currentLessonIndex > 0) openLesson(lessons[currentLessonIndex - 1].id);
}

function updateNavButtons() {
    document.getElementById('prevLessonBtn').disabled = currentLessonIndex <= 0;
    document.getElementById('nextLessonBtn').disabled = currentLessonIndex >= lessons.length - 1;
}

function updateResults() {
    const completed = user?.completed?.length || 0;
    const completionRate = lessons.length ? Math.round((completed / lessons.length) * 100) : 0;
    const trainedTopics = new Set(lessons.filter(lesson => user?.completed?.includes(lesson.id)).map(lesson => lesson.topic));
    const examHistory = user?.examHistory || [];
    const challengeHistory = user?.challengeHistory || [];
    const reviewHistory = user?.reviewHistory || [];
    const weaknesses = buildWeaknessEntries();
    const coachRecommendations = getCoachRecommendations();
    const badges = getBadgeState().filter(badge => badge.unlocked);
    document.getElementById('totalCompleted').textContent = completed;
    document.getElementById('totalLessons').textContent = lessons.length;
    document.getElementById('completionRate').textContent = `${completionRate}%`;
    document.getElementById('trainedTopicsCount').textContent = trainedTopics.size;
    document.getElementById('customLessonsCount').textContent = lessons.filter(lesson => lesson.isCustom).length;
    document.getElementById('examAttemptsCount').textContent = examHistory.length;
    document.getElementById('challengeAttemptsCount').textContent = challengeHistory.length;
    document.getElementById('resultsLevelBreakdown').innerHTML = ['beginner', 'intermediate', 'advanced'].map(level => {
        const total = lessons.filter(lesson => lesson.level === level).length;
        const done = lessons.filter(lesson => lesson.level === level && user?.completed?.includes(lesson.id)).length;
        return `<div class="breakdown-item"><strong>${levelLabel(level)}</strong><span>${done}/${total}</span></div>`;
    }).join('');
    const topicCounts = lessons.reduce((acc, lesson) => {
        acc[lesson.topic] = (acc[lesson.topic] || 0) + (user?.completed?.includes(lesson.id) ? 1 : 0);
        return acc;
    }, {});
    document.getElementById('resultsTopicBreakdown').innerHTML = Object.keys(TOPIC_META).filter(key => key !== 'general').map(topic => {
        const meta = getTopicMeta(topic);
        return `<div class="breakdown-item"><strong>${meta.icon} ${meta.label}</strong><span>${topicCounts[topic] || 0}</span></div>`;
    }).join('');
    const recentAttempts = lessons.flatMap(lesson => (lesson.attempts || []).map(attempt => ({ ...attempt, title: lesson.title, icon: lesson.icon }))).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
    document.getElementById('recentActivityList').innerHTML = recentAttempts.length ? recentAttempts.map(item => `<div class="recent-item"><strong>${escapeHtml(item.icon)} ${escapeHtml(item.title)}</strong><span>${new Date(item.date).toLocaleDateString('sv-SE')}</span></div>`).join('') : '<div class="empty-state">Ingen aktivitet ännu. Slutför en lektion för att se din historik.</div>';
    document.getElementById('resultsExamSummary').innerHTML = examHistory.length
        ? examHistory.slice(-5).reverse().map(item => `<div class="breakdown-item"><strong>${escapeHtml(item.title)}</strong><span>${item.percent}%</span></div>`).join('')
        : '<div class="empty-state">Inga nivåprov ännu.</div>';
    document.getElementById('resultsChallengeSummary').innerHTML = challengeHistory.length
        ? challengeHistory.slice(-5).reverse().map(item => `<div class="breakdown-item"><strong>${escapeHtml(item.title)}</strong><span>${item.percent}%</span></div>`).join('')
        : '<div class="empty-state">Inga utmaningar ännu.</div>';
    document.getElementById('resultsWeaknessSummary').innerHTML = weaknesses.length
        ? weaknesses.slice(0, 5).map(item => `<div class="breakdown-item"><strong>${escapeHtml(item.label)}</strong><span>${item.percent}% fel</span></div>`).join('')
        : '<div class="empty-state">Inga tydliga svaga områden ännu.</div>';
    document.getElementById('resultsCoachSummary').innerHTML = coachRecommendations.length
        ? coachRecommendations.map(item => `<div class="breakdown-item"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.actionLabel)}</span></div>`).join('')
        : '<div class="empty-state">Coachrekommendationer visas här.</div>';
    document.getElementById('resultsBadgeSummary').innerHTML = badges.length
        ? [
            `<div class="breakdown-item"><strong>Poäng</strong><span>${user?.points || 0}</span></div>`,
            `<div class="breakdown-item"><strong>Repetitionspass</strong><span>${reviewHistory.length}</span></div>`,
            ...badges.slice(0, 4).map(badge => `<div class="breakdown-item"><strong>${badge.icon} ${escapeHtml(badge.title)}</strong><span>Upplåst</span></div>`)
        ].join('')
        : '<div class="empty-state">Inga märken upplåsta ännu.</div>';
    const assessmentReviewSummary = document.getElementById('assessmentReviewSummary');
    if (assessmentReviewSummary) {
        assessmentReviewSummary.innerHTML = reviewHistory.length
            ? reviewHistory.slice(-5).reverse().map(item => `<div class="breakdown-item"><strong>${escapeHtml(item.title)}</strong><span>${item.percent}%</span></div>`).join('')
            : '<div class="empty-state">Ingen smart repetition ännu.</div>';
    }
    const assessmentReadinessSummary = document.getElementById('assessmentReadinessSummary');
    if (assessmentReadinessSummary) {
        const bestExam = examHistory.reduce((best, item) => !best || item.percent > best.percent ? item : best, null);
        const bestChallenge = challengeHistory.reduce((best, item) => !best || item.percent > best.percent ? item : best, null);
        const latestAssessment = [...examHistory, ...challengeHistory, ...reviewHistory]
            .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        assessmentReadinessSummary.innerHTML = [
            `<div class="breakdown-item"><strong>Bästa prov</strong><span>${bestExam ? `${bestExam.percent}%` : 'Ej startat'}</span></div>`,
            `<div class="breakdown-item"><strong>Bästa utmaning</strong><span>${bestChallenge ? `${bestChallenge.percent}%` : 'Ej startad'}</span></div>`,
            `<div class="breakdown-item"><strong>Senaste bedömning</strong><span>${latestAssessment ? `${latestAssessment.percent}%` : 'Ingen data ännu'}</span></div>`,
            `<div class="breakdown-item"><strong>Rekommendation</strong><span>${bestExam?.percent >= 75 ? 'Redo för nästa nivå' : 'Fortsätt träna stegvis'}</span></div>`
        ].join('');
    }
    renderProgressReports();
    renderBadges();
}

function updateAssessmentHub() {
    renderChallengeModes();
    const overview = document.getElementById('assessmentOverviewGrid');
    if (!overview) return;
    const examHistory = user?.examHistory || [];
    const challengeHistory = user?.challengeHistory || [];
    const reviewHistory = user?.reviewHistory || [];
    const latestScore = [...examHistory, ...challengeHistory, ...reviewHistory]
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    const bestExamPercent = examHistory.length ? Math.max(...examHistory.map(item => item.percent)) : 0;
    overview.innerHTML = [
        {
            value: examHistory.length,
            label: 'Nivåprov klara'
        },
        {
            value: challengeHistory.length,
            label: 'Utmaningar klara'
        },
        {
            value: reviewHistory.length,
            label: 'Repetitionsrundor'
        },
        {
            value: latestScore ? `${latestScore.percent}%` : `${bestExamPercent || 0}%`,
            label: latestScore ? 'Senaste bedömning' : 'Bästa provnivå'
        }
    ].map(card => `
        <div class="stat-card">
            <div class="stat-value">${card.value}</div>
            <div class="stat-label">${card.label}</div>
        </div>
    `).join('');
}

function clearRegisterFields() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const levelSelect = document.getElementById('level');
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (phoneInput) phoneInput.value = '';
    if (levelSelect) levelSelect.value = 'beginner';
}

function register(event) {
    if (event?.preventDefault) event.preventDefault();
    const name = document.getElementById('name').value.trim();
    if (!name) {
        alert('Ange ditt namn!');
        return;
    }
    user = ensureUserShape({
        name,
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        level: document.getElementById('level').value,
        completed: []
    });
    saveAppState();
    document.getElementById('registerScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    refreshAllUi();
}

function updateUserDisplay() {
    if (!user) return;
    document.getElementById('userName').textContent = user.name;
    document.getElementById('profileName').value = user.name;
    document.getElementById('profileEmail').value = user.email;
    document.getElementById('profilePhone').value = user.phone;
    document.getElementById('profileLevel').value = user.level;
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' });
}

function saveProfile() {
    if (!user) return;
    user.name = document.getElementById('profileName').value.trim() || user.name;
    user.email = document.getElementById('profileEmail').value.trim();
    user.phone = document.getElementById('profilePhone').value.trim();
    user.level = document.getElementById('profileLevel').value;
    saveAppState();
    refreshAllUi();
    showSection('home');
    showToast('Profil uppdaterad!', 'success');
}

function logout() {
    user = null;
    saveAppState();
    document.getElementById('registerScreen').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
    clearRegisterFields();
}

async function shareData() {
    const payload = JSON.stringify({ lessons, user, exportDate: new Date().toISOString() }, null, 2);
    const fileName = `taxi-data-${new Date().toISOString().slice(0, 10)}.json`;
    if (navigator.share) {
        try {
            const file = new File([payload], fileName, { type: 'application/json' });
            await navigator.share({ title: 'Taxi Trainer Data', text: 'Här är min Taxi Trainer-data med lektioner och framsteg.', files: [file] });
            showToast('Data delad!', 'success');
            return;
        } catch (error) {
            if (error.name === 'AbortError') return;
        }
    }
    exportData();
}

function exportData() {
    const data = JSON.stringify({ lessons, user, exportDate: new Date().toISOString() }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taxi-data-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Data exporterad!', 'success');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(loadEvent) {
        try {
            const data = JSON.parse(loadEvent.target.result);
            if (!Array.isArray(data.lessons)) throw new Error('Invalid file');
            lessons = data.lessons.map((lesson, index) => normalizeLessonRecord(lesson, index));
            user = ensureUserShape(data.user) || user;
            saveAppState();
            refreshAllUi();
            showToast('Data importerad!', 'success');
        } catch (error) {
            showToast('Fel vid import!', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function resetToDefaultData() {
    if (!confirm('Återställ till originalbiblioteket och rensa sparade lektioner?')) return;
    buildDefaultLessons();
    if (user) user.completed = [];
    saveAppState();
    refreshAllUi();
    showToast('Standardbiblioteket är återställt!', 'success');
}

function initAudio() {
    const speedInput = document.getElementById('speed');
    if (!speedInput) return;
    speedInput.addEventListener('input', event => {
        speechSpeed = parseFloat(event.target.value);
        document.getElementById('speedValue').textContent = `${speechSpeed.toFixed(1)}x`;
    });
}

function resetSpeed() {
    const speedInput = document.getElementById('speed');
    if (!speedInput) return;
    speedInput.value = 1;
    speechSpeed = 1;
    document.getElementById('speedValue').textContent = '1.0x';
}

function getSavedVoiceId() {
    return localStorage.getItem('taxiTrainerPreferredVoice') || '';
}

function savePreferredVoice() {
    const select = document.getElementById('voiceSelect');
    if (!select) return;
    localStorage.setItem('taxiTrainerPreferredVoice', select.value || '');
}

function getVoiceIdentifier(voice) {
    return voice.voiceURI || `${voice.name}__${voice.lang}`;
}

function getVoiceScore(voice) {
    const name = `${voice.name} ${voice.voiceURI || ''}`.toLowerCase();
    const lang = (voice.lang || '').toLowerCase();
    let score = 0;
    if (lang.startsWith('en-us')) score += 120;
    else if (lang.startsWith('en-gb')) score += 110;
    else if (lang.startsWith('en-au') || lang.startsWith('en-ca')) score += 100;
    else if (lang.startsWith('en')) score += 90;
    if (/(natural|premium|neural|enhanced|wavenet|studio|siri|google|eloquence)/.test(name)) score += 40;
    if (/(female|zira|samantha|ava|allison|serena|victoria|karen|moira|daniel|alex)/.test(name)) score += 12;
    if (voice.default) score += 10;
    if (voice.localService) score += 6;
    return score;
}

function getVoiceBadge(voice, score) {
    const lang = (voice.lang || '').toLowerCase();
    if (score >= 140) return '⭐ Klar';
    if (lang.startsWith('en')) return '🌐 Eng';
    return '🗣️ Övrig';
}

function getVoiceLocaleLabel(lang) {
    const normalized = (lang || '').toLowerCase();
    if (normalized.startsWith('en-us')) return 'Engelska (USA)';
    if (normalized.startsWith('en-gb')) return 'Engelska (UK)';
    if (normalized.startsWith('en-au')) return 'Engelska (AU)';
    if (normalized.startsWith('en-ca')) return 'Engelska (CA)';
    if (normalized.startsWith('en')) return 'Engelska';
    if (normalized.startsWith('sv')) return 'Svenska';
    return lang || 'Okänt språk';
}

function getRecommendedVoices() {
    return voices.filter(voice => (voice.lang || '').toLowerCase().startsWith('en')).slice(0, 3);
}

function renderVoiceRecommendations() {
    const container = document.getElementById('voiceRecommendations');
    const helper = document.getElementById('voiceHelperText');
    const selectedVoice = getSelectedVoice();
    if (!container || !helper) return;
    if (!voices.length) {
        container.innerHTML = '';
        helper.textContent = 'Inga röster kunde laddas just nu.';
        return;
    }
    const recommended = getRecommendedVoices();
    container.innerHTML = recommended.map(voice => {
        const isActive = selectedVoice && getVoiceIdentifier(selectedVoice) === getVoiceIdentifier(voice);
        const locale = getVoiceLocaleLabel(voice.lang);
        return `<button class="voice-chip ${isActive ? 'active' : ''}" onclick="selectVoiceById(decodeURIComponent('${encodeURIComponent(getVoiceIdentifier(voice))}'))">${escapeHtml(voice.name)} · ${escapeHtml(locale)}</button>`;
    }).join('');
    helper.textContent = selectedVoice
        ? `Vald röst: ${selectedVoice.name} — ${getVoiceLocaleLabel(selectedVoice.lang)}`
        : 'Programmet visar de tydligaste engelska rösterna först.';
}

function getSelectedVoice() {
    const select = document.getElementById('voiceSelect');
    if (!select || !select.value) return null;
    return voices.find(voice => getVoiceIdentifier(voice) === select.value) || null;
}

function selectVoiceById(voiceId) {
    const select = document.getElementById('voiceSelect');
    if (!select) return;
    select.value = voiceId;
    savePreferredVoice();
    renderVoiceRecommendations();
}

function chooseBestVoice() {
    const bestVoice = getRecommendedVoices()[0] || voices[0];
    if (!bestVoice) return;
    selectVoiceById(getVoiceIdentifier(bestVoice));
    showToast(`Bästa rösten vald: ${bestVoice.name}`, 'success');
}

function loadVoices() {
    const select = document.getElementById('voiceSelect');
    if (!select) return;
    const availableVoices = window.speechSynthesis.getVoices();
    if (!availableVoices.length) {
        voices = [];
        select.innerHTML = '<option value="">Inga röster tillgängliga ännu</option>';
        renderVoiceRecommendations();
        return;
    }
    voices = [...availableVoices]
        .map(voice => ({ voice, score: getVoiceScore(voice) }))
        .sort((a, b) => b.score - a.score || a.voice.name.localeCompare(b.voice.name))
        .map(item => item.voice);
    const savedVoiceId = getSavedVoiceId();
    const recommendedIds = new Set(getRecommendedVoices().map(voice => getVoiceIdentifier(voice)));
    const recommendedOptions = voices
        .filter(voice => recommendedIds.has(getVoiceIdentifier(voice)))
        .map(voice => {
            const score = getVoiceScore(voice);
            const badge = getVoiceBadge(voice, score);
            const locale = getVoiceLocaleLabel(voice.lang);
            return `<option value="${escapeHtml(getVoiceIdentifier(voice))}">${badge} ${escapeHtml(voice.name)} — ${escapeHtml(locale)}</option>`;
        }).join('');
    const allOptions = voices
        .filter(voice => !recommendedIds.has(getVoiceIdentifier(voice)))
        .map(voice => {
        const score = getVoiceScore(voice);
        const badge = getVoiceBadge(voice, score);
        const locale = getVoiceLocaleLabel(voice.lang);
        return `<option value="${escapeHtml(getVoiceIdentifier(voice))}">${badge} ${escapeHtml(voice.name)} — ${escapeHtml(locale)}</option>`;
    }).join('');
    select.innerHTML = `${recommendedOptions ? `<optgroup label="⭐ Rekommenderade">${recommendedOptions}</optgroup>` : ''}${allOptions ? `<optgroup label="Alla röster">${allOptions}</optgroup>` : ''}`;
    const preferredVoice = voices.find(voice => getVoiceIdentifier(voice) === savedVoiceId) || voices[0];
    select.value = preferredVoice ? getVoiceIdentifier(preferredVoice) : '';
    select.onchange = function() {
        savePreferredVoice();
        renderVoiceRecommendations();
    };
    renderVoiceRecommendations();
}

function testVoice() {
    const selectedVoice = getSelectedVoice();
    const utterance = new SpeechSynthesisUtterance('Hello, welcome to Taxi Trainer. This is your selected voice.');
    utterance.lang = selectedVoice?.lang || 'en-US';
    utterance.rate = speechSpeed;
    if (selectedVoice) utterance.voice = selectedVoice;
    window.speechSynthesis.speak(utterance);
}

function highlightParagraph(index) {
    const active = document.getElementById(`p-item-${index}`);
    activeParagraphIndex = index;
    selectedParagraphIndex = index;
    updateParagraphStates();
    if (active) active.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setReadingMessage(`🔊 Läser rad ${index + 1} just nu`, 'Aktuell rad färgas tydligt medan uppläsningen pågår.');
}

function playSequence(lines, pauseMs) {
    stopSpeech();
    if (!lines.length) return;
    const selectedVoice = getSelectedVoice();
    let index = 0;
    function speakNext() {
        if (index >= lines.length) {
            activeParagraphIndex = -1;
            updateParagraphStates();
            setReadingMessage('✅ Uppläsningen är klar', 'Spela igen eller välj en annan rad för snabb repetition.');
            return;
        }
        highlightParagraph(index);
        const utterance = new SpeechSynthesisUtterance(lines[index]);
        utterance.lang = selectedVoice?.lang || 'en-US';
        utterance.rate = speechSpeed;
        if (selectedVoice) utterance.voice = selectedVoice;
        utterance.onend = function() {
            index += 1;
            setTimeout(speakNext, pauseMs);
        };
        window.speechSynthesis.speak(utterance);
    }
    speakNext();
}

function playFull() {
    if (!currentLesson) return;
    playSequence(splitLines(currentLesson.english), 250);
}

function playLines() {
    if (!currentLesson) return;
    playSequence(splitLines(currentLesson.english), 900);
}

function repeatSelectedLine() {
    if (!currentLesson) return;
    const lines = splitLines(currentLesson.english);
    const line = lines[selectedParagraphIndex] || lines[0];
    if (!line) return;
    stopSpeech();
    highlightParagraph(selectedParagraphIndex);
    const selectedVoice = getSelectedVoice();
    const utterance = new SpeechSynthesisUtterance(line);
    utterance.lang = selectedVoice?.lang || 'en-US';
    utterance.rate = speechSpeed;
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.onend = function() {
        activeParagraphIndex = -1;
        updateParagraphStates();
        setReadingMessage(`🎯 Rad ${selectedParagraphIndex + 1} är markerad`, 'Du kan nu upprepa den markerade raden eller fortsätta läsa.');
    };
    window.speechSynthesis.speak(utterance);
}

function stopSpeech() {
    window.speechSynthesis.cancel();
    activeParagraphIndex = -1;
    updateParagraphStates();
    setReadingMessage(`🎯 Rad ${selectedParagraphIndex + 1} är markerad`, 'Du kan nu upprepa den markerade raden eller fortsätta läsa.');
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast-message ${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✅' : '❌'}</span><span>${escapeHtml(message)}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2200);
}

function refreshAllUi() {
    if (unlockEligibleBadges()) saveAppState();
    updateCounts();
    populateTopicFilter();
    renderTopicOverview();
    updateUserDisplay();
    renderDashboard();
    renderChallengeModes();
    updateLessonsGrid();
    updateResults();
    updateAssessmentHub();
    syncTabState();
}

window.onload = function() {
    initAudio();
    loadAppState();
    bindDelegatedUiActions();
    populateTopicFilter();
    loadVoices();
    if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = loadVoices;
    if (user) {
        document.getElementById('registerScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        refreshAllUi();
    } else {
        clearRegisterFields();
        document.getElementById('registerScreen').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
        updateCounts();
        renderDashboard();
        renderTopicOverview();
        updateLessonsGrid();
        updateResults();
        updateAssessmentHub();
        syncTabState();
    }
};
