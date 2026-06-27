import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../../uploads/receipts');

const ensureUploadsDir = () => {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
};

const streamToBuffer = (doc) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.end();
  });

export const generateBillPdfBuffer = async (bill, assessment, property, owner) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  doc.fontSize(18).text('Property Tax Bill', { align: 'center' });
  doc.moveDown();
  doc.fontSize(10).text(`Bill No: ${bill.billNo}`);
  doc.text(`Issue Date: ${new Date(bill.createdAt).toLocaleDateString()}`);
  doc.text(`Due Date: ${new Date(bill.dueDate).toLocaleDateString()}`);
  doc.text(`Status: ${bill.status.toUpperCase()}`);
  doc.moveDown();

  doc.fontSize(12).text('Property Owner', { underline: true });
  doc.fontSize(10).text(`Name: ${owner.fullName}`);
  doc.text(`Phone: ${owner.phone}`);
  if (owner.email) doc.text(`Email: ${owner.email}`);
  doc.text(`Address: ${owner.address}`);
  doc.moveDown();

  doc.fontSize(12).text('Property Details', { underline: true });
  doc.fontSize(10).text(`Code: ${property.propertyCode}`);
  doc.text(`District: ${property.district}`);
  doc.text(`Zone: ${property.zone}`);
  doc.text(`Type: ${property.propertyType}`);
  doc.text(`Assessed Value: ${property.assessedValue.toLocaleString()}`);
  doc.moveDown();

  doc.fontSize(12).text('Tax Summary', { underline: true });
  doc.fontSize(10).text(`Tax Year: ${assessment.taxYear}`);
  doc.text(`Base Tax: ${assessment.baseTax.toLocaleString()}`);
  doc.text(`Penalty: ${assessment.penalty.toLocaleString()}`);
  doc.text(`Discount: ${assessment.discount.toLocaleString()}`);
  doc.text(`Amount Due: ${bill.amountDue.toLocaleString()}`);
  doc.text(`Amount Paid: ${bill.amountPaid.toLocaleString()}`);
  doc.text(`Balance: ${bill.balance.toLocaleString()}`);

  return streamToBuffer(doc);
};

export const generateReceiptPdfBuffer = async (receipt, payment, bill, assessment, property, owner) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  doc.fontSize(18).text('Payment Receipt', { align: 'center' });
  doc.moveDown();
  doc.fontSize(10).text(`Receipt No: ${receipt.receiptNo}`);
  doc.text(`Payment Date: ${new Date(payment.paymentDate).toLocaleDateString()}`);
  doc.text(`Bill No: ${bill.billNo}`);
  doc.text(`Reference: ${payment.referenceNo || 'N/A'}`);
  doc.text(`Method: ${payment.method.replace('_', ' ').toUpperCase()}`);
  if (receipt.qrToken) {
    doc.text(`Verification Token: ${receipt.qrToken}`);
  }
  doc.moveDown();

  doc.fontSize(12).text('Paid By', { underline: true });
  doc.fontSize(10).text(`Name: ${owner.fullName}`);
  doc.text(`Property: ${property.propertyCode} (${property.zone})`);
  doc.moveDown();

  doc.fontSize(12).text('Payment Details', { underline: true });
  doc.fontSize(10).text(`Amount Paid: ${payment.amountPaid.toLocaleString()}`);
  doc.text(`Tax Year: ${assessment.taxYear}`);
  doc.text(`Bill Balance After Payment: ${bill.balance.toLocaleString()}`);
  doc.moveDown();
  doc.fontSize(9).text('Thank you for your payment.', { align: 'center' });

  return streamToBuffer(doc);
};

const formatMoney = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const normalizeValue = (value) => {
  if (value === null || value === undefined || value === '') return '-';
  return String(value);
};

const addPageIfNeeded = (doc, neededHeight) => {
  if (doc.y + neededHeight > doc.page.height - doc.page.margins.bottom) {
    doc.addPage();
  }
};

const drawSectionTitle = (doc, title) => {
  addPageIfNeeded(doc, 34);
  doc.moveDown(0.8);
  doc
    .fillColor('#0f172a')
    .fontSize(13)
    .font('Helvetica-Bold')
    .text(title, doc.page.margins.left, doc.y, {
      width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
    });
  doc.moveDown(0.45);
};

