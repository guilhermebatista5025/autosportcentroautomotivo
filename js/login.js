// Global state
let currentProfile = 'client'; // 'client' | 'admin'
let currentTab = 'login'; // 'login' | 'register'

// Redirect home
function goHome() {
  window.location.href = "../index.html";
}

// Toggle tabs (Login vs Register)
function switchTab(tab) {
  if (currentProfile === 'admin' && tab === 'register') {
    // Display admin restriction notice
    document.getElementById('tab-login').classList.remove('active');
    document.getElementById('tab-register').classList.add('active');
    
    document.getElementById('panel-login').classList.remove('active');
    document.getElementById('panel-register').classList.add('active');
    
    document.getElementById('form-register').style.display = 'none';
    document.getElementById('admin-reg-notice').style.display = 'block';
    currentTab = 'register';
    return;
  }

  currentTab = tab;

  // Active chips styling
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');

  // Toggle Panels
  document.getElementById('panel-login').classList.toggle('active', tab === 'login');
  document.getElementById('panel-register').classList.toggle('active', tab === 'register');

  // Reset signup warning
  document.getElementById('form-register').style.display = 'block';
  document.getElementById('admin-reg-notice').style.display = 'none';
}

// Switch profiles (Client vs Administrator)
function switchProfile(profile) {
  currentProfile = profile;

  // Chips toggle styling
  document.getElementById('profile-client').classList.toggle('active', profile === 'client');
  document.getElementById('profile-admin').classList.toggle('active', profile === 'admin');

  // Accessibility updates
  document.getElementById('profile-client').setAttribute('aria-checked', profile === 'client' ? 'true' : 'false');
  document.getElementById('profile-admin').setAttribute('aria-checked', profile === 'admin' ? 'true' : 'false');

  const emailLabel = document.getElementById('login-email-label');
  const titleText = document.getElementById('auth-title');
  const subtitleText = document.getElementById('auth-subtitle');

  if (profile === 'admin') {
    emailLabel.textContent = "Usuário Admin ou E-mail";
    titleText.textContent = "Painel do Admin";
    subtitleText.textContent = "Acesso exclusivo para administradores e gestores.";
    document.getElementById('admin-credentials-hint').style.display = 'flex';
    
    if (currentTab === 'register') {
      switchTab('register');
    }
  } else {
    emailLabel.textContent = "E-mail ou CPF";
    titleText.textContent = "Acesse sua Conta";
    subtitleText.textContent = "Insira suas credenciais para continuar.";
    document.getElementById('admin-credentials-hint').style.display = 'none';
    
    document.getElementById('form-register').style.display = 'block';
    document.getElementById('admin-reg-notice').style.display = 'none';
  }
}

// Password visibility control
function togglePasswordVisibility(fieldId) {
  const input = document.getElementById(fieldId);
  const btn = input.nextElementSibling.nextElementSibling; // eye button
  
  if (input.type === "password") {
    input.type = "text";
    btn.setAttribute('aria-label', 'Ocultar senha');
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
  } else {
    input.type = "password";
    btn.setAttribute('aria-label', 'Exibir senha');
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  }
}

// Masking controls
function maskPhone(input) {
  let v = input.value.replace(/\D/g, "");
  if (v.length > 11) v = v.substring(0, 11);
  
  if (v.length > 6) {
    input.value = `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7)}`;
  } else if (v.length > 2) {
    input.value = `(${v.substring(0, 2)}) ${v.substring(2)}`;
  } else {
    input.value = v;
  }
}

function maskCPF(input) {
  let v = input.value.replace(/\D/g, "");
  if (v.length > 11) v = v.substring(0, 11);
  
  if (v.length > 9) {
    input.value = `${v.substring(0, 3)}.${v.substring(3, 6)}.${v.substring(6, 9)}-${v.substring(9)}`;
  } else if (v.length > 6) {
    input.value = `${v.substring(0, 3)}.${v.substring(3, 6)}.${v.substring(6)}`;
  } else if (v.length > 3) {
    input.value = `${v.substring(0, 3)}.${v.substring(3)}`;
  } else {
    input.value = v;
  }
}

// Floating success/error messages
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const iconWrapper = document.getElementById('toast-icon-wrapper');
  const msgText = document.getElementById('toast-msg-text');

  msgText.textContent = message;
  
  iconWrapper.className = `toast-icon ${type}`;
  if (type === 'success') {
    iconWrapper.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  } else if (type === 'error') {
    iconWrapper.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
  } else {
    iconWrapper.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
  }

  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// Social simulation
