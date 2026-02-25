// Smooth scroll
document.querySelectorAll('a[href^="#"]:not([data-wa])').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animação de contagem dos números
function animateCounter(element, target, suffix, duration = 2000) {
    if (!element || isNaN(target) || target <= 0) {
        console.error('Parâmetros inválidos para animateCounter');
        return;
    }

    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        let displayValue;
        const floorValue = Math.floor(current);
        
        if (target >= 1000000) {
            // Formato para milhões (16.000.000+)
            displayValue = floorValue.toLocaleString('pt-BR') + suffix;
        } else if (target >= 1000) {
            // Formato para milhares
            displayValue = floorValue.toLocaleString('pt-BR') + suffix;
        } else {
            // Formato simples (12+ ou 98%)
            displayValue = floorValue + suffix;
        }

        element.textContent = displayValue;
    }, 16);
}

// Observer para animar quando a seção entrar na viewport
let statsObserver;

function initCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length === 0) {
        console.warn('Nenhum elemento .stat-number encontrado');
        return;
    }

    statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                
                // Verificar se já foi animado
                if (statNumber.classList.contains('animated')) {
                    return;
                }
                
                // Ler atributos
                const targetAttr = statNumber.getAttribute('data-target');
                const suffixAttr = statNumber.getAttribute('data-suffix') || '';
                
                if (!targetAttr) {
                    console.error('data-target não encontrado no elemento:', statNumber);
                    return;
                }
                
                const target = parseInt(targetAttr, 10);
                
                if (isNaN(target) || target <= 0) {
                    console.error('Valor de target inválido:', targetAttr);
                    return;
                }
                
                // Marcar como animado antes de iniciar
                statNumber.classList.add('animated');
                
                // Iniciar do zero
                statNumber.textContent = '0' + suffixAttr;
                
                // Iniciar animação
                animateCounter(statNumber, target, suffixAttr);
            }
        });
    }, {
        threshold: 0.3
    });

    // Aplicar observer aos números
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Executar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCounterAnimation);
} else {
    // DOM já está carregado
    initCounterAnimation();
}

// Banner de Cookies - Versão simplificada e robusta
(function() {
    'use strict';
    
    function showCookieBanner() {
        const cookieBanner = document.getElementById('cookie-banner');
        if (cookieBanner) {
            cookieBanner.classList.add('show');
        }
    }
    
    function hideCookieBanner() {
        const cookieBanner = document.getElementById('cookie-banner');
        if (cookieBanner) {
            cookieBanner.classList.add('hide-permanently');
            cookieBanner.classList.remove('show');
        }
    }
    
    function initCookieBanner() {
        const cookieBanner = document.getElementById('cookie-banner');
        const acceptBtn = document.getElementById('accept-cookies');
        const rejectBtn = document.getElementById('reject-cookies');

        if (!cookieBanner) {
            return;
        }

        // Verificar localStorage de forma segura
        let cookieChoice = null;
        try {
            cookieChoice = localStorage.getItem('cookieConsent');
        } catch (e) {
            // localStorage não disponível, continuar normalmente
        }
        
        // Se já houver escolha, ocultar banner
        if (cookieChoice) {
            hideCookieBanner();
            return;
        }

        // Se não houver escolha, mostrar banner após delay
        // Reduzir delay para aparecer mais rápido
        setTimeout(function() {
            console.log('Tentando mostrar banner de cookies...');
            showCookieBanner();
            // Verificar se apareceu, se não, tentar novamente
            setTimeout(function() {
                const banner = document.getElementById('cookie-banner');
                if (banner && !banner.classList.contains('show')) {
                    console.log('Banner não apareceu, tentando novamente...');
                    banner.classList.add('show');
                    banner.style.transform = 'translateY(0)';
                    banner.style.opacity = '1';
                    banner.style.visibility = 'visible';
                }
            }, 500);
        }, 1500);

        // Configurar botões
        if (acceptBtn) {
            acceptBtn.addEventListener('click', function() {
                try {
                    localStorage.setItem('cookieConsent', 'accepted');
                } catch (e) {
                    // Ignorar erro de localStorage
                }
                hideCookieBanner();
            });
        }

        if (rejectBtn) {
            rejectBtn.addEventListener('click', function() {
                try {
                    localStorage.setItem('cookieConsent', 'rejected');
                } catch (e) {
                    // Ignorar erro de localStorage
                }
                hideCookieBanner();
            });
        }
    }

    // Inicializar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookieBanner);
    } else {
        // DOM já carregado
        setTimeout(initCookieBanner, 100);
    }
})();

// Animações de Scroll - Efeito após cada rolagem
(function() {
    'use strict';

    // Verificar se o usuário prefere movimento reduzido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        return; // Não aplicar animações se o usuário preferir movimento reduzido
    }

    // Configurar Intersection Observer para animações profissionais
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Delay progressivo para efeito cascata mais suave
                const delay = entry.target.dataset.animationDelay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    // Remover will-change após animação para performance
                    setTimeout(() => {
                        entry.target.style.willChange = 'auto';
                    }, 1200);
                }, delay);
            } else {
                // Remover classe visible quando sai da viewport
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    });

    // Função para inicializar animações profissionais
    function initScrollAnimations() {
        // Verificar se é mobile
        const isMobile = window.innerWidth <= 768;
        
        // Hero - animação mais sofisticada
        const heroContent = document.querySelector('.hero-content');
        const heroImage = document.querySelector('.hero-image');
        
        // No mobile, não adicionar animação ao texto do hero
        if (heroContent && !isMobile) {
            heroContent.classList.add('fade-in');
            heroContent.dataset.animationDelay = '0';
            animationObserver.observe(heroContent);
        } else if (heroContent && isMobile) {
            // No mobile, remover qualquer classe de animação
            heroContent.classList.remove('fade-in');
        }
        
        if (heroImage) {
            heroImage.classList.add('fade-in');
            heroImage.dataset.animationDelay = '150';
            animationObserver.observe(heroImage);
        }

        // Estatísticas - animação com pop
        const statItems = document.querySelectorAll('.stat-item');
        statItems.forEach((item, index) => {
            item.classList.add('fade-in');
            item.dataset.animationDelay = (index * 120).toString();
            animationObserver.observe(item);
        });

        // Números das estatísticas - animação especial
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach((number, index) => {
            number.classList.add('number-pop');
            number.dataset.animationDelay = (index * 120 + 300).toString();
            animationObserver.observe(number);
        });

        // Títulos de seção - fade up com rotação sutil
        const sectionTitles = document.querySelectorAll('.section-title');
        sectionTitles.forEach((title, index) => {
            title.classList.add('fade-up-rotate');
            title.dataset.animationDelay = '0';
            animationObserver.observe(title);
        });

        // Subtítulos - fade in com delay
        const sectionSubtitles = document.querySelectorAll('.section-subtitle');
        sectionSubtitles.forEach((subtitle, index) => {
            subtitle.classList.add('fade-in');
            subtitle.dataset.animationDelay = '200';
            animationObserver.observe(subtitle);
        });

        // Cards de features - slide alternado com stagger melhorado
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            if (index % 2 === 0) {
                card.classList.add('slide-left');
            } else {
                card.classList.add('slide-right');
            }
            card.dataset.animationDelay = (index * 100).toString();
            animationObserver.observe(card);
        });

        // Step items - slide da esquerda com delay progressivo
        const stepItems = document.querySelectorAll('.step-item');
        stepItems.forEach((step, index) => {
            step.classList.add('slide-left');
            step.dataset.animationDelay = (index * 150).toString();
            animationObserver.observe(step);
        });

        // Benefit items - fade in com stagger suave
        const benefitItems = document.querySelectorAll('.benefit-item');
        benefitItems.forEach((item, index) => {
            item.classList.add('fade-in');
            item.dataset.animationDelay = (index * 80).toString();
            animationObserver.observe(item);
        });

        // CTA - fade up com rotação
        const ctaSection = document.querySelector('.cta');
        if (ctaSection) {
            const ctaContent = ctaSection.querySelector('h2');
            const ctaText = ctaSection.querySelector('p');
            const ctaButton = ctaSection.querySelector('.btn-primary');
            
            if (ctaContent) {
                ctaContent.classList.add('fade-up-rotate');
                ctaContent.dataset.animationDelay = '0';
                animationObserver.observe(ctaContent);
            }
            if (ctaText) {
                ctaText.classList.add('fade-in');
                ctaText.dataset.animationDelay = '200';
                animationObserver.observe(ctaText);
            }
            if (ctaButton) {
                ctaButton.classList.add('scale-in');
                ctaButton.dataset.animationDelay = '400';
                animationObserver.observe(ctaButton);
            }
        }
    }

    // Inicializar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollAnimations);
    } else {
        // Pequeno delay para garantir que o CSS está carregado
        setTimeout(initScrollAnimations, 100);
    }
})();

// Carrossel de Depoimentos - Animação Automática + Scroll Manual
(function() {
    'use strict';

    function initTestimonialsCarousel() {
        const carouselWrapper = document.querySelector('.testimonials-carousel-wrapper');
        const carousel = document.querySelector('.testimonials-carousel');
        
        if (!carouselWrapper || !carousel) {
            return;
        }

        let interactionTimer;
        let isUserInteracting = false;
        let lastScrollTime = 0;

        // Função para pausar animação quando usuário interage
        function pauseAnimation() {
            if (!isUserInteracting) {
                isUserInteracting = true;
                carouselWrapper.classList.add('user-interacting');
            }
            
            // Atualizar tempo da última interação
            lastScrollTime = Date.now();
            
            // Limpar timer anterior
            clearTimeout(interactionTimer);
            
            // Retomar animação após 2 segundos sem interação
            interactionTimer = setTimeout(() => {
                const timeSinceLastScroll = Date.now() - lastScrollTime;
                if (timeSinceLastScroll >= 2000) {
                    isUserInteracting = false;
                    carouselWrapper.classList.remove('user-interacting');
                }
            }, 2000);
        }

        // Detectar scroll manual (touch e mouse)
        let scrollTimeout;
        carouselWrapper.addEventListener('scroll', () => {
            pauseAnimation();
            
            // Detectar quando parou de fazer scroll
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                lastScrollTime = Date.now();
                // Retomar animação após parar de fazer scroll
                setTimeout(() => {
                    const timeSinceLastScroll = Date.now() - lastScrollTime;
                    if (timeSinceLastScroll >= 2000 && !isUserInteracting) {
                        carouselWrapper.classList.remove('user-interacting');
                    }
                }, 2000);
            }, 150);
        }, { passive: true });

        // Touch events - detectar quando usuário toca
        carouselWrapper.addEventListener('touchstart', () => {
            pauseAnimation();
        }, { passive: true });

        carouselWrapper.addEventListener('touchmove', () => {
            pauseAnimation();
        }, { passive: true });

        // Mouse events - detectar quando usuário clica e arrasta
        let isMouseDown = false;
        
        carouselWrapper.addEventListener('mousedown', () => {
            isMouseDown = true;
            pauseAnimation();
        });

        carouselWrapper.addEventListener('mousemove', () => {
            if (isMouseDown) {
                pauseAnimation();
            }
        });

        carouselWrapper.addEventListener('mouseup', () => {
            isMouseDown = false;
        });

        carouselWrapper.addEventListener('mouseleave', () => {
            isMouseDown = false;
        });

        // Wheel events - detectar scroll com mouse wheel
        carouselWrapper.addEventListener('wheel', () => {
            pauseAnimation();
        }, { passive: true });
    }

    // Inicializar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTestimonialsCarousel);
    } else {
        initTestimonialsCarousel();
    }
})();


// =============================
// Troca de números - WhatsApp
// =============================
(() => {
  const API_BASE =
    window.__ZAP_API_BASE || "https://troca-numeros-api-production.up.railway.app";

  const DEFAULT_MESSAGE =
    "Olá, gostaria de consultar minhas ofertas disponíveis!";

  const SELECTOR = "[data-wa]";

  const state = {
    loading: true,
    phone: "",
    error: null,
  };

  function getDomain() {
    return (window.location.hostname || "").replace(/^www\./, "");
  }

  function onlyDigits(v) {
    return String(v || "").replace(/\D/g, "");
  }

  function buildWaUrl(phoneDigits, message) {
    const phone = onlyDigits(phoneDigits);
    const text = encodeURIComponent(message || DEFAULT_MESSAGE);
    return `https://wa.me/${phone}?text=${text}`;
  }

  function getMessageFromEl(el) {
    return el.getAttribute("data-wa-message") || DEFAULT_MESSAGE;
  }

  async function fetchPhoneByDomain(domain, signal) {
    const url = `${API_BASE}/zap?domain=${encodeURIComponent(domain)}`;

    const r = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal,
    });

    if (!r.ok) throw new Error(`HTTP ${r.status}`);

    const data = await r.json();

    const phone = onlyDigits(data?.phone);
    const numero = onlyDigits(data?.numero);

    const resolved = phone || numero;
    if (!resolved) throw new Error("Número não retornado");

    return resolved;
  }

  function setButtonsPending(pending) {
    document.querySelectorAll(SELECTOR).forEach((el) => {
      // desabilita só se for button
      if (el instanceof HTMLButtonElement) el.disabled = pending;

      el.classList.toggle("wa-pending", pending);
      el.setAttribute("aria-busy", pending ? "true" : "false");
    });
  }

  function setError(msg) {
    state.error = msg;
    document.querySelectorAll(SELECTOR).forEach((el) => el.classList.add("wa-error"));
  }

  async function init() {
    const domain = getDomain();

    if (!API_BASE) {
      state.loading = false;
      setError("API_BASE não configurada.");
      return;
    }

    if (!domain) {
      state.loading = false;
      setError("Domínio inválido. Rode em um servidor (não file://).");
      return;
    }

    setButtonsPending(true);

    const controller = new AbortController();

    try {
      const ph = await fetchPhoneByDomain(domain, controller.signal);
      state.phone = ph;
      state.error = null;
    } catch (e) {
      state.phone = "";
      setError("WhatsApp indisponível no momento. Tente novamente mais tarde.");
    } finally {
      state.loading = false;
      setButtonsPending(false);
    }
  }

  document.addEventListener("click", (ev) => {
    const el = ev.target.closest?.(SELECTOR);
    if (!el) return;

    ev.preventDefault();

    if (state.loading) {
      alert("Carregando atendimento... tente novamente.");
      return;
    }

    if (!state.phone) {
      alert(state.error || "WhatsApp indisponível no momento.");
      return;
    }

    const msg = getMessageFromEl(el);
    const url = buildWaUrl(state.phone, msg);
    window.open(url, "_blank", "noopener,noreferrer");
  });

  init();
})();