/**
 * Static data for the seed.
 *
 * Everything here is fixed text — names, products, prices, people.
 * Randomness (dates, quantities, status picks) lives in seed.ts behind a
 */

export const DEMO_PASSWORD = 'Sohnic123!';

// ----- Branches -----

export const BRANCHES = [
  {
    name: 'Main Branch',
    type: 'main' as const,
    city: 'Cairo',
    country: 'Egypt',
  },
  {
    name: 'Mansoura Branch',
    type: 'sub' as const,
    city: 'Mansoura',
    country: 'Egypt',
  },
  { name: 'Cairo', type: 'sub' as const, city: 'Cairo', country: 'Egypt' },
];

// ----- Roles -----

export const ROLES = [
  {
    role: 'super_admin' as const,
    description: 'CEO — full access to all modules and branches',
  },
  {
    role: 'branch_admin' as const,
    description: 'Manages operations and approvals for their branch',
  },
  { role: 'hr' as const, description: 'Adds, removes and promotes employees' },
  {
    role: 'storage_manager' as const,
    description: 'Monitors inventory and performs stocktaking',
  },
  {
    role: 'accountant' as const,
    description: 'Purchases, supplier payments and cost tracking',
  },
  {
    role: 'inspector' as const,
    description: 'Inspects incoming materials and finished goods',
  },
  {
    role: 'cashier' as const,
    description: 'Records customer sales and product returns',
  },
];

// ----- Users (password: DEMO_PASSWORD) -----

export interface SeedUser {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone: string;
  dateOfBirth: string;
  role: (typeof ROLES)[number]['role'];
  branch: string;
  isActive: boolean;
}

export const USERS: SeedUser[] = [
  {
    firstName: 'Soh',
    lastName: 'Nica',
    email: 'soh@soh.com',
    username: 'soh',
    phone: '+201000000001',
    dateOfBirth: '1990-04-12',
    role: 'super_admin',
    branch: 'Main Branch',
    isActive: true,
  },
  {
    firstName: 'Salma',
    lastName: 'Hassan',
    email: 'salma@sohnic.com',
    username: 'salma',
    phone: '+201000000002',
    dateOfBirth: '1992-07-03',
    role: 'branch_admin',
    branch: 'Main Branch',
    isActive: true,
  },
  {
    firstName: 'Mostafa',
    lastName: 'Ali',
    email: 'sohhhilola_@gmail.com',
    username: 'mostafa',
    phone: '+201000000003',
    dateOfBirth: '1989-11-21',
    role: 'branch_admin',
    branch: 'Mansoura Branch',
    isActive: true,
  },
  {
    firstName: 'Nour',
    lastName: 'Omar',
    email: 'nour@sohnic.com',
    username: 'nour',
    phone: '+201000000004',
    dateOfBirth: '1995-02-17',
    role: 'branch_admin',
    branch: 'Cairo',
    isActive: true,
  },
  {
    firstName: 'Hana',
    lastName: 'Farid',
    email: 'hana@sohnic.com',
    username: 'hana',
    phone: '+201000000005',
    dateOfBirth: '1993-09-30',
    role: 'hr',
    branch: 'Main Branch',
    isActive: true,
  },
  {
    firstName: 'Karim',
    lastName: 'Said',
    email: 'karim@sohnic.com',
    username: 'karim',
    phone: '+201000000006',
    dateOfBirth: '1991-01-08',
    role: 'storage_manager',
    branch: 'Main Branch',
    isActive: true,
  },
  {
    firstName: 'Dina',
    lastName: 'Youssef',
    email: 'dina@sohnic.com',
    username: 'dina',
    phone: '+201000000007',
    dateOfBirth: '1996-05-14',
    role: 'storage_manager',
    branch: 'Cairo',
    isActive: true,
  },
  {
    firstName: 'Tarek',
    lastName: 'Mansour',
    email: 'tarek@sohnic.com',
    username: 'tarek',
    phone: '+201000000008',
    dateOfBirth: '1988-08-25',
    role: 'accountant',
    branch: 'Main Branch',
    isActive: true,
  },
  {
    firstName: 'Rania',
    lastName: 'Adel',
    email: 'rania@sohnic.com',
    username: 'rania',
    phone: '+201000000009',
    dateOfBirth: '1994-12-02',
    role: 'accountant',
    branch: 'Mansoura Branch',
    isActive: true,
  },
  {
    firstName: 'Yara',
    lastName: 'Nabil',
    email: 'yara@sohnic.com',
    username: 'yara',
    phone: '+201000000010',
    dateOfBirth: '1997-03-19',
    role: 'inspector',
    branch: 'Main Branch',
    isActive: true,
  },
  {
    firstName: 'Amr',
    lastName: 'Sherif',
    email: 'amr@sohnic.com',
    username: 'amr',
    phone: '+201000000011',
    dateOfBirth: '1990-06-06',
    role: 'inspector',
    branch: 'Cairo',
    isActive: true,
  },
  {
    firstName: 'Laila',
    lastName: 'Fouad',
    email: 'laila@sohnic.com',
    username: 'laila',
    phone: '+201000000012',
    dateOfBirth: '1998-10-11',
    role: 'cashier',
    branch: 'Main Branch',
    isActive: true,
  },
  {
    firstName: 'Ziad',
    lastName: 'Hakim',
    email: 'ziad@sohnic.com',
    username: 'ziad',
    phone: '+201000000013',
    dateOfBirth: '1999-04-27',
    role: 'cashier',
    branch: 'Mansoura Branch',
    isActive: true,
  },
  {
    firstName: 'Mariam',
    lastName: 'Adham',
    email: 'mariam@sohnic.com',
    username: 'mariam',
    phone: '+201000000014',
    dateOfBirth: '1996-01-15',
    role: 'cashier',
    branch: 'Cairo',
    isActive: true,
  },
  {
    firstName: 'Omar',
    lastName: 'Nasr',
    email: 'omar@sohnic.com',
    username: 'omar',
    phone: '+201000000015',
    dateOfBirth: '1993-07-09',
    role: 'cashier',
    branch: 'Main Branch',
    isActive: false,
  },
];

