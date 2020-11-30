export default {
  'button': {
    'next': 'POKRAČOVAT',
    'validate': 'POTVRDIT',
  },
  'geolocation': {
    'text': 'HYGO neslyšně běží v pozadí :)',
  },
  'months': {
    'january': 'leden',
    'february': 'únor',
    'march': 'březen',
    'april': 'duben',
    'may': 'květen',
    'june': 'červen',
    'july': 'červenec',
    'august': 'srpen',
    'september': 'září',
    'october': 'říjen',
    'november': 'listopad',
    'december': 'prosinec'
  },
  'days': {
    'monday': 'pondělí',
    'tuesday': 'úterý',
    'wednesday': 'středa',
    'thursday': 'čtvrtek',
    'friday': 'pátek',
    'saturday': 'sobota',
    'sunday': 'neděle',
  },
  'soils': {
    'SOIL_TEST': 'Soil Test',
    'SABLE': 'Pískovitá',
    'SABLE_TERREAU': 'Pískovitá hlína',
    'TERREAU': 'Hlína',
    'TERREAU_ARGILE': 'Bahnitá hlína',
    'ARGILE': 'Jílovitá',
    'CRAIE' : 'Vápenitá půda',
    'none': 'Žádný typ zeminy nevybrán'
  },
  'drawer': {
    'account': 'Můj profil',
    'parcelles': 'Má pole',
    'contact': 'Kontaktujte nás',
    'logout': 'Odpojit se',
    'hygo_serial': 'Sériové číslo : %{serial}',
    'hygo_model': 'Model senzoru : %{model}',
    'app_version': 'Verze aplikace : %{version}',
    'build_number': 'Build %{build}',
    'email_subject': 'HYGO: Potřebuji asistenci',
    'equipment': 'Moje vybavení',
  },
  'barcode_validation': {
    'title_notice': 'Spárování aplikace a senzoru HYGO proběhlo úspěšně!',
    'text_notice_1': 'Nyní prosím nastavte svůj uživatelský profil',
    'text_notice_2': 'Vaše zemědělská předpověď počasí na míru je připravena',
  },
  'modulation': {
    'dose_computation': 'Výpočet možného snížení dávky produktu',
  },
  'bar_code': {
    'notice': 'Pro spárování Vaší mobilní aplikace oskenujte QR kód na Vašem senzoru HYGO',
    'welcome': 'Vítejte!',
    'retry_barcode': 'Oskenovat QR kód znovu',
    'camera_description': 'Pro oskenování QR kódu na senzoru HYGO potřebujeme přístup k fotoaparátu Vašeho mobilního telefonu ',
    'retry_camera': 'Zkusit znovu',
    'qr_error': {
      'signin': 'QR kód nebyl rozpoznán',
      'network': 'Chyba datové sítě'
    }
  },
  'wait_screen': {
    'wait': {
      'msg1': 'Zasíváme data na našich serverových polích.',
      'msg2': 'Úroda bude brzy hotová !'
    },
    'no_parcels': {
      'msg1': 'Zatím jsme neobdrželi data o Vašich polích.',
      'msg2' : 'Prosím, kontaktujte nás'
    },
    'need_update': {
      'msg1': 'Máme úrodu pro Vaši aplikaci !',
      'msg2': 'Pro pokračování je třeba naistalovat novou verzi aplikace.'
    }
  },
  'equipment': {
    'header': 'Moje vybavení',
    'title_notice': 'Vaše zemědělské vybavení',
    'text_notice': 'Prosím, vyplňte několik důležitých informací',

    'buses': 'Mé postřikovací trysky',
    'speed': 'Rychlost pohybu mého postřikovacího zařízení (km/h)',
    'pressure': 'Tlak v postřikovači (Bar)',
    'type_soil': 'Převažující druh zeminy',

    'saving_info': 'Ukládám Vaše informace...',

    'buses_family': 'Druh postřikovací trysky',
    'no_buse': 'Žádný typ trysky nevybrán',

    'buses_CLASSIC_STD': 'Štěrbinové standardní trysky',
    'buses_CLASSIC_LOW': 'Štěrbinové nízkotlakové trysky',
    'buses_CALIBRATE': 'Anti-driftové trysky',
    'buses_INJECTION': 'Trysky s přisáváním vzduchu',

    'orange': 'Oranžová 01',
    'green': 'Zelená 02',
    'yellow': 'Žlutá 03',
    'blue': 'Modrá 04',
    'red': 'Červená 05',
    'brown': 'Hnědá 06',
    'grey': 'Šedá 07',
    'white': 'Bílá 08',
  },
  'meteo': {
    'header': 'Má předpověď počasí',
    'brief': 'V kostce',
    'detailed': 'Detailní',
    'radar': 'Radar',
    'next_3_hours': 'V příštích třech hodinách',
    'parcelle_percent': '%{percent}% Vašich polí může být ošetřeno',
    'condition_BAD': 'Špatné počasí pro postřik',
    'condition_FORBIDDEN': 'Velmi špatné počasí pro postřik',
    'condition_CORRECT': 'Dobré počasí pro postřik',
    'condition_EXCELLENT': 'Ideální nebo velmi dobré počasí pro postřik',
    'condition_GOOD': 'Ideální nebo velmi dobré počasí pro postřik',
    'plan': 'Naplánovat postřik',
  },
  'intervention': {
    'header': "Mapa úspěšnosti postřiku v závislosti na počasí",
    'header_top': 'Postřik dne: %{day} od: %{start} do: %{end}',
    'header_bottom': '%{number} polí ošetřeno',
    'no_phyto_selected': 'Nevybrán žádný typ produktu',
    'no_data': 'Žádné informace o předchozích postřicích. V případě potíží kontaktujte 0033 668 48 38 83',
  },
  'intervention_map': {
    'header': 'Postřik dne %{date}',
    'header_phyto': 'Produkt : %{phyto}',
    'header_clock': 'Začátek : %{start} - Konec : %{end}',
    'surface': 'Celková ošetřená plocha : %{surface} ha',
    'excellent': 'Ideální počasí pro postřik',
    'good': 'Velmi dobré počasí pro postřik',
    'correct': 'Dobré počasí pro postřik',
    'bad': 'Špatné počasí pro postřik',
    'forbidden': 'Velmi špatné počasí pro postřik',
    'min': 'min %{value}',
    'max': 'max %{value}',
    'avg': 'prům %{value}',
    'rain': 'Déšť : %{value}',
    'other_farm_work': 'Jiný druh zemědělských prací',
  },
  "phyto": {
    "no_phyto": "Žádný produkt nevybrán",
  },
  'realtime': {
    'header': 'Analýza v reálném čase',
    'no_data': 'Žádné informace o postřicích nebyly registrovány během posledních 4 hodin. V případě potíží kontaktujte 0033 668 48 38 83',
    'last_hour': 'Poslední měření v %{value}',
    'next_cuve': 'Naplánovat další postřik',
    'hygro': 'Vlhkost vzduchu',
    'temp': 'Teplota',
    'pluvio': 'Pluviométrie',
    'vent': 'Vent',
    'no_parcelle': 'MIMO VAŠE POLE',
    'no_product': 'ŽÁDNÝ PRODUKT NEVYBRÁN',
    'no_data_3_hours': 'Žádné měření během posledních tří hodin',
    'waiting_for_data': 'Čekám na data ze senzoru',
    'goto_cuve': 'Začít plánování postřiku',
    'status_conditions_EXCELLENT': 'Ideální počasí pro postřik',
    'status_conditions_GOOD': 'Velmi dobré počasí pro postřik',
    'status_conditions_CORRECT': 'Dobré počasí pro postřik',
    'status_conditions_BAD': 'Špatné počasí pro postřik',
    'status_conditions_FORBIDDEN': 'Velmi špatné počasí pro postřik',
    'dewpoint': 'Rosný bod',
    'intervention': 'Postřik'
  },
  'fields': {
    'parcelles': 'Celková plocha polí : %{value}',
    'culture': 'Plodina : %{value}',
    'area': 'Výměra : %{value} ha',
    'name': 'Název',
    'unknown': 'Neznámé',
    'header': 'Moje zemědělství',
  },
  'meteo_detailed': {
    'days_0': 'PON',
    'days_1': 'ÚTE',
    'days_2': 'STŘ',
    'days_3': 'ČTV',
    'days_4': 'PÁT',
    'days_5': 'SOB',
    'days_6': 'NED',
    'pulve_title': 'Mé zemědělské postřiky (%{value})',
    'pulve_title2': 'Mé zemědělské postřiky',
    'hygro': 'Hygrométrie',
    'temp': 'Température',
    'pluvio': 'Pluviométrie',
    'vent': 'Vent',
  },
  'meteo_overlay': {
    'header': '%{from}H - %{to}H',
    'map_header': '%{value} ve vybraném časovém rozmezí',
    'excellent': 'Ideální',
    'good': 'Velmi dobré',
    'correct': 'Dobré',
    'bad': 'Špatné',
    'forbidden': 'Velmi špatné',
    'hygro': 'Vlhk : %{value}%',
    'temp': 'Tepl : %{value}°C',
    'delta_temp': 'Výkyv 48h : %{value}°C',
    'wind': 'Vítr : ',
    'wind_speed': '%{winddir} %{value} km/h',
    'wind_gust': 'RAF %{value} km/h',
    'precipitation': 'Déšť : %{value} mm',
    'precipitation_r2': 'Déšť 2h : %{value} mm',
    'precipitation_r3': 'Déšť 3h : %{value} mm',
    'precipitation_r6': 'Déšť 6h : %{value} mm',
    'soil': 'Půda : ',
    'soil_humi': 'V %{value}%',
    'soil_temp': 'T %{value}°C',
    'white_EXCELLENT_everywhere': 'V této době jsou ideální podmínky na postřik na všech Vašich polích:)',
    'white_EXCELLENT_some': 'V této době můžete postřikovat ve skvělých podmínkách na %{value}% Vašich polí',
    'white_GOOD_everywhere': 'V této době jsou velmi dobré podmínky na postřik na všech Vašich polích :) ',
    'white_GOOD_some': 'V této době můžete postřikovat ve velmi dobrých podmínkách na %{value}% Vašich polí',
    'white_CORRECT_everywhere': 'V této době jsou dobré podmínky na postřik na všech Vašich polích :) Do ideálních podmínek Vám chybí pouze maličko ;) ',
    'white_CORRECT_some': 'V této době můžete postřikovat v dobrých podmínkách na %{value}% Vašich polí',
    'white_BAD_everywhere': 'V této době se pokud možno vyhněte postřikování na Vašich polích - pokud máte možnost uskutečnit postřik jindy :( ',
    'white_FORBIDDEN_everywhere': 'Pozor! V této době není dovoleno postřikovat na Vašich polích',
  },
  'pulverisation': {
    'header': 'Plánování',
    'culture_type': 'Typ plodiny',
    'select_text': 'Vyberte typ produktu a plodiny, které plánujete ošetřit při Vašem příštím postřiku.',
    'select_hours_text': 'Vyberte preferovaný čas postřiku v příštích 48 hodinách',
    'product_type': 'TYP PRODUKTU',
    'culture_type': 'TYPE PLODINY',
    'start': 'reálný čas',
    'computation_hint': '* Výpočet na základě Vašeho výběru produktu, plodiny a času',
    'reduce_dosage': 'Doporučené snížení dávky* ',
    'all_cultures': 'Všechny druhy plodin',
  },
  'picker': {
    'header': 'Vyberte jednu hodnotu',
  },
  'cultures': {
    'Mix de grandes cultures': 'Smíšené plodiny',
    'Smíšené plodiny': 'Smíšené plodiny',
    'Blé tendre d’hiver': 'Pšenice (ozimná)',
    'Blé tendre de printemps': 'Pšenice (jarní)',
    'Maïs doux': 'Kukuřice sladká',
    'Maïs ensilage': 'Kukuřice (silážní)',
    'Maïs': 'Kukuřice',
    'Orge d\'hiver': 'Ječmen (ozimný)',
    'Orge de printemps': 'Ječmen (jarní)',
    'Blé dur d’hiver': 'Tvrdá pšenice (ozimná)',
    'Blé dur de printemps': 'Tvrdá pšenice (jarní)',
    'Blé dur de printemps semé tardivement (après le 31/05)': 'Tvrdá pšenice (pozdní jarní)',
    'Colza d’hiver': 'Řepka (ozimná)',
    'Colza de printemps': 'Řepka (jarní)',
    'Tournesol': 'Slunečnice',
    'Lin non textile d’hiver': 'Len (netextilní, ozimný)',
    'Lin non textile de printemps': 'Len (netextilní, jarní)',
    'Soja': 'Sója',
    'Pois d’hiver': 'Hrášek (ozimný)',
    'Pois de printemps semé avant le 31/05': 'Hrášek (jarní)',
    'Pois de printemps semé tardivement (après le 31/05)': 'Hrášek (pozdní jarní)',
    'Betterave fourragère': 'Krmná řepa',
    'Prairie permanente - herbe prédominante (ressources fourragères ligneuses absentes ou peu présentes)': 'Stálá louka',
    'Prairie en rotation longue (6 ans ou plus)': 'Louka s dlouhou rotací',
    'Autre prairie temporaire de 5 ans ou moins': 'Krátkodobá louka',
    'Betterave non fourragère / Bette': 'Řepa - mangold',
    'Chicorée / Endive / Scarole': 'Čekanka / Endive / Escarole',
    'Haricot / Flageolet': 'Fazole',
    'Pomme de terre de consommation': 'Konzumní brambory',
    'Pomme de terre féculière': 'Škrobové brambory',
    'Phacélie de 5 ans ou moins': 'Svazenka',
    'Culture inconnue': 'Neznámá plodina',
  },
  'products': {
    'Fongicide systemique': 'Systemický fungicid',
    'Insecticide de contact': 'Kontaktní insekticid',
    'Insecticide systémique': 'Systemický insekticid',
    'Fongicide de contact': 'Kontaktní fungicid',
    'Herbicide racinaire': 'Kořenový herbicid',
    'Régulateur de croissance': 'Růstový regulátor',
    'Fongicide racinaire': 'Kořenový fungicid',
    'Herbicide avec hormones': 'Herbicid na bázi hormonů',
    'Herbicide foliaire de contact': 'Kontaktní herbicid',
    'Herbicide foliaire systémique': 'Systemický herbicid',
    'Insecticide': 'Insekticid',
    'Solution azotée': 'Tekuté dusíkaté hnojivo'
  }
}