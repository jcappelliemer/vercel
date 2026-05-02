"""
Solaris Films email service through the WordPress relay.
"""
import os
import logging
import requests

logger = logging.getLogger(__name__)


def send_email(subject: str, html_body: str, reply_to: str = None):
    """Send email via WP REST relay endpoint."""
    wp_url = os.environ.get('WP_URL', '')
    relay_key = os.environ.get('WP_EMAIL_RELAY_KEY', '')
    to_addr = os.environ.get('SMTP_TO', 'info@solarisfilms.it')

    if not wp_url or not relay_key:
        logger.error("WP email relay not configured (WP_URL or WP_EMAIL_RELAY_KEY missing)")
        return False

    endpoint = f"{wp_url}/wp-json/solaris/v1/send-email"

    payload = {
        "subject": subject,
        "html": html_body,
        "to": to_addr,
    }
    if reply_to:
        payload["reply_to"] = reply_to

    headers = {
        "Content-Type": "application/json",
        "X-Solaris-Key": relay_key,
    }

    try:
        resp = requests.post(endpoint, json=payload, headers=headers, timeout=15)
        if resp.status_code == 200:
            logger.info(f"Email sent via WP relay: {subject}")
            return True
        logger.error(f"WP relay error {resp.status_code}: {resp.text}")
        return False
    except Exception as e:
        logger.error(f"WP relay request failed: {e}")
        return False


def attachment_list_html(data: dict) -> str:
    allegati = data.get('allegati') or []
    return ''.join(
        f"<li>{item.get('filename', '')} ({item.get('size', 0)} byte)</li>"
        for item in allegati
    ) or '<li>Nessun allegato</li>'


def build_quote_email(data: dict) -> tuple:
    """Build HTML email for quote request."""
    tipo = data.get('tipo_pellicola', '-')
    subject = f"Nuovo Preventivo - {data.get('nome', '')} {data.get('cognome', '')} ({tipo})"
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
                <tr><td style="padding: 8px 0; color: #666;">Azienda</td><td style="padding: 8px 0;">{data.get('ragione_sociale', '-')}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Citta</td><td style="padding: 8px 0;">{data.get('citta', '-')}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Superficie (mq)</td><td style="padding: 8px 0;">{data.get('superficie_mq', '-')}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Prodotto di interesse</td><td style="padding: 8px 0; font-weight: 600; color: #2563EB;">{tipo}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Privacy</td><td style="padding: 8px 0;">{'Accettata' if data.get('privacy_accettata') else 'Non indicata'}</td></tr>
            </table>
            <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e0e0e0;">
                <p style="color: #666; margin: 0 0 5px; font-size: 12px; text-transform: uppercase;">Richiesta</p>
                <p style="margin: 0; line-height: 1.6;">{data.get('richiesta') or data.get('messaggio', 'Nessuna richiesta')}</p>
            </div>
            <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e0e0e0;">
                <p style="color: #666; margin: 0 0 5px; font-size: 12px; text-transform: uppercase;">Allegati caricati</p>
                <ul style="margin: 0; padding-left: 18px; line-height: 1.6;">{attachment_list_html(data)}</ul>
            </div>
        </div>
        <div style="background: #0A0F1C; padding: 15px 30px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: #94A3B8; margin: 0; font-size: 12px;">Solaris Films - Distributore Esclusivo MADICO USA</p>
        </div>
    </div>
    """
    return subject, html


def build_contact_email(data: dict) -> tuple:
    """Build HTML email for contact form."""
    subject = f"Nuovo Contatto - {data.get('nome', '')} {data.get('cognome', '')}"
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
                <tr><td style="padding: 8px 0; color: #666;">Ragione Sociale</td><td style="padding: 8px 0;">{data.get('ragione_sociale', '-')}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Citta</td><td style="padding: 8px 0;">{data.get('citta', '-')}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Privacy</td><td style="padding: 8px 0;">{'Accettata' if data.get('privacy_accettata') else 'Non indicata'}</td></tr>
            </table>
            <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e0e0e0;">
                <p style="color: #666; margin: 0 0 5px; font-size: 12px; text-transform: uppercase;">Richiesta</p>
                <p style="margin: 0; line-height: 1.6;">{data.get('richiesta') or data.get('messaggio', 'Nessuna richiesta')}</p>
            </div>
            <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #e0e0e0;">
                <p style="color: #666; margin: 0 0 5px; font-size: 12px; text-transform: uppercase;">Allegati caricati</p>
                <ul style="margin: 0; padding-left: 18px; line-height: 1.6;">{attachment_list_html(data)}</ul>
            </div>
        </div>
        <div style="background: #0A0F1C; padding: 15px 30px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: #94A3B8; margin: 0; font-size: 12px;">Solaris Films - Distributore Esclusivo MADICO USA</p>
        </div>
    </div>
    """
    return subject, html
