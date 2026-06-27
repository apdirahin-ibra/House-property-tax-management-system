import crypto from 'crypto';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Owner from '../models/Owner.js';
import Property from '../models/Property.js';
import TaxRate from '../models/TaxRate.js';
import Assessment from '../models/Assessment.js';
import Bill from '../models/Bill.js';
import Payment from '../models/Payment.js';
import Receipt from '../models/Receipt.js';
import AuditLog from '../models/AuditLog.js';
import { hashPassword } from '../utils/password.js';
import { calculateBaseTax, calculateTotalDue } from '../services/taxCalculation.js';
import { computeBillBalance, computeBillStatus } from '../utils/billStatus.js';

dotenv.config();

const TAX_YEAR = 2026;
const DEMO_PROPERTY_CODE = 'PROP-SEED-001';

const seedUsers = [
  {
    name: 'System Admin',
    email: 'admin@gmail.com',
    password: 'Admin@12345',
    role: 'admin',
  },
  {
    name: 'Tax Officer',
    email: 'officer@gmail.com',
    password: 'Officer@12345',
    role: 'officer',
  },
  {
    name: 'Property Owner',
    email: 'owner@gmail.com',
    password: 'Owner@12345',
    role: 'owner',
  },
];

const sampleOwners = [
  {
    fullName: 'Ahmed Hassan',
    phone: '+252612345678',
    email: 'ahmed@example.com',
    nationalId: 'ID-SEED-001',
    address: 'Hodan District, Mogadishu',
    linkUserEmail: 'owner@gmail.com',
  },
  {
    fullName: 'Fatima Ali',
    phone: '+252612345679',
    email: 'fatima@example.com',
    nationalId: 'ID-SEED-002',
    address: 'Waberi District, Mogadishu',
  },
  {
    fullName: 'Omar Yusuf',
    phone: '+252612345680',
    email: 'omar@example.com',
    nationalId: 'ID-SEED-003',
    address: 'Hamar Weyne, Mogadishu',
  },
];

const sampleProperties = [
  {
    propertyCode: 'PROP-SEED-001',
    ownerIndex: 0,
    district: 'Hodan',
    zone: 'Zone A',
    propertyType: 'Residential',
    sizeSqm: 120,
    assessedValue: 50000,
    usageStatus: 'occupied',
  },
  {
    propertyCode: 'PROP-SEED-002',
    ownerIndex: 0,
    district: 'Hodan',
    zone: 'Zone A',
    propertyType: 'Commercial',
    sizeSqm: 200,
    assessedValue: 120000,
    usageStatus: 'rented',
  },
  {
    propertyCode: 'PROP-SEED-003',
    ownerIndex: 1,
    district: 'Waberi',
    zone: 'Zone B',
    propertyType: 'Residential',
    sizeSqm: 90,
    assessedValue: 35000,
    usageStatus: 'occupied',
  },
  {
    propertyCode: 'PROP-SEED-004',
    ownerIndex: 1,
    district: 'Waberi',
    zone: 'Zone B',
    propertyType: 'Residential',
    sizeSqm: 75,
    assessedValue: 28000,
    usageStatus: 'vacant',
  },
  {
    propertyCode: 'PROP-SEED-005',
    ownerIndex: 2,
    district: 'Hamar Weyne',
    zone: 'Zone C',
    propertyType: 'Industrial',
    sizeSqm: 500,
    assessedValue: 200000,
    usageStatus: 'occupied',
  },
];

const sampleTaxRates = [
  { zone: 'Zone A', propertyType: 'Residential', rateType: 'percentage', rateValue: 1.5 },
  { zone: 'Zone A', propertyType: 'Commercial', rateType: 'percentage', rateValue: 2.0 },
  { zone: 'Zone B', propertyType: 'Residential', rateType: 'fixed', rateValue: 500 },
  { zone: 'Zone C', propertyType: 'Industrial', rateType: 'percentage', rateValue: 3.0 },
];

async function upsertUsers() {
  const users = {};

  for (const userData of seedUsers) {
    let user = await User.findOne({ email: userData.email });

    if (!user) {
      const passwordHash = await hashPassword(userData.password);
      user = await User.create({
        name: userData.name,
        email: userData.email,
        passwordHash,
        role: userData.role,
        status: 'active',
      });
      console.log(`Created user: ${userData.email} (${userData.role})`);
    } else {
      console.log(`Skipped (exists): ${userData.email}`);
    }

    users[userData.email] = user;
  }

  return users;
}

