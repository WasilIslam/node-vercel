const express = require('express');
const pdfMake = require('pdfmake');

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/generate-pdf', (req, res) => {
    const { subject, body } = req.query;
  
    // Define the PDF content using pdfmake
    const docDefinition = {
      content: [
        { text: subject, style: 'header' },
        { text: body },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
        },
      },
    };
  
    const pdfDoc = pdfMake.createPdf(docDefinition);
  
    pdfDoc.getBuffer((bufferErr, pdfBuffer) => {
      if (bufferErr) {
        res.status(500).send('Error generating PDF');
      } else {
        // Set the response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${subject}.pdf"`);
  
        // Send the PDF as the response
        res.send(pdfBuffer);
      }
    });
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  