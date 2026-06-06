document.addEventListener('DOMContentLoaded', () => {
  // 1. Parse URL parameters to confirm selected product
  const params = new URLSearchParams(window.location.search);
  const selectedProductKey = params.get('product') || 'espresso';
  
  const products = {
    espresso: { name: 'Espresso Cedar Loft', price: 250 },
    chestnut: { name: 'English Chestnut Cedar Loft', price: 250 },
    white: { name: 'Clean White Cedar Loft', price: 250 },
    bundle: { name: 'Roommate Loft Bundle', price: 450 }
  };

  const product = products[selectedProductKey] || products.espresso;

  // Update Summary Side Panel
  document.getElementById('summary-product-name').innerText = product.name;
  document.getElementById('summary-product-price').innerText = `$${product.price.toFixed(2)}`;
  document.getElementById('summary-total').innerText = `$${product.price.toFixed(2)}`;

  // 2. Calendar Generation (August 2026)
  const calendarContainer = document.getElementById('booking-calendar');
  const monthYearLabel = document.getElementById('calendar-month-year');
  
  // Settings for August 2026
  // August 1, 2026 is a Saturday (Index 6)
  const daysInMonth = 31;
  const startDayOfWeek = 6; 
  
  // Available booking range: August 15th to August 30th
  const bookingStart = 15;
  const bookingEnd = 30;

  let selectedDate = null;
  let selectedSlot = null;

  // Generate blank calendar slots for days of the week offset
  for (let i = 0; i < startDayOfWeek; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.classList.add('calendar-day', 'disabled');
    calendarContainer.appendChild(emptyDay);
  }

  // Generate calendar days
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('calendar-day');
    dayElement.innerText = day;

    // Enforce booking window constraint
    if (day < bookingStart || day > bookingEnd) {
      dayElement.classList.add('disabled');
    } else {
      dayElement.addEventListener('click', () => {
        // Toggle selected state
        document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
        dayElement.classList.add('selected');
        
        selectedDate = `August ${day}, 2026`;
        selectedSlot = null; // reset slot selection
        
        document.getElementById('summary-date').innerText = selectedDate;
        document.getElementById('summary-time').innerText = 'Not selected';
        
        // Show time slots
        showTimeSlots(day);
        validateFormState();
      });
    }
    
    calendarContainer.appendChild(dayElement);
  }

  // 3. Time Slots Populator
  const timeSlotSection = document.getElementById('time-slot-section');
  const selectedDateLabel = document.getElementById('selected-date-label');
  const slotsContainer = document.getElementById('booking-slots');

  function showTimeSlots(day) {
    selectedDateLabel.innerText = `August ${day}`;
    timeSlotSection.style.display = 'block';
    slotsContainer.innerHTML = ''; // Clear previous

    // Available 1-hour slots
    const slots = [
      '9:00 AM - 10:00 AM',
      '10:00 AM - 11:00 AM',
      '11:00 AM - 12:00 PM',
      '1:00 PM - 2:00 PM',
      '2:00 PM - 3:00 PM',
      '3:00 PM - 4:00 PM',
      '4:00 PM - 5:00 PM'
    ];

    slots.forEach((slot, index) => {
      const slotElement = document.createElement('div');
      slotElement.classList.add('time-slot');
      slotElement.innerText = slot;

      // Mock availability (say, slot index 2 is full on even days, index 4 is full on odd days)
      const isFull = (day % 2 === 0 && index === 2) || (day % 2 !== 0 && index === 4);
      
      if (isFull) {
        slotElement.classList.add('disabled');
        slotElement.title = 'Fully Booked';
      } else {
        slotElement.addEventListener('click', () => {
          document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
          slotElement.classList.add('selected');
          
          selectedSlot = slot;
          document.getElementById('summary-time').innerText = slot;
          validateFormState();
        });
      }

      slotsContainer.appendChild(slotElement);
    });
  }

  // 4. Form State Validation
  const detailsForm = document.getElementById('details-form');
  const checkoutBtn = document.getElementById('btn-stripe-checkout');
  const bookingFeedback = document.getElementById('booking-feedback');

  const inputs = detailsForm.querySelectorAll('input[required]');
  inputs.forEach(input => {
    input.addEventListener('input', validateFormState);
  });

  function validateFormState() {
    let allInputsFilled = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        allInputsFilled = false;
      }
    });

    const isSlotSelected = selectedDate !== null && selectedSlot !== null;
    
    // Enable checkout button if calendar is selected AND forms are filled
    if (allInputsFilled && isSlotSelected) {
      checkoutBtn.removeAttribute('disabled');
      bookingFeedback.style.display = 'none';
    } else {
      checkoutBtn.setAttribute('disabled', 'true');
    }
  }

  // 5. Checkout & Payment Redirect
  checkoutBtn.addEventListener('click', () => {
    // Gather details
    const studentName = document.getElementById('student-name').value.trim();
    const studentEmail = document.getElementById('student-email').value.trim();
    const studentPhone = document.getElementById('student-phone').value.trim();
    const dormHall = document.getElementById('dorm-hall').value.trim();
    const roomNumber = document.getElementById('room-number').value.trim();
    const notes = document.getElementById('order-notes').value.trim();

    checkoutBtn.disabled = true;
    checkoutBtn.innerText = 'Redirecting to Stripe...';

    // Simulate Stripe payment redirect & Firestore writing
    setTimeout(() => {
      // Create a mock order object to display or save
      const orderDetails = {
        product: product.name,
        price: product.price,
        date: selectedDate,
        time: selectedSlot,
        customer: {
          name: studentName,
          email: studentEmail,
          phone: studentPhone
        },
        delivery: {
          building: dormHall,
          room: roomNumber,
          notes: notes
        },
        paymentStatus: 'Paid via Stripe',
        transactionId: 'ch_' + Math.random().toString(36).substr(2, 9).toUpperCase()
      };

      // Store in localStorage temporarily for mock success page display
      localStorage.setItem('lastOrder', JSON.stringify(orderDetails));

      // Redirect to a local mock success page
      window.location.href = 'success.html';
    }, 1500);
  });
});
