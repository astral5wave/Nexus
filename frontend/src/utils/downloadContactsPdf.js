import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadContactsPdf = (contacts) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(11, 30, 63);
  doc.setFont(undefined, 'bold');
  doc.text("Contacts Report", 14, 20);

  const timestamp = `Generated on: ${new Date().toLocaleDateString("en-GB")}`;
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.setFont(undefined, 'normal');
  doc.text(timestamp, 14, 30);

  autoTable(doc, {
    startY: 40,
    head: [["First Name", "Last Name", "Email", "Phone"]],
    body: contacts.map(c => [
      c.firstName || "-",
      c.lastName || "-",
      c.email || "-",
      c.contactCode+" "+c.contactNumber || "-"
    ]),
    styles: { fontSize: 10, cellPadding: 3, textColor: [0, 0, 0] },
    headStyles: { fillColor: [11, 30, 63], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [200, 210, 230] },
    didParseCell: (data) => {
      if (data.column.index === 2) {
        data.cell.styles.fontStyle = 'italic';
      }
    }
  });

  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.setFont(undefined, 'normal');
  doc.text("Nexus © 2025", 14, pageHeight - 10);

  doc.save("contacts.pdf");
};
