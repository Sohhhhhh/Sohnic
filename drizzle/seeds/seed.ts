/**
 * Full demo seed: wipes every table and rebuilds the database with
 * realistic, deterministic data from 2025-01-01 up to today.
 *
 *   npm run db:seed
 *
 * Determinism: seeded PRNG, sequential ids, dates derived from the seeded
 * stream — so every run produces identical business data (only "today"
 * shifts the end of the range).
 *
 * Self-contained: it only writes data, it never computes or prints report
 * figures — reporting is verified separately against the API.
 */

import bcrypt from 'bcrypt';
import { eq, sql } from 'drizzle-orm';

import { db } from '../../src/config/drizzle';
import {
  billOfMaterials,
  branches,
  categories,
  customers,
  inspections,
  inventory,
  itemSuppliers,
  items,
  manufacturers,
  manufacturingBatches,
  manufacturingOrderMaterials,
  manufacturingOrders,
  orderItems,
  orders,
  purchaseOrderItems,
  purchaseOrders,
  purchaseRequestItems,
  purchaseRequests,
  quotationItems,
  returns,
  roles,
  supplierQuotations,
  suppliers,
  transferRequestItems,
  transferRequests,
  users,
  warehouses,
} from '../schema';
import {
  BRANCHES,
  CATEGORIES,
  CUSTOMERS,
  DEFECT_TYPES,
  DEMO_PASSWORD,
  MANUFACTURERS,
  NOTES,
  RAW_MATERIALS,
  RETURN_REASONS,
  ROLES,
  SELLABLE_ITEMS,
  SUPPLIERS,
  USERS,
} from './data';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SEED = 20261005;
const START = new Date(2025, 0, 1);
const END = new Date();

const ORDER_COUNT = 1000;
const PR_COUNT = 40;
const MFG_COUNT = 30;
const TRANSFER_COUNT = 50;
const INSPECTION_TARGETS = { order: 40, manufacturing_batch: 25, transfer: 15 };

/** Injected verbatim so period boundaries can actually be tested. */
const BOUNDARY_DATES = [
  new Date(2025, 11, 31, 23, 59, 59, 999),
  new Date(2026, 0, 1, 0, 0, 0, 0),
  new Date(2026, 7, 31, 23, 59, 59, 999),
  new Date(2026, 8, 1, 0, 0, 0, 0),
  new Date(2026, 8, 30, 23, 59, 59, 999),
  new Date(2026, 9, 1, 0, 0, 0, 0),
];

// ---------------------------------------------------------------------------
// Deterministic helpers
// ---------------------------------------------------------------------------

let seq = 0;
/** Valid v4-shaped uuid generated from a counter → identical ids every run. */
const uid = () =>
  `${String(++seq).padStart(8, '0')}-0000-4000-8000-${String(seq).padStart(12, '0')}`;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(SEED);
const rint = (min: number, max: number) =>
  Math.floor(rand() * (max - min + 1)) + min;
const chance = (p: number) => rand() < p;
const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)];
const money = (n: number) => n.toFixed(2);
const round2 = (n: number) => Math.round(n * 100) / 100;

function weighted<T>(entries: [T, number][]): T {
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [value, weight] of entries) {
    r -= weight;
    if (r <= 0) return value;
  }
  return entries[entries.length - 1][0];
}

function pickDistinct<T>(arr: readonly T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length) {
    out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  }
  return out;
}

function chunk<T>(arr: T[], size = 400): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

// ----- dates -----

const MONTH_WEIGHT = [0.8, 0.9, 1.0, 1.0, 1.1, 1.2, 0.7, 0.7, 1.0, 1.1, 1.3, 1.4];
const MAX_WEIGHT = Math.max(...MONTH_WEIGHT);

const dstr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const addDays = (d: Date, days: number) => {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + days);
  return copy;
};

/** Random moment in business hours (09:00–21:59) inside the seeded range. */
function randomDate(): Date {
  for (let attempt = 0; attempt < 60; attempt++) {
    const t = START.getTime() + rand() * (END.getTime() - START.getTime());
    const d = new Date(t);
    if (rand() < MONTH_WEIGHT[d.getMonth()] / MAX_WEIGHT) {
      d.setHours(rint(9, 21), rint(0, 59), rint(0, 59), rint(0, 999));
      return d;
    }
  }
  const fallback = new Date(START);
  fallback.setHours(12, 0, 0, 0);
  return fallback;
}

/** Never later than today (delivery/completion dates must be in the past). */
function pastDate(base: Date, minDays: number, maxDays: number): Date {
  const d = addDays(base, rint(minDays, maxDays));
  return d.getTime() > END.getTime() ? new Date(END) : d;
}

