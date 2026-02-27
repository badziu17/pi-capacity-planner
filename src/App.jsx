import { useState, useEffect, useRef, useCallback } from "react";
import { isSupabaseConfigured, generateICS, copyShareLink } from "./supabase";
/* VENTURA v6.0 — Group Travel OS
   MapLibre maps · Supabase-ready · PWA · Expense splitting ·
   AI group consensus · Share links · ICS export · PL/EN i18n */

// ══ i18n ══
const T={welcome:{pl:"Witaj ponownie",en:"Welcome back"},planNext:{pl:"Zaplanuj następną przygodę",en:"Plan your next adventure"},newTrip:{pl:"Nowa podróż",en:"New Trip"},back:{pl:"← Powrót",en:"← Back"},save:{pl:"Zapisz",en:"Save"},cancel:{pl:"Anuluj",en:"Cancel"},delete:{pl:"Usuń",en:"Delete"},add:{pl:"Dodaj",en:"Add"},close:{pl:"Zamknij",en:"Close"},selectProfile:{pl:"Wybierz profil",en:"Select profile"},continueAsGuest:{pl:"Kontynuuj jako gość",en:"Continue as guest"},guestMode:{pl:"Tryb gościa",en:"Guest mode"},guestNotice:{pl:"Oglądaj podróże demo. Możesz planować, ale bez zapisu.",en:"Browse demo trips. You can plan, but changes won't be saved."},signOut:{pl:"Wyloguj",en:"Sign Out"},loginToSave:{pl:"Zaloguj się, aby zapisać",en:"Log in to save"},tabTrip:{pl:"Podróż",en:"Trip"},tabPlan:{pl:"Plan",en:"Plan"},tabAI:{pl:"AI",en:"AI"},tabPack:{pl:"Pakuj",en:"Pack"},tabJournal:{pl:"Dziennik",en:"Journal"},tabBudget:{pl:"Budżet",en:"Budget"},tabBook:{pl:"Rezerwuj",en:"Book"},tabMemories:{pl:"Wspomnienia",en:"Memories"},tabMap:{pl:"Mapa",en:"Map"},tripReadiness:{pl:"Gotowość podróży",en:"Trip readiness"},completeToPrep:{pl:"Wykonaj te kroki",en:"Complete these steps"},travelers:{pl:"podróżni",en:"travelers"},observers:{pl:"obserwatorzy",en:"observers"},upcoming:{pl:"nadchodzący",en:"upcoming"},planning:{pl:"planowanie",en:"planning"},past:{pl:"przeszły",en:"past"},currency:{pl:"Waluta",en:"Currency"},deleteTrip:{pl:"Usuń podróż",en:"Delete trip"},getInspired:{pl:"Zainspiruj się",en:"Get inspired"},dayOverloaded:{pl:"⚠️ Dzień przeładowany! Przenieś część aktywności.",en:"⚠️ Day overloaded! Move some activities."},proposeActivity:{pl:"Zaproponuj atrakcję",en:"Propose activity"},approved:{pl:"Zatwierdzone",en:"Approved"},pending:{pl:"Oczekuje",en:"Pending"},votes:{pl:"głosy",en:"votes"},packingProgress:{pl:"Postęp pakowania",en:"Packing Progress"},templates:{pl:"Szablony",en:"Templates"},saveList:{pl:"Zapisz listę",en:"Save list"},loadList:{pl:"Wczytaj",en:"Load"},addItem:{pl:"Dodaj pozycję",en:"Add item"},category:{pl:"Kategoria",en:"Category"},itemName:{pl:"Nazwa",en:"Name"},aiSuggestions:{pl:"Sugestie AI",en:"AI Suggestions"},dontForget:{pl:"Nie zapomnij o...",en:"Don't forget..."},vacationRequest:{pl:"Wniosek urlopowy",en:"Vacation request"},vacNotApplied:{pl:"Nie złożono",en:"Not applied"},vacApplied:{pl:"Złożono",en:"Applied"},vacApproved:{pl:"Zatwierdzony ✓",en:"Approved ✓"},vacDenied:{pl:"Odrzucony ✕",en:"Denied ✕"},spent:{pl:"Wydano",en:"Spent"},budget:{pl:"Budżet",en:"Budget"},remaining:{pl:"pozostało",en:"remaining"},overBudget:{pl:"przekroczono!",en:"over budget!"},expenses:{pl:"Wydatki",en:"Expenses"},addExpense:{pl:"Dodaj wydatek",en:"Add expense"},spendingBreakdown:{pl:"Podział wydatków",en:"Spending Breakdown"},insights:{pl:"Wnioski",en:"Insights"},exchangeRates:{pl:"Kursy walut",en:"Exchange rates"},indicative:{pl:"orientacyjne",en:"indicative"},writeMemory:{pl:"Napisz wspomnienie...",en:"Write a memory..."},yourJournal:{pl:"Twój dziennik",en:"Your journal"},recommendedDeals:{pl:"Polecane oferty",en:"Recommended Deals"},compareStays:{pl:"Porównaj noclegi",en:"Compare Stays"},compareStaysDesc:{pl:"Dodaj linki z Booking.com, Airbnb. Głosuj z grupą!",en:"Add Booking.com, Airbnb links. Vote with your group!"},proposePlac:{pl:"Zaproponuj miejsce",en:"Propose a place"},carRental:{pl:"Wynajem samochodu",en:"Car Rental"},carRentalDesc:{pl:"Porównaj oferty wynajmu aut.",en:"Compare car rental offers."},travelInsurance:{pl:"Ubezpieczenie podróżne",en:"Travel Insurance"},insuranceDesc:{pl:"Wykup ubezpieczenie przed wyjazdem.",en:"Get insurance before your trip."},gettingAround:{pl:"Jak się poruszać",en:"Getting Around"},airportTransfer:{pl:"Transfer z lotniska",en:"Airport Transfer"},localCustoms:{pl:"Lokalne zwyczaje",en:"Local Customs"},travelAdvisory:{pl:"Zalecenia MSZ",en:"Travel Advisory"},requiredDocs:{pl:"Wymagane dokumenty",en:"Required Documents"},myProfile:{pl:"Mój profil",en:"My Profile"},profilePhoto:{pl:"Zdjęcie profilowe",en:"Profile photo"},socialMedia:{pl:"Media społecznościowe",en:"Social media"},travelFriends:{pl:"Znajomi podróżni",en:"Travel Friends"},travelFriendsDesc:{pl:"Osoby, z którymi podróżujesz",en:"People you travel with"},addFriend:{pl:"Dodaj znajomego",en:"Add friend"},noFriendsYet:{pl:"Brak znajomych.",en:"No friends yet."},tripStats:{pl:"Statystyki",en:"Trip Stats"},approveThis:{pl:"Zatwierdzam",en:"Approve"},tripMembers:{pl:"Uczestnicy",en:"Members"},inviteSomeone:{pl:"+ Zaproś",en:"+ Invite"},whereGoing:{pl:"Dokąd jedziesz?",en:"Where to?"},whenWho:{pl:"Kiedy i z kim?",en:"When & who?"},almostThere:{pl:"Prawie gotowe!",en:"Almost there!"},createTrip:{pl:"🚀 Stwórz podróż",en:"🚀 Create Trip"},tripSummary:{pl:"Podsumowanie",en:"Summary"},addDay:{pl:"+ Dodaj dzień",en:"+ Add day"},addActivity:{pl:"+ Dodaj aktywność",en:"+ Add activity"},dayTitle:{pl:"Tytuł dnia",en:"Day title"},activityName:{pl:"Nazwa atrakcji",en:"Activity name"},time:{pl:"Godzina",en:"Time"},duration:{pl:"Czas",en:"Duration"},type:{pl:"Typ",en:"Type"},cost:{pl:"Koszt",en:"Cost"},dragHint:{pl:"Przeciągnij aby zmienić kolejność",en:"Drag to reorder"},aiPlanner:{pl:"Planer AI",en:"AI Planner"},assignTo:{pl:"Przypisz do",en:"Assign to"},unassigned:{pl:"Nieprzypisane",en:"Unassigned"},ticketsNeeded:{pl:"Bilety wymagane",en:"Tickets Required"},ticketsDesc:{pl:"Atrakcje z planu wymagające zakupu biletów",en:"Planned attractions requiring ticket purchase"},addTicketLink:{pl:"Dodaj link do biletu",en:"Add ticket link"},ticketBought:{pl:"Kupiony ✓",en:"Bought ✓"},ticketNeeded:{pl:"Do kupienia",en:"To buy"},stepCounter:{pl:"Licznik kroków",en:"Step Counter"},stepsToday:{pl:"Kroków dziś",en:"Steps today"},syncHealth:{pl:"Synchronizuj z Health",en:"Sync with Health"},allApprovedTitle:{pl:"🎉 Wszyscy mają urlop!",en:"🎉 Everyone's got leave!"},allApprovedMsg:{pl:"Wszystkie wnioski urlopowe zatwierdzone — czas skupić się na planowaniu wymarzonej podróży!",en:"All vacation requests approved — time to focus on planning your dream trip!"},letsGo:{pl:"Do planowania! 🚀",en:"Let's plan! 🚀"},clickToChangePhoto:{pl:"Kliknij, aby zmienić zdjęcie",en:"Click to change photo"},shareTrip:{pl:"Udostępnij",en:"Share"},copyLink:{pl:"Kopiuj link",en:"Copy link"},linkCopied:{pl:"Link skopiowany!",en:"Link copied!"},exportCalendar:{pl:"Eksport do kalendarza",en:"Export to calendar"},publicTrip:{pl:"Publiczna podróż",en:"Public trip"},paidBy:{pl:"Zapłacił",en:"Paid by"},splitAmong:{pl:"Dzielone na",en:"Split among"},everyone:{pl:"Wszystkich",en:"Everyone"},settlements:{pl:"Rozliczenia",en:"Settlements"},owes:{pl:"jest winien",en:"owes"},settled:{pl:"Rozliczono",en:"Settled"},mapNoActivities:{pl:"Dodaj aktywności z lokalizacją, aby zobaczyć mapę",en:"Add activities with locations to see the map"},aiGroupTitle:{pl:"✨ Grupowy konsensus AI",en:"✨ AI Group Consensus"},aiGroupDesc:{pl:"Zbierz preferencje grupy i wygeneruj idealny plan",en:"Collect group preferences and generate the perfect plan"},generatePlan:{pl:"Wygeneruj plan",en:"Generate plan"},preferences:{pl:"Preferencje",en:"Preferences"},pace:{pl:"Tempo",en:"Pace"},interests:{pl:"Zainteresowania",en:"Interests"},budgetRange:{pl:"Zakres budżetu",en:"Budget range"},installApp:{pl:"Zainstaluj aplikację",en:"Install app"},install:{pl:"Instaluj",en:"Install"}};

// ══ Design tokens ══
const C={bg:"#FEFBF6",bgAlt:"#F7F3ED",white:"#FFFFFF",border:"#E8E2D9",borderLight:"#F0EBE3",primary:"#C4704B",primaryLight:"#F9EDE7",primaryDark:"#A85A38",blue:"#2563EB",blueLight:"#EFF6FF",sage:"#5F8B6A",sageLight:"#ECF4EE",coral:"#E8734A",coralLight:"#FEF0EB",gold:"#D4A853",goldLight:"#FDF8EC",purple:"#7C5CFC",purpleLight:"#F3F0FF",text:"#2C1810",textSec:"#6B5B4F",textDim:"#A09486",danger:"#DC3545",shadow:"0 1px 3px rgba(44,24,16,0.06),0 4px 12px rgba(44,24,16,0.04)",shadowMd:"0 2px 8px rgba(44,24,16,0.08),0 8px 24px rgba(44,24,16,0.06)"};
const Fn="'Fraunces',serif";
const fmt=n=>n!=null?n.toLocaleString("en",{maximumFractionDigits:0}):"0";
const CURS=["PLN","EUR","RON","USD","GBP","CZK","JPY","CHF"];
const CAT_I={Accommodation:"🏨",Food:"🍽️",Activities:"🎟️",Shopping:"🛍️",Transport:"🚗",Other:"💰"};
const CAT_C={Accommodation:"#2563EB",Food:"#E8734A",Activities:"#7C5CFC",Shopping:"#D4A853",Transport:"#5F8B6A",Other:"#A09486"};
const tE={sight:"📍",food:"🍽️",museum:"🖼️",shopping:"🛍️",transport:"🚌",activity:"🎯"};
const RATES={"PLN":{"EUR":0.234,"RON":1.17,"USD":0.253,"GBP":0.199,"CZK":5.87,"JPY":38.5,"CHF":0.218},"EUR":{"PLN":4.28,"RON":4.97,"USD":1.08,"GBP":0.855,"CZK":25.1,"JPY":164.5,"CHF":0.935},"USD":{"PLN":3.95,"EUR":0.925,"RON":4.61,"GBP":0.79,"CZK":23.3,"JPY":152.5,"CHF":0.866},"GBP":{"PLN":5.02,"EUR":1.17,"RON":5.83,"USD":1.27,"CZK":29.4,"JPY":193,"CHF":1.10},"JPY":{"PLN":0.026,"EUR":0.00608,"USD":0.00656,"GBP":0.00518,"CHF":0.00569},"CHF":{"PLN":4.58,"EUR":1.07,"USD":1.155,"GBP":0.912,"JPY":176},"RON":{"PLN":0.856,"EUR":0.201,"USD":0.217},"CZK":{"PLN":0.17,"EUR":0.0398,"USD":0.0429}};
const getRate=(f,t)=>{if(f===t)return 1;return RATES[f]?.[t]||1};
const parseDur=s=>{if(!s)return 60;const h=s.match(/(\d+\.?\d*)h/);const m=s.match(/(\d+)min/);return(h?parseFloat(h[1])*60:0)+(m?parseInt(m[1]):0)||60};

// ══ Destination data ══
const DEST_CUR={"Romania":"RON","Japan":"JPY","Portugal":"EUR","Spain":"EUR","Italy":"EUR","France":"EUR","UK":"GBP","USA":"USD","Switzerland":"CHF","Czech":"CZK"};
const getDestCur=d=>{if(!d)return"EUR";for(const[c,cur]of Object.entries(DEST_CUR)){if(d.includes(c))return cur}return"EUR"};

// Destination coordinates for map centering
const DEST_COORDS={"Bucharest":{lat:44.4268,lng:26.1025},"Romania":{lat:44.4268,lng:26.1025},"Tokyo":{lat:35.6762,lng:139.6503},"Japan":{lat:35.6762,lng:139.6503},"Lisbon":{lat:38.7223,lng:-9.1393},"Portugal":{lat:38.7223,lng:-9.1393},"Barcelona":{lat:41.3874,lng:2.1686},"Paris":{lat:48.8566,lng:2.3522},"Rome":{lat:41.9028,lng:12.4964},"London":{lat:51.5074,lng:-0.1278},"Prague":{lat:50.0755,lng:14.4378},"Berlin":{lat:52.5200,lng:13.4050},"Amsterdam":{lat:52.3676,lng:4.9041},"Vienna":{lat:48.2082,lng:16.3738},"Kraków":{lat:50.0647,lng:19.9450},"Warsaw":{lat:52.2297,lng:21.0122},"Gdańsk":{lat:54.3520,lng:18.6466}};
const getDestCoords=d=>{if(!d)return{lat:48.8,lng:2.3};for(const[k,v]of Object.entries(DEST_COORDS)){if(d.includes(k))return v}return{lat:48.8,lng:2.3}};


// ══ Transport & local data ══
const TRANSPORT={
"Bucharest":{rec:["metro","bus","taxi"],info:{pl:"Metro szybkie i tanie (M1-M5). Bolt/Uber najtańsze.",en:"Metro fast & cheap (M1-M5). Bolt/Uber cheapest."},modes:{bus:{r:3,n:{pl:"Sieć STB, bilety w kiosku/app",en:"STB network, tickets at kiosks/app"}},metro:{r:4,n:{pl:"Szybkie, czyste, 5 linii, ~3 RON",en:"Fast, clean, 5 lines, ~3 RON"}},taxi:{r:4,n:{pl:"Bolt/Uber taniej niż trad.",en:"Bolt/Uber cheaper than traditional"}},walk:{r:3,n:{pl:"Centrum OK pieszo",en:"Center OK on foot"}}},airport:{pl:"Henri Coandă → centrum: Bus 783 (~4 RON), Bolt (~60 RON).",en:"Henri Coandă → center: Bus 783 (~4 RON), Bolt (~60 RON)."}},
"Tokyo":{rec:["metro","train","walk"],info:{pl:"Tokio ma najlepszy transport publiczny na świecie.",en:"Tokyo has the world's best public transport."},modes:{metro:{r:5,n:{pl:"Suica/Pasmo, 13 linii metra",en:"Suica/Pasmo card, 13 metro lines"}},train:{r:5,n:{pl:"JR, Shinkansen, podmiejskie",en:"JR, Shinkansen, suburban"}},bus:{r:3,n:{pl:"Uzupełnienie metra",en:"Supplements metro"}},walk:{r:4,n:{pl:"Dzielnice kompaktowe",en:"Districts are walkable"}}},airport:{pl:"Narita/Haneda → centrum: Narita Express (~3000¥), Limousine Bus (~1000¥).",en:"Narita/Haneda → center: Narita Express (~3000¥), Limousine Bus (~1000¥)."}},
"Lisbon":{rec:["metro","tram","walk"],info:{pl:"Lizbona kompaktowa, tramwaj 28 kultowy.",en:"Lisbon compact, Tram 28 iconic."},modes:{metro:{r:4,n:{pl:"4 linie, szybkie, ~1.5€",en:"4 lines, fast, ~1.5€"}},tram:{r:4,n:{pl:"Tramwaj 28 — must-do",en:"Tram 28 — must-do"}},walk:{r:3,n:{pl:"Pagórkowate, wygodne buty!",en:"Hilly, wear comfy shoes!"}},taxi:{r:4,n:{pl:"Bolt/Uber popularne, tanie",en:"Bolt/Uber popular, cheap"}}},airport:{pl:"Aeroporto → centrum: Metro czerwona (~1.5€, 25 min), Uber (~10€).",en:"Airport → center: Metro red line (~1.5€, 25 min), Uber (~10€)."}}
};

