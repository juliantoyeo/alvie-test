export default {
  'button': {
    'next': 'CONTINUER',
    'validate': 'VALIDER',
  },
  'geolocation': {
    'text': 'HYGO en arrière-plan :)',
  },
  'months': {
    'january': 'janvier',
    'february': 'février',
    'march': 'mars',
    'april': 'avril',
    'may': 'mai',
    'june': 'juin',
    'july': 'juillet',
    'august': 'août',
    'september': 'septembre',
    'october': 'octobre',
    'november': 'novembre',
    'december': 'décembre'
  },
  'days': {
    'monday': 'lundi',
    'tuesday': 'mardi',
    'wednesday': 'mercredi',
    'thursday': 'jeudi',
    'friday': 'vendredi',
    'saturday': 'samedi',
    'sunday': 'dimanche',
  },
  'soils': {
    'SOIL_TEST': 'Soil Test',
    'SABLE': 'Sable',
    'SABLE_TERREAU': 'Sable / Limon',
    'TERREAU': 'Limon',
    'TERREAU_ARGILE': 'Limon / Argile',
    'ARGILE': 'Argile',
    'none': 'Aucun type séléctionné'
  },
  'modulation': {
    'dose_computation': 'Calcul de la diminution de la dose',
  },
  'drawer': {
    'account': 'mon compte',
    'parcelles': 'mes parcelles',
    'contact': 'nous contacter',
    'logout': 'me déconnecter',
    'hygo_serial': 'Numéro de série : %{serial}',
    'hygo_model': 'Modèle du capteur : %{model}',
    'app_version': 'Version applicative : %{version}',
    'email_subject': 'Demande d\'aide capteur Hygo',
    'equipment': 'Mes équipements',
  },
  'barcode_validation': {
    'title_notice': 'Votre capteur HYGO a bien été jumelé !',
    'text_notice_1': 'Nous allons à présent éditer votre profil.',
    'text_notice_2': 'Vous pourrez ensuite accéder à vos conseils météo uniques.',
  },
  'bar_code': {
    'notice': 'Pour synchroniser votre capteur HYGO, scannez votre QR code :',
    'welcome': 'Bonjour !',
    'retry_barcode': 'Rescanner le QR code',
    'camera_description': 'Nous avons besoin d\'avoir accès à l\'appareil photo du téléphone pour scanner le capteur',
    'retry_camera': 'Réessayer',
    'qr_error': {
      'signin': 'QR code non reconnu',
      'network': 'Erreur de réseau'
    }
  },
  'wait_screen': {
    'wait': {
      'msg1': 'Nous semons les données dans nos serveurs.',
      'msg2': 'La récolte sera bientôt prête !'
    },
    'no_parcels': {
      'msg1': 'Nous n\'avons pas reçu vos données parcellaires.',
      'msg2' : 'Merci de nous contacter.'
    },
    'need_update': {
      'msg1': 'C\'est la moisson pour votre application !',
      'msg2': 'Pour continuer, merci d\'installer la nouvelle mise à jour.'
    }
  },
  'equipment': {
    'header': 'Mes équipements agricoles',
    'title_notice': 'Vos équipements agricoles',
    'text_notice': 'Maintenant, partagez avec nous quelques détails importants.',

    'buses': 'Mes buses de pulvérisation',
    'speed': 'Ma vitesse d\'avancement (km/h)',
    'pressure': 'Pression (Bar)',
    'type_soil': 'Type de sol',

    'saving_info': 'Enregistrement des informations...',

    'buses_family': 'Type de buse',
    'no_buse': 'Pas de type de buse sélectionné',

    'buses_CLASSIC_STD': 'Buses fente classique standard',
    'buses_CLASSIC_LOW': 'Buses fente classique basse pression',
    'buses_CALIBRATE': 'Buses à pastille de calibrage',
    'buses_INJECTION': 'Buses à injection d’air',

    'orange': 'Orange 01',
    'green': 'Vert 02',
    'yellow': 'Jaune 03',
    'lilas': 'Lilas 04',
    'blue': 'Bleu 05',
    'red': 'Rouge 06',
    'brown': 'Marron 07',
    'grey': 'Gris 08',
    'white': 'Blanc 08',

  },
  'meteo': {
    'header': 'Ma météo',
    'brief': 'En bref',
    'detailed': 'Détaillée',
    'radar': 'Radar',
    'next_3_hours': 'Vos pulvérisations pour le créneau %{from}h - %{to}h',
    'parcelle_percent': '%{percent}% des parcelles peuvent être traitées',
    'condition_BAD': 'Mauvaises conditions',
    'condition_FORBIDDEN': 'Très mauvaises conditions',
    'condition_CORRECT': 'Bonnes conditions',
    'condition_EXCELLENT': 'Excellentes ou bonnes conditions',
    'condition_GOOD': 'Excellentes ou bonnes conditions',
    'plan': 'planifier traitement',
  },
  'intervention': {
    'header': "Carte de risques",
    'header_top': 'intervention du %{day} de %{start} à %{end}',
    'header_bottom': '%{number} parcelle(s) traitée(s)',
    'no_phyto_selected': 'Aucun produit selectionné',
    'no_data': 'Aucune information enregistrée sur les anciennes interventions, en cas de problème, vous pouvez nous contacter au 06 68 48 38 83',
  },
  'intervention_map': {
    'header': 'Intervention du %{date}',
    'header_phyto': 'Phyto : %{phyto}',
    'header_clock': 'Début : %{start} - Fin : %{end}',
    'surface': 'Surface totale pulvérisée : %{surface} ha',
    'excellent': 'Excellentes conditions',
    'good': 'Très bonnes conditions',
    'correct': 'Bonnes conditions',
    'mediocre': 'Médiocres conditions',
    'bad': 'Mauvaises conditions',
    'forbidden': 'Très mauvaises conditions',
    'min': 'min %{value}',
    'max': 'max %{value}',
    'avg': 'Moyenne %{value}',
    'rain': 'Pluie : %{value}',
    'other_farm_work': 'Autres travaux agricoles',
  },
  "phyto": {
    "no_phyto": "Pas de produit sélectionné",
  },
  'realtime': {
    'header': 'Temps réel',
    'no_data': 'Aucune information enregistrée au cours de 4 dernières heures, en cas de problème, vous pouvez nous contacter au 06 68 48 38 83',
    'last_hour': 'Dernière mesure à %{value}',
    'next_cuve': 'Planifier une autre cuve',
    'hygro': 'Hygrométrie',
    'temp': 'Température',
    'no_parcelle': 'HORS DE L\'EXPLOITATION',
    'no_product': 'PAS DE PRODUIT SÉLECTIONNÉ',
    'no_data_3_hours': 'Pas de mesure dans les trois dernières heures',
    'waiting_for_data': 'En attente des données du capteur',
    'goto_cuve': 'VERS la planification',
    'status_conditions_EXCELLENT': 'Conditions Idéales',
    'status_conditions_GOOD': 'Bonnes Conditions',
    'status_conditions_CORRECT': 'Conditions Moyennes',
    'status_conditions_BAD': 'Mauvaises Conditions',
    'status_conditions_FORBIDDEN': 'Très Mauvaises Conditions',
    'soil_humi': 'Humidité du sol : %{value}%',
    'gel_risky': 'Risque de gel',
    'gel_none': 'Pas de gel',
    'dewpoint': 'Point de rosée'
  },
  'fields': {
    'parcelles': 'Parcelles totales : %{value}',
    'culture': 'Culture : %{value}',
    'unknown': 'inconnue',
    'header': 'Mon exploitation',
  },
  'meteo_detailed': {
    'days_0': 'DIM',
    'days_1': 'LUN',
    'days_2': 'MAR',
    'days_3': 'MER',
    'days_4': 'JEU',
    'days_5': 'VEN',
    'days_6': 'SAM',
    'pulve_title': 'Mes pulvérisations (%{value})',
  },
  'meteo_overlay': {
    'header': '%{from}H - %{to}H',
    'map_header': '%{value} dans le créneau choisi',
    'excellent': 'Idéal',
    'good': 'Bon',
    'correct': 'Moyen',
    'bad': 'Mauvais',
    'forbidden': 'Interdit',
    'hygro': 'Hygro %{value}%',
    'temp': 'Temp %{value}°C',
    'delta_temp': 'Ampl 24h %{value}°C',
    'wind': 'Vent ',
    'wind_speed': '%{winddir} %{value} km/h',
    'wind_gust': 'RAF %{value} km/h',
    'precipitation': 'Pluie : %{value} mm',
    'precipitation_r2': 'Pluie 2h %{value} mm',
    'precipitation_r3': 'Pluie 3h %{value} mm',
    'precipitation_r6': 'Pluie 6h %{value} mm',
    'soil': 'Sol : ',
    'soil_humi': 'H %{value}%',
    'soil_temp': 'T %{value}°C',
    'white_EXCELLENT_everywhere': 'Vous pouvez pulvériser dans d\'excellentes conditions partout :)',
    'white_EXCELLENT_some': 'Vous pouvez pulvériser avec les excellentes conditions sur %{value}% des parcelles',
    'white_GOOD_everywhere': 'Vous pouvez pulvériser avec les bonnes conditions partout :) ',
    'white_GOOD_some': 'Vous pouvez pulvériser avec les bonnes conditions sur %{value}% des parcelles',
    'white_CORRECT_everywhere': 'Vous pouvez pulvériser partout :) Il vous manque juste un peu pour atteindre les conditions optimales ;) ',
    'white_CORRECT_some': 'Vous pouvez pulvériser sur %{value}% de vos parcelles',
    'white_BAD_everywhere': 'Nous vous déconseillons de pulvériser avec ce type de produit dans ces créneaux, mais des fois, nous n\'avons pas le choix :( ',
    'white_FORBIDDEN_everywhere': 'Attention ! Il est interdit de pulvériser dans ces conditions',
  },
  'pulverisation': {
    'header': 'Prochaine pulvérisation',
    'culture_type': 'Type de culture',
    'select_text': 'Commencez par le choix de la culture et du type de produit pour votre pulvérisation.',
    'select_hours_text': 'Choisissez votre créneau de pulvérisation des prochaines 48h',
    'product_type': 'TYPE DE PRODUIT',
    'culture_type': 'TYPE DE CULTURE',
    'start': 'Commencer',
    'computation_hint': '* Calculé sur la base de vos choix de cultures/produits',
    'reduce_dosage': 'Diminution de la dose* ',
    'all_cultures': 'Toutes les cultures',
  },
  'picker': {
    'header': 'Sélectionner une valeur',
  },
  'cultures': {
    'Mix de grandes cultures': 'Mix de grandes cultures',
    'Smíšené plodiny': 'Mix de grandes cultures',
    'Blé tendre d’hiver': 'Blé tendre (hiver)',
    'Blé tendre de printemps': 'Blé tendre (printemps)',
    'Maïs doux': 'Maïs doux',
    'Maïs ensilage': 'Maïs ensilage',
    'Maïs': 'Maïs',
    'Orge d\'hiver': 'Orge (hiver)',
    'Orge de printemps': 'Orge (printemps)',
    'Avoine d’hiver': 'Avoine d’hiver',
    'Avoine de printemps': 'Avoine de printemps',
    'Blé dur d’hiver': 'Blé dur (hiver)',
    'Blé dur de printemps': 'Blé dur (printemps)',
    'Blé dur de printemps semé tardivement (après le 31/05)': 'Blé dur (printemps - tard)',
    'Autre céréale d’un autre genre': 'Autre céréale d’un autre genre',
    'Autre céréale de genre Fagopyrum': 'Autre céréale de genre Fagopyrum',
    'Autre céréale de genre Phalaris': 'Autre céréale de genre Phalaris',
    'Autre céréale de genre Sorghum': 'Autre céréale de genre Sorghum',
    'Autre céréale de genre Panicum': 'Autre céréale de genre Panicum',
    'Autre céréale de genre Setaria': 'Autre céréale de genre Setaria',
    'Autre céréale d’hiver de genre Avena': 'Autre céréale d’hiver de genre Avena',
    'Autre céréale d’hiver de genre Hordeum': 'Autre céréale d’hiver de genre Hordeum',
    'Autre céréale d’hiver de genre Secale': 'Autre céréale d’hiver de genre Secale',
    'Autre céréale d’hiver de genre Triticum': 'Autre céréale d’hiver de genre Triticum',
    'Autre céréale de printemps de genre Avena': 'Autre céréale de printemps de genre Avena',
    'Autre céréale de printemps de genre Hordeum': 'Autre céréale de printemps de genre Hordeum',
    'Autre céréale de printemps de genre Secale': 'Autre céréale de printemps de genre Secale',
    'Autre céréale de printemps de genre Triticum': 'Autre céréale de printemps de genre Triticum',
    'Autre céréale de printemps de genre Zea': 'Autre céréale de printemps de genre Zea',
    'Épeautre': 'Épeautre',
    'Mélange de céréales': 'Mélange de céréales',
    'Millet': 'Millet',
    'Seigle d’hiver': 'Seigle d’hiver',
    'Seigle de printemps': 'Seigle de printemps',
    'Sorgho': 'Sorgho',
    'Sarrasin': 'Sarrasin',
    'Triticale d’hiver': 'Triticale d’hiver',
    'Triticale de printemps': 'Triticale de printemps',
    'Colza d’hiver': 'Colza (hiver)',
    'Colza de printemps': 'Colza (printemps)',
    'Tournesol': 'Tournesol',
    'Arachide': 'Arachide',
    'Lin non textile d’hiver': 'Lin (hiver)',
    'Lin non textile de printemps': 'Lin (printemps)',
    'Mélange d’oléagineux': 'Mélange d’oléagineux',
    'Navette d’été': 'Navette d’été',
    'Navette d’hiver': 'Navette d’hiver',
    'Autre oléagineux d’un autre genre': 'Autre oléagineux d’un autre genre',
    'Autre oléagineux d’espèce Helianthus': 'Autre oléagineux d’espèce Helianthus',
    'Œillette': 'Œillette',
    'Autre oléagineux d’hiver d’espèce Brassica napus': 'Autre oléagineux d’hiver d’espèce Brassica napus',
    'Autre oléagineux d’hiver d’espèce Brassica rapa': 'Autre oléagineux d’hiver d’espèce Brassica rapa',
    'Autre oléagineux de printemps d’espèce Brassica napus': 'Autre oléagineux de printemps d’espèce Brassica napus',
    'Bordure de champ': 'Bordure de champ',
    'Autre oléagineux de printemps d’espèce Brassica rapa': 'Autre oléagineux de printemps d’espèce Brassica rapa',
    'Soja': 'Soja',
    'Fève': 'Fève',
    'Féverole semée avant le 31/05': 'Féverole semée avant le 31/05',
    'Féverole semée tardivement (après le 31/05)': 'Féverole semée tardivement (après le 31/05)',
    'Lupin doux d’hiver': 'Lupin doux d’hiver',
    'Lupin doux de printemps semé avant le 31/05': 'Lupin doux de printemps semé avant le 31/05',
    'Lupin doux de printemps semé tardivement (après le 31/05)': 'Lupin doux de printemps semé tardivement (après le 31/05)',
    'Mélange de protéagineux (pois et/ou lupin et/ou féverole) prépondérants semés avant le 31/05 et de céréales': 'Mélange de protéagineux (pois et/ou lupin et/ou féverole) prépondérants semés avant le 31/05 et de céréales',
    'Mélange de protéagineux semés tardivement (après le 31/05)': 'Mélange de protéagineux semés tardivement (après le 31/05)',
    'Autre protéagineux d’un autre genre': 'Autre protéagineux d’un autre genre',
    'Pois d’hiver': 'Pois (hiver)', 
    'Pois de printemps semé avant le 31/05': 'Pois (printemps)',
    'Pois de printemps semé tardivement (après le 31/05)': 'Pois (printemps - tard)',
    'Chanvre': 'Chanvre',
    'Lin fibres': 'Lin fibres',
    'Jachère de 5 ans ou moins': 'Jachère de 5 ans ou moins',
    'Jachère de 6 ans ou plus': 'Jachère de 6 ans ou plus',
    'Jachère de 6 ans ou plus déclarée comme Surface d’intérêt écologique': 'Jachère de 6 ans ou plus déclarée comme Surface d’intérêt écologique',
    'Jachère noire': 'Jachère noire',
    'Riz': 'Riz',
    'Lentille cultivée (non fourragère)': 'Lentille cultivée (non fourragère)',
    'Pois chiche': 'Pois chiche',
    'Betterave fourragère': 'Betterave fourragère',
    'Carotte fourragère': 'Carotte fourragère',
    'Chou fourrager': 'Chou fourrager',
    'Fourrage composé de céréales et/ou de protéagineux (en proportion < 50%) et/ou de légumineuses fourragères (en proportion < 50%)': 'Fourrage composé de céréales et/ou de protéagineux (en proportion < 50%) et/ou de légumineuses fourragères (en proportion < 50%)',
    'Dactyle de 5 ans ou moins': 'Dactyle de 5 ans ou moins',
    'Autre fourrage annuel d’un autre genre': 'Autre fourrage annuel d’un autre genre',
    'Fétuque de 5 ans ou moins': 'Fétuque de 5 ans ou moins',
    'Féverole fourragère implantée pour la récolte 2015': 'Féverole fourragère implantée pour la récolte 2015',
    'Féverole fourragère implantée pour la récolte 2016': 'Féverole fourragère implantée pour la récolte 2016',
    'Autre féverole fourragère': 'Autre féverole fourragère',
    'Fléole de 5 ans ou moins': 'Fléole de 5 ans ou moins',
    'Autre plante fourragère sarclée d’un autre genre': 'Autre plante fourragère sarclée d’un autre genre',
    'Gaillet': 'Gaillet',
    'Gesse': 'Gesse',
    'Autre graminée fourragère pure de 5 ans ou moins': 'Autre graminée fourragère pure de 5 ans ou moins',
    'Jarosse implantée pour la récolte 2015': 'Jarosse implantée pour la récolte 2015',
    'Jarosse implantée pour la récolte 2016': 'Jarosse implantée pour la récolte 2016',
    'Jarosse déshydratée': 'Jarosse déshydratée',
    'Autre jarosse': 'Autre jarosse',
    'Lentille fourragère': 'Lentille fourragère',
    'Autre lupin fourrager d’hiver': 'Autre lupin fourrager d’hiver',
    'Autre lupin fourrager de printemps': 'Autre lupin fourrager de printemps',
    'Lupin fourrager d’hiver implanté pour la récolte 2015': 'Lupin fourrager d’hiver implanté pour la récolte 2015',
    'Lupin fourrager d’hiver implanté pour la récolte 2016': 'Lupin fourrager d’hiver implanté pour la récolte 2016',
    'Lotier': 'Lotier',
    'Lupin fourrager de printemps implanté pour la récolte 2015': 'Lupin fourrager de printemps implanté pour la récolte 2015',
    'Lupin fourrager de printemps implanté pour la récolte 2016': 'Lupin fourrager de printemps implanté pour la récolte 2016',
    'Luzerne implantée pour la récolte 2015': 'Luzerne implantée pour la récolte 2015',
    'Luzerne implantée pour la récolte 2016': 'Luzerne implantée pour la récolte 2016',
    'Luzerne déshydratée': 'Luzerne déshydratée',
    'Autre luzerne': 'Autre luzerne',
    'Mélange de légumineuses fourragères prépondérantes au semis implantées pour la récolte 2015 et de céréales': 'Mélange de légumineuses fourragères prépondérantes au semis implantées pour la récolte 2015 et de céréales',
    'Mélange de légumineuses fourragères prépondérantes au semis implantées pour la récolte 2016 et de céréales': 'Mélange de légumineuses fourragères prépondérantes au semis implantées pour la récolte 2016 et de céréales',
    'Mélilot implanté pour la récolte 2015': 'Mélilot implanté pour la récolte 2015',
    'Mélilot implanté pour la récolte 2016': 'Mélilot implanté pour la récolte 2016',
    'Mélilot déshydraté': 'Mélilot déshydraté',
    'Autre mélilot': 'Autre mélilot',
    'Mélange de légumineuses fourragères prépondérantes au semis implantées pour la récolte 2015 et d’herbacées ou de graminées fourragères': 'Mélange de légumineuses fourragères prépondérantes au semis implantées pour la récolte 2015 et d’herbacées ou de graminées fourragères',
    'Mélange de légumineuses fourragères prépondérantes au semis implantées pour la récolte 2016 et d’herbacées ou de graminées fourragères': 'Mélange de légumineuses fourragères prépondérantes au semis implantées pour la récolte 2016 et d’herbacées ou de graminées fourragères',
    'Minette': 'Minette',
    'Mélange de légumineuses fourragères implantées pour la récolte 2015 (entre elles)': 'Mélange de légumineuses fourragères implantées pour la récolte 2015 (entre elles)',
    'Mélange de légumineuses fourragères implantées pour la récolte 2016 (entre elles)': 'Mélange de légumineuses fourragères implantées pour la récolte 2016 (entre elles)',
    'Mélange de légumineuses déshydratées (entre elles)': 'Mélange de légumineuses déshydratées (entre elles)',
    'Mélange de légumineuses prépondérantes au semis et de graminées fourragères de 5 ans ou moins': 'Mélange de légumineuses prépondérantes au semis et de graminées fourragères de 5 ans ou moins',
    'Moha': 'Moha',
    'Navet fourrager': 'Navet fourrager',
    'Pâturin commun de 5 ans ou moins': 'Pâturin commun de 5 ans ou moins',
    'Autre pois fourrager d’hiver': 'Autre pois fourrager d’hiver',
    'Autre pois fourrager de printemps': 'Autre pois fourrager de printemps',
    'Pois fourrager d’hiver implanté pour la récolte 2015': 'Pois fourrager d’hiver implanté pour la récolte 2015',
    'Pois fourrager d’hiver implanté pour la récolte 2016': 'Pois fourrager d’hiver implanté pour la récolte 2016',
    'Pois fourrager de printemps implanté pour la récolte 2015': 'Pois fourrager de printemps implanté pour la récolte 2015',
    'Pois fourrager de printemps implanté pour la récolte 2016': 'Pois fourrager de printemps implanté pour la récolte 2016',
    'Radis fourrager': 'Radis fourrager',
    'Sainfoin implanté pour la récolte 2015': 'Sainfoin implanté pour la récolte 2015',
    'Sainfoin implanté pour la récolte 2016': 'Sainfoin implanté pour la récolte 2016',
    'Sainfoin déshydraté': 'Sainfoin déshydraté',
    'Autre sainfoin': 'Autre sainfoin',
    'Serradelle implantée pour la récolte 2015': 'Serradelle implantée pour la récolte 2015',
    'Serradelle implantée pour la récolte 2016': 'Serradelle implantée pour la récolte 2016',
    'Serradelle déshydratée': 'Serradelle déshydratée',
    'Autre serradelle': 'Autre serradelle',
    'Trèfle implanté pour la récolte 2015': 'Trèfle implanté pour la récolte 2015',
    'Trèfle implanté pour la récolte 2016': 'Trèfle implanté pour la récolte 2016',
    'Trèfle déshydraté': 'Trèfle déshydraté',
    'Autre trèfle': 'Autre trèfle',
    'Vesce implantée pour la récolte 2015': 'Vesce implantée pour la récolte 2015',
    'Vesce implantée pour la récolte 2016': 'Vesce implantée pour la récolte 2016',
    'Vesce déshydratée': 'Vesce déshydratée',
    'Autre vesce': 'Autre vesce',
    'X-Felium de 5 ans ou moins': 'X-Felium de 5 ans ou moins',
    'Bois pâturé': 'Bois pâturé',
    'Surface pastorale - herbe prédominante et ressources fourragères ligneuses présentes': 'Surface pastorale - herbe prédominante et ressources fourragères ligneuses présentes',
    'Surface pastorale - ressources fourragères ligneuses prédominantes': 'Surface pastorale - ressources fourragères ligneuses prédominantes',
    'Prairie permanente - herbe prédominante (ressources fourragères ligneuses absentes ou peu présentes)': 'Prairie permanente',
    'Prairie en rotation longue (6 ans ou plus)': 'Prairie (rotation longue)',
    'Autre prairie temporaire de 5 ans ou moins': 'Autre prairie temporaire',
    'Ray-grass de 5 ans ou moins': 'Ray-grass de 5 ans ou moins',
    'Agrume': 'Agrume',
    'Ananas': 'Ananas',
    'Avocat': 'Avocat',
    'Banane créole (fruit et légume) - autre': 'Banane créole (fruit et légume) - autre',
    'Banane créole (fruit et légume) - fermage': 'Banane créole (fruit et légume) - fermage',
    'Banane créole (fruit et légume) - indivision': 'Banane créole (fruit et légume) - indivision',
    'Banane créole (fruit et légume) - propriété ou faire valoir direct': 'Banane créole (fruit et légume) - propriété ou faire valoir direct',
    'Banane créole (fruit et légume) - réforme foncière': 'Banane créole (fruit et légume) - réforme foncière',
    'Banane export - autre': 'Banane export - autre',
    'Banane export - fermage': 'Banane export - fermage',
    'Banane export - indivision': 'Banane export - indivision',
    'Banane export - propriété ou faire valoir direct': 'Banane export - propriété ou faire valoir direct',
    'Banane export - réforme foncière': 'Banane export - réforme foncière',
    'Café / Cacao': 'Café / Cacao',
    'Cerise bigarreau pour transformation': 'Cerise bigarreau pour transformation',
    'Petit fruit rouge': 'Petit fruit rouge',
    'Prune d’Ente pour transformation': 'Prune d’Ente pour transformation',
    'Pêche Pavie pour transformation': 'Pêche Pavie pour transformation',
    'Poire Williams pour transformation': 'Poire Williams pour transformation',
    'Verger (DOM)': 'Verger (DOM)',
    'Verger': 'Verger',
    'Restructuration du vignoble': 'Restructuration du vignoble',
    'Vigne : raisins de cuve': 'Vigne : raisins de cuve',
    'Vigne : raisins de table': 'Vigne : raisins de table',
    'Caroube': 'Caroube',
    'Châtaigne': 'Châtaigne',
    'Noisette': 'Noisette',
    'Noix': 'Noix',
    'Pistache': 'Pistache',
    'Oliveraie': 'Oliveraie',
    'Aneth': 'Aneth',
    'Angélique': 'Angélique',
    'Anis': 'Anis',
    'Bardane': 'Bardane',
    'Basilic': 'Basilic',
    'Bourrache de 5 ans ou moins': 'Bourrache de 5 ans ou moins',
    'Betterave non fourragère / Bette': 'Betterave non fourragère',
    'Carvi': 'Carvi',
    'Chardon Marie': 'Chardon Marie',
    'Ciboulette': 'Ciboulette',
    'Cameline': 'Cameline',
    'Camomille': 'Camomille',
    'Coriandre': 'Coriandre',
    'Cerfeuil': 'Cerfeuil',
    'Cumin': 'Cumin',
    'Curcuma': 'Curcuma',
    'Estragon': 'Estragon',
    'Fenouil': 'Fenouil',
    'Fenugrec': 'Fenugrec',
    'Houblon': 'Houblon',
    'Lavande / Lavandin': 'Lavande / Lavandin',
    'Mauve': 'Mauve',
    'Mélisse': 'Mélisse',
    'Millepertuis': 'Millepertuis',
    'Moutarde': 'Moutarde',
    'Marjolaine / Origan': 'Marjolaine / Origan',
    'Menthe': 'Menthe',
    'Oseille': 'Oseille',
    'Plante aromatique (autre que vanille)': 'Plante aromatique (autre que vanille)',
    'Plante médicinale': 'Plante médicinale',
    'Autre plante à parfum aromatique et médicinale annuelle': 'Autre plante à parfum aromatique et médicinale annuelle',
    'Plante à parfum (autre que géranium et vétiver)': 'Plante à parfum (autre que géranium et vétiver)',
    'Autre plante à parfum aromatique et médicinale pérenne': 'Autre plante à parfum aromatique et médicinale pérenne',
    'Persil': 'Persil',
    'Psyllium noir de Provence': 'Psyllium noir de Provence',
    'Plantain psyllium': 'Plantain psyllium',
    'Romarin': 'Romarin',
    'Sauge': 'Sauge',
    'Sarriette': 'Sarriette',
    'Tabac': 'Tabac',
    'Thym': 'Thym',
    'Tomate pour transformation': 'Tomate pour transformation',
    'Valériane': 'Valériane',
    'Vanille sous bois': 'Vanille sous bois',
    'Vanille': 'Vanille',
    'Vanille verte': 'Vanille verte',
    'Ylang-ylang': 'Ylang-ylang',
    'Aïl': 'Aïl',
    'Artichaut': 'Artichaut',
    'Aubergine': 'Aubergine',
    'Bleuet': 'Bleuet',
    'Bugle rampante': 'Bugle rampante',
    'Carotte': 'Carotte',
    'Concombre / Cornichon': 'Concombre / Cornichon',
    'Courgette / Citrouille': 'Courgette / Citrouille',
    'Céleri': 'Céleri',
    'Chicorée / Endive / Scarole': 'Chicorée / Endive / Scarole',
    'Chou': 'Chou',
    'Courge musquée / Butternut': 'Courge musquée / Butternut',
    'Cresson alénois de 5 ans ou moins': 'Cresson alénois de 5 ans ou moins',
    'Cornille': 'Cornille',
    'Cresson': 'Cresson',
    'Culture sous serre hors sol': 'Culture sous serre hors sol',
    'Dolique': 'Dolique',
    'Épinard': 'Épinard',
    'Autre légume ou fruit annuel': 'Autre légume ou fruit annuel',
    'Autre légume ou fruit pérenne': 'Autre légume ou fruit pérenne',
    'Fraise': 'Fraise',
    'Géranium': 'Géranium',
    'Haricot / Flageolet': 'Haricot / Flageolet',
    'Horticulture ornementale de plein champ': 'Horticulture ornementale de plein champ',
    'Horticulture ornementale sous abri': 'Horticulture ornementale sous abri',
    'Laitue / Batavia / Feuille de chêne': 'Laitue / Batavia / Feuille de chêne',
    'Légume sous abri': 'Légume sous abri',
    'Mâche': 'Mâche',
    'Melon': 'Melon',
    'Marguerite': 'Marguerite',
    'Navet': 'Navet',
    'Oignon / Échalote': 'Oignon / Échalote',
    'Panais': 'Panais',
    'Pâquerette': 'Pâquerette',
    'Pastèque': 'Pastèque',
    'Primevère': 'Primevère',
    'Poireau': 'Poireau',
    'Potiron / Potimarron': 'Potiron / Potimarron',
    'Petits pois': 'Petits pois',
    'Pensée': 'Pensée',
    'Pomme de terre de consommation': 'Pomme de terre (consomm)',
    'Pomme de terre féculière': 'Pomme de terre (féculière)',
    'Poivron / Piment': 'Poivron / Piment',
    'Radis': 'Radis',
    'Roquette': 'Roquette',
    'Rutabaga': 'Rutabaga',
    'Salsifis': 'Salsifis',
    'Tomate': 'Tomate',
    'Topinambour': 'Topinambour',
    'Véronique': 'Véronique',
    'Canne à sucre - autre': 'Canne à sucre - autre',
    'Canne à sucre - fermage': 'Canne à sucre - fermage',
    'Canne à sucre - indivision': 'Canne à sucre - indivision',
    'Canne à sucre - propriété ou faire valoir direct': 'Canne à sucre - propriété ou faire valoir direct',
    'Canne à sucre - réforme foncière': 'Canne à sucre - réforme foncière',
    'Autre culture non précisée dans la liste (admissible)': 'Autre culture non précisée dans la liste (admissible)',
    'Bande admissible le long d’une forêt avec production': 'Bande admissible le long d’une forêt avec production',
    'Bande admissible le long d’une forêt sans production': 'Bande admissible le long d’une forêt sans production',
    'Brome de 5 ans ou moins': 'Brome de 5 ans ou moins',
    'Bande tampon': 'Bande tampon',
    'Châtaigneraie entretenue par des porcins ou des petits ruminants': 'Châtaigneraie entretenue par des porcins ou des petits ruminants',
    'Chênaie entretenue par des porcins ou des petits ruminants': 'Chênaie entretenue par des porcins ou des petits ruminants',
    'Cultures conduites en interrangs : 2 cultures représentant chacune plus de 25%': 'Cultures conduites en interrangs : 2 cultures représentant chacune plus de 25%',
    'Cultures conduites en interrangs : 3 cultures représentant chacune plus de 25%': 'Cultures conduites en interrangs : 3 cultures représentant chacune plus de 25%',
    'Culture sous abattis': 'Culture sous abattis',
    'Miscanthus': 'Miscanthus',
    'Autre mélange de plantes fixant l’azote': 'Autre mélange de plantes fixant l’azote',
    'Marais salant': 'Marais salant',
    'Nyger': 'Nyger',
    'Phacélie de 5 ans ou moins': 'Phacélie',
    'Pépinière': 'Pépinière',
    'Roselière': 'Roselière',
    'Surface boisée sur une ancienne terre agricole': 'Surface boisée sur une ancienne terre agricole',
    'Surface non agricole non visible sur l’orthophotographie': 'Surface non agricole non visible sur l’orthophotographie',
    'Surface agricole temporairement non exploitée': 'Surface agricole temporairement non exploitée',
    'Tubercule tropical': 'Tubercule tropical',
    'Taillis à courte rotation': 'Taillis à courte rotation',
    'Truffière (chênaie de plants mycorhizés)': 'Truffière (chênaie de plants mycorhizés)',
    'Vétiver': 'Vétiver',
    'Culture inconnue': 'Culture inconnue',
  },
  'products': {
    'Fongicide systemique': 'Fongicide systemique',
    'Insecticide de contact': 'Insecticide de contact',
    'Insecticide systémique': 'Insecticide systémique',
    'Fongicide de contact': 'Fongicide de contact',
    'Herbicide racinaire': 'Herbicide racinaire',
    'Régulateur de croissance': 'Régulateur de croissance',
    'Fongicide racinaire': 'Fongicide racinaire',
    'Herbicide avec hormones': 'Herbicide avec hormones',
    'Herbicide foliaire de contact': 'Herbicide foliaire de contact',
    'Herbicide foliaire systémique': 'Herbicide foliaire systémique',
    'Insecticide': 'Insecticide',
  }
}