// ---------------------------------------------------------------------------
// Ids/records generated in one step that later steps need
// ---------------------------------------------------------------------------

const deliveredPoRecords: { id: string; branchId: string; deliveryDate: string }[] = [];
const batchRecords: { id: string; productId: string; quantity: number; date: Date }[] = [];
const transferItemRecords: {
  transferId: string;
  branchId: string;
  itemId: string;
  qty: number;
  date: Date;
}[] = [];

const roleByName = new Map<string, string>();
const categoryByName = new Map<string, string>();
const supplierIdList: string[] = [];
const manufacturerIdList: string[] = [];

const branchRows: { id: string; name: string; type: 'main' | 'sub' }[] = [];
const warehouseRows: { id: string; branchId: string; branchName: string; type: 'main' | 'sub' }[] = [];
const userRows: { id: string; role: string; branchName: string; isActive: boolean }[] = [];
const itemRows: {
  id: string;
  name: string;
  kind: 'raw' | 'sellable';
  salePrice: number;
  cost: number;
  reorderPoint: number;
}[] = [];
const customerRows: { id: string }[] = [];
const reorderInfo: { warehouseName: string; itemName: string; qty: number; reorderPoint: number }[] = [];

let orderCount = 0;
let returnedLineCount = 0;

// ---------------------------------------------------------------------------
// Steps
// ---------------------------------------------------------------------------

function guard() {
  if (process.env.NODE_ENV === 'production') {
    console.error('⛔ Refusing to run the demo seed with NODE_ENV=production.');
    process.exit(1);
  }
}

async function wipe() {
  console.log('🧹 Wiping all tables...');
  await db.execute(sql`
    TRUNCATE TABLE
      bill_of_materials, branches, categories, customers, inspections, inventory,
      item_suppliers, items, manufacturers, manufacturing_batches,
      manufacturing_order_materials, manufacturing_orders, order_items, orders,
      purchase_order_items, purchase_orders, purchase_request_items,
      purchase_requests, quotation_items, refresh_tokens, returns, roles,
      set_password_tokens, supplier_quotations, suppliers,
      transfer_request_items, transfer_requests, users, warehouses
    RESTART IDENTITY CASCADE;
  `);
}

