/**
 * Sistema de Detecção Automática de Idioma
 * Portfolio de Kelvin Andrade
 * 
 * Detecta idioma do navegador e redireciona automaticamente
 * Salva preferência do usuário no localStorage
 * Evita loops de redirecionamento
 * Suporte a textos de carregamento multilíngues
 */

(function() {
    'use strict';

    // Configuração de idiomas suportados
    const LANGUAGES = {
        'pt-br': 'index.html',
        'en': 'index-en.html',
        'es': 'index-es.html'
    };

    const DEFAULT_LANG = 'en'; // Fallback padrão

    // Textos de carregamento multilíngues
    const LOADING_TEXTS = {
        'pt-br': 'Carregando Portfólio...',
        'en': 'Loading Portfolio...',
        'es': 'Cargando Portafolio...'
    };

    /**
     * Detecta o idioma do navegador
     * @returns {string} Código do idioma (pt-br, en, es)
     */
    function detectBrowserLanguage() {
        const browserLang = (navigator.language || navigator.userLanguage).toLowerCase();
        
        // Mapear idioma do navegador para códigos suportados
        if (browserLang.startsWith('pt')) {
            return 'pt-br';
        } else if (browserLang.startsWith('es')) {
            return 'es';
        } else if (browserLang.startsWith('en')) {
            return 'en';
        }
        
        return DEFAULT_LANG;
    }

    /**
     * Obtém o idioma atual baseado na URL
     * @returns {string} Código do idioma atual
     */
    function getCurrentLanguage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Mapear arquivo para idioma
        for (const [lang, file] of Object.entries(LANGUAGES)) {
            if (currentPage === file) {
                return lang;
            }
        }
        
        return 'pt-br'; // Fallback para português
    }

    /**
     * Atualiza o texto de carregamento conforme o idioma
     * @param {string} lang - Código do idioma
     */
    function updateLoadingText(lang) {
        const loadingText = document.querySelector('#loading-screen p');
        if (loadingText && LOADING_TEXTS[lang]) {
            loadingText.textContent = LOADING_TEXTS[lang];
            console.log('🌍 Texto de carregamento atualizado para:', LOADING_TEXTS[lang]);
        }
    }

    /**
     * Redireciona para o idioma especificado
     * @param {string} targetLang - Código do idioma de destino
     */
    function redirectToLanguage(targetLang) {
        if (LANGUAGES[targetLang]) {
            // Marcar que já foi redirecionado nesta sessão
            sessionStorage.setItem('languageRedirected', 'true');
            
            // Obter o caminho base (importante para GitHub Pages)
            const pathArray = window.location.pathname.split('/');
            pathArray.pop(); // Remove o arquivo atual
            const basePath = pathArray.join('/');
            
            // Redirecionar
            window.location.href = basePath + '/' + LANGUAGES[targetLang];
        }
    }

    /**
     * Inicializa a detecção automática de idioma
     */
    function initLanguageDetection() {
        // Verifica se já foi redirecionado nesta sessão
        const wasRedirected = sessionStorage.getItem('languageRedirected');
        if (wasRedirected) {
            console.log('✓ Idioma já detectado nesta sessão');
            return;
        }

        // Verifica preferência salva do usuário
        const savedLang = localStorage.getItem('user_language_preference');
        
        if (!savedLang) {
            // Primeira visita - detectar idioma do navegador
            const detectedLang = detectBrowserLanguage();
            
            console.log('🌍 Idioma detectado:', detectedLang);
            
            // Salvar preferência detectada
            localStorage.setItem('user_language_preference', detectedLang);
            
            // Verificar se precisa redirecionar
            const currentLang = getCurrentLanguage();
            
            if (detectedLang !== currentLang) {
                console.log('🔄 Redirecionando de', currentLang, 'para', detectedLang);
                redirectToLanguage(detectedLang);
            } else {
                // Marcar como redirecionado mesmo se já estiver no idioma correto
                sessionStorage.setItem('languageRedirected', 'true');
            }
        } else {
            // Preferência já existe - verificar se está na página correta
            const currentLang = getCurrentLanguage();
            
            if (savedLang !== currentLang) {
                console.log('🔄 Carregando preferência salva:', savedLang);
                redirectToLanguage(savedLang);
            } else {
                // Já está na página correta
                sessionStorage.setItem('languageRedirected', 'true');
            }
        }
    }

    // Executar detecção ao carregar a página
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLanguageDetection);
    } else {
        initLanguageDetection();
    }

})();

/**
 * Função global para trocar idioma manualmente
 * @param {string} lang - Código do idioma (pt-br, en, es)
 */
function changeLanguage(lang) {
    console.log('🔄 Mudando idioma manualmente para:', lang);
    
    // Atualizar texto de carregamento antes do redirecionamento
    const LOADING_TEXTS = {
        'pt-br': 'Carregando Portfólio...',
        'en': 'Loading Portfolio...',
        'es': 'Cargando Portafolio...'
    };
    
    const loadingText = document.querySelector('#loading-screen p');
    if (loadingText && LOADING_TEXTS[lang]) {
        loadingText.textContent = LOADING_TEXTS[lang];
        console.log('🌍 Texto de carregamento atualizado para:', LOADING_TEXTS[lang]);
    }
    
    // Salvar nova preferência
    localStorage.setItem('user_language_preference', lang);
    
    // Limpar flag de redirecionamento para permitir nova navegação
    sessionStorage.removeItem('languageRedirected');
    
    // Mapa de idiomas para arquivos
    const targetPages = {
        'pt-br': 'index.html',
        'pt': 'index.html', // Alias
        'en': 'index-en.html',
        'es': 'index-es.html'
    };
    
    if (targetPages[lang]) {
        // Obter caminho base
        const pathArray = window.location.pathname.split('/');
        pathArray.pop();
        const basePath = pathArray.join('/');
        
        // Redirecionar
        window.location.href = basePath + '/' + targetPages[lang];
    } else {
        console.error('❌ Idioma não suportado:', lang);
    }
}

/**
 * Atualiza indicador visual do idioma ativo
 */
function updateActiveLanguageIndicator() {
    const currentLang = localStorage.getItem('user_language_preference') || 'pt-br';
    
    // Remover classe 'active' de todos os botões
    document.querySelectorAll('.language-selector .flag, #language-switcher .flag').forEach(link => {
        link.classList.remove('active');
    });
    
    // Adicionar classe 'active' ao idioma atual
    const langMap = {
        'pt-br': 'index.html',
        'en': 'index-en.html',
        'es': 'index-es.html'
    };
    
    const targetFile = langMap[currentLang];
    if (targetFile) {
        const activeLink = document.querySelector(`.flag[href*="${targetFile}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// Atualizar indicador ao carregar a página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateActiveLanguageIndicator);
} else {
    updateActiveLanguageIndicator();
}

/**
 * Função de debug - Limpar preferências
 * Use no console: resetLanguagePreferences()
 */
function resetLanguagePreferences() {
    localStorage.removeItem('user_language_preference');
    sessionStorage.removeItem('languageRedirected');
    console.log('✓ Preferências de idioma resetadas');
    console.log('🔄 Recarregue a página para detecção automática');
}

// Expor função de debug no console
window.resetLanguagePreferences = resetLanguagePreferences;

console.log('✓ Sistema de detecção de idioma carregado');

