import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generatePdfBuffer(studentName: string, courseName?: string, templateName: string = "certificate.png") {
    // 1. Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // 2. Setup Page (Landscape A4)
    // A4 in points is 595.28 x 841.89
    const width = 841.89;
    const height = 595.28;
    const page = pdfDoc.addPage([width, height]);

    // 3. Load Background Template
    const templatePath = path.join(__dirname, "../assets/templates", templateName);
    const fallbackPath = path.join(__dirname, "../assets/templates", "certificate.png");
    
    let finalTemplatePath = fs.existsSync(templatePath) ? templatePath : fallbackPath;

    if (fs.existsSync(finalTemplatePath)) {
        const imageBytes = fs.readFileSync(finalTemplatePath);
        const isPng = finalTemplatePath.toLowerCase().endsWith(".png");
        const image = isPng ? await pdfDoc.embedPng(imageBytes) : await pdfDoc.embedJpg(imageBytes);
        page.drawImage(image, {
            x: 0,
            y: 0,
            width: width,
            height: height,
        });
    }

    // 4. Load Fonts (Matching Python's Liberation Sans)
    let font;
    let boldFont;
    try {
        const fontBytes = fs.readFileSync('/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf');
        const boldFontBytes = fs.readFileSync('/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf');
        font = await pdfDoc.embedFont(fontBytes);
        boldFont = await pdfDoc.embedFont(boldFontBytes);
    } catch (e) {
        console.warn("Could not load custom fonts, falling back to Standard fonts:", e);
        font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    }

    // 5. Draw Student Name (Centered at specific coordinates from Python)
    const nameSize = 18;
    const displayTitle = studentName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    
    // Python used: width / 2.4, height - 295
    // In pdf-lib, (0,0) is bottom-left. Python's ReportLab uses (0,0) as bottom-left too by default.
    // However, height - 295 in ReportLab usually means measuring from the bottom if height is specified.
    
    const textWidth = boldFont.widthOfTextAtSize(displayTitle, nameSize);
    const centerX = width / 2.4; // Matching Python's offset
    const xPos = centerX - (textWidth / 2);
    const yPos = height - 295;

    page.drawText(displayTitle, {
        x: xPos,
        y: yPos,
        size: nameSize,
        font: boldFont,
        color: rgb(0, 0, 0),
    });

    // 6. Draw Course Name
    if (courseName) {
        const courseSize = 14;
        const courseWidth = font.widthOfTextAtSize(courseName, courseSize);
        const courseXPos = centerX - (courseWidth / 2);
        const courseYPos = height - 330;

        page.drawText(courseName, {
            x: courseXPos,
            y: courseYPos,
            size: courseSize,
            font: font,
            color: rgb(0, 0, 0),
        });
    }

    // 7. Return Buffer
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
}