// ----- Customers -----

export const CUSTOMERS = [
  {
    firstName: 'Ahmed',
    lastName: 'Kamel',
    type: 'individual' as const,
    phone: '+201111111101',
  },
  {
    firstName: 'Sara',
    lastName: 'Mahmoud',
    type: 'individual' as const,
    phone: '+201111111102',
  },
  {
    firstName: 'Intellect',
    lastName: 'Academy',
    type: 'educational' as const,
    phone: '+201111111103',
  },
  {
    firstName: 'GizWorks',
    lastName: 'Lab',
    type: 'business' as const,
    phone: '+201111111104',
  },
  {
    firstName: 'Hossam',
    lastName: 'Diaa',
    type: 'individual' as const,
    phone: '+201111111105',
  },
  {
    firstName: 'Fatma',
    lastName: 'Roshdy',
    type: 'individual' as const,
    phone: '+201111111106',
  },
  {
    firstName: 'CairoUni',
    lastName: 'Engineering',
    type: 'educational' as const,
    phone: '+201111111107',
  },
  {
    firstName: 'Robotix',
    lastName: 'EG',
    type: 'business' as const,
    phone: '+201111111108',
  },
  {
    firstName: 'Ibrahim',
    lastName: 'Lotfy',
    type: 'individual' as const,
    phone: '+201111111109',
  },
  {
    firstName: 'Nadia',
    lastName: 'Shokry',
    type: 'individual' as const,
    phone: '+201111111110',
  },
  {
    firstName: 'Delta',
    lastName: 'Makers',
    type: 'business' as const,
    phone: '+201111111111',
  },
  {
    firstName: 'Youssef',
    lastName: 'Baraka',
    type: 'individual' as const,
    phone: '+201111111112',
  },
  {
    firstName: 'Aya',
    lastName: 'Sobhy',
    type: 'individual' as const,
    phone: '+201111111113',
  },
  {
    firstName: 'Mansoura',
    lastName: 'Uni',
    type: 'educational' as const,
    phone: '+201111111114',
  },
  {
    firstName: 'Sherif',
    lastName: 'Anwar',
    type: 'individual' as const,
    phone: '+201111111115',
  },
];

