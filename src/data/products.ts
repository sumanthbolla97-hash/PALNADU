export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  weight: string;
  image: string;
  ingredients: string;
  shelfLife: string;
  storage: string;
  healthBenefits: string;
}

export const products: Product[] = [
  {
    id: "idli-karam-podi",
    name: "Idli Karam Podi",
    shortDescription: "Traditional Andhra spice blend crafted for idli, dosa, and rice.",
    price: 149,
    weight: "100g",
    image: "/traditional-spices.png",
    ingredients: "Red chilli, roasted dal, garlic, cumin, salt, traditional spices",
    shelfLife: "3 months",
    storage: "Store in an airtight container in a cool, dry place.",
    healthBenefits: "Rich in antioxidants, aids digestion, and may boost metabolism. Garlic and cumin are known for their immune-boosting properties."
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
    healthBenefits: "Excellent source of plant-based protein and dietary fiber, which supports muscle repair and digestive health. Low glycemic index helps in blood sugar control."
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
    healthBenefits: "Curry leaves are packed with antioxidants and may help control blood sugar levels and support hair health. Lentils provide protein and fiber."
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
    healthBenefits: "Peanuts are a good source of protein and healthy fats. Garlic and cumin contribute to heart health and have immune-boosting properties."
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
    healthBenefits: "Sesame seeds are rich in healthy fats, protein, and B vitamins. They may help lower cholesterol and blood pressure."
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
    healthBenefits: "Garlic is known for its cardiovascular and immune-boosting benefits. Coriander seeds aid digestion and are rich in antioxidants."
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
    healthBenefits: "Coconut provides healthy fats and fiber. Garlic and cumin contribute to heart health and have anti-inflammatory properties."
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
    healthBenefits: "Flaxseeds are an excellent source of Omega-3 fatty acids, which are crucial for heart health. They are also high in fiber and may help reduce cancer risk."
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
    healthBenefits: "Curry leaves are rich in antioxidants and are known to have anti-diabetic properties. Lentils add a good measure of protein and fiber."
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
    healthBenefits: "A complex blend of spices, lentils, and herbs that offers a wide range of health benefits, including improved digestion, boosted immunity, and anti-inflammatory properties."
  }
];
