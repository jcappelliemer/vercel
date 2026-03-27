from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage

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
    messaggio: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "nuovo"

class QuoteRequestCreate(BaseModel):
    nome: str
    cognome: str
    email: EmailStr
    telefono: str
    ragione_sociale: Optional[str] = None
    citta: str
    tipo_pellicola: str
    messaggio: Optional[str] = None

class ContactRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nome: str
    cognome: str
    email: EmailStr
    telefono: str
    messaggio: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactRequestCreate(BaseModel):
    nome: str
    cognome: str
    email: EmailStr
    telefono: str
    messaggio: str

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str

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

# ============== CHATBOT SYSTEM MESSAGE ==============

CHATBOT_SYSTEM_MESSAGE = """Sei l'assistente virtuale di Solaris Films, azienda leader in Italia per pellicole per vetri.

INFORMAZIONI AZIENDALI:
- 40 anni di esperienza nel settore
- Distributore esclusivo MADICO USA per Italia e Spagna
- Oltre 45.000 edifici trattati
- Certificazione ISO 9001
- Garanzia fino a 10 anni

PRODOTTI PRINCIPALI:
1. PELLICOLE ANTISOLARI: Riducono il calore fino a 7-8°C, risparmio energetico 30-50%, protezione UV 99%
2. PELLICOLE DI SICUREZZA: Certificate UNI EN 12600, anti-sfondamento, protezione da schegge
3. PELLICOLE PRIVACY/DESIGN: Satinate, decorative, personalizzabili
4. PELLICOLE LCD SWITCH: Da opaca a trasparente con un interruttore
5. PELLICOLE FOTOCROMATICHE: Si scuriscono automaticamente con la luce solare

VANTAGGI:
- Nessun lavoro strutturale invasivo
- Installazione rapida senza interrompere attività
- Conformità D.Lgs. 81/2008 per sicurezza sul lavoro
- Migliore efficienza energetica edifici

REFERENZE: Banca d'Italia, EUR Spa, Università di Bologna, Aeroporto di Bologna, Ministero dell'Interno, CNR, e molti altri.

ISTRUZIONI:
- Rispondi sempre in italiano in modo professionale ma cordiale
- Suggerisci di richiedere un preventivo gratuito per informazioni specifiche sui prezzi
- Per urgenze, invita a chiamare o usare WhatsApp
- Mantieni risposte concise ma complete (max 3-4 frasi)
- Se non sai qualcosa, ammettilo e suggerisci di contattare l'azienda"""

# ============== API ROUTES ==============

@api_router.get("/")
async def root():
    return {"message": "Solaris Films API", "status": "online"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Quote/Preventivo endpoints
@api_router.post("/quote", response_model=QuoteRequest)
async def create_quote(input: QuoteRequestCreate):
    quote_obj = QuoteRequest(**input.model_dump())
    doc = quote_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.quotes.insert_one(doc)
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
async def create_contact(input: ContactRequestCreate):
    contact_obj = ContactRequest(**input.model_dump())
    doc = contact_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contacts.insert_one(doc)
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
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.chat_history.insert_one(chat_doc)
        
        return ChatResponse(response=response, session_id=session_id)
    except Exception as e:
        logging.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

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
                "descrizione": "Riducono drasticamente il passaggio di calore, bloccando fino al 99% dei raggi UV e riducendo le temperature interne fino a 7-8°C.",
                "vantaggi": ["Risparmio energetico 30-50%", "Protezione UV 99%", "Riduzione abbagliamento", "Garanzia 10 anni"],
                "immagine": "https://images.unsplash.com/photo-1761706885595-02fdd9fe91bb?w=800"
            },
            {
                "id": "sicurezza",
                "nome": "Pellicole di Sicurezza",
                "descrizione": "Certificate UNI EN 12600, trasformano qualsiasi vetro in vetro di sicurezza, proteggendo da schegge e intrusioni.",
                "vantaggi": ["Certificazione UNI EN 12600", "Anti-sfondamento", "Conformità D.Lgs. 81/2008", "Protezione antiesplosione"],
                "immagine": "https://images.unsplash.com/photo-1674829763557-19283dbde6e5?w=800"
            },
            {
                "id": "privacy",
                "nome": "Pellicole Privacy e Design",
                "descrizione": "Pellicole satinate e decorative per privacy e design personalizzato. Numerose varianti di disegno e colorazioni.",
                "vantaggi": ["Design personalizzabile", "Privacy garantita", "Numerose finiture", "Aspetto professionale"],
                "immagine": "https://images.pexels.com/photos/1098982/pexels-photo-1098982.jpeg?w=800"
            },
            {
                "id": "lcd-switch",
                "nome": "Pellicole LCD Switch",
                "descrizione": "Tecnologia rivoluzionaria: da opaca a trasparente con un interruttore. Controllabile da smartphone o comando vocale.",
                "vantaggi": ["Controllo smartphone", "Proiezione 4K", "Privacy modulabile", "Effetto WOW"],
                "immagine": "https://images.pexels.com/photos/5213546/pexels-photo-5213546.jpeg?w=800"
            },
            {
                "id": "fotocromatiche",
                "nome": "Pellicole Fotocromatiche",
                "descrizione": "Si scuriscono automaticamente con la luce solare, senza elettricità. Protezione adattiva intelligente.",
                "vantaggi": ["Automatiche", "Zero elettricità", "Adattive", "Innovazione"],
                "immagine": "https://images.unsplash.com/photo-1719437354892-f64ea7e03d4e?w=800"
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
