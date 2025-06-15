// Кастомное выравнивание графа по центру, так как функция ZoomToFit из библиотеки dTree работает с ошибкой.


export const customZoomToFit = (tree, graph) => {
    const svgElement = d3.select(`${graph} svg`);
    const gElement = svgElement.select('g');

    if (!gElement.node()) {
        return;
    }

    const bounds = gElement.node().getBBox();
    const svgNode = svgElement.node();

    if (!svgNode || !bounds) {
        return;
    }

    // Получаем размеры контейнера
    const containerRect = svgNode.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;

    if (width === 0 || height === 0 || bounds.width === 0 || bounds.height === 0) {
        return;
    }

    // Параметры отступов
    const padding = 80;

    // Рассчитываем масштаб
    const scaleX = (width - padding * 2) / bounds.width;
    const scaleY = (height - padding * 2) / bounds.height;
    let scale = Math.min(scaleX, scaleY);

    // Ограничиваем масштаб
    scale = Math.min(Math.max(scale, 0.1), 2);

    // Рассчитываем смещение для центрирования
    const offsetX = (width - bounds.width * scale) / 2 - bounds.x * scale;
    const offsetY = (height - bounds.height * scale) / 2 - bounds.y * scale;

    // Сначала сбрасываем zoom к начальному состоянию
    if (tree.resetZoom) {
        tree.resetZoom(0); // Без анимации
    }

    // Небольшая задержка для завершения reset
    setTimeout(() => {
        // Создаем transform
        const transform = d3.zoomIdentity
            .translate(offsetX, offsetY)
            .scale(scale);

        // Пытаемся найти и обновить zoom behavior
        const zoomBehavior = tree._zoom || tree.zoom;

        if (zoomBehavior && svgElement.node()) {
            // Обновляем состояние zoom behavior
            svgElement.call(zoomBehavior.transform, transform);
        } else {
            // Fallback: прямое применение трансформации
            gElement.transition()
                .duration(500)
                .attr('transform', `translate(${offsetX},${offsetY}) scale(${scale})`);
        }
    }, 50);
};