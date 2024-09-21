// Кастомное выравнивание графа по центру, так как функция ZoomToFit из библиотеки dTree работает с ошибкой.

export const customZoomToFit = (tree, graph) => {

    const svgElement = d3.select(`${graph} svg`);
    const gElement = svgElement.select('g');
    console.log(gElement);
    const bounds = gElement.node().getBBox();


    const fullWidth = parseFloat(svgElement.attr('width') || svgElement.style('width'));
    const fullHeight = parseFloat(svgElement.attr('height') || svgElement.style('height'));

    const width = bounds.width;
    const height = bounds.height;

    // Рассчитываем масштаб, но ограничиваем его максимальное значение
    let scale = 0.8 * Math.min(fullWidth / width, fullHeight / height);
    const maxScale = 2; // Максимальный масштаб
    scale = Math.min(scale, maxScale);

    if (isNaN(scale) || !isFinite(scale)) {
        console.warn('Invalid scale calculated. Using scale = 1');
        scale = 1;
    }

    // Расчет x и y с учетом центра графа и ограничения масштаба
    let x = bounds.x + width / 2;
    let y = bounds.y + height / 2;

    // Корректировка для центрирования
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;
    x += (fullWidth / scale - scaledWidth) / (2 * scale);
    y += (fullHeight / scale - scaledHeight) / (2 * scale);

    if (isNaN(x) || !isFinite(x) || isNaN(y) || !isFinite(y)) {
        console.warn('Invalid x or y calculated. Using x = 0, y = 0');
        x = 0;
        y = 0;
    }

    console.log(bounds);
    console.log(`fullWidth: ${fullWidth} fullHeight: ${fullHeight}`);
    console.log(`bounds.width: ${width} bounds.height: ${height}`);
    console.log(`scale: ${scale}`);
    console.log(`x: ${x} y: ${y}`);

    tree.zoomTo(x, y, scale, 500);
}