// script.js
document.addEventListener('DOMContentLoaded', () => {
    /* ---------- Header hamburger ---------- */
    const hamburger = document.getElementById('hamburger');
    const navList = document.querySelector('.main-nav ul');

    hamburger?.addEventListener('click', () => {
        navList.classList.toggle('show');
    });

    /* ---------- Smooth anchor scroll ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e){
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            e.preventDefault();
            const el = document.querySelector(targetId);
            if (el) {
                const offset = Math.max(0, el.offsetTop - 70);
                window.scrollTo({ top: offset, behavior: 'smooth' });
                // close mobile menu if open
                if (navList.classList.contains('show')) navList.classList.remove('show');
            }
        });
    });

    /* ---------- Purchase buttons (replaces alert with modal-light) ---------- */
    function openLightbox(title) {
        // simple accessible lightbox
        const existing = document.getElementById('lightbox');
        if (existing) existing.remove();

        const box = document.createElement('div');
        box.id = 'lightbox';
        box.style.position = 'fixed';
        box.style.inset = '0';
        box.style.display = 'flex';
        box.style.alignItems = 'center';
        box.style.justifyContent = 'center';
        box.style.background = 'rgba(0,0,0,0.5)';
        box.style.zIndex = '9999';

        const panel = document.createElement('div');
        panel.style.background = '#fff';
        panel.style.padding = '18px';
        panel.style.borderRadius = '10px';
        panel.style.maxWidth = '420px';
        panel.style.width = '92%';
        panel.innerHTML = `
            <h3 style="margin-bottom:8px;color:#1e3a8a">${escapeHtml(title)}</h3>
            <p style="margin-bottom:12px">Merci pour votre intérêt ! Laissez vos coordonnées et nous vous contacterons.</p>
            <form id="buyForm">
                <div style="display:flex;gap:8px;margin-bottom:8px">
                    <input name="name" placeholder="Nom complet" required style="flex:1;padding:8px;border:1px solid #ddd;border-radius:6px" />
                </div>
                <div style="display:flex;gap:8px;margin-bottom:14px">
                    <input name="phone" placeholder="Téléphone" required style="flex:1;padding:8px;border:1px solid #ddd;border-radius:6px" />
                </div>
                <div style="display:flex;gap:8px;justify-content:flex-end">
                    <button type="button" id="cancelBtn" style="background:#eee;border:none;padding:8px 12px;border-radius:6px;cursor:pointer">Annuler</button>
                    <button type="submit" style="background:#1e40af;color:#fff;border:none;padding:8px 12px;border-radius:6px;cursor:pointer">Envoyer</button>
                </div>
            </form>
        `;
        box.appendChild(panel);
        document.body.appendChild(box);

        document.getElementById('cancelBtn').addEventListener('click', () => box.remove());
        document.getElementById('buyForm').addEventListener('submit', (ev) => {
            ev.preventDefault();
            // simulate sending
            panel.innerHTML = `<h3 style="color:#1e3a8a">Merci !</h3><p>Nous avons bien reçu votre demande pour "<strong>${escapeHtml(title)}</strong>". Nous vous contacterons bientôt.</p>`;
            setTimeout(() => box.remove(), 2500);
        });
    }

    document.querySelectorAll('.btn-acheter').forEach(btn => {
        btn.addEventListener('click', function(){
            const titre = this.closest('.card').querySelector('h3')?.textContent?.trim() || 'livre';
            openLightbox(titre);
        });
    });

    function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]); }

    /* ---------- Intersection animations (fade-in) ---------- */
    const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, observerOptions);

    document.querySelectorAll('.card, .formation, .hero-content').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    /* ---------- Carousel implementation ---------- */
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track?.children || []);
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    const dotsNav = document.querySelector('.carousel-dots');
    let currentIndex = 0;
    const slideWidth = slides[0] ? slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(slides[0]).marginRight || 0) : 320;
    let autoPlayTimer = null;
    const AUTOPLAY_INTERVAL = 4000;

    // set positions (flex so we use transform by index)
    function moveToIndex(index, animate = true){
        if (!track) return;
        index = Math.max(0, Math.min(index, slides.length - 1));
        currentIndex = index;
        const x = -index * (slides[0].getBoundingClientRect().width + 16); // 16 ~ gap
        if (!animate) track.style.transition = 'none';
        else track.style.transition = '';
        track.style.transform = `translateX(${x}px)`;
        updateDots();
    }

    // dots
    function createDots(){
        if (!dotsNav) return;
        dotsNav.innerHTML = '';
        slides.forEach((s, i) => {
            const btn = document.createElement('button');
            btn.setAttribute('aria-label', `Aller au livre ${i+1}`);
            btn.addEventListener('click', () => {
                moveToIndex(i);
                restartAutoplay();
            });
            dotsNav.appendChild(btn);
        });
        updateDots();
    }
    function updateDots(){
        if (!dotsNav) return;
        Array.from(dotsNav.children).forEach((b, i)=> b.classList.toggle('active', i === currentIndex));
    }

    // controls
    prevBtn?.addEventListener('click', () => { moveToIndex(currentIndex - 1); restartAutoplay(); });
    nextBtn?.addEventListener('click', () => { moveToIndex(currentIndex + 1); restartAutoplay(); });

    // autoplay
    function startAutoplay(){
        stopAutoplay();
        autoPlayTimer = setInterval(()=> {
            const next = currentIndex + 1 < slides.length ? currentIndex + 1 : 0;
            moveToIndex(next);
        }, AUTOPLAY_INTERVAL);
    }
    function stopAutoplay(){ if (autoPlayTimer) clearInterval(autoPlayTimer); autoPlayTimer = null; }
    function restartAutoplay(){ stopAutoplay(); startAutoplay(); }

    // swipe for touch devices
    (function enableSwipe(){
        if (!track) return;
        let startX = 0, dx = 0, touching = false;
        track.addEventListener('touchstart', (e) => {
            touching = true;
            startX = e.touches[0].clientX;
            track.style.transition = 'none';
            stopAutoplay();
        });
        track.addEventListener('touchmove', (e) => {
            if (!touching) return;
            dx = e.touches[0].clientX - startX;
            track.style.transform = `translateX(${ -currentIndex * (slides[0].getBoundingClientRect().width + 16) + dx }px)`;
        });
        track.addEventListener('touchend', () => {
            touching = false;
            const threshold = 60;
            if (dx > threshold) moveToIndex(currentIndex - 1);
            else if (dx < -threshold) moveToIndex(currentIndex + 1);
            else moveToIndex(currentIndex);
            dx = 0;
            restartAutoplay();
        });
    })();

    // keyboard accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { moveToIndex(currentIndex + 1); restartAutoplay(); }
        if (e.key === 'ArrowLeft') { moveToIndex(currentIndex - 1); restartAutoplay(); }
    });

    // init
    if (slides.length){
        createDots();
        moveToIndex(0, false);
        startAutoplay();
        // recompute positions on resize
        window.addEventListener('resize', () => {
            moveToIndex(currentIndex, false);
        });
    }
});