const drawContinuationTitle = (doc, title) => {
  doc
    .fillColor('#38bdf8')
    .font('Helvetica-Bold')
    .fontSize(8)
    .text('HPTMS REPORTS', doc.page.margins.left, 32);
  doc
    .fillColor('#0f172a')
    .font('Helvetica-Bold')
    .fontSize(12)
    .text(`${title} continued`, doc.page.margins.left, 48);
  doc.moveTo(doc.page.margins.left, 72)
    .lineTo(doc.page.width - doc.page.margins.right, 72)
    .strokeColor('#e2e8f0')
    .lineWidth(1)
    .stroke();
  doc.y = 88;
};

const drawInfoGrid = (doc, items, options = {}) => {
  const startX = doc.page.margins.left;
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const columns = options.columns || 4;
  const gap = options.gap || 10;
  const columnWidth = (width - gap * (columns - 1)) / columns;
  const cardHeight = options.cardHeight || 58;
  const baseY = doc.y;

  items.forEach((item, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const x = startX + column * (columnWidth + gap);

    doc
      .roundedRect(x, baseY + row * (cardHeight + gap), columnWidth, cardHeight, 8)
      .fillAndStroke(options.fill || '#f8fafc', options.stroke || '#dbeafe');
    doc
      .fillColor('#64748b')
      .font('Helvetica-Bold')
      .fontSize(8)
      .text(item.label.toUpperCase(), x + 12, baseY + row * (cardHeight + gap) + 12, { width: columnWidth - 24 });
    doc
      .fillColor('#020617')
      .font('Helvetica-Bold')
      .fontSize(options.valueSize || 15)
      .text(normalizeValue(item.value), x + 12, baseY + row * (cardHeight + gap) + 30, {
        width: columnWidth - 24,
        height: cardHeight - 34,
        ellipsis: true,
      });
  });

  const rowCount = Math.ceil(items.length / columns);
  doc.y = baseY + rowCount * cardHeight + (rowCount - 1) * gap;
};

const drawTable = (doc, columns, rows, options = {}) => {
  const startX = doc.page.margins.left;
  const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const headerHeight = 26;
  const rowHeight = options.rowHeight || 30;
  const maxRows = options.maxRows || 18;
  const visibleRows = rows.slice(0, maxRows);
  const totalFlex = columns.reduce((sum, column) => sum + (column.flex || 1), 0);
  const widths = columns.map((column) => (width * (column.flex || 1)) / totalFlex);

  if (!rows.length) {
    addPageIfNeeded(doc, 30);
    doc.fillColor('#64748b').font('Helvetica').fontSize(10).text('No records available for this section.');
    return;
  }

  const drawHeader = () => {
    addPageIfNeeded(doc, headerHeight + rowHeight);
    const y = doc.y;
    doc.roundedRect(startX, y, width, headerHeight, 6).fill('#eef2ff');
    let x = startX;
    columns.forEach((column, index) => {
      doc
        .fillColor('#334155')
        .font('Helvetica-Bold')
        .fontSize(8)
        .text(column.label.toUpperCase(), x + 7, y + 9, { width: widths[index] - 12 });
      x += widths[index];
    });
    doc.y = y + headerHeight;
  };

  drawHeader();

  visibleRows.forEach((row, rowIndex) => {
    if (doc.y + rowHeight > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      if (options.continuationTitle) {
        drawContinuationTitle(doc, options.continuationTitle);
      }
      drawHeader();
    }

    const y = doc.y;
    doc.rect(startX, y, width, rowHeight).fill(rowIndex % 2 === 0 ? '#ffffff' : '#f8fafc');
    let x = startX;
    columns.forEach((column, index) => {
      const value = column.render ? column.render(row) : row[column.key];
      doc
        .fillColor('#0f172a')
        .font('Helvetica')
        .fontSize(8)
        .text(normalizeValue(value), x + 7, y + 8, {
          width: widths[index] - 12,
          height: rowHeight - 8,
          ellipsis: true,
        });
      x += widths[index];
    });
    doc.y = y + rowHeight;
  });

  if (rows.length > maxRows) {
    doc.moveDown(0.4);
    doc
      .fillColor('#64748b')
      .font('Helvetica')
      .fontSize(8)
      .text(`Showing ${maxRows} of ${rows.length} records. Use filters to narrow the report.`);
  }
};

