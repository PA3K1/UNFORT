// data.js
const products = [
    // ========== OUTERWEAR (8 товаров) ==========
    {
        id: 'out1',
        category: 'outerwear',
        title: 'Костюм “Sensation”',
        priceNew: '15 990₽',
        priceOld: '19 990₽',
        imgPrimary: 'image.OUTERWEAR/OUTERWEAR.line1.png',
        imgSecondary: 'image.OUTERWEAR/OUTERWEAR.hover1.png',
        badge: 'NEW!!!',
        installment: '3 997₽'
    },
    {
        id: 'out2',
        category: 'outerwear',
        title: '“Sensation” Pants',
        priceNew: '8 990₽',
        priceOld: '12 990₽',
        imgPrimary: 'image.OUTERWEAR/OUTERWEAR.line1.png',
        imgSecondary: 'image.OUTERWEAR/OUTERWEAR.hover1.png',
        badge: 'NEW!!!',
        installment: '2 247₽'
    },
    {
        id: 'out3',
        category: 'outerwear',
        title: '“Sensation” Jacket',
        priceNew: '9 990₽',
        priceOld: '13 990₽',
        imgPrimary: 'image.OUTERWEAR/OUTERWEAR.line1.png',
        imgSecondary: 'image.OUTERWEAR/OUTERWEAR.hover1.png',
        badge: 'NEW!!!',
        installment: '2 497₽'
    },
    {
        id: 'out4',
        category: 'outerwear',
        title: 'Костюм "MotoSport"',
        priceNew: '15 990₽',
        priceOld: '19 990₽',
        imgPrimary: 'image.OUTERWEAR/OUTERWEAR.line1.png',
        imgSecondary: 'image.OUTERWEAR/OUTERWEAR.hover1.png',
        badge: '',
        installment: '3 997₽'
    },
    {
        id: 'out5',
        category: 'outerwear',
        title: 'Костюм “Squeeze”',
        priceNew: '16 990₽',
        priceOld: '22 990₽',
        imgPrimary: 'image.OUTERWEAR/OUTERWEAR.line1.png',
        imgSecondary: 'image.OUTERWEAR/OUTERWEAR.hover1.png',
        badge: '',
        installment: '4 247₽'
    },
    {
        id: 'out6',
        category: 'outerwear',
        title: '"MotoSport" Jacket',
        priceNew: '9 990₽',
        priceOld: '11 990₽',
        imgPrimary: 'image.OUTERWEAR/OUTERWEAR.line1.png',
        imgSecondary: 'image.OUTERWEAR/OUTERWEAR.hover1.png',
        badge: '',
        installment: '2 497₽'
    },
    {
        id: 'out7',
        category: 'outerwear',
        title: '“Squeeze” Jacket',
        priceNew: '11 990₽',
        priceOld: '13 990₽',
        imgPrimary: 'image.OUTERWEAR/OUTERWEAR.line1.png',
        imgSecondary: 'image.OUTERWEAR/OUTERWEAR.hover1.png',
        badge: '',
        installment: '2 997₽'
    },
    {
        id: 'out8',
        category: 'outerwear',
        title: 'Anesthesia Down Jacket Sapphire',
        priceNew: '59 990₽',
        priceOld: null,
        imgPrimary: 'image.OUTERWEAR/OUTERWEAR.line1.png',
        imgSecondary: 'image.OUTERWEAR/OUTERWEAR.hover1.png',
        badge: '',
        installment: '14 997₽'
    },

    // ========== HOODIES (23 товара) ==========
    {
        id: 'hood1',
        category: 'hoodies',
        title: '“Ex Sample Classic” Zip-Hoodie Gray',
        priceNew: '7 490₽',
        priceOld: '8 990₽',
        imgPrimary: 'image.HOODIES/HOODIES.webp',
        imgSecondary: 'image.HOODIES/HOODIES-hover.webp',
        badge: 'NEW',
        installment: '1 872₽'
    },
    {
        id: 'hood2',
        category: 'hoodies',
        title: '“Ex Sample Classic” Zip-Hoodie Black',
        priceNew: '7 490₽',
        priceOld: '7 990₽',
        imgPrimary: 'image.HOODIES/HOODIES.webp',
        imgSecondary: 'image.HOODIES/HOODIES-hover.webp',
        badge: 'NEW',
        installment: '1 872₽'
    },
    {
        id: 'hood3',
        category: 'hoodies',
        title: '“Criss Cross” Zip-Hoodie',
        priceNew: '9 990₽',
        priceOld: '12 490₽',
        imgPrimary: 'image.HOODIES/HOODIES.webp',
        imgSecondary: 'image.HOODIES/HOODIES-hover.webp',
        badge: 'NEW',
        installment: '2 497₽'
    },
    {
        id: 'hood4',
        category: 'hoodies',
        title: '“Ex Sample Classic” Zip-Hoodie Dark Blue',
        priceNew: '6 490₽',
        priceOld: '7 990₽',
        imgPrimary: 'image.HOODIES/HOODIES.webp',
        imgSecondary: 'image.HOODIES/HOODIES-hover.webp',
        badge: 'Last Sizes!',
        installment: '1 622₽'
    },
    {
        id: 'hood5',
        category: 'hoodies',
        title: '“Ex Sample Classic” Zip-Hoodie Brown',
        priceNew: '7 490₽',
        priceOld: '7 990₽',
        imgPrimary: 'image.HOODIES/HOODIES.webp',
        imgSecondary: 'image.HOODIES/HOODIES-hover.webp',
        badge: 'NEW',
        installment: '1 872₽'
    },
    {
        id: 'hood6',
        category: 'hoodies',
        title: '“Ex Sample Privity” Zip-Hoodie Black',
        priceNew: '7 490₽',
        priceOld: '7 990₽',
        imgPrimary: 'image.HOODIES/HOODIES.webp',
        imgSecondary: 'image.HOODIES/HOODIES-hover.webp',
        badge: 'NEW',
        installment: '1 872₽'
    },
    {
        id: 'hood7',
        category: 'hoodies',
        title: '“Ex Sample Privity” Zip-Hoodie Dark Blue',
        priceNew: '6 490₽',
        priceOld: '7 990₽',
        imgPrimary: 'image.HOODIES/HOODIES.webp',
        imgSecondary: 'image.HOODIES/HOODIES-hover.webp',
        badge: 'Last Sizes!',
        installment: '1 622₽'
    },
    {
        id: 'hood8',
        category: 'hoodies',
        title: '“Ex Sample Privity” Zip-Hoodie Brown',
        priceNew: '7 490₽',
        priceOld: '7 990₽',
        imgPrimary: 'image.HOODIES/HOODIES.webp',
        imgSecondary: 'image.HOODIES/HOODIES-hover.webp',
        badge: 'NEW',
        installment: '1 872₽'
    },
    {
        id: 'hood9',
        category: 'hoodies',
        title: '“Ex Sample Neck” Hoodie Black',
        priceNew: '6 990₽',
        priceOld: '7 490₽',
        imgPrimary: 'image.HOODIES/HOODIES.webp',
        imgSecondary: 'image.HOODIES/HOODIES-hover.webp',
        badge: 'NEW',
        installment: '1 747₽'
    },
    {
        id: 'hood10',
        category: 'hoodies',
        title: '“Ex Sample Neck” Hoodie Brown',
        priceNew: '6 990₽',
        priceOld: '7 490₽',
        imgPrimary: 'image.HOODIES/HOODIES.webp',
        imgSecondary: 'image.HOODIES/HOODIES-hover.webp',
        badge: 'NEW',
        installment: '1 747₽'
    },
    {
        id: 'hood11',
        category: 'hoodies',
        title: '“Fusion” Zip-Hoodie',
        priceNew: '8 990₽',
        priceOld: '14 990₽',
        imgPrimary: 'image.HOODIES/HOODIES.webp',
        imgSecondary: 'image.HOODIES/HOODIES-hover.webp',
        badge: 'NEW!!!',
        installment: '2 247₽'
    },
    {
        id: 'hood12',
        category: 'hoodies',
        title: '“Void 2Vol” Zip-Hoodie',
        priceNew: '9 990₽',
        priceOld: '11 990₽',
        imgPrimary: 'image.HOODIES/HOODIES.webp',
        imgSecondary: 'image.HOODIES/HOODIES-hover.webp',
        badge: '',
        installment: '2 497₽'
    },
    {
        id: 'hood13',
        category: 'hoodies',
        title: '“Void” Zip-Hoodie',
        priceNew: '5 990₽',
        priceOld: '10 990₽',
        imgPrimary: 'image.HOODIES/HOODIES.webp',
        imgSecondary: 'image.HOODIES/HOODIES-hover.webp',
        badge: '',
        installment: '1 497₽'
    },
    {
        id: 'hood14',
        category: 'hoodies',
        title: '“JJ” Zip-Hoodie',
        priceNew: '7 990₽',
        priceOld: '14 990₽',
        imgPrimary: 'image.HOODIES/HOODIES.webp',
        imgSecondary: 'image.HOODIES/HOODIES-hover.webp',
        badge: '',
        installment: '1 997₽'
    },
    {
        id: 'hood15',
        category: 'hoodies',
        title: '“Ex Sample” Zip-Hoodie Black',
        priceNew: '7 990₽',
        priceOld: '9 990₽',
        imgPrimary: 'image.HOODIES/HOODIES.webp',
        imgSecondary: 'image.HOODIES/HOODIES-hover.webp',
        badge: 'HIT',
        installment: '1 997₽'
    },
    {
        id: 'hood16',
        category: 'hoodies',
        title: '“Ex Sample” Zip Black',
        priceNew: '5 990₽',
        priceOld: '9 490₽',
        imgPrimary: 'image.HOODIES/HOODIES.webp',
        imgSecondary: 'image.HOODIES/HOODIES-hover.webp',
        badge: '',
        installment: '1 497₽'
    },
    {
        id: 'hood17',
        category: 'hoodies',
        title: '“Ex Sample” Zip Grey',
        priceNew: '4 990₽',
        priceOld: '9 490₽',
        imgPrimary: 'image.HOODIES/HOODIES.webp',
        imgSecondary: 'image.HOODIES/HOODIES-hover.webp',
        badge: '',
        installment: '1 247₽'
    },
    {
        id: 'hood18',
        category: 'hoodies',
        title: '“Ex Sample” Zip Blue',
        priceNew: '4 990₽',
        priceOld: '9 490₽',
        imgPrimary: 'image.HOODIES/HOODIES.webp',
        imgSecondary: 'image.HOODIES/HOODIES-hover.webp',
        badge: '',
        installment: '1 247₽'
    },
    {
        id: 'hood19',
        category: 'hoodies',
        title: '"Basic Mint" Zip-Hoodie',
        priceNew: '5 990₽',
        priceOld: '8 490₽',
        imgPrimary: 'image.HOODIES/HOODIES.webp',
        imgSecondary: 'image.HOODIES/HOODIES-hover.webp',
        badge: 'SALE',
        installment: '1 497₽'
    },
    {
        id: 'hood20',
        category: 'hoodies',
        title: '«Desire» Zip-Hoodie',
        priceNew: '10 990₽',
        priceOld: '14 990₽',
        imgPrimary: 'image.HOODIES/HOODIES.webp',
        imgSecondary: 'image.HOODIES/HOODIES-hover.webp',
        badge: '',
        installment: '2 747₽'
    },
    {
        id: 'hood21',
        category: 'hoodies',
        title: '«Neuro-Hoodie»',
        priceNew: '9 990₽',
        priceOld: null,
        imgPrimary: 'image.HOODIES/HOODIES.webp',
        imgSecondary: 'image.HOODIES/HOODIES-hover.webp',
        badge: '',
        installment: '2 497₽'
    },
    {
        id: 'hood22',
        category: 'hoodies',
        title: '“Shell” Hoodie',
        priceNew: '7 990₽',
        priceOld: '10 490₽',
        imgPrimary: 'image.HOODIES/HOODIES.webp',
        imgSecondary: 'image.HOODIES/HOODIES-hover.webp',
        badge: 'Last Size!',
        installment: '1 997₽'
    },
    {
        id: 'hood23',
        category: 'hoodies',
        title: '“Shell” Hoodie Black',
        priceNew: '5 990₽',
        priceOld: '10 490₽',
        imgPrimary: 'image.HOODIES/HOODIES.webp',
        imgSecondary: 'image.HOODIES/HOODIES-hover.webp',
        badge: 'Last Size!',
        installment: '1 497₽'
    },

    // ========== LONG SLEEVE (7 товаров) ==========
    {
        id: 'ls1',
        category: 'longsleeve',
        title: '“Union” LongSleeve',
        priceNew: '2 990₽',
        priceOld: '5 990₽',
        imgPrimary: 'image.LONG SLEEVE/LONG SLEEVE.webp',
        imgSecondary: 'image.LONG SLEEVE/LONG SLEEVE-hover.webp',
        badge: '',
        installment: '747₽'
    },
    {
        id: 'ls2',
        category: 'longsleeve',
        title: '“Heavenly” Long',
        priceNew: '4 490₽',
        priceOld: '5 990₽',
        imgPrimary: 'image.LONG SLEEVE/LONG SLEEVE.webp',
        imgSecondary: 'image.LONG SLEEVE/LONG SLEEVE-hover.webp',
        badge: '',
        installment: '1 122₽'
    },
    {
        id: 'ls3',
        category: 'longsleeve',
        title: '“Minimalistic” Long',
        priceNew: '4 490₽',
        priceOld: '5 990₽',
        imgPrimary: 'image.LONG SLEEVE/LONG SLEEVE.webp',
        imgSecondary: 'image.LONG SLEEVE/LONG SLEEVE-hover.webp',
        badge: '',
        installment: '1 122₽'
    },
    {
        id: 'ls4',
        category: 'longsleeve',
        title: 'Fractal Long',
        priceNew: '9 990₽',
        priceOld: null,
        imgPrimary: 'image.LONG SLEEVE/LONG SLEEVE.webp',
        imgSecondary: 'image.LONG SLEEVE/LONG SLEEVE-hover.webp',
        badge: '',
        installment: '2 497₽'
    },
    {
        id: 'ls5',
        category: 'longsleeve',
        title: '«Corrosion» LongSleeve',
        priceNew: '5 490₽',
        priceOld: null,
        imgPrimary: 'image.LONG SLEEVE/LONG SLEEVE.webp',
        imgSecondary: 'image.LONG SLEEVE/LONG SLEEVE-hover.webp',
        badge: '',
        installment: '1 372₽'
    },
    {
        id: 'ls6',
        category: 'longsleeve',
        title: '“Shell” Longsleeve White',
        priceNew: '6 490₽',
        priceOld: '9 990₽',
        imgPrimary: 'image.LONG SLEEVE/LONG SLEEVE.webp',
        imgSecondary: 'image.LONG SLEEVE/LONG SLEEVE-hover.webp',
        badge: '',
        installment: '1 622₽'
    },
    {
        id: 'ls7',
        category: 'longsleeve',
        title: '“Shell” Longsleeve Black',
        priceNew: '6 490₽',
        priceOld: '9 990₽',
        imgPrimary: 'image.LONG SLEEVE/LONG SLEEVE.webp',
        imgSecondary: 'image.LONG SLEEVE/LONG SLEEVE-hover.webp',
        badge: '',
        installment: '1 622₽'
    },

    // ========== T-SHIRTS (8 товаров) ==========
    {
        id: 'tshirt1',
        category: 'tshirts',
        title: '“Union” T-Shirt',
        priceNew: '2 490₽',
        priceOld: '4 990₽',
        imgPrimary: 'image.T-SHIRTS/T-SHIRTS.webp',
        imgSecondary: 'image.T-SHIRTS/T-SHIRTS-hover.webp',
        badge: '',
        installment: '622₽'
    },
    {
        id: 'tshirt2',
        category: 'tshirts',
        title: '“Void” T-Shirt',
        priceNew: '3 990₽',
        priceOld: '5 990₽',
        imgPrimary: 'image.T-SHIRTS/T-SHIRTS.webp',
        imgSecondary: 'image.T-SHIRTS/T-SHIRTS-hover.webp',
        badge: '',
        installment: '997₽'
    },
    {
        id: 'tshirt3',
        category: 'tshirts',
        title: '“Minimalistic” T-Shirt',
        priceNew: '2 990₽',
        priceOld: '4 990₽',
        imgPrimary: 'image.T-SHIRTS/T-SHIRTS.webp',
        imgSecondary: 'image.T-SHIRTS/T-SHIRTS-hover.webp',
        badge: '',
        installment: '747₽'
    },
    {
        id: 'tshirt4',
        category: 'tshirts',
        title: '“Heavenly” T-Shirt',
        priceNew: '3 490₽',
        priceOld: '5 490₽',
        imgPrimary: 'image.T-SHIRTS/T-SHIRTS.webp',
        imgSecondary: 'image.T-SHIRTS/T-SHIRTS-hover.webp',
        badge: '',
        installment: '872₽'
    },
    {
        id: 'tshirt5',
        category: 'tshirts',
        title: '“Corrosion” T-Shirt',
        priceNew: '4 490₽',
        priceOld: '6 490₽',
        imgPrimary: 'image.T-SHIRTS/T-SHIRTS.webp',
        imgSecondary: 'image.T-SHIRTS/T-SHIRTS-hover.webp',
        badge: '',
        installment: '1 122₽'
    },
    {
        id: 'tshirt6',
        category: 'tshirts',
        title: '“Shell” T-Shirt White',
        priceNew: '3 990₽',
        priceOld: '5 990₽',
        imgPrimary: 'image.T-SHIRTS/T-SHIRTS.webp',
        imgSecondary: 'image.T-SHIRTS/T-SHIRTS-hover.webp',
        badge: '',
        installment: '997₽'
    },
    {
        id: 'tshirt7',
        category: 'tshirts',
        title: '“Shell” T-Shirt Black',
        priceNew: '3 990₽',
        priceOld: '5 990₽',
        imgPrimary: 'image.T-SHIRTS/T-SHIRTS.webp',
        imgSecondary: 'image.T-SHIRTS/T-SHIRTS-hover.webp',
        badge: '',
        installment: '997₽'
    },
    {
        id: 'tshirt8',
        category: 'tshirts',
        title: '“Ex Sample” T-Shirt',
        priceNew: '2 990₽',
        priceOld: '4 990₽',
        imgPrimary: 'image.T-SHIRTS/T-SHIRTS.webp',
        imgSecondary: 'image.T-SHIRTS/T-SHIRTS-hover.webp',
        badge: '',
        installment: '747₽'
    },

    // ========== PANTS (10 товаров) ==========
    {
        id: 'pants1',
        category: 'pants',
        title: '“Ex Sample Classic” Pants Black',
        priceNew: '6 490₽',
        priceOld: '6 990₽',
        imgPrimary: 'image.PANTS/PANTS.webp',
        imgSecondary: 'image.PANTS/PANTS-hover.webp',
        badge: 'NEW',
        installment: '1 622₽'
    },
    {
        id: 'pants2',
        category: 'pants',
        title: '“Ex Sample Classic” Pants Gray',
        priceNew: '6 490₽',
        priceOld: '7 990₽',
        imgPrimary: 'image.PANTS/PANTS.webp',
        imgSecondary: 'image.PANTS/PANTS-hover.webp',
        badge: 'NEW',
        installment: '1 622₽'
    },
    {
        id: 'pants3',
        category: 'pants',
        title: '“Criss Cross” Pants',
        priceNew: '7 990₽',
        priceOld: '9 990₽',
        imgPrimary: 'image.PANTS/PANTS.webp',
        imgSecondary: 'image.PANTS/PANTS-hover.webp',
        badge: 'NEW',
        installment: '1 997₽'
    },
    {
        id: 'pants4',
        category: 'pants',
        title: '“Void” Pants',
        priceNew: '5 990₽',
        priceOld: '8 990₽',
        imgPrimary: 'image.PANTS/PANTS.webp',
        imgSecondary: 'image.PANTS/PANTS-hover.webp',
        badge: '',
        installment: '1 497₽'
    },
    {
        id: 'pants5',
        category: 'pants',
        title: '“JJ” Pants',
        priceNew: '6 990₽',
        priceOld: '9 490₽',
        imgPrimary: 'image.PANTS/PANTS.webp',
        imgSecondary: 'image.PANTS/PANTS-hover.webp',
        badge: '',
        installment: '1 747₽'
    },
    {
        id: 'pants6',
        category: 'pants',
        title: '“Ex Sample” Pants',
        priceNew: '6 990₽',
        priceOld: '9 490₽',
        imgPrimary: 'image.PANTS/PANTS.webp',
        imgSecondary: 'image.PANTS/PANTS-hover.webp',
        badge: 'HIT',
        installment: '1 747₽'
    },
    {
        id: 'pants7',
        category: 'pants',
        title: '“Waves” Pants',
        priceNew: '8 990₽',
        priceOld: null,
        imgPrimary: 'image.PANTS/PANTS.webp',
        imgSecondary: 'image.PANTS/PANTS-hover.webp',
        badge: '',
        installment: '2 247₽'
    },
    {
        id: 'pants8',
        category: 'pants',
        title: '“Tape” Pants Black',
        priceNew: '8 990₽',
        priceOld: null,
        imgPrimary: 'image.PANTS/PANTS.webp',
        imgSecondary: 'image.PANTS/PANTS-hover.webp',
        badge: '',
        installment: '2 247₽'
    },
    {
        id: 'pants9',
        category: 'pants',
        title: '“Rarity” Jeans',
        priceNew: '8 990₽',
        priceOld: '11 490₽',
        imgPrimary: 'image.PANTS/PANTS.webp',
        imgSecondary: 'image.PANTS/PANTS-hover.webp',
        badge: '',
        installment: '2 247₽'
    },
    {
        id: 'pants10',
        category: 'pants',
        title: '“Ex Sample” Pants Blue',
        priceNew: '5 990₽',
        priceOld: '8 990₽',
        imgPrimary: 'image.PANTS/PANTS.webp',
        imgSecondary: 'image.PANTS/PANTS-hover.webp',
        badge: '',
        installment: '1 497₽'
    },

    // ========== SHORTS (4 товара) ==========
    {
        id: 'shorts1',
        category: 'shorts',
        title: '“JJ” Shorts',
        priceNew: '3 990₽',
        priceOld: '6 490₽',
        imgPrimary: 'image.SHORTS/SHORTS.webp',
        imgSecondary: 'image.SHORTS/SHORTS-hover.webp',
        badge: 'SALE',
        installment: '997₽'
    },
    {
        id: 'shorts2',
        category: 'shorts',
        title: '“Ex Sample” Shorts',
        priceNew: '4 690₽',
        priceOld: '6 590₽',
        imgPrimary: 'image.SHORTS/SHORTS.webp',
        imgSecondary: 'image.SHORTS/SHORTS-hover.webp',
        badge: '',
        installment: '1 172₽'
    },
    {
        id: 'shorts3',
        category: 'shorts',
        title: '“Void” Shorts',
        priceNew: '3 490₽',
        priceOld: '5 490₽',
        imgPrimary: 'image.SHORTS/SHORTS.webp',
        imgSecondary: 'image.SHORTS/SHORTS-hover.webp',
        badge: '',
        installment: '872₽'
    },
    {
        id: 'shorts4',
        category: 'shorts',
        title: '“Basic” Shorts',
        priceNew: '2 990₽',
        priceOld: '4 990₽',
        imgPrimary: 'image.SHORTS/SHORTS.webp',
        imgSecondary: 'image.SHORTS/SHORTS-hover.webp',
        badge: '',
        installment: '747₽'
    },

    // ========== ACCESSORIES (1 товар) ==========
    {
        id: 'acc1',
        category: 'accessories',
        title: 'Бейсболка UNFORT',
        priceNew: '2 490₽',
        priceOld: null,
        imgPrimary: 'image.ACCESSORIES/ACCESSORIES.webp',
        imgSecondary: 'image.ACCESSORIES/ACCESSORIES-hover.jpg',
        badge: '',
        installment: '622₽'
    }
];