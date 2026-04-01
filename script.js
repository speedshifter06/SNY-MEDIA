// JS

// 1. Dynamic Year
document.getElementById('year').textContent = new Date().getFullYear();

// 2. Hardware Haptic Feedback (మొబైల్స్ లో టచ్ ఫీల్ కోసం)
function hapticFeedback(type = 'light') {
    if (!navigator.vibrate) return;
    try {
        if (type === 'light') navigator.vibrate(15);
        else if (type === 'success') navigator.vibrate([15, 30, 20]);
    } catch (e) {}
}

// 3. Navigation System (స్మూత్ స్క్రోలింగ్ & పేజ్ చేంజ్)
function navigate(pageId, pushToHistory = true) {
    // అన్ని పేజీలను హైడ్ చేసి, కావలసిన పేజీని మాత్రమే చూపించడం
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // బ్రౌజర్ హిస్టరీ అప్‌డేట్
    if (pushToHistory) history.pushState({ page: pageId }, '', `#${pageId}`);
}

// బటన్స్ క్లిక్ చేసినప్పుడు ఈ ఫంక్షన్ రన్ అవుతుంది
function handleNav(pageId) {
    hapticFeedback('light');
    navigate(pageId);
    // ఒకవేళ డీప్ పేజీలో ఉంటే, దాన్ని క్లోజ్ చేసి మెయిన్ పేజీకి వెళ్లాలి
    document.querySelectorAll('.deep-page').forEach(dp => dp.classList.remove('active'));
}

// బ్రౌజర్ బ్యాక్ బటన్ నొక్కినప్పుడు
window.addEventListener('popstate', (event) => {
    navigate(event.state && event.state.page ? event.state.page : 'home', false);
});

// 4. Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileOverlay = document.getElementById('mobileNav');

function toggleMobileMenu() {
    hapticFeedback('light');
    mobileOverlay.classList.toggle('active');
}

// 5. Immersive Deep Pages (సర్వీసెస్ & ప్లాన్స్ కోసం కొత్త పేజీల్లా ఓపెన్ అవ్వడం)
function openDeepPage(id) {
    hapticFeedback('light');
    const page = document.getElementById(id);
    page.classList.add('active');
    page.scrollTo({ top: 0 }); // పైకి స్క్రోల్ అవ్వాలి
    
    // Web Dev పేజీ ఓపెన్ చేస్తే టైపింగ్ ఎఫెక్ట్ స్టార్ట్ అవ్వాలి
    if(id === 'page-web') startTypingEffect();
}

function closeDeepPage(id) {
    hapticFeedback('light');
    document.getElementById(id).classList.remove('active');
}

// 6. Web Dev Modal - Typing Effect 
function startTypingEffect() {
    const codeElement = document.getElementById('code-typer');
    codeElement.innerHTML = ''; // పాతది క్లియర్ చేయడం
    const codeStr = `const SNY = {
  build: "Lightning Fast",
  ui: "Flawless",
  conversion: "Peak"
};
function deploy() {
  console.log("Success");
}
deploy();`;
    
    let i = 0;
    // పాత టైమర్ ఉంటే క్లియర్ చేయాలి
    if(window.typingInterval) clearInterval(window.typingInterval);
    
    window.typingInterval = setInterval(() => {
        if(i < codeStr.length) {
            codeElement.innerHTML += codeStr.charAt(i);
            i++;
        } else {
            clearInterval(window.typingInterval);
        }
    }, 50); // 50ms కి ఒక లెటర్ టైప్ అవుతుంది
}

// 7. Initialize Application
window.addEventListener('DOMContentLoaded', () => {
    // లింక్ లో ఉన్న హ్యాష్ (#) బట్టి పేజీ లోడ్ అవ్వడం
    const hash = window.location.hash.replace('#', '');
    const validPages = ['home', 'services', 'pricing', 'about', 'contact'];
    const initialPage = validPages.includes(hash) ? hash : 'home';
    
    if (!history.state) history.replaceState({ page: initialPage }, '', `#${initialPage}`);
    navigate(initialPage, false);
});