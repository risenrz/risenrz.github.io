const input = document.getElementById('imageInput');
const preview = document.getElementById('preview');
const convertBtn = document.getElementById('convertBtn');

let imageFiles = [];

input.addEventListener('change', (e) => {
  preview.innerHTML = '';
  imageFiles = Array.from(e.target.files);

  imageFiles.forEach(file => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.src = event.target.result;
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

convertBtn.addEventListener('click', async () => {
  const { PDFDocument } = PDFLib;
  const pdfDoc = await PDFDocument.create();

  for (let file of imageFiles) {
    const imageBytes = await file.arrayBuffer();
    let img;

    if (file.type === 'image/png') {
      img = await pdfDoc.embedPng(imageBytes);
    } else {
      img = await pdfDoc.embedJpg(imageBytes);
    }

    const page = pdfDoc.addPage([img.width, img.height]);
    page.drawImage(img, {
      x: 0,
      y: 0,
      width: img.width,
      height: img.height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'converted.pdf';
  link.click();
});