async function seedPeopleAndCatalog() {
  console.log('👥 roles + branches + warehouses');
  const roleRows = ROLES.map((r) => ({ id: uid(), role: r.role, description: r.description }));
  for (const c of chunk(roleRows)) await db.insert(roles).values(c);
  roleRows.forEach((r) => roleByName.set(r.role, r.id));

  const branchIn = BRANCHES.map((b) => ({
    id: uid(),
    name: b.name,
    type: b.type,
    city: b.city,
    country: b.country,
    isActive: true,
  }));
  await db.insert(branches).values(branchIn);
  branchIn.forEach((b) => branchRows.push({ id: b.id, name: b.name, type: b.type }));

  const warehouseIn = branchIn.map((b) => ({
    id: uid(),
    branchId: b.id,
    address: `${b.name} warehouse, ${b.city}`,
    capacity: b.type === 'main' ? 10000 : 3000,
    isActive: true,
  }));
  await db.insert(warehouses).values(warehouseIn);
  warehouseIn.forEach((w, i) =>
    warehouseRows.push({
      id: w.id,
      branchId: w.branchId,
      branchName: branchIn[i].name,
      type: branchIn[i].type,
    }),
  );

  console.log('📂 categories');
  const parentRows = CATEGORIES.filter((c) => !c.parent).map((c) => ({
    id: uid(),
    name: c.name,
    parentCategoryId: null,
  }));
  await db.insert(categories).values(parentRows);
  parentRows.forEach((c) => categoryByName.set(c.name, c.id));

  const childRows = CATEGORIES.filter((c) => c.parent).map((c) => ({
    id: uid(),
    name: c.name,
    parentCategoryId: categoryByName.get(c.parent!) ?? null,
  }));
  await db.insert(categories).values(childRows);
  childRows.forEach((c) => categoryByName.set(c.name, c.id));

  console.log('🏭 suppliers + manufacturers');
  const supplierIn = SUPPLIERS.map((s) => ({ id: uid(), isActive: true, ...s }));
  await db.insert(suppliers).values(supplierIn);
  supplierIn.forEach((s) => supplierIdList.push(s.id));

  const manufacturerIn = MANUFACTURERS.map((m) => ({ id: uid(), isActive: true, ...m }));
  await db.insert(manufacturers).values(manufacturerIn);
  manufacturerIn.forEach((m) => manufacturerIdList.push(m.id));

  console.log('📦 items');
  const rawIn = RAW_MATERIALS.map((r) => ({
    id: uid(),
    name: r.name,
    sku: r.sku,
    type: 'raw_material' as const,
    reorderPoint: r.reorderPoint,
    unitOfMeasurement: r.unitOfMeasurement,
    standardPrice: r.standardPrice,
  }));
  await db.insert(items).values(rawIn);
  rawIn.forEach((r) => {
    const cost = parseFloat(r.standardPrice);
    itemRows.push({ id: r.id, name: r.name, kind: 'raw', salePrice: 0, cost, reorderPoint: r.reorderPoint });
  });

  const sellableIn = SELLABLE_ITEMS.map((s) => ({
    id: uid(),
    name: s.name,
    sku: s.sku,
    type: 'sellable_item' as const,
    reorderPoint: s.reorderPoint,
    categoryId: categoryByName.get(s.category) ?? null,
    sellableType: s.sellableType,
    salePrice: s.price,
    manufacturingCost: s.sellableType === 'finished' ? s.cost : null,
    purchasePrice: s.sellableType === 'resale' ? s.cost : null,
    modelNumber: s.modelNumber ?? null,
  }));
  await db.insert(items).values(sellableIn);
  sellableIn.forEach((s) => {
    const cost = parseFloat(s.sellableType === 'finished' ? s.manufacturingCost! : s.purchasePrice!);
    itemRows.push({
      id: s.id,
      name: s.name,
      kind: 'sellable',
      salePrice: parseFloat(s.salePrice),
      cost,
      reorderPoint: s.reorderPoint,
    });
  });

  const sellables = itemRows.filter((i) => i.kind === 'sellable');
  const raws = itemRows.filter((i) => i.kind === 'raw');

  console.log('🔗 item_suppliers + BOM');
  const itemSupplierIn = itemRows.flatMap((item) =>
    pickDistinct(supplierIdList, rint(1, 3)).map((supplierId, idx) => ({
      id: uid(),
      itemId: item.id,
      supplierId,
      price: money(round2(item.cost * (0.85 + rand() * 0.4))),
      leadTimeDays: rint(3, 30),
      isPrimary: idx === 0,
    })),
  );
  for (const c of chunk(itemSupplierIn)) await db.insert(itemSuppliers).values(c);

  const isFinished = (name: string) =>
    SELLABLE_ITEMS.find((x) => x.name === name)?.sellableType === 'finished';

  const bomIn = sellables
    .filter((s) => isFinished(s.name))
    .flatMap((s) => {
      const pcb = raws.find((r) => r.name.includes('PCB'));
      const others = pickDistinct(
        raws.filter((r) => r !== pcb),
        rint(2, 4),
      );
      return [pcb, ...others].filter(Boolean).map((component) => ({
        id: uid(),
        itemId: s.id,
        componentId: component!.id,
        quantityPerUnit: component!.name.includes('PCB') ? 1 : rint(1, 15),
      }));
    });
  await db.insert(billOfMaterials).values(bomIn);

  console.log('🧑‍💼 users');
  const passwordHash = bcrypt.hashSync(DEMO_PASSWORD, 10);
  const usersIn = USERS.map((u) => ({
    id: uid(),
    email: u.email,
    username: u.username,
    firstName: u.firstName,
    lastName: u.lastName,
    phone: u.phone,
    dateOfBirth: u.dateOfBirth,
    roleId: roleByName.get(u.role)!,
    branchId: branchIn.find((b) => b.name === u.branch)!.id,
    password: passwordHash,
    hasSetPassword: true,
    isActive: u.isActive,
  }));
  await db.insert(users).values(usersIn);
  usersIn.forEach((u, i) =>
    userRows.push({ id: u.id, role: USERS[i].role, branchName: USERS[i].branch, isActive: USERS[i].isActive }),
  );

  for (const b of branchIn) {
    const manager = userRows.find((u) => u.role === 'branch_admin' && u.branchName === b.name);
    if (manager) await db.update(branches).set({ managerId: manager.id }).where(eq(branches.id, b.id));
  }

  console.log('🛒 customers');
  const customerIn = CUSTOMERS.map((c) => ({ id: uid(), ...c }));
  await db.insert(customers).values(customerIn);
  customerIn.forEach((c) => customerRows.push({ id: c.id }));

  console.log('🗄️ inventory');
  const inventoryIn: (typeof inventory.$inferInsert)[] = [];
  for (const w of warehouseIn) {
    const branch = branchRows.find((b) => b.id === w.branchId)!;
    for (const item of itemRows) {
      if (item.kind === 'raw' && branch.type !== 'main') continue;

      const lowStock = chance(0.18); // exercises the reorder alert
      const multiplier =
        branch.type === 'main'
          ? item.kind === 'raw'
            ? 1.5 + rand() * 4
            : 2 + rand() * 8
          : 1 + rand() * 4;
      const qty = lowStock
        ? Math.floor(item.reorderPoint * (0.3 + rand() * 0.6))
        : Math.max(1, Math.floor(item.reorderPoint * multiplier));

      inventoryIn.push({
        id: uid(),
        itemId: item.id,
        warehouseId: w.id,
        quantity: qty,
        lastStocktakeDate: chance(0.3) ? dstr(pastDate(START, 0, 300)) : null,
      });
      reorderInfo.push({
        warehouseName: branch.name,
        itemName: item.name,
        qty,
        reorderPoint: item.reorderPoint,
      });
    }
  }
  for (const c of chunk(inventoryIn)) await db.insert(inventory).values(c);
}

