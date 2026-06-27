import {
  countPropertiesForReport,
  fetchFilteredBills,
  fetchFilteredPayments,
  fetchOutstandingBills,
  fetchReportByZone,
  summarizeBills,
} from '../services/reportService.js';
import { generateAllReportsPdfBuffer } from '../services/pdfService.js';

export const getSummaryReport = async (req, res, next) => {
  try {
    const { taxYear, zone, propertyType, status, from, to } = req.query;
    const query = { taxYear, zone, propertyType, status, from, to };

    const [bills, totalProperties] = await Promise.all([
      fetchFilteredBills(query),
      countPropertiesForReport({ taxYear, zone, propertyType }),
    ]);

    res.json({
      success: true,
      data: {
        filters: { taxYear, zone, propertyType, status, from, to },
        totalProperties,
        ...summarizeBills(bills),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCollectionsReport = async (req, res, next) => {
  try {
    const { taxYear, zone, propertyType, method, from, to } = req.query;
    const query = { taxYear, zone, propertyType, method, from, to };

    const payments = await fetchFilteredPayments(query);
    const totalCollected = payments.reduce((sum, payment) => sum + (payment.amountPaid || 0), 0);

    res.json({
      success: true,
      count: payments.length,
      data: {
        filters: { taxYear, zone, propertyType, method, from, to },
        totalCollected,
        payments,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOutstandingReport = async (req, res, next) => {
  try {
    const { taxYear, zone, propertyType, status } = req.query;
    const query = { taxYear, zone, propertyType, status };

    const bills = await fetchOutstandingBills(query);
    const totalOutstanding = bills.reduce((sum, bill) => sum + (bill.balance || 0), 0);

    res.json({
      success: true,
      count: bills.length,
      data: {
        filters: { taxYear, zone, propertyType, status },
        totalOutstanding,
        bills,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getByZoneReport = async (req, res, next) => {
  try {
    const { taxYear } = req.query;
    const rows = await fetchReportByZone({ taxYear });

    res.json({
      success: true,
      count: rows.length,
      data: {
        filters: { taxYear },
        rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const downloadAllReportsPdf = async (req, res, next) => {
  try {
    const { taxYear, zone, propertyType, status, method, from, to } = req.query;
    const filters = { taxYear, zone, propertyType, status, method, from, to };

    const [bills, totalProperties, payments, outstandingBills, zoneRows] = await Promise.all([
      fetchFilteredBills({ taxYear, zone, propertyType, status, from, to }),
      countPropertiesForReport({ taxYear, zone, propertyType }),
      fetchFilteredPayments({ taxYear, zone, propertyType, method, from, to }),
      fetchOutstandingBills({ taxYear, zone, propertyType, status }),
      fetchReportByZone({ taxYear }),
    ]);

    const summary = {
      filters: { taxYear, zone, propertyType, status, from, to },
      totalProperties,
      ...summarizeBills(bills),
    };
    const collections = {
      filters: { taxYear, zone, propertyType, method, from, to },
      totalCollected: payments.reduce((sum, payment) => sum + (payment.amountPaid || 0), 0),
      payments,
    };
    const outstanding = {
      filters: { taxYear, zone, propertyType, status },
      totalOutstanding: outstandingBills.reduce((sum, bill) => sum + (bill.balance || 0), 0),
      bills: outstandingBills,
    };
    const byZone = {
      filters: { taxYear },
      rows: zoneRows,
    };

    const buffer = await generateAllReportsPdfBuffer({
      filters,
      summary,
      collections,
      outstanding,
      byZone,
    });

    const dateStamp = new Date().toISOString().slice(0, 10);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="hptms-all-reports-${dateStamp}.pdf"`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};
