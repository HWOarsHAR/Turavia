'use strict';

/* ========== Бургер-меню ========== */

const burger = document.querySelector('.burger');

const nav = document.querySelector('.nav');

if (burger && nav) {

    const closeMenu = () => {

        nav.classList.remove('nav_open');

        burger.setAttribute('aria-expanded', 'false');

        burger.setAttribute('aria-label', 'Открыть меню');

    };

    burger.addEventListener('click', () => {

        const isOpen = burger.getAttribute('aria-expanded') === 'true';

        nav.classList.toggle('nav_open', !isOpen);

        burger.setAttribute('aria-expanded', String(!isOpen));

        burger.setAttribute('aria-label', !isOpen ? 'Закрыть меню' : 'Открыть меню');

    });

    document.addEventListener('keydown', (e) => {

        if (e.key === 'Escape' && nav.classList.contains('nav_open')) {

            closeMenu();

            burger.focus();

        }

    });

    document.addEventListener('click', (e) => {

        if (

            nav.classList.contains('nav_open') &&

            !nav.contains(e.target) &&

            !burger.contains(e.target)

        ) {

            closeMenu();

        }

    });

}

/* ========== Модалка ========== */

const modal = document.getElementById('account-modal');

const modalOpeners = document.querySelectorAll('[data-modal="account"]');

const openModal = () => {

    if (!modal) return;

    modal.classList.add('modal_open');

    modal.setAttribute('aria-hidden', 'false');

    document.body.classList.add('modal-open');

    const firstInput = modal.querySelector('input, button');

    if (firstInput) firstInput.focus();

};

const closeModal = () => {

    if (!modal) return;

    modal.classList.remove('modal_open');

    modal.setAttribute('aria-hidden', 'true');

    document.body.classList.remove('modal-open');

};

modalOpeners.forEach((btn) => btn.addEventListener('click', openModal));

if (modal) {

    modal.querySelectorAll('[data-close-modal]').forEach((el) =>

        el.addEventListener('click', closeModal)

    );

    document.addEventListener('keydown', (e) => {

        if (e.key === 'Escape' && modal.classList.contains('modal_open')) {

            closeModal();

        }

    });

}

/* ========== Табы в модалке ========== */

const tabs = document.querySelectorAll('.tabs__button');

tabs.forEach((tab) => {

    tab.addEventListener('click', () => {

        const target = tab.dataset.tab;

        tabs.forEach((t) => {

            const active = t === tab;

            t.classList.toggle('tabs__button_active', active);

            t.setAttribute('aria-selected', String(active));

        });

        document.querySelectorAll('.account-form').forEach((form) => {

            form.classList.toggle('is-hidden', form.dataset.panel !== target);

        });

    });

});

/* ========== Проверка паролей ========== */

const registerForm = document.getElementById('register-form');

if (registerForm) {

    const pass = registerForm.querySelector('#reg-password');

    const confirm = registerForm.querySelector('#reg-confirm');

    const validate = () => {

        confirm.setCustomValidity(

            pass.value !== confirm.value ? 'Пароли не совпадают' : ''

        );

    };

    pass.addEventListener('input', validate);

    confirm.addEventListener('input', validate);

    registerForm.addEventListener('submit', (e) => {

        validate();

        if (!registerForm.checkValidity()) e.preventDefault();

    });

}

/* ========== Демо-отправка форм + тост ========== */

const showToast = (text) => {

    const toast = document.createElement('div');

    toast.className = 'toast';

    toast.textContent = text;

    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3200);

};

document.querySelectorAll('form[action^="/"]').forEach((form) => {

    form.addEventListener('submit', (e) => {

        if (!form.checkValidity()) return;

        e.preventDefault();

        showToast('Заявка отправлена. Мы свяжемся с вами.');

        form.reset();

    });

});

/* ===== Фиксация согласия на обработку ПД ===== */

document.querySelectorAll('form[action^="/"]').forEach((form) => {

    form.addEventListener('submit', () => {

        const privacy = form.querySelector('input[name="privacy"]');

        const newsletter = form.querySelector('input[name="newsletter"]');

        if (privacy && privacy.checked) {

            // На реальном бэкенде: сохранение в БД user_id, IP, user-agent, дата, версия политики

            console.info('[consent] Согласие получено:', {

                form: form.id || form.action,

                newsletter: !!(newsletter && newsletter.checked),

                timestamp: new Date().toISOString(),

                policyVersion: '2026-01-01'

            });

        }

    });

});