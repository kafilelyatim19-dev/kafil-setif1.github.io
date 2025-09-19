// وظائف الهاتف المحمول
const menuToggle = document.getElementById('menuToggle');
const closeMenu = document.getElementById('closeMenu');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');

function openMobileMenu() {
    mobileMenu.classList.add('active');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

if (menuToggle) menuToggle.addEventListener('click', openMobileMenu);
if (closeMenu) closeMenu.addEventListener('click', closeMobileMenu);
if (menuOverlay) menuOverlay.addEventListener('click', closeMobileMenu);

// إغلاق القائمة عند الضغط على Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
});

// تأثير تحريك الأرقام
function animateStats() {
    const statItems = document.querySelectorAll('.stat-item-new');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statItem = entry.target;
                const target = parseInt(statItem.dataset.target);
                const h3 = statItem.querySelector('h3');
                let current = 0;
                const increment = target / 100;
                
                statItem.classList.add('animate');
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    h3.textContent = Math.floor(current) + (target >= 1000 ? '+' : '');
                }, 20);
                
                // إلغاء المراقبة بعد تفعيل التأثير
                observer.unobserve(statItem);
            }
        });
    }, {
        threshold: 0.5
    });
    
    statItems.forEach(item => observer.observe(item));
}

// تحميل الأخبار من Google Sheets
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTaWg2aUOkXTaHxhG3q_zcro36m674If6iKZ2twqsCnODDS5RshOGiHC7MKCduhWb5YhzqonK1LmPLv/pub?output=csv";

async function loadNews() {
    const newsList = document.getElementById("news-list");
    
    // بيانات افتراضية في حالة عدم توفر الاتصال
    const defaultNews = [
        { date: "2025-01-15", event: "إطلاق حملة التدفئة الشتوية للأسر المحتاجة" },
        { date: "2025-01-10", event: "توزيع الحقائب المدرسية على 200 طالب" },
        { date: "2025-01-05", event: "افتتاح مركز التأهيل المهني للشباب" },
        { date: "2025-01-01", event: "تنظيم معرض الأعمال الخيرية السنوي" },
        { date: "2024-12-25", event: "توزيع الهدايا على الأطفال الأيتام" }
    ];

    try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        const rows = data.split("\n").slice(1); // تجاهل العنوان
        
        if (rows.length > 1 && rows[0].trim()) {
            newsList.innerHTML = "";
            const last5 = rows.slice(-5).reverse();

            last5.forEach(row => {
                if (row.trim()) {
                    const [date, event] = row.split(",");
                    if (date && event) {
                        const li = document.createElement("li");
                        li.innerHTML = `<strong>${date.trim()}</strong> - ${event.trim()}`;
                        newsList.appendChild(li);
                    }
                }
            });
        } else {
            // استخدام البيانات الافتراضية
            displayDefaultNews(defaultNews);
        }
    } catch (err) {
        console.log("Error fetching news:", err);
        // استخدام البيانات الافتراضية عند فشل التحميل
        displayDefaultNews(defaultNews);
    }
}

function displayDefaultNews(newsData) {
    const newsList = document.getElementById("news-list");
    newsList.innerHTML = "";
    
    newsData.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${item.date}</strong> - ${item.event}`;
        newsList.appendChild(li);
    });
}

// تأثير التمرير السلس للروابط الداخلية
function smoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// تأثير إخفاء/إظهار الهيدر عند التمرير
function headerScrollEffect() {
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // التمرير لأسفل - إخفاء الهيدر
            header.style.transform = 'translateY(-100%)';
        } else {
            // التمرير لأعلى - إظهار الهيدر
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// تأثير تحريك العناصر عند الظهور
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // مراقبة جميع العناصر التي تحتوي على class loading
    const elementsToObserve = document.querySelectorAll('.loading');
    elementsToObserve.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// وظيفة تحسين الأداء - تحميل مؤجل للصور (ميزة إضافية)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// إضافة تأثيرات التفاعل للبطاقات
function addCardInteractions() {
    const cards = document.querySelectorAll('#campaigns li, #projects li, .stat-item, #news-list li');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// تأثيرات خاصة للمربعين الجديدين
function addBankAndSocialInteractions() {
    // تأثيرات للبطاقات البنكية
    const bankItems = document.querySelectorAll('.bank-item');
    bankItems.forEach(item => {
        item.addEventListener('click', function() {
            // نسخ رقم الحساب عند النقر
            const accountNumber = this.querySelector('.account-number');
            if (accountNumber && navigator.clipboard) {
                navigator.clipboard.writeText(accountNumber.textContent.trim()).then(() => {
                    // إظهار رسالة نجاح
                    const originalText = accountNumber.textContent;
                    accountNumber.textContent = 'تم النسخ ✓';
                    accountNumber.style.background = '#4caf50';
                    accountNumber.style.color = 'white';
                    
                    setTimeout(() => {
                        accountNumber.textContent = originalText;
                        accountNumber.style.background = '';
                        accountNumber.style.color = '';
                    }, 2000);
                });
            }
        });
    });

    // تأثيرات لروابط الشبكات الاجتماعية
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // تأثير للخريطة
    const mapLink = document.querySelector('.map-link');
    if (mapLink) {
        mapLink.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });
        mapLink.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    }
}

// تشغيل جميع الوظائف بعد تحميل الصفحة بالكامل
window.addEventListener('load', () => {
    loadNews();
    animateStats();
    smoothScroll();
    headerScrollEffect();
    observeElements();
    addBankAndSocialInteractions();
});