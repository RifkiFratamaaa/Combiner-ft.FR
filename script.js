/*
 * Script Kustom untuk Interaktivitas Halaman Portfolio
 * Termasuk: Preloader, Dark Mode, Navbar Scroll, Scroll-to-Top,
 * Smooth Scroll, Modal Portfolio Dinamis, Submit Form Kontak ke WhatsApp.
 */
document.addEventListener('DOMContentLoaded', function () {
    // Perubahan: Menghapus AOS.init() sepenuhnya untuk menghindari error
    // AOS dihapus sementara untuk memastikan hero-section muncul tanpa animasi

    // --- Variabel Global & Selektor Elemen ---
    // Tujuan: Menyimpan referensi ke elemen DOM yang sering digunakan
    const preloader = document.getElementById('preloader');
    const navbar = document.querySelector('.navbar');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const modeToggle = document.getElementById('modeToggle');
    const modeToggleText = document.getElementById('modeToggleText');
    const contactForm = document.getElementById('contactForm');
    const portfolioModalElement = document.getElementById('portfolioModal');
    const modalBody = document.getElementById('modalDetailBody');
    const modalTitle = document.getElementById('portfolioModalLabel');
    const modalProjectLink = document.getElementById('modalProjectLink');
    const portfolioItems = document.querySelectorAll('.portfolio-item .card');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link.scrollto');
    const currentYearSpan = document.getElementById('currentYear');

    // Inisialisasi Bootstrap Modal (jika elemen modal ada)
    let portfolioModalInstance = null;
    if (portfolioModalElement) {
        portfolioModalInstance = new bootstrap.Modal(portfolioModalElement);
    }

    // --- Fungsi Helper ---

    /**
     * Fungsi untuk mengatur Mode Gelap/Terang
     * @param {boolean} isDarkMode - True untuk mode gelap, false untuk mode terang.
     */
    function setMode(isDarkMode) {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            if (modeToggle) {
                modeToggle.innerHTML = '<i class="bi bi-brightness-high-fill"></i> <span id="modeToggleText">Mode Terang</span>';
            }
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            if (modeToggle) {
                modeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i> <span id="modeToggleText">Mode Gelap</span>';
            }
            localStorage.setItem('darkMode', 'disabled');
        }
    }

    // --- Inisialisasi & Event Listener ---

    // 1. Preloader Handler
    // Tujuan: Menyembunyikan preloader setelah halaman selesai dimuat
    window.addEventListener('load', function () {
        if (preloader) {
            preloader.classList.add('fade-out');
            preloader.addEventListener('transitionend', () => {
                preloader.style.display = 'none';
            });
        }
    });

    // 2. Dark/Light Mode Toggle Handler
    if (localStorage.getItem('darkMode') === 'enabled') {
        setMode(true);
    } else {
        setMode(false);
    }
    if (modeToggle) {
        modeToggle.addEventListener('click', function () {
            const isDarkMode = document.body.classList.contains('dark-mode');
            setMode(!isDarkMode);
        });
    }

    // 3. Navbar Scroll & Scroll-to-Top Button Handler
    function handleScroll() {
        const scrollY = window.scrollY;
        if (navbar) {
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        if (scrollToTopBtn) {
            if (scrollY > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        }
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // 4. Scroll To Top Button Click Handler
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 5. Smooth Scrolling for Navbar Links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = elementPosition - navbarHeight - 15;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    const navbarCollapse = document.getElementById('navbarNav');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        const toggler = document.querySelector('.navbar-toggler');
                        if (toggler) {
                            toggler.click();
                        }
                    }
                }
            }
        });
    });

    // 6. Update Active Nav Link on Scroll
    function updateActiveNavLink() {
        let currentSectionId = '';
        const scrollY = window.pageYOffset;
        const navHeight = navbar ? navbar.offsetHeight : 0;
        document.querySelectorAll('main section[id]').forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 50;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
        if (!currentSectionId && scrollY < (document.querySelector('main section[id]')?.offsetTop || 300)) {
            navLinks.forEach(link => link.classList.remove('active'));
            const homeLink = document.querySelector('.nav-link[href="#hero"]');
            if (homeLink) homeLink.classList.add('active');
        }
    }
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();

    // 7. Contact Form Handler (Submit to WhatsApp)
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const nameInput = contactForm.querySelector('#contactName');
            const emailInput = contactForm.querySelector('#contactEmail');
            const messageInput = contactForm.querySelector('#contactMessage');
            const subjectInput = contactForm.querySelector('#contactSubject');
            const formMessageDiv = document.getElementById('formMessage');
            formMessageDiv.innerHTML = '';
            if (!contactForm.checkValidity()) {
                contactForm.classList.add('was-validated');
                formMessageDiv.innerHTML = `<div class="alert alert-danger alert-dismissible fade show small p-2" role="alert">Harap periksa kembali isian Anda.<button type="button" class="btn-close p-2" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
                return;
            }
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();
            const subject = subjectInput ? subjectInput.value.trim() : '';
            let whatsappMessage = `*Pesan dari Website Portfolio* (${new Date().toLocaleString('id-ID')})\n\n`;
            whatsappMessage += `*Nama:* ${name}\n`;
            whatsappMessage += `*Email:* ${email}\n`;
            if (subject) {
                whatsappMessage += `*Subjek:* ${subject}\n`;
            }
            whatsappMessage += `\n*Pesan:*\n${message}\n\n`;
            whatsappMessage += `--------------------\n_Dikirim via formulir kontak._`;
            const phoneNumber = '6289678528877';
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            window.open(url, '_blank');
            formMessageDiv.innerHTML = `<div class="alert alert-success alert-dismissible fade show small p-2" role="alert">Berhasil! Anda akan diarahkan ke WhatsApp. Jika tidak, <a href="${url}" target="_blank" class="alert-link">klik di sini</a>.<button type="button" class="btn-close p-2" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
            setTimeout(() => {
                contactForm.reset();
                contactForm.classList.remove('was-validated');
            }, 7000);
        });
    }

    // 8. Portfolio Modal Dynamic Content Handler
    if (portfolioModalElement) {
        portfolioModalElement.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            if (!button) return;
            const title = button.getAttribute('data-project-title') || 'Detail Proyek';
            const category = button.getAttribute('data-project-category') || 'Lainnya';
            const imageSrc = button.getAttribute('data-project-image') || 'https://via.placeholder.com/800x600?text=Gambar+Tidak+Tersedia';
            const description = button.getAttribute('data-project-description') || 'Deskripsi proyek belum ditambahkan.';
            const tech = button.getAttribute('data-project-tech') || '';
            const link = button.getAttribute('data-project-link');
            if (modalTitle) {
                modalTitle.textContent = title;
            }
            let techBadgesHTML = 'Tidak disebutkan';
            if (tech) {
                techBadgesHTML = tech.split(',')
                    .map(t => t.trim())
                    .filter(t => t)
                    .map(t => `<span class="badge bg-secondary me-1 mb-1">${t}</span>`)
                    .join(' ');
            }
            if (modalBody) {
                modalBody.innerHTML = `
                    <img src="${imageSrc}" class="img-fluid rounded mb-4" alt="Gambar ${title}">
                    <h6 class="text-primary mb-1">Kategori: ${category}</h6>
                    <p>${description}</p>
                    <h6>Teknologi:</h6>
                    <p>${techBadgesHTML}</p>
                `;
            }
            if (modalProjectLink) {
                if (link && link !== '#') {
                    modalProjectLink.href = link;
                    modalProjectLink.style.display = 'inline-block';
                } else {
                    modalProjectLink.style.display = 'none';
                }
            }
        });
    }

    // 9. Keyboard Accessibility for Portfolio Items
    portfolioItems.forEach(itemCard => {
        itemCard.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                itemCard.click();
            }
        });
    });

    // 10. Update Copyright Year Dynamically
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

}); // Akhir dari DOMContentLoaded