async function seedDemoData(users) {
  const existing = await Property.findOne({ propertyCode: DEMO_PROPERTY_CODE });
  if (existing) {
    console.log('Demo data already seeded — skipping');
    return;
  }

  const admin = users['admin@gmail.com'];
  const officer = users['officer@gmail.com'];

  console.log('Seeding demo data...');

  const ownerRecords = [];
  for (const ownerData of sampleOwners) {
    const { linkUserEmail, ...fields } = ownerData;
    const userId = linkUserEmail ? users[linkUserEmail]._id : null;

    const owner = await Owner.create({
      ...fields,
      userId,
    });
    ownerRecords.push(owner);
    console.log(`Created owner: ${owner.fullName}`);
  }

  const taxRateMap = new Map();
  for (const rateData of sampleTaxRates) {
    const taxRate = await TaxRate.create({
      ...rateData,
      taxYear: TAX_YEAR,
      createdBy: admin._id,
    });
    taxRateMap.set(`${rateData.zone}:${rateData.propertyType}`, taxRate);
    console.log(`Created tax rate: ${rateData.zone} / ${rateData.propertyType}`);
  }

  const propertyRecords = [];
  for (const propertyData of sampleProperties) {
    const { ownerIndex, ...fields } = propertyData;
    const property = await Property.create({
      ...fields,
      ownerId: ownerRecords[ownerIndex]._id,
      status: 'active',
    });
    propertyRecords.push(property);
    console.log(`Created property: ${property.propertyCode}`);
  }

  const assessmentRecords = [];
  for (const property of propertyRecords) {
    const taxRate = taxRateMap.get(`${property.zone}:${property.propertyType}`);
    const baseTax = calculateBaseTax(taxRate, property.assessedValue);
    const totalDue = calculateTotalDue(baseTax, 0, 0);

    const assessment = await Assessment.create({
      propertyId: property._id,
      taxYear: TAX_YEAR,
      baseTax,
      penalty: 0,
      discount: 0,
      totalDue,
      assessedBy: officer._id,
    });
    assessmentRecords.push(assessment);
  }

  const billConfigs = [
    { assessmentIndex: 0, dueDate: '2026-12-31', billNo: 'BILL-2026-SEED-001', payment: 'full' },
    { assessmentIndex: 1, dueDate: '2026-12-31', billNo: 'BILL-2026-SEED-002', payment: 'partial' },
    { assessmentIndex: 2, dueDate: '2026-12-31', billNo: 'BILL-2026-SEED-003', payment: 'none' },
    { assessmentIndex: 3, dueDate: '2026-03-01', billNo: 'BILL-2026-SEED-004', payment: 'none' },
    { assessmentIndex: 4, dueDate: '2026-12-31', billNo: 'BILL-2026-SEED-005', payment: 'none' },
  ];

  const billRecords = [];
  for (const config of billConfigs) {
    const assessment = assessmentRecords[config.assessmentIndex];
    const amountDue = assessment.totalDue;
    const dueDate = new Date(config.dueDate);

    const bill = await Bill.create({
      assessmentId: assessment._id,
      billNo: config.billNo,
      dueDate,
      amountDue,
      amountPaid: 0,
      balance: amountDue,
      status: computeBillStatus({
        amountDue,
        amountPaid: 0,
        balance: amountDue,
        dueDate,
      }),
      issuedBy: officer._id,
    });
    billRecords.push({ bill, payment: config.payment });
    console.log(`Created bill: ${bill.billNo} (${bill.status}, balance ${bill.balance})`);
  }

  const paymentConfigs = [
    {
      billIndex: 0,
      amountPaid: billRecords[0].bill.balance,
      method: 'bank',
      referenceNo: 'PAY-SEED-001',
      paymentDate: '2026-05-15',
      receiptNo: 'RCT-2026-SEED-001',
    },
    {
      billIndex: 1,
      amountPaid: 1000,
      method: 'mobile_money',
      referenceNo: 'PAY-SEED-002',
      paymentDate: '2026-04-10',
      receiptNo: 'RCT-2026-SEED-002',
    },
  ];

  for (const config of paymentConfigs) {
    const { bill } = billRecords[config.billIndex];

    const payment = await Payment.create({
      billId: bill._id,
      amountPaid: config.amountPaid,
      method: config.method,
      referenceNo: config.referenceNo,
      paymentDate: new Date(config.paymentDate),
      recordedBy: officer._id,
    });

    bill.amountPaid = Math.round((bill.amountPaid + config.amountPaid) * 100) / 100;
    bill.balance = computeBillBalance(bill.amountDue, bill.amountPaid);
    bill.status = computeBillStatus({
      amountDue: bill.amountDue,
      amountPaid: bill.amountPaid,
      balance: bill.balance,
      dueDate: bill.dueDate,
    });
    await bill.save();

    await Receipt.create({
      paymentId: payment._id,
      receiptNo: config.receiptNo,
      qrToken: crypto.randomUUID(),
    });

    console.log(`Created payment: ${config.referenceNo} → bill ${bill.billNo} (${bill.status})`);
  }

  const auditEntries = [
    { action: 'SEED', entityType: 'System', description: 'Demo tax rates seeded for 2026' },
    { action: 'SEED', entityType: 'Owner', description: `Seeded ${ownerRecords.length} sample owners` },
    { action: 'SEED', entityType: 'Property', description: `Seeded ${propertyRecords.length} sample properties` },
    { action: 'SEED', entityType: 'Bill', description: `Seeded ${billRecords.length} bills with mixed payment statuses` },
    { action: 'SEED', entityType: 'Payment', description: 'Seeded 2 sample payments with receipts' },
  ];

  for (const entry of auditEntries) {
    await AuditLog.create({
      actorId: admin._id,
      ...entry,
      entityId: null,
      ipAddress: '127.0.0.1',
    });
  }

  console.log('Demo data seeded successfully');
  console.log('');
  console.log('Demo summary:');
  console.log(`  Owners: ${ownerRecords.length}`);
  console.log(`  Properties: ${propertyRecords.length}`);
  console.log(`  Tax rates: ${sampleTaxRates.length}`);
  console.log(`  Bills: ${billRecords.length} (1 paid, 1 partial, 1 overdue, 2 unpaid)`);
  console.log(`  Payments: ${paymentConfigs.length}`);
  console.log(`  Owner portal: login as owner@gmail.com to view Ahmed Hassan properties/bills`);
}

const seed = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI is not defined');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const users = await upsertUsers();
    await seedDemoData(users);

    console.log('Seed completed');
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
