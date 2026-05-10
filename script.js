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

// إعدادات النظام
const systemConfig = {
    DefaultConsultationFee: 150, // رسوم الكشف الافتراضية
    doctorFees: {
        'Dr. Sarah Ahmed': 200,
        'Dr. Khaled Aly': 250,
        'Dr. Yassin Mansour': 180,
        'Dr. Ibrahim Noah': 220,
        'Dr. Mona Hassan': 160,
        'Dr. Ziad Amer': 170,
        'Dr. Omar Farouk': 140,
        'Dr. Laila Kamel': 150
    }
};

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

// وظائف النظام الذكي للحجز

// 1. الحفظ التلقائي في sessionStorage
function autoSave() {
    const formData = {
        name: document.getElementById('pName').value,
        phone: document.getElementById('pPhone').value,
        department: document.getElementById('deptSelect').value,
        doctor: document.getElementById('docSelect').value,
        date: document.getElementById('appDate').value,
        time: document.getElementById('appTime').value,
        whatsappReminder: document.getElementById('whatsappReminder').checked
    };
    sessionStorage.setItem('bookingFormData', JSON.stringify(formData));
}

// 2. استعادة البيانات من sessionStorage
function restoreFormData() {
    const savedData = sessionStorage.getItem('bookingFormData');
    if (savedData) {
        const data = JSON.parse(savedData);
        document.getElementById('pName').value = data.name || '';
        document.getElementById('pPhone').value = data.phone || '';
        document.getElementById('deptSelect').value = data.department || '';
        if (data.department) {
            updateDoctors();
            document.getElementById('docSelect').value = data.doctor || '';
        }
        document.getElementById('appDate').value = data.date || '';
        document.getElementById('appTime').value = data.time || '';
        document.getElementById('whatsappReminder').checked = data.whatsappReminder || false;
        
        // تحديث التحقق والملخص بعد الاستعادة
        validateAllFields();
        updateLiveSummary();
        if (data.doctor) updateConsultationFee();
    }
}

// 3. التحقق اللحظي من الحقول
function validateField(fieldId, validationId, validator) {
    const field = document.getElementById(fieldId);
    const validationIcon = document.getElementById(validationId);
    
    field.addEventListener('input', () => {
        const isValid = validator(field.value);
        validationIcon.className = 'validation-icon ' + (isValid ? 'valid' : 'invalid');
        validationIcon.innerHTML = isValid ? '✓' : '✗';
        autoSave();
        updateLiveSummary();
    });
    
    field.addEventListener('blur', () => {
        if (!field.value.trim()) {
            validationIcon.className = 'validation-icon';
        }
    });
}

function validateAllFields() {
    const name = document.getElementById('pName').value;
    const phone = document.getElementById('pPhone').value;
    const dept = document.getElementById('deptSelect').value;
    const doc = document.getElementById('docSelect').value;
    const date = document.getElementById('appDate').value;
    const time = document.getElementById('appTime').value;
    
    // تحديث أيقونات التحقق
    document.getElementById('nameValidation').className = 'validation-icon ' + (name.length >= 3 ? 'valid' : name ? 'invalid' : '');
    document.getElementById('nameValidation').innerHTML = name.length >= 3 ? '✓' : name ? '✗' : '';
    
    document.getElementById('phoneValidation').className = 'validation-icon ' + (/^01[0-9]{9}$/.test(phone) ? 'valid' : phone ? 'invalid' : '');
    document.getElementById('phoneValidation').innerHTML = /^01[0-9]{9}$/.test(phone) ? '✓' : phone ? '✗' : '';
    
    document.getElementById('deptValidation').className = 'validation-icon ' + (dept ? 'valid' : '');
    document.getElementById('deptValidation').innerHTML = dept ? '✓' : '';
    
    document.getElementById('docValidation').className = 'validation-icon ' + (doc ? 'valid' : '');
    document.getElementById('docValidation').innerHTML = doc ? '✓' : '';
    
    document.getElementById('dateValidation').className = 'validation-icon ' + (date ? 'valid' : '');
    document.getElementById('dateValidation').innerHTML = date ? '✓' : '';
    
    document.getElementById('timeValidation').className = 'validation-icon ' + (time ? 'valid' : '');
    document.getElementById('timeValidation').innerHTML = time ? '✓' : '';
}

// 4. تحديث رسوم الكشف
function updateConsultationFee() {
    const doctor = document.getElementById('docSelect').value;
    const feeDisplay = document.getElementById('feeDisplay');
    
    if (doctor && systemConfig.doctorFees[doctor]) {
        feeDisplay.innerHTML = `<i class="fa-solid fa-dollar-sign"></i> Consultation Fee: ${systemConfig.doctorFees[doctor]} EGP`;
    } else if (doctor) {
        feeDisplay.innerHTML = `<i class="fa-solid fa-dollar-sign"></i> Consultation Fee: ${systemConfig.DefaultConsultationFee} EGP`;
    } else {
        feeDisplay.innerHTML = '';
    }
}

