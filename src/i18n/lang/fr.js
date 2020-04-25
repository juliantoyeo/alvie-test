export default {
  'button': {
    'next': 'CONTINUER',
    'validate': 'VALIDER',
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
    'SABLE': 'Sable',
    'SABLE_TERREAU': 'Sable / Terreau',
    'TERREAU': 'Terreau',
    'TERREAU_ARGILE': 'Terreau / Argile',
    'ARGILE': 'Argile',
    'none': 'Aucun type séléctionné'
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
    'qr_error': 'QR code non reconnu',
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

    'orange': 'Orange 01',
    'green': 'Vert 02',
    'yellow': 'Jaune 03',
    'blue': 'Bleu 04',
    'red': 'Rouge 05',
    'brown': 'Marron 06',
    'grey': 'Gris 07',
    'white': 'Blanc 08',
  },
  'meteo': {
    'header': 'Ma météo',
    'brief': 'En bref',
    'detailed': 'Détaillée',
    'radar': 'Radar',
    'next_3_hours': 'Trois prochaines heures',
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
    'avg': 'avg %{value}',
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
    'goto_cuve': 'VERS la planification'
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
    'hygro': 'Hygro : %{value}%',
    'temp': 'Temp : %{value}°C',
    'delta_temp': 'Ampl 48h : %{value}°C',
    'wind': 'Vent : ',
    'wind_speed': '%{winddir} %{value} km/h',
    'wind_gust': 'RAF %{value} km/h',
    'precipitation': 'Pluie : %{value} mm',
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
  }
}