async function seedPurchasing() {
  console.log('🧾 purchase requests');
  const orderers = userRows.filter((u) => u.role === 'accountant' || u.role === 'storage_manager');
  const reviewers = userRows.filter((u) => u.role === 'branch_admin' || u.role === 'super_admin');
  const raws = itemRows.filter((i) => i.kind === 'raw');

  const prIn: (typeof purchaseRequests.$inferInsert)[] = [];
  const prItemIn: (typeof purchaseRequestItems.$inferInsert)[] = [];
  const prMeta: {
    id: string;
    createdAt: Date;
    status: string;
    branchId: string;
    items: { itemId: string; qty: number; unitPrice: number }[];
  }[] = [];

  for (let i = 0; i < PR_COUNT; i++) {
    const createdAt = randomDate();
    const branch = chance(0.8)
      ? branchRows.find((b) => b.type === 'main')!
      : pick(branchRows.filter((b) => b.type === 'sub'));
    const status = weighted<'pending' | 'approved' | 'rejected'>([
      ['pending', 20],
      ['approved', 55],
      ['rejected', 25],
    ]);
    const id = uid();

    prIn.push({
      id,
      status,
      ordererId: pick(orderers).id,
      reviewerId: status === 'pending' ? null : pick(reviewers).id,
      branchId: branch.id,
      reviewDate: status === 'pending' ? null : addDays(createdAt, rint(1, 5)),
      rejectionReason: status === 'rejected' ? pick(NOTES) : null,
      notes: pick(NOTES),
      createdAt,
      updatedAt: createdAt,
    });

    const itemsForPr = pickDistinct(raws, rint(1, 4)).map((raw) => ({
      itemId: raw.id,
      qty: Math.max(10, Math.round(raw.reorderPoint * (0.5 + rand()))),
      unitPrice: raw.cost * (0.9 + rand() * 0.3),
    }));

    itemsForPr.forEach((it) =>
      prItemIn.push({
        id: uid(),
        purchaseRequestId: id,
        itemId: it.itemId,
        quantityRequested: it.qty,
        notes: pick(NOTES),
        createdAt,
      }),
    );
    prMeta.push({ id, createdAt, status, branchId: branch.id, items: itemsForPr });
  }
  for (const c of chunk(prIn)) await db.insert(purchaseRequests).values(c);
  for (const c of chunk(prItemIn)) await db.insert(purchaseRequestItems).values(c);

  console.log('💰 supplier quotations');
  const quoteIn: (typeof supplierQuotations.$inferInsert)[] = [];
  const quoteItemIn: (typeof quotationItems.$inferInsert)[] = [];
  const quoteMeta: {
    id: string;
    createdAt: Date;
    prId: string;
    branchId: string;
    supplierId: string;
    items: { itemId: string; qty: number; unitPrice: number }[];
  }[] = [];

  for (const pr of prMeta) {
    for (const supplierIdx of pickDistinct(
      supplierIdList.map((_, i) => i),
      rint(1, 3),
    )) {
      const createdAt = addDays(pr.createdAt, rint(0, 7));
      const id = uid();
      quoteIn.push({
        id,
        purchaseRequestId: pr.id,
        supplierId: supplierIdList[supplierIdx],
        validUntil: dstr(addDays(createdAt, rint(15, 45))),
        leadTimeDays: rint(3, 30),
        createdAt,
      });

      const itemsForQuote = pr.items.map((it) => ({
        itemId: it.itemId,
        qty: it.qty,
        unitPrice: it.unitPrice * (0.85 + rand() * 0.35),
      }));

      itemsForQuote.forEach((it) =>
        quoteItemIn.push({
          id: uid(),
          quotationId: id,
          itemId: it.itemId,
          quantity: it.qty,
          unitPrice: money(round2(it.unitPrice)),
          notes: chance(0.3) ? pick(NOTES) : null,
        }),
      );
      quoteMeta.push({ id, createdAt, prId: pr.id, branchId: pr.branchId, supplierId: supplierIdList[supplierIdx], items: itemsForQuote });
    }
  }
  for (const c of chunk(quoteIn)) await db.insert(supplierQuotations).values(c);
  for (const c of chunk(quoteItemIn)) await db.insert(quotationItems).values(c);

  console.log('📦 purchase orders');
  const approvedQuotes = quoteMeta.filter(
    (q) => prMeta.find((p) => p.id === q.prId)?.status === 'approved',
  );
  const selectedQuotes = pickDistinct(approvedQuotes, Math.min(50, approvedQuotes.length));
  const creator = userRows.find((u) => u.role === 'accountant')!;
  const approver = userRows.find((u) => u.role === 'branch_admin')!;

  const poIn: (typeof purchaseOrders.$inferInsert)[] = [];
  const poItemIn: (typeof purchaseOrderItems.$inferInsert)[] = [];

  for (const q of selectedQuotes) {
    const status = weighted<'delivered' | 'pending' | 'approved' | 'shipped' | 'cancelled'>([
      ['delivered', 50],
      ['pending', 20],
      ['approved', 15],
      ['shipped', 10],
      ['cancelled', 5],
    ]);
    const createdAt = addDays(q.createdAt, rint(1, 10));
    const lead = rint(5, 30);
    const actual = status === 'delivered' ? pastDate(createdAt, Math.max(1, lead - 3), lead + 6) : null;
    const id = uid();
    const total = q.items.reduce((sum, it) => sum + it.qty * it.unitPrice, 0);

    poIn.push({
      id,
      quotationId: q.id,
      branchId: q.branchId,
      status,
      expectedDeliveryDate: dstr(addDays(createdAt, lead)),
      actualDeliveryDate: actual ? dstr(actual) : null,
      totalPrice: money(round2(total)),
      supplierId: q.supplierId,
      createdById: creator.id,
      approvedById: status === 'pending' || status === 'cancelled' ? null : approver.id,
      createdAt,
      updatedAt: createdAt,
    });

    q.items.forEach((it) =>
      poItemIn.push({
        id: uid(),
        orderId: id,
        itemId: it.itemId,
        quantity: it.qty,
        unitPrice: money(round2(it.unitPrice)),
      }),
    );

    if (status === 'delivered' && actual) {
      deliveredPoRecords.push({ id, branchId: q.branchId, deliveryDate: dstr(actual) });
    }
  }
  for (const c of chunk(poIn)) await db.insert(purchaseOrders).values(c);
  for (const c of chunk(poItemIn)) await db.insert(purchaseOrderItems).values(c);
}