// ----- Categories (children reference their parent by name) -----

export const CATEGORIES: { name: string; parent?: string }[] = [
  { name: 'Development Boards & Microcontrollers' },
  { name: 'Sensor Modules' },
  { name: 'Communication Modules' },
  { name: 'Power Management' },
  { name: 'Display Modules' },
  { name: 'Motor Drivers & Control' },
  { name: 'Interface & Conversion' },
  { name: 'Audio & Signal Processing' },
  { name: 'Wiring & Cables' },
  { name: 'Prototyping & PCB Supplies' },
  { name: 'Passive Components' },
  { name: 'Mechanical Components' },
  {
    name: 'WiFi & Bluetooth Boards',
    parent: 'Development Boards & Microcontrollers',
  },
  { name: 'Environmental Sensors', parent: 'Sensor Modules' },
  { name: 'LCD & OLED Displays', parent: 'Display Modules' },
  { name: 'Relay Modules', parent: 'Motor Drivers & Control' },
];

// ----- Suppliers / manufacturers -----

export const SUPPLIERS = [
  {
    name: 'Hany Electronic Trading',
    companyName: 'Hany Trading',
    email: 'sales@hanytrading.com',
    phone: '+201022334455',
    city: 'Cairo',
    country: 'Egypt',
  },
  {
    name: 'Shenzhen ChipSource',
    companyName: 'ChipSource Ltd',
    email: 'orders@chipsource.cn',
    phone: '+8613800138000',
    city: 'Shenzhen',
    country: 'China',
  },
  {
    name: 'Gulf Components',
    companyName: 'Gulf Components FZE',
    email: 'info@gulfcomponents.ae',
    phone: '+97144556677',
    city: 'Dubai',
    country: 'UAE',
  },
  {
    name: 'Nile Prototyping',
    companyName: 'Nile Proto Supplies',
    email: 'hello@nileproto.com',
    phone: '+201066778899',
    city: 'Giza',
    country: 'Egypt',
  },
  {
    name: 'Istanbul Elektronik',
    companyName: 'IST Elektronik A.S.',
    email: 'sales@istelektronik.tr',
    phone: '+902121234567',
    city: 'Istanbul',
    country: 'Turkey',
  },
  {
    name: 'Asia Passive Parts',
    companyName: 'APP Components',
    email: 'support@apparts.tw',
    phone: '+886223456789',
    city: 'Taipei',
    country: 'Taiwan',
  },
];

export const MANUFACTURERS = [
  {
    companyName: 'Tech Manufacturer Co.',
    city: 'Alexandria',
    country: 'Egypt',
    address: '123 Industrial St',
    phone: '+201234567890',
    email: 'manufacturer@techco.com',
  },
  {
    companyName: 'ElectroBuild Assembly',
    city: 'Cairo',
    country: 'Egypt',
    address: '45 10th of Ramadan City',
    phone: '+201298765432',
    email: 'ops@electrobuild.eg',
  },
];

// ----- Raw materials -----

export interface SeedRawMaterial {
  name: string;
  sku: string;
  unitOfMeasurement: string;
  standardPrice: string;
  reorderPoint: number;
}

