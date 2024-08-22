const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');
const mainContent = document.getElementById('main-content');

// 用于切换侧边栏的隐藏显示
menuToggle.addEventListener('click', function () {
    sidebar.classList.toggle('hidden');
    mainContent.style.marginLeft = sidebar.classList.contains('hidden') ? '0' : '250px';
});

// 添加点击事件，处理菜单的折叠和展开
document.querySelectorAll('#sidebar ul li.collapsible').forEach((el) => {
    el.addEventListener('click', function(event) {
        event.stopPropagation(); // 防止点击事件冒泡

        // 切换隐藏的子菜单的显示状态
        const subMenu = this.querySelector('ul');
        if (subMenu) {
            subMenu.classList.toggle('hidden');
        }
    });
});

// 处理菜单项的点击事件，加载对应内容
document.querySelectorAll('#sidebar ul li ul li').forEach((el) => {
    el.addEventListener('click', function(event) {
        event.stopPropagation(); // 防止父级菜单被触发

        const basePath = this.closest('[data-basepath]')?.getAttribute('data-basepath') || '';
        const relativePath = this.getAttribute('data-path');

        if (relativePath) {
            const path = basePath + relativePath;
            loadContent(path);
        }
    });
});

function loadContent(path) {
    const currentContent = mainContent.querySelector('iframe');

    if (currentContent) {
        currentContent.classList.add('fade-out');
        setTimeout(() => {
            mainContent.removeChild(currentContent);
            createNewIframe(path);
        }, 500);
    } else {
        createNewIframe(path);
    }
}

function createNewIframe(path) {
    const newContent = document.createElement('iframe');
    newContent.src = path;
    newContent.className = 'fade-in';
    newContent.onload = function () {
        setTimeout(() => {
            this.classList.remove('fade-in');
        }, 500);
    };
    mainContent.appendChild(newContent);
}

// 加载 URL 哈希中的内容并展开侧边栏
function initializeFromHash() {
    const hash = window.location.hash.substring(1);
    const [basePath, relativePath] = hash.split('|');
    console.log("Base Path:", basePath);  // 检查 basePath
    console.log("Relative Path:", relativePath);  // 检查 relativePath

    // 修正选择器，确保 data-basepath 中的斜杠匹配
    const targetItem = document.querySelector(`#sidebar li[data-basepath="${basePath}"] ul li[data-path="${relativePath}"]`);
    if (targetItem) {
        const parentItem = targetItem.closest('li.collapsible');
        if (parentItem) {
            // 展开父菜单
            const subMenu = parentItem.querySelector('ul');
            if (subMenu) {
                subMenu.classList.remove('hidden');
            }
            // 手动触发点击事件
            const event = new Event('click', { bubbles: true });
            targetItem.dispatchEvent(event);
        }
    }
}

// 确保页面加载完成后调用初始化函数
document.addEventListener('DOMContentLoaded', initializeFromHash);
