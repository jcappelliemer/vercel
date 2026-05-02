import requests
import sys
import json
from datetime import datetime

class SolarisAPITester:
    def __init__(self, base_url="https://solaris-pro.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=30):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:200]
                })

            return success, response.json() if success and response.text else {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout after {timeout}s")
            self.failed_tests.append({"test": name, "error": "timeout"})
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({"test": name, "error": str(e)})
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        return self.run_test("Health Check", "GET", "health", 200)

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root Endpoint", "GET", "", 200)

    def test_services_endpoint(self):
        """Test services endpoint"""
        success, response = self.run_test("Services Endpoint", "GET", "services", 200)
        if success and 'services' in response:
            services = response['services']
            print(f"   Found {len(services)} services")
            expected_services = ['antisolari', 'safety-shield', 'sicurezza', 'privacy']
            found_services = [s['id'] for s in services]
            if all(service in found_services for service in expected_services):
                print("   ✅ All expected services found")
            else:
                print(f"   ⚠️  Missing services: {set(expected_services) - set(found_services)}")
        return success, response

    def test_stats_endpoint(self):
        """Test stats endpoint"""
        success, response = self.run_test("Stats Endpoint", "GET", "stats", 200)
        if success and 'stats' in response:
            stats = response['stats']
            print(f"   Found {len(stats)} stats")
            expected_values = ["40+", "100k+", "45.000+", "10"]
            found_values = [s['value'] for s in stats]
            if all(value in found_values for value in expected_values):
                print("   ✅ All expected stat values found")
            else:
                print(f"   ⚠️  Expected values: {expected_values}, Found: {found_values}")
        return success, response

    def test_quote_submission(self):
        """Test quote form submission"""
        test_data = {
            "nome": "Mario",
            "cognome": "Rossi",
            "email": "mario.rossi@test.com",
            "telefono": "+39 333 1234567",
            "ragione_sociale": "Test Company",
            "citta": "Roma",
            "tipo_pellicola": "antisolari",
            "messaggio": "Test message for quote request"
        }
        
        success, response = self.run_test("Quote Submission", "POST", "quote", 200, test_data)
        if success and 'id' in response:
            print(f"   ✅ Quote created with ID: {response['id']}")
        return success, response

    def test_contact_submission(self):
        """Test contact form submission"""
        test_data = {
            "nome": "Luigi",
            "cognome": "Verdi",
            "email": "luigi.verdi@test.com",
            "telefono": "+39 333 7654321",
            "messaggio": "Test message for contact request"
        }
        
        success, response = self.run_test("Contact Submission", "POST", "contact", 200, test_data)
        if success and 'id' in response:
            print(f"   ✅ Contact created with ID: {response['id']}")
        return success, response

    def test_chatbot(self):
        """Test chatbot functionality"""
        test_data = {
            "message": "Ciao, che tipo di pellicole avete?",
            "session_id": None
        }
        
        success, response = self.run_test("Chatbot", "POST", "chat", 200, test_data, timeout=60)
        if success and 'response' in response and 'session_id' in response:
            print(f"   ✅ Chatbot responded with session ID: {response['session_id']}")
            print(f"   Response preview: {response['response'][:100]}...")
        return success, response

    def test_blog_endpoint(self):
        """Test blog endpoint"""
        return self.run_test("Blog Endpoint", "GET", "blog", 200)

    def test_quotes_list(self):
        """Test quotes list endpoint"""
        return self.run_test("Quotes List", "GET", "quotes", 200)

def main():
    print("🚀 Starting Solaris Films API Tests")
    print("=" * 50)
    
    tester = SolarisAPITester()
    
    # Run all tests
    tests = [
        tester.test_health_check,
        tester.test_root_endpoint,
        tester.test_services_endpoint,
        tester.test_stats_endpoint,
        tester.test_quote_submission,
        tester.test_contact_submission,
        tester.test_chatbot,
        tester.test_blog_endpoint,
        tester.test_quotes_list,
    ]
    
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test failed with exception: {str(e)}")
            tester.failed_tests.append({"test": test.__name__, "error": str(e)})
    
    # Print summary
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            error_msg = failure.get('error', f"Expected {failure.get('expected')}, got {failure.get('actual')}")
            print(f"   - {failure['test']}: {error_msg}")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"\n📈 Success Rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())