async function seedManufacturing() {
  console.log('🔩 manufacturing orders');
  const finished = itemRows.filter(
    (i) =>
      i.kind === 'sellable' &&
      SELLABLE_ITEMS.find((x) => x.name === i.name)?.sellableType === 'finished',
  );
  const raws = itemRows.filter((i) => i.kind === 'raw');
  const creators = userRows.filter((u) => u.role === 'accountant' || u.role === 'storage_manager');
  const approvers = userRows.filter((u) => u.role === 'branch_admin' || u.role === 'super_admin');
  const receivers = userRows.filter((u) => u.role === 'storage_manager');

  const mfgIn: (typeof manufacturingOrders.$inferInsert)[] = [];
  const matIn: (typeof manufacturingOrderMaterials.$inferInsert)[] = [];
  const batchIn: (typeof manufacturingBatches.$inferInsert)[] = [];

  for (let i = 0; i < MFG_COUNT; i++) {
    const product = pick(finished);
    const quantity = rint(4, 40) * 5;
    const createdAt = randomDate();
    const status = weighted<
      'pending' | 'approved' | 'rejected' | 'materials_sent' | 'in_production' | 'completed' | 'cancelled'
    >([
      ['completed', 45],
      ['in_production', 10],
      ['materials_sent', 10],
      ['approved', 10],
      ['pending', 10],
      ['rejected', 8],
      ['cancelled', 7],
    ]);
    const approved = !['pending', 'rejected', 'cancelled'].includes(status);
    const approvalDate = approved ? addDays(createdAt, rint(1, 4)) : null;
    const completed = status === 'completed';
    const actualCompletion = completed ? pastDate(approvalDate ?? createdAt, 12, 35) : null;
    const id = uid();

    const materials = pickDistinct(raws, rint(3, 5)).map((raw) => ({
      materialId: raw.id,
      quantity: Math.max(1, Math.round((quantity * rint(1, 4)) / 5)),
      unitCost: raw.cost * (0.9 + rand() * 0.2),
    }));
    const materialsCost = materials.reduce((s, m) => s + m.quantity * m.unitCost, 0);
    const totalCost = completed ? materialsCost + quantity * rint(1, 3) + rint(50, 300) : null;

    mfgIn.push({
      id,
      productId: product.id,
      quantity,
      status,
      createdById: pick(creators).id,
      approvedById: approved ? pick(approvers).id : null,
      manufacturerId: pick(manufacturerIdList),
      approvalDate,
      expectedCompletionDate: approvalDate ? dstr(addDays(approvalDate, rint(10, 30))) : null,
      actualCompletionDate: actualCompletion ? dstr(actualCompletion) : null,
      totalManufacturingCost: totalCost ? money(round2(totalCost)) : null,
      notes: pick(NOTES),
      rejectionReason: status === 'rejected' || status === 'cancelled' ? pick(NOTES) : null,
      createdAt,
      updatedAt: createdAt,
    });

    materials.forEach((m) =>
      matIn.push({
        id: uid(),
        manufacturingOrderId: id,
        materialId: m.materialId,
        quantity: m.quantity,
        unitCost: money(round2(m.unitCost)),
      }),
    );

    if (completed && actualCompletion) {
      const produced = Math.max(1, quantity - rint(0, Math.ceil(quantity * 0.05)));
      const batchId = uid();
      const batchDate = new Date(actualCompletion);
      batchDate.setHours(rint(10, 18), rint(0, 59), 0, 0);

      batchIn.push({
        id: batchId,
        manufacturingOrderId: id,
        quantityProduced: produced,
        productionDate: dstr(actualCompletion),
        receivedById: pick(receivers).id,
        notes: pick(NOTES),
        createdAt: batchDate,
      });
      batchRecords.push({ id: batchId, productId: product.id, quantity: produced, date: batchDate });
    }
  }
  for (const c of chunk(mfgIn)) await db.insert(manufacturingOrders).values(c);
  for (const c of chunk(matIn)) await db.insert(manufacturingOrderMaterials).values(c);
  if (batchIn.length) await db.insert(manufacturingBatches).values(batchIn);
}