export const RAW_MATERIALS: SeedRawMaterial[] = [
  {
    name: 'Single Layer PCB',
    sku: 'PCB-001',
    unitOfMeasurement: 'pcs',
    standardPrice: '2.50',
    reorderPoint: 50,
  },
  {
    name: 'Double Layer PCB',
    sku: 'PCB-002',
    unitOfMeasurement: 'pcs',
    standardPrice: '4.20',
    reorderPoint: 40,
  },
  {
    name: 'ATmega328P Chip',
    sku: 'CHIP-001',
    unitOfMeasurement: 'pcs',
    standardPrice: '3.00',
    reorderPoint: 30,
  },
  {
    name: 'Resistor 10kΩ',
    sku: 'RES-001',
    unitOfMeasurement: 'pcs',
    standardPrice: '0.10',
    reorderPoint: 200,
  },
  {
    name: 'ESP32-WROOM-32 Module',
    sku: 'CHIP-002',
    unitOfMeasurement: 'pcs',
    standardPrice: '3.20',
    reorderPoint: 60,
  },
  {
    name: 'ESP8266 ESP-12F',
    sku: 'CHIP-003',
    unitOfMeasurement: 'pcs',
    standardPrice: '1.90',
    reorderPoint: 80,
  },
  {
    name: 'AMS1117-3.3 Regulator',
    sku: 'CHIP-004',
    unitOfMeasurement: 'pcs',
    standardPrice: '0.35',
    reorderPoint: 300,
  },
  {
    name: 'LM7805 Regulator IC',
    sku: 'CHIP-005',
    unitOfMeasurement: 'pcs',
    standardPrice: '0.45',
    reorderPoint: 250,
  },
  {
    name: '16MHz Crystal Oscillator',
    sku: 'XTAL-001',
    unitOfMeasurement: 'pcs',
    standardPrice: '0.25',
    reorderPoint: 150,
  },
  {
    name: 'Ceramic Capacitor 0.1µF',
    sku: 'CAP-001',
    unitOfMeasurement: 'pcs',
    standardPrice: '0.04',
    reorderPoint: 1000,
  },
  {
    name: 'Electrolytic Capacitor 100µF',
    sku: 'CAP-002',
    unitOfMeasurement: 'pcs',
    standardPrice: '0.09',
    reorderPoint: 600,
  },
  {
    name: 'Resistor 220Ω',
    sku: 'RES-002',
    unitOfMeasurement: 'pcs',
    standardPrice: '0.04',
    reorderPoint: 1000,
  },
  {
    name: 'Resistor 4.7kΩ',
    sku: 'RES-003',
    unitOfMeasurement: 'pcs',
    standardPrice: '0.05',
    reorderPoint: 800,
  },
  {
    name: 'Red LED 5mm',
    sku: 'LED-001',
    unitOfMeasurement: 'pcs',
    standardPrice: '0.07',
    reorderPoint: 700,
  },
  {
    name: 'Male Pin Header 40P',
    sku: 'HDR-001',
    unitOfMeasurement: 'pcs',
    standardPrice: '0.18',
    reorderPoint: 400,
  },
  {
    name: 'USB Type-B Connector',
    sku: 'CONN-001',
    unitOfMeasurement: 'pcs',
    standardPrice: '0.55',
    reorderPoint: 200,
  },
  {
    name: 'DC Power Jack 2.1mm',
    sku: 'CONN-002',
    unitOfMeasurement: 'pcs',
    standardPrice: '0.40',
    reorderPoint: 250,
  },
  {
    name: 'JST 2P Connector',
    sku: 'CONN-003',
    unitOfMeasurement: 'pcs',
    standardPrice: '0.15',
    reorderPoint: 500,
  },
  {
    name: 'IRF540N MOSFET',
    sku: 'SEM-001',
    unitOfMeasurement: 'pcs',
    standardPrice: '0.65',
    reorderPoint: 150,
  },
  {
    name: 'Anti-static Packaging Bag',
    sku: 'PACK-001',
    unitOfMeasurement: 'pcs',
    standardPrice: '0.12',
    reorderPoint: 900,
  },
];

// ----- Sellable items -----
// cost => manufacturingCost when finished, purchasePrice when resale

export interface SeedSellableItem {
  name: string;
  sku: string;
  category: string;
  sellableType: 'finished' | 'resale';
  price: string;
  cost: string;
  reorderPoint: number;
  modelNumber?: string;
}

