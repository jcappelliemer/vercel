"""
Solaris Films — Email Service (SMTP Aruba)
"""
import os
import ssl
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

logger = logging.getLogger(__name__)


def send_email(subject: str, html_body: str, reply_to: str = None):
    """Send email via Aruba SMTP SSL."""
    host = os.environ.get('SMTP_HOST', '')
    port = int(os.environ.get('SMTP_PORT', '465'))
    user = os.environ.get('SMTP_USER', '')
    password = os.environ.get('SMTP_PASS', '')
    from_addr = os.environ.get('SMTP_FROM', user)
    to_addr = os.environ.get('SMTP_TO', user)

    if not all([host, user, password]):
        logger.error("SMTP not configured")
        return False

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = f"Solaris Films <{from_addr}>"
    msg['To'] = to_addr
    if reply_to:
        msg['Reply-To'] = reply_to

    msg.attach(MIMEText(html_body, 'html', 'utf-8'))

    try:
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(host, port, context=context, timeout=15) as server:
            server.login(user, password)
            server.send_message(msg)
        logger.info(f"Email sent: {subject}")
        return True
    except Exception as e:
        logger.error(f"Email send failed: {e}")
        return False


def build_quote_email(data: dict) -> tuple:
    """Build HTML email for quote request."""
    tipo = data.get('tipo_pellicola', '-')
    subject = f"Nuovo Preventivo — {data.get('nome', '')} {data.get('cognome', '')} ({tipo})"
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0A0F1C; padding: 24px 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #EAB308; margin: 0; font-size: 22px;">Nuova Richiesta Preventivo</h1>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border: 1px solid #e0e0e0;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #666; width: 140px;">Nome</td><td style="padding: 8px 0; font-weight: 600;">{data.get('nome', '')} {data.get('cognome', '')}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:{data.get('email', '')}">{data.get('email', '')}</a></td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Telefono</td><td style="padding: 8px 0;"><a href="tel:{data.get('telefono', '')}">{data.get('telefono', '')}</a></td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Ragione Sociale</td><td style="padding: 8px 0;">{data.get('ragione_sociale', '-')}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Città</td><td style="padding: 8px 0;">{data.get('citta', '-')}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Tipo Pellicola</td><td style="padding: 8px 0; font-weight: 600; color: #2563EB;">{tipo}</td></tr>
            </table>
            <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e0e0e0;">
                <p style="color: #666; margin: 0 0 5px; font-size: 12px; text-transform: uppercase;">Messaggio</p>
                <p style="margin: 0; line-height: 1.6;">{data.get('messaggio', 'Nessun messaggio')}</p>
            </div>
        </div>
        <div style="background: #0A0F1C; padding: 15px 30px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: #94A3B8; margin: 0; font-size: 12px;">Solaris Films — Distributore Esclusivo MADICO USA</p>
        </div>
    </div>
    """
    return subject, html


def build_contact_email(data: dict) -> tuple:
    """Build HTML email for contact form."""
    subject = f"Nuovo Contatto — {data.get('nome', '')} {data.get('cognome', '')}"
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0A0F1C; padding: 24px 30px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #EAB308; margin: 0; font-size: 22px;">Nuovo Messaggio dal Sito</h1>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border: 1px solid #e0e0e0;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #666; width: 140px;">Nome</td><td style="padding: 8px 0; font-weight: 600;">{data.get('nome', '')} {data.get('cognome', '')}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:{data.get('email', '')}">{data.get('email', '')}</a></td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Telefono</td><td style="padding: 8px 0;"><a href="tel:{data.get('telefono', '')}">{data.get('telefono', '')}</a></td></tr>
            </table>
            <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e0e0e0;">
                <p style="color: #666; margin: 0 0 5px; font-size: 12px; text-transform: uppercase;">Messaggio</p>
                <p style="margin: 0; line-height: 1.6;">{data.get('messaggio', 'Nessun messaggio')}</p>
            </div>
        </div>
        <div style="background: #0A0F1C; padding: 15px 30px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: #94A3B8; margin: 0; font-size: 12px;">Solaris Films — Distributore Esclusivo MADICO USA</p>
        </div>
    </div>
    """
    return subject, html
