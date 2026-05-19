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
const confirmationModal = document.getElementById('confirmation-modal');
const confirmBtn = document.getElementById('confirm-btn');
const cancelConfirmBtn = document.getElementById('cancel-confirm-btn');
const confirmDatetimeText = document.getElementById('confirm-datetime');

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

// Botão SIM: abrir modal de confirmação com mensagem fixa
yesBtn.addEventListener('click', () => {
    // Preparar seleção automática (estado interno)
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const autoDate = new Date(currentYear, currentMonth, 21);

    const firstRestaurant = document.querySelector('.restaurant-card');
    appState.selectedRestaurant = firstRestaurant ? firstRestaurant.dataset.restaurant : 'Restaurante a combinar';
    appState.selectedDate = autoDate.toISOString().split('T')[0];
    appState.selectedTime = '20:00';
    appState.selectedDateTime = `${autoDate.toLocaleDateString('pt-BR')} às ${appState.selectedTime}`;

    // Atualizar interface: mostrar modal de confirmação
    initialPage.classList.remove('active');
    confirmationModal.classList.add('active');
    // Atualizar texto do modal
    confirmDatetimeText.textContent = `Dia 21 às 20:00 — passarei te pegar!`;
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
    // Disponibilizar somente o dia 21 do mês atual
    const availableDays = [21];

    // Datas específicas do mês atual
    for (const day of availableDays) {
        const date = new Date(currentYear, currentMonth, day);
        
        const dayName = getDayName(date.getDay());
        const dayLabel = document.createElement('div');
        dayLabel.className = 'day-label';
        dayLabel.textContent = `${dayName} (${date.toLocaleDateString('pt-BR')})`;
        calendarContainer.appendChild(dayLabel);
        
        // Horário único: 20h
        for (let hour = 20; hour <= 20; hour++) {
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
    
    // Pré-selecionar o único horário disponível (se existir)
    const firstSlot = calendarContainer.querySelector('.time-slot');
    if (firstSlot) {
        firstSlot.classList.add('selected');
        appState.selectedTime = firstSlot.dataset.time;
        appState.selectedDate = firstSlot.dataset.date;
        appState.selectedDateTime = `${firstSlot.dataset.fullDate} às ${appState.selectedTime}`;
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
    // Fixed final location text as requested
    successMessage.textContent = 'Local: minha casa e vá cheirosa pq to na maldade';
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

// Note: reset button was removed from UI; no reset handler needed.

// Confirmar dentro do modal
if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
        const poloAnim = document.getElementById('confirm-polo');
        // start walking animation
        if (poloAnim) {
            poloAnim.style.left = '0';
            poloAnim.classList.add('walking');
        }
        // disable buttons while animating
        confirmBtn.disabled = true;
        if (cancelConfirmBtn) cancelConfirmBtn.disabled = true;

        // wait 3s for animation then confirm
        setTimeout(() => {
            if (poloAnim) poloAnim.classList.remove('walking');
            confirmationModal.classList.remove('active');
            // re-enable
            confirmBtn.disabled = false;
            if (cancelConfirmBtn) cancelConfirmBtn.disabled = false;
            // call existing confirm flow
            confirmSelection();
        }, 3000);
    });
}

// Cancelar confirmação
if (cancelConfirmBtn) {
    cancelConfirmBtn.addEventListener('click', () => {
        confirmationModal.classList.remove('active');
        // Voltar para a tela inicial
        successPage.classList.remove('active');
        initialPage.classList.add('active');
    });
}

// Inicializar
window.addEventListener('load', () => {
    console.log('Site carregado! 💕');
});
