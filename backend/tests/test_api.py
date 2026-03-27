"""
Backend API Tests for Solaris Films Website
Tests: Health, Quote, Contact, Chat, Services, Stats, Blog endpoints
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthEndpoint:
    """Health check endpoint tests"""
    
    def test_health_check(self):
        """Test /api/health returns healthy status"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        print("✓ Health check passed")

    def test_root_endpoint(self):
        """Test /api/ returns API info"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "online"
        assert "Solaris" in data["message"]
        print("✓ Root endpoint passed")


class TestQuoteEndpoint:
    """Quote/Preventivo endpoint tests"""
    
    def test_create_quote_success(self):
        """Test POST /api/quote creates a quote successfully"""
        quote_data = {
            "nome": "TEST_Mario",
            "cognome": "Rossi",
            "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
            "telefono": "+39 333 1234567",
            "ragione_sociale": "Test Company SRL",
            "citta": "Roma",
            "tipo_pellicola": "antisolari",
            "messaggio": "Test message for quote"
        }
        response = requests.post(f"{BASE_URL}/api/quote", json=quote_data)
        assert response.status_code == 200
        data = response.json()
        
        # Verify response data
        assert data["nome"] == quote_data["nome"]
        assert data["cognome"] == quote_data["cognome"]
        assert data["email"] == quote_data["email"]
        assert data["citta"] == quote_data["citta"]
        assert data["tipo_pellicola"] == quote_data["tipo_pellicola"]
        assert "id" in data
        assert data["status"] == "nuovo"
        print("✓ Create quote passed")
    
    def test_create_quote_minimal(self):
        """Test POST /api/quote with minimal required fields"""
        quote_data = {
            "nome": "TEST_Minimal",
            "cognome": "User",
            "email": f"minimal_{uuid.uuid4().hex[:8]}@test.com",
            "telefono": "123456789",
            "citta": "Milano",
            "tipo_pellicola": "sicurezza"
        }
        response = requests.post(f"{BASE_URL}/api/quote", json=quote_data)
        assert response.status_code == 200
        data = response.json()
        assert data["nome"] == quote_data["nome"]
        assert data["ragione_sociale"] is None  # Optional field
        print("✓ Create quote minimal passed")
    
    def test_create_quote_invalid_email(self):
        """Test POST /api/quote with invalid email returns error"""
        quote_data = {
            "nome": "TEST_Invalid",
            "cognome": "Email",
            "email": "not-an-email",
            "telefono": "123456789",
            "citta": "Firenze",
            "tipo_pellicola": "privacy"
        }
        response = requests.post(f"{BASE_URL}/api/quote", json=quote_data)
        assert response.status_code == 422  # Validation error
        print("✓ Invalid email validation passed")
    
    def test_get_quotes(self):
        """Test GET /api/quotes returns list of quotes"""
        response = requests.get(f"{BASE_URL}/api/quotes")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Get quotes passed - found {len(data)} quotes")


class TestContactEndpoint:
    """Contact endpoint tests"""
    
    def test_create_contact_success(self):
        """Test POST /api/contact creates a contact successfully"""
        contact_data = {
            "nome": "TEST_Contact",
            "cognome": "User",
            "email": f"contact_{uuid.uuid4().hex[:8]}@example.com",
            "telefono": "+39 333 9876543",
            "messaggio": "This is a test contact message"
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=contact_data)
        assert response.status_code == 200
        data = response.json()
        
        # Verify response data
        assert data["nome"] == contact_data["nome"]
        assert data["cognome"] == contact_data["cognome"]
        assert data["email"] == contact_data["email"]
        assert data["messaggio"] == contact_data["messaggio"]
        assert "id" in data
        assert "created_at" in data
        print("✓ Create contact passed")
    
    def test_create_contact_missing_fields(self):
        """Test POST /api/contact with missing required fields"""
        contact_data = {
            "nome": "TEST_Incomplete",
            "email": "incomplete@test.com"
            # Missing: cognome, telefono, messaggio
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=contact_data)
        assert response.status_code == 422  # Validation error
        print("✓ Missing fields validation passed")


class TestChatEndpoint:
    """Chat/AI endpoint tests"""
    
    def test_chat_success(self):
        """Test POST /api/chat returns AI response"""
        chat_data = {
            "message": "Ciao, quali pellicole offrite?",
            "session_id": None
        }
        response = requests.post(f"{BASE_URL}/api/chat", json=chat_data, timeout=30)
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "response" in data
        assert "session_id" in data
        assert len(data["response"]) > 0
        assert len(data["session_id"]) > 0
        print(f"✓ Chat success - response length: {len(data['response'])} chars")
    
    def test_chat_with_session(self):
        """Test POST /api/chat maintains session"""
        # First message
        chat_data = {"message": "Quanto costa una pellicola antisolare?"}
        response1 = requests.post(f"{BASE_URL}/api/chat", json=chat_data, timeout=30)
        assert response1.status_code == 200
        session_id = response1.json()["session_id"]
        
        # Second message with same session
        chat_data2 = {"message": "E per la sicurezza?", "session_id": session_id}
        response2 = requests.post(f"{BASE_URL}/api/chat", json=chat_data2, timeout=30)
        assert response2.status_code == 200
        assert response2.json()["session_id"] == session_id
        print("✓ Chat session continuity passed")


class TestServicesEndpoint:
    """Services endpoint tests"""
    
    def test_get_services(self):
        """Test GET /api/services returns service list"""
        response = requests.get(f"{BASE_URL}/api/services")
        assert response.status_code == 200
        data = response.json()
        
        assert "services" in data
        services = data["services"]
        assert len(services) == 5  # 5 service types
        
        # Verify service structure
        for service in services:
            assert "id" in service
            assert "nome" in service
            assert "descrizione" in service
            assert "vantaggi" in service
            assert isinstance(service["vantaggi"], list)
        
        # Verify specific services exist
        service_ids = [s["id"] for s in services]
        assert "antisolari" in service_ids
        assert "sicurezza" in service_ids
        assert "privacy" in service_ids
        assert "lcd-switch" in service_ids
        assert "fotocromatiche" in service_ids
        print("✓ Get services passed")


class TestStatsEndpoint:
    """Stats endpoint tests"""
    
    def test_get_stats(self):
        """Test GET /api/stats returns statistics"""
        response = requests.get(f"{BASE_URL}/api/stats")
        assert response.status_code == 200
        data = response.json()
        
        assert "stats" in data
        stats = data["stats"]
        assert len(stats) == 4  # 4 stat items
        
        # Verify stat structure
        for stat in stats:
            assert "label" in stat
            assert "value" in stat
        
        # Verify specific stats
        labels = [s["label"] for s in stats]
        assert "Anni di Esperienza" in labels
        print("✓ Get stats passed")


class TestBlogEndpoint:
    """Blog endpoint tests"""
    
    def test_get_blog_posts(self):
        """Test GET /api/blog returns blog posts"""
        response = requests.get(f"{BASE_URL}/api/blog")
        assert response.status_code == 200
        data = response.json()
        
        # Blog posts may be empty if none seeded
        assert isinstance(data, list)
        print(f"✓ Get blog posts passed - found {len(data)} posts")
    
    def test_get_blog_post_not_found(self):
        """Test GET /api/blog/{slug} returns 404 for non-existent post"""
        response = requests.get(f"{BASE_URL}/api/blog/non-existent-slug-12345")
        assert response.status_code == 404
        print("✓ Blog post not found passed")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
