document.getElementById('year').textContent = new Date().getFullYear();

function hapticFeedback(type = 'light') {
    if (!navigator.vibrate) return;
    try {
        if (type === 'light') navigator.vibrate(15);
        else if (type === 'heavy') navigator.vibrate(40);
        else if (type === 'success') navigator.vibrate([15, 30, 20]);
    } catch (e) {}
}

function navigate(pageId, pushToHistory = true, scrollToTop = true) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        if(scrollToTop) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    if (pushToHistory) history.pushState({ type: 'page', id: pageId }, '', `#${pageId}`);
}

function handleNav(pageId) {
    hapticFeedback('light');
    const anyDeepPage = document.querySelector('.deep-page.active');
    if (anyDeepPage) {
        anyDeepPage.classList.remove('active');
        document.body.classList.remove('body-lock');
    }
    const mobileMenu = document.getElementById('mobileNav');
    const backdrop = document.getElementById('menuBackdrop');
    if(mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.classList.remove('body-lock');
    }
    navigate(pageId, true, true);
}

function openServiceFromFooter(id) {
    navigate('services', false, false); 
    openDeepPage(id);
}

function toggleMobileMenu() {
    hapticFeedback('light');
    const mobileOverlay = document.getElementById('mobileNav');
    const backdrop = document.getElementById('menuBackdrop');
    
    if (mobileOverlay.classList.contains('active')) {
        mobileOverlay.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.classList.remove('body-lock');
        history.back(); 
    } else {
        mobileOverlay.classList.add('active');
        backdrop.classList.add('active');
        document.body.classList.add('body-lock');
        history.pushState({ type: 'menu' }, '', '#menu'); 
    }
}

function openDeepPage(id) {
    hapticFeedback('light');
    const page = document.getElementById(id);
    page.classList.add('active');
    page.scrollTo({ top: 0 }); 
    document.body.classList.add('body-lock'); 
    
    history.pushState({ type: 'deep-page', id: id }, '', `#${id}`);
    if(id === 'page-web') startTypingEffect();
}

function closeDeepPage() {
    hapticFeedback('light');
    const activePage = document.querySelector('.deep-page.active');
    if(activePage) {
        activePage.classList.remove('active');
        document.body.classList.remove('body-lock');
        history.back();
    }
}

function showConsent(type, url) {
    hapticFeedback('heavy');
    const modal = document.getElementById('consentModal');
    const title = document.getElementById('consentTitle');
    const msg = document.getElementById('consentMessage');
    const confirmBtn = document.getElementById('consentConfirm');

    if(type === 'whatsapp') {
        title.innerText = "Let's Start the Conversation";
        msg.innerText = "You're heading to our official WhatsApp. We can't wait to hear about your project!";
    } else if(type === 'email') {
        title.innerText = "Send Us a Message";
        msg.innerText = "You are about to open your email app to write to us. Let's build something great.";
    } else {
        title.innerText = "Visit Our Profiles";
        msg.innerText = "You are heading to our official social media page. See you there!";
    }

    modal.classList.add('active');
    document.body.classList.add('body-lock');
    
    confirmBtn.onclick = function() {
        modal.classList.remove('active');
        document.body.classList.remove('body-lock');
        window.open(url, '_blank');
    }
}

function closeConsent() { 
    document.getElementById('consentModal').classList.remove('active'); 
    document.body.classList.remove('body-lock');
}

function limitWords(field, maxWords) {
    let words = field.value.split(/\s+/);
    if (words.length > maxWords) {
        field.value = words.slice(0, maxWords).join(" ");
    }
}

function submitForm(e) {
    e.preventDefault();
    hapticFeedback('heavy');
    
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    
    btn.innerText = "SENDING...";
    btn.disabled = true;

    const formData = new FormData(form);

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            hapticFeedback('success');
            form.reset(); 
            document.getElementById('successModal').classList.add('active');
            document.body.classList.add('body-lock');
        } else {
            alert("Something went wrong. Please try again.");
        }
    })
    .catch(error => {
        alert("Network error. Please try again.");
    })
    .finally(() => {
        btn.innerText = originalText;
        btn.disabled = false;
    });
}

function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
    document.body.classList.remove('body-lock');
}

window.addEventListener('popstate', (event) => {
    hapticFeedback('heavy');
    const state = event.state;
    
    const activeDeepPage = document.querySelector('.deep-page.active');
    if (activeDeepPage) {
        activeDeepPage.classList.remove('active');
        document.body.classList.remove('body-lock');
        return; 
    }

    const mobileOverlay = document.getElementById('mobileNav');
    const backdrop = document.getElementById('menuBackdrop');
    if (mobileOverlay.classList.contains('active')) {
        mobileOverlay.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.classList.remove('body-lock');
        return;
    }
    
    const consentModal = document.getElementById('consentModal');
    if (consentModal.classList.contains('active')) {
        consentModal.classList.remove('active');
        document.body.classList.remove('body-lock');
        return;
    }
    
    const successModal = document.getElementById('successModal');
    if (successModal.classList.contains('active')) {
        successModal.classList.remove('active');
        document.body.classList.remove('body-lock');
        return;
    }

    if (!state || state.type === 'root') {
        document.getElementById('exitModal').classList.add('active');
        document.body.classList.add('body-lock');
        history.pushState({ type: 'root', id: 'home' }, '', '#home');
    } else if (state && state.type === 'page') {
        navigate(state.id, false, false);
    }
});

function cancelExit() { 
    document.getElementById('exitModal').classList.remove('active'); 
    document.body.classList.remove('body-lock');
}
function confirmExit() { 
    document.getElementById('exitModal').classList.remove('active'); 
    document.body.classList.remove('body-lock');
    history.go(-2); 
}

function startTypingEffect() {
    const codeElement = document.getElementById('code-typer');
    if(!codeElement) return;
    codeElement.innerHTML = ''; 
    const codeStr = `const SNY = {\n  build: "Lightning Fast",\n  ui: "Flawless",\n  conversion: "Peak"\n};\nfunction deploy() {\n  console.log("Success");\n}\ndeploy();`;
    let i = 0;
    if(window.typingInterval) clearInterval(window.typingInterval);
    window.typingInterval = setInterval(() => {
        if(i < codeStr.length) {
            codeElement.innerHTML += codeStr.charAt(i);
            i++;
        } else {
            clearInterval(window.typingInterval);
        }
    }, 50); 
}

window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.replace('#', '');
    const validPages = ['home', 'services', 'portfolio', 'about', 'contact'];
    const initialPage = validPages.includes(hash) ? hash : 'home';
    
    history.replaceState({ type: 'root', id: initialPage }, '', `#${initialPage}`);
    history.pushState({ type: 'page', id: initialPage }, '', `#${initialPage}`);
    navigate(initialPage, false, true);
});