async function seedSales() {
  console.log(`🛒 orders (${ORDER_COUNT})`);
  const sellables = itemRows.filter((i) => i.kind === 'sellable');
  const cashiersByBranch = new Map<string, string[]>();
  for (const b of branchRows) {
    cashiersByBranch.set(
      b.name,
      userRows
        .filter((u) => u.role === 'cashier' && u.branchName === b.name && u.isActive)
        .map((u) => u.id),
    );
  }

  const orderIn: (typeof orders.$inferInsert)[] = [];
  const lineIn: (typeof orderItems.$inferInsert)[] = [];

  for (let i = 0; i < ORDER_COUNT; i++) {
    const date = i < BOUNDARY_DATES.length ? BOUNDARY_DATES[i] : randomDate();
    const branchName = weighted<string>([
      ['Main Branch', 45],
      ['Mansoura Branch', 30],
      ['Cairo', 25],
    ]);
    const branch = branchRows.find((b) => b.name === branchName)!;
    const cashiers = cashiersByBranch.get(branchName) ?? [];
    const cashierId = cashiers.length
      ? pick(cashiers)
      : userRows.find((u) => u.role === 'cashier')!.id;

    const chosen = pickDistinct(sellables, weighted<number>([
      [1, 40],
      [2, 30],
      [3, 20],
      [4, 10],
    ]));
    const orderId = uid();
    let amount = 0;
    const lines: { itemId: string; qty: number; unitPrice: number }[] = [];

    for (const item of chosen) {
      const qty = weighted<number>([
        [1, 50],
        [2, 25],
        [3, 15],
        [5, 7],
        [10, 3],
      ]);
      amount += item.salePrice * qty;
      lines.push({ itemId: item.id, qty, unitPrice: item.salePrice });
    }

    orderIn.push({
      id: orderId,
      branchId: branch.id,
      customerId: pick(customerRows).id,
      cashierId,
      amount: money(round2(amount)),
      paymentMethod: weighted<'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'mobile_payment'>([
        ['cash', 45],
        ['credit_card', 20],
        ['mobile_payment', 15],
        ['debit_card', 12],
        ['bank_transfer', 8],
      ]),
      createdAt: date,
    });

    for (const l of lines) {
      const returned = chance(0.03); // customer returns — see getCOGS() note
      if (returned) returnedLineCount++;
      lineIn.push({
        id: uid(),
        orderId,
        itemId: l.itemId,
        quantity: l.qty,
        unitPrice: money(l.unitPrice),
        isReturned: returned,
        quantityReturned: returned ? l.qty : 0,
        returnedAt: returned ? addDays(date, rint(1, 10)) : null,
        createdAt: date,
      });
    }

  }

  orderCount = orderIn.length;
  for (const c of chunk(orderIn)) await db.insert(orders).values(c);
  for (const c of chunk(lineIn)) await db.insert(orderItems).values(c);
}