export const generateAllReportsPdfBuffer = async ({ filters, summary, collections, outstanding, byZone }) => {
  const doc = new PDFDocument({ margin: 42, size: 'A4' });
  const generatedAt = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  doc.rect(0, 0, doc.page.width, 122).fill('#0f172a');
  doc
    .fillColor('#38bdf8')
    .font('Helvetica-Bold')
    .fontSize(9)
    .text('PROPERTY TAX OPERATIONS', 42, 34, { characterSpacing: 0.6 });
  doc.fillColor('#ffffff').fontSize(22).text('All Reports', 42, 52);
  doc
    .fillColor('#cbd5e1')
    .font('Helvetica')
    .fontSize(10)
    .text(`Generated ${generatedAt}`, 42, 82);
  doc
    .roundedRect(doc.page.width - 154, 36, 112, 44, 10)
    .fillAndStroke('#172554', '#38bdf8');
  doc
    .fillColor('#ffffff')
    .font('Helvetica-Bold')
    .fontSize(16)
    .text('HPTMS', doc.page.width - 132, 50);

  doc.y = 146;
  drawSectionTitle(doc, 'Applied Filters');
  drawInfoGrid(doc, [
    { label: 'Tax year', value: filters.taxYear || 'All' },
    { label: 'Zone', value: filters.zone || 'All' },
    { label: 'Property type', value: filters.propertyType || 'All' },
    { label: 'Status', value: filters.status || 'All' },
    { label: 'Method', value: filters.method ? filters.method.replace(/_/g, ' ') : 'All' },
    { label: 'From', value: filters.from || 'Any' },
    { label: 'To', value: filters.to || 'Any' },
  ]);

  drawSectionTitle(doc, 'Executive Summary');
  drawInfoGrid(doc, [
    { label: 'Properties', value: summary.totalProperties ?? 0 },
    { label: 'Total bills', value: summary.totalBills ?? 0 },
    { label: 'Total billed', value: formatMoney(summary.totalBilled) },
    { label: 'Collected', value: formatMoney(summary.totalCollected) },
    { label: 'Outstanding', value: formatMoney(summary.totalOutstanding) },
    { label: 'Paid bills', value: summary.paidCount ?? 0 },
    { label: 'Unpaid bills', value: summary.unpaidCount ?? 0 },
    { label: 'Overdue bills', value: summary.overdueCount ?? 0 },
  ]);

  drawSectionTitle(doc, 'Collections');
  drawTable(
    doc,
    [
      { label: 'Date', flex: 1.1, render: (payment) => formatDate(payment.paymentDate) },
      { label: 'Amount', flex: 1, render: (payment) => formatMoney(payment.amountPaid) },
      { label: 'Method', flex: 1, render: (payment) => payment.method?.replace(/_/g, ' ') },
      { label: 'Reference', flex: 1.2, key: 'referenceNo' },
      { label: 'Bill', flex: 1.4, render: (payment) => payment.billId?.billNo },
      {
        label: 'Owner',
        flex: 1.4,
        render: (payment) => payment.billId?.assessmentId?.propertyId?.ownerId?.fullName,
      },
    ],
    collections.payments || [],
    { continuationTitle: 'Collections' }
  );

  drawSectionTitle(doc, 'Outstanding Bills');
  drawTable(
    doc,
    [
      { label: 'Bill', flex: 1.35, key: 'billNo' },
      { label: 'Owner', flex: 1.35, render: (bill) => bill.assessmentId?.propertyId?.ownerId?.fullName },
      { label: 'Property', flex: 1.25, render: (bill) => bill.assessmentId?.propertyId?.propertyCode },
      { label: 'Balance', flex: 1, render: (bill) => formatMoney(bill.balance) },
      { label: 'Due date', flex: 1, render: (bill) => formatDate(bill.dueDate) },
      { label: 'Status', flex: 0.9, key: 'status' },
    ],
    outstanding.bills || [],
    { continuationTitle: 'Outstanding Bills' }
  );

  drawSectionTitle(doc, 'By Zone');
  drawTable(
    doc,
    [
      { label: 'Zone', flex: 1.4, key: 'zone' },
      { label: 'Properties', flex: 1, key: 'propertyCount' },
      { label: 'Bills', flex: 0.8, key: 'billCount' },
      { label: 'Billed', flex: 1.15, render: (row) => formatMoney(row.totalBilled) },
      { label: 'Collected', flex: 1.15, render: (row) => formatMoney(row.totalCollected) },
      { label: 'Outstanding', flex: 1.15, render: (row) => formatMoney(row.outstanding) },
    ],
    byZone.rows || [],
    { continuationTitle: 'By Zone' }
  );

  doc.moveDown(1);
  doc
    .fillColor('#64748b')
    .font('Helvetica')
    .fontSize(8)
    .text('Generated by HPTMS for authorized administrative reporting.', { align: 'center' });

  return streamToBuffer(doc);
};

export const saveReceiptPdf = async (receiptNo, buffer) => {
  ensureUploadsDir();
  const filePath = path.join(uploadsDir, `${receiptNo}.pdf`);
  fs.writeFileSync(filePath, buffer);
  return filePath;
};
