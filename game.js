// Основные переменные
let scene, camera, renderer, clock;
let objects = [];
let collectedItems = 0;
let totalItems = 10;
let timeLeft = 30;
let timerText; // Переменная для хранения текста таймера

// Инициализация сцены
function init() {
    // Создание сцены
    scene = new THREE.Scene();

    // Камера
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.6, 5); // Камера на уровне глаз

    // Рендерер
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Добавляем освещение
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // мягкий белый свет
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // направленный свет
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // Добавляем таймер
    addTimerText();

    // Добавление объектов
    addCollectibles();

    // Добавление фонового неба
    const sky = new THREE.Sky();
    sky.scale.set(5000, 5000, 5000);
    scene.add(sky);

    // Управление камерой
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // плавное движение
    controls.dampingFactor = 0.25;

    // Анимация
    clock = new THREE.Clock();
    animate();

    // Слушаем события
    window.addEventListener('resize', onWindowResize);
}

// Добавление текста таймера
function addTimerText() {
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
        const geometry = new THREE.TextGeometry('Time: 30', {
            font: font,
            size: 1,
            height: 0.1,
        });

        const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        timerText = new THREE.Mesh(geometry, material);
        timerText.position.set(-4, 3, -5);
        scene.add(timerText);
    });
}

// Обновление таймера
function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timerText.geometry = new THREE.TextGeometry('Time: ' + timeLeft, {
            font: new THREE.FontLoader().parse({
                "family": "helvetiker_regular",
                "size": 1,
                "height": 0.1
            }),
            size: 1,
            height: 0.1,
        });
    } else {
        endGame();
    }
}

// Добавление объектов для сбора
function addCollectibles() {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xFF5733 });

    for (let i = 0; i < totalItems; i++) {
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(
            Math.random() * 20 - 10,
            1,
            Math.random() * 20 - 10
        );
        sphere.userData = { collected: false }; // Добавляем свойство для отслеживания собранных объектов
        objects.push(sphere);
        scene.add(sphere);
    }
}

// Завершаем игру
function endGame() {
    alert("Игра завершена! Вы собрали все объекты.");
    collectedItems = totalItems; // Все объекты собраны
    render();
}

// Анимация и рендеринг
function animate() {
    requestAnimationFrame(animate);

    // Проверка на коллизии с объектами
    checkCollisions();

    // Обновляем управление камерой
    const delta = clock.getDelta();
    renderer.render(scene, camera);
}

// Проверка столкновений с объектами
function checkCollisions() {
    objects.forEach((object) => {
        if (object.userData.collected) return; // Если объект уже собран, пропускаем его

        // Простейшая проверка: дистанция между камерой и объектом
        const distance = camera.position.distanceTo(object.position);
        if (distance < 2) { // Радиус "сбора" объекта
            object.userData.collected = true;
            object.visible = false; // Прячем объект
            collectedItems++;
            checkGameStatus();
        }
    });
}

// Проверка статуса игры
function checkGameStatus() {
    if (collectedItems >= totalItems) {
        endGame();
    }
}

// Обработка изменения размера окна
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Функция рендеринга
function render() {
    renderer.render(scene, camera);
}

// Инициализация
init();

// Таймер обновляется каждую секунду
setInterval(updateTimer, 1000);
