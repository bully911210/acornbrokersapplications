// Deno-compatible PDF Generator for Edge Functions
import { jsPDF } from "npm:jspdf@2.5.2";
import { COVER_OPTIONS, ApplicantData } from "./types.ts";

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

const getOrdinalSuffix = (num: number): string => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
};

const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Colours
const primaryColor: [number, number, number] = [41, 171, 226]; // Acorn Blue
const textColor: [number, number, number] = [30, 41, 59];
const mutedColor: [number, number, number] = [107, 114, 128]; // #6B7280
const sectionBgColor: [number, number, number] = [245, 247, 250];
const dividerColor: [number, number, number] = [209, 213, 219];
const consentGreen: [number, number, number] = [34, 197, 94];

export const generateApplicationPDF = (data: ApplicantData): string => {
  const doc = new jsPDF();
  const coverOption = COVER_OPTIONS.find((opt) => opt.id === data.cover_option)!;
  
  const leftMargin = 20;
  const pageWidth = 210;
  const contentWidth = pageWidth - 40;
  let yPosition = 20;
  
  // ============================================
  // HEADER
  // ============================================
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
  doc.text(`Date: ${formatDate(data.created_at)}`, pageWidth - leftMargin - 60, yPosition);
  
  yPosition += 15;
  
  // ============================================
  // SECTION: Personal Details
  // ============================================
  doc.setFillColor(...sectionBgColor);
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
    ["Name:", `${data.first_name} ${data.last_name}`],
    ["ID Number:", maskIdNumber(data.sa_id_number)],
    ["Mobile:", data.mobile],
    ["Email:", data.email],
    ["Address:", `${data.street_address}, ${data.suburb}`],
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
  
  // ============================================
  // SECTION: Cover Details
  // ============================================
  doc.setFillColor(...sectionBgColor);
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
  
  // ============================================
  // SECTION: Banking Details
  // ============================================
  doc.setFillColor(...sectionBgColor);
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
    ["Account Holder:", data.account_holder],
    ["Bank:", data.bank_name],
    ["Account Type:", data.account_type.charAt(0).toUpperCase() + data.account_type.slice(1)],
    ["Account Number:", maskAccountNumber(data.account_number)],
    ["Debit Date:", `${data.preferred_debit_date}${getOrdinalSuffix(data.preferred_debit_date)} of each month`],
  ];
  
  bankingDetails.forEach(([label, value]) => {
    doc.setTextColor(...mutedColor);
    doc.text(label, leftMargin + 3, yPosition);
    doc.setTextColor(...textColor);
    doc.text(value, leftMargin + 45, yPosition);
    yPosition += 7;
  });
  
  yPosition += 10;
  
  // ============================================
  // Important Information (Amber Box)
  // ============================================
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
  
  yPosition += 18;
  
  // ============================================
  // DISCLAIMER SECTIONS
  // ============================================
  
  // Helper function to draw a disclaimer section
  const drawDisclaimerSection = (title: string, bullets: string[], consentText: string) => {
    const sectionHeight = 8 + (bullets.length * 5) + 10;
    
    // Check if we need a new page
    if (yPosition + sectionHeight > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Section background
    doc.setFillColor(...sectionBgColor);
    doc.rect(leftMargin, yPosition - 3, contentWidth, sectionHeight, "F");
    
    // Title
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(title, leftMargin + 4, yPosition + 3);
    yPosition += 10;
    
    // Bullets
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...mutedColor);
    
    bullets.forEach((bullet) => {
      doc.text(`• ${bullet}`, leftMargin + 4, yPosition);
      yPosition += 5;
    });
    
    // Consent confirmation
    yPosition += 2;
    doc.setTextColor(...consentGreen);
    doc.setFont("helvetica", "bold");
    doc.text("✓", leftMargin + 4, yPosition);
    doc.setTextColor(...mutedColor);
    doc.setFont("helvetica", "normal");
    doc.text(consentText, leftMargin + 10, yPosition);
    
    yPosition += 12;
  };
  
  // Debit Order Authorisation
  drawDisclaimerSection(
    "Debit Order Authorisation",
    [
      "Authorised Firearms Guardian and Acorn Brokers to debit account",
      `Monthly premium of ${formatCurrency(coverOption.premium)} confirmed`,
      `Debit date: ${data.preferred_debit_date}${getOrdinalSuffix(data.preferred_debit_date)} of each month`,
    ],
    `Consented: ${formatTimestamp(data.consent_timestamp)}`
  );
  
  // Policy Declaration
  drawDisclaimerSection(
    "Policy Declaration",
    [
      "Information provided is true and accurate",
      "Terms and conditions of the policy accepted",
      "GENRIC Insurance Company Limited acknowledged as underwriter",
    ],
    `Consented: ${formatTimestamp(data.consent_timestamp)}`
  );
  
  // POPIA Consent
  drawDisclaimerSection(
    "POPIA Consent & Privacy Notice",
    [
      "Consent given for personal information processing",
      "Third-party sharing acknowledged where required",
      "Data protection rights understood",
    ],
    `Consented: ${formatTimestamp(data.consent_timestamp)}`
  );
  
  // ============================================
  // FOOTER (3-Column Layout)
  // ============================================
  const footerY = 270;
  
  // Divider line
  doc.setDrawColor(...dividerColor);
  doc.setLineWidth(0.3);
  doc.line(leftMargin, footerY - 12, pageWidth - leftMargin, footerY - 12);
  
  // Column 1: Company (Left)
  doc.setTextColor(...mutedColor);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Acorn Brokers (Pty) Ltd", leftMargin, footerY - 5);
  doc.setFont("helvetica", "normal");
  doc.text("FSP 47433", leftMargin, footerY);
  doc.text(`© ${new Date().getFullYear()} All rights reserved`, leftMargin, footerY + 5);
  
  // Column 2: Regulatory (Centre)
  const centreX = pageWidth / 2;
  doc.setFont("helvetica", "normal");
  doc.text("Firearms Guardian (Pty) Ltd", centreX, footerY - 5, { align: "center" });
  doc.text("FSP 47115", centreX, footerY, { align: "center" });
  doc.setFontSize(7);
  doc.text("Underwritten by GENRIC Insurance Company Ltd (FSP 43638)", centreX, footerY + 5, { align: "center" });
  
  // Column 3: Contact (Right)
  const rightX = pageWidth - leftMargin;
  doc.setFontSize(8);
  doc.text("info@acornbrokers.co.za", rightX, footerY - 5, { align: "right" });
  doc.text("+27 (0)69 007 6320", rightX, footerY, { align: "right" });
  doc.text(`Generated: ${new Date().toLocaleDateString("en-ZA")}`, rightX, footerY + 5, { align: "right" });
  
  // Return as base64 string for email attachment
  return doc.output("datauristring").split(",")[1];
};