// 5. الملخص اللحظي
function updateLiveSummary() {
    const summaryText = document.getElementById('summaryText');
    const dept = document.getElementById('deptSelect').value;
    const doctor = document.getElementById('docSelect').value;
    const date = document.getElementById('appDate').value;
    const time = document.getElementById('appTime').value;
    
    if (dept && doctor && date && time) {
        const formattedDate = new Date(date).toLocaleDateString('ar-EG', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        summaryText.innerHTML = `You are currently booking in the ward <strong>${dept}</strong> with Doctor <strong>${doctor}</strong> Day <strong>${formattedDate}</strong> The hour <strong>${time}</strong>`;
    } else {
        summaryText.innerHTML = 'Complete the form to see your booking details...';
    }
}

// 6. منع الحجز المزدوج
function checkDoubleBooking() {
    const doctor = document.getElementById('docSelect').value;
    const date = document.getElementById('appDate').value;
    const time = document.getElementById('appTime').value;
    
    if (!doctor || !date || !time) return;
    
    const bookings = JSON.parse(localStorage.getItem('myBookings')) || [];
    const conflict = bookings.find(booking => 
        booking.doctor === doctor && 
        booking.date === date && 
        booking.time === time &&
        booking.status !== 'Cancelled'
    );
    
    if (conflict) {
        showToast('Sorry, this appointment is already booked with Dr. Mukhtar, please choose another appointment.', 'error');
        document.getElementById('appTime').value = '';
        document.getElementById('timeValidation').className = 'validation-icon invalid';
        document.getElementById('timeValidation').innerHTML = '✗';
    }
}

// 7. عرض التنبيهات (Toast)
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <h4>${type === 'success' ? '✅ Completed successfully' : '❌ Error'}</h4>
        <p>${message}</p>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

function updateDoctors() {
    const dept = document.getElementById('deptSelect').value;
    const select = document.getElementById('docSelect');
    select.innerHTML = '<option value="">Select Doctor First</option>';
    if(doctors[dept]) {
        doctors[dept].forEach(d => {
            let op = document.createElement('option');
            op.value = d; op.innerText = d;
            select.appendChild(op);
        });
    }
    updateLiveSummary();
    autoSave();
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

        // التحقق من صحة جميع الحقول
        const name = document.getElementById('pName').value;
        const phone = document.getElementById('pPhone').value;
        const dept = document.getElementById('deptSelect').value;
        const doctor = document.getElementById('docSelect').value;
        const date = document.getElementById('appDate').value;
        const time = document.getElementById('appTime').value;

        if (!name || !phone || !dept || !doctor || !date || !time) {
            showToast('Please fill in all required fields', 'error');
            return;
        }

        if (!/^01[0-9]{9}$/.test(phone)) {
            showToast('Please enter a valid phone number (11 digits starting with 01)', 'error');
            return;
        }

        // فحص الحجز المزدوج مرة أخيرة
        const bookings = JSON.parse(localStorage.getItem('myBookings')) || [];
        const conflict = bookings.find(booking => 
            booking.doctor === doctor && 
            booking.date === date && 
            booking.time === time &&
            booking.status !== 'Cancelled'
        );

        if (conflict) {
            showToast('Sorry, this appointment is already booked with Dr. Mukhtar, please choose another appointment.', 'error');
            return;
        }

        // سحب طريقة الدفع وتفاصيلها الإضافية
        const payMethod = document.querySelector('input[name="pay"]:checked').value;
        let details = "Cash payment";

        if (payMethod === 'visa') {
            const cardInp = document.querySelector('#visaDetails input');
            details = cardInp.value ? cardInp.value : "Without data";
        } else if (payMethod === 'vodafone') {
            const phoneInp = document.querySelector('#vodafoneDetails input');
            details = phoneInp.value ? phoneInp.value : "Without data";
        }

        const whatsappReminder = document.getElementById('whatsappReminder').checked;

        const newBooking = {
            id: "#" + Math.floor(Math.random() * 9000 + 1000),
            patient: name,
            phone: phone,
            dept: dept,
            doctor: doctor,
            date: date,
            time: time,
            payment: payMethod,
            paymentDetails: details,
            whatsappReminder: whatsappReminder,
            consultationFee: systemConfig.doctorFees[doctor] || systemConfig.DefaultConsultationFee,
            status: 'Pending',
            createdAt: new Date().toISOString()
        };

        bookings.push(newBooking);
        localStorage.setItem('myBookings', JSON.stringify(bookings));
        localStorage.setItem('myBookings_lastUpdated', new Date().toISOString());

        // مسح sessionStorage بعد الحجز الناجح
        sessionStorage.removeItem('bookingFormData');

        // إظهار رسالة النجاح
        showToast('The appointment has been successfully booked! You will be contacted soon.', 'success');
        setTimeout(() => {
            document.getElementById('successModal').style.display = 'grid';
        }, 1000);
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
    // مسح البيانات المحفوظة
    sessionStorage.removeItem('bookingFormData');
    // إعادة ضبط التحقق والملخص
    document.querySelectorAll('.validation-icon').forEach(icon => {
        icon.className = 'validation-icon';
    });
    document.getElementById('summaryText').innerHTML = 'Complete the form to see your booking details...';
    document.getElementById('feeDisplay').innerHTML = '';
}

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // استعادة البيانات المحفوظة
    restoreFormData();
    
    // إعداد التحقق اللحظي
    validateField('pName', 'nameValidation', value => value.length >= 3);
    validateField('pPhone', 'phoneValidation', value => /^01[0-9]{9}$/.test(value));
    
    // إعداد مستمعي الأحداث للتحديثات
    document.getElementById('deptSelect').addEventListener('change', () => {
        validateAllFields();
        autoSave();
    });
    
    document.getElementById('docSelect').addEventListener('change', () => {
        validateAllFields();
        autoSave();
        updateConsultationFee();
        checkDoubleBooking();
    });
    
    document.getElementById('appDate').addEventListener('change', () => {
        validateAllFields();
        autoSave();
        checkDoubleBooking();
    });
    
    document.getElementById('appTime').addEventListener('change', () => {
        validateAllFields();
        autoSave();
        checkDoubleBooking();
    });
    
    document.getElementById('whatsappReminder').addEventListener('change', autoSave);
    
    // تحديث الملخص عند التغييرات
    ['pName', 'pPhone', 'deptSelect', 'docSelect', 'appDate', 'appTime'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateLiveSummary);
        document.getElementById(id).addEventListener('change', updateLiveSummary);
    });
});


