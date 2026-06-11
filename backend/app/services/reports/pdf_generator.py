import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

class PDFReportGenerator:
    @staticmethod
    def generate(file_path: str, report_data: dict) -> bool:
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        try:
            doc = SimpleDocTemplate(
                file_path,
                pagesize=letter,
                rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
            )
            story = []
            styles = getSampleStyleSheet()
            
            # Custom styled headers
            title_style = ParagraphStyle(
                'TitleStyle',
                parent=styles['Heading1'],
                textColor=colors.HexColor('#6366f1'),
                fontSize=24,
                spaceAfter=15
            )
            body_style = styles['Normal']
            
            story.append(Paragraph("AI Interview Evaluation Report", title_style))
            story.append(Spacer(1, 15))
            
            # Overall Score Grid
            score_data = [
                ["Overall Score", f"{report_data.get('overall_score', 80)}/100"],
                ["Technical Rating", f"{report_data.get('technical_score', 80)}%"],
                ["Speech Pace", f"{report_data.get('communication_score', 80)}%"],
                ["Body Language", f"{report_data.get('body_language_score', 80)}%"]
            ]
            t = Table(score_data, colWidths=[180, 100])
            t.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#1f2937')),
                ('TEXTCOLOR', (0,0), (-1,-1), colors.white),
                ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#374151')),
                ('PADDING', (0,0), (-1,-1), 10),
                ('ALIGN', (0,0), (-1,-1), 'CENTER')
            ]))
            story.append(t)
            story.append(Spacer(1, 25))
            
            # Review text
            story.append(Paragraph("<b>AI Recruiter Summary:</b>", styles['Heading2']))
            story.append(Spacer(1, 5))
            story.append(Paragraph(report_data.get("feedback", "N/A"), body_style))
            
            doc.build(story)
            return True
        except Exception as e:
            print("Failed to build PDF report:", str(e))
            return False
