import jsPDF from "jspdf";
import { COVER_OPTIONS } from "./coverData";

interface ApplicationData {
  id: string;
  firstName: string;
  lastName: string;
  saIdNumber: string;
  mobile: string;
  email: string;
  streetAddress: string;
  suburb: string;
  city: string;
  province: string;
  coverOption: "option_a" | "option_b";
  accountHolder: string;
  bankName: string;
  accountType: string;
  accountNumber: string;
  preferredDebitDate: string;
  createdAt: string;
}

// Mask sensitive data
const maskIdNumber = (id: string): string => {
  return id.substring(0, 6) + "*******";
};

const maskAccountNumber = (account: string): string => {
  return "*".repeat(Math.max(0, account.length - 3)) + account.slice(-3);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const generateApplicationPDF = (data: ApplicationData): jsPDF => {
  const doc = new jsPDF();
  const coverOption = COVER_OPTIONS.find((opt) => opt.id === data.coverOption)!;
  
  const primaryColor: [number, number, number] = [41, 171, 226]; // Acorn Blue
  const textColor: [number, number, number] = [30, 41, 59];
  const mutedColor: [number, number, number] = [100, 116, 139];
  
  let yPosition = 20;
  const leftMargin = 20;
  const pageWidth = 210;
  const contentWidth = pageWidth - 40;
  
  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 45, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Acorn Brokers", leftMargin, 25);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Insurance Application Confirmation", leftMargin, 35);
  
  yPosition = 60;
  
  // Reference Number
  doc.setTextColor(...primaryColor);
  doc.setFontSize(10);
  doc.text("Reference Number:", leftMargin, yPosition);
  doc.setTextColor(...textColor);
  doc.setFont("helvetica", "bold");
  doc.text(data.id.toUpperCase().substring(0, 8), leftMargin + 40, yPosition);
  
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${formatDate(data.createdAt)}`, pageWidth - leftMargin - 60, yPosition);
  
  yPosition += 15;
  
  // Section: Personal Details
  doc.setFillColor(245, 247, 250);
  doc.rect(leftMargin, yPosition - 5, contentWidth, 8, "F");
  doc.setTextColor(...primaryColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Personal Details", leftMargin + 3, yPosition + 1);
  
  yPosition += 12;
  doc.setTextColor(...textColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  const personalDetails = [
    ["Name:", `${data.firstName} ${data.lastName}`],
    ["ID Number:", maskIdNumber(data.saIdNumber)],
    ["Mobile:", data.mobile],
    ["Email:", data.email],
    ["Address:", `${data.streetAddress}, ${data.suburb}`],
    ["", `${data.city}, ${data.province}`],
  ];
  
  personalDetails.forEach(([label, value]) => {
    doc.setTextColor(...mutedColor);
    doc.text(label, leftMargin + 3, yPosition);
    doc.setTextColor(...textColor);
    doc.text(value, leftMargin + 35, yPosition);
    yPosition += 7;
  });
  
  yPosition += 8;
  
  // Section: Cover Details
  doc.setFillColor(245, 247, 250);
  doc.rect(leftMargin, yPosition - 5, contentWidth, 8, "F");
  doc.setTextColor(...primaryColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Cover Details", leftMargin + 3, yPosition + 1);
  
  yPosition += 12;
  doc.setTextColor(...textColor);
  doc.setFontSize(10);
  
  const coverDetails = [
    ["Plan:", coverOption.name],
    ["Monthly Premium:", formatCurrency(coverOption.premium)],
    ["Legal Expense Limit:", formatCurrency(coverOption.legalExpenseLimit)],
    ["Liability Limit:", formatCurrency(coverOption.liabilityLimit)],
  ];
  
  coverDetails.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...mutedColor);
    doc.text(label, leftMargin + 3, yPosition);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...textColor);
    doc.text(value, leftMargin + 45, yPosition);
    yPosition += 7;
  });
  
  yPosition += 8;
  
  // Section: Banking Details
  doc.setFillColor(245, 247, 250);
  doc.rect(leftMargin, yPosition - 5, contentWidth, 8, "F");
  doc.setTextColor(...primaryColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Banking Details", leftMargin + 3, yPosition + 1);
  
  yPosition += 12;
  doc.setTextColor(...textColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  
  const bankingDetails = [
    ["Account Holder:", data.accountHolder],
    ["Bank:", data.bankName],
    ["Account Type:", data.accountType.charAt(0).toUpperCase() + data.accountType.slice(1)],
    ["Account Number:", maskAccountNumber(data.accountNumber)],
    ["Debit Date:", `${data.preferredDebitDate}${getOrdinalSuffix(parseInt(data.preferredDebitDate))} of each month`],
  ];
  
  bankingDetails.forEach(([label, value]) => {
    doc.setTextColor(...mutedColor);
    doc.text(label, leftMargin + 3, yPosition);
    doc.setTextColor(...textColor);
    doc.text(value, leftMargin + 45, yPosition);
    yPosition += 7;
  });
  
  yPosition += 10;
  
  // Important Notes
  doc.setFillColor(254, 243, 199);
  doc.rect(leftMargin, yPosition - 3, contentWidth, 25, "F");
  
  yPosition += 4;
  doc.setTextColor(146, 64, 14);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Important Information:", leftMargin + 3, yPosition);
  yPosition += 6;
  doc.setFont("helvetica", "normal");
  doc.text("• Legal advice hotline is available immediately.", leftMargin + 3, yPosition);
  yPosition += 5;
  doc.text("• A 3-month waiting period applies to legal representation services.", leftMargin + 3, yPosition);
  
  // Footer on all pages
  const footerY = 285;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(leftMargin, footerY - 5, pageWidth - leftMargin, footerY - 5);
  
  doc.setTextColor(...mutedColor);
  doc.setFontSize(8);
  doc.text("Acorn Brokers (Pty) Ltd | FSP 47433 | www.acornbrokers.co.za", leftMargin, footerY);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-ZA")}`, pageWidth - leftMargin - 35, footerY);
  
  return doc;
};

const getOrdinalSuffix = (num: number): string => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
};

export const downloadPDF = (data: ApplicationData): void => {
  const pdf = generateApplicationPDF(data);
  pdf.save(`Acorn-Application-${data.id.substring(0, 8).toUpperCase()}.pdf`);
};