function handleSocialSim(platform) {
  showToast(`Conectando com a conta ${platform}...`, 'warning');
  setTimeout(() => {
    showToast(`Acesso via ${platform} bem-sucedido!`, 'success');
    localStorage.setItem('user_session', JSON.stringify({
      name: `Cliente ${platform}`,
      email: `cliente_${platform.toLowerCase()}@social.com`
    }));
    setTimeout(() => {
      window.location.href = "../index.html";
    }, 1200);
  }, 1500);
}

// Password reset simulation
function triggerForgotPassword(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  if (!email) {
    showToast("Digite seu e-mail no campo antes de recuperar a senha.", "error");
    document.getElementById('login-email').focus();
    document.getElementById('login-email').parentElement.parentElement.classList.add('has-error');
    return;
  }
  showToast(`Link de recuperação enviado para: ${email}`, 'success');
}

// Reset validation errors on typing
document.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('input', () => {
    input.parentElement.parentElement.classList.remove('has-error');
  });
});

// ACTION SUBMIT: LOGIN FORM
function handleLoginSubmit(event) {
  event.preventDefault();
  
  const emailField = document.getElementById('login-email');
  const passField = document.getElementById('login-password');
  const email = emailField.value.trim();
  const password = passField.value;

  let hasError = false;

  emailField.parentElement.parentElement.classList.remove('has-error');
  passField.parentElement.parentElement.classList.remove('has-error');

  if (!email) {
    emailField.parentElement.parentElement.classList.add('has-error');
    hasError = true;
  }

  if (!password) {
    passField.parentElement.parentElement.classList.add('has-error');
    hasError = true;
  }

  if (hasError) return;

  // Mode: Administrador Login
  if (currentProfile === 'admin') {
    if (email.toLowerCase() === 'admin@autosport.com' && password === 'admin123') {
      showToast("Acesso administrativo autorizado! Redirecionando...", "success");
      localStorage.setItem('admin_session', 'true');
      setTimeout(() => {
        window.location.href = "../admin/index.html";
      }, 1500);
    } else {
      showToast("Credenciais de administrador incorretas.", "error");
      emailField.parentElement.parentElement.classList.add('has-error');
      passField.parentElement.parentElement.classList.add('has-error');
    }
    return;
  }

  // Mode: Cliente Login (Detect admin credentials bypass)
  if (email.toLowerCase() === 'admin@autosport.com' && password === 'admin123') {
    showToast("Administrador detectado! Redirecionando para o painel...", "warning");
    localStorage.setItem('admin_session', 'true');
    setTimeout(() => {
      window.location.href = "../admin/index.html";
    }, 1500);
    return;
  }

  // Client simulation login
  showToast("Acesso realizado com sucesso!", "success");
  localStorage.setItem('user_session', JSON.stringify({
    name: "Guilherme Batista",
    email: email
  }));
  setTimeout(() => {
    window.location.href = "../index.html";
  }, 1500);
}

// ACTION SUBMIT: REGISTER FORM
function handleRegisterSubmit(event) {
  event.preventDefault();

  const nameF = document.getElementById('reg-name');
  const emailF = document.getElementById('reg-email');
  const phoneF = document.getElementById('reg-phone');
  const cpfF = document.getElementById('reg-cpf');
  const passF = document.getElementById('reg-password');
  const termsF = document.getElementById('reg-terms');

  let hasError = false;

  [nameF, emailF, phoneF, cpfF, passF].forEach(f => {
    f.parentElement.parentElement.classList.remove('has-error');
  });

  if (nameF.value.trim().split(" ").length < 2) {
    nameF.parentElement.parentElement.classList.add('has-error');
    hasError = true;
  }

  if (!emailF.value.includes('@') || emailF.value.length < 5) {
    emailF.parentElement.parentElement.classList.add('has-error');
    hasError = true;
  }

  if (phoneF.value.replace(/\D/g, "").length < 10) {
    phoneF.parentElement.parentElement.classList.add('has-error');
    hasError = true;
  }

  if (cpfF.value.replace(/\D/g, "").length !== 11) {
    cpfF.parentElement.parentElement.classList.add('has-error');
    hasError = true;
  }

  if (passF.value.length < 6) {
    passF.parentElement.parentElement.classList.add('has-error');
    hasError = true;
  }

  if (!termsF.checked) {
    showToast("Você deve aceitar os termos de uso e privacidade.", "error");
    hasError = true;
  }

  if (hasError) return;

  // Simulated success register
  showToast("Cadastro realizado com sucesso!", "success");
  localStorage.setItem('user_session', JSON.stringify({
    name: nameF.value.trim(),
    email: emailF.value.trim()
  }));

  setTimeout(() => {
    window.location.href = "../index.html";
  }, 1500);
}
