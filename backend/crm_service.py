"""
Solaris CRM integration helpers.
"""
import logging
import os
from typing import Dict, List, Optional

import requests

logger = logging.getLogger(__name__)

DEFAULT_CRM_WEBHOOK_URL = "https://crm.solarisfilms.it/api/webhook/wordpress-lead"

HIGH_PRIORITY_TERMS = {
    "safety",
    "shield",
    "anti-esplosione",
    "antiesplosione",
    "blast",
    "sicurezza",
    "antisfondamento",
    "intrusione",
    "urgente",
}

MEDIUM_PRIORITY_TERMS = {
    "preventivo",
    "consulenza",
    "sopralluogo",
    "azienda",
    "ufficio",
    "mq",
    "metri",
    "caldo",
    "antisolare",
}


def is_crm_webhook_enabled() -> bool:
    value = os.environ.get("CRM_WEBHOOK_ENABLED", "true").strip().lower()
    return value not in {"0", "false", "no", "off"}


def build_chat_lead_priority(data: Dict) -> str:
    text_parts = [
        data.get("interesse") or "",
        data.get("messaggio") or "",
        data.get("page_path") or "",
    ]
    for item in data.get("transcript") or []:
        text_parts.append(str(item.get("text") or item.get("content") or ""))

    searchable = " ".join(text_parts).lower()
    if any(term in searchable for term in HIGH_PRIORITY_TERMS):
        return "alta"
    if any(term in searchable for term in MEDIUM_PRIORITY_TERMS):
        return "media"
    return "standard"


def format_utm(utm: Optional[Dict]) -> str:
    if not isinstance(utm, dict):
        return ""

    parts = []
    for key in ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]:
        value = str(utm.get(key) or "").strip()
        if value:
            parts.append(f"{key}={value}")
    return ", ".join(parts)


def build_chat_crm_payload(data: Dict) -> Dict:
    name = " ".join(
        part.strip()
        for part in [data.get("nome", ""), data.get("cognome", "")]
        if part and part.strip()
    )
    if not name:
        name = data.get("email") or data.get("telefono") or "Lead chatbot Solaris"

    priority = data.get("priority") or build_chat_lead_priority(data)
    utm_text = format_utm(data.get("utm"))

    message_parts = [
        "Lead generato dal chatbot Solaris Films.",
        f"Priorita: {priority}",
        f"Interesse: {data.get('interesse') or 'Non specificato'}",
        f"Citta: {data.get('citta') or 'Non specificata'}",
        f"Pagina: {data.get('page_path') or 'Non disponibile'}",
        f"URL completo: {data.get('source_url') or 'Non disponibile'}",
        f"Referrer: {data.get('referrer') or 'Non disponibile'}",
        f"Sessione chat: {data.get('session_id') or 'Non disponibile'}",
    ]

    if utm_text:
        message_parts.append(f"Campagna: {utm_text}")

    if data.get("lead_id") or data.get("id"):
        message_parts.append(f"ID lead staging: {data.get('lead_id') or data.get('id')}")

    if data.get("messaggio"):
        message_parts.extend(["", "Messaggio cliente:", data["messaggio"]])

    transcript = data.get("transcript") or []
    transcript_text = format_chat_transcript(transcript)
    if transcript_text:
        message_parts.extend(["", "Ultimi messaggi chat:", transcript_text])

    payload = {
        "name": name,
        "email": data.get("email") or "",
        "phone": data.get("telefono") or "",
        "company": data.get("ragione_sociale") or "",
        "message": "\n".join(message_parts).strip(),
    }

    if os.environ.get("CRM_WEBHOOK_EXTENDED_FIELDS", "true").strip().lower() in {"1", "true", "yes", "on"}:
        payload.update({
            "source": "chatbot",
            "product_interest": data.get("interesse") or "",
            "source_page": data.get("source_url") or data.get("page_path") or "",
            "source_site": "solarisfilms.it",
            "priority": priority,
        })

    return payload


def format_chat_transcript(transcript: List[Dict]) -> str:
    lines = []
    for item in transcript[-12:]:
        role = item.get("type") or item.get("role") or "messaggio"
        text = str(item.get("text") or item.get("content") or "").strip()
        if not text:
            continue
        label = "Cliente" if role == "user" else "Assistente"
        lines.append(f"{label}: {text}")
    return "\n".join(lines)


def send_crm_lead(payload: Dict, source: Optional[str] = None) -> Dict:
    if not is_crm_webhook_enabled():
        return {"status": "disabled", "ok": False}

    webhook_url = os.environ.get("CRM_WEBHOOK_URL", DEFAULT_CRM_WEBHOOK_URL).strip()
    if not webhook_url:
        return {"status": "not_configured", "ok": False}

    headers = {"Content-Type": "application/json"}
    webhook_key = os.environ.get("CRM_WEBHOOK_KEY", "").strip()
    if webhook_key:
        headers["X-Solaris-Key"] = webhook_key

    if source:
        headers["X-Solaris-Source"] = source

    try:
        response = requests.post(webhook_url, json=payload, headers=headers, timeout=15)
    except Exception as exc:
        logger.error("CRM webhook request failed: %s", exc)
        return {"status": "error", "ok": False, "error": str(exc)}

    if 200 <= response.status_code < 300:
        return {
            "status": "sent",
            "ok": True,
            "status_code": response.status_code,
        }

    logger.error("CRM webhook error %s: %s", response.status_code, response.text[:500])
    return {
        "status": "error",
        "ok": False,
        "status_code": response.status_code,
        "error": response.text[:500],
    }
