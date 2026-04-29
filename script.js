// Estado da aplicação
let appState = {
    selectedRestaurant: null,
    selectedDate: null,
    selectedTime: null,
    selectedDateTime: null
};

// Elementos do DOM
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const restaurantModal = document.getElementById('restaurant-modal');
const calendarModal = document.getElementById('calendar-modal');
const initialPage = document.getElementById('initial-page');
const successPage = document.getElementById('success-page');
const resetBtn = document.getElementById('reset-btn');
const restaurantCards = document.querySelectorAll('.restaurant-card');
const closeCalendarBtn = document.getElementById('close-calendar');
const poloImage = document.getElementById('polo-image');
const loadingOverlay = document.getElementById('loading-overlay');
const successMessage = document.getElementById('success-message');
const successDateTime = document.getElementById('success-datetime');
const calendarContainer = document.getElementById('calendar-container');

// Botão NÃO - Muda de posição quando tenta clicar
noBtn.addEventListener('mouseenter', moveNoButton);
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
});

function moveNoButton() {
    const maxX = Math.max(window.innerWidth - noBtn.offsetWidth - 20, 20);
    const maxY = Math.max(window.innerHeight - noBtn.offsetHeight - 20, 20);
    const safeTop = Math.max(window.scrollY + 20, 20);
    
    const randomX = Math.random() * maxX;
    const randomY = safeTop + Math.random() * Math.max(maxY - safeTop, 20);
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    noBtn.style.zIndex = '999';
}

// Botão SIM
yesBtn.addEventListener('click', () => {
    initialPage.classList.remove('active');
    restaurantModal.classList.add('active');
});

// Seleção de Restaurante
restaurantCards.forEach(card => {
    card.addEventListener('click', () => {
        restaurantCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        appState.selectedRestaurant = card.dataset.restaurant;
        
        // Aguardar um pouco antes de fechar o modal
        setTimeout(() => {
            restaurantModal.classList.remove('active');
            generateCalendar();
            calendarModal.classList.add('active');
        }, 500);
    });
});

// Fechar calendário
closeCalendarBtn.addEventListener('click', () => {
    calendarModal.classList.remove('active');
});

// Gerar Calendário
function generateCalendar() {
    calendarContainer.innerHTML = '';
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const availableDays = [4, 14, 15, 16, 17, 18, 19];

    // Datas específicas do mês atual
    for (const day of availableDays) {
        const date = new Date(currentYear, currentMonth, day);
        
        const dayName = getDayName(date.getDay());
        const dayLabel = document.createElement('div');
        dayLabel.className = 'day-label';
        dayLabel.textContent = `${dayName} (${date.toLocaleDateString('pt-BR')})`;
        calendarContainer.appendChild(dayLabel);
        
        // Horários: 19h até 22h
        for (let hour = 19; hour <= 22; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = `${hour}:00`;
            timeSlot.dataset.date = date.toISOString().split('T')[0];
            timeSlot.dataset.time = `${hour}:00`;
            timeSlot.dataset.fullDate = date.toLocaleDateString('pt-BR');
            
            timeSlot.addEventListener('click', () => {
                document.querySelectorAll('.time-slot').forEach(slot => {
                    slot.classList.remove('selected');
                });
                timeSlot.classList.add('selected');
                appState.selectedTime = timeSlot.dataset.time;
                appState.selectedDate = timeSlot.dataset.date;
                appState.selectedDateTime = `${timeSlot.dataset.fullDate} às ${appState.selectedTime}`;
            });
            
            calendarContainer.appendChild(timeSlot);
        }
    }
    
    // Botão de confirmar no final
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Confirmar Data e Hora ✓';
    confirmBtn.className = 'btn btn-secondary';
    confirmBtn.style.gridColumn = '1 / -1';
    confirmBtn.style.marginTop = '20px';
    
    confirmBtn.addEventListener('click', () => {
        if (appState.selectedTime) {
            confirmSelection();
        } else {
            alert('Por favor, selecione um horário!');
        }
    });
    
    calendarContainer.appendChild(confirmBtn);
}

function getDayName(dayIndex) {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[dayIndex];
}

// Confirmar seleção e enviar email
async function confirmSelection() {
    calendarModal.classList.remove('active');
    
    // Mostrar página de sucesso
    initialPage.classList.remove('active');
    successPage.classList.add('active');
    
    // Atualizar mensagem de sucesso
    successDateTime.textContent = appState.selectedDateTime;
    successMessage.textContent = `Local: ${appState.selectedRestaurant}`;
    successMessage.style.display = 'block';
    
    // Enviar email após 2 segundos
    setTimeout(() => {
        sendEmail();
    }, 2000);
}

// Função para enviar email
async function sendEmail() {
    const emailData = {
        restaurant: appState.selectedRestaurant,
        date: appState.selectedDate,
        time: appState.selectedTime,
        fullDateTime: appState.selectedDateTime
    };
    
    try {
        // Tentar enviar via API do servidor
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Email enviado com sucesso!');
            console.log('Restaurante: ' + appState.selectedRestaurant);
            console.log('Data: ' + appState.selectedDateTime);
        } else {
            console.warn('⚠️ Erro ao enviar email:', result.error);
            // Mesmo com erro, mostrar página de sucesso
        }
        
    } catch (error) {
        console.error('❌ Erro ao conectar com servidor:', error);
        console.log('💡 Dica: Certifique-se de que o servidor está rodando com: npm start');
        // Mesmo com erro, mostrar página de sucesso (funcionalidade offline)
    }
}

// Botão de Recomeçar
resetBtn.addEventListener('click', () => {
    appState = {
        selectedRestaurant: null,
        selectedDate: null,
        selectedTime: null,
        selectedDateTime: null
    };
    
    noBtn.style.position = 'relative';
    noBtn.style.left = 'auto';
    noBtn.style.top = 'auto';
    noBtn.style.zIndex = 'auto';
    
    restaurantCards.forEach(card => card.classList.remove('selected'));
    document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
    
    successPage.classList.remove('active');
    initialPage.classList.add('active');
    
    // Reinicializar overlay de carregamento
    loadingOverlay.style.animation = 'none';
    setTimeout(() => {
        loadingOverlay.style.animation = 'fadeOut 3s ease-in-out forwards';
    }, 10);
});

// Inicializar
window.addEventListener('load', () => {
    console.log('Site carregado! 💕');
});
