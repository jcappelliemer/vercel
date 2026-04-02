"""
Solaris Films — SEO Agent Orchestra
Multi-agent system per ottimizzazione SEO automatica
"""
import os
import json
import uuid
import logging
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage

logger = logging.getLogger(__name__)


def get_api_key():
    return os.environ.get('EMERGENT_LLM_KEY', '')

# ============== AGENT DEFINITIONS ==============

ANALYZER_SYSTEM = """Sei un esperto analista SEO specializzato nel mercato italiano B2B.
Il tuo compito è analizzare contenuti web e identificare problemi e opportunità SEO.

Per ogni contenuto analizzato, restituisci un JSON con questa struttura:
{
  "score": 0-100,
  "issues": [{"severity": "alta|media|bassa", "issue": "descrizione", "fix": "suggerimento"}],
  "keywords_found": ["keyword1", "keyword2"],
  "keywords_missing": ["keyword1", "keyword2"],
  "readability": "buona|media|scarsa",
  "content_length": "adeguata|troppo_corta|troppo_lunga",
  "heading_structure": "corretta|da_migliorare",
  "summary": "breve riassunto dell'analisi"
}

Rispondi SOLO con il JSON, senza testo aggiuntivo."""

GENERATOR_SYSTEM = """Sei un copywriter SEO esperto specializzato nel settore edile e pellicole per vetri in Italia.
Genera contenuti SEO ottimizzati in italiano.

L'azienda è Solaris Films: distributore esclusivo MADICO USA per l'Italia, 40+ anni esperienza, 45.000+ edifici trattati.

Prodotti: pellicole antisolari, di sicurezza, anti-esplosione SafetyShield, privacy/decorative.

Quando ti viene chiesto di generare meta tags, restituisci un JSON:
{
  "meta_title": "max 60 caratteri, con keyword principale",
  "meta_description": "max 155 caratteri, coinvolgente con CTA",
  "h1": "heading principale della pagina",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "og_title": "titolo per social sharing",
  "og_description": "descrizione per social sharing"
}

Quando ti viene chiesto di generare contenuto, restituisci un JSON:
{
  "titolo": "titolo ottimizzato",
  "introduzione": "paragrafo introduttivo SEO",
  "sezioni": [{"h2": "titolo sezione", "contenuto": "testo della sezione"}],
  "faq": [{"domanda": "...", "risposta": "..."}],
  "meta_title": "...",
  "meta_description": "..."
}

Rispondi SOLO con il JSON, senza testo aggiuntivo."""

LOCAL_SEO_SYSTEM = """Sei un esperto di Local SEO per il mercato italiano.
Generi contenuti ottimizzati per posizionamento locale (città specifiche) nel settore pellicole per vetri.

L'azienda è Solaris Films, opera in tutta Italia ma vuole posizionarsi localmente nelle principali città.

Quando ricevi il nome di una città, genera un JSON:
{
  "meta_title": "Pellicole per Vetri [Città] | Solaris Films - max 60 char",
  "meta_description": "descrizione locale max 155 char",
  "h1": "heading con nome città",
  "introduzione": "testo intro specifico per la città (2-3 frasi)",
  "servizi_locali": ["servizio 1 specifico", "servizio 2"],
  "punti_forza": ["punto 1 locale", "punto 2"],
  "faq_locali": [{"domanda": "domanda specifica città", "risposta": "risposta"}],
  "schema_local_business": {
    "name": "Solaris Films",
    "city": "[città]",
    "service_area": "descrizione area servita"
  }
}

Rispondi SOLO con il JSON."""

ORCHESTRATOR_SYSTEM = """Sei l'orchestratore di un sistema multi-agente SEO per Solaris Films.
Coordini 3 agenti specializzati:
1. ANALYZER: analizza contenuti esistenti
2. GENERATOR: genera meta tags e contenuti SEO
3. LOCAL_SEO: ottimizza per posizionamento locale

Quando ricevi una richiesta, determina quali agenti attivare e in che ordine.
Restituisci un JSON:
{
  "plan": [
    {"agent": "analyzer|generator|local_seo", "task": "descrizione compito", "priority": 1}
  ],
  "strategy": "breve descrizione della strategia SEO",
  "expected_impact": "alto|medio|basso"
}

Rispondi SOLO con il JSON."""


