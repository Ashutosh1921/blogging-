import requests

url = "http://localhost:8001/api/v1/login/access-token"
data = {
    "username": "admin",
    "password": "adminpassword"
}
headers = {
    "accept": "application/json",
    # requests handles form-urlencoded automatically when data is a dict
}

try:
    response = requests.post(url, data=data, headers=headers)
    print(f"Status: {response.status_code}")
    print(response.text)
except Exception as e:
    print(e)
