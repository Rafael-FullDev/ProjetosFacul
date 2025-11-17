// ===== MÁSCARAS PARA OS CAMPOS =====
document.addEventListener('DOMContentLoaded', function() {
    // Máscara para CPF
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }
    
    // Máscara para Telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            
            if (value.length <= 11) {
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                value = value.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }
    
    // Máscara para CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 8) value = value.substring(0, 8);
            
            if (value.length > 5) {
                value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            }
            
            e.target.value = value;
            
            // Buscar endereço automaticamente quando CEP estiver completo
            if (value.length === 9) {
                buscarEndereco(value);
            }
        });
    }
    
    // ===== FUNÇÃO PARA BUSCAR ENDEREÇO PELO CEP =====
    function buscarEndereco(cep) {
        cep = cep.replace('-', '');
        
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('estado').value = data.uf;
                    document.getElementById('cidade').value = data.localidade;
                    document.getElementById('endereco').value = `${data.logradouro}, ${data.bairro}`;
                }
            })
            .catch(error => {
                console.error('Erro ao buscar CEP:', error);
            });
    }
    
    // ===== CONTROLE DE SEÇÕES CONDICIONAIS NO FORMULÁRIO =====
    const voluntarioCheckbox = document.getElementById('voluntario');
    const doadorCheckbox = document.getElementById('doador');
    const ambosCheckbox = document.getElementById('ambos');
    const voluntarioSection = document.getElementById('voluntario-section');
    const doadorSection = document.getElementById('doador-section');
    
    function toggleSections() {
        const isVoluntario = voluntarioCheckbox.checked || ambosCheckbox.checked;
        const isDoador = doadorCheckbox.checked || ambosCheckbox.checked;
        
        if (voluntarioSection) {
            voluntarioSection.style.display = isVoluntario ? 'block' : 'none';
        }
        
        if (doadorSection) {
            doadorSection.style.display = isDoador ? 'block' : 'none';
        }
    }
    
    if (voluntarioCheckbox && doadorCheckbox && ambosCheckbox) {
        [voluntarioCheckbox, doadorCheckbox, ambosCheckbox].forEach(checkbox => {
            checkbox.addEventListener('change', toggleSections);
        });
        
        // Inicializar estado das seções
        toggleSections();
    }
    
    // ===== CONTROLE DO CAMPO "OUTRO VALOR" =====
    const valorDoacaoSelect = document.getElementById('valorDoacao');
    const outroValorGroup = document.getElementById('outro-valor-group');
    
    if (valorDoacaoSelect && outroValorGroup) {
        valorDoacaoSelect.addEventListener('change', function() {
            if (this.value === 'outro') {
                outroValorGroup.style.display = 'block';
            } else {
                outroValorGroup.style.display = 'none';
            }
        });
    }
    
    // ===== VALIDAÇÃO DO FORMULÁRIO =====
    const form = document.getElementById('cadastroForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Validar campos obrigatórios
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = 'var(--danger-color)';
                    const errorMessage = field.parentNode.querySelector('.error-message');
                    if (errorMessage) {
                        errorMessage.style.display = 'block';
                    }
                }
            });
            
            // Validar pelo menos um interesse selecionado
            const interesses = form.querySelectorAll('input[name="interesse"]:checked');
            if (interesses.length === 0) {
                isValid = false;
                const interesseError = document.getElementById('interesse-error');
                if (interesseError) {
                    interesseError.style.display = 'block';
                }
            }
            
            // Validar seleção múltipla (máximo 3)
            const areasInteresse = document.getElementById('areasInteresse');
            if (areasInteresse) {
                const selectedOptions = Array.from(areasInteresse.selectedOptions);
                if (selectedOptions.length > 3) {
                    isValid = false;
                    alert('Por favor, selecione no máximo 3 áreas de interesse.');
                }
            }
            
            if (isValid) {
                // Simular envio do formulário
                showSuccessMessage();
            } else {
                alert('Por favor, preencha todos os campos obrigatórios corretamente.');
            }
        });
        
        // Limpar estilos de erro ao digitar
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                this.style.borderColor = '';
                const errorMessage = this.parentNode.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.style.display = 'none';
                }
                
                // Limpar erro de interesses quando algum for selecionado
                if (this.name === 'interesse') {
                    const interesseError = document.getElementById('interesse-error');
                    if (interesseError) {
                        interesseError.style.display = 'none';
                    }
                }
            });
        });
    }
    
    // ===== MENSAGEM DE SUCESSO =====
    function showSuccessMessage() {
        const form = document.getElementById('cadastroForm');
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div style="background: var(--accent-color); color: white; padding: 2rem; border-radius: var(--border-radius); text-align: center; margin: 2rem 0;">
                <h3 style="color: white; margin-bottom: 1rem;">Cadastro Realizado com Sucesso!</h3>
                <p>Obrigado por se cadastrar na ONG Connect. Entraremos em contato em breve com mais informações.</p>
                <a href="index.html" class="btn" style="margin-top: 1rem;">Voltar à Página Inicial</a>
            </div>
        `;
        
        form.parentNode.insertBefore(successMessage, form);
        form.style.display = 'none';
        
        // Rolar para a mensagem de sucesso
        successMessage.scrollIntoView({ behavior: 'smooth' });
    }
    
    // ===== LAZY LOADING PARA IMAGENS =====
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ===== VALIDAÇÃO EM TEMPO REAL =====
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = 'var(--danger-color)';
                const errorMessage = this.parentNode.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.style.display = 'block';
                }
            }
        });
    });
});

// ===== CONTADOR ANIMADO PARA ESTATÍSTICAS =====
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '');
        }
    }, 16);
}

// Iniciar animação quando a seção de estatísticas estiver visível
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = document.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
                    animateCounter(stat, target);
                });
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(statsSection);
}

// ===== SISTEMA DE NAVEGAÇÃO INTERATIVA =====
class NavigationSystem {
    constructor() {
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.nav = document.querySelector('.nav');
        this.dropdowns = document.querySelectorAll('.dropdown');
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupDropdowns();
        this.setupSmoothScroll();
    }

    setupMobileMenu() {
        if (!this.mobileMenuBtn) return;

        this.mobileMenuBtn.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target) && !this.mobileMenuBtn.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.mobileMenuBtn.classList.toggle('active');
        this.nav.classList.toggle('active');
        
        // Prevenir scroll do body quando menu está aberto
        document.body.style.overflow = this.nav.classList.contains('active') ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.mobileMenuBtn.classList.remove('active');
        this.nav.classList.remove('active');
        document.body.style.overflow = '';
    }

    setupDropdowns() {
        this.dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 767) {
                    e.preventDefault();
                    dropdown.classList.toggle('open');
                }
            });
        });

        // Fechar dropdowns ao clicar fora
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                this.dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('open');
                });
            }
        });
    }

    setupSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    this.closeMobileMenu();
                    
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ===== SISTEMA DE FEEDBACK =====
class FeedbackSystem {
    constructor() {
        this.toastContainer = this.createToastContainer();
        this.init();
    }

    createToastContainer() {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    init() {
        this.setupFormFeedback();
    }

    showToast(message, type = 'success', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${this.getToastIcon(type)}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" aria-label="Fechar notificação">×</button>
        `;

        this.toastContainer.appendChild(toast);

        // Auto-remove após duração
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideInRight 0.3s ease reverse';
                setTimeout(() => toast.remove(), 300);
            }
        }, duration);

        // Fechar manualmente
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        });

        return toast;
    }

    getToastIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || 'ℹ';
    }

    showModal(title, content, buttons = []) {
        const modalId = 'modal-' + Date.now();
        const modalHTML = `
            <div class="modal-overlay active" id="${modalId}">
                <div class="modal">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="modal-close" aria-label="Fechar modal">×</button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    ${buttons.length ? `
                    <div class="modal-footer">
                        ${buttons.map(btn => `
                            <button class="btn ${btn.variant || 'secondary'}" ${btn.id ? `id="${btn.id}"` : ''}>
                                ${btn.text}
                            </button>
                        `).join('')}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        const modal = document.getElementById(modalId);

        // Fechar modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal(modalId);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modalId);
            }
        });

        return modalId;
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.animation = 'modalSlideIn 0.3s ease reverse';
            setTimeout(() => modal.remove(), 300);
        }
    }

    setupFormFeedback() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, select, textarea');
            
            inputs.forEach(input => {
                // Validação em tempo real
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });

            // Feedback visual durante o submit
            form.addEventListener('submit', (e) => {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    this.showFormErrors(form);
                }
            });
        });
    }

    validateField(field) {
        this.clearFieldError(field);

        if (!field.validity.valid) {
            field.classList.add('error');
            this.showFieldError(field, this.getValidationMessage(field));
        } else {
            field.classList.add('valid');
        }
    }

    clearFieldError(field) {
        field.classList.remove('error', 'valid');
        const errorElement = field.parentNode.querySelector('.form-feedback');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    showFieldError(field, message) {
        let errorElement = field.parentNode.querySelector('.form-feedback');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-feedback';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    getValidationMessage(field) {
        if (field.validity.valueMissing) {
            return 'Este campo é obrigatório.';
        }
        if (field.validity.typeMismatch) {
            return 'Por favor, insira um valor válido.';
        }
        if (field.validity.patternMismatch) {
            return 'O formato não é válido.';
        }
        if (field.validity.tooShort) {
            return `Mínimo ${field.minLength} caracteres.`;
        }
        return 'Por favor, corrija este campo.';
    }

    showFormErrors(form) {
        const invalidFields = form.querySelectorAll(':invalid');
        invalidFields.forEach(field => {
            this.validateField(field);
        });

        if (invalidFields.length > 0) {
            invalidFields[0].focus();
            this.showToast('Por favor, corrija os erros no formulário.', 'error');
        }
    }
}

