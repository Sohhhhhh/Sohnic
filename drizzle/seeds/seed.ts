import { db } from '../../src/config/drizzle';
import {
  branches,
  warehouses,
  items,
  billOfMaterials,
  inventory,
  manufacturers,
} from '../schema';

async function seed() {
  console.log('Seeding...');

  // 1. branch
  const [mainBranch] = await db
    .insert(branches)
    .values({
      name: 'Main Branch',
      type: 'main',
      city: 'Cairo',
      country: 'Egypt',
    })
    .returning();
  console.log('✅ branch');

  // 2. warehouse
  const [warehouse] = await db
    .insert(warehouses)
    .values({
      branchId: mainBranch.id,
      address: 'Main St, Cairo',
      capacity: 10000,
    })
    .returning();
  console.log('✅ warehouse');

  // 4. manufacturer
  await db
    .insert(manufacturers)
    .values({
      companyName: 'Tech Manufacturer Co.',
      city: 'Alexandria',
      country: 'Egypt',
      address: '123 Industrial St',
      phone: '+201234567890',
      email: 'manufacturer@techco.com',
    })
    .onConflictDoNothing()
    .returning();
  console.log('✅ manufacturer');

  // 5. raw materials
  const [pcb, chip, resistor] = await db
    .insert(items)
    .values([
      {
        name: 'Single Layer PCB',
        sku: 'PCB-001',
        type: 'raw_material',
        unitOfMeasurement: 'pcs',
        standardPrice: '2.50',
        reorderPoint: 50,
      },
      {
        name: 'ATmega328P Chip',
        sku: 'CHIP-001',
        type: 'raw_material',
        unitOfMeasurement: 'pcs',
        standardPrice: '3.00',
        reorderPoint: 30,
      },
      {
        name: 'Resistor 10kΩ',
        sku: 'RES-001',
        type: 'raw_material',
        unitOfMeasurement: 'pcs',
        standardPrice: '0.10',
        reorderPoint: 200,
      },
    ])
    .returning();
  console.log('✅ raw materials');

  // 6. sellable item
  const [arduinoBoard] = await db
    .insert(items)
    .values({
      name: 'Arduino Uno Compatible Board',
      sku: 'ARD-UNO-001',
      type: 'sellable_item',
      sellableType: 'finished',
      salePrice: '25.00',
      manufacturingCost: '10.00',
      reorderPoint: 10,
    })
    .returning();
  console.log('✅ sellable item');

  // 7. BOM
  await db.insert(billOfMaterials).values([
    {
      itemId: arduinoBoard.id,
      componentId: pcb.id,
      quantityPerUnit: 1,
    },
    {
      itemId: arduinoBoard.id,
      componentId: chip.id,
      quantityPerUnit: 1,
    },
    {
      itemId: arduinoBoard.id,
      componentId: resistor.id,
      quantityPerUnit: 15,
    },
  ]);
  console.log('✅ BOM');

  // 8. inventory
  await db.insert(inventory).values([
    { itemId: pcb.id, warehouseId: warehouse.id, quantity: 500 },
    { itemId: chip.id, warehouseId: warehouse.id, quantity: 300 },
    { itemId: resistor.id, warehouseId: warehouse.id, quantity: 5000 },
  ]);
  console.log('✅ inventory');

  console.log('🎉 Done!');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
