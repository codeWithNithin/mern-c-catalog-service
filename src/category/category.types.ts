export interface PriceConfig {
    [key: string]: {
        priceType: 'base' | 'aditional'
        availableOptions: string[]
    }
}

export interface Attribute {
    name: string
    widgetType: 'switch' | 'radio'
    defaultValue: string
    availableOptions: []
}

export interface Category {
    name: string
    priceConfiguration: PriceConfig
    attributes: Attribute[]
}

// ex:

// name: pizza | beverages

// {
//     name: 'pizza',
//     priceConfiguration: {
//       size: {
//          priceType: 'base',
//          availableOptions: [ 'small', 'medium', 'large']
//       }
//       crust: {
//         availableOptions: ["thick", 'thin']
//       }
//     },
//     attributes: [
//         {
//         name: 'isHit',
//         widgetType: 'switch',
//         defaultValue: 'no',
//         availableOptions: ['yes', 'no']
//     },
//     {
//         name: 'spiciness',
//         widgetType: 'radio',
//         defaultValue: 'medium',
//         availableOptions: ['low', 'medium', 'high']
//     }
// ]
// }

// {
//     name: 'beverages',
//     priceConfiguration: {
//       size: {
//          priceType: 'base',
//          availableOptions: [ 'small', 'medium', 'large']
//       }
//       crust: {
//         availableOptions: ["thick", 'thin']
//       }
//     },
//     attributes: [
//         {
//         name: 'isHit',
//         widgetType: 'switch',
//         defaultValue: 'no',
//         availableOptions: ['yes', 'no']
//     },
//     {
//         name: 'spiciness',
//         widgetType: 'radio',
//         defaultValue: 'medium',
//         availableOptions: ['low', 'medium', 'high']
//     }
// ]
// }
