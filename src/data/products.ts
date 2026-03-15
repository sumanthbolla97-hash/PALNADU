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
}

export const products: Product[] = [
  {
    id: "idli-karam-podi",
    name: "Idli Karam Podi",
    shortDescription: "Traditional Andhra spice blend crafted for idli, dosa, and rice.",
    price: 149,
    weight: "100g",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: "Red chilli, roasted dal, garlic, cumin, salt, traditional spices",
    shelfLife: "3 months",
    storage: "Store in an airtight container in a cool, dry place."
  },
  {
    id: "kandi-podi",
    name: "Kandi Podi",
    shortDescription: "A comforting blend of roasted lentils and mild spices, perfect with hot rice and ghee.",
    price: 159,
    weight: "100g",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: "Toor dal, chana dal, red chilli, cumin, salt",
    shelfLife: "3 months",
    storage: "Store in an airtight container in a cool, dry place."
  },
  {
    id: "karivepaku-podi",
    name: "Karivepaku Podi",
    shortDescription: "Nutrient-rich curry leaf powder with a deep, earthy flavor profile.",
    price: 169,
    weight: "100g",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: "Fresh curry leaves, urad dal, chana dal, tamarind, red chilli",
    shelfLife: "3 months",
    storage: "Store in an airtight container in a cool, dry place."
  },
  {
    id: "palli-karam",
    name: "Palli Karam",
    shortDescription: "Rich peanut-based spice mix adding a nutty crunch to your daily meals.",
    price: 149,
    weight: "100g",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: "Roasted peanuts, garlic, red chilli, cumin, salt",
    shelfLife: "3 months",
    storage: "Store in an airtight container in a cool, dry place."
  },
  {
    id: "nuvvula-podi",
    name: "Nuvvula Podi",
    shortDescription: "Aromatic roasted sesame seed powder, a staple in traditional Andhra households.",
    price: 179,
    weight: "100g",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: "White sesame seeds, dry red chilli, garlic, salt",
    shelfLife: "3 months",
    storage: "Store in an airtight container in a cool, dry place."
  },
  {
    id: "garlic-karam",
    name: "Garlic Karam",
    shortDescription: "Intense and pungent garlic spice blend for those who love bold flavors.",
    price: 159,
    weight: "100g",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: "Garlic, red chilli powder, coriander seeds, salt",
    shelfLife: "3 months",
    storage: "Store in an airtight container in a cool, dry place."
  },
  {
    id: "coconut-karam",
    name: "Coconut Karam",
    shortDescription: "Sweet and spicy blend of roasted coconut and traditional Andhra spices.",
    price: 169,
    weight: "100g",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: "Dry coconut, red chilli, garlic, cumin, salt",
    shelfLife: "3 months",
    storage: "Store in an airtight container in a cool, dry place."
  },
  {
    id: "flaxseed-podi",
    name: "Flaxseed Podi",
    shortDescription: "Healthy and flavorful roasted flaxseed powder packed with Omega-3.",
    price: 189,
    weight: "100g",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: "Roasted flaxseeds, urad dal, red chilli, garlic, salt",
    shelfLife: "3 months",
    storage: "Store in an airtight container in a cool, dry place."
  },
  {
    id: "curry-leaf-special",
    name: "Curry Leaf Special",
    shortDescription: "Premium hand-pounded curry leaf blend with an extra kick of spice.",
    price: 199,
    weight: "100g",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: "Premium curry leaves, roasted lentils, traditional spices",
    shelfLife: "3 months",
    storage: "Store in an airtight container in a cool, dry place."
  },
  {
    id: "premium-mixed-karam",
    name: "Premium Mixed Karam",
    shortDescription: "Our signature master blend combining the best of traditional Andhra spices.",
    price: 249,
    weight: "100g",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ingredients: "Secret blend of 12 traditional spices, lentils, and herbs",
    shelfLife: "3 months",
    storage: "Store in an airtight container in a cool, dry place."
  }
];
