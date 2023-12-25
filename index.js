const express = require("express");
const PdfPrinter = require("pdfmake");
const { generateCompactUniqueRef } = require("./helper/encode");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");

const cors= require("cors")


app.use(cors());
// Define fonts for pdfmake



const fonts = {
  OpenSans: {
    normal: path.join(__dirname, "fonts/OpenSans-Regular.ttf"),
    bold: path.join(__dirname, "fonts/OpenSans-Medium.ttf"),
    italics: path.join(__dirname, "fonts/OpenSans-Italic.ttf"),
    bolditalics: path.join(__dirname, "fonts/OpenSans-MediumItalic.ttf"),
  },
  Imprint: {
    normal: path.join(__dirname, "fonts/Imprint MT Std Regular.otf"),
  },
};
const printer = new PdfPrinter(fonts);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/generate-pdf", (req, res) => {
  try {
    const SIGN_SIZE = 80;
    const {
      tag = generateCompactUniqueRef(),
      date,
      address1 = "",
      address2 = "",
      subject,
      body,
    } = req.query;

    // Define the PDF content using pdfmake
    const docDefinition = {
      pageMargins: [40, 100, 40, 30], // Define page margins to make space for the header
      header: [
        {
          canvas: [
            {
              type: "line",
              x1: 45,
              y1: 20,
              x2: 530,
              y2: 20,
              lineWidth: 1,
              color: "grey",
            },
          ],
        },
        {
          text: `United Corporation`,
          style: "header-logo",
          margin: [45, 10],
        },
      ],
      footer: function (currentPage, pageCount) {
        return {
          layout: "noBorders",
          margin: [0, 0],
          stack: [
            {
              alignment: "center", // Center-align the line
              canvas: [
                { type: "line", x1: 5, y1: 0, x2: 500, y2: 0, color: "grey" },
              ],
              margin: [0, 0, 0, 4],
            },
            {
              columns: [
                {
                  text: `Page ${currentPage} of ${pageCount}`,
                  alignment: "right",
                  margin: [0, 0, 50, 0],
                },
              ],
            },
          ],
        };
      },
      defaultStyle: { font: "OpenSans", fontSize: 11 }, // This uses a custom font
      content: [
        {
          columns: [
            {
              text: `To,\n ${address1}\n${address2}`,
              style: "address",
              width: "auto", // Allow this column to adjust its width based on content
            },
            {
              text: `Ref: ${tag}\nDated: ${date}`,
              style: "date",
              alignment: "right", // Align this column's content to the right
              width: "*", // Allow this column to take up the remaining space
            },
          ],
        },
        {
          columns: [
            {
              text: `Subject:`,
              style: "subject",
              width: "auto",
            },
            {
              text: `${subject}`,
              style: ["subject", "boldunderline"],
            },
          ],
        },
        {
          text: body,
          style: "body",
        },
        {
          text: "Best regards,",
          style: "signature",
        },
        {
          columns: [
            {
              image: path.join(__dirname,"sign.png"), // Replace with the path to the United Corporation logo image
              width: SIGN_SIZE,
              style: "logo",
              margin: [0, 20, 0, 4],
            }, // 'auto' width will make the column fit its content
            {
              image: path.join(__dirname,"uc.png"), // Replace with the path to the United Corporation logo image
              width: SIGN_SIZE + 20,
              style: "logo",
              margin: [0, 0, 0, 0],
            },
          ],
        },
        {
          text: "Muzaffar Islam",
          style: "signatureName",
        },
        {
          text: "Email: islam.sons3@gmail.com\nCell # 0321-4381660 0333818581",
          style: "contactInfo",
        },
      ],
      styles: {
        "header-logo": {
          fontSize: 30,
          font: "Imprint",
          color: "grey",
        },
        ref: {
          bold: true,
          margin: [0, 0, 0, 5],
        },
        date: {
          margin: [0, 0, 0, 5],
        },
        address: {
          margin: [0, 0, 0, 10],
        },
        subject: {
          margin: [0, 0, 10, 10],
        },
        boldunderline: { decoration: "underline", bold: true },

        greeting: {
          margin: [0, 0, 0, 5],
        },
        body: {
          margin: [0, 0, 0, 20],
        },
        signature: {
          bold: true,
          margin: [0, 20, 0, 5],
        },
        signatureName: {
          italics: true,
          margin: [0, 5, 0, 10],
        },
        contactInfo: {
          margin: [0, 5, 0, 30],
          fontSize: 8,
        },
        logo: {
          alignment: "center",
          margin: [0, 30, 0, 0],
        },
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    // Set the response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${subject}-${tag}.pdf"`);

    // Stream the PDF directly to the response
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    // Handle errors and return an error response with the error message
    res
      .status(500)
      .json({
        error: "An error occurred while generating the PDF",
        message: error.message,
        ok:JSON.stringify(error)
      });
  }
});
