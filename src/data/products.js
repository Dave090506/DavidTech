import hpEliteBook from "../assets/images/products/hp-elitebook.png";
import dellXps15 from "../assets/images/products/dell-xps15.png";
import lenovoLegion from "../assets/images/products/lenovo-legion.png";
import macbookPro from "../assets/images/products/macbook-pro.png";

import hpProDesk from "../assets/images/products/hp-prodesk.png";
import dellOptiPlex from "../assets/images/products/dell-optiplex.png";
import lenovoThinkCentre from "../assets/images/products/lenovo-thinkcentre.png";

import dellUltraSharp from "../assets/images/products/dell-ultrasharp.png";
import lgUltraWide from "../assets/images/products/lg-ultrawide.png";
import samsungOdyssey from "../assets/images/products/samsung-odyssey.png";

import logitechMxKeys from "../assets/images/products/logitech-mx-keys.png";
import keychronK2 from "../assets/images/products/keychron-k2.png";
import redragonK552 from "../assets/images/products/redragon-k552.png";

import logitechMxMaster3S from "../assets/images/products/logitech-mx-master-3s.png";
import razerDeathAdderV3 from "../assets/images/products/razer-deathadder-v3.png";
import hpWirelessMouse from "../assets/images/products/hp-wireless-mouse.png";

import sonyWH1000XM5 from "../assets/images/products/sony-wh1000xm5.png";
import logitechGProX from "../assets/images/products/logitech-g-pro-x.png";
import razerBlackSharkV2 from "../assets/images/products/razer-blackshark-v2.png";

const products = [
  {
    id: 1,
    image: hpEliteBook,
    name: "HP EliteBook 840 G10",
    price: "₦850,000",
    rating: 5,
    badge: "New",
    category: "Laptops",
    brand: "HP",
    type: "Business Laptop",
  },

  {
    id: 2,
    image: dellXps15,
    name: "Dell XPS 15",
    price: "₦1,250,000",
    rating: 5,
    badge: "Best Seller",
    category: "Laptops",
    brand: "Dell",
    type: "Premium Laptop",
  },

  {
    id: 3,
    image: lenovoLegion,
    name: "Lenovo Legion 5 Pro",
    price: "₦1,450,000",
    rating: 4,
    badge: "Gaming",
    category: "Laptops",
    brand: "Lenovo",
    type: "Gaming Laptop",
  },

  {
    id: 4,
    image: macbookPro,
    name: "MacBook Pro M3",
    price: "₦2,400,000",
    rating: 5,
    badge: "Premium",
    category: "Laptops",
    brand: "Apple",
    type: "Professional Laptop",
  },

  {
    id: 5,
    image: hpProDesk,
    name: "HP ProDesk 400 G9",
    price: "₦780,000",
    rating: 4,
    badge: "Office",
    category: "Desktop Computers",
    brand: "HP",
    type: "Office Desktop",
  },

  {
    id: 6,
    image: dellOptiPlex,
    name: "Dell OptiPlex 7010",
    price: "₦920,000",
    rating: 5,
    badge: "New",
    category: "Desktop Computers",
    brand: "Dell",
    type: "Office Desktop",
  },

  {
    id: 7,
    image: lenovoThinkCentre,
    name: "Lenovo ThinkCentre M90",
    price: "₦990,000",
    rating: 5,
    badge: "Best Seller",
    category: "Desktop Computers",
    brand: "Lenovo",
    type: "Business Desktop",
  },

  {
    id: 8,
    image: dellUltraSharp,
    name: 'Dell UltraSharp 27"',
    price: "₦420,000",
    rating: 5,
    badge: "Professional",
    category: "Monitors",
    brand: "Dell",
    type: "Professional Monitor",
  },

  {
    id: 9,
    image: lgUltraWide,
    name: 'LG UltraWide 34"',
    price: "₦680,000",
    rating: 5,
    badge: "Editor's Choice",
    category: "Monitors",
    brand: "LG",
    type: "UltraWide Monitor",
  },

  {
    id: 10,
    image: samsungOdyssey,
    name: "Samsung Odyssey G5",
    price: "₦750,000",
    rating: 4,
    badge: "Gaming",
    category: "Monitors",
    brand: "Samsung",
    type: "Gaming Monitor",
  },

  {
    id: 11,
    image: logitechMxKeys,
    name: "Logitech MX Keys",
    price: "₦100,000",
    rating: 5,
    badge: "Best Seller",
    category: "Keyboards",
    brand: "Logitech",
    type: "Wireless Keyboard",
  },

  {
    id: 12,
    image: keychronK2,
    name: "Keychron K2",
    price: "₦70,000",
    rating: 4,
    badge: "Wireless",
    category: "Keyboards",
    brand: "Keychron",
    type: "Mechanical Keyboard",
  },

  {
    id: 13,
    image: redragonK552,
    name: "Redragon K552",
    price: "₦85,000",
    rating: 5,
    badge: "Gaming",
    category: "Keyboards",
    brand: "Redragon",
    type: "Gaming Keyboard",
  },

  {
    id: 14,
    image: logitechMxMaster3S,
    name: "Logitech MX Master 3S",
    price: "₦98,000",
    rating: 5,
    badge: "Best Seller",
    category: "Mice",
    brand: "Logitech",
    type: "Wireless Mouse",
  },

  {
    id: 15,
    image: razerDeathAdderV3,
    name: "Razer DeathAdder V3",
    price: "₦82,000",
    rating: 5,
    badge: "Gaming",
    category: "Mice",
    brand: "Razer",
    type: "Gaming Mouse",
  },

  {
    id: 16,
    image: hpWirelessMouse,
    name: "HP Wireless Mouse",
    price: "₦28,000",
    rating: 4,
    badge: "Budget",
    category: "Mice",
    brand: "HP",
    type: "Wireless Mouse",
  },

  {
    id: 17,
    image: sonyWH1000XM5,
    name: "Sony WH-1000XM5",
    price: "₦320,000",
    rating: 5,
    badge: "Premium",
    category: "Accessories",
    brand: "Sony",
    type: "Wireless Headset",
  },

  {
    id: 18,
    image: logitechGProX,
    name: "Logitech G Pro X",
    price: "₦180,000",
    rating: 5,
    badge: "Gaming",
    category: "Accessories",
    brand: "Logitech",
    type: "Gaming Headset",
  },

  {
    id: 19,
    image: razerBlackSharkV2,
    name: "Razer BlackShark V2",
    price: "₦165,000",
    rating: 4,
    badge: "Esports",
    category: "Accessories",
    brand: "Razer",
    type: "Gaming Headset",
  },
];

export default products;