async function seedTransfers() {
  console.log('🚚 transfer requests');
  const main = branchRows.find((b) => b.type === 'main')!;
  const subs = branchRows.filter((b) => b.type === 'sub');
  const sellables = itemRows.filter((i) => i.kind === 'sellable');
  const operators = userRows.filter((u) => u.role === 'storage_manager' || u.role === 'branch_admin');
  const subAdmin = (name: string) =>
    userRows.find((u) => u.role === 'branch_admin' && u.branchName === name) ??
    userRows.find((u) => u.role === 'branch_admin')!;

  const tIn: (typeof transferRequests.$inferInsert)[] = [];
  const tiIn: (typeof transferRequestItems.$inferInsert)[] = [];

  for (let i = 0; i < TRANSFER_COUNT; i++) {
    const from = pick(subs);
    const createdAt = randomDate();
    const status = weighted<
      'pending' | 'approved' | 'rejected' | 'in_transit' | 'received' | 'completed' | 'cancelled'
    >([
      ['pending', 15],
      ['approved', 15],
      ['rejected', 10],
      ['in_transit', 15],
      ['received', 25],
      ['completed', 15],
      ['cancelled', 5],
    ]);
    const approved = ['approved', 'in_transit', 'received', 'completed'].includes(status);
    const dispatched = ['in_transit', 'received', 'completed'].includes(status);
    const delivered = ['received', 'completed'].includes(status);
    const approvedAt = approved ? addDays(createdAt, rint(1, 4)) : null;
    const dispatchedAt = dispatched ? addDays(approvedAt ?? createdAt, rint(1, 3)) : null;
    const deliveredAt = delivered ? addDays(dispatchedAt ?? createdAt, rint(1, 4)) : null;
    const id = uid();

    tIn.push({
      id,
      requestedByBranch: from.id,
      requestedFromBranch: main.id,
      createdById: subAdmin(from.name).id,
      status,
      notes: pick(NOTES),
      rejectionReason: status === 'rejected' || status === 'cancelled' ? pick(NOTES) : null,
      approvedById: approved ? pick(operators).id : null,
      approvedAt,
      dispatchedById: dispatched ? pick(operators).id : null,
      dispatchedAt,
      deliveredAt,
      createdAt,
      updatedAt: createdAt,
    });

    for (const item of pickDistinct(sellables, rint(1, 4))) {
      const requested = rint(2, 25);
      const approvedQty = approved ? Math.max(1, requested - rint(0, 3)) : null;
      const receivedQty =
        delivered && approvedQty !== null ? Math.max(1, approvedQty - rint(0, 1)) : null;

      tiIn.push({
        id: uid(),
        itemId: item.id,
        transferRequestId: id,
        quantityRequested: requested,
        quantityApproved: approvedQty,
        quantityReceived: receivedQty,
      });

      if (delivered && receivedQty !== null && deliveredAt) {
        transferItemRecords.push({
          transferId: id,
          branchId: from.id, // receiving branch
          itemId: item.id,
          qty: receivedQty,
          date: deliveredAt,
        });
      }
    }
  }
  for (const c of chunk(tIn)) await db.insert(transferRequests).values(c);
  for (const c of chunk(tiIn)) await db.insert(transferRequestItems).values(c);
}