// ===== SISTEMA DE COMPONENTES =====
class ComponentSystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupCards();
        this.setupButtons();
        this.setupBadges();
    }

    setupCards() {
        // Efeito de hover nos cards
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    setupButtons() {
        // Efeito de loading nos botões
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.classList.contains('btn-loading')) return;
                
                const originalText = this.innerHTML;
                this.classList.add('btn-loading');
                this.innerHTML = '<span class="btn-spinner"></span> Carregando...';
                this.disabled = true;

                // Simular processamento
                setTimeout(() => {
                    this.classList.remove('btn-loading');
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 2000);
            });
        });
    }

    setupBadges() {
        // Animação de entrada para badges
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease';
                }
            });
        });

        document.querySelectorAll('.badge, .tag').forEach(badge => {
            observer.observe(badge);
        });
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sistemas
    new NavigationSystem();
    new FeedbackSystem();
    new ComponentSystem();

    // Máscaras de input (mantido da entrega anterior)
    setupInputMasks();
    
    // Animações de contador para estatísticas
    setupCounterAnimations();
});

// ===== SISTEMA DE CONTATO =====
class ContactSystem {
    constructor() {
        this.contactForm = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (this.contactForm) {
            this.setupContactForm();
        }
    }

    setupContactForm() {
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateContactForm()) {
                this.submitContactForm();
            }
        });

        // Validação em tempo real
        const inputs = this.contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }

    validateContactForm() {
        let isValid = true;
        const requiredFields = this.contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'Este campo é obrigatório.';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Por favor, insira um e-mail válido.';
            }
        } else if (field.type === 'tel' && value) {
            const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                message = 'Por favor, insira um telefone válido.';
            }
        } else if (field.minLength && value.length < field.minLength) {
            isValid = false;
            message = `Mínimo ${field.minLength} caracteres necessários.`;
        }

        this.showFieldValidation(field, isValid, message);
        return isValid;
    }

    showFieldValidation(field, isValid, message) {
        // Limpar estados anteriores
        field.classList.remove('valid', 'error');
        
        if (isValid && field.value.trim()) {
            field.classList.add('valid');
        } else if (!isValid) {
            field.classList.add('error');
        }

        // Mostrar/ocultar mensagem de erro
        let errorElement = field.parentNode.querySelector('.form-feedback');
        if (!errorElement && message) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-feedback';
            field.parentNode.appendChild(errorElement);
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = message ? 'block' : 'none';
        }
    }

    submitContactForm() {
        const formData = new FormData(this.contactForm);
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Mostrar estado de loading
        submitBtn.classList.add('btn-loading');
        submitBtn.innerHTML = '<span class="btn-spinner"></span> Enviando...';
        submitBtn.disabled = true;

        // Simular envio (em produção, seria uma requisição AJAX)
        setTimeout(() => {
            // Sucesso
            submitBtn.classList.remove('btn-loading');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Mostrar mensagem de sucesso
            if (typeof FeedbackSystem !== 'undefined') {
                const feedback = new FeedbackSystem();
                feedback.showToast('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            }

            // Limpar formulário
            this.contactForm.reset();
            
            // Limpar estados de validação
            const fields = this.contactForm.querySelectorAll('.valid, .error');
            fields.forEach(field => {
                field.classList.remove('valid', 'error');
            });

        }, 2000);
    }
}

// Inicializar sistema de contato
document.addEventListener('DOMContentLoaded', function() {
    new ContactSystem();
});

// ===== SISTEMA DE SINGLE PAGE APPLICATION (SPA) =====
class SPARouter {
    constructor() {
        this.routes = {
            '/': 'home',
            '/index.html': 'home',
            '/projetos.html': 'projetos',
            '/cadastro.html': 'cadastro',
            '/contato.html': 'contato'
        };
        
        this.templates = {};
        this.currentPage = 'home';
        this.init();
    }

    async init() {
        await this.loadTemplates();
        this.setupNavigation();
        this.handleInitialRoute();
    }

    async loadTemplates() {
        const templateFiles = ['home', 'projetos', 'cadastro', 'contato'];
        
        for (const templateName of templateFiles) {
            try {
                const response = await fetch(`templates/${templateName}.html`);
                if (response.ok) {
                    this.templates[templateName] = await response.text();
                }
            } catch (error) {
                console.warn(`Template ${templateName} não carregado:`, error);
            }
        }
    }

    setupNavigation() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (link && this.isInternalLink(link.href)) {
                e.preventDefault();
                const path = new URL(link.href).pathname;
                this.navigate(path);
            }
        });

        window.addEventListener('popstate', () => {
            this.handleRouteChange();
        });
    }

    isInternalLink(href) {
        return href.startsWith(window.location.origin) || href.startsWith('/');
    }

    handleInitialRoute() {
        const path = window.location.pathname;
        this.navigate(path, false);
    }

    navigate(path, pushState = true) {
        const route = this.routes[path] || 'home';
        
        if (pushState) {
            history.pushState({}, '', path);
        }
        
        this.renderPage(route);
        this.currentPage = route;
        
        this.updateActiveNav();
        this.initializePageComponents();
    }

    async renderPage(page) {
        const mainContent = document.getElementById('main-content');
        
        if (this.templates[page]) {
            mainContent.innerHTML = this.templates[page];
        } else {
            try {
                const response = await fetch(`pages/${page}.html`);
                if (response.ok) {
                    mainContent.innerHTML = await response.text();
                } else {
                    mainContent.innerHTML = this.getFallbackContent(page);
                }
            } catch (error) {
                mainContent.innerHTML = this.getFallbackContent(page);
            }
        }
    }

    getFallbackContent(page) {
        const contents = {
            home: `<section class="hero"><div class="container"><h1>ONG Connect</h1><p>Página inicial</p></div></section>`,
            projetos: `<section class="page-header"><div class="container"><h1>Projetos</h1><p>Nossos projetos sociais</p></div></section>`,
            cadastro: `<section class="page-header"><div class="container"><h1>Cadastro</h1><p>Junte-se à nossa causa</p></div></section>`,
            contato: `<section class="page-header"><div class="container"><h1>Contato</h1><p>Entre em contato</p></div></section>`
        };
        return contents[page] || contents.home;
    }

    updateActiveNav() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const currentLink = document.querySelector(`a[href="${window.location.pathname}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        }
    }

    initializePageComponents() {
        new FormValidationSystem();
        new ContactSystem();
        
        if (this.currentPage === 'projetos') {
            new ProjectFilterSystem();
        }
    }
}

// ===== SISTEMA DE TEMPLATES =====
class TemplateSystem {
    static render(templateId, data, container) {
        const template = document.getElementById(templateId);
        if (!template) return;

        let html = template.innerHTML;
        
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            html = html.replace(regex, data[key]);
        });

        container.innerHTML = html;
    }

    static compile(templateString, data) {
        return templateString.replace(/{{(\w+)}}/g, (match, key) => {
            return data[key] || '';
        });
    }
}

// ===== SISTEMA AVANÇADO DE VALIDAÇÃO DE FORMULÁRIOS =====
class FormValidationSystem {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }

    init() {
        this.forms.forEach(form => {
            this.setupFormValidation(form);
        });
    }

    setupFormValidation(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            this.setupRealTimeValidation(input);
            this.setupCustomValidation(input);
        });

        form.addEventListener('submit', (e) => {
            if (!this.validateForm(form)) {
                e.preventDefault();
                this.showFormErrors(form);
            }
        });

        this.setupConsistencyChecks(form);
    }

    setupRealTimeValidation(input) {
        let timeout;
        
        input.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                this.validateField(input);
            }, 500);
        });

        input.addEventListener('blur', () => {
            this.validateField(input);
        });
    }

    setupCustomValidation(input) {
        const fieldName = input.name || input.id;
        
        input.addEventListener('invalid', (e) => {
            e.preventDefault();
            this.showCustomValidity(input);
        });
    }

    validateField(field) {
        const errors = this.getFieldErrors(field);
        this.displayFieldErrors(field, errors);
        return errors.length === 0;
    }

    getFieldErrors(field) {
        const errors = [];
        const value = field.value.trim();
        const fieldName = this.getFieldLabel(field);

        if (field.hasAttribute('required') && !value) {
            errors.push(`${fieldName} é obrigatório.`);
        }

        if (value) {
            switch (field.type) {
                case 'email':
                    if (!this.isValidEmail(value)) {
                        errors.push('Por favor, insira um e-mail válido.');
                    }
                    break;
                case 'tel':
                    if (!this.isValidPhone(value)) {
                        errors.push('Por favor, insira um telefone válido.');
                    }
                    break;
                case 'text':
                    if (field.name === 'cpf' && !this.isValidCPF(value)) {
                        errors.push('CPF inválido.');
                    }
                    if (field.name === 'cep' && !this.isValidCEP(value)) {
                        errors.push('CEP inválido.');
                    }
                    if (field.minLength && value.length < field.minLength) {
                        errors.push(`Mínimo de ${field.minLength} caracteres necessários.`);
                    }
                    break;
                case 'date':
                    if (!this.isValidDate(field)) {
                        errors.push('Data inválida.');
                    }
                    break;
            }

            if (field.pattern && !new RegExp(field.pattern).test(value)) {
                errors.push('Formato inválido.');
            }
        }

        return errors;
    }

    displayFieldErrors(field, errors) {
        this.clearFieldErrors(field);

        if (errors.length > 0) {
            field.classList.add('error');
            field.classList.remove('valid');
            
            const errorContainer = this.createErrorContainer(field, errors);
            field.parentNode.appendChild(errorContainer);
            
            this.showFieldWarning(field, errors[0]);
        } else if (field.value.trim()) {
            field.classList.add('valid');
            field.classList.remove('error');
        }
    }

    createErrorContainer(field, errors) {
        const container = document.createElement('div');
        container.className = 'field-errors';
        
        errors.forEach(error => {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = error;
            container.appendChild(errorElement);
        });

        return container;
    }

    clearFieldErrors(field) {
        field.classList.remove('error', 'valid');
        const existingErrors = field.parentNode.querySelector('.field-errors');
        if (existingErrors) {
            existingErrors.remove();
        }
    }

    showFieldWarning(field, message) {
        const warning = document.createElement('div');
        warning.className = 'field-warning';
        warning.textContent = message;
        warning.style.cssText = `
            position: absolute;
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 8px 12px;
            border-radius: 4px;
            z-index: 1000;
            margin-top: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        `;

        const rect = field.getBoundingClientRect();
        warning.style.top = `${rect.bottom + window.scrollY}px`;
        warning.style.left = `${rect.left + window.scrollX}px`;

        document.body.appendChild(warning);

        setTimeout(() => {
            if (warning.parentNode) {
                warning.remove();
            }
        }, 3000);

        field.addEventListener('input', function removeWarning() {
            if (warning.parentNode) {
                warning.remove();
            }
            field.removeEventListener('input', removeWarning);
        });
    }

    validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showConsistencyErrors(form);
        }

        return isValid;
    }

    showFormErrors(form) {
        const firstErrorField = form.querySelector('.error');
        if (firstErrorField) {
            firstErrorField.focus();
        }
        
        this.showToast('Por favor, corrija os erros destacados no formulário.', 'error');
    }

    setupConsistencyChecks(form) {
        const emailField = form.querySelector('input[type="email"]');
        const confirmEmailField = form.querySelector('input[name="confirmEmail"]');
        
        if (emailField && confirmEmailField) {
            confirmEmailField.addEventListener('blur', () => {
                this.checkEmailConsistency(emailField, confirmEmailField);
            });
        }

        const passwordField = form.querySelector('input[type="password"]');
        const confirmPasswordField = form.querySelector('input[name="confirmPassword"]');
        
        if (passwordField && confirmPasswordField) {
            confirmPasswordField.addEventListener('blur', () => {
                this.checkPasswordConsistency(passwordField, confirmPasswordField);
            });
        }

        this.setupDataConsistency(form);
    }

    checkEmailConsistency(emailField, confirmEmailField) {
        if (emailField.value && confirmEmailField.value && 
            emailField.value !== confirmEmailField.value) {
            this.showConsistencyError(confirmEmailField, 'Os e-mails não coincidem.');
        } else {
            this.clearConsistencyError(confirmEmailField);
        }
    }

    checkPasswordConsistency(passwordField, confirmPasswordField) {
        if (passwordField.value && confirmPasswordField.value && 
            passwordField.value !== confirmPasswordField.value) {
            this.showConsistencyError(confirmPasswordField, 'As senhas não coincidem.');
        } else {
            this.clearConsistencyError(confirmPasswordField);
        }
    }

    setupDataConsistency(form) {
        const birthDateField = form.querySelector('input[type="date"]');
        if (birthDateField) {
            birthDateField.addEventListener('change', () => {
                this.checkBirthDateConsistency(birthDateField);
            });
        }

        const cpfField = form.querySelector('input[name="cpf"]');
        if (cpfField) {
            cpfField.addEventListener('blur', () => {
                this.checkCPFConsistency(cpfField);
            });
        }
    }

    checkBirthDateConsistency(dateField) {
        const birthDate = new Date(dateField.value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 16) {
            this.showConsistencyError(dateField, 'Você deve ter pelo menos 16 anos para se cadastrar.');
        } else if (age > 100) {
            this.showConsistencyError(dateField, 'Por favor, verifique a data de nascimento.');
        } else {
            this.clearConsistencyError(dateField);
        }
    }

    checkCPFConsistency(cpfField) {
        if (cpfField.value && !this.isValidCPF(cpfField.value)) {
            this.showConsistencyError(cpfField, 'CPF inválido. Verifique os números digitados.');
        } else {
            this.clearConsistencyError(cpfField);
        }
    }

    showConsistencyError(field, message) {
        field.classList.add('consistency-error');
        
        let errorElement = field.parentNode.querySelector('.consistency-error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'consistency-error-message';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    clearConsistencyError(field) {
        field.classList.remove('consistency-error');
        const errorElement = field.parentNode.querySelector('.consistency-error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    showConsistencyErrors(form) {
        const consistencyErrors = form.querySelectorAll('.consistency-error');
        if (consistencyErrors.length > 0) {
            this.showToast('Existem inconsistências nos dados informados. Verifique os campos destacados.', 'warning');
        }
    }

    // Utilitários de validação
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    isValidPhone(phone) {
        const regex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        return regex.test(phone);
    }

    isValidCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, '');
        
        if (cpf.length !== 11) return false;
        if (/^(\d)\1+$/.test(cpf)) return false;

        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(10))) return false;

        return true;
    }

    isValidCEP(cep) {
        const regex = /^\d{5}-\d{3}$/;
        return regex.test(cep);
    }

    isValidDate(dateField) {
        const value = dateField.value;
        if (!value) return true;

        const date = new Date(value);
        const maxDate = dateField.max ? new Date(dateField.max) : new Date();
        const minDate = dateField.min ? new Date(dateField.min) : new Date('1900-01-01');

        return date <= maxDate && date >= minDate && !isNaN(date.getTime());
    }

    getFieldLabel(field) {
        const label = field.labels && field.labels[0];
        return label ? label.textContent.replace('*', '').trim() : 'Este campo';
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                <button class="toast-close">&times;</button>
            </div>
        `;

        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);

        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });

        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
    }
}

