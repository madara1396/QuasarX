document.addEventListener('DOMContentLoaded', () => {

    // Supabase
    const supabaseUrl = 'https://hklovscnortoghbyzhkz.supabase.co'; // Replace with your actual URL
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrbG92c2Nub3J0b2doYnl6aGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NDE2ODcsImV4cCI6MjA2MzIxNzY4N30.KJF_U7FWZ2cV959ZWRNwPC_ZyUK4CvRzPFnvkj4B-sk'; // Replace with your anon key
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);


    // Form elements
    const form = document.getElementById('registrationForm');
    const formSteps = document.querySelectorAll('.form-step');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const successToast = document.getElementById('successToast');
    const progressLineActive = document.getElementById('progressLineActive');
    const stepsContainer = document.querySelector('.steps-container');
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
  
    // Form fields
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const genderInputs = document.querySelectorAll('input[name="gender"]');
  
    // Confirmation fields
    const confirmationGreeting = document.getElementById('confirmationGreeting');
    const confirmationEmail = document.getElementById('confirmationEmail');
    const confirmationPhone = document.getElementById('confirmationPhone');
    const confirmationGender = document.getElementById('confirmationGender');
    const confirmationCloseBtn = document.getElementById('confirmationCloseBtn');
  
    // Error message elements
    const firstNameError = document.getElementById('firstNameError');
    const lastNameError = document.getElementById('lastNameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const genderError = document.getElementById('genderError');
  
    // Step information
    const steps = [
      {
        title: 'Personal Information',
        fields: ['firstName', 'lastName'],
        icon: 'person',
      },
      {
        title: 'Contact Details',
        fields: ['email', 'phone'],
        icon: 'envelope',
      },
      {
        title: 'Additional Information',
        fields: ['gender'],
        icon: 'shield',
      },
    ];
  
    let currentStep = 0;
  
    // Create step circles
    function createStepCircles() {
      steps.forEach((step, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'position-relative';
        
        const circle = document.createElement('div');
        circle.className = `step-circle ${index === 0 ? 'step-circle-active' : 'step-circle-inactive'}`;
        circle.id = `step-circle-${index}`;
        circle.innerHTML = `<i class="bi bi-${step.icon}"></i>`;
        
        const label = document.createElement('div');
        label.className = `step-label ${index === 0 ? 'step-label-active' : ''}`;
        label.id = `step-label-${index}`;
        label.textContent = step.title;
        
        stepDiv.appendChild(circle);
        stepDiv.appendChild(label);
        stepsContainer.appendChild(stepDiv);
      });
  
      updateProgressBar();
    }
  
    // Update progress bar
    function updateProgressBar() {
      const progress = (currentStep / (steps.length - 1)) * 100;
      progressLineActive.style.width = `${progress}%`;
    }
  
    // Update step indicators
    function updateStepIndicators() {
      steps.forEach((_, index) => {
        const circle = document.getElementById(`step-circle-${index}`);
        const label = document.getElementById(`step-label-${index}`);
        
        if (index === currentStep) {
          circle.className = 'step-circle step-circle-active';
          label.className = 'step-label step-label-active';
        } else if (index < currentStep) {
          circle.className = 'step-circle step-circle-completed';
          circle.innerHTML = '<i class="bi bi-check"></i>';
          label.className = 'step-label step-label-completed';
        } else {
          circle.className = 'step-circle step-circle-inactive';
          circle.innerHTML = `<i class="bi bi-${steps[index].icon}"></i>`;
          label.className = 'step-label';
        }
      });
    }
  
    // Show step
    function showStep(stepIndex) {
      formSteps.forEach((step, index) => {
        if (index === stepIndex) {
          step.classList.remove('d-none');
        } else {
          step.classList.add('d-none');
        }
      });
  
      // Update buttons
      if (stepIndex === 0) {
        prevBtn.classList.add('d-none');
      } else {
        prevBtn.classList.remove('d-none');
      }
  
      if (stepIndex === steps.length - 1) {
        nextBtn.classList.add('d-none');
        submitBtn.classList.remove('d-none');
      } else {
        nextBtn.classList.remove('d-none');
        submitBtn.classList.add('d-none');
      }
  
      // Update step indicators and progress bar
      updateStepIndicators();
      updateProgressBar();
    }
  
    // Validate step
    function validateStep(stepIndex) {
      const stepFields = steps[stepIndex].fields;
      let isValid = true;
      
      if (stepFields.includes('firstName')) {
        if (firstName.value.trim().length < 2) {
          firstNameError.textContent = 'First name must be at least 2 characters';
          firstName.classList.add('is-invalid');
          isValid = false;
        } else {
          firstNameError.textContent = '';
          firstName.classList.remove('is-invalid');
        }
      }
      
      if (stepFields.includes('lastName')) {
        if (lastName.value.trim().length < 2) {
          lastNameError.textContent = 'Last name must be at least 2 characters';
          lastName.classList.add('is-invalid');
          isValid = false;
        } else {
          lastNameError.textContent = '';
          lastName.classList.remove('is-invalid');
        }
      }
      
      if (stepFields.includes('email')) {
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
          emailError.textContent = 'Please enter a valid email address';
          email.classList.add('is-invalid');
          isValid = false;
        } else {
          emailError.textContent = '';
          email.classList.remove('is-invalid');
        }
      }
      
      if (stepFields.includes('phone')) {
        if (phone.value.trim().length < 10) {
          phoneError.textContent = 'Phone number must be at least 10 digits';
          phone.classList.add('is-invalid');
          isValid = false;
        } else {
          phoneError.textContent = '';
          phone.classList.remove('is-invalid');
        }
      }
      
      if (stepFields.includes('gender')) {
        const selectedGender = document.querySelector('input[name="gender"]:checked');
        if (!selectedGender) {
          genderError.textContent = 'Please select your gender';
          genderError.style.display = 'block';
          isValid = false;
        } else {
          genderError.textContent = '';
          genderError.style.display = 'none';
        }
      }
      
      return isValid;
    }
  
    // Update confirmation modal with user data
    function updateConfirmationModal() {
      // Set user greeting
      confirmationGreeting.textContent = `Hello ${firstName.value},`;
      
      // Set contact details
      confirmationEmail.textContent = email.value;
      confirmationPhone.textContent = phone.value;
      
      // Set gender (capitalize first letter)
      const selectedGender = document.querySelector('input[name="gender"]:checked').value;
      confirmationGender.textContent = selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1);
    }
  
    // Handle form reset after confirmation
    function resetForm() {
      form.reset();
      currentStep = 0;
      showStep(currentStep);
      
      // Reset form check cards
      document.querySelectorAll('.form-check-card').forEach(card => {
        card.classList.remove('selected');
      });
    }
  
    // Initialize
    createStepCircles();
    showStep(currentStep);
  
    // Event handlers for form navigation
    prevBtn.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    });
  
    nextBtn.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        if (currentStep < steps.length - 1) {
          currentStep++;
          showStep(currentStep);
        }
      }
    });
  
    // Handle gender selection visually
    genderInputs.forEach(input => {
      input.addEventListener('change', () => {
        document.querySelectorAll('.form-check-card').forEach(card => {
          card.classList.remove('selected');
        });
        if (input.checked) {
          input.closest('.form-check-card').classList.add('selected');
        }
      });
    });
  
    // Handle confirmation close button click
    confirmationCloseBtn.addEventListener('click', resetForm);
  
    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
        if (validateStep(currentStep)) {
            // Disable submit button and show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Processing...';

            const genderValue = document.querySelector('input[name="gender"]:checked')?.value;

            // Send data to Supabase
            const { data, error } = await supabase
                .from('registrations')
                .insert([{
                first_name: firstName.value,
                last_name: lastName.value,
                email: email.value,
                phone: phone.value,
                gender: genderValue
                }]);

            if (error) {
                alert('Failed to submit: ' + error.message);
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Complete Registration<i class="bi bi-shield ms-2"></i>';
                return;
            }

            // Delay post-submission actions
            setTimeout(() => {
            // Show success toast
            const toastInstance = new bootstrap.Toast(successToast);
            toastInstance.show();

            // Update and show confirmation modal
            updateConfirmationModal();
            confirmationModal.show();

            // Reset and re-enable form and button
            resetForm();
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Complete Registration<i class="bi bi-shield ms-2"></i>';

            // Log submission
            console.log('Data saved to Supabase:', data);
            console.log('Form submitted', {
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                phone: phone.value,
                gender: genderValue
                });
            }, 1500);
        }

    });
  });