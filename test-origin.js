
// Teste direto no console do navegador
console.log('Testing Origin header...');
console.log('window.location.origin:', window.location.origin);

// Simular a criação de headers como no client.ts
const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

if (typeof window !== 'undefined' && window.location) {
    headers['Origin'] = window.location.origin;
}

console.log('Headers que seriam enviados:', headers);

// Fazer uma requisição de teste
fetch('http://localhost:8000/api/public/shorten', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({original_url: 'https://test.com'})
}).then(response => {
    console.log('Response headers:', [...response.headers.entries()]);
    return response.json();
}).then(data => {
    console.log('Response data:', data);
}).catch(error => {
    console.error('Error:', error);
});

