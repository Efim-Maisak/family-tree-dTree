export const showLoginForm = () => {
    document.getElementById('login-overlay').style.display = 'flex';
    document.querySelector('.header-panel').style.display = 'none';
    document.querySelector('.zoom-panel').style.display = 'none';
    document.getElementById('graph').style.display = 'none';
};