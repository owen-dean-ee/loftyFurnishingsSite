document.addEventListener('DOMContentLoaded', () => {
  console.log('Lofty Furnishing site loaded.');

  // Ambassador/Hiring Form Handling
  const hiringForm = document.getElementById('hiring-form');
  const formFeedback = document.getElementById('form-feedback');

  if (hiringForm) {
    hiringForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('full-name').value.trim();
      const email = document.getElementById('email-address').value.trim();
      const phone = document.getElementById('phone-number').value.trim();
      const earlyArrival = document.getElementById('campus-early').checked;
      
      // Basic client-side validation
      if (!name || !email || !phone) {
        showFeedback('Please fill out all required fields.', 'red');
        return;
      }

      if (!validateEmail(email)) {
        showFeedback('Please enter a valid email address.', 'red');
        return;
      }

      // Disable submit button while sending
      const submitBtn = document.getElementById('btn-submit-hiring');
      submitBtn.disabled = true;
      submitBtn.innerText = 'Submitting...';

      // Simulate API call to Firebase (which we will build in Phase 2)
      setTimeout(() => {
        console.log('Form Submitted:', { name, email, phone, earlyArrival });
        showFeedback('Thank you! Your application has been successfully submitted.', 'green');
        hiringForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerText = 'Submit Application';
      }, 1000);
    });
  }

  function showFeedback(message, color) {
    if (formFeedback) {
      formFeedback.innerText = message;
      formFeedback.style.color = color === 'green' ? 'hsl(140, 50%, 40%)' : 'hsl(0, 75%, 50%)';
      formFeedback.style.display = 'block';
    }
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
});