// ===== SISTEMA DE FILTRO DE PROJETOS =====
class ProjectFilterSystem {
    constructor() {
        this.projects = [];
        this.filters = {
            category: 'all',
            status: 'all',
            location: 'all'
        };
        this.init();
    }

    async init() {
        await this.loadProjects();
        this.setupFilterControls();
        this.renderProjects();
    }

    async loadProjects() {
        this.projects = [
            {
                id: 1,
                title: 'Educação para o Futuro',
                category: 'educacao',
                status: 'active',
                location: 'sao-paulo',
                description: 'Reforço escolar para crianças',
                image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
                badges: ['Educação', 'Ativo']
            },
            {
                id: 2,
                title: 'Recicla Comunidade',
                category: 'meio-ambiente',
                status: 'active',
                location: 'rio-de-janeiro',
                description: 'Conscientização ambiental',
                image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09',
                badges: ['Meio Ambiente', 'Ativo']
            }
        ];
    }

    setupFilterControls() {
        const filterSelects = document.querySelectorAll('.project-filter');
        filterSelects.forEach(select => {
            select.addEventListener('change', (e) => {
                this.filters[e.target.name] = e.target.value;
                this.renderProjects();
            });
        });
    }

    renderProjects() {
        const filteredProjects = this.projects.filter(project => {
            return (this.filters.category === 'all' || project.category === this.filters.category) &&
                   (this.filters.status === 'all' || project.status === this.filters.status) &&
                   (this.filters.location === 'all' || project.location === this.filters.location);
        });

        const container = document.getElementById('projects-container');
        if (container) {
            container.innerHTML = this.generateProjectsHTML(filteredProjects);
        }
    }

