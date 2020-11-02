
export const fieldsData = [
    {
      type : "ble",
      name:"Parcelle1",
      area: 30.0,
      selected: false,
      id: 1
    },
    {
      type : "ble",
      name: "Parcelle2",
      area: 60.6,
      selected: false,
      id: 2
    },
    {
        type : "ble",
        name: "Parcelle3",
        area: 22.6,
        selected: false,
        id: 3
      },
      {
        type : "ble",
        name: "Parcelle4",
        area: 13.9,
        selected: false,
        id: 4
      },
      {
        type : "ble",
        name: "Parcelle5",
        area: 7.2,
        selected: false,
        id: 5
      },
      {
        type : "ble",
        name: "Parcelle6",
        area: 45.9,
        selected: false,
        id: 6
      },
      {
        type : "ble",
        name: "Parcelle7",
        area: 45.8,
        selected: false,
        id: 7
      },

    {
      type: "mais",
      name:"Parcelle8",
      area:36.87,
      selected: false,
      id: 8
    },
    {
      type: "mais",
      name:"Parcelle9",
      area:12.9,
      selected: false,
      id: 9
    },
    {
        type: "mais",
        name:"Parcelle10",
        area:23.4,
        selected: false,
        id: 10
      },
      {
        type: "mais",
        name:"Parcelle11",
        area:23.9,
        selected: false,
        id: 11
      },
      {
        type: "mais",
        name:"Parcelle12",
        area:10.0,
        selected: false,
        id: 12
      },
      {
        type: "mais",
        name:"Parcelle13",
        area:13.9,
        selected: false,
        id: 13
      },
      {
        type: "mais",
        name:"Parcelle14",
        area:13.2,
        selected: false,
        id: 14
      },
      {
        type: "orge",
        name:"Parcelle15",
        area:21.75,
        selected: false,
        id: 15
      },
      {
        type: "orge",
        name:"Parcelle16",
        area:18.7,
        selected: false,
        id: 16
      },
      {
        type: "orge",
        name:"Parcelle17",
        area:55.8,
        selected: false,
        id: 17
      },
      {
        type: "orge",
        name:"Parcelle18",
        area:64.4,
        selected: false,
        id: 18
      },


  ]

export type productType={
    type:string,
    name:string,
    selected: boolean,
    id: number
}
export const productsData: Array<productType> = [
  
    {
      type : "fongicide",
      name:"Revystar XL",
      selected: false,
      id: 1
    },
    {
      type : "fongicide",
      name: "Xemium",
      selected: false,
      id: 2
    },
    {
      type: "herbicide",
      name:"Florid-Bali",
      selected: false,
      id: 3
    },
    {
      type: "herbicide",
      name:"Atlantis Pro",
      selected: false,
      id: 4
    },

    {
        type : "fongicide",
        name: "Sulky",
        selected: false,
        id: 5
      },
      {
        type : "fongicide",
        name: "Librax",
        selected: false,
        id: 6
      },
      {
        type : "fongicide",
        name: "Kardix",
        selected: false,
        id: 7
      },
      {
        type: "herbicide",
        name:"Chardex",
        selected: false,
        id: 8
      },
      {
        type: "herbicide",
        name:"Lonpar",
        selected: false,
        id: 9
      },
      {
        type: "herbicide",
        name:"Bofix-Boston",
        selected: false,
        id: 10
      },
  ]
  
  export const daysData: any = [
    {
        title: 'LUN',
        pictocode: 'SUN',
        hours4:{
            '0': 'SUN',
            '4': 'SUN',
            '8': 'RAIN',
            '12': 'RAIN',
            '16': 'SUN',
            '20': 'SNOW',
        },
        id:0
    },
    {
        title: 'MAR',
        pictocode: 'CLOUD',
        hours4:{
            '0': 'SNOW',
            '4': 'SNOW',
            '8': 'SNOW',
            '12': 'SNOW',
            '16': 'SNOW',
            '20': 'SNOW',
        },
        id:1
    },
    {
        title: 'MER',
        pictocode: 'STORM',
        hours4:{
            '0': 'RAIN',
            '4': 'RAIN',
            '8': 'RAIN',
            '12': 'RAIN',
            '16': 'RAIN',
            '20': 'SNOW',
        },
        id:2
    },
    {
        title: 'JEU',
        pictocode: 'RAIN',
        hours4:{
            '0': 'SUN',
            '4': 'SUN',
            '8': 'SUN',
            '12': 'SUN',
            '16': 'SUN',
            '20': 'SUN',
        },
        id:3
    },
    {
        title: 'VEN',
        pictocode: 'SNOW',
        hours4:{
            '0': 'SUN',
            '4': 'SUN',
            '8': 'RAIN',
            '12': 'RAIN',
            '16': 'SUN',
            '20': 'SUN',
        },
        id:4
    },
]

