from markdown_pdf import MarkdownPdf, Section

with open('RAPPORT_FONCTIONS_PYTHON.md', 'r', encoding='utf-8') as f:
    markdown_content = f.read()

markdown_content = markdown_content.replace('](#1-introduction-et-contexte)', '')
markdown_content = markdown_content.replace('](#2-chiffrement-de-césar)', '')
markdown_content = markdown_content.replace('](#3-chiffrement-de-vigenère)', '')
markdown_content = markdown_content.replace('](#4-chiffrement-rsa)', '')
markdown_content = markdown_content.replace('](#5-conclusion)', '')
markdown_content = markdown_content.replace('[Introduction et Contexte', 'Introduction et Contexte')
markdown_content = markdown_content.replace('[Chiffrement de César', 'Chiffrement de César')
markdown_content = markdown_content.replace('[Chiffrement de Vigenère', 'Chiffrement de Vigenère')
markdown_content = markdown_content.replace('[Chiffrement RSA', 'Chiffrement RSA')
markdown_content = markdown_content.replace('[Conclusion', 'Conclusion')

pdf = MarkdownPdf(toc_level=0)

pdf.add_section(
    Section(markdown_content, toc=False),
    user_css="""
    body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.6; }
    h1 { color: #2563eb; text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
    h2 { color: #1e40af; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 30px; }
    h3 { color: #3b82f6; }
    h4 { color: #60a5fa; }
    code { background-color: #f3f4f6; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
    pre { background-color: #1f2937; color: #f9fafb; padding: 15px; border-radius: 5px; overflow-x: auto; }
    pre code { background-color: transparent; color: inherit; }
    table { border-collapse: collapse; width: 100%; margin: 15px 0; }
    th, td { border: 1px solid #d1d5db; padding: 8px 12px; text-align: left; }
    th { background-color: #3b82f6; color: white; }
    tr:nth-child(even) { background-color: #f9fafb; }
    blockquote { border-left: 4px solid #3b82f6; margin: 15px 0; padding-left: 15px; color: #4b5563; }
    """
)

pdf.meta["title"] = "Rapport des Fonctions de Cryptographie en Python"
pdf.meta["author"] = "SAIDI Melissa"
pdf.meta["subject"] = "Projet de Mathématiques - Cryptographie"

pdf.save("RAPPORT_FONCTIONS_PYTHON.pdf")

print("PDF généré avec succès: RAPPORT_FONCTIONS_PYTHON.pdf")
