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