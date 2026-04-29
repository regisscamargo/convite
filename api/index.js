const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Array para armazenar respostas
let respostas = [];

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Rota para registrar resposta
app.post('/api/send-email', async (req, res) => {
    try {
        const { restaurant, date, time, fullDateTime } = req.body;

        // Validação
        if (!restaurant || !date || !time) {
            return res.status(400).json({ error: 'Dados incompletos' });
        }

        // Armazenar resposta com timestamp
        const novaResposta = {
            id: respostas.length + 1,
            restaurant,
            date,
            time,
            fullDateTime,
            timestamp: new Date().toLocaleString('pt-BR')
        };
        respostas.push(novaResposta);

        console.log('✅ Nova resposta registrada:', novaResposta);

        res.json({ 
            success: true, 
            message: 'Resposta registrada com sucesso!',
            data: { restaurant, fullDateTime }
        });

    } catch (error) {
        console.error('Erro ao registrar resposta:', error);
        res.status(500).json({ 
            success: false,
            error: 'Erro ao registrar resposta: ' + error.message 
        });
    }
});

// Rota para acessar a agenda
app.get('/agenda', (req, res) => {
    let agendaHTML = '';
    
    if (respostas.length > 0) {
        agendaHTML = respostas.map(r => 
            '<div class="agenda-item">' +
            '<h3>🍽️ ' + r.restaurant + '</h3>' +
            '<p class="time">' + r.fullDateTime + '</p>' +
            '<p><strong>Data:</strong> ' + r.date + '</p>' +
            '<p><strong>Horário:</strong> ' + r.time + '</p>' +
            '<p class="registro">📝 Registrado em: ' + r.timestamp + '</p>' +
            '</div>'
        ).join('');
    } else {
        agendaHTML = '<div class="empty">Nenhuma resposta registrada ainda... 😢</div>';
    }

    const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Agenda - Camila Convite</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                    padding: 40px 20px;
                }

                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                }

                h1 {
                    color: #667eea;
                    margin-bottom: 30px;
                    text-align: center;
                    font-size: 2rem;
                }

                .agenda-list {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .agenda-item {
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
                    padding: 20px;
                    border-left: 4px solid #667eea;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .agenda-item h3 {
                    color: #667eea;
                    margin-bottom: 10px;
                    font-size: 1.3rem;
                }

                .agenda-item p {
                    color: #555;
                    margin: 5px 0;
                    font-size: 0.95rem;
                }

                .time {
                    font-size: 1.1rem;
                    color: #764ba2;
                    font-weight: bold;
                }

                .registro {
                    font-size: 0.85rem;
                    color: #999;
                    margin-top: 10px;
                    font-weight: bold;
                }

                .empty {
                    text-align: center;
                    color: #999;
                    padding: 40px;
                    font-size: 1.1rem;
                }

                .stats {
                    background: #667eea;
                    color: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    text-align: center;
                    margin-bottom: 30px;
                    font-size: 1.1rem;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📅 Agenda de Encontros</h1>
                
                <div class="stats">
                    ${respostas.length} resposta(s) registrada(s)
                </div>

                <div class="agenda-list">
                    ${agendaHTML}
                </div>
            </div>
        </body>
        </html>
    `;
    res.send(html);
});

// Rota para testar conexão
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor rodando!' });
});

// Servir o arquivo principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

module.exports = app;