const CUSTOMS={
"Romania":[{icon:"🍷",t:{pl:"Rum. gościnność — nie odmawiaj jedzenia/picia",en:"Romanian hospitality — don't refuse food/drink"}},{icon:"🤝",t:{pl:"Uścisk dłoni na powitanie",en:"Handshake greeting"}},{icon:"💰",t:{pl:"Napiwki 10% w restauracjach",en:"Tips 10% in restaurants"}}],
"Japan":[{icon:"🙇",t:{pl:"Ukłon zamiast uścisku dłoni",en:"Bow instead of handshake"}},{icon:"🚫",t:{pl:"Nie dawaj napiwków — to niegrzeczne",en:"No tipping — it's considered rude"}},{icon:"👟",t:{pl:"Zdejmuj buty w domach i świątyniach",en:"Remove shoes in homes and temples"}},{icon:"🔇",t:{pl:"Cisza w transporcie publicznym",en:"Quiet on public transport"}}],
"Portugal":[{icon:"☕",t:{pl:"Kawa = espresso (bica w Lizbonie)",en:"Coffee = espresso (bica in Lisbon)"}},{icon:"🐟",t:{pl:"Bacalhau — narodowe danie, 365 przepisów",en:"Bacalhau — national dish, 365 recipes"}},{icon:"🕐",t:{pl:"Kolacja po 20:00, nie spiesz się",en:"Dinner after 8pm, take your time"}}]
};

const ADVISORY={
"Romania":{level:{pl:"Normalne środki ostrożności",en:"Normal precautions"},color:C.sage,info:{pl:"Rumunia bezpieczna dla turystów. Uważaj na kieszonkowców w Bukareszcie.",en:"Romania safe for tourists. Watch for pickpockets in Bucharest."},docs:[{t:{pl:"Dowód osobisty / paszport (UE)",en:"ID card / passport (EU)"},req:true},{t:{pl:"EKUZ / ubezpieczenie zdrowotne",en:"EHIC / health insurance"},req:true}]},
"Japan":{level:{pl:"Normalne środki ostrożności",en:"Normal precautions"},color:C.sage,info:{pl:"Japonia jedno z najbezpieczniejszych państw świata.",en:"Japan one of the safest countries in the world."},docs:[{t:{pl:"Paszport (wiza nie wymagana do 90 dni dla UE)",en:"Passport (visa not required up to 90 days for EU)"},req:true},{t:{pl:"Visit Japan Web — rejestracja przed wjazdem",en:"Visit Japan Web — register before entry"},req:true}]},
"Portugal":{level:{pl:"Normalne środki ostrożności",en:"Normal precautions"},color:C.sage,info:{pl:"Portugalia bardzo bezpieczna. Uważaj na drobne kradzieże w Lizbonie.",en:"Portugal very safe. Watch for petty theft in Lisbon."},docs:[{t:{pl:"Dowód osobisty (UE) lub paszport",en:"ID card (EU) or passport"},req:true}]}
};

// ══ Demo photo URLs ══
const DEST_PHOTOS={"Romania, Bucharest":["https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800","https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=800"],"Japan, Tokyo":["https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800","https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800"],"Portugal, Lisbon":["https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800","https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800"]};
const INSP=[{name:"Lisbon",img:"https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400"},{name:"Tokyo",img:"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400"},{name:"Barcelona",img:"https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400"},{name:"Prague",img:"https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=400"},{name:"Rome",img:"https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400"}];

const ROLES={admin:{l:{pl:"Admin",en:"Admin"},color:"#C4704B"},user:{l:{pl:"Użytkownik",en:"User"},color:"#2563EB"},companion:{l:{pl:"Towarzysz",en:"Companion"},color:"#5F8B6A"},observer:{l:{pl:"Obserwator",en:"Observer"},color:"#A09486"}};

// ══ Demo users ══
const USERS_INIT=[
{id:"u1",name:"Bartek",email:"bartek@ventura.app",role:"admin",color:"#C4704B",photoUrl:"",social:{instagram:"@bartek_travels"},friends:["u2"],prefs:{currency:"PLN"}},
{id:"u2",name:"Emilia",email:"emilia@ventura.app",role:"companion",color:"#5F8B6A",photoUrl:"",social:{instagram:"@emilia_adventures"},friends:["u1"],prefs:{currency:"PLN"}},
{id:"u3",name:"Tomek",email:"tomek@ventura.app",role:"user",color:"#2563EB",photoUrl:"",social:{},friends:[],prefs:{currency:"PLN"}},
{id:"u4",name:"Kasia",email:"kasia@ventura.app",role:"observer",color:"#7C5CFC",photoUrl:"",social:{},friends:[],prefs:{currency:"EUR"}}
];

// ══ Demo trips with coordinates ══
const INIT_TRIPS=[{
id:"t1",name:"Romania Discovery",dest:"Romania, Bucharest",dates:"2025-06-15 – 2025-06-19",travelers:["u1","u2"],observers:["u4"],days:4,status:"upcoming",currency:"RON",vacStatus:{u1:"approved",u2:"approved"},heroImg:"https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800",budget:{total:4000},completeness:72,
journal:[{id:"j1",date:"2025-05-10",author:"u1",type:"text",content:"Znalazłem świetne loty LOT za 450 PLN RT! 🎉"}],
memories:null,
dayData:[
{day:1,date:"2025-06-15",title:"Old Town & Parliament",img:"https://images.unsplash.com/photo-1584646098378-0874589d76b1?w=800",weather:{icon:"sun",hi:28,lo:17},
steps:{u1:18420,u2:17850},
items:[
{id:"a1",time:"09:00",name:"Piata Revolutiei",desc:"Historical square",type:"sight",duration:"1.5h",cost:0,rating:4.5,votes:{u1:1,u2:1},fav:{u1:true},status:"approved",lat:44.4397,lng:26.0963},
{id:"a2",time:"11:00",name:"National Art Museum",desc:"Romanian art collection",type:"museum",duration:"2h",cost:30,rating:4.7,votes:{u1:1,u2:1},fav:{},status:"approved",ticketBought:true,ticketUrl:"https://mfrn.ro/en/tickets",lat:44.4394,lng:26.0964},
{id:"a3",time:"13:30",name:"Caru' cu Bere",desc:"Iconic Bucharest restaurant since 1879",type:"food",duration:"1.5h",cost:120,rating:4.6,votes:{u1:1,u2:1},fav:{u1:true,u2:true},status:"approved",lat:44.4316,lng:26.1018},
{id:"a4",time:"15:30",name:"Palace of the Parliament",desc:"2nd largest building in the world",type:"sight",duration:"2h",cost:50,rating:4.8,votes:{u1:1,u2:1},fav:{u2:true},status:"approved",ticketBought:false,ticketUrl:"",lat:44.4275,lng:26.0877}
]},
{day:2,date:"2025-06-16",title:"Parks & Culture",weather:{icon:"cloud-sun",hi:26,lo:16},steps:{u1:22100,u2:21800},
items:[
{id:"a5",time:"09:30",name:"Herastrau Park",desc:"Beautiful lakeside park",type:"activity",duration:"2h",cost:0,rating:4.5,votes:{u1:1,u2:1},fav:{},status:"approved",lat:44.4711,lng:26.0802},
{id:"a6",time:"12:00",name:"Village Museum",desc:"Open-air ethnographic museum",type:"museum",duration:"2h",cost:25,rating:4.7,votes:{u1:1},fav:{u1:true},status:"approved",lat:44.4725,lng:26.0764},
{id:"a7",time:"14:30",name:"Obor Market",desc:"Authentic local market experience",type:"shopping",duration:"1h",cost:50,rating:4.2,votes:{u1:1,u2:1},fav:{},status:"approved",lat:44.4489,lng:26.1278},
{id:"a8",time:"17:00",name:"Ateneul Roman",desc:"Romanian Athenaeum concert",type:"activity",duration:"2h",cost:80,rating:4.9,votes:{u1:1},fav:{u2:true},status:"pending",ticketBought:false,lat:44.4413,lng:26.0972}
]},
{day:3,date:"2025-06-17",title:"Castles & Mountains",weather:{icon:"sun",hi:24,lo:14},steps:{u1:14200,u2:13900},
items:[
{id:"a9",time:"07:00",name:"Drive to Sinaia",desc:"2h drive through Prahova Valley",type:"transport",duration:"2h",cost:0,rating:0,votes:{u1:1,u2:1},fav:{},status:"approved",lat:45.3517,lng:25.5514},
{id:"a10",time:"09:30",name:"Castelul Peles",desc:"Stunning Neo-Renaissance castle",type:"sight",duration:"2.5h",cost:50,rating:4.9,votes:{u1:1,u2:1},fav:{u1:true,u2:true},status:"approved",ticketBought:true,ticketUrl:"https://peles.ro",lat:45.3600,lng:25.5425},
{id:"a11",time:"13:00",name:"Lunch in Sinaia",desc:"Mountain cuisine",type:"food",duration:"1.5h",cost:100,rating:0,votes:{u1:1,u2:1},fav:{},status:"approved",lat:45.3487,lng:25.5500}
]}],
expenses:[
{id:"e1",name:"LOT flights x2",cat:"Transport",amount:900,currency:"PLN",payer:"u1",date:"2025-05-08"},
{id:"e2",name:"Airbnb Old Town 4 nights",cat:"Accommodation",amount:1200,currency:"RON",payer:"u2",date:"2025-05-15"},
{id:"e3",name:"Caru cu Bere lunch",cat:"Food",amount:240,currency:"RON",payer:"u1",date:"2025-06-15"},
{id:"e4",name:"Museum tickets x2",cat:"Activities",amount:60,currency:"RON",payer:"u2",date:"2025-06-15"},
{id:"e5",name:"Bolt rides Day 1",cat:"Transport",amount:45,currency:"RON",payer:"u1",date:"2025-06-15"}
],
packing:{
"Clothes":[{item:"T-shirts x4",qty:1,packed:true,assignedTo:"u1"},{item:"Shorts x3",qty:1,packed:true,assignedTo:"u1"},{item:"Dress x2",qty:1,packed:false,assignedTo:"u2"},{item:"Walking shoes",qty:1,packed:true,assignedTo:null}],
"Tech":[{item:"Charger USB-C",qty:1,packed:true,assignedTo:null},{item:"Power bank",qty:1,packed:false,assignedTo:"u1"},{item:"Camera + lens",qty:1,packed:false,assignedTo:"u2"}],
"Docs":[{item:"Passport",qty:2,packed:true,assignedTo:null},{item:"Travel insurance",qty:1,packed:false,assignedTo:"u1"},{item:"EHIC cards",qty:2,packed:true,assignedTo:null}]
},
deals:[{name:"Bucharest City Card",partner:"GetYourGuide",price:"€29",url:"https://getyourguide.com",pColor:"#FF5533"},{name:"Peles Castle Skip-the-line",partner:"Viator",price:"€15",url:"https://viator.com",pColor:"#00AA6C"}],
comparisons:[
{id:"c1",name:"Old Town Apartment",url:"https://airbnb.com/demo",source:"Airbnb",price:"300 RON/night",rating:4.8,notes:"Central, 2BR, balcony",pros:["Central","Kitchen","Balcony"],cons:["No parking","5th floor no lift"],proposedBy:"u1",votes:{u1:1,u2:1}},
{id:"c2",name:"Hotel Novotel Centre",url:"https://booking.com/demo",source:"Booking.com",price:"420 RON/night",rating:4.3,notes:"Business hotel, good breakfast",pros:["Breakfast included","Parking","Gym"],cons:["Pricey","Generic"],proposedBy:"u2",votes:{u2:1}}
],
planningTips:[{icon:"🏨",title:{pl:"Nocleg",en:"Accommodation"},desc:{pl:"Airbnb zarezerwowany!",en:"Airbnb booked!"},done:true,priority:"high"},{icon:"✈️",title:{pl:"Loty",en:"Flights"},desc:{pl:"LOT 450 PLN RT",en:"LOT 450 PLN RT"},done:true,priority:"high"},{icon:"🗺️",title:{pl:"Plan dnia",en:"Itinerary"},desc:{pl:"3 dni zaplanowane",en:"3 days planned"},done:true,priority:"medium"},{icon:"🎒",title:{pl:"Pakowanie",en:"Packing"},desc:{pl:"Lista w trakcie",en:"List in progress"},done:false,priority:"low"}]
},{
id:"t2",name:"Sakura Season",dest:"Japan, Tokyo",dates:"2025-03-28 – 2025-04-04",travelers:["u1","u2","u3"],observers:[],days:7,status:"planning",currency:"JPY",vacStatus:{u1:"applied",u2:"not_applied",u3:"approved"},heroImg:"",budget:{total:500000},completeness:25,
journal:[],memories:null,dayData:[],expenses:[],
packing:{},deals:[],comparisons:[],
planningTips:[{icon:"🏨",title:{pl:"Nocleg",en:"Accommodation"},desc:{pl:"Szukaj w Shinjuku/Shibuya",en:"Search in Shinjuku/Shibuya"},done:false,priority:"high"},{icon:"✈️",title:{pl:"Loty",en:"Flights"},desc:{pl:"Porównaj LOT vs ANA",en:"Compare LOT vs ANA"},done:false,priority:"high"},{icon:"🗺️",title:{pl:"Plan dnia",en:"Itinerary"},desc:{pl:"7 dni do zaplanowania",en:"7 days to plan"},done:false,priority:"medium"},{icon:"🎒",title:{pl:"Lista pakowania",en:"Packing list"},desc:{pl:"Użyj szablonu",en:"Use template"},done:false,priority:"low"}]
}];

// ══ Packing templates & suggestions ══
const PACK_TPL=[
{id:"summer",icon:"☀️",name:{pl:"Lato",en:"Summer"},items:{"Clothes":[{item:"T-shirts x5",qty:1},{item:"Shorts x3",qty:1},{item:"Swimsuit",qty:1},{item:"Sunglasses",qty:1},{item:"Hat",qty:1}],"Hygiene":[{item:"Sunscreen SPF50",qty:1},{item:"Toothbrush",qty:1},{item:"Deodorant",qty:1}]}},
{id:"winter",icon:"❄️",name:{pl:"Zima",en:"Winter"},items:{"Clothes":[{item:"Warm jacket",qty:1},{item:"Thermal layers x3",qty:1},{item:"Scarf + gloves",qty:1},{item:"Warm boots",qty:1}],"Hygiene":[{item:"Lip balm",qty:1},{item:"Hand cream",qty:1}]}},
{id:"business",icon:"💼",name:{pl:"Służbowy",en:"Business"},items:{"Clothes":[{item:"Suits x2",qty:1},{item:"Dress shirts x3",qty:1},{item:"Dress shoes",qty:1},{item:"Tie",qty:1}],"Tech":[{item:"Laptop + charger",qty:1},{item:"Presentation remote",qty:1}]}},
{id:"backpack",icon:"🎒",name:{pl:"Plecak",en:"Backpack"},items:{"Gear":[{item:"Backpack 40L",qty:1},{item:"Rain cover",qty:1},{item:"Quick-dry towel",qty:1},{item:"Headlamp",qty:1}],"Clothes":[{item:"Merino t-shirts x3",qty:1},{item:"Hiking pants x2",qty:1},{item:"Trail shoes",qty:1}]}}
];
const AI_SUGG=["Universal adapter","Reusable water bottle","Packing cubes","First aid kit","Portable charger","Neck pillow","Earplugs","Eye mask","Zip-lock bags","Snacks"];
const DONT_FORGET={pl:["📱 Ładowarka i power bank","💊 Leki (jeśli potrzebujesz)","📋 Kopie dokumentów (cyfrowe)","💳 Powiadom bank o podróży","🔑 Klucze u zaufanej osoby"],en:["📱 Charger and power bank","💊 Medications (if needed)","📋 Document copies (digital)","💳 Notify bank of travel","🔑 Keys with trusted person"]};

