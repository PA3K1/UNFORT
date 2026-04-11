async function loadComponent(url, placeholderId) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        document.getElementById(placeholderId).innerHTML = html;
        return true;
    } catch (error) {
        console.error(`Ошибка загрузки компонента ${url}:`, error);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    await Promise.all([
        loadComponent('components/header.html', 'header-placeholder'),
        loadComponent('components/footer.html', 'footer-placeholder'),
        loadComponent('components/modals.html', 'modals-placeholder')
    ]);
    
    const event = new Event('componentsLoaded');
    document.dispatchEvent(event);
});