export const SELLABLE_ITEMS: SeedSellableItem[] = [
  // Development boards & microcontrollers
  {
    name: 'Arduino Uno Compatible Board',
    sku: 'ARD-UNO-001',
    category: 'Development Boards & Microcontrollers',
    sellableType: 'finished',
    price: '25.00',
    cost: '10.00',
    reorderPoint: 10,
    modelNumber: 'UNO-R3',
  },
  {
    name: 'Arduino Mega 2560',
    sku: 'ARD-MEGA-001',
    category: 'Development Boards & Microcontrollers',
    sellableType: 'finished',
    price: '38.00',
    cost: '16.00',
    reorderPoint: 8,
    modelNumber: 'MEGA-2560',
  },
  {
    name: 'Arduino Nano',
    sku: 'ARD-NANO-001',
    category: 'Development Boards & Microcontrollers',
    sellableType: 'finished',
    price: '15.00',
    cost: '6.00',
    reorderPoint: 12,
    modelNumber: 'NANO-V3',
  },
  {
    name: 'ESP32 DevKit',
    sku: 'ESP32-DEV-001',
    category: 'WiFi & Bluetooth Boards',
    sellableType: 'finished',
    price: '12.00',
    cost: '5.00',
    reorderPoint: 20,
    modelNumber: 'ESP32-WROOM',
  },
  {
    name: 'ESP8266 NodeMCU',
    sku: 'ESP8266-DEV-001',
    category: 'WiFi & Bluetooth Boards',
    sellableType: 'finished',
    price: '8.00',
    cost: '3.50',
    reorderPoint: 20,
    modelNumber: 'NODEMCU-V3',
  },
  {
    name: 'STM32 Blue Pill',
    sku: 'STM32-BP-001',
    category: 'Development Boards & Microcontrollers',
    sellableType: 'finished',
    price: '10.00',
    cost: '4.50',
    reorderPoint: 10,
    modelNumber: 'STM32F103C8',
  },
  {
    name: 'Raspberry Pi Pico',
    sku: 'RPI-PICO-001',
    category: 'Development Boards & Microcontrollers',
    sellableType: 'finished',
    price: '9.00',
    cost: '4.00',
    reorderPoint: 15,
    modelNumber: 'PICO-W',
  },
  {
    name: 'FPGA Development Kit',
    sku: 'FPGA-KIT-001',
    category: 'Development Boards & Microcontrollers',
    sellableType: 'finished',
    price: '65.00',
    cost: '38.00',
    reorderPoint: 3,
    modelNumber: 'ARTIX-7',
  },

  // Sensors
  {
    name: 'DHT22 Temp/Humidity Module',
    sku: 'SNS-DHT22-001',
    category: 'Sensor Modules',
    sellableType: 'finished',
    price: '6.50',
    cost: '2.80',
    reorderPoint: 25,
    modelNumber: 'DHT22',
  },
  {
    name: 'DHT11 Module',
    sku: 'SNS-DHT11-001',
    category: 'Sensor Modules',
    sellableType: 'finished',
    price: '3.50',
    cost: '1.40',
    reorderPoint: 30,
    modelNumber: 'DHT11',
  },
  {
    name: 'MPU6050 Accelerometer',
    sku: 'SNS-MPU6050-001',
    category: 'Sensor Modules',
    sellableType: 'finished',
    price: '5.00',
    cost: '2.20',
    reorderPoint: 20,
    modelNumber: 'MPU-6050',
  },
  {
    name: 'HC-SR04 Ultrasonic Sensor',
    sku: 'SNS-HCSR04-001',
    category: 'Sensor Modules',
    sellableType: 'finished',
    price: '3.00',
    cost: '1.20',
    reorderPoint: 35,
    modelNumber: 'HC-SR04',
  },
  {
    name: 'BMP280 Pressure Sensor',
    sku: 'SNS-BMP280-001',
    category: 'Environmental Sensors',
    sellableType: 'finished',
    price: '4.00',
    cost: '1.70',
    reorderPoint: 20,
    modelNumber: 'BMP280',
  },
  {
    name: 'LDR Light Sensor Module',
    sku: 'SNS-LDR-001',
    category: 'Sensor Modules',
    sellableType: 'finished',
    price: '2.00',
    cost: '0.80',
    reorderPoint: 40,
    modelNumber: 'KY-018',
  },
  {
    name: 'Fingerprint Sensor Module',
    sku: 'SNS-FP-001',
    category: 'Sensor Modules',
    sellableType: 'finished',
    price: '18.00',
    cost: '9.00',
    reorderPoint: 5,
    modelNumber: 'R503',
  },

  // Communication
  {
    name: 'ESP-01 WiFi Module',
    sku: 'COM-ESP01-001',
    category: 'Communication Modules',
    sellableType: 'finished',
    price: '4.50',
    cost: '1.90',
    reorderPoint: 25,
    modelNumber: 'ESP-01S',
  },
  {
    name: 'HC-05 Bluetooth Module',
    sku: 'COM-HC05-001',
    category: 'Communication Modules',
    sellableType: 'finished',
    price: '7.00',
    cost: '3.10',
    reorderPoint: 18,
    modelNumber: 'HC-05',
  },
  {
    name: 'NRF24L01+ Transceiver',
    sku: 'COM-NRF24-001',
    category: 'Communication Modules',
    sellableType: 'finished',
    price: '3.50',
    cost: '1.50',
    reorderPoint: 25,
    modelNumber: 'NRF24L01+',
  },
  {
    name: 'LoRa SX1278 Module',
    sku: 'COM-LORA-001',
    category: 'Communication Modules',
    sellableType: 'finished',
    price: '9.50',
    cost: '4.20',
    reorderPoint: 12,
    modelNumber: 'SX1278',
  },
  {
    name: 'SIM800L GSM Module',
    sku: 'COM-SIM800-001',
    category: 'Communication Modules',
    sellableType: 'finished',
    price: '11.00',
    cost: '5.40',
    reorderPoint: 10,
    modelNumber: 'SIM800L',
  },

  // Power management
  {
    name: 'LM7805 Regulator Module',
    sku: 'PWR-LM7805-001',
    category: 'Power Management',
    sellableType: 'finished',
    price: '2.50',
    cost: '0.90',
    reorderPoint: 40,
    modelNumber: 'LM7805',
  },
  {
    name: 'LM2596 Buck Converter',
    sku: 'PWR-LM2596-001',
    category: 'Power Management',
    sellableType: 'finished',
    price: '3.50',
    cost: '1.50',
    reorderPoint: 30,
    modelNumber: 'LM2596',
  },
  {
    name: 'TP4056 Li-Ion Charger',
    sku: 'PWR-TP4056-001',
    category: 'Power Management',
    sellableType: 'finished',
    price: '2.20',
    cost: '0.85',
    reorderPoint: 35,
    modelNumber: 'TP4056',
  },
  {
    name: 'XL6009 Boost Converter',
    sku: 'PWR-XL6009-001',
    category: 'Power Management',
    sellableType: 'finished',
    price: '4.00',
    cost: '1.80',
    reorderPoint: 22,
    modelNumber: 'XL6009',
  },
  {
    name: 'Solar Charge Controller',
    sku: 'PWR-SOLAR-001',
    category: 'Power Management',
    sellableType: 'finished',
    price: '14.00',
    cost: '7.50',
    reorderPoint: 8,
    modelNumber: '10A-PWM',
  },

  // Displays
  {
    name: '16x2 LCD Display',
    sku: 'DIS-LCD1602-001',
    category: 'Display Modules',
    sellableType: 'finished',
    price: '4.50',
    cost: '2.00',
    reorderPoint: 25,
    modelNumber: 'LCD1602',
  },
  {
    name: '0.96" OLED Display',
    sku: 'DIS-OLED096-001',
    category: 'LCD & OLED Displays',
    sellableType: 'finished',
    price: '6.00',
    cost: '2.70',
    reorderPoint: 22,
    modelNumber: 'SSD1306',
  },
  {
    name: '1.3" TFT Color Display',
    sku: 'DIS-TFT13-001',
    category: 'Display Modules',
    sellableType: 'finished',
    price: '9.00',
    cost: '4.30',
    reorderPoint: 12,
    modelNumber: 'ST7789',
  },
  {
    name: '7-Segment Display',
    sku: 'DIS-7SEG-001',
    category: 'Display Modules',
    sellableType: 'finished',
    price: '1.80',
    cost: '0.70',
    reorderPoint: 45,
    modelNumber: '5641AS',
  },
  {
    name: 'LED Matrix Module',
    sku: 'DIS-MATRIX-001',
    category: 'Display Modules',
    sellableType: 'finished',
    price: '5.50',
    cost: '2.40',
    reorderPoint: 15,
    modelNumber: 'MAX7219',
  },

  // Motor drivers & control
  {
    name: 'L298N Motor Driver',
    sku: 'MOT-L298N-001',
    category: 'Motor Drivers & Control',
    sellableType: 'finished',
    price: '4.50',
    cost: '2.00',
    reorderPoint: 25,
    modelNumber: 'L298N',
  },
  {
    name: 'A4988 Stepper Driver',
    sku: 'MOT-A4988-001',
    category: 'Motor Drivers & Control',
    sellableType: 'finished',
    price: '3.20',
    cost: '1.30',
    reorderPoint: 30,
    modelNumber: 'A4988',
  },
  {
    name: 'DRV8825 Stepper Driver',
    sku: 'MOT-DRV8825-001',
    category: 'Motor Drivers & Control',
    sellableType: 'finished',
    price: '4.00',
    cost: '1.75',
    reorderPoint: 25,
    modelNumber: 'DRV8825',
  },
  {
    name: 'SG90 Micro Servo',
    sku: 'MOT-SG90-001',
    category: 'Motor Drivers & Control',
    sellableType: 'finished',
    price: '4.00',
    cost: '1.80',
    reorderPoint: 30,
    modelNumber: 'SG90',
  },
  {
    name: '4-Channel Relay Module',
    sku: 'MOT-RELAY4-001',
    category: 'Relay Modules',
    sellableType: 'finished',
    price: '5.00',
    cost: '2.20',
    reorderPoint: 20,
    modelNumber: 'SRD-05VDC',
  },

  // Interface & conversion
  {
    name: 'CH340 USB-Serial Adapter',
    sku: 'INT-CH340-001',
    category: 'Interface & Conversion',
    sellableType: 'finished',
    price: '3.00',
    cost: '1.20',
    reorderPoint: 30,
    modelNumber: 'CH340G',
  },
  {
    name: 'CP2102 USB-Serial Adapter',
    sku: 'INT-CP2102-001',
    category: 'Interface & Conversion',
    sellableType: 'finished',
    price: '4.00',
    cost: '1.70',
    reorderPoint: 25,
    modelNumber: 'CP2102',
  },
  {
    name: 'MCP3008 ADC Module',
    sku: 'INT-MCP3008-001',
    category: 'Interface & Conversion',
    sellableType: 'finished',
    price: '4.50',
    cost: '2.00',
    reorderPoint: 18,
    modelNumber: 'MCP3008',
  },
  {
    name: 'Logic Level Shifter',
    sku: 'INT-LVL-001',
    category: 'Interface & Conversion',
    sellableType: 'finished',
    price: '1.80',
    cost: '0.70',
    reorderPoint: 40,
    modelNumber: '4CH-BSS138',
  },
  {
    name: 'RS485 Converter',
    sku: 'INT-RS485-001',
    category: 'Interface & Conversion',
    sellableType: 'finished',
    price: '6.50',
    cost: '3.00',
    reorderPoint: 14,
    modelNumber: 'MAX485',
  },

  // Audio & signal processing
  {
    name: 'PAM8403 Amplifier Module',
    sku: 'AUD-PAM8403-001',
    category: 'Audio & Signal Processing',
    sellableType: 'finished',
    price: '3.20',
    cost: '1.30',
    reorderPoint: 25,
    modelNumber: 'PAM8403',
  },
  {
    name: 'DFPlayer Mini MP3 Module',
    sku: 'AUD-DFPLAYER-001',
    category: 'Audio & Signal Processing',
    sellableType: 'finished',
    price: '4.50',
    cost: '2.10',
    reorderPoint: 20,
    modelNumber: 'DFPlayer-Mini',
  },
  {
    name: 'MAX9814 Mic Module',
    sku: 'AUD-MAX9814-001',
    category: 'Audio & Signal Processing',
    sellableType: 'finished',
    price: '3.50',
    cost: '1.50',
    reorderPoint: 18,
    modelNumber: 'MAX9814',
  },
  {
    name: 'PCM5102 DAC Module',
    sku: 'AUD-PCM5102-001',
    category: 'Audio & Signal Processing',
    sellableType: 'finished',
    price: '5.00',
    cost: '2.30',
    reorderPoint: 15,
    modelNumber: 'PCM5102A',
  },

  // Resale: wiring & cables
  {
    name: 'Jumper Wires M-M (40pc)',
    sku: 'WIRE-MM-001',
    category: 'Wiring & Cables',
    sellableType: 'resale',
    price: '2.50',
    cost: '1.10',
    reorderPoint: 60,
  },
  {
    name: 'Jumper Wires M-F (40pc)',
    sku: 'WIRE-MF-001',
    category: 'Wiring & Cables',
    sellableType: 'resale',
    price: '2.70',
    cost: '1.20',
    reorderPoint: 60,
  },
  {
    name: 'USB A-B Cable',
    sku: 'WIRE-USBA-B-001',
    category: 'Wiring & Cables',
    sellableType: 'resale',
    price: '2.00',
    cost: '0.90',
    reorderPoint: 50,
  },
  {
    name: 'USB A-C Cable',
    sku: 'WIRE-USBA-C-001',
    category: 'Wiring & Cables',
    sellableType: 'resale',
    price: '2.50',
    cost: '1.10',
    reorderPoint: 50,
  },
  {
    name: 'Ribbon Cable 40-pin',
    sku: 'WIRE-RIBBON-001',
    category: 'Wiring & Cables',
    sellableType: 'resale',
    price: '3.50',
    cost: '1.60',
    reorderPoint: 30,
  },

  // Resale: prototyping
  {
    name: 'Breadboard 830 points',
    sku: 'PROTO-BB830-001',
    category: 'Prototyping & PCB Supplies',
    sellableType: 'resale',
    price: '4.00',
    cost: '2.10',
    reorderPoint: 35,
  },
  {
    name: 'Breadboard 400 points',
    sku: 'PROTO-BB400-001',
    category: 'Prototyping & PCB Supplies',
    sellableType: 'resale',
    price: '2.80',
    cost: '1.40',
    reorderPoint: 40,
  },
  {
    name: 'Perfboard 7x9cm',
    sku: 'PROTO-PERF-001',
    category: 'Prototyping & PCB Supplies',
    sellableType: 'resale',
    price: '1.50',
    cost: '0.70',
    reorderPoint: 60,
  },

  // Resale: passives
  {
    name: 'Resistor Kit (600pcs)',
    sku: 'PASS-RESKIT-001',
    category: 'Passive Components',
    sellableType: 'resale',
    price: '6.50',
    cost: '3.40',
    reorderPoint: 20,
  },
  {
    name: 'Capacitor Kit (400pcs)',
    sku: 'PASS-CAPKIT-001',
    category: 'Passive Components',
    sellableType: 'resale',
    price: '5.50',
    cost: '2.90',
    reorderPoint: 20,
  },

  // Resale: mechanical
  {
    name: 'AA Battery Holder (4x)',
    sku: 'PWR-BATHOLDER-001',
    category: 'Power Management',
    sellableType: 'resale',
    price: '2.20',
    cost: '1.00',
    reorderPoint: 40,
  },
  {
    name: 'Heat Sink Kit',
    sku: 'MECH-HEATSINK-001',
    category: 'Mechanical Components',
    sellableType: 'resale',
    price: '3.80',
    cost: '1.80',
    reorderPoint: 30,
  },
];

// ----- Misc text used in generated records -----

export const DEFECT_TYPES = [
  'solder_bridge',
  'missing_component',
  'wrong_value',
  'physical_damage',
  'does_not_power_on',
  'out_of_spec',
  'packaging_damage',
];

export const NOTES = [
  'Standard replenishment.',
  'Requested by branch manager.',
  'Urgent — stock running low.',
  'Aligned with production plan.',
  'Bulk order for seasonal demand.',
  'Replacement for damaged batch.',
];

export const RETURN_REASONS = [
  'Defective components on arrival.',
  'Quantity mismatch against delivery note.',
  'Units failed functional test.',
  'Packaging damaged in transit.',
  'Wrong model received.',
];
