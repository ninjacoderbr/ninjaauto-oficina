// App.js - NinjaAuto Oficina Service Calculator and Booking logic

document.addEventListener('DOMContentLoaded', () => {
  // Simulator Elements
  const carTypeSelect = document.getElementById('car-type');
  const serviceCheckboxes = document.querySelectorAll('.service-checkbox');
  const summaryList = document.getElementById('summary-items');
  const totalAmountEl = document.getElementById('total-amount');

  // Scheduler Elements
  const scheduleForm = document.getElementById('scheduler-form');
  const successAlert = document.getElementById('success-alert');

  // Base Prices for Services
  const servicePrices = {
    alignment: 150.00,
    oil: 220.00,
    brakes: 350.00,
    suspension: 600.00,
    diagnose: 120.00,
    electrical: 250.00
  };

  // Car Type Multipliers
  const carMultipliers = {
    hatch: 1.0,
    sedan: 1.1,
    suv: 1.25,
    pickup: 1.35,
    sport: 1.5
  };

  // Service Name Translations
  const serviceNames = {
    alignment: "Alinhamento e Balanceamento",
    oil: "Troca de Óleo e Filtros",
    brakes: "Manutenção de Freios",
    suspension: "Revisão de Suspensão",
    diagnose: "Diagnóstico Injeção Eletrônica",
    electrical: "Reparo de Parte Elétrica"
  };

  function updatePricing() {
    const selectedCar = carTypeSelect.value;
    const multiplier = carMultipliers[selectedCar] || 1.0;
    
    // Clear list
    summaryList.innerHTML = '';
    let total = 0;
    let anyChecked = false;

    // Check each checkbox
    serviceCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        anyChecked = true;
        const serviceKey = checkbox.value;
        const basePrice = servicePrices[serviceKey];
        const finalPrice = basePrice * multiplier;
        total += finalPrice;

        // Add to summary view
        const li = document.createElement('li');
        li.className = 'summary-item';
        li.innerHTML = `
          <span class="item-name">${serviceNames[serviceKey]}</span>
          <span class="item-price">R$ ${finalPrice.toFixed(2)}</span>
        `;
        summaryList.appendChild(li);
      }
    });

    // If no service selected
    if (!anyChecked) {
      const li = document.createElement('li');
      li.className = 'summary-item';
      li.style.justifyContent = 'center';
      li.style.color = '#a0a0ab';
      li.innerText = 'Selecione um ou mais serviços acima';
      summaryList.appendChild(li);
    }

    // Display total
    totalAmountEl.textContent = `R$ ${total.toFixed(2)}`;
  }

  // Add event listeners for simulator updates
  carTypeSelect.addEventListener('change', updatePricing);
  serviceCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updatePricing);
  });

  // Schedule Visit Handling
  if (scheduleForm) {
    scheduleForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('client-name').value;
      const phone = document.getElementById('client-phone').value;
      const date = document.getElementById('client-date').value;
      const time = document.getElementById('client-time').value;
      const carType = carTypeSelect.options[carTypeSelect.selectedIndex].text;

      // Prepare visual message
      successAlert.innerHTML = `
        <strong>Agendamento Confirmado!</strong><br>
        Obrigado, <strong>${name}</strong>. Seu veículo (${carType}) foi agendado para o dia <strong>${formatDate(date)}</strong> às <strong>${time}h</strong>.<br>
        Entraremos em contato no telefone ${phone} para confirmar.
      `;
      successAlert.style.display = 'block';

      // Reset Form (except car type, so calculator stays active)
      scheduleForm.reset();

      // Scroll to alert
      successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Auto-hide alert after 10 seconds
      setTimeout(() => {
        successAlert.style.display = 'none';
      }, 10000);
    });
  }

  // Date Formatting Helper
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }

  // Initialize
  updatePricing();
});
