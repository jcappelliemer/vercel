from fastapi import FastAPI, APIRouter, HTTPException, Request
from seo_agents import analyze_content, generate_meta, generate_content, generate_local_seo, orchestrate
from fastapi.responses import Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, ValidationError, field_validator
from typing import Dict, List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage
from email_service import send_email, build_quote_email, build_contact_email
from crm_service import build_chat_crm_payload, build_chat_lead_priority, send_crm_lead

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Solaris Films API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ============== MODELS ==============

class QuoteRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nome: str
    cognome: str
    email: EmailStr
    telefono: str
    ragione_sociale: Optional[str] = None
    citta: str
    tipo_pellicola: str
    superficie_mq: Optional[str] = None
    richiesta: Optional[str] = None
    messaggio: Optional[str] = None
    privacy_accettata: bool = False
    allegati: List[dict] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "nuovo"

class QuoteRequestCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    nome: str
    cognome: str
    email: EmailStr
    telefono: str
    ragione_sociale: Optional[str] = None
    citta: str
    tipo_pellicola: str
    superficie_mq: Optional[str] = None
    richiesta: Optional[str] = None
    messaggio: Optional[str] = None
    privacy_accettata: bool = False
    allegati: List[dict] = Field(default_factory=list)

class ContactRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nome: str
    cognome: str
    email: EmailStr
    telefono: str
    ragione_sociale: Optional[str] = None
    citta: Optional[str] = None
    richiesta: Optional[str] = None
    messaggio: str
    privacy_accettata: bool = False
    allegati: List[dict] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactRequestCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    nome: str
    cognome: str
    email: EmailStr
    telefono: str
    ragione_sociale: Optional[str] = None
    citta: Optional[str] = None
    richiesta: Optional[str] = None
    messaggio: str
    privacy_accettata: bool = False
    allegati: List[dict] = Field(default_factory=list)

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None
    page_path: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str

class ChatTranscriptItem(BaseModel):
    type: str
    text: str

class ChatLeadCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    session_id: Optional[str] = None
    nome: str
    cognome: Optional[str] = None
    email: Optional[str] = None
    telefono: Optional[str] = None
    ragione_sociale: Optional[str] = None
    citta: Optional[str] = None
    interesse: Optional[str] = None
    messaggio: Optional[str] = None
    page_path: Optional[str] = None
    source_url: Optional[str] = None
    referrer: Optional[str] = None
    user_agent: Optional[str] = None
    utm: Dict[str, str] = Field(default_factory=dict)
    privacy_accettata: bool = False
    transcript: List[ChatTranscriptItem] = Field(default_factory=list)

    @field_validator("email", "telefono", "cognome", "ragione_sociale", "citta", "interesse", "messaggio", "page_path", "source_url", "referrer", "user_agent", mode="before")
    @classmethod
    def empty_to_none(cls, value):
        if isinstance(value, str) and not value.strip():
            return None
        return value

class ChatLeadResponse(BaseModel):
    id: str
    status: str
    crm_status: str
    session_id: Optional[str] = None

class ChatLeadStatusUpdate(BaseModel):
    status: Optional[str] = None
    assigned_to: Optional[str] = None
    internal_notes: Optional[str] = None

# SEO Agent Models
class SEOAnalyzeRequest(BaseModel):
    content: str
    url: Optional[str] = ""
    page_type: Optional[str] = "generic"

class SEOMetaRequest(BaseModel):
    page_type: str
    page_title: str
    content: Optional[str] = ""
    keywords: Optional[List[str]] = None

class SEOContentRequest(BaseModel):
    topic: str
    page_type: Optional[str] = "articolo"
    target_keywords: Optional[List[str]] = None

class SEOLocalRequest(BaseModel):
    city: str

class SEOOrchestrateRequest(BaseModel):
    request_type: str
    details: str

class SEOBulkRequest(BaseModel):
    pages: List[dict]

class BlogPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    titolo: str
    slug: str
    contenuto: str
    excerpt: str
    immagine: Optional[str] = None
    categoria: str
    tags: List[str] = []
    pubblicato: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ============== FORM HELPERS ==============

def form_bool(value) -> bool:
    if isinstance(value, bool):
        return value
    return str(value or '').lower() in {'1', 'true', 'on', 'yes', 'si'}

