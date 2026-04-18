// 1. تبديل الوضع الداكن وحفظه
const themeBtn = document.getElementById('theme-btn');
const themeIcon = themeBtn.querySelector('i');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') themeIcon.classList.replace('fa-moon', 'fa-sun');
}

themeBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
});

// 2. تأثير النافبار عند السكرول (Shrink)
window.addEventListener('scroll', () => {
    const nav = document.getElementById('main-nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// 3. اللوجو يرجعك للقمة
document.getElementById('site-logo').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// استهداف كل اللينكات اللي في النافبار
const navLinks = document.querySelectorAll('.nav-link');

// وظيفة لتغيير الـ Active عند الضغط بالماوس
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        navLinks.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    });
});

// وظيفة الـ Scroll Spy
window.addEventListener('scroll', () => {
    let current = "";
    const sections = document.querySelectorAll('header, section'); 

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// 1. بيانات الدكاترة (4 تخصصات)
const doctors = { 
    Cardiology: ['Dr. Sarah Ahmed', 'Dr. Khaled Aly'], 
    Surgery: ['Dr. Yassin Mansour', 'Dr. Ibrahim Noah'], 
    Dental: ['Dr. Mona Hassan', 'Dr. Ziad Amer'],
    Pediatrics: ['Dr. Omar Farouk', 'Dr. Laila Kamel']
};

function updateDoctors() {
    const dept = document.getElementById('deptSelect').value;
    const select = document.getElementById('docSelect');
    select.innerHTML = '<option value="">Select Doctor</option>';
    if(doctors[dept]) {
        doctors[dept].forEach(d => {
            let op = document.createElement('option');
            op.value = d; op.innerText = d;
            select.appendChild(op);
        });
    }
}

// 2. اختصار كيبورد سري لفتح الداشبورد (Alt + Shift + D)
window.addEventListener('keydown', (e) => {
    if (e.altKey && e.shiftKey && e.code === 'KeyD') {
        window.location.href = 'dashboard.html'; 
    }
});

// 3. معالجة الفورم وحفظ البيانات للداشبورد (الجزء المعدل للربط الكامل)
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // سحب طريقة الدفع وتفاصيلها الإضافية
        const payMethod = document.querySelector('input[name="pay"]:checked').value;
        let details = "دفع نقدي";

        if (payMethod === 'visa') {
            const cardInp = document.querySelector('#visaDetails input');
            details = cardInp.value ? cardInp.value : "بدون بيانات";
        } else if (payMethod === 'vodafone') {
            const phoneInp = document.querySelector('#vodafoneDetails input');
            details = phoneInp.value ? phoneInp.value : "بدون بيانات";
        }

        const newBooking = {
            id: "#" + Math.floor(Math.random() * 9000 + 1000),
            patient: document.getElementById('pName').value,
            dept: document.getElementById('deptSelect').value,
            doctor: document.getElementById('docSelect').value,
            date: document.getElementById('appDate').value,
            time: document.getElementById('appTime').value,
            payment: payMethod,
            paymentDetails: details, // الربط مع الداشبورد لظهور التفاصيل
            status: 'Pending'
        };

        let bookings = JSON.parse(localStorage.getItem('myBookings')) || [];
        bookings.push(newBooking);
        localStorage.setItem('myBookings', JSON.stringify(bookings));

        // إظهار رسالة النجاح
        document.getElementById('successModal').style.display = 'grid';
    });
}

// التحكم في إظهار وإخفاء حقول الدفع
const visaDetails = document.getElementById('visaDetails');
const vodafoneDetails = document.getElementById('vodafoneDetails');
const allRadios = document.querySelectorAll('input[name="pay"]');

allRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        visaDetails.style.display = 'none';
        vodafoneDetails.style.display = 'none';

        if (radio.value === 'visa') {
            visaDetails.style.display = 'block';
        }
        if (radio.value === 'vodafone') {
            vodafoneDetails.style.display = 'block';
        }
    });
});

// دالة إغلاق المودال وإعادة ضبط الفورم
function closeModal() {
    document.getElementById('successModal').style.display = 'none';
    document.getElementById('bookingForm').reset();
    // إخفاء حقول الدفع عند الريسيت
    visaDetails.style.display = 'none';
    vodafoneDetails.style.display = 'none';
}