async function seedQuality() {
  console.log('🔍 inspections + returns');
  const inspectors = userRows.filter((u) => u.role === 'inspector');
  const approvers = userRows.filter((u) => u.role === 'branch_admin' || u.role === 'super_admin');
  const sellables = itemRows.filter((i) => i.kind === 'sellable');

  type Target =
    | { type: 'order'; orderId: string; branchId: string; itemId: string; qty: number; date: Date }
    | { type: 'manufacturing_batch'; batchId: string; branchId: string; itemId: string; qty: number; date: Date }
    | { type: 'transfer'; transferId: string; branchId: string; itemId: string; qty: number; date: Date };

  const targets: Target[] = [];

  for (const po of deliveredPoRecords.slice(0, INSPECTION_TARGETS.order)) {
    targets.push({
      type: 'order',
      orderId: po.id,
      branchId: po.branchId,
      itemId: pick(sellables).id,
      qty: rint(10, 200),
      date: (() => {
        const d = new Date(po.deliveryDate);
        d.setHours(rint(10, 18), rint(0, 59), 0, 0);
        return pastDate(d, 0, 3);
      })(),
    });
  }

  for (const batch of batchRecords.slice(0, INSPECTION_TARGETS.manufacturing_batch)) {
    targets.push({
      type: 'manufacturing_batch',
      batchId: batch.id,
      branchId: branchRows.find((b) => b.type === 'main')!.id,
      itemId: batch.productId,
      qty: batch.quantity,
      date: pastDate(batch.date, 0, 2),
    });
  }

  for (const t of transferItemRecords.slice(0, INSPECTION_TARGETS.transfer)) {
    targets.push({
      type: 'transfer',
      transferId: t.transferId,
      branchId: t.branchId,
      itemId: t.itemId,
      qty: t.qty,
      date: pastDate(t.date, 0, 2),
    });
  }

  const insIn: (typeof inspections.$inferInsert)[] = [];
  const retIn: (typeof returns.$inferInsert)[] = [];

  for (const target of targets) {
    const result = weighted<'passed' | 'failed' | 'needs_rework'>([
      ['passed', 60],
      ['needs_rework', 20],
      ['failed', 20],
    ]);
    const ordered = target.qty;
    const received = Math.max(1, Math.round(ordered * (0.7 + rand() * 0.3)));
    const rejected =
      result === 'failed' ? received : result === 'needs_rework' ? rint(0, Math.floor(received / 2)) : 0;
    const id = uid();

    insIn.push({
      id,
      orderId: target.type === 'order' ? target.orderId : null,
      manufacturingBatchId: target.type === 'manufacturing_batch' ? target.batchId : null,
      transferRequestId: target.type === 'transfer' ? target.transferId : null,
      type: target.type,
      inspectionDate: target.date,
      inspectionResult: result,
      branchId: target.branchId,
      notes: pick(NOTES),
      defectType: result === 'passed' ? null : pick(DEFECT_TYPES),
      quantityOrdered: ordered,
      quantityReceived: received,
      quantityRejected: rejected,
      itemId: target.itemId,
      inspectorId: pick(inspectors).id,
      createdAt: target.date,
      updatedAt: target.date,
    });

    // returns: one per non-passing inspection (inspection_id is UNIQUE)
    if (result !== 'passed') {
      const submitted = addDays(target.date, rint(0, 2));
      const status = weighted<'pending' | 'approved' | 'rejected' | 'completed'>([
        ['pending', 25],
        ['approved', 30],
        ['rejected', 15],
        ['completed', 30],
      ]);
      const returnRow: typeof returns.$inferInsert = {
        id: uid(),
        type: target.type === 'order' ? 'supplier' : target.type === 'manufacturing_batch' ? 'manufacturer' : 'transfer',
        inspectionId: id,
        quantity: Math.max(1, rejected || Math.ceil(received * 0.1)),
        reason: pick(RETURN_REASONS),
        status,
        inspectorId: pick(inspectors).id,
        approvedById: status === 'pending' ? null : pick(approvers).id,
        rejectionReason: status === 'rejected' ? pick(NOTES) : null,
        submissionDate: submitted,
        reviewDate: status === 'pending' ? null : addDays(submitted, rint(1, 5)),
        createdAt: submitted,
        updatedAt: submitted,
      };
      retIn.push(returnRow);
    }
  }

  for (const c of chunk(insIn)) await db.insert(inspections).values(c);
  for (const c of chunk(retIn)) await db.insert(returns).values(c);
}

function printSummary() {
  const below = reorderInfo.filter((r) => r.qty <= r.reorderPoint);
  console.log(`\n📉 Items at/below reorder point: ${below.length}`);
  below.slice(0, 6).forEach((r) => console.log(`   ${r.warehouseName} — ${r.itemName}: ${r.qty} / ${r.reorderPoint}`));

  console.log(
    `\n🧾 Orders: ${orderCount} (incl. ${BOUNDARY_DATES.length} boundary-dated)  |  ` +
      `returned line items: ${returnedLineCount}  |  delivered POs: ${deliveredPoRecords.length}  |  ` +
      `completed mfg batches: ${batchRecords.length}`,
  );

  console.log(`\n🔐 Demo login — password: ${DEMO_PASSWORD}`);
  USERS.forEach((u) =>
    console.log(`   ${u.email.padEnd(28)} ${u.role.padEnd(16)} ${u.branch}${u.isActive ? '' : '  [inactive]'}`),
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  guard();

  const t0 = Date.now();
  await wipe();
  await seedPeopleAndCatalog();
  await seedPurchasing();
  await seedManufacturing();
  await seedSales();
  await seedTransfers();
  await seedQuality();
  printSummary();

  console.log(`\n🎉 Done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
