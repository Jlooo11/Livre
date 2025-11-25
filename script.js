document.addEventListener('DOMContentLoaded', () => {

    /* Menu Hamburger */
    const hamburger = document.getElementById('hamburger');
    const navList = document.querySelector('.main-nav ul');

    hamburger.addEventListener('click', () => {
        navList.classList.toggle('show');
    });

    /* Scroll Doux */
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
        a.addEventListener('click',e=>{
            const id=a.getAttribute('href');
            if(id?.length>1){
                e.preventDefault();
                document.querySelector(id).scrollIntoView({behavior:"smooth"});
                navList.classList.remove('show');
            }
        });
    });

    /* Lightbox Achat */
    document.querySelectorAll(".btn-acheter").forEach(btn=>{
        btn.addEventListener("click",()=>{
            const titre = btn.closest(".card").querySelector("h3").textContent;

            const box=document.createElement("div");
            box.id="lightbox";
            box.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:9999";

            const panel=document.createElement("div");
            panel.style.cssText="background:white;padding:20px;border-radius:10px;width:90%;max-width:400px";
            panel.innerHTML=`
                <h3 style="color:#1e3a8a">${titre}</h3>
                <p>Laissez vos coordonnées pour finaliser l'achat.</p>
                <form id="buyForm">
                    <input placeholder="Nom" required style="width:100%;margin:8px 0;padding:8px;border:1px solid #ccc;border-radius:6px">
                    <input placeholder="Téléphone" required style="width:100%;margin:8px 0;padding:8px;border:1px solid #ccc;border-radius:6px">
                    <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:10px">
                        <button type="button" id="closeBtn" style="background:#eee;border:none;padding:8px 12px;border-radius:6px">Annuler</button>
                        <button type="submit" style="background:#1e40af;color:white;border:none;padding:8px 12px;border-radius:6px">Envoyer</button>
                    </div>
                </form>
            `;

            box.appendChild(panel);
            document.body.appendChild(box);

            document.getElementById("closeBtn").onclick=()=>box.remove();
            document.getElementById("buyForm").onsubmit=e=>{
                e.preventDefault();
                panel.innerHTML=`<h3 style="color:#1e3a8a">Merci !</h3><p>Nous vous contacterons bientôt.</p>`;
                setTimeout(()=>box.remove(),2500);
            };
        });
    });

});