    generateProjectsHTML(projects) {
        return projects.map(project => `
            <div class="project-card" data-category="${project.category}">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}" loading="lazy">
                    <div class="project-badges">
                        ${project.badges.map(badge => `<span class="badge badge-primary">${badge}</span>`).join('')}
                    </div>
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-meta">
                        <span><strong>Local:</strong> ${project.location}</span>
                        <span><strong>Status:</strong> ${project.status}</span>
                    </div>
                    <button class="btn btn-primary" onclick="projectModal.show(${project.id})">
                        Saiba Mais
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// ===== SISTEMA DE MODAL DE PROJETOS =====
class ProjectModalSystem {
    constructor() {
        this.projects = [];
        this.init();
    }

    async init() {
        await this.loadProjects();
    }

    async loadProjects() {
        this.projects = [
            {
                id: 1,
                title: 'Educação para o Futuro',
                description: 'Projeto completo de reforço escolar...',
                fullDescription: 'Descrição detalhada do projeto...',
                requirements: ['Disponibilidade mínima de 4h semanais', 'Paciente com crianças'],
                contact: 'educacao@ongconnect.org.br'
            }
        ];
    }

    show(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const modalHTML = `
            <div class="modal-overlay active">
                <div class="modal">
                    <div class="modal-header">
                        <h3>${project.title}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>${project.fullDescription}</p>
                        <h4>Requisitos:</h4>
                        <ul>
                            ${project.requirements.map(req => `<li>${req}</li>`).join('')}
                        </ul>
                        <p><strong>Contato:</strong> ${project.contact}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">
                            Fechar
                        </button>
                        <button class="btn btn-primary" onclick="location.href='cadastro.html'">
                            Quero Participar
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = document.querySelector('.modal-overlay.active');
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// ===== SISTEMA DE ARMAZENAMENTO LOCAL =====
class StorageSystem {
    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            return false;
        }
    }

    static get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Erro ao ler do localStorage:', error);
            return null;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Erro ao remover do localStorage:', error);
            return false;
        }
    }

    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Erro ao limpar localStorage:', error);
            return false;
        }
    }
}

// ===== INICIALIZAÇÃO GLOBAL =====
class App {
    static init() {
        this.setupSPA();
        this.setupServiceWorker();
        this.setupAnalytics();
    }

    static setupSPA() {
        if (document.getElementById('main-content')) {
            window.spaRouter = new SPARouter();
        }
    }

    static setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registrado:', registration);
                })
                .catch(error => {
                    console.log('Falha no registro do Service Worker:', error);
                });
        }
    }

    static setupAnalytics() {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
    }
}

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', () => {
    App.init();
    
    // Inicializar sistemas específicos
    new FormValidationSystem();
    new ContactSystem();
    
    // Expor sistemas globais
    window.projectModal = new ProjectModalSystem();
    window.TemplateSystem = TemplateSystem;
    window.StorageSystem = StorageSystem;
});

// Manter funções de máscaras existentes
function setupInputMasks() {
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }
    
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.substring(0, 11);
            
            if (value.length <= 11) {
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                value = value.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }
    
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 8) value = value.substring(0, 8);
            
            if (value.length > 5) {
                value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            }
            
            e.target.value = value;
        });
    }
}