export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  weight: string;
  image: string;
  images?: string[];
  ingredients: string;
  shelfLife: string;
  storage: string;
  recipe?: string;
}

export const products: Product[] = [
  {
    id: "idli-karam-podi",
    name: "Idli Karam Podi",
    shortDescription: "Traditional Andhra spice blend crafted for idli, dosa, and rice.",
    price: 149,
    weight: "100g",
    image: "/traditional-spices.png",
    images: ["/traditional-spices.png", "/Theritual.png"],
    ingredients: "Red chilli, roasted dal, garlic, cumin, salt, traditional spices",
    shelfLife: "3 months",
    storage: "Store in an airtight container in a cool, dry place.",
    recipe: "Mix with sesame oil or melted ghee to form a paste. Serve as a side with hot idlis, dosas, or uttapam."
  },
  {
    id: "kandi-podi",
    name: "Kandi Podi",
    shortDescription: "A comforting blend of roasted lentils and mild spices, perfect with hot rice and ghee.",
    price: 159,
    weight: "100g",
    image: "/traditional-spices.png",
    ingredients: "Toor dal, chana dal, red chilli, cumin, salt",
    shelfLife: "3 months",
    storage: "Store in an airtight container in a cool, dry place.",
    recipe: "Mix 2 tablespoons of Kandi Podi with steaming hot rice and a generous dollop of ghee. Form small balls and enjoy the comforting taste."
  },
  {
    id: "karivepaku-podi",
    name: "Karivepaku Podi",
    shortDescription: "Nutrient-rich curry leaf powder with a deep, earthy flavor profile.",
    price: 169,
    weight: "100g",
    image: "/traditional-spices.png",
    ingredients: "Fresh curry leaves, urad dal, chana dal, tamarind, red chilli",
    shelfLife: "3 months",
    storage: "Store in an airtight container in a cool, dry place.",
    recipe: "Mix with hot rice and ghee for a nutrient-packed meal, or sprinkle over butter dosa for an earthy, crunchy flavor."
  },
  {
    id: "palli-karam",
    name: "Palli Karam",
    shortDescription: "Rich peanut-based spice mix adding a nutty crunch to your daily meals.",
    price: 149,
    weight: "100g",
    image: "/traditional-spices.png",
    ingredients: "Roasted peanuts, garlic, red chilli, cumin, salt",
    shelfLife: "3 months",
    storage: "Store in an airtight container in a cool, dry place.",
    recipe: "Perfect as a side for upma or mixed with hot rice. Can also be sprinkled over stir-fried vegetables for an added nutty crunch."
  },
  {
    id: "nuvvula-podi",
    name: "Nuvvula Podi",
    shortDescription: "Aromatic roasted sesame seed powder, a staple in traditional Andhra households.",
    price: 179,
    weight: "100g",
    image: "/traditional-spices.png",
    ingredients: "White sesame seeds, dry red chilli, garlic, salt",
    shelfLife: "3 months",
    storage: "Store in an airtight container in a cool, dry place.",
    recipe: "Mix with hot rice and sesame oil for a traditional lunch. Excellent as a side for any South Indian tiffin."
  },
  {
    id: "garlic-karam",
    name: "Garlic Karam",
    shortDescription: "Intense and pungent garlic spice blend for those who love bold flavors.",
    price: 159,
    weight: "100g",
    image: "/traditional-spices.png",
    ingredients: "Garlic, red chilli powder, coriander seeds, salt",
    shelfLife: "3 months",
    storage: "Store in an airtight container in a cool, dry place.",
    recipe: "Mix with hot rice and ghee. Can also be used as a dry rub for pan-fried potatoes or mixed into curries for a pungent garlic kick."
  },
  {
    id: "coconut-karam",
    name: "Coconut Karam",
    shortDescription: "Sweet and spicy blend of roasted coconut and traditional Andhra spices.",
    price: 169,
    weight: "100g",
    image: "/traditional-spices.png",
    ingredients: "Dry coconut, red chilli, garlic, cumin, salt",
    shelfLife: "3 months",
    storage: "Store in an airtight container in a cool, dry place.",
    recipe: "Enjoy with hot idlis, sprinkle over fresh dosas, or mix with hot rice. The sweet and spicy notes pair perfectly with mild dishes."
  },
  {
    id: "flaxseed-podi",
    name: "Flaxseed Podi",
    shortDescription: "Healthy and flavorful roasted flaxseed powder packed with Omega-3.",
    price: 189,
    weight: "100g",
    image: "/traditional-spices.png",
    ingredients: "Roasted flaxseeds, urad dal, red chilli, garlic, salt",
    shelfLife: "3 months",
    storage: "Store in an airtight container in a cool, dry place.",
    recipe: "Incorporate into your daily diet by mixing with rice and ghee, or sprinkle over your morning oatmeal or salads for a spicy, healthy twist."
  },
  {
    id: "curry-leaf-special",
    name: "Curry Leaf Special",
    shortDescription: "Premium hand-pounded curry leaf blend with an extra kick of spice.",
    price: 199,
    weight: "100g",
    image: "/traditional-spices.png",
    ingredients: "Premium curry leaves, roasted lentils, traditional spices",
    shelfLife: "3 months",
    storage: "Store in an airtight container in a cool, dry place.",
    recipe: "Mix with hot rice and a spoon of ghee. Can also be used to temper buttermilk or as a seasoning for vegetable stir-fries."
  },
  {
    id: "premium-mixed-karam",
    name: "Premium Mixed Karam",
    shortDescription: "Our signature master blend combining the best of traditional Andhra spices.",
    price: 249,
    weight: "100g",
    image: "/traditional-spices.png",
    ingredients: "Secret blend of 12 traditional spices, lentils, and herbs",
    shelfLife: "3 months",
    storage: "Store in an airtight container in a cool, dry place.",
    recipe: "Our versatile master blend can be mixed with rice and ghee, used as a side for any tiffin, or sprinkled over curries for enhanced flavor."
  }
];