// ═══════════════ UI COMPONENTS ═══════════════
const WI=({t})=>{const m={sun:"☀️","cloud-sun":"⛅",cloud:"☁️",rain:"🌧️",snow:"❄️"};return<span>{m[t]||"🌤️"}</span>};
const Pill=({children,active,onClick,small})=><button onClick={onClick} style={{padding:small?"4px 10px":"8px 16px",borderRadius:99,fontSize:small?11:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",border:`1.5px solid ${active?C.primary:C.border}`,background:active?C.primaryLight:"transparent",color:active?C.primary:C.textSec,transition:"all 0.2s"}}>{children}</button>;
const Card=({children,style:sx,onClick,hover=true,...rest})=><div onClick={onClick} {...rest} style={{background:C.white,borderRadius:16,border:`1px solid ${C.borderLight}`,boxShadow:C.shadow,transition:"all 0.2s",cursor:onClick?"pointer":"default",...sx}} onMouseEnter={e=>{if(hover&&onClick){e.currentTarget.style.boxShadow=C.shadowMd;e.currentTarget.style.transform="translateY(-1px)"}}} onMouseLeave={e=>{if(hover&&onClick){e.currentTarget.style.boxShadow=C.shadow;e.currentTarget.style.transform="translateY(0)"}}}>{children}</div>;
const Bar=({v,mx,color=C.primary,h=6})=><div style={{width:"100%",height:h,background:C.bgAlt,borderRadius:h,overflow:"hidden"}}><div style={{width:`${Math.min(v/mx*100,100)}%`,height:h,borderRadius:h,background:v>mx?C.danger:color,transition:"width 0.6s"}}/></div>;
const Av=({user,size=32,onClick})=>{const s={width:size,height:size,borderRadius:"50%",objectFit:"cover",flexShrink:0,cursor:onClick?"pointer":"default"};if(user?.photoUrl)return<img src={user.photoUrl} alt="" onClick={onClick} style={{...s,border:`2px solid ${user.color||C.border}`}}/>;return<div onClick={onClick} style={{...s,background:user?.color||C.textDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.4,fontWeight:700,color:"#fff"}}>{(user?.name||"?")[0]}</div>};
const Img=({src,alt,style:sx})=>{const[e,sE]=useState(false);if(e)return<div style={{...sx,background:`linear-gradient(135deg,${C.primaryLight},${C.blueLight})`,display:"flex",alignItems:"center",justifyContent:"center",color:C.textDim}}>🗺️</div>;return<img src={src} alt={alt||""} style={{objectFit:"cover",display:"block",...sx}} onError={()=>sE(true)}/>};
const Modal=({open,onClose,title,children,wide})=>{if(!open)return null;return(<div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}><div style={{position:"absolute",inset:0,background:"rgba(44,24,16,0.4)",backdropFilter:"blur(4px)"}}/><div onClick={e=>e.stopPropagation()} style={{position:"relative",background:C.white,borderRadius:20,boxShadow:C.shadowMd,width:"100%",maxWidth:wide?600:480,maxHeight:"85vh",overflow:"auto",animation:"fadeUp 0.25s ease"}}><div style={{padding:"16px 20px",borderBottom:`1px solid ${C.borderLight}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:C.white,zIndex:1,borderRadius:"20px 20px 0 0"}}><span style={{fontSize:16,fontWeight:700,fontFamily:Fn}}>{title}</span><button onClick={onClose} style={{width:28,height:28,borderRadius:8,background:C.bgAlt,border:"none",cursor:"pointer",fontSize:14,color:C.textDim}}>✕</button></div><div style={{padding:20}}>{children}</div></div></div>)};
const Pie=({data,size=140,currency})=>{let tot=data.reduce((s,d)=>s+d.value,0);if(!tot)return null;let cum=0;const sl=data.map(d=>{const st=cum/tot*360;cum+=d.value;return{...d,st,en:cum/tot*360}});const xy=(a,r)=>({x:50+r*Math.cos((a-90)*Math.PI/180),y:50+r*Math.sin((a-90)*Math.PI/180)});return(<svg viewBox="0 0 100 100" width={size} height={size}>{sl.map((s,i)=>{const lg=(s.en-s.st)>180?1:0;const p1=xy(s.st,42),p2=xy(s.en,42);if(s.en-s.st>=359.9)return<circle key={i} cx="50" cy="50" r="42" fill={s.color}/>;return<path key={i} d={`M50,50 L${p1.x},${p1.y} A42,42 0 ${lg},1 ${p2.x},${p2.y} Z`} fill={s.color}/>})}<circle cx="50" cy="50" r="26" fill={C.white}/><text x="50" y="47" textAnchor="middle" fontSize="8" fontWeight="800" fill={C.text}>{fmt(tot)}</text><text x="50" y="56" textAnchor="middle" fontSize="5" fill={C.textDim}>{currency}</text></svg>)};
const PhotoSlider=({dest})=>{const photos=DEST_PHOTOS[dest]||[];const[idx,setIdx]=useState(0);useEffect(()=>{if(photos.length<2)return;const i=setInterval(()=>setIdx(p=>(p+1)%photos.length),4500);return()=>clearInterval(i)},[photos.length]);if(!photos.length)return<div style={{height:150,background:`linear-gradient(135deg,${C.primaryLight},${C.blueLight})`,borderRadius:"0 0 16px 16px"}}/>;return(<div style={{position:"relative",height:150,overflow:"hidden",borderRadius:"0 0 16px 16px"}}>{photos.map((p,i)=><img key={i} src={p} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transition:"opacity 0.8s",opacity:i===idx?1:0}}/>)}<div style={{position:"absolute",inset:0,background:"linear-gradient(0deg,rgba(44,24,16,0.5) 0%,transparent 50%)"}}/><div style={{position:"absolute",bottom:8,left:0,right:0,display:"flex",justifyContent:"center",gap:5}}>{photos.map((_,i)=><div key={i} onClick={e=>{e.stopPropagation();setIdx(i)}} style={{width:i===idx?16:6,height:6,borderRadius:3,background:i===idx?"#fff":"rgba(255,255,255,0.5)",transition:"all 0.3s",cursor:"pointer"}}/>)}</div></div>)};

// ═══════════════ MAP COMPONENT ═══════════════
const TripMap=({trip,lang,getU})=>{
  const mapRef=useRef(null);
  const mapInstance=useRef(null);
  const markersRef=useRef([]);
  const allItems=(trip?.dayData||[]).flatMap((d,dI)=>d.items.filter(it=>it.lat&&it.lng).map(it=>({...it,dayNum:d.day,dayTitle:d.title,dayColor:["#C4704B","#2563EB","#5F8B6A","#7C5CFC","#D4A853","#E8734A","#FF6B9D"][dI%7]})));
  
  useEffect(()=>{
    if(!mapRef.current||allItems.length===0)return;
    let map=mapInstance.current;
    const center=getDestCoords(trip.dest);
    
    const initMap=async()=>{
      try{
        const mgl=await import("maplibre-gl");
        if(mapInstance.current){mapInstance.current.remove();mapInstance.current=null}
        map=new mgl.Map({
          container:mapRef.current,
          style:"https://tiles.openfreemap.org/styles/liberty",
          center:[center.lng,center.lat],
          zoom:12,
          attributionControl:false
        });
        map.addControl(new mgl.NavigationControl(),"top-right");
        map.addControl(new mgl.AttributionControl({compact:true}));
        
        map.on("load",()=>{
          // Clear old markers
          markersRef.current.forEach(m=>m.remove());
          markersRef.current=[];
          
          // Add markers for each activity
          allItems.forEach((it,i)=>{
            const el=document.createElement("div");
            el.innerHTML=`<div style="width:28px;height:28px;border-radius:50%;background:${it.dayColor};border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:12px;cursor:pointer" title="${it.name}">${tE[it.type]||"📍"}</div>`;
            const popup=new mgl.Popup({offset:20}).setHTML(
              `<div style="font-family:'Nunito Sans',sans-serif;padding:4px"><strong style="font-size:13px">${it.name}</strong><br/><span style="font-size:11px;color:#6B5B4F">${lang==="pl"?"Dzień":"Day"} ${it.dayNum} · ${it.time||""} · ${it.cost>0?it.cost+" "+trip.currency:lang==="pl"?"Bezpłatne":"Free"}</span></div>`
            );
            const marker=new mgl.Marker({element:el}).setLngLat([it.lng,it.lat]).setPopup(popup).addTo(map);
            markersRef.current.push(marker);
          });
          
          // Draw route lines per day
          const dayGroups={};
          allItems.forEach(it=>{if(!dayGroups[it.dayNum])dayGroups[it.dayNum]=[];dayGroups[it.dayNum].push([it.lng,it.lat])});
          Object.entries(dayGroups).forEach(([day,coords])=>{
            if(coords.length<2)return;
            const srcId=`route-${day}`;
            const color=allItems.find(it=>it.dayNum===parseInt(day))?.dayColor||C.primary;
            if(map.getSource(srcId))return;
            map.addSource(srcId,{type:"geojson",data:{type:"Feature",geometry:{type:"LineString",coordinates:coords}}});
            map.addLayer({id:srcId,type:"line",source:srcId,paint:{"line-color":color,"line-width":3,"line-opacity":0.6,"line-dasharray":[2,2]}});
          });
          
          // Fit bounds
          if(allItems.length>1){
            const bounds=allItems.reduce((b,it)=>{b[0][0]=Math.min(b[0][0],it.lng);b[0][1]=Math.min(b[0][1],it.lat);b[1][0]=Math.max(b[1][0],it.lng);b[1][1]=Math.max(b[1][1],it.lat);return b},[[Infinity,Infinity],[-Infinity,-Infinity]]);
            map.fitBounds(bounds,{padding:50,maxZoom:14});
          }
        });
        mapInstance.current=map;
      }catch(err){console.warn("MapLibre not available:",err)}
    };
    initMap();
    return()=>{mapInstance.current?.remove();mapInstance.current=null;markersRef.current=[]};
  },[trip?.id,allItems.length]);

  if(allItems.length===0)return(
    <Card style={{padding:32,textAlign:"center"}} hover={false}>
      <div style={{fontSize:40,marginBottom:12}}>🗺️</div>
      <div style={{fontFamily:Fn,fontWeight:700,marginBottom:4}}>{lang==="pl"?"Mapa podróży":"Trip Map"}</div>
      <p style={{fontSize:12,color:C.textDim}}>{T.mapNoActivities[lang]}</p>
    </Card>
  );

  return(
    <div>
      <div ref={mapRef} style={{width:"100%",height:350,borderRadius:16,overflow:"hidden",border:`1px solid ${C.borderLight}`,boxShadow:C.shadow}}/>
      <div style={{marginTop:12,display:"flex",gap:6,flexWrap:"wrap"}}>
        {[...new Set(allItems.map(it=>it.dayNum))].map(day=>{
          const color=allItems.find(it=>it.dayNum===day)?.dayColor;
          return<span key={day} style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:99,background:`${color}20`,color,border:`1px solid ${color}40`}}>{lang==="pl"?"Dzień":"Day"} {day}</span>
        })}
      </div>
      <div style={{marginTop:10}}>
        {allItems.map((it,i)=>(
          <div key={it.id||i} style={{padding:"6px 0",display:"flex",alignItems:"center",gap:8,borderBottom:`1px solid ${C.borderLight}`}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:it.dayColor,flexShrink:0}}/>
            <span style={{fontSize:12}}>{tE[it.type]}</span>
            <span style={{fontSize:12,fontWeight:600,flex:1}}>{it.name}</span>
            <span style={{fontSize:10,color:C.textDim}}>{lang==="pl"?"Dz":"D"}{it.dayNum} · {it.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════ EXPENSE SPLITTING ═══════════════
const calcSettlements=(expenses,travelers,getU)=>{
  if(!expenses?.length||!travelers?.length)return[];
  const n=travelers.length;
  const balance={};
  travelers.forEach(uid=>{balance[uid]=0});
  
  expenses.forEach(e=>{
    const splitN=e.splitAmong?.length>0?e.splitAmong.length:n;
    const splitUsers=e.splitAmong?.length>0?e.splitAmong:travelers;
    const share=e.amount/splitN;
    if(balance[e.payer]!==undefined)balance[e.payer]+=e.amount;
    splitUsers.forEach(uid=>{if(balance[uid]!==undefined)balance[uid]-=share});
  });
  
  // Simplify debts
  const debtors=[];const creditors=[];
  travelers.forEach(uid=>{
    if(balance[uid]<-0.01)debtors.push({uid,amount:-balance[uid]});
    else if(balance[uid]>0.01)creditors.push({uid,amount:balance[uid]});
  });
  
  debtors.sort((a,b)=>b.amount-a.amount);
  creditors.sort((a,b)=>b.amount-a.amount);
  
  const settlements=[];
  let di=0,ci=0;
  while(di<debtors.length&&ci<creditors.length){
    const amt=Math.min(debtors[di].amount,creditors[ci].amount);
    if(amt>0.01){
      settlements.push({from:debtors[di].uid,to:creditors[ci].uid,amount:Math.round(amt*100)/100});
    }
    debtors[di].amount-=amt;
    creditors[ci].amount-=amt;
    if(debtors[di].amount<0.01)di++;
    if(creditors[ci].amount<0.01)ci++;
  }
  return settlements;
};

// ═══════════════ AI GROUP CONSENSUS ═══════════════
const AIConsensus=({trip,lang,travelers,getU,onGenerate})=>{
  const[prefs,setPrefs]=useState({});
  const[generating,setGen]=useState(false);
  const[result,setResult]=useState(null);
  const paceOpts=[{id:"relaxed",e:"🐢",l:{pl:"Spokojne",en:"Relaxed"}},{id:"moderate",e:"⚖️",l:{pl:"Umiarkowane",en:"Moderate"}},{id:"intense",e:"🔥",l:{pl:"Intensywne",en:"Intense"}}];
  const interestOpts=[{id:"culture",e:"🏛️",l:{pl:"Kultura",en:"Culture"}},{id:"food",e:"🍽️",l:{pl:"Jedzenie",en:"Food"}},{id:"nature",e:"🌿",l:{pl:"Natura",en:"Nature"}},{id:"shopping",e:"🛍️",l:{pl:"Zakupy",en:"Shopping"}},{id:"nightlife",e:"🌙",l:{pl:"Nocne życie",en:"Nightlife"}},{id:"adventure",e:"🏔️",l:{pl:"Przygoda",en:"Adventure"}}];
  const budgetOpts=[{id:"budget",e:"💰",l:{pl:"Budżetowo",en:"Budget"}},{id:"mid",e:"💳",l:{pl:"Średnio",en:"Mid-range"}},{id:"luxury",e:"💎",l:{pl:"Luksus",en:"Luxury"}}];
  const setPref=(uid,key,val)=>setPrefs(p=>({...p,[uid]:{...p[uid],[key]:val}}));
  const toggleInterest=(uid,int)=>setPrefs(p=>{const cur=p[uid]?.interests||[];return{...p,[uid]:{...p[uid],interests:cur.includes(int)?cur.filter(x=>x!==int):[...cur,int]}}});
  const generate=()=>{
    setGen(true);
    setTimeout(()=>{
      const allInterests={};
      Object.values(prefs).forEach(p=>(p.interests||[]).forEach(i=>{allInterests[i]=(allInterests[i]||0)+1}));
      const topInterests=Object.entries(allInterests).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k])=>k);
      const paces=Object.values(prefs).map(p=>p.pace).filter(Boolean);
      const avgPace=paces.includes("relaxed")&&paces.includes("intense")?"moderate":paces[0]||"moderate";
      const suggestions=[
        {time:"09:00",name:topInterests.includes("culture")?`${trip.dest?.split(",")[0]} ${lang==="pl"?"główne muzeum":"main museum"}`:`${lang==="pl"?"Poranny spacer":"Morning walk"}`,type:topInterests.includes("culture")?"museum":"activity",duration:avgPace==="relaxed"?"2.5h":"1.5h",cost:topInterests.includes("culture")?30:0},
        {time:"12:00",name:lang==="pl"?"Lunch w lokalnym stylu":"Local-style lunch",type:"food",duration:"1.5h",cost:topInterests.includes("food")?80:40},
        {time:"14:00",name:topInterests.includes("nature")?`${lang==="pl"?"Park / ogrody":"Park / gardens"}`:`${lang==="pl"?"Zwiedzanie okolicy":"Explore the area"}`,type:topInterests.includes("nature")?"activity":"sight",duration:"2h",cost:0},
        {time:"17:00",name:topInterests.includes("shopping")?`${lang==="pl"?"Lokalne sklepy i targi":"Local shops & markets"}`:`${lang==="pl"?"Kawa i odpoczynek":"Coffee break"}`,type:topInterests.includes("shopping")?"shopping":"food",duration:"1.5h",cost:topInterests.includes("shopping")?100:20},
        {time:"19:30",name:lang==="pl"?"Kolacja — miejsce rekomendowane AI":"Dinner — AI recommended spot",type:"food",duration:"2h",cost:120}
      ];
      setResult({consensus:{pace:avgPace,topInterests,note:lang==="pl"?`Plan zoptymalizowany dla ${travelers.length} osób. Tempo: ${avgPace}. Główne zainteresowania: ${topInterests.join(", ")}.`:`Plan optimized for ${travelers.length} people. Pace: ${avgPace}. Top interests: ${topInterests.join(", ")}.`},suggestions});
      setGen(false);
    },2000);
  };
  return(
    <div>
      <Card style={{padding:20,marginBottom:14,background:`linear-gradient(135deg,${C.purpleLight},${C.white})`}} hover={false}>
        <div style={{fontSize:18,fontWeight:800,fontFamily:Fn,marginBottom:4}}>{T.aiGroupTitle[lang]}</div>
        <p style={{fontSize:12,color:C.textSec}}>{T.aiGroupDesc[lang]}</p>
      </Card>
      {travelers.map(uid=>{const u=getU(uid);const up=prefs[uid]||{};return(
        <Card key={uid} style={{padding:16,marginBottom:10}} hover={false}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}><Av user={u} size={28}/><span style={{fontSize:13,fontWeight:700}}>{u.name}</span></div>
          <div style={{fontSize:11,fontWeight:600,color:C.textDim,marginBottom:6}}>{T.pace[lang]}</div>
          <div style={{display:"flex",gap:6,marginBottom:12}}>{paceOpts.map(o=><Pill key={o.id} small active={up.pace===o.id} onClick={()=>setPref(uid,"pace",o.id)}>{o.e} {o.l[lang]}</Pill>)}</div>
          <div style={{fontSize:11,fontWeight:600,color:C.textDim,marginBottom:6}}>{T.interests[lang]}</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>{interestOpts.map(o=><Pill key={o.id} small active={(up.interests||[]).includes(o.id)} onClick={()=>toggleInterest(uid,o.id)}>{o.e} {o.l[lang]}</Pill>)}</div>
          <div style={{fontSize:11,fontWeight:600,color:C.textDim,marginBottom:6}}>{T.budgetRange[lang]}</div>
          <div style={{display:"flex",gap:6}}>{budgetOpts.map(o=><Pill key={o.id} small active={up.budget===o.id} onClick={()=>setPref(uid,"budget",o.id)}>{o.e} {o.l[lang]}</Pill>)}</div>
        </Card>
      )})}
      <button onClick={generate} disabled={generating} style={{width:"100%",padding:"14px",borderRadius:12,background:generating?C.textDim:`linear-gradient(135deg,${C.purple},${C.blue})`,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:generating?"wait":"pointer",fontFamily:Fn,marginTop:8}}>
        {generating?`${lang==="pl"?"Generuję...":"Generating..."}⏳`:(`✨ ${T.generatePlan[lang]}`)}
      </button>
      {result&&(
        <div style={{marginTop:16}}>
          <Card style={{padding:16,marginBottom:10,background:C.sageLight,border:`1px solid ${C.sage}33`}} hover={false}>
            <div style={{fontSize:13,fontWeight:700,color:C.sage,marginBottom:4}}>🎯 {lang==="pl"?"Konsensus grupy":"Group Consensus"}</div>
            <p style={{fontSize:12,color:C.textSec,lineHeight:1.5}}>{result.consensus.note}</p>
          </Card>
          <div style={{fontSize:13,fontWeight:700,fontFamily:Fn,marginBottom:8}}>{lang==="pl"?"Sugerowany plan dnia":"Suggested Day Plan"}</div>
          {result.suggestions.map((s,i)=>(
            <div key={i} style={{padding:"8px 0",display:"flex",gap:10,alignItems:"center",borderBottom:`1px solid ${C.borderLight}`}}>
              <span style={{fontSize:11,fontWeight:600,color:C.textDim,width:40}}>{s.time}</span>
              <span style={{fontSize:14}}>{tE[s.type]||"📍"}</span>
              <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{s.name}</div><div style={{fontSize:10,color:C.textDim}}>{s.duration}{s.cost>0?` · ~${s.cost} ${trip.currency}`:""}</div></div>
            </div>
          ))}
          <button onClick={()=>{if(onGenerate)onGenerate(result.suggestions)}} style={{width:"100%",marginTop:12,padding:"12px",borderRadius:12,background:C.sage,border:"none",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
            ✓ {lang==="pl"?"Dodaj do planu":"Add to itinerary"}
          </button>
        </div>
      )}
    </div>
  );
};

// ═══════════════ PWA INSTALL PROMPT ═══════════════
const InstallBanner=({lang})=>{
  const[deferredPrompt,setDP]=useState(null);
  const[show,setShow]=useState(false);
  useEffect(()=>{
    const handler=e=>{e.preventDefault();setDP(e);setShow(true)};
    window.addEventListener("beforeinstallprompt",handler);
    return()=>window.removeEventListener("beforeinstallprompt",handler);
  },[]);
  if(!show)return null;
  return(
    <div style={{position:"fixed",bottom:70,left:16,right:16,maxWidth:448,margin:"0 auto",zIndex:150,background:C.white,borderRadius:16,boxShadow:C.shadowMd,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,border:`1px solid ${C.borderLight}`,animation:"fadeUp 0.3s"}}>
      <span style={{fontSize:28}}>📱</span>
      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700}}>{T.installApp[lang]}</div><div style={{fontSize:11,color:C.textDim}}>{lang==="pl"?"Offline, szybsze ładowanie":"Offline, faster loading"}</div></div>
      <button onClick={async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;setShow(false);setDP(null)}}} style={{padding:"8px 16px",borderRadius:10,background:C.primary,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{T.install[lang]}</button>
      <button onClick={()=>setShow(false)} style={{background:"none",border:"none",color:C.textDim,fontSize:16,cursor:"pointer",padding:4}}>✕</button>
    </div>
  );
};

// ═══════════════ MAIN APP ═══════════════
export default function Ventura(){
const[lang,setLang]=useState("pl");
const t=k=>T[k]?.[lang]||k;
const tO=o=>(typeof o==="object"&&o!==null&&!Array.isArray(o)&&(o.pl||o.en))?o[lang]||o.en||"":o;
const[loggedIn,setLoggedIn]=useState(false);
const[isGuest,setIsGuest]=useState(false);
const[currentUser,setCU]=useState(null);
const[users,setUsers]=useState(USERS_INIT);
const[scr,setScr]=useState("home");
const[tab,setTab]=useState("trip");
const[activeTrip,setAT]=useState(null);
const[trips,setTrips]=useState(INIT_TRIPS);
const[savedLists,setSL]=useState([]);
const[showWiz,setSW]=useState(false);
const[showInv,setSI]=useState(false);
const[showProf,setSP]=useState(false);
const[showTrav,setST]=useState(false);
const[eDays,setED]=useState({});
const[eItem,setEI]=useState(null);
const[eBgt,setEB]=useState(false);
const[bIn,setBI]=useState("");
const[jIn,setJI]=useState("");
const[wStep,setWS]=useState(0);
const[wData,setWD]=useState({name:"",dest:"",startDate:"",endDate:"",travelers:2,style:"Cultural"});
const[invEmail,setIE]=useState("");
const[invRole,setIR]=useState("companion");
const[packCat,setPC]=useState("");
const[packItem,setPI]=useState("");
const[showTpl,setSTpl]=useState(false);
const[showSP2,setSP2]=useState(false);
const[spName,setSPN]=useState("");
const[showLP,setSLP]=useState(false);
const[editExp,setEE]=useState(null);
const[editExpD,setEED]=useState({});
const[newExpO,setNEO]=useState(false);
const[newExp,setNE]=useState({name:"",cat:"Food",amount:"",currency:"",payer:"",splitAmong:[]});
const[editCur,setEC]=useState(false);
const[compIn,setCI]=useState({name:"",url:"",price:"",notes:""});
const[showAddDay,setSAD]=useState(false);
const[newDay,setND]=useState({title:"",date:""});
const[showAddAct,setSAA]=useState(null);
const[newAct,setNA]=useState({name:"",time:"10:00",duration:"1h",type:"sight",cost:0,desc:"",lat:null,lng:null});
const[dragItem,setDI]=useState(null);
const[dragOverDay,setDOD]=useState(null);
const[showAF,setSAF]=useState(false);
const[fSearch,setFS]=useState("");
const photoRef=useRef(null);
const[showCelebration,setSC]=useState(false);
const[showShare,setSSh]=useState(false);
const[linkCopied,setLC]=useState(false);
const[toast,setToast]=useState(null);

const trip=activeTrip?trips.find(x=>x.id===activeTrip):null;
const getU=id=>users.find(u=>u.id===id)||{name:"?",color:C.textDim};
const uRole=trip?(trip.travelers.includes(currentUser?.id)?(currentUser?.role||"user"):trip.observers?.includes(currentUser?.id)?"observer":"guest"):(isGuest?"guest":"user");
const canE=!isGuest&&["admin","user","companion"].includes(uRole);
const upT=(id,fn)=>{if(isGuest)return;setTrips(p=>p.map(x=>x.id===id?fn(x):x))};
const delT=id=>{setTrips(p=>p.filter(x=>x.id!==id));setAT(null);setScr("home")};
const getK=(dest,obj)=>{if(!dest)return null;for(const k of Object.keys(obj)){if(dest.includes(k))return k}return null};
const dayMins=items=>items.reduce((s,it)=>s+parseDur(it.duration),0);

const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(null),2500)};

const handlePhotoUpload=e=>{const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{const url=ev.target.result;setCU(p=>({...p,photoUrl:url}));setUsers(us=>us.map(u=>u.id===currentUser.id?{...u,photoUrl:url}:u))};reader.readAsDataURL(file)};
const allVacApproved=trip&&trip.vacStatus&&trip.travelers.length>0&&trip.travelers.every(uid=>trip.vacStatus[uid]==="approved");
const syncSteps=(tripId,dayIdx)=>{const steps=Math.floor(Math.random()*8000)+12000;upT(tripId,tr=>({...tr,dayData:tr.dayData.map((d,i)=>i===dayIdx?{...d,steps:{...d.steps,[currentUser.id]:steps}}:d)}))};

const onDS=(dI,iI)=>e=>{setDI({dI,iI});e.dataTransfer.effectAllowed="move"};
const onDO=dI=>e=>{e.preventDefault();setDOD(dI)};
const onDrop=tD=>e=>{e.preventDefault();setDOD(null);if(!dragItem||!trip||!canE)return;const{dI:sD,iI:sI}=dragItem;upT(trip.id,tr=>{const dd=[...tr.dayData.map(d=>({...d,items:[...d.items]}))];const[mv]=dd[sD].items.splice(sI,1);dd[tD].items.push(mv);return{...tr,dayData:dd}});setDI(null)};

const handleShareCopy=()=>{
  const url=copyShareLink(trip);
  setLC(true);
  showToast(t("linkCopied"));
  setTimeout(()=>setLC(false),2000);
};

const handleICSExport=()=>{
  if(!trip)return;
  generateICS(trip,trip.dayData||[]);
  showToast(lang==="pl"?"Eksportowano!":"Exported!");
};

const addAISuggestions=(suggestions)=>{
  if(!trip||!suggestions?.length)return;
  const dayNum=(trip.dayData?.length||0)+1;
  upT(trip.id,tr=>({...tr,dayData:[...tr.dayData,{
    day:dayNum,date:"",title:lang==="pl"?`AI Plan (Dzień ${dayNum})`:`AI Plan (Day ${dayNum})`,
    items:suggestions.map((s,i)=>({id:"ai_"+Date.now()+"_"+i,time:s.time,name:s.name,desc:"",type:s.type,duration:s.duration,cost:s.cost,rating:0,votes:{[currentUser.id]:1},fav:{},status:trip.travelers.length<=1?"approved":"pending",lat:null,lng:null})),
    weather:null,img:null,steps:{}
  }]}));
  showToast(lang==="pl"?"Plan AI dodany!":"AI plan added!");
};

const getTabs=()=>{
  if(!trip)return[];
  const base=[
    {id:"map",l:t("tabMap"),i:"🗺️"},
    ...(trip.status==="past"?[{id:"memories",l:t("tabMemories"),i:"✨"}]:[]),
    ...(trip.status==="planning"?[{id:"plan",l:t("tabPlan"),i:"📋"}]:[]),
    {id:"trip",l:t("tabTrip"),i:"📅"},
    {id:"ai",l:t("tabAI"),i:"🤖"},
    {id:"packing",l:t("tabPack"),i:"🎒"},
    {id:"journal",l:t("tabJournal"),i:"📓"},
    {id:"budget",l:t("tabBudget"),i:"💰"},
    {id:"booking",l:t("tabBook"),i:"🔖"}
  ];
  return base;
};

const createTrip=()=>{if(isGuest){alert(t("loginToSave"));return}const id="trip_"+Date.now();setTrips(p=>[...p,{id,name:wData.name||`${wData.dest} Trip`,dest:wData.dest,dates:`${wData.startDate} – ${wData.endDate}`,travelers:[currentUser.id],observers:[],days:0,status:"planning",currency:"PLN",vacStatus:{[currentUser.id]:"not_applied"},heroImg:"",budget:{total:0},completeness:5,journal:[],memories:null,dayData:[],expenses:[],packing:{},deals:[],comparisons:[],shareToken:Math.random().toString(36).slice(2)+Date.now().toString(36),isPublic:false,planningTips:[{icon:"🏨",title:{pl:"Nocleg",en:"Accommodation"},desc:{pl:`Znajdź w ${wData.dest}.`,en:`Find in ${wData.dest}.`},done:false,priority:"high"},{icon:"✈️",title:{pl:"Loty",en:"Flights"},desc:{pl:"Szukaj ofert.",en:"Search deals."},done:false,priority:"high"},{icon:"🗺️",title:{pl:"Plan dnia",en:"Itinerary"},desc:{pl:`${wData.travelers} osób.`,en:`${wData.travelers} people.`},done:false,priority:"medium"},{icon:"🎒",title:{pl:"Lista pakowania",en:"Packing list"},desc:{pl:"Szablon lub od zera.",en:"Template or scratch."},done:false,priority:"low"}]}]);setAT(id);setScr("trip");setTab("plan");setSW(false);setWS(0);setWD({name:"",dest:"",startDate:"",endDate:"",travelers:2,style:"Cultural"})};

const css=`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,700;9..144,800&family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}input:focus,select:focus,textarea:focus{outline:none;border-color:${C.primary}!important}.maplibregl-popup-content{border-radius:12px!important;box-shadow:${C.shadowMd}!important;padding:8px 12px!important}.maplibregl-ctrl-attrib{font-size:9px!important}`;

// ═══ LOGIN ═══
if(!loggedIn&&!isGuest)return(
<div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.primaryLight} 0%,${C.bg} 40%,${C.blueLight} 100%)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Nunito Sans',sans-serif",padding:20}}>
<style>{css}</style>
<Card style={{width:"100%",maxWidth:400,padding:32,textAlign:"center",animation:"fadeUp 0.5s"}} hover={false}>
<div style={{fontSize:40,fontWeight:800,fontFamily:Fn,color:C.primary,marginBottom:4}}>V</div>
<div style={{fontSize:22,fontWeight:800,fontFamily:Fn,marginBottom:4}}>Ventura</div>
<p style={{fontSize:13,color:C.textSec,marginBottom:4}}>{lang==="pl"?"Twój inteligentny towarzysz podróży grupowej":"Your intelligent group travel companion"}</p>
<div style={{fontSize:10,fontWeight:600,color:C.primary,marginBottom:16,padding:"3px 12px",borderRadius:99,background:C.primaryLight,display:"inline-block"}}>v6.0 — Group Travel OS</div>
<div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:16}}><Pill small active={lang==="pl"} onClick={()=>setLang("pl")}>🇵🇱 PL</Pill><Pill small active={lang==="en"} onClick={()=>setLang("en")}>🇬🇧 EN</Pill></div>
<div style={{fontSize:12,fontWeight:600,color:C.textDim,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>{t("selectProfile")}</div>
{users.map(u=>(<div key={u.id} onClick={()=>{setCU(u);setLoggedIn(true)}} style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:12,borderRadius:12,border:`1.5px solid ${C.border}`,marginBottom:8,cursor:"pointer",transition:"all 0.2s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.primary;e.currentTarget.style.background=C.primaryLight}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background="transparent"}}><Av user={u} size={36}/><div style={{flex:1,textAlign:"left"}}><div style={{fontSize:14,fontWeight:600}}>{u.name}</div><div style={{fontSize:11,color:C.textDim}}>{u.email}</div></div><span style={{fontSize:10,fontWeight:700,color:ROLES[u.role].color,background:`${ROLES[u.role].color}15`,padding:"3px 10px",borderRadius:99,textTransform:"uppercase"}}>{tO(ROLES[u.role].l)}</span></div>))}
<div style={{marginTop:12,borderTop:`1px solid ${C.border}`,paddingTop:12}}/>
<button onClick={()=>setIsGuest(true)} style={{width:"100%",padding:"14px",borderRadius:12,background:C.bgAlt,border:`1.5px solid ${C.border}`,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:C.textSec}}>👁️ {t("continueAsGuest")}</button>
<p style={{fontSize:11,color:C.textDim,marginTop:8}}>{t("guestNotice")}</p>
{!isSupabaseConfigured&&<div style={{marginTop:12,padding:"8px 12px",borderRadius:8,background:C.goldLight,border:`1px solid ${C.gold}33`,fontSize:10,color:C.gold}}>⚡ Demo mode — {lang==="pl"?"Podłącz Supabase dla pełnych funkcji":"Connect Supabase for full features"}</div>}
</Card></div>);


// ═══ RENDER ═══
return(<div style={{maxWidth:480,margin:"0 auto",minHeight:"100vh",background:C.bg,fontFamily:"'Nunito Sans',sans-serif",position:"relative"}}>
<style>{css}</style>

{/* Toast notification */}
{toast&&<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",zIndex:999,background:C.text,color:"#fff",padding:"10px 20px",borderRadius:12,fontSize:13,fontWeight:600,boxShadow:C.shadowMd,animation:"fadeUp 0.2s"}}>{toast}</div>}

{/* Header */}
<div style={{padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.borderLight}`,background:C.white,position:"sticky",top:0,zIndex:100}}>
<div style={{display:"flex",alignItems:"center",gap:10}}>
{scr==="trip"&&<button onClick={()=>{setScr("home");setAT(null)}} style={{padding:"6px 12px",borderRadius:8,background:C.bgAlt,border:"none",cursor:"pointer",fontSize:12,color:C.textSec,fontFamily:"inherit"}}>{t("back")}</button>}
<span onClick={()=>{setScr("home");setAT(null)}} style={{fontSize:20,fontWeight:800,fontFamily:Fn,color:C.primary,cursor:"pointer"}}>V</span>
{scr==="home"&&<span style={{fontSize:16,fontWeight:700,fontFamily:Fn}}>Ventura</span>}
{scr==="trip"&&trip&&<span style={{fontSize:14,fontWeight:700,fontFamily:Fn,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{trip.name}</span>}
</div>
<div style={{display:"flex",alignItems:"center",gap:6}}>
<button onClick={()=>setLang(l=>l==="pl"?"en":"pl")} style={{padding:"4px 8px",borderRadius:6,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:C.textSec}}>{lang==="pl"?"EN":"PL"}</button>
{isGuest&&<span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:99,background:C.goldLight,color:C.gold}}>{t("guestMode")}</span>}
{scr==="trip"&&trip&&<>
<button onClick={()=>setSSh(true)} style={{padding:"6px 10px",borderRadius:99,background:C.blueLight,border:`1px solid ${C.blue}33`,fontSize:11,cursor:"pointer",fontFamily:"inherit",color:C.blue,fontWeight:600}}>🔗</button>
<button onClick={()=>setST(true)} style={{padding:"6px 10px",borderRadius:99,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:11,cursor:"pointer",fontFamily:"inherit",color:C.textSec}}>👥 {trip.travelers.length+(trip.observers?.length||0)}</button>
</>}
{isGuest?<button onClick={()=>{setIsGuest(false);setScr("home")}} style={{padding:"6px 12px",borderRadius:8,background:C.primary,border:"none",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{lang==="pl"?"Zaloguj":"Login"}</button>
:<div onClick={()=>setSP(true)} style={{cursor:"pointer"}}><Av user={currentUser} size={28}/></div>}
</div></div>

{/* ═══ HOME ═══ */}
{scr==="home"&&(<div style={{padding:20,animation:"fadeUp 0.3s"}}>
<div style={{fontSize:22,fontWeight:800,fontFamily:Fn,marginBottom:4}}>{t("welcome")}{currentUser?`, ${currentUser.name}`:""}</div>
<p style={{fontSize:13,color:C.textSec,marginBottom:20}}>{t("planNext")}</p>
{!isGuest&&<button onClick={()=>setSW(true)} style={{width:"100%",padding:"16px 20px",borderRadius:16,background:`linear-gradient(135deg,${C.primary},${C.coral})`,border:"none",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:Fn,boxShadow:C.shadowMd,display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:24}}><span style={{fontSize:18}}>+</span> {t("newTrip")}</button>}
{isGuest&&<Card style={{padding:16,marginBottom:16,background:C.goldLight,border:`1px solid ${C.gold}33`}} hover={false}><div style={{fontSize:13,color:C.gold,fontWeight:600}}>👁️ {t("guestNotice")}</div></Card>}

{trips.filter(tr=>isGuest||tr.travelers.includes(currentUser?.id)||tr.observers?.includes(currentUser?.id)).map(tr=>(<Card key={tr.id} onClick={()=>{setAT(tr.id);setScr("trip");setTab(tr.status==="past"?"memories":tr.status==="planning"?"plan":"map")}} style={{marginBottom:16,overflow:"hidden"}}>
<PhotoSlider dest={tr.dest}/>
<div style={{padding:16}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div><div style={{fontSize:16,fontWeight:700,fontFamily:Fn}}>{tr.name}</div><div style={{fontSize:12,color:C.textSec}}>{tr.dest} · {tr.dates}</div></div>
<span style={{fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:99,textTransform:"uppercase",background:tr.status==="upcoming"?C.sageLight:tr.status==="planning"?C.blueLight:C.bgAlt,color:tr.status==="upcoming"?C.sage:tr.status==="planning"?C.blue:C.textDim}}>{t(tr.status)}</span></div>
{tr.status!=="past"&&<div style={{marginTop:10}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.textDim,marginBottom:3}}><span>{t("tripReadiness")}</span><span>{tr.completeness}%</span></div><Bar v={tr.completeness} mx={100} color={tr.completeness>75?C.sage:tr.completeness>40?C.gold:C.coral} h={4}/></div>}
<div style={{display:"flex",alignItems:"center",gap:8,marginTop:10}}><div style={{display:"flex"}}>{tr.travelers.map((uid,i)=>{const u=getU(uid);return<div key={uid} style={{width:24,height:24,borderRadius:"50%",background:u.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",marginLeft:i>0?-6:0,border:"2px solid #fff",position:"relative",zIndex:tr.travelers.length-i}}>{u.name[0]}</div>})}</div><span style={{fontSize:11,color:C.textDim}}>{tr.travelers.length} {t("travelers")}</span></div></div></Card>))}

<div style={{fontSize:14,fontWeight:700,fontFamily:Fn,marginTop:20,marginBottom:10}}>{t("getInspired")}</div>
<div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8}}>{INSP.map(d=>(<div key={d.name} onClick={isGuest?undefined:()=>{setWD(p=>({...p,dest:d.name}));setSW(true)}} style={{flex:"0 0 110px",borderRadius:14,overflow:"hidden",position:"relative",height:150,cursor:isGuest?"default":"pointer",boxShadow:C.shadow}}><Img src={d.img} alt={d.name} style={{width:"100%",height:"100%"}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(0deg,rgba(0,0,0,0.6) 0%,transparent 50%)"}}/><span style={{position:"absolute",bottom:10,left:10,color:"#fff",fontSize:13,fontWeight:700}}>{d.name}</span></div>))}</div>
</div>)}

{/* ═══ TRIP VIEW ═══ */}
{scr==="trip"&&trip&&(<div style={{animation:"fadeUp 0.3s"}}>
{trip.heroImg&&<div style={{position:"relative",height:160}}><Img src={trip.heroImg} alt={trip.name} style={{width:"100%",height:"100%"}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(0deg,rgba(44,24,16,0.7) 0%,transparent 60%)"}}/><div style={{position:"absolute",bottom:14,left:20,right:20}}><div style={{fontSize:22,fontWeight:800,fontFamily:Fn,color:"#fff"}}>{trip.name}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.85)"}}>{trip.dest} · {trip.dates}</div></div></div>}

{/* Currency bar */}
<div style={{padding:"8px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",background:C.bgAlt,borderBottom:`1px solid ${C.borderLight}`}}>
<div style={{display:"flex",alignItems:"center",gap:6,fontSize:12}}>
<span style={{color:C.textDim}}>{t("currency")}:</span>
{editCur?<select value={trip.currency||"EUR"} onChange={e=>{upT(trip.id,tr=>({...tr,currency:e.target.value}));setEC(false)}} autoFocus onBlur={()=>setEC(false)} style={{padding:"3px 6px",borderRadius:6,border:`1px solid ${C.primary}`,fontSize:12,fontWeight:600,background:C.white,fontFamily:"inherit"}}>{CURS.map(c=><option key={c}>{c}</option>)}</select>
:<span onClick={canE?()=>setEC(true):undefined} style={{fontWeight:700,cursor:canE?"pointer":"default",color:C.primary}}>{trip.currency||"EUR"} {canE&&"✎"}</span>}
</div>
<div style={{display:"flex",gap:6}}>
{canE&&trip.status!=="past"&&<button onClick={()=>{if(confirm(`${t("deleteTrip")} "${trip.name}"?`))delT(trip.id)}} style={{padding:"4px 12px",borderRadius:8,background:`${C.danger}10`,border:`1px solid ${C.danger}30`,color:C.danger,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🗑</button>}
</div></div>

{/* Tabs */}
<div style={{display:"flex",overflowX:"auto",gap:2,padding:"10px 16px 0",borderBottom:`1px solid ${C.borderLight}`,background:C.white}}>
{getTabs().map(tb=>(<button key={tb.id} onClick={()=>setTab(tb.id)} style={{padding:"8px 12px",fontSize:11,fontWeight:tab===tb.id?700:500,color:tab===tb.id?C.primary:C.textDim,background:"transparent",border:"none",borderBottom:`2px solid ${tab===tb.id?C.primary:"transparent"}`,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"inherit"}}>{tb.i} {tb.l}</button>))}</div>

<div style={{padding:20}}>

{/* ══ MAP TAB ══ */}
{tab==="map"&&<TripMap trip={trip} lang={lang} getU={getU}/>}

{/* ══ MEMORIES TAB ══ */}
{tab==="memories"&&trip.memories&&(<div>
<Card style={{padding:20,marginBottom:14,background:`linear-gradient(135deg,${C.goldLight},${C.white})`}} hover={false}>
<div style={{fontSize:18,fontWeight:800,fontFamily:Fn,marginBottom:12}}>✨ {t("tabMemories")}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{Object.entries(trip.memories.stats).map(([k,v])=>(<div key={k} style={{padding:10,background:C.white,borderRadius:10,textAlign:"center"}}><div style={{fontSize:18,fontWeight:800,fontFamily:Fn,color:C.primary}}>{v}</div><div style={{fontSize:10,color:C.textDim,textTransform:"capitalize"}}>{k}</div></div>))}</div></Card>
{trip.memories.highlights.map((h,i)=>(<Card key={i} style={{padding:14,marginBottom:8}} hover={false}><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>{h.icon}</span><div><div style={{fontSize:11,color:C.textDim}}>{h.title}</div><div style={{fontSize:13,fontWeight:600}}>{h.value}</div></div></div></Card>))}
</div>)}

{/* ══ PLAN TAB ══ */}
{tab==="plan"&&trip.planningTips&&(<div>
<Card style={{padding:20,marginBottom:14,background:`linear-gradient(135deg,${C.blueLight},${C.white})`}} hover={false}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:14,fontWeight:700,fontFamily:Fn}}>{t("tripReadiness")}</div><div style={{fontSize:11,color:C.textSec}}>{t("completeToPrep")}</div></div><div style={{fontSize:28,fontWeight:800,fontFamily:Fn,color:C.blue}}>{trip.completeness}%</div></div>
<Bar v={trip.completeness} mx={100} color={C.blue} h={8}/></Card>
{trip.planningTips.map((tip,i)=>(<Card key={i} style={{padding:14,marginBottom:8}} hover={false} onClick={canE?()=>{upT(trip.id,tr=>{const tips=tr.planningTips.map((tp,j)=>j===i?{...tp,done:!tp.done}:tp);return{...tr,planningTips:tips,completeness:Math.min(100,Math.round(tips.filter(x=>x.done).length/tips.length*100))}})}:undefined}>
<div style={{display:"flex",alignItems:"center",gap:12}}>
<div style={{width:22,height:22,borderRadius:6,border:tip.done?"none":`2px solid ${C.border}`,background:tip.done?C.sage:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{tip.done&&<span style={{color:"#fff",fontSize:12}}>✓</span>}</div>
<span style={{fontSize:18}}>{tip.icon}</span>
<div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,textDecoration:tip.done?"line-through":"none",color:tip.done?C.textDim:C.text}}>{tO(tip.title)}</div><div style={{fontSize:11,color:C.textDim}}>{tO(tip.desc)}</div></div>
<span style={{fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:99,textTransform:"uppercase",background:tip.priority==="high"?C.coralLight:tip.priority==="medium"?C.goldLight:C.bgAlt,color:tip.priority==="high"?C.coral:tip.priority==="medium"?C.gold:C.textDim}}>{tip.priority}</span></div></Card>))}

{/* Itinerary builder */}
<div style={{marginTop:16,fontSize:14,fontWeight:700,fontFamily:Fn,marginBottom:10}}>🗺️ {lang==="pl"?"Buduj plan dnia":"Build daily plan"}</div>
{(trip.dayData||[]).map((day,dI)=>{const tm=dayMins(day.items);const over=tm>720;return(
<Card key={dI} style={{marginBottom:10,overflow:"hidden",border:dragOverDay===dI?`2px dashed ${C.primary}`:`1px solid ${C.borderLight}`}} hover={false} onDragOver={onDO(dI)} onDrop={onDrop(dI)}>
<div style={{padding:"10px 16px",borderBottom:`1px solid ${C.borderLight}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div><div style={{fontSize:13,fontWeight:700}}>{lang==="pl"?"Dzień":"Day"} {day.day}: {day.title}</div><div style={{fontSize:11,color:C.textDim}}>{day.date} · {Math.round(tm/60*10)/10}h</div></div>
{canE&&<button onClick={()=>upT(trip.id,tr=>({...tr,dayData:tr.dayData.filter((_,j)=>j!==dI)}))} style={{background:"none",border:"none",color:C.danger,fontSize:14,cursor:"pointer"}}>🗑</button>}</div>
{over&&<div style={{padding:"8px 16px",background:C.coralLight,fontSize:12,fontWeight:600,color:C.coral}}>{t("dayOverloaded")}</div>}
{day.items.map((it,iI)=>(<div key={it.id||iI} draggable={canE} onDragStart={canE?onDS(dI,iI):undefined} style={{padding:"8px 14px",display:"flex",gap:8,alignItems:"center",borderBottom:`1px solid ${C.borderLight}`,cursor:canE?"grab":"default",background:it.status==="pending"?C.goldLight:"transparent"}}>
{canE&&<span style={{fontSize:10,color:C.textDim,cursor:"grab"}}>⠿</span>}
<span style={{fontSize:13}}>{tE[it.type]||"📍"}</span>
<div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{it.name}{it.status==="pending"&&<span style={{fontSize:10,color:C.gold,marginLeft:6}}>({t("pending")})</span>}</div>
<div style={{fontSize:10,color:C.textDim}}>{it.time} · {it.duration}{it.cost>0?` · ${it.cost} ${trip.currency}`:""}</div></div>
{it.status==="pending"&&canE&&<button onClick={e=>{e.stopPropagation();upT(trip.id,tr=>({...tr,dayData:tr.dayData.map((d,di)=>di===dI?{...d,items:d.items.map((x,xi)=>xi===iI?{...x,votes:{...x.votes,[currentUser.id]:1},status:Object.keys({...x.votes,[currentUser.id]:1}).length>=Math.ceil(trip.travelers.length/2)?"approved":"pending"}:x)}:d)}))}} style={{padding:"3px 8px",borderRadius:6,background:C.sageLight,border:"none",color:C.sage,fontSize:10,fontWeight:600,cursor:"pointer"}}>👍</button>}
<button onClick={e=>{e.stopPropagation();if(!currentUser||isGuest)return;upT(trip.id,tr=>({...tr,dayData:tr.dayData.map((d,di)=>di===dI?{...d,items:d.items.map((x,xi)=>xi===iI?{...x,fav:{...x.fav,[currentUser.id]:!x.fav?.[currentUser.id]}}:x)}:d)}))}} style={{background:"none",border:"none",fontSize:16,cursor:"pointer",padding:2}}>{it.fav?.[currentUser?.id]?"❤️":"🤍"}</button>
</div>))}
{canE&&<div style={{padding:8,textAlign:"center"}}><button onClick={()=>{setSAA(dI);setNA({name:"",time:"10:00",duration:"1h",type:"sight",cost:0,desc:"",lat:null,lng:null})}} style={{padding:"6px 14px",borderRadius:8,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:11,cursor:"pointer",fontFamily:"inherit",color:C.textSec}}>{t("addActivity")}</button></div>}
</Card>)})}
{canE&&<button onClick={()=>setSAD(true)} style={{width:"100%",padding:"12px",borderRadius:12,background:C.blueLight,border:`1px solid ${C.blue}33`,color:C.blue,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginTop:8}}>{t("addDay")}</button>}
{canE&&<p style={{fontSize:11,color:C.textDim,marginTop:8,textAlign:"center"}}>{t("dragHint")}</p>}
</div>)}


{/* ══ TRIP (itinerary view) ══ */}
{tab==="trip"&&(trip.dayData?.length>0?<div>{trip.dayData.map((day,dI)=>{const open=eDays[day.day]!==false;const tm=dayMins(day.items);const over=tm>720;return(<Card key={day.day} style={{marginBottom:12,overflow:"hidden",border:dragOverDay===dI?`2px dashed ${C.primary}`:`1px solid ${C.borderLight}`}} hover={false} onDragOver={canE?onDO(dI):undefined} onDrop={canE?onDrop(dI):undefined}>
<div onClick={()=>setED(p=>({...p,[day.day]:!open}))} style={{cursor:"pointer"}}>
{day.img&&<Img src={day.img} alt={day.title} style={{width:"100%",height:100}}/>}
<div style={{padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:open?`1px solid ${C.borderLight}`:"none"}}>
<div><div style={{fontSize:14,fontWeight:700,fontFamily:Fn}}>{lang==="pl"?"Dzień":"Day"} {day.day}: {day.title}</div><div style={{fontSize:12,color:C.textSec,display:"flex",alignItems:"center",gap:6}}>{day.date}{day.weather&&<> · <WI t={day.weather.icon}/> {day.weather.hi}°/{day.weather.lo}°</>} · {Math.round(tm/60*10)/10}h</div>
{day.steps&&<div style={{fontSize:11,color:C.sage,display:"flex",alignItems:"center",gap:4,marginTop:2}}>{Object.entries(day.steps).map(([uid,s])=><span key={uid} style={{padding:"2px 6px",borderRadius:4,background:C.sageLight}}>🚶 {getU(uid).name}: {s.toLocaleString()}</span>)}
{canE&&trip.status==="upcoming"&&<button onClick={e=>{e.stopPropagation();syncSteps(trip.id,dI)}} style={{padding:"2px 8px",borderRadius:4,background:C.blueLight,border:`1px solid ${C.blue}33`,color:C.blue,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📱 {t("syncHealth")}</button>}</div>}</div>
<span style={{fontSize:14,color:C.textDim,transform:open?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▼</span></div></div>
{over&&open&&<div style={{padding:"8px 16px",background:C.coralLight,fontSize:12,fontWeight:600,color:C.coral}}>{t("dayOverloaded")}</div>}
{open&&<div>{day.items.map((it,iI)=>(<div key={it.id||iI} draggable={canE} onDragStart={canE?onDS(dI,iI):undefined} onClick={()=>setEI(eItem===`${day.day}-${iI}`?null:`${day.day}-${iI}`)} style={{padding:"10px 14px",display:"flex",gap:8,borderBottom:`1px solid ${C.borderLight}`,cursor:canE?"grab":"pointer",background:eItem===`${day.day}-${iI}`?C.bgAlt:it.status==="pending"?C.goldLight:"transparent",alignItems:"center"}}>
{canE&&<span style={{fontSize:10,color:C.textDim}}>⠿</span>}
<div style={{minWidth:36,fontSize:11,fontWeight:600,color:C.textDim}}>{it.time}</div>
<div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:13}}>{tE[it.type]}</span><span style={{fontSize:13,fontWeight:600}}>{it.name}</span>{it.rating>0&&<span style={{fontSize:11,color:C.gold}}>★ {it.rating}</span>}{it.status==="pending"&&<span style={{fontSize:10,color:C.gold}}>({t("pending")})</span>}</div>
{eItem===`${day.day}-${iI}`&&<div style={{marginTop:4}}>{it.desc&&<p style={{fontSize:12,color:C.textSec}}>{it.desc}</p>}<div style={{fontSize:11,color:C.textDim}}>{it.duration}{it.cost>0?` · ${it.cost} ${trip.currency}`:""}{it.lat?` · 📍 ${it.lat.toFixed(3)}, ${it.lng.toFixed(3)}`:""}</div></div>}</div>
{it.status==="pending"&&canE&&<button onClick={e=>{e.stopPropagation();upT(trip.id,tr=>({...tr,dayData:tr.dayData.map((d,di)=>di===dI?{...d,items:d.items.map((x,xi)=>xi===iI?{...x,votes:{...x.votes,[currentUser.id]:1},status:Object.keys({...x.votes,[currentUser.id]:1}).length>=Math.ceil(trip.travelers.length/2)?"approved":"pending"}:x)}:d)}))}} style={{padding:"3px 8px",borderRadius:6,background:C.sageLight,border:"none",color:C.sage,fontSize:10,fontWeight:600,cursor:"pointer",flexShrink:0}}>👍</button>}
<button onClick={e=>{e.stopPropagation();if(!currentUser||isGuest)return;upT(trip.id,tr=>({...tr,dayData:tr.dayData.map((d,di)=>di===dI?{...d,items:d.items.map((x,xi)=>xi===iI?{...x,fav:{...x.fav,[currentUser.id]:!x.fav?.[currentUser.id]}}:x)}:d)}))}} style={{background:"none",border:"none",fontSize:16,cursor:"pointer",padding:2,flexShrink:0}}>{it.fav?.[currentUser?.id]?"❤️":"🤍"}</button>
</div>))}
{canE&&<div style={{padding:8,textAlign:"center"}}><button onClick={()=>{setSAA(dI);setNA({name:"",time:"10:00",duration:"1h",type:"sight",cost:0,desc:"",lat:null,lng:null})}} style={{padding:"6px 14px",borderRadius:8,background:C.primaryLight,border:`1px solid ${C.primary}33`,fontSize:11,cursor:"pointer",fontFamily:"inherit",color:C.primary}}>+ {t("proposeActivity")}</button></div>}
</div>}</Card>)})}</div>
:<Card style={{padding:32,textAlign:"center"}} hover={false}><div style={{fontSize:40,marginBottom:12}}>🗺️</div><div style={{fontFamily:Fn,fontWeight:700}}>{lang==="pl"?"Brak planu":"No itinerary"}</div><p style={{fontSize:12,color:C.textDim,marginTop:4}}>{lang==="pl"?"Przejdź do zakładki Plan aby zbudować trasę":"Go to Plan tab to build your itinerary"}</p></Card>)}

{/* ══ AI TAB ══ */}
{tab==="ai"&&(()=>{const dk=getK(trip.dest,TRANSPORT);const ck=getK(trip.dest,CUSTOMS);const ak=getK(trip.dest,ADVISORY);const trn=dk?TRANSPORT[dk]:null;const cust=ck?CUSTOMS[ck]:null;const adv=ak?ADVISORY[ak]:null;
return(<div>
{/* AI Group Consensus */}
<AIConsensus trip={trip} lang={lang} travelers={trip.travelers} getU={getU} onGenerate={addAISuggestions}/>

<div style={{marginTop:20}}/>

{trn&&<Card style={{padding:16,marginBottom:14}} hover={false}>
<div style={{fontSize:14,fontWeight:700,fontFamily:Fn,marginBottom:4}}>🚌 {t("gettingAround")}</div>
<p style={{fontSize:12,color:C.textSec,lineHeight:1.5,marginBottom:10}}>{trn.info[lang]}</p>
<div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>{trn.rec.map(m=><span key={m} style={{padding:"4px 10px",borderRadius:99,background:C.sageLight,color:C.sage,fontSize:11,fontWeight:600}}>✓ {m}</span>)}</div>
{Object.entries(trn.modes).map(([mode,d])=>(<div key={mode} style={{padding:"8px 0",borderBottom:`1px solid ${C.borderLight}`,display:"flex",alignItems:"center",gap:10}}>
<div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{mode} <span style={{color:C.gold}}>{"★".repeat(d.r)}{"☆".repeat(5-d.r)}</span></div>
<div style={{fontSize:11,color:C.textSec}}>{d.n[lang]}</div></div></div>))}</Card>}

{trn?.airport&&<Card style={{padding:16,marginBottom:14,background:C.blueLight,border:`1px solid ${C.blue}22`}} hover={false}>
<div style={{fontSize:14,fontWeight:700,fontFamily:Fn,color:C.blue,marginBottom:6}}>✈️ {t("airportTransfer")}</div>
<p style={{fontSize:12,lineHeight:1.6}}>{trn.airport[lang]}</p></Card>}

{cust&&<Card style={{padding:16,marginBottom:14}} hover={false}>
<div style={{fontSize:14,fontWeight:700,fontFamily:Fn,marginBottom:10}}>🎎 {t("localCustoms")}</div>
{cust.map((c,i)=>(<div key={i} style={{padding:"8px 0",borderBottom:i<cust.length-1?`1px solid ${C.borderLight}`:"none",display:"flex",gap:10}}>
<span style={{fontSize:18}}>{c.icon}</span><p style={{fontSize:12,color:C.textSec,lineHeight:1.5,flex:1}}>{c.t[lang]}</p></div>))}</Card>}

{adv&&<Card style={{padding:16,marginBottom:14}} hover={false}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div style={{fontSize:14,fontWeight:700,fontFamily:Fn}}>🛡️ {t("travelAdvisory")}</div><span style={{fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:99,background:`${adv.color}20`,color:adv.color}}>{adv.level[lang]}</span></div>
<p style={{fontSize:12,color:C.textSec,lineHeight:1.5,marginBottom:12}}>{adv.info[lang]}</p>
<div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:6}}>{t("requiredDocs")}</div>
{adv.docs.map((d,i)=>(<div key={i} style={{padding:"6px 0",display:"flex",alignItems:"center",gap:8,borderBottom:i<adv.docs.length-1?`1px solid ${C.borderLight}`:"none"}}>
<span style={{fontSize:12}}>{d.req?"🔴":"🟡"}</span><span style={{fontSize:12,flex:1}}>{d.t[lang]}</span></div>))}</Card>}
</div>)})()}


{/* ══ PACKING TAB ══ */}
{tab==="packing"&&(()=>{const pk=trip.packing||{};const tot=Object.values(pk).flat().length;const done=Object.values(pk).flat().filter(x=>x.packed).length;return(<div>
{canE&&trip.status!=="past"&&<Card style={{padding:14,marginBottom:14,background:C.purpleLight,border:`1px solid ${C.purple}33`}} hover={false}>
<div style={{fontSize:12,fontWeight:700,color:C.purple,marginBottom:8}}>🏖️ {t("vacationRequest")}</div>
{trip.travelers.map(uid=>{const u=getU(uid);const vs=trip.vacStatus?.[uid]||"not_applied";const sts=["not_applied","applied","approved","denied"];const sL={not_applied:t("vacNotApplied"),applied:t("vacApplied"),approved:t("vacApproved"),denied:t("vacDenied")};const sC={not_applied:C.textDim,applied:C.gold,approved:C.sage,denied:C.danger};
return(<div key={uid} style={{padding:"6px 0",display:"flex",alignItems:"center",gap:10}}><Av user={u} size={24}/><span style={{fontSize:12,fontWeight:600,flex:1}}>{u.name}</span>
{uid===currentUser?.id?<select value={vs} onChange={e=>upT(trip.id,tr=>({...tr,vacStatus:{...tr.vacStatus,[uid]:e.target.value}}))} style={{padding:"4px 8px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:11,fontWeight:600,color:sC[vs],background:C.white,fontFamily:"inherit"}}>{sts.map(s=><option key={s} value={s}>{sL[s]}</option>)}</select>
:<span style={{fontSize:11,fontWeight:600,color:sC[vs]}}>{sL[vs]}</span>}</div>)})}
{allVacApproved&&!showCelebration&&<button onClick={()=>setSC(true)} style={{width:"100%",marginTop:8,padding:"10px",borderRadius:10,background:`linear-gradient(135deg,${C.sage},${C.blue})`,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t("allApprovedTitle")}</button>}
</Card>}

{tot>0&&<Card style={{padding:16,marginBottom:14,background:`linear-gradient(135deg,${C.sageLight},${C.white})`}} hover={false}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div style={{fontSize:14,fontWeight:700,fontFamily:Fn}}>🎒 {t("packingProgress")}</div><span style={{fontSize:13,fontWeight:700,color:C.sage}}>{done}/{tot}</span></div><Bar v={done} mx={tot||1} color={C.sage} h={6}/></Card>}

{canE&&<div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
<button onClick={()=>setSTpl(!showTpl)} style={{flex:1,padding:"10px",borderRadius:12,background:C.blueLight,border:`1px solid ${C.blue}33`,color:C.blue,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📦 {t("templates")}</button>
<button onClick={()=>{if(tot===0)return;setSP2(true)}} style={{flex:1,padding:"10px",borderRadius:12,background:C.primaryLight,border:`1px solid ${C.primary}33`,color:C.primary,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>💾 {t("saveList")}</button>
{savedLists.length>0&&<button onClick={()=>setSLP(true)} style={{flex:1,padding:"10px",borderRadius:12,background:C.goldLight,border:`1px solid ${C.gold}33`,color:C.gold,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>📂 {t("loadList")} ({savedLists.length})</button>}</div>}

{showTpl&&<div style={{marginBottom:14,display:"flex",gap:8,overflowX:"auto"}}>{PACK_TPL.map(tpl=>(<Card key={tpl.id} style={{flex:"0 0 120px",padding:14,textAlign:"center",cursor:"pointer"}} onClick={()=>{const np={};Object.entries(tpl.items).forEach(([c,items])=>{np[c]=items.map(it=>({...it,packed:false}))});upT(trip.id,tr=>({...tr,packing:{...tr.packing,...np}}));setSTpl(false)}}><div style={{fontSize:24,marginBottom:6}}>{tpl.icon}</div><div style={{fontSize:12,fontWeight:600}}>{tO(tpl.name)}</div></Card>))}</div>}

{canE&&<Card style={{padding:14,marginBottom:14,background:C.primaryLight,border:`1px solid ${C.primary}33`}} hover={false}>
<div style={{fontSize:12,fontWeight:700,color:C.primary,marginBottom:6}}>✨ {t("aiSuggestions")}</div>
<div style={{display:"flex",flexWrap:"wrap",gap:6}}>{AI_SUGG.slice(0,6).map(sug=>{const has=Object.values(pk).flat().some(x=>x.item===sug);return(<button key={sug} disabled={has} onClick={()=>{upT(trip.id,tr=>{const p={...tr.packing};p["AI"]=[...(p["AI"]||[]),{item:sug,qty:1,packed:false}];return{...tr,packing:p}})}} style={{padding:"5px 10px",borderRadius:99,fontSize:11,background:has?C.bgAlt:C.white,border:`1px solid ${C.border}`,color:has?C.textDim:C.text,cursor:has?"default":"pointer",fontFamily:"inherit",textDecoration:has?"line-through":"none"}}>+ {sug}</button>)})}</div></Card>}

<Card style={{padding:14,marginBottom:14,background:C.goldLight,border:`1px solid ${C.gold}33`}} hover={false}>
<div style={{fontSize:12,fontWeight:700,color:C.gold,marginBottom:8}}>⚠️ {t("dontForget")}</div>
{DONT_FORGET[lang].map((tip,i)=><div key={i} style={{fontSize:12,padding:"4px 0",lineHeight:1.5}}>{tip}</div>)}</Card>

{Object.keys(pk).length===0?<Card style={{padding:32,textAlign:"center"}} hover={false}><div style={{fontSize:40,marginBottom:12}}>🎒</div><div style={{fontFamily:Fn,fontWeight:700}}>{lang==="pl"?"Brak listy":"No list yet"}</div></Card>
:Object.entries(pk).map(([cat,items])=>(<Card key={cat} style={{marginBottom:10,overflow:"hidden"}} hover={false}>
<div style={{padding:"10px 16px",borderBottom:`1px solid ${C.borderLight}`,fontSize:13,fontWeight:700,display:"flex",justifyContent:"space-between"}}><span>{cat}</span><span style={{fontSize:11,color:C.textDim}}>{items.filter(x=>x.packed).length}/{items.length}</span></div>
{items.map((it,i)=>(<div key={i} style={{padding:"9px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:i<items.length-1?`1px solid ${C.borderLight}`:"none"}}>
<div onClick={canE?()=>upT(trip.id,tr=>({...tr,packing:{...tr.packing,[cat]:tr.packing[cat].map((x,j)=>j===i?{...x,packed:!x.packed}:x)}})):undefined} style={{width:18,height:18,borderRadius:5,border:it.packed?"none":`2px solid ${C.border}`,background:it.packed?C.sage:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:canE?"pointer":"default"}}>{it.packed&&<span style={{color:"#fff",fontSize:11}}>✓</span>}</div>
<span style={{flex:1,fontSize:13,textDecoration:it.packed?"line-through":"none",color:it.packed?C.textDim:C.text}}>{it.item}</span>
{canE&&trip&&<select value={it.assignedTo||""} onChange={ev=>{const v=ev.target.value||null;upT(trip.id,tr=>({...tr,packing:{...tr.packing,[cat]:tr.packing[cat].map((x,j)=>j===i?{...x,assignedTo:v}:x)}}))}} style={{padding:"2px 4px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:10,fontFamily:"inherit",background:C.bg,color:C.textSec,maxWidth:70}}><option value="">{t("unassigned")}</option>{trip.travelers.map(uid=>{const u=getU(uid);return<option key={uid} value={uid}>{u.name}</option>})}</select>}
<span style={{fontSize:11,color:C.textDim}}>×{it.qty}</span>
{canE&&<button onClick={()=>upT(trip.id,tr=>({...tr,packing:{...tr.packing,[cat]:tr.packing[cat].filter((_,j)=>j!==i)}}))} style={{background:"none",border:"none",color:C.danger,fontSize:13,cursor:"pointer"}}>×</button>}</div>))}</Card>))}

{canE&&<Card style={{padding:14,marginTop:12}} hover={false}>
<div style={{display:"flex",gap:6,marginBottom:8}}>
<input value={packCat} onChange={e=>setPC(e.target.value)} placeholder={t("category")} list="pcat" style={{flex:1,padding:"8px 12px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/><datalist id="pcat">{Object.keys(pk).map(c=><option key={c} value={c}/>)}</datalist>
<input value={packItem} onChange={e=>setPI(e.target.value)} placeholder={t("itemName")} style={{flex:1,padding:"8px 12px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/></div>
<button onClick={()=>{if(!packItem.trim())return;const cat=packCat.trim()||"Other";upT(trip.id,tr=>{const p={...tr.packing};p[cat]=[...(p[cat]||[]),{item:packItem.trim(),qty:1,packed:false,assignedTo:null}];return{...tr,packing:p}});setPI("");setPC("")}} style={{width:"100%",padding:"10px",borderRadius:10,background:C.sage,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ {t("add")}</button></Card>}
</div>)})()}

{/* ══ BUDGET TAB with Expense Splitting ══ */}
{tab==="budget"&&(()=>{const cur=trip.currency||"PLN";const exps=trip.expenses||[];const tS=exps.reduce((s,e)=>s+e.amount,0);const bT=trip.budget?.total||1;const grp={};exps.forEach(e=>{grp[e.cat]=(grp[e.cat]||0)+e.amount});const pie=Object.entries(grp).map(([c,v])=>({label:c,value:v,color:CAT_C[c]||C.textDim}));const hCur=currentUser?.prefs?.currency||"PLN";
const stlmts=calcSettlements(exps,trip.travelers,getU);
return(<div>
<Card style={{padding:20,marginBottom:14,background:`linear-gradient(135deg,${C.primaryLight},${C.white})`}} hover={false}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
<div><div style={{fontSize:11,color:C.textDim,textTransform:"uppercase",fontWeight:600}}>{t("spent")}</div><div style={{fontSize:28,fontWeight:800,fontFamily:Fn}}>{fmt(tS)} <span style={{fontSize:14,color:C.textSec}}>{cur}</span></div></div>
<div style={{textAlign:"right"}}><div style={{fontSize:11,color:C.textDim,fontWeight:600}}>{t("budget").toUpperCase()}</div>
{eBgt&&canE?<div style={{display:"flex",gap:4}}><input value={bIn} onChange={e=>setBI(e.target.value)} autoFocus type="number" onKeyDown={e=>{if(e.key==="Enter"){const v=parseInt(bIn);if(v>0)upT(trip.id,tr=>({...tr,budget:{...tr.budget,total:v}}));setEB(false)}}} style={{width:80,padding:"5px 8px",borderRadius:8,border:`1.5px solid ${C.primary}`,fontSize:14,fontWeight:700,fontFamily:Fn,textAlign:"right"}}/>
<button onClick={()=>{const v=parseInt(bIn);if(v>0)upT(trip.id,tr=>({...tr,budget:{...tr.budget,total:v}}));setEB(false)}} style={{padding:"5px 10px",borderRadius:8,background:C.sage,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>✓</button></div>
:<div onClick={canE?()=>{setEB(true);setBI(String(bT))}:undefined} style={{cursor:canE?"pointer":"default"}}><span style={{fontSize:16,fontWeight:700}}>{fmt(bT)} {cur}</span>{canE&&<span style={{fontSize:11,color:C.primary}}> ✎</span>}</div>}
<div style={{fontSize:12,color:tS<=bT?C.sage:C.danger,fontWeight:600,marginTop:2}}>{tS<=bT?`${fmt(bT-tS)} ${t("remaining")}`:`${fmt(tS-bT)} ${t("overBudget")}`}</div></div></div>
<Bar v={tS} mx={bT} color={tS<=bT?C.primary:C.danger} h={8}/></Card>

{/* Settlements */}
{stlmts.length>0&&<Card style={{padding:16,marginBottom:14,background:C.purpleLight,border:`1px solid ${C.purple}33`}} hover={false}>
<div style={{fontSize:13,fontWeight:700,fontFamily:Fn,color:C.purple,marginBottom:10}}>💸 {T.settlements[lang]}</div>
{stlmts.map((s,i)=>{const f=getU(s.from);const to=getU(s.to);return(
<div key={i} style={{padding:"8px 0",display:"flex",alignItems:"center",gap:8,borderBottom:i<stlmts.length-1?`1px solid ${C.purple}22`:"none"}}>
<Av user={f} size={24}/>
<span style={{fontSize:12,fontWeight:600}}>{f.name}</span>
<span style={{fontSize:11,color:C.textDim}}>→</span>
<Av user={to} size={24}/>
<span style={{fontSize:12,fontWeight:600}}>{to.name}</span>
<span style={{fontSize:13,fontWeight:700,color:C.purple,marginLeft:"auto"}}>{fmt(s.amount)} {cur}</span>
</div>
)})}
</Card>}

{exps.length>0&&<Card style={{overflow:"hidden",marginBottom:14}} hover={false}>
<div style={{padding:"10px 16px",borderBottom:`1px solid ${C.borderLight}`,fontSize:13,fontWeight:700}}>{t("expenses")} ({exps.length})</div>
{exps.map(e=>editExp===e.id?(<div key={e.id} style={{padding:"10px 16px",background:C.bgAlt,borderBottom:`1px solid ${C.borderLight}`}}>
<div style={{display:"flex",gap:6,marginBottom:6}}><input value={editExpD.name||""} onChange={ev=>setEED(p=>({...p,name:ev.target.value}))} style={{flex:2,padding:"6px 8px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}/>
<input value={editExpD.amount||""} onChange={ev=>setEED(p=>({...p,amount:ev.target.value}))} type="number" style={{flex:1,padding:"6px 8px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:12,fontFamily:"inherit",textAlign:"right"}}/>
<select value={editExpD.currency||cur} onChange={ev=>setEED(p=>({...p,currency:ev.target.value}))} style={{padding:"6px 4px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:11,fontFamily:"inherit"}}>{CURS.map(c=><option key={c}>{c}</option>)}</select></div>
<div style={{display:"flex",gap:6}}><select value={editExpD.cat||"Food"} onChange={ev=>setEED(p=>({...p,cat:ev.target.value}))} style={{flex:1,padding:"6px 8px",borderRadius:6,border:`1px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}>{Object.keys(CAT_I).map(c=><option key={c}>{c}</option>)}</select>
<button onClick={()=>{upT(trip.id,tr=>({...tr,expenses:tr.expenses.map(x=>x.id===e.id?{...x,...editExpD,amount:parseFloat(editExpD.amount)||x.amount}:x)}));setEE(null)}} style={{padding:"6px 14px",borderRadius:6,background:C.sage,border:"none",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer"}}>{t("save")}</button>
<button onClick={()=>setEE(null)} style={{padding:"6px 10px",borderRadius:6,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:11,cursor:"pointer"}}>✕</button>
<button onClick={()=>{upT(trip.id,tr=>({...tr,expenses:tr.expenses.filter(x=>x.id!==e.id)}));setEE(null)}} style={{padding:"6px 10px",borderRadius:6,background:`${C.danger}10`,border:`1px solid ${C.danger}33`,color:C.danger,fontSize:11,cursor:"pointer"}}>🗑</button></div></div>
):(<div key={e.id} onClick={canE?()=>{setEE(e.id);setEED({name:e.name,amount:e.amount,currency:e.currency||cur,cat:e.cat})}:undefined} style={{padding:"10px 16px",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${C.borderLight}`,cursor:canE?"pointer":"default"}}>
<span style={{fontSize:15}}>{CAT_I[e.cat]||"💰"}</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{e.name}</div><div style={{fontSize:11,color:C.textDim}}>{e.cat} · {e.date} · {T.paidBy[lang]}: {getU(e.payer).name}</div></div><div style={{fontSize:13,fontWeight:700}}>{fmt(e.amount)} {e.currency||cur}</div></div>))}</Card>}

{canE&&<Card style={{overflow:"hidden",marginBottom:14}} hover={false}>
{!newExpO?<div onClick={()=>{setNEO(true);setNE(p=>({...p,currency:cur,payer:currentUser.id}))}} style={{padding:"12px 16px",cursor:"pointer",textAlign:"center",color:C.primary,fontSize:13,fontWeight:600}}>+ {t("addExpense")}</div>
:<div style={{padding:14}}>
<div style={{display:"flex",gap:6,marginBottom:8}}><input value={newExp.name} onChange={e=>setNE(p=>({...p,name:e.target.value}))} placeholder={lang==="pl"?"Na co?":"What for?"} style={{flex:2,padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}/>
<input value={newExp.amount} onChange={e=>setNE(p=>({...p,amount:e.target.value}))} placeholder="0" type="number" style={{flex:1,padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",textAlign:"right"}}/></div>
<div style={{display:"flex",gap:6,marginBottom:8}}>
<select value={newExp.cat} onChange={e=>setNE(p=>({...p,cat:e.target.value}))} style={{flex:1,padding:"8px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}>{Object.keys(CAT_I).map(c=><option key={c}>{c}</option>)}</select>
<select value={newExp.currency} onChange={e=>setNE(p=>({...p,currency:e.target.value}))} style={{padding:"8px 6px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit"}}>{CURS.map(c=><option key={c}>{c}</option>)}</select></div>
<div style={{fontSize:11,fontWeight:600,color:C.textDim,marginBottom:4}}>{T.paidBy[lang]}</div>
<div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>{trip.travelers.map(uid=>{const u=getU(uid);return<Pill key={uid} small active={newExp.payer===uid} onClick={()=>setNE(p=>({...p,payer:uid}))}>{u.name}</Pill>})}</div>
<div style={{display:"flex",gap:6}}><button onClick={()=>{if(!newExp.name||!newExp.amount)return;upT(trip.id,tr=>({...tr,expenses:[...tr.expenses,{id:"e"+Date.now(),name:newExp.name,cat:newExp.cat,amount:parseFloat(newExp.amount),currency:newExp.currency,payer:newExp.payer||currentUser.id,splitAmong:[],date:new Date().toISOString().slice(0,10)}]}));setNE({name:"",cat:"Food",amount:"",currency:cur,payer:currentUser.id,splitAmong:[]});setNEO(false)}} style={{flex:2,padding:"10px",borderRadius:8,background:C.sage,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t("save")}</button>
<button onClick={()=>setNEO(false)} style={{flex:1,padding:"10px",borderRadius:8,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{t("cancel")}</button></div></div>}</Card>}

{exps.length>0&&<Card style={{padding:20,marginBottom:14}} hover={false}>
<div style={{fontSize:14,fontWeight:700,fontFamily:Fn,marginBottom:14}}>📊 {t("spendingBreakdown")}</div>
<div style={{display:"flex",gap:20,alignItems:"center",justifyContent:"center",flexWrap:"wrap"}}><Pie data={pie} size={140} currency={cur}/>
<div style={{flex:1,minWidth:140}}>{pie.sort((a,b)=>b.value-a.value).map(d=>(<div key={d.label} style={{marginBottom:10}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:3,background:d.color}}/><span style={{fontSize:12}}>{CAT_I[d.label]} {d.label}</span></div><span style={{fontSize:12,fontWeight:700}}>{fmt(d.value)} <span style={{fontWeight:400,color:C.textDim}}>{Math.round(d.value/tS*100)}%</span></span></div><Bar v={d.value} mx={tS} color={d.color} h={4}/></div>))}</div></div></Card>}

<Card style={{padding:16,background:C.blueLight,border:`1px solid ${C.blue}22`}} hover={false}>
<div style={{fontSize:12,fontWeight:700,color:C.blue,marginBottom:8}}>💱 {t("exchangeRates")} <span style={{fontWeight:400,fontSize:10,color:C.textDim}}>({t("indicative")})</span></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
{hCur!==cur&&<div style={{padding:8,background:C.white,borderRadius:8,fontSize:12}}>1 {hCur} = <strong>{getRate(hCur,cur).toFixed(cur==="JPY"?1:3)} {cur}</strong></div>}
{hCur!==cur&&<div style={{padding:8,background:C.white,borderRadius:8,fontSize:12}}>1 {cur} = <strong>{getRate(cur,hCur).toFixed(3)} {hCur}</strong></div>}
{hCur===cur&&<div style={{padding:8,background:C.white,borderRadius:8,fontSize:12,gridColumn:"1/3",textAlign:"center",color:C.textDim}}>{lang==="pl"?"Waluta budżetu = domowa":"Budget = home currency"} ({hCur})</div>}
</div></Card>
</div>)})()}

{/* ══ JOURNAL TAB ══ */}
{tab==="journal"&&(<div>
{canE&&<Card style={{padding:16,marginBottom:14}} hover={false}><div style={{display:"flex",gap:10}}><Av user={currentUser} size={32}/>
<div style={{flex:1}}><textarea value={jIn} onChange={e=>setJI(e.target.value)} placeholder={t("writeMemory")} rows={3} style={{width:"100%",padding:"10px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",resize:"vertical",background:C.bg}}/>
<div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}><button onClick={()=>{if(!jIn.trim())return;upT(trip.id,tr=>({...tr,journal:[...tr.journal,{id:"j"+Date.now(),date:new Date().toISOString().slice(0,10),author:currentUser.id,type:"text",content:jIn}]}));setJI("")}} style={{padding:"8px 18px",borderRadius:10,background:C.primary,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{lang==="pl"?"Opublikuj":"Post"}</button></div></div></div></Card>}
{(trip.journal||[]).length===0?<Card style={{padding:32,textAlign:"center"}} hover={false}><div style={{fontSize:40,marginBottom:12}}>📓</div><div style={{fontFamily:Fn,fontWeight:700}}>{t("yourJournal")}</div></Card>
:[...trip.journal].reverse().map(j=>{const a=getU(j.author);return(<Card key={j.id} style={{padding:16,marginBottom:10}} hover={false}><div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><Av user={a} size={28}/><span style={{fontSize:13,fontWeight:600}}>{a.name}</span><span style={{fontSize:11,color:C.textDim}}>{j.date}</span></div><p style={{fontSize:13,color:C.textSec,lineHeight:1.6}}>{j.content}</p></Card>)})}</div>)}

{/* ══ BOOKING TAB ══ */}
{tab==="booking"&&(<div>
{(trip.deals||[]).length>0&&<>{trip.deals.map((d,i)=>(<Card key={i} style={{padding:14,marginBottom:10}} onClick={()=>window.open(d.url,"_blank")}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:13,fontWeight:700}}>{d.name}</div><span style={{fontSize:10,fontWeight:700,color:"#fff",background:d.pColor,padding:"2px 6px",borderRadius:4,display:"inline-block",marginTop:4}}>{d.partner}</span></div><div style={{textAlign:"right"}}><div style={{fontSize:15,fontWeight:800,color:C.primary,fontFamily:Fn}}>{d.price}</div><div style={{fontSize:12,color:C.primary}}>→</div></div></div></Card>))}</>}

{/* Tickets Required */}
{(()=>{const needTickets=(trip.dayData||[]).flatMap((d,dI)=>d.items.filter(it=>it.cost>0&&it.type!=="food"&&it.type!=="transport").map(it=>({...it,dayIdx:dI,dayTitle:`${lang==="pl"?"Dzień":"Day"} ${d.day}: ${d.title}`})));return needTickets.length>0&&<><div style={{fontSize:14,fontWeight:700,fontFamily:Fn,marginTop:4,marginBottom:6}}>🎟️ {t("ticketsNeeded")}</div><p style={{fontSize:12,color:C.textSec,marginBottom:10}}>{t("ticketsDesc")}</p>{needTickets.map((it,i)=>(<Card key={it.id||i} style={{padding:14,marginBottom:8,border:`1px solid ${it.ticketBought?C.sage:C.gold}33`,background:it.ticketBought?C.sageLight:C.goldLight}} hover={false}><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:16}}>{tE[it.type]||"📍"}</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{it.name}</div><div style={{fontSize:11,color:C.textDim}}>{it.dayTitle} · {it.time} · {it.cost} {trip.currency}</div>{it.ticketUrl&&<a href={it.ticketUrl} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:C.blue,textDecoration:"none"}}>🔗 {lang==="pl"?"Link":"Link"} ↗</a>}</div><span style={{fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:99,background:it.ticketBought?C.sage:C.gold,color:"#fff"}}>{it.ticketBought?t("ticketBought"):t("ticketNeeded")}</span></div>{canE&&<div style={{display:"flex",gap:6,marginTop:8}}>{!it.ticketBought&&<button onClick={()=>upT(trip.id,tr=>({...tr,dayData:tr.dayData.map((d,di)=>di===it.dayIdx?{...d,items:d.items.map(x=>x.id===it.id?{...x,ticketBought:true}:x)}:d)}))} style={{padding:"5px 12px",borderRadius:6,background:C.sage,border:"none",color:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>✓ {lang==="pl"?"Kupione":"Bought"}</button>}<button onClick={()=>{const url=prompt(t("addTicketLink"),it.ticketUrl||"https://");if(url!==null)upT(trip.id,tr=>({...tr,dayData:tr.dayData.map((d,di)=>di===it.dayIdx?{...d,items:d.items.map(x=>x.id===it.id?{...x,ticketUrl:url}:x)}:d)}))}} style={{padding:"5px 12px",borderRadius:6,background:C.bgAlt,border:`1px solid ${C.border}`,color:C.textSec,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>🔗 Link</button></div>}</Card>))}</>})()}

{/* Compare Stays */}
<div style={{fontSize:14,fontWeight:700,fontFamily:Fn,marginTop:16,marginBottom:6}}>🏨 {t("compareStays")}</div>
<p style={{fontSize:12,color:C.textSec,marginBottom:12}}>{t("compareStaysDesc")}</p>
{(trip.comparisons||[]).map(c=>{const pr=getU(c.proposedBy);const mv=c.votes?.[currentUser?.id];const tv=c.votes?Object.values(c.votes).filter(v=>v===1).length:0;
return(<Card key={c.id} style={{padding:14,marginBottom:10}} hover={false}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
<div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,cursor:"pointer",color:C.blue}} onClick={()=>window.open(c.url,"_blank")}>{c.name} ↗</div>
<div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}><span style={{fontSize:10,fontWeight:700,color:"#fff",background:c.source==="Airbnb"?"#FF5A5F":"#003580",padding:"2px 6px",borderRadius:4}}>{c.source}</span><span style={{fontSize:12,fontWeight:700,color:C.primary}}>{c.price}</span>{c.rating&&<span style={{fontSize:11,color:C.gold}}>★ {c.rating}</span>}</div></div>
<div style={{display:"flex",alignItems:"center",gap:4,padding:"4px 8px",borderRadius:8,background:C.bgAlt}}><Av user={pr} size={18}/><span style={{fontSize:10,fontWeight:600,color:C.textSec}}>{pr.name}</span></div></div>
{c.notes&&<p style={{fontSize:12,color:C.textSec,marginBottom:6}}>{c.notes}</p>}
<div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
{(c.pros||[]).map((p,i)=><span key={i} style={{fontSize:10,padding:"3px 8px",borderRadius:99,background:C.sageLight,color:C.sage}}>✓ {p}</span>)}
{(c.cons||[]).map((p,i)=><span key={i} style={{fontSize:10,padding:"3px 8px",borderRadius:99,background:C.coralLight,color:C.coral}}>✕ {p}</span>)}</div>
<div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderTop:`1px solid ${C.borderLight}`}}>
{canE&&<button onClick={()=>upT(trip.id,tr=>({...tr,comparisons:tr.comparisons.map(x=>x.id===c.id?{...x,votes:{...x.votes,[currentUser.id]:mv===1?0:1}}:x)}))} style={{padding:"5px 12px",borderRadius:8,background:mv===1?C.sage:C.bgAlt,border:`1px solid ${mv===1?C.sage:C.border}`,color:mv===1?"#fff":C.textSec,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>👍 {t("approveThis")}</button>}
<span style={{fontSize:11,color:C.textDim}}>{tv} {t("votes")}</span></div></Card>)})}

{canE&&<Card style={{padding:14,marginBottom:16}} hover={false}>
<div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:8}}>{t("proposePlac")}</div>
<input value={compIn.name} onChange={e=>setCI(p=>({...p,name:e.target.value}))} placeholder={lang==="pl"?"Nazwa":"Name"} style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg,marginBottom:6}}/>
<input value={compIn.url} onChange={e=>setCI(p=>({...p,url:e.target.value}))} placeholder="URL (Booking/Airbnb)" style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg,marginBottom:6}}/>
<div style={{display:"flex",gap:6,marginBottom:8}}><input value={compIn.price} onChange={e=>setCI(p=>({...p,price:e.target.value}))} placeholder={lang==="pl"?"Cena/noc":"Price/night"} style={{flex:1,padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/><input value={compIn.notes} onChange={e=>setCI(p=>({...p,notes:e.target.value}))} placeholder={lang==="pl"?"Notatki":"Notes"} style={{flex:1,padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/></div>
<button onClick={()=>{if(!compIn.name)return;upT(trip.id,tr=>({...tr,comparisons:[...tr.comparisons,{id:"c"+Date.now(),name:compIn.name,url:compIn.url,source:compIn.url?.includes("airbnb")?"Airbnb":"Booking.com",price:compIn.price,rating:null,notes:compIn.notes,pros:[],cons:[],proposedBy:currentUser.id,votes:{[currentUser.id]:1}}]}));setCI({name:"",url:"",price:"",notes:""})}} style={{width:"100%",padding:"10px",borderRadius:10,background:C.primary,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ {t("add")}</button></Card>}
</div>)}

</div>{/* end padding div */}


</div>)}{/* end trip view */}

{/* ═══ MODALS ═══ */}

{/* Share Modal */}
<Modal open={showShare} onClose={()=>setSSh(false)} title={`🔗 ${t("shareTrip")}`}>
{trip&&<>
<Card style={{padding:16,marginBottom:12,background:C.blueLight,border:`1px solid ${C.blue}33`}} hover={false}>
<div style={{fontSize:13,fontWeight:600,marginBottom:8}}>{lang==="pl"?"Link do podróży":"Trip link"}</div>
<div style={{display:"flex",gap:8}}>
<input readOnly value={`${window.location.origin}/?trip=${trip.shareToken||trip.id}`} style={{flex:1,padding:"10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:11,fontFamily:"monospace",background:C.bg}}/>
<button onClick={handleShareCopy} style={{padding:"10px 16px",borderRadius:8,background:linkCopied?C.sage:C.primary,border:"none",color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>{linkCopied?"✓":t("copyLink")}</button>
</div></Card>

<button onClick={handleICSExport} style={{width:"100%",padding:"12px",borderRadius:12,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:C.text,marginBottom:12}}>📅 {t("exportCalendar")}</button>

{canE&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0"}}>
<span style={{fontSize:12,fontWeight:600,flex:1}}>{t("publicTrip")}</span>
<button onClick={()=>upT(trip.id,tr=>({...tr,isPublic:!tr.isPublic}))} style={{width:48,height:26,borderRadius:13,background:trip.isPublic?C.sage:C.border,border:"none",cursor:"pointer",position:"relative",transition:"background 0.2s"}}><div style={{width:22,height:22,borderRadius:11,background:"#fff",position:"absolute",top:2,left:trip.isPublic?24:2,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/></button>
</div>}
</>}</Modal>

{/* Trip Wizard */}
<Modal open={showWiz} onClose={()=>{setSW(false);setWS(0)}} title={wStep===0?t("whereGoing"):wStep===1?t("whenWho"):t("almostThere")}>
{wStep===0&&<div><input value={wData.dest} onChange={e=>setWD(p=>({...p,dest:e.target.value}))} placeholder={lang==="pl"?"np. Barcelona, Tokio, Rzym":"e.g. Barcelona, Tokyo, Rome"} autoFocus style={{width:"100%",padding:"14px 16px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:15,fontFamily:"inherit",background:C.bg,marginBottom:16}}/>
<div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>{INSP.map(d=><Pill key={d.name} active={wData.dest===d.name} onClick={()=>setWD(p=>({...p,dest:d.name}))}>{d.name}</Pill>)}</div>
<button disabled={!wData.dest} onClick={()=>setWS(1)} style={{width:"100%",padding:"14px",borderRadius:12,background:wData.dest?C.primary:C.border,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:wData.dest?"pointer":"default",fontFamily:"inherit"}}>{lang==="pl"?"Dalej →":"Next →"}</button></div>}
{wStep===1&&<div><div style={{display:"flex",gap:10,marginBottom:12}}><div style={{flex:1}}><label style={{fontSize:11,color:C.textDim,fontWeight:600,display:"block",marginBottom:4}}>{lang==="pl"?"Od":"From"}</label><input type="date" value={wData.startDate} onChange={e=>setWD(p=>({...p,startDate:e.target.value}))} style={{width:"100%",padding:"10px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",background:C.bg}}/></div><div style={{flex:1}}><label style={{fontSize:11,color:C.textDim,fontWeight:600,display:"block",marginBottom:4}}>{lang==="pl"?"Do":"To"}</label><input type="date" value={wData.endDate} onChange={e=>setWD(p=>({...p,endDate:e.target.value}))} style={{width:"100%",padding:"10px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",background:C.bg}}/></div></div>
<label style={{fontSize:11,color:C.textDim,fontWeight:600,display:"block",marginBottom:4}}>{t("travelers")}</label>
<div style={{display:"flex",gap:6,marginBottom:12}}>{[1,2,3,4,5,"6+"].map(n=><Pill key={n} active={wData.travelers===n} onClick={()=>setWD(p=>({...p,travelers:n}))}>{n}</Pill>)}</div>
<div style={{display:"flex",gap:8}}><button onClick={()=>setWS(0)} style={{flex:1,padding:"12px",borderRadius:12,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:13,cursor:"pointer",fontFamily:"inherit",color:C.textSec}}>←</button><button onClick={()=>setWS(2)} style={{flex:2,padding:"12px",borderRadius:12,background:C.primary,border:"none",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{lang==="pl"?"Dalej →":"Next →"}</button></div></div>}
{wStep===2&&<div><input value={wData.name} onChange={e=>setWD(p=>({...p,name:e.target.value}))} placeholder={`"${wData.dest} Adventure"`} style={{width:"100%",padding:"14px 16px",borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:15,fontFamily:"inherit",background:C.bg,marginBottom:16}}/>
<Card style={{padding:16,marginBottom:16,background:C.bgAlt}} hover={false}><div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:4}}>{t("tripSummary")}</div><div style={{fontSize:14,fontWeight:700,fontFamily:Fn}}>{wData.name||`${wData.dest} Trip`}</div><div style={{fontSize:12,color:C.textSec}}>📍 {wData.dest} · 📅 {wData.startDate||"?"} – {wData.endDate||"?"} · 👥 {wData.travelers}</div></Card>
<div style={{display:"flex",gap:8}}><button onClick={()=>setWS(1)} style={{flex:1,padding:"12px",borderRadius:12,background:C.bgAlt,border:`1px solid ${C.border}`,fontSize:13,cursor:"pointer",fontFamily:"inherit",color:C.textSec}}>←</button><button onClick={createTrip} style={{flex:2,padding:"14px",borderRadius:12,background:`linear-gradient(135deg,${C.primary},${C.coral})`,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{t("createTrip")}</button></div></div>}
</Modal>

{/* Add Day */}
<Modal open={showAddDay} onClose={()=>setSAD(false)} title={t("addDay")}>
<input value={newDay.title} onChange={e=>setND(p=>({...p,title:e.target.value}))} placeholder={t("dayTitle")} autoFocus style={{width:"100%",padding:"12px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",background:C.bg,marginBottom:8}}/>
<input type="date" value={newDay.date} onChange={e=>setND(p=>({...p,date:e.target.value}))} style={{width:"100%",padding:"12px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",background:C.bg,marginBottom:12}}/>
<button onClick={()=>{if(!newDay.title)return;upT(trip.id,tr=>({...tr,dayData:[...tr.dayData,{day:tr.dayData.length+1,date:newDay.date||`Day ${tr.dayData.length+1}`,title:newDay.title,items:[],weather:null,img:null,steps:{}}]}));setND({title:"",date:""});setSAD(false)}} style={{width:"100%",padding:"14px",borderRadius:12,background:C.primary,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{t("add")}</button></Modal>

{/* Add Activity with coordinates */}
<Modal open={showAddAct!==null} onClose={()=>setSAA(null)} title={t("addActivity")}>
<input value={newAct.name} onChange={e=>setNA(p=>({...p,name:e.target.value}))} placeholder={t("activityName")} autoFocus style={{width:"100%",padding:"12px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",background:C.bg,marginBottom:8}}/>
<div style={{display:"flex",gap:8,marginBottom:8}}>
<div style={{flex:1}}><label style={{fontSize:11,color:C.textDim,fontWeight:600}}>{t("time")}</label><input type="time" value={newAct.time} onChange={e=>setNA(p=>({...p,time:e.target.value}))} style={{width:"100%",padding:"8px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/></div>
<div style={{flex:1}}><label style={{fontSize:11,color:C.textDim,fontWeight:600}}>{t("duration")}</label><select value={newAct.duration} onChange={e=>setNA(p=>({...p,duration:e.target.value}))} style={{width:"100%",padding:"8px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}>{["30min","45min","1h","1.5h","2h","2.5h","3h","4h"].map(d=><option key={d}>{d}</option>)}</select></div>
<div style={{flex:1}}><label style={{fontSize:11,color:C.textDim,fontWeight:600}}>{t("type")}</label><select value={newAct.type} onChange={e=>setNA(p=>({...p,type:e.target.value}))} style={{width:"100%",padding:"8px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}>{Object.keys(tE).map(tp=><option key={tp}>{tp}</option>)}</select></div></div>
<div style={{display:"flex",gap:8,marginBottom:8}}>
<input value={newAct.desc} onChange={e=>setNA(p=>({...p,desc:e.target.value}))} placeholder={lang==="pl"?"Opis":"Description"} style={{flex:2,padding:"8px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/>
<input value={newAct.cost} onChange={e=>setNA(p=>({...p,cost:parseInt(e.target.value)||0}))} placeholder={t("cost")} type="number" style={{flex:1,padding:"8px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg,textAlign:"right"}}/></div>
<div style={{display:"flex",gap:8,marginBottom:12}}>
<div style={{flex:1}}><label style={{fontSize:11,color:C.textDim,fontWeight:600}}>📍 Lat</label><input value={newAct.lat||""} onChange={e=>setNA(p=>({...p,lat:parseFloat(e.target.value)||null}))} placeholder="44.4268" type="number" step="0.0001" style={{width:"100%",padding:"8px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/></div>
<div style={{flex:1}}><label style={{fontSize:11,color:C.textDim,fontWeight:600}}>📍 Lng</label><input value={newAct.lng||""} onChange={e=>setNA(p=>({...p,lng:parseFloat(e.target.value)||null}))} placeholder="26.1025" type="number" step="0.0001" style={{width:"100%",padding:"8px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/></div>
</div>
<p style={{fontSize:11,color:C.textDim,marginBottom:10}}>{lang==="pl"?"Dodaj współrzędne aby atrakcja pojawiła się na mapie. Propozycja wymaga głosowania (>50%).":"Add coordinates to show on map. Proposal requires voting (>50%)."}</p>
<button onClick={()=>{if(!newAct.name||showAddAct===null)return;upT(trip.id,tr=>({...tr,dayData:tr.dayData.map((d,i)=>i===showAddAct?{...d,items:[...d.items,{id:"a"+Date.now(),time:newAct.time,name:newAct.name,desc:newAct.desc,type:newAct.type,duration:newAct.duration,cost:newAct.cost,rating:0,votes:{[currentUser.id]:1},fav:{},status:trip.travelers.length<=1?"approved":"pending",lat:newAct.lat,lng:newAct.lng}]}:d)}));setSAA(null)}} style={{width:"100%",padding:"14px",borderRadius:12,background:C.primary,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>+ {t("proposeActivity")}</button></Modal>

{/* Invite */}
<Modal open={showInv} onClose={()=>setSI(false)} title={t("inviteSomeone")}>
<input value={invEmail} onChange={e=>setIE(e.target.value)} placeholder="friend@email.com" style={{width:"100%",padding:"12px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",background:C.bg,marginBottom:12}}/>
{[{id:"companion",t:tO(ROLES.companion.l),d:lang==="pl"?"Edycja planu, budżet, dziennik.":"Edit plan, budget, journal.",i:"🤝"},{id:"observer",t:tO(ROLES.observer.l),d:lang==="pl"?"Tylko podgląd.":"View only.",i:"👁️"}].map(r=>(<div key={r.id} onClick={()=>setIR(r.id)} style={{padding:14,borderRadius:12,border:`1.5px solid ${invRole===r.id?C.primary:C.border}`,marginBottom:8,cursor:"pointer",background:invRole===r.id?C.primaryLight:"transparent"}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{r.i}</span><div><div style={{fontSize:13,fontWeight:600}}>{r.t}</div><div style={{fontSize:11,color:C.textSec}}>{r.d}</div></div></div></div>))}
<button onClick={()=>{setSI(false);setIE("");showToast(lang==="pl"?"Zaproszenie wysłane!":"Invitation sent!")}} style={{width:"100%",marginTop:8,padding:"14px",borderRadius:12,background:C.primary,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{lang==="pl"?"Wyślij zaproszenie":"Send Invitation"}</button></Modal>

{/* Profile */}
<Modal open={showProf} onClose={()=>setSP(false)} title={t("myProfile")} wide>
{currentUser&&<>
<div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}><div style={{position:"relative",cursor:"pointer"}} onClick={()=>document.getElementById("photoIn")?.click()}><Av user={currentUser} size={56}/><div style={{position:"absolute",inset:0,borderRadius:"50%",background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity 0.2s"}} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0}><span style={{color:"#fff",fontSize:16}}>📷</span></div><input id="photoIn" type="file" accept="image/*" onChange={handlePhotoUpload} style={{display:"none"}}/></div><div><div style={{fontSize:18,fontWeight:800,fontFamily:Fn}}>{currentUser.name}</div><div style={{fontSize:12,color:C.textSec}}>{currentUser.email}</div><div style={{fontSize:10,color:C.textDim,cursor:"pointer",marginTop:2}} onClick={()=>document.getElementById("photoIn")?.click()}>{t("clickToChangePhoto")}</div><span style={{fontSize:10,fontWeight:700,color:ROLES[currentUser.role].color,background:`${ROLES[currentUser.role].color}15`,padding:"3px 10px",borderRadius:99,textTransform:"uppercase",marginTop:4,display:"inline-block"}}>{tO(ROLES[currentUser.role].l)}</span></div></div>
<div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:8}}>{t("socialMedia").toUpperCase()}</div>
{[{k:"instagram",i:"📸",p:"@username"},{k:"facebook",i:"📘",p:"Link"},{k:"tiktok",i:"🎵",p:"@username"}].map(s=>(<div key={s.k} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><span style={{fontSize:14,width:24}}>{s.i}</span><input value={currentUser.social?.[s.k]||""} onChange={e=>{const v=e.target.value;setCU(p=>({...p,social:{...p.social,[s.k]:v}}));setUsers(us=>us.map(u=>u.id===currentUser.id?{...u,social:{...u.social,[s.k]:v}}:u))}} placeholder={s.p} style={{flex:1,padding:"7px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",background:C.bg}}/></div>))}

<div style={{fontSize:14,fontWeight:700,fontFamily:Fn,marginTop:16,marginBottom:6}}>🫂 {t("travelFriends")}</div>
<p style={{fontSize:12,color:C.textSec,marginBottom:10}}>{t("travelFriendsDesc")}</p>
{(currentUser.friends||[]).length===0&&<p style={{fontSize:12,color:C.textDim,fontStyle:"italic"}}>{t("noFriendsYet")}</p>}
{(currentUser.friends||[]).map(fid=>{const f=getU(fid);return(<div key={fid} style={{padding:"8px 0",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${C.borderLight}`}}><Av user={f} size={28}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{f.name}</div><div style={{fontSize:11,color:C.textDim}}>{f.email}</div></div><button onClick={()=>{setCU(p=>({...p,friends:p.friends.filter(x=>x!==fid)}));setUsers(us=>us.map(u=>u.id===currentUser.id?{...u,friends:u.friends.filter(x=>x!==fid)}:u))}} style={{background:"none",border:"none",color:C.danger,fontSize:12,cursor:"pointer"}}>✕</button></div>)})}
{!showAF?<button onClick={()=>setSAF(true)} style={{marginTop:8,padding:"8px 16px",borderRadius:8,background:C.blueLight,border:`1px solid ${C.blue}33`,color:C.blue,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>+ {t("addFriend")}</button>
:<div style={{marginTop:8}}><input value={fSearch} onChange={e=>setFS(e.target.value)} placeholder={lang==="pl"?"Szukaj...":"Search..."} style={{width:"100%",padding:"8px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,fontSize:12,fontFamily:"inherit",marginBottom:6,background:C.bg}}/>
{users.filter(u=>u.id!==currentUser.id&&!(currentUser.friends||[]).includes(u.id)&&(u.name.toLowerCase().includes(fSearch.toLowerCase()))).map(u=>(<div key={u.id} onClick={()=>{setCU(p=>({...p,friends:[...(p.friends||[]),u.id]}));setUsers(us=>us.map(x=>x.id===currentUser.id?{...x,friends:[...(x.friends||[]),u.id]}:x));setSAF(false);setFS("")}} style={{padding:"8px 10px",display:"flex",alignItems:"center",gap:8,borderRadius:8,cursor:"pointer",border:`1px solid ${C.border}`,marginBottom:4}}><Av user={u} size={24}/><span style={{fontSize:12,fontWeight:600}}>{u.name}</span></div>))}</div>}

<div style={{fontSize:14,fontWeight:700,fontFamily:Fn,marginTop:16,marginBottom:10}}>{t("tripStats")}</div>
<div style={{display:"flex",gap:10}}>{[{l:lang==="pl"?"Podróże":"Trips",v:trips.filter(tr=>tr.travelers.includes(currentUser.id)).length},{l:lang==="pl"?"Kraje":"Countries",v:3},{l:lang==="pl"?"Dni":"Days",v:13}].map(s=>(<div key={s.l} style={{flex:1,padding:12,background:C.bgAlt,borderRadius:12,textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,fontFamily:Fn,color:C.primary}}>{s.v}</div><div style={{fontSize:10,color:C.textDim}}>{s.l}</div></div>))}</div>

<button onClick={()=>{setLoggedIn(false);setCU(null);setScr("home");setAT(null);setSP(false)}} style={{width:"100%",marginTop:20,padding:"12px",borderRadius:12,background:C.bgAlt,border:`1px solid ${C.danger}33`,color:C.danger,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t("signOut")}</button>
</>}</Modal>

{/* Travelers */}
<Modal open={showTrav} onClose={()=>setST(false)} title={t("tripMembers")} wide>
{trip&&<>
<div style={{fontSize:12,fontWeight:700,color:C.textDim,marginBottom:8,textTransform:"uppercase"}}>{t("travelers")} ({trip.travelers.length})</div>
{trip.travelers.map(uid=>{const u=getU(uid);return(<div key={uid} style={{padding:"12px 0",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${C.borderLight}`}}><Av user={u} size={36}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{u.name}</div><div style={{fontSize:11,color:C.textDim}}>{u.email}</div>{u.social?.instagram&&<span style={{fontSize:10,color:C.purple}}>📸 {u.social.instagram}</span>}</div><span style={{fontSize:10,fontWeight:700,color:ROLES[u.role||"user"].color,background:`${ROLES[u.role||"user"].color}15`,padding:"3px 10px",borderRadius:99,textTransform:"uppercase"}}>{tO(ROLES[u.role||"user"].l)}</span></div>)})}
{(trip.observers||[]).length>0&&<><div style={{fontSize:12,fontWeight:700,color:C.textDim,marginTop:16,marginBottom:8,textTransform:"uppercase"}}>{t("observers")} ({trip.observers.length})</div>{trip.observers.map(uid=>{const u=getU(uid);return(<div key={uid} style={{padding:"12px 0",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${C.borderLight}`}}><Av user={u} size={36}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{u.name}</div></div><span style={{fontSize:10,fontWeight:700,color:ROLES.observer.color,background:`${ROLES.observer.color}15`,padding:"3px 10px",borderRadius:99,textTransform:"uppercase"}}>{tO(ROLES.observer.l)}</span></div>)})}</>}
{canE&&<button onClick={()=>{setST(false);setSI(true)}} style={{width:"100%",marginTop:16,padding:"12px",borderRadius:12,background:C.primary,border:"none",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{t("inviteSomeone")}</button>}
</>}</Modal>

{/* Save/Load Packing */}
<Modal open={showSP2} onClose={()=>setSP2(false)} title={`💾 ${t("saveList")}`}>
<input value={spName} onChange={e=>setSPN(e.target.value)} placeholder={lang==="pl"?"Nazwa listy":"List name"} autoFocus style={{width:"100%",padding:"12px",borderRadius:10,border:`1.5px solid ${C.border}`,fontSize:13,fontFamily:"inherit",background:C.bg,marginBottom:12}}/>
<button onClick={()=>{if(!spName.trim()||!trip)return;setSL(p=>[...p,{id:"sl_"+Date.now(),name:spName.trim(),items:{...trip.packing}}]);setSP2(false);setSPN("")}} style={{width:"100%",padding:"14px",borderRadius:12,background:C.sage,border:"none",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{t("save")}</button></Modal>

<Modal open={showLP} onClose={()=>setSLP(false)} title={`📂 ${t("loadList")}`}>
{savedLists.map(sl=>(<Card key={sl.id} style={{padding:14,marginBottom:8,cursor:"pointer"}} onClick={()=>{if(!trip)return;const np={};Object.entries(sl.items).forEach(([c,items])=>{np[c]=items.map(it=>({...it,packed:false}))});upT(trip.id,tr=>({...tr,packing:{...tr.packing,...np}}));setSLP(false)}}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontSize:14,fontWeight:600}}>{sl.name}</div><div style={{fontSize:11,color:C.textDim}}>{Object.values(sl.items).flat().length} items</div></div><button onClick={e=>{e.stopPropagation();setSL(p=>p.filter(x=>x.id!==sl.id))}} style={{background:"none",border:"none",color:C.danger,fontSize:14,cursor:"pointer"}}>🗑</button></div></Card>))}
{savedLists.length===0&&<div style={{textAlign:"center",padding:20,color:C.textDim}}>{lang==="pl"?"Brak zapisanych list.":"No saved lists."}</div>}</Modal>

{/* Celebration */}
<Modal open={showCelebration} onClose={()=>setSC(false)} title="">
<div style={{textAlign:"center",padding:20}}>
<div style={{fontSize:60,marginBottom:16}}>🎉</div>
<div style={{fontSize:20,fontWeight:800,fontFamily:Fn,marginBottom:8}}>{t("allApprovedTitle")}</div>
<p style={{fontSize:14,color:C.textSec,lineHeight:1.6,marginBottom:16}}>{t("allApprovedMsg")}</p>
<button onClick={()=>setSC(false)} style={{padding:"14px 32px",borderRadius:12,background:`linear-gradient(135deg,${C.primary},${C.coral})`,border:"none",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:Fn}}>{t("letsGo")}</button>
</div></Modal>

{/* PWA Install Banner */}
<InstallBanner lang={lang}/>

</div>)}