async def run_agent(system_message, prompt, agent_name="agent"):
    """Run a single AI agent and return parsed JSON response."""
    try:
        chat = LlmChat(
            api_key=get_api_key(),
            session_id=f"seo-{agent_name}-{uuid.uuid4().hex[:8]}",
            system_message=system_message
        ).with_model("gemini", "gemini-2.5-flash")

        response = await chat.send_message(UserMessage(text=prompt))

        # Try to parse JSON from response
        cleaned = response.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[1] if "\n" in cleaned else cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()
            if cleaned.startswith("json"):
                cleaned = cleaned[4:].strip()

        return json.loads(cleaned)
    except json.JSONDecodeError:
        logger.warning(f"Agent {agent_name} returned non-JSON: {response[:200]}")
        return {"raw_response": response, "parse_error": True}
    except Exception as e:
        logger.error(f"Agent {agent_name} error: {e}")
        return {"error": str(e)}


async def analyze_content(content, url="", page_type="generic"):
    """Analyzer Agent: Analyze content for SEO issues."""
    prompt = f"""Analizza il seguente contenuto per SEO.
URL: {url}
Tipo pagina: {page_type}

CONTENUTO:
{content[:3000]}

Identifica problemi SEO, keyword mancanti, e opportunità di miglioramento.
Focus su: pellicole per vetri, pellicole antisolari, sicurezza vetri, MADICO, risparmio energetico."""
    return await run_agent(ANALYZER_SYSTEM, prompt, "analyzer")


async def generate_meta(page_type, page_title, content="", keywords=None):
    """Generator Agent: Generate SEO meta tags."""
    kw_str = ", ".join(keywords) if keywords else "pellicole per vetri, MADICO, risparmio energetico"
    prompt = f"""Genera meta tags SEO ottimizzati per questa pagina.
Tipo: {page_type}
Titolo attuale: {page_title}
Keywords target: {kw_str}
Contenuto esistente: {content[:1500]}

Genera meta_title, meta_description, h1, keywords principali, og_title e og_description."""
    return await run_agent(GENERATOR_SYSTEM, prompt, "generator")


async def generate_content(topic, page_type="articolo", target_keywords=None):
    """Generator Agent: Generate full SEO content."""
    kw_str = ", ".join(target_keywords) if target_keywords else ""
    prompt = f"""Genera contenuto SEO completo per:
Argomento: {topic}
Tipo pagina: {page_type}
Keywords target: {kw_str}

Genera titolo, introduzione, sezioni con H2, FAQ e meta tags.
Il contenuto deve essere informativo, professionale e ottimizzato per il settore pellicole per vetri."""
    return await run_agent(GENERATOR_SYSTEM, prompt, "generator-content")


async def generate_local_seo(city):
    """Local SEO Agent: Generate local SEO content for a city."""
    prompt = f"""Genera contenuto Local SEO completo per la città di {city}.
L'azienda Solaris Films offre servizi di installazione pellicole per vetri in tutta Italia.
Genera meta tags, contenuto introduttivo, servizi locali, FAQ specifiche per {city}.
Include anche lo schema LocalBusiness."""
    return await run_agent(LOCAL_SEO_SYSTEM, prompt, "local-seo")


async def orchestrate(request_type, details):
    """Orchestrator: Plan and execute multi-agent SEO workflow."""
    prompt = f"""Pianifica la strategia SEO per questa richiesta:
Tipo: {request_type}
Dettagli: {details}

Determina quali agenti attivare (analyzer, generator, local_seo) e in che ordine."""

    plan = await run_agent(ORCHESTRATOR_SYSTEM, prompt, "orchestrator")

    results = {"plan": plan, "agent_results": []}

    if plan.get("parse_error") or plan.get("error"):
        return plan

    for step in plan.get("plan", []):
        agent = step.get("agent", "")
        task = step.get("task", "")

        if agent == "analyzer":
            result = await analyze_content(details, page_type=request_type)
        elif agent == "generator":
            result = await generate_meta(request_type, task, details)
        elif agent == "local_seo":
            result = await generate_local_seo(task)
        else:
            result = {"skipped": True, "reason": f"Unknown agent: {agent}"}

        results["agent_results"].append({
            "agent": agent,
            "task": task,
            "result": result
        })

    return results