export const hourMetricsData = [
    {
        winddirection: 'S',
        wind: 50,
        gust: 51,
        precipitation: 12,
        probability: 10,
        mintemp: 20,
        maxtemp: 27,
        minhumi: 80,
        maxhumi: 85,
        minsoilhumi: 10,
        maxsoilhumi: 11,
        prevprecipitation: 5,
        'r2': 13,
        'r3': 16,
        'r6': 33,
        deltatemp: 10
    },
    {
        winddirection: 'N',
        wind: 20,
        gust: 21,
        precipitation: 11,
        probability: 67,
        mintemp: -6,
        maxtemp: 7,
        minhumi: 30,
        maxhumi: 35,
        minsoilhumi: 4,
        maxsoilhumi: 8,
        prevprecipitation: 0,
        'r2': 13,
        'r3': 16,
        'r6': 33,
        deltatemp: 5
    },
]

export const next12HoursData = [{
    '00': {condition : 'EXCELLENT'},
    '01': {condition : 'GOOD'},
    '02': {condition : 'GOOD'},
    '03': {condition : 'GOOD'},
    '04': {condition : 'EXCELLENT'},
    '05': {condition : 'EXCELLENT'},
    '06': {condition : 'GOOD'},
    '07': {condition : 'CORRECT'},
    '08': {condition : 'BAD'},
    '09': {condition : 'GOOD'},
    '10': {condition : 'EXCELLENT'},
    '11': {condition : 'GOOD'},
    '12': {condition : 'EXCELLENT'},
    '13': {condition : 'BAD'},
    '14': {condition : 'BAD'},
    '15': {condition : 'FORBIDDEN'},
    '16': {condition : 'BAD'},
    '17': {condition : 'BAD'},
    '18': {condition : 'CORRECT'},
    '19': {condition : 'BAD'},
    '20': {condition : 'GOOD'},
    '21': {condition : 'GOOD'},
    '22': {condition : 'EXCELLENT'},
    '23': {condition : 'GOOD'},
},
{
    '00': {condition : 'EXCELLENT'},
    '01': {condition : 'EXCELLENT'},
    '02': {condition : 'EXCELLENT'},
    '03': {condition : 'GOOD'},
    '04': {condition : 'EXCELLENT'},
    '05': {condition : 'EXCELLENT'},
    '06': {condition : 'BAD'},
    '07': {condition : 'BAD'},
    '08': {condition : 'BAD'},
    '09': {condition : 'BAD'},
    '10': {condition : 'CORRECT'},
    '11': {condition : 'BAD'},
    '12': {condition : 'BAD'},
    '13': {condition : 'CORRECT'},
    '14': {condition : 'CORRECT'},
    '15': {condition : 'CORRECT'},
    '16': {condition : 'GOOD'},
    '17': {condition : 'EXCELLENT'},
    '18': {condition : 'EXCELLENT'},
    '19': {condition : 'GOOD'},
    '20': {condition : 'GOOD'},
    '21': {condition : 'GOOD'},
    '22': {condition : 'EXCELLENT'},
    '23': {condition : 'GOOD'},
}]

export const modData = [
    [ 10, 12, 10, 15, 20, 10, 14, 9, 7, 6, 10, 4, 2, 0, 0, 0, 0, 1, 2, 7, 9, 10, 12, 15],
    [ 10, 12, 10, 15, 20, 2, 1, 0, 0, 0, 3, 4, 1, 2, 4, 9, 7, 5, 8, 17, 15, 10, 12, 15]
]