async def parse_form_or_json(request: Request) -> dict:
    content_type = request.headers.get('content-type', '')
    if 'multipart/form-data' not in content_type:
        return await request.json()

    form = await request.form()
    payload = {}
    allegati = []

    for key, value in form.multi_items():
        if key == 'attachment_image':
            if getattr(value, 'filename', ''):
                content = await value.read()
                allegati.append({
                    'filename': value.filename,
                    'content_type': value.content_type,
                    'size': len(content),
                })
            continue
        payload[key] = value

    if allegati:
        payload['allegati'] = allegati[:10]

    return payload

def normalize_quote_payload(payload: dict) -> dict:
    normalized = dict(payload)
    normalized['nome'] = normalized.get('nome') or normalized.get('first_name') or ''
    normalized['cognome'] = normalized.get('cognome') or normalized.get('last_name') or ''
    normalized['telefono'] = normalized.get('telefono') or normalized.get('phone') or ''
    normalized['ragione_sociale'] = normalized.get('ragione_sociale') or normalized.get('company_name') or normalized.get('azienda')
    normalized['citta'] = normalized.get('citta') or normalized.get('city') or ''
    normalized['superficie_mq'] = normalized.get('superficie_mq') or normalized.get('surface_sqm')
    normalized['tipo_pellicola'] = normalized.get('tipo_pellicola') or normalized.get('product_interest') or ''
    normalized['richiesta'] = normalized.get('richiesta') or normalized.get('request_notes') or normalized.get('messaggio')
    normalized['messaggio'] = normalized.get('messaggio') or normalized.get('richiesta') or normalized.get('request_notes')
    normalized['privacy_accettata'] = form_bool(normalized.get('privacy_accettata') or normalized.get('privacy_acceptance'))
    return normalized

def normalize_contact_payload(payload: dict) -> dict:
    normalized = dict(payload)
    normalized['nome'] = normalized.get('nome') or normalized.get('first_name') or ''
    normalized['cognome'] = normalized.get('cognome') or normalized.get('last_name') or ''
    normalized['telefono'] = normalized.get('telefono') or normalized.get('phone') or ''
    normalized['ragione_sociale'] = normalized.get('ragione_sociale') or normalized.get('company_name')
    normalized['citta'] = normalized.get('citta') or normalized.get('city')
    normalized['richiesta'] = normalized.get('richiesta') or normalized.get('request_notes') or normalized.get('messaggio') or ''
    normalized['messaggio'] = normalized.get('messaggio') or normalized.get('richiesta') or normalized.get('request_notes') or ''
    normalized['privacy_accettata'] = form_bool(normalized.get('privacy_accettata') or normalized.get('privacy_acceptance'))
    return normalized

def serialize_chat_pair(record: dict) -> List[dict]:
    items = []
    user_message = str(record.get('user_message') or '').strip()
    bot_response = str(record.get('bot_response') or '').strip()

    if user_message:
        items.append({'type': 'user', 'text': user_message})
    if bot_response:
        items.append({'type': 'bot', 'text': bot_response})

    return items

async def load_chat_transcript(session_id: Optional[str], fallback: List[dict]) -> List[dict]:
    if not session_id:
        return fallback[-20:]

    records = await db.chat_history.find(
        {'session_id': session_id},
        {'_id': 0, 'user_message': 1, 'bot_response': 1, 'created_at': 1},
    ).sort('created_at', 1).to_list(50)

    transcript = []
    for record in records:
        transcript.extend(serialize_chat_pair(record))

    return (transcript or fallback)[-20:]

def require_admin_key(request: Request) -> None:
    expected_key = os.environ.get('SOLARIS_ADMIN_KEY', '').strip()
    if not expected_key:
        raise HTTPException(status_code=503, detail="Admin key non configurata")

    provided_key = request.headers.get('X-Solaris-Admin-Key', '').strip()
    if provided_key != expected_key:
        raise HTTPException(status_code=403, detail="Accesso non autorizzato")

def public_chat_lead(row: dict, detail: bool = False) -> dict:
    transcript = row.get('transcript') or []
    result = {
        "id": row.get("id"),
        "session_id": row.get("session_id"),
        "nome": row.get("nome"),
        "cognome": row.get("cognome"),
        "email": row.get("email"),
        "telefono": row.get("telefono"),
        "ragione_sociale": row.get("ragione_sociale"),
        "citta": row.get("citta"),
        "interesse": row.get("interesse"),
        "messaggio": row.get("messaggio"),
        "page_path": row.get("page_path"),
        "source_url": row.get("source_url"),
        "referrer": row.get("referrer"),
        "utm": row.get("utm") or {},
        "status": row.get("status", "nuovo"),
        "priority": row.get("priority", "standard"),
        "crm_status": row.get("crm_status") or (row.get("crm_result") or {}).get("status"),
        "assigned_to": row.get("assigned_to"),
        "internal_notes": row.get("internal_notes"),
        "created_at": row.get("created_at"),
        "updated_at": row.get("updated_at"),
        "last_crm_attempt_at": row.get("last_crm_attempt_at"),
        "transcript_count": len(transcript),
    }

    if detail:
        result["transcript"] = transcript
        result["crm_attempts"] = row.get("crm_attempts") or []
        result["crm_payload"] = row.get("crm_payload") or {}

    return result

# ============== CHATBOT SYSTEM MESSAGE ==============

CHATBOT_SYSTEM_MESSAGE = """Sei l'assistente virtuale di Solaris Films, azienda leader in Italia per pellicole per vetri.

INFORMAZIONI AZIENDALI:
- 40 anni di esperienza nel settore
- Distributore esclusivo MADICO USA per Italia e Spagna
- Oltre 45.000 edifici trattati
- Certificazione ISO 9001
- Garanzia fino a 10 anni

PRODOTTI PRINCIPALI:
1. PELLICOLE ANTISOLARI (prodotto di punta): Riducono il calore fino a 7-8°C, risparmio energetico 30-50%, protezione UV 99%, riflessione IR 85%. Disponibili in finitura brunito, argento, neutro e grigio fumè.
2. SAFETY SHIELD ANTI-ESPLOSIONE (secondo prodotto chiave): Pellicole MADICO SafetyShield G2, le più testate al mondo. Protezione blast, anti-intrusione, disastri naturali. Certifiate GSA 3A/3B, ASTM F1642, ASTM F3561, EN 356. Sistema FrameGard 500-800 lbs/ft.
3. PELLICOLE DI SICUREZZA: Certificate UNI EN 12600, anti-sfondamento, protezione da schegge, conformità D.Lgs. 81/2008
4. PELLICOLE PRIVACY/DESIGN: Satinate, decorative, personalizzabili

VANTAGGI:
- Nessun lavoro strutturale invasivo
- Installazione rapida senza interrompere attività
- Conformità D.Lgs. 81/2008 per sicurezza sul lavoro
- Migliore efficienza energetica edifici
- Ammortamento investimento in max 2-3 anni

REFERENZE: Banca d'Italia, EUR Spa Nuvola Roma, Università di Bologna, Aeroporto di Bologna, Ministero dell'Interno, CNR, Sapienza, Palazzo Pitti, e molti altri.

ISTRUZIONI:
- Rispondi sempre in italiano in modo professionale ma cordiale
- Suggerisci di richiedere un preventivo gratuito per informazioni specifiche sui prezzi
- Per urgenze, invita a chiamare o usare WhatsApp
- Mantieni risposte concise ma complete (max 3-4 frasi)
- Se non sai qualcosa, ammettilo e suggerisci di contattare l'azienda
- Non menzionare prodotti fuori catalogo"""

# ============== API ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "Solaris Films API", "status": "online"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Quote/Preventivo endpoints
@api_router.post("/quote", response_model=QuoteRequest)
async def create_quote(request: Request):
    payload = await parse_form_or_json(request)
    payload = normalize_quote_payload(payload)
    try:
        input = QuoteRequestCreate(**payload)
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=e.errors())
    quote_obj = QuoteRequest(**input.model_dump())
    doc = quote_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.quotes.insert_one(doc)
    # Send email notification
    try:
        subject, html = build_quote_email(doc)
        send_email(subject, html, reply_to=doc.get('email'))
    except Exception as e:
        logger.error(f"Quote email failed: {e}")
    return quote_obj

@api_router.get("/quotes", response_model=List[QuoteRequest])
async def get_quotes():
    quotes = await db.quotes.find({}, {"_id": 0}).to_list(1000)
    for q in quotes:
        if isinstance(q['created_at'], str):
            q['created_at'] = datetime.fromisoformat(q['created_at'])
    return quotes

# Contact endpoints
@api_router.post("/contact", response_model=ContactRequest)
async def create_contact(request: Request):
    payload = await parse_form_or_json(request)
    payload = normalize_contact_payload(payload)
    try:
        input = ContactRequestCreate(**payload)
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=e.errors())
    contact_obj = ContactRequest(**input.model_dump())
    doc = contact_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contacts.insert_one(doc)
    # Send email notification
    try:
        subject, html = build_contact_email(doc)
        send_email(subject, html, reply_to=doc.get('email'))
    except Exception as e:
        logger.error(f"Contact email failed: {e}")
    return contact_obj

# Chatbot endpoint
@api_router.post("/chat", response_model=ChatResponse)
async def chat_with_bot(input: ChatMessage):
    try:
        session_id = input.session_id or str(uuid.uuid4())
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        
        if not api_key:
            raise HTTPException(status_code=500, detail="API key not configured")
        
        chat = LlmChat(
            api_key=api_key,
            session_id=session_id,
            system_message=CHATBOT_SYSTEM_MESSAGE
        ).with_model("anthropic", "claude-sonnet-4-5")
        
        user_message = UserMessage(text=input.message)
        response = await chat.send_message(user_message)
        
        # Store chat in database
        chat_doc = {
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "user_message": input.message,
            "bot_response": response,
            "page_path": input.page_path,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.chat_history.insert_one(chat_doc)
        
        return ChatResponse(response=response, session_id=session_id)
    except Exception as e:
        logging.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/chat/lead", response_model=ChatLeadResponse)
async def create_chat_lead(input: ChatLeadCreate):
    if not input.privacy_accettata:
        raise HTTPException(status_code=422, detail="Privacy non accettata")

    if not input.email and not input.telefono:
        raise HTTPException(status_code=422, detail="Inserisci almeno email o telefono")

    lead_id = str(uuid.uuid4())
    data = input.model_dump()
    data["id"] = lead_id
    data["lead_id"] = lead_id
    data["source"] = "chatbot"
    data["created_at"] = datetime.now(timezone.utc).isoformat()
    data["status"] = "nuovo"
    fallback_transcript = [item.model_dump() for item in input.transcript]
    data["transcript"] = await load_chat_transcript(input.session_id, fallback_transcript)
    data["priority"] = build_chat_lead_priority(data)

    crm_payload = build_chat_crm_payload(data)
    crm_result = send_crm_lead(crm_payload, source="chatbot")
    data["crm_payload"] = crm_payload
    data["crm_result"] = crm_result
    data["crm_status"] = crm_result.get("status", "unknown")
    data["crm_attempts"] = [{**crm_result, "attempted_at": datetime.now(timezone.utc).isoformat()}]

    await db.chat_leads.insert_one(data)

    return ChatLeadResponse(
        id=lead_id,
        status="created",
        crm_status=crm_result.get("status", "unknown"),
        session_id=input.session_id,
    )

@api_router.get("/chat/leads")
async def list_chat_leads(
    request: Request,
    status: Optional[str] = None,
    crm_status: Optional[str] = None,
    priority: Optional[str] = None,
    q: Optional[str] = None,
    limit: int = 100,
):
    require_admin_key(request)

    filters = {}
    if status:
        filters["status"] = status
    if crm_status:
        filters["crm_status"] = crm_status
    if priority:
        filters["priority"] = priority
    if q:
        filters["$or"] = [
            {"nome": {"$regex": q, "$options": "i"}},
            {"cognome": {"$regex": q, "$options": "i"}},
            {"email": {"$regex": q, "$options": "i"}},
            {"telefono": {"$regex": q, "$options": "i"}},
            {"ragione_sociale": {"$regex": q, "$options": "i"}},
            {"interesse": {"$regex": q, "$options": "i"}},
        ]

    safe_limit = max(1, min(limit, 250))
    rows = await db.chat_leads.find(filters, {"_id": 0}).sort("created_at", -1).to_list(safe_limit)
    stats = {
        "total": await db.chat_leads.count_documents({}),
        "nuovi": await db.chat_leads.count_documents({"status": "nuovo"}),
        "alta_priorita": await db.chat_leads.count_documents({"priority": "alta"}),
        "crm_errori": await db.chat_leads.count_documents({"crm_status": "error"}),
    }

    return {
        "items": [public_chat_lead(row) for row in rows],
        "stats": stats,
        "limit": safe_limit,
    }

@api_router.get("/chat/leads/{lead_id}")
async def get_chat_lead(lead_id: str, request: Request):
    require_admin_key(request)

    row = await db.chat_leads.find_one({"id": lead_id}, {"_id": 0})
    if not row:
        raise HTTPException(status_code=404, detail="Lead chatbot non trovato")

    return public_chat_lead(row, detail=True)

@api_router.patch("/chat/leads/{lead_id}")
async def update_chat_lead(lead_id: str, input: ChatLeadStatusUpdate, request: Request):
    require_admin_key(request)

    updates = {
        key: value
        for key, value in input.model_dump().items()
        if value is not None
    }
    if not updates:
        raise HTTPException(status_code=422, detail="Nessun campo da aggiornare")

    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.chat_leads.update_one({"id": lead_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead chatbot non trovato")

    row = await db.chat_leads.find_one({"id": lead_id}, {"_id": 0})
    return public_chat_lead(row, detail=True)

@api_router.post("/chat/leads/{lead_id}/retry-crm")
async def retry_chat_lead_crm(lead_id: str, request: Request):
    require_admin_key(request)

    lead = await db.chat_leads.find_one({"id": lead_id}, {"_id": 0})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead non trovato")

    crm_payload = build_chat_crm_payload(lead)
    crm_result = send_crm_lead(crm_payload, source="chatbot-retry")
    attempted_at = datetime.now(timezone.utc).isoformat()
    attempt = {**crm_result, "attempted_at": attempted_at}

    await db.chat_leads.update_one(
        {"id": lead_id},
        {
            "$set": {
                "crm_payload": crm_payload,
                "crm_result": crm_result,
                "crm_status": crm_result.get("status", "unknown"),
                "last_crm_attempt_at": attempted_at,
            },
            "$push": {"crm_attempts": attempt},
        },
    )

    return {
        "id": lead_id,
        "crm_status": crm_result.get("status", "unknown"),
        "ok": crm_result.get("ok", False),
    }

# Blog endpoints
@api_router.get("/blog", response_model=List[BlogPost])
async def get_blog_posts():
    posts = await db.blog_posts.find({"pubblicato": True}, {"_id": 0}).to_list(100)
    for p in posts:
        if isinstance(p.get('created_at'), str):
            p['created_at'] = datetime.fromisoformat(p['created_at'])
    return posts

@api_router.get("/blog/{slug}")
async def get_blog_post(slug: str):
    post = await db.blog_posts.find_one({"slug": slug, "pubblicato": True}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if isinstance(post.get('created_at'), str):
        post['created_at'] = datetime.fromisoformat(post['created_at'])
    return post

# Services data endpoint
@api_router.get("/services")
async def get_services():
    return {
        "services": [
            {
                "id": "antisolari",
                "nome": "Pellicole Antisolari",
                "descrizione": "Riducono drasticamente il passaggio di calore, bloccando fino al 99% dei raggi UV e riducendo le temperature interne fino a 7-8°C. Risparmio energetico 30-50%.",
                "vantaggi": ["Risparmio energetico 30-50%", "Protezione UV 99%", "Riduzione temperatura 8°C", "Garanzia 10 anni"],
            },
            {
                "id": "safety-shield",
                "nome": "Safety Shield — Anti-Esplosione",
                "descrizione": "SafetyShield MADICO G2: la pellicola anti-esplosione più testata al mondo. Protezione blast, anti-intrusione, disastri naturali. Sistema FrameGard brevettato.",
                "vantaggi": ["Blast Mitigation GSA 3A/3B", "Anti-intrusione ASTM F3561", "EN 356 Manual Attack", "FrameGard 500-800 lbs/ft"],
            },
            {
                "id": "sicurezza",
                "nome": "Pellicole di Sicurezza",
                "descrizione": "Certificate UNI EN 12600, trasformano qualsiasi vetro in vetro di sicurezza, proteggendo da schegge e intrusioni.",
                "vantaggi": ["Certificazione UNI EN 12600", "Anti-sfondamento", "Conformità D.Lgs. 81/2008", "Protezione da schegge"],
            },
            {
                "id": "privacy",
                "nome": "Pellicole Privacy e Design",
                "descrizione": "Pellicole satinate e decorative per privacy e design personalizzato. Numerose varianti di disegno e colorazioni.",
                "vantaggi": ["Design personalizzabile", "Privacy garantita", "Numerose finiture", "Aspetto professionale"],
            }
        ]
    }

# Stats endpoint
@api_router.get("/stats")
async def get_stats():
    return {
        "stats": [
            {"label": "Anni di Esperienza", "value": "40+"},
            {"label": "Mq Installati/Anno", "value": "100k+"},
            {"label": "Edifici Trattati", "value": "45.000+"},
            {"label": "Anni di Garanzia", "value": "10"}
        ]
    }

# ============== SEO AGENT ROUTES ==============

@api_router.post("/seo/analyze")
async def seo_analyze(req: SEOAnalyzeRequest):
    """Analyzer Agent: analizza contenuto per problemi SEO."""
    result = await analyze_content(req.content, req.url, req.page_type)
    # Save to DB
    doc = {
        "id": str(uuid.uuid4()),
        "type": "analyze",
        "input": req.model_dump(),
        "result": result,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.seo_reports.insert_one(doc)
    return {"status": "ok", "result": result}

@api_router.post("/seo/generate-meta")
async def seo_generate_meta(req: SEOMetaRequest):
    """Generator Agent: genera meta tags SEO."""
    result = await generate_meta(req.page_type, req.page_title, req.content, req.keywords)
    doc = {
        "id": str(uuid.uuid4()),
        "type": "meta",
        "input": req.model_dump(),
        "result": result,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.seo_reports.insert_one(doc)
    return {"status": "ok", "result": result}

@api_router.post("/seo/generate-content")
async def seo_generate_content(req: SEOContentRequest):
    """Generator Agent: genera contenuto SEO completo."""
    result = await generate_content(req.topic, req.page_type, req.target_keywords)
    doc = {
        "id": str(uuid.uuid4()),
        "type": "content",
        "input": req.model_dump(),
        "result": result,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.seo_reports.insert_one(doc)
    return {"status": "ok", "result": result}

@api_router.post("/seo/local")
async def seo_local(req: SEOLocalRequest):
    """Local SEO Agent: genera contenuto per posizionamento locale."""
    result = await generate_local_seo(req.city)
    doc = {
        "id": str(uuid.uuid4()),
        "type": "local",
        "input": req.model_dump(),
        "result": result,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.seo_reports.insert_one(doc)
    return {"status": "ok", "result": result}

@api_router.post("/seo/orchestrate")
async def seo_orchestrate(req: SEOOrchestrateRequest):
    """Orchestrator: pianifica ed esegue workflow SEO multi-agente."""
    result = await orchestrate(req.request_type, req.details)
    doc = {
        "id": str(uuid.uuid4()),
        "type": "orchestrate",
        "input": req.model_dump(),
        "result": result,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.seo_reports.insert_one(doc)
    return {"status": "ok", "result": result}

@api_router.post("/seo/bulk-meta")
async def seo_bulk_meta(req: SEOBulkRequest):
    """Genera meta tags per più pagine in batch."""
    results = []
    for page in req.pages:
        result = await generate_meta(
            page.get("page_type", "generic"),
            page.get("page_title", ""),
            page.get("content", ""),
            page.get("keywords")
        )
        results.append({"page": page.get("page_title", ""), "result": result})
    doc = {
        "id": str(uuid.uuid4()),
        "type": "bulk_meta",
        "count": len(req.pages),
        "results": results,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.seo_reports.insert_one(doc)
    return {"status": "ok", "results": results}

@api_router.get("/seo/reports")
async def seo_get_reports(limit: int = 20):
    """Recupera gli ultimi report SEO generati."""
    reports = await db.seo_reports.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return {"reports": reports}

# ============== ROBOTS.TXT ==============
@api_router.get("/robots.txt")
async def robots_txt():
    content = """User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://www.solarisfilms.it/api/sitemap.xml
"""
    return Response(content=content, media_type="text/plain")

# ============== SITEMAP.XML ==============
@api_router.get("/sitemap.xml")
async def generate_sitemap():
    base = "https://www.solarisfilms.it"
    urls = [
        ("", "1.0", "daily"),
        ("/servizi", "0.9", "weekly"),
        ("/prodotti", "0.9", "weekly"),
        ("/chi-siamo", "0.8", "monthly"),
        ("/contatti", "0.8", "monthly"),
        ("/preventivo", "0.8", "monthly"),
        ("/guida-tecnica", "0.8", "weekly"),
        ("/blog", "0.7", "weekly"),
        ("/profilo-solaris", "0.7", "monthly"),
        ("/servizio-locale", "0.7", "weekly"),
        ("/info", "0.7", "weekly"),
        ("/focus-tecnico", "0.7", "weekly"),
        ("/privacy-policy", "0.3", "yearly"),
    ]
    citta = [
        "roma", "milano", "firenze", "torino", "napoli", "bologna", "genova", "venezia",
        "palermo", "verona", "parma", "padova", "brescia", "modena", "prato", "reggio-emilia",
        "perugia", "rimini", "cagliari", "bergamo", "vicenza", "trieste"
    ]
    for c in citta:
        urls.append((f"/servizio-locale/{c}", "0.6", "monthly"))
    info_slugs = [
        "norme-en-12600", "testo-unico-sicurezza", "dpr-59-09", "ecobonus-pellicole",
        "certificazione-brc", "garanzia-madico", "normativa-pellicole-auto",
        "come-funzionano-pellicole", "vantaggi-pellicole-antisolari", "manutenzione-pellicole"
    ]
    for s in info_slugs:
        urls.append((f"/info/{s}", "0.6", "monthly"))
    focus_slugs = [
        "pellicole-antisolari-sputtered", "pellicole-antisolari-sunscape", "pellicole-oscuranti-per-vetri",
        "pellicole-spettro-selettive", "pellicole-riflettenti", "pellicole-antisolari-stampabili-e-vetrofanie",
        "pellicole-decorative-privacy", "pellicole-antisolari-di-sicurezza-la-serie-rs",
        "pellicole-di-sicurezza-neutre-la-serie-cl", "pellicole-di-sicurezza-antiesplosione-la-serie-safetyshield",
        "pellicole-anti-uv", "pellicole-anti-graffiti", "pellicole-basso-emissive",
        "pellicole-anti-piccioni", "pellicole-per-serre"
    ]
    for s in focus_slugs:
        urls.append((f"/focus-tecnico/{s}", "0.6", "monthly"))
    prodotti_slugs = [
        "madico-sb-20-e-ps-sr", "madico-sb-35-e-ps-sr", "tecnosolar-nt-20-e-ps-sr",
        "madico-sg-20-e-ps-sr", "madico-sl-8-e-ps-sr", "tecnosolar-ssn-50-te-sr",
        "madico-rs-20-e-ps-sr", "madico-rs-40-e-ps-sr", "madico-rs-20-ps-sr-4mil",
        "madico-rs-20-ps-sr-8mil", "madico-rs-40-ps-sr-4mil", "madico-rs-40-ps-sr-8mil",
        "madico-cl-400-ps-sr", "madico-cl-400-e-ps-sr", "madico-cl-700-ps-sr",
        "madico-cl-700-e-ps-sr", "madico-safetyshield-800", "madico-safetyshield-1500",
        "madico-gullwing", "madico-mt-200-xw", "vetrofanie"
    ]
    for s in prodotti_slugs:
        urls.append((f"/prodotti/{s}", "0.7", "monthly"))

    xml_entries = []
    for path, priority, changefreq in urls:
        xml_entries.append(f"""  <url>
    <loc>{base}{path}</loc>
    <changefreq>{changefreq}</changefreq>
    <priority>{priority}</priority>
  </url>""")

    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(xml_entries)}
</urlset>"""
    return Response(content=xml, media_type="application/xml")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
