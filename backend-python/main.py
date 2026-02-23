from fastapi import FastAPI, Form, Query
from fastapi.responses import FileResponse
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import uuid
import os
from typing import Optional

app = FastAPI()

OUTPUT_DIR = "generated"
TEMPLATES_DIR = "templates"
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(TEMPLATES_DIR, exist_ok=True)

# Register Arial (Normal and Bold) using Liberation Sans equivalents on Linux
try:
    pdfmetrics.registerFont(TTFont('Arial', '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'))
    pdfmetrics.registerFont(TTFont('Arial-Bold', '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'))
except Exception as e:
    print(f"Warning: Could not register Arial fonts: {e}. Falling back to Helvetica.")

@app.post("/generate")
def generate_certificate(
    student_name: str = Form(...),
    course_name: Optional[str] = Form(None),
    template: str = Query("certificate.png")
):
    filename = f"{uuid.uuid4()}.pdf"
    path = os.path.join(OUTPUT_DIR, filename)
    template_path = os.path.join(TEMPLATES_DIR, template)

    if not os.path.exists(template_path):
        template_path = os.path.join(TEMPLATES_DIR, "certificate.png")

    c = canvas.Canvas(path, pagesize=landscape(A4))
    width, height = landscape(A4)
    
    # Background
    if os.path.exists(template_path):
        c.drawImage(template_path, 0, 0, width=width, height=height)

    # Student Name
    try:
        c.setFont("Arial-Bold", 18)
    except:
        c.setFont("Helvetica-Bold", 18)
        
    c.drawCentredString(width / 2.4, height - 295, student_name.title())

    # Course Name (Optional)
    if course_name:
        try:
            c.setFont("Arial", 14)
        except:
            c.setFont("Helvetica", 14)
        c.drawCentredString(width / 2.4, height - 330, course_name)

    c.showPage()
    c.save()

    return FileResponse(
        path,
        media_type="application/pdf",
        filename=f"{student_name.replace(' ', '_')}_certificate.pdf"
    )
