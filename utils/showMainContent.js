export const showMainContent = () => {
    document.getElementById('login-overlay').style.display = 'none';
    document.querySelector('.header-panel').style.display = 'flex';
    document.querySelector('.zoom-panel').style.display = 'flex';
    document.getElementById('graph').style.display = 'block';
};