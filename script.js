// script.js
document.addEventListener('DOMContentLoaded', () => {
    /* ---------- Header hamburger ---------- */
    const hamburger = document.getElementById('hamburger');
    const navList = document.querySelector('.main-nav ul');

    hamburger?.addEventListener('click', () => {
        navList.classList.toggle('show');
        // Change l'icône du hamburger
        if (navList.classList.contains('show')) {
            hamburger.textContent = '✕';
        } else {
            hamburger.textContent = '☰';
        }
    });

    /* ---------- Smooth anchor scroll ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e){
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            e.preventDefault();
            const el = document.querySelector(targetId);
            if (el) {
                const offset = Math.max(0, el.offsetTop - 80);
                window.scrollTo({ top: offset, behavior: 'smooth' });
                
                // Fermer le menu mobile si ouvert
                if (navList.classList.contains('show')) {
                    navList.classList.remove('show');
                    hamburger.textContent = '☰';
                }
            }
        });
    });

    /* ---------- Modal d'achat ---------- */
    function openLightbox(title) {
        // Supprimer toute lightbox existante
        const existing = document.getElementById('lightbox');
        if (existing) existing.remove();

        // Créer la lightbox
        const box = document.createElement('div');
        box.id = 'lightbox';
        box.style.position = 'fixed';
        box.style.inset = '0';
        box.style.display = 'flex';
        box.style.alignItems = 'center';
        box.style.justifyContent = 'center';
        box.style.background = 'rgba(0,0,0,0.7)';
        box.style.zIndex = '9999';
        box.style.padding = '20px';

        // Créer le panneau
        const panel = document.createElement('div');
        panel.style.background = '#fff';
        panel.style.padding = '2rem';
        panel.style.borderRadius = '12px';
        panel.style.maxWidth = '500px';
        panel.style.width = '100%';
        panel.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)';
        
        panel.innerHTML = `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="color: #1e3a8a; margin-bottom: 0.5rem; font-size: 1.5rem;">${escapeHtml(title)}</h3>
                <p style="color: #666; margin-bottom: 0.5rem;">Merci pour votre intérêt ! Laissez vos coordonnées et nous vous contacterons.</p>
            </div>
            
            <form id="buyForm" style="margin-bottom: 1rem;">
                <div style="margin-bottom: 1rem;">
                    <input name="name" placeholder="Nom complet" required 
                           style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;" />
                </div>
                <div style="margin-bottom: 1rem;">
                    <input name="phone" placeholder="Téléphone" required 
                           style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;" />
                </div>
                <div style="margin-bottom: 1rem;">
                    <input name="email" type="email" placeholder="Email" 
                           style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;" />
                </div>
                <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                    <button type="button" id="cancelBtn" 
                            style="background: #f3f4f6; color: #333; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        Annuler
                    </button>
                    <button type="submit" 
                            style="background: #1e40af; color: #fff; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        Envoyer la demande
                    </button>
                </div>
            </form>
        `;
        
        box.appendChild(panel);
        document.body.appendChild(box);

        // Empêcher le défilement du body
        document.body.style.overflow = 'hidden';

        // Gestion des événements
        document.getElementById('cancelBtn').addEventListener('click', () => {
            box.remove();
            document.body.style.overflow = 'auto';
        });

        document.getElementById('buyForm').addEventListener('submit', (ev) => {
            ev.preventDefault();
            
            // Animation de chargement
            const submitBtn = panel.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span style="display: inline-block; animation: spin 1s linear infinite;">⟳</span> Envoi...';
            submitBtn.disabled = true;
            
            // Simulation d'envoi
            setTimeout(() => {
                panel.innerHTML = `
                    <div style="text-align: center; padding: 1rem;">
                        <div style="color: #10b981; font-size: 3rem; margin-bottom: 1rem;">✓</div>
                        <h3 style="color: #1e3a8a; margin-bottom: 1rem;">Demande envoyée !</h3>
                        <p style="color: #666; margin-bottom: 1rem;">
                            Merci pour votre intérêt pour <strong>"${escapeHtml(title)}"</strong>.
                            Nous vous contacterons dans les plus brefs délais.
                        </p>
                        <button onclick="this.closest('#lightbox').remove(); document.body.style.overflow='auto';" 
                                style="background: #1e40af; color: #fff; border: none; padding: 10px 24px; border-radius: 6px; cursor: pointer; font-weight: 600;">
                            Fermer
                        </button>
                    </div>
                `;
            }, 1500);
        });

        // Fermer en cliquant en dehors
        box.addEventListener('click', (e) => {
            if (e.target === box) {
                box.remove();
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Ajouter l'animation spin pour le bouton
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Ajouter les événements aux boutons d'achat
    document.querySelectorAll('.btn-acheter').forEach(btn => {
        btn.addEventListener('click', function(){
            const titre = this.closest('.card').querySelector('h3')?.textContent?.trim() || 'livre';
            openLightbox(titre);
        });
    });

    function escapeHtml(s){ 
        return String(s).replace(/[&<>"']/g, c=>({ 
            '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' 
        })[c]); 
    }

    /* ---------- Animation au scroll ---------- */
    const observerOptions = { 
        threshold: 0.1, 
        rootMargin: '0px 0px -50px 0px' 
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    document.querySelectorAll('.card, .formation, .hero-content').forEach(el => {
        observer.observe(el);
    });

    // Animation pour les cartes au chargement
    setTimeout(() => {
        document.querySelectorAll('.card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
        
        document.querySelectorAll('.formation').forEach((formation, index) => {
            formation.style.animationDelay = `${index * 0.1}s`;
        });
    }, 100);

    /* ---------- Effet de survol amélioré pour les cartes ---------- */
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '1';
        });
    });

    /* ---------- Validation du formulaire ---------- */
    window.validateForm = function(formId) {
        const form = document.getElementById(formId);
        if (!form) return false;
        
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                input.style.borderColor = '#10b981';
            }
        });
        
        return isValid;
    };

    // Masquer le header au scroll down, le montrer au scroll up
    let lastScroll = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scroll down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scroll up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });
});