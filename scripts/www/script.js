// 陶艺制作界面脚本 - 简化重写版
// 确保所有按钮事件可靠绑定，保存功能正常工作

// 页面加载完成后执行所有初始化
window.onload = function() {
    console.log('页面加载完成，初始化功能...');
    
    // 直接初始化所有功能，不使用复杂的模块化结构
    initAllFunctions();
    
    // 初始化3D模型加载指示器隐藏功能
    initModelLoadingIndicator();
};

// 初始化3D模型加载指示器隐藏功能
function initModelLoadingIndicator() {
    // 首先添加一个全局样式覆盖，确保所有加载指示器都被隐藏
    const style = document.createElement('style');
    style.innerHTML = `
        /* 全局强制隐藏所有加载指示器 */
        #loading-indicator, .model-loading-indicator, 
        #WaitBanner, #spin, .edrawings-loading-spin, 
        .loading-spinner, .edrawings-loading-logo-dark-text, 
        .loading-text, .loading-progress {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            z-index: -1 !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('已添加全局样式覆盖，强制隐藏所有加载指示器...');
    console.log('初始化3D模型加载指示器隐藏功能...');
    
    // 1. 先隐藏父页面自身的加载指示器
    const parentLoadingIndicator = document.getElementById('loading-indicator');
    if (parentLoadingIndicator) {
        console.log('找到父页面加载指示器，立即隐藏它...');
        // 使用更强制的样式隐藏
        parentLoadingIndicator.style.display = 'none !important';
        parentLoadingIndicator.style.visibility = 'hidden !important';
        parentLoadingIndicator.style.opacity = '0 !important';
        parentLoadingIndicator.style.zIndex = '-1 !important';
    }
    
    // 2. 获取iframe元素
    const modelIframe = document.getElementById('pottery-model');
    
    // 如果iframe存在
    if (modelIframe) {
        console.log('找到iframe，添加load事件监听器...');
        
        // 添加iframe的load事件监听器
        modelIframe.addEventListener('load', function() {
            console.log('3D模型iframe加载完成，尝试隐藏内部加载指示器...');
            hideLoadingElements();
        });
        
        // 立即执行一次隐藏尝试
        hideLoadingElements();
        
        // 同时设置一个间隔检查机制，确保加载指示器会被隐藏
        let checkInterval = setInterval(hideLoadingElements, 500);
        let checkCount = 0;
        const maxChecks = 60; // 最多检查30秒，增加检查次数
        
        function hideLoadingElements() {
            checkCount++;
            console.log('尝试隐藏加载指示器，检查次数:', checkCount);
            
            // 再次隐藏父页面加载指示器
            if (parentLoadingIndicator) {
                parentLoadingIndicator.style.display = 'none !important';
                parentLoadingIndicator.style.visibility = 'hidden !important';
                parentLoadingIndicator.style.opacity = '0 !important';
                parentLoadingIndicator.style.zIndex = '-1 !important';
            }
            
            // 尝试多种方式访问iframe内容
            try {
                let iframeDocument;
                
                // 第一种方式：直接访问contentDocument
                if (modelIframe.contentDocument) {
                    iframeDocument = modelIframe.contentDocument;
                }
                // 第二种方式：访问contentWindow.document
                else if (modelIframe.contentWindow && modelIframe.contentWindow.document) {
                    iframeDocument = modelIframe.contentWindow.document;
                }
                // 第三种方式：使用frameElement
                else if (window.frames['pottery-model']) {
                    iframeDocument = window.frames['pottery-model'].document;
                }
                
                if (iframeDocument) {
                    // 优先隐藏整个#WaitBanner容器（这是最主要的加载指示器）
                    let waitBanner = iframeDocument.getElementById('WaitBanner');
                    if (waitBanner) {
                        console.log('找到#WaitBanner容器，强制隐藏它...');
                        // 使用更强制的样式隐藏，确保覆盖原有样式
                        waitBanner.setAttribute('style', 'display: none !important; visibility: hidden !important; opacity: 0 !important; z-index: -1 !important; position: absolute !important; top: 0 !important; left: 0 !important;');
                    }
                    
                    // 同时隐藏其他可能的加载指示器元素
                    const loadingSelectors = [
                        '#spin', 
                        '.edrawings-loading-spin', 
                        '.loading-spinner', 
                        '.model-loading-indicator',
                        '.edrawings-loading-logo-dark-text', 
                        '.loading-text', 
                        '.loading-progress'
                    ];
                    
                    loadingSelectors.forEach(selector => {
                        const elements = iframeDocument.querySelectorAll(selector);
                        elements.forEach(element => {
                            if (element) {
                                console.log('找到加载元素', selector, '，强制隐藏它...');
                                element.setAttribute('style', 'display: none !important; visibility: hidden !important; opacity: 0 !important; z-index: -1 !important;');
                            }
                        });
                    });
                }
                
            } catch (error) {
                console.log('无法访问iframe内部DOM（可能是跨域问题）:', error);
            }
            
            // 只有当检查次数达到上限时才停止检查，确保有足够的时间隐藏元素
            if (checkCount >= maxChecks) {
                console.log('达到最大检查次数，停止隐藏加载指示器的检查...');
                clearInterval(checkInterval);
            }
        }
        
        // 确保在一段时间后停止检查
        setTimeout(() => {
            console.log('超时停止隐藏加载指示器的检查...');
            clearInterval(checkInterval);
        }, 30000); // 30秒后自动停止
    } else {
        console.log('未找到iframe元素，跳过初始化...');
    }
}

// 初始化所有功能
function initAllFunctions() {
    console.log('开始初始化所有功能...');
    
    // 初始化步骤导航
    initStepNavigation();
    
    // 初始化步骤输入
    initStepInputs();
    
    // 直接为每个保存步骤按钮添加事件监听器
    bindSaveStepButtons();
    
    // 为最终操作按钮添加事件监听器
    bindFinalButtons();
    
    // 显示已保存的用户作品
    showUserWorks();
    
    console.log('所有功能初始化完成！');
}

// 初始化步骤导航
function initStepNavigation() {
    console.log('初始化步骤导航...');
    
    const stepNavItems = document.querySelectorAll('.step-nav-item');
    const stepContents = document.querySelectorAll('.step-content');
    
    stepNavItems.forEach(item => {
        item.addEventListener('click', function() {
            const stepNumber = this.dataset.step;
            console.log('点击了步骤导航:', stepNumber);
            
            // 更新导航状态
            stepNavItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
            
            // 切换步骤内容
            stepContents.forEach(content => content.classList.remove('active'));
            const targetContent = document.getElementById(`step-${stepNumber}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // 如果是步骤5，确保3D模型可见
            if (stepNumber === '5') {
                const finalIframe = document.getElementById('final-model');
                if (finalIframe) {
                    finalIframe.style.display = 'block';
                }
            }
        });
    });
}

// 初始化步骤输入
function initStepInputs() {
    console.log('初始化步骤输入...');
    
    // 步骤2：拉坯成型 - 滑块值显示
    const heightSlider = document.getElementById('height-2');
    const heightValue = document.getElementById('height-value-2');
    
    if (heightSlider && heightValue) {
        heightSlider.addEventListener('input', function() {
            heightValue.textContent = this.value;
        });
    }
    
    const diameterSlider = document.getElementById('diameter-2');
    const diameterValue = document.getElementById('diameter-value-2');
    
    if (diameterSlider && diameterValue) {
        diameterSlider.addEventListener('input', function() {
            diameterValue.textContent = this.value;
        });
    }
    
    // 步骤4：上釉烧制 - 颜色选择
    const colorBtns = document.querySelectorAll('.color-btn');
    const colorInput = document.getElementById('color-4');
    
    colorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 更新激活状态
            colorBtns.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // 保存选择的颜色
            const color = this.dataset.color;
            if (colorInput) {
                colorInput.value = color;
            }
        });
    });
}

// 直接绑定保存步骤按钮
function bindSaveStepButtons() {
    console.log('绑定保存步骤按钮...');
    
    // 为每个保存步骤按钮直接添加事件监听器
    const saveBtn1 = document.getElementById('save-btn-1');
    const saveBtn2 = document.getElementById('save-btn-2');
    const saveBtn3 = document.getElementById('save-btn-3');
    const saveBtn4 = document.getElementById('save-btn-4');
    
    // 步骤1保存按钮
    if (saveBtn1) {
        console.log('找到保存步骤1按钮，添加事件监听器...');
        saveBtn1.addEventListener('click', function() {
            console.log('点击了保存步骤1按钮！');
            saveStep(1);
        });
    }
    
    // 步骤2保存按钮
    if (saveBtn2) {
        console.log('找到保存步骤2按钮，添加事件监听器...');
        saveBtn2.addEventListener('click', function() {
            console.log('点击了保存步骤2按钮！');
            saveStep(2);
        });
    }
    
    // 步骤3保存按钮
    if (saveBtn3) {
        console.log('找到保存步骤3按钮，添加事件监听器...');
        saveBtn3.addEventListener('click', function() {
            console.log('点击了保存步骤3按钮！');
            saveStep(3);
        });
    }
    
    // 步骤4保存按钮
    if (saveBtn4) {
        console.log('找到保存步骤4按钮，添加事件监听器...');
        saveBtn4.addEventListener('click', function() {
            console.log('点击了保存步骤4按钮！');
            saveStep(4);
        });
    }
}

// 绑定最终操作按钮
function bindFinalButtons() {
    console.log('绑定最终操作按钮...');
    
    // 保存作品按钮
    const saveWorkBtn = document.getElementById('save-work');
    if (saveWorkBtn) {
        console.log('找到保存作品按钮，添加事件监听器...');
        saveWorkBtn.addEventListener('click', function() {
            console.log('点击了保存作品按钮！');
            saveWork();
        });
    }
    
    // 重新制作按钮
    const resetWorkBtn = document.getElementById('reset-work');
    if (resetWorkBtn) {
        console.log('找到重新制作按钮，添加事件监听器...');
        resetWorkBtn.addEventListener('click', function() {
            console.log('点击了重新制作按钮！');
            resetWork();
        });
    }
}

// 保存单个步骤
function saveStep(stepNumber) {
    console.log('开始保存步骤:', stepNumber);
    
    let selections = {};
    let summaryText = '';
    
    // 根据步骤号获取用户选择
    switch(stepNumber) {
        case 1: {
            console.log('处理步骤1的保存...');
            const clayTypeSelect = document.getElementById('clay-type-1');
            const moistureSelect = document.getElementById('clay-moisture-1');
            
            if (clayTypeSelect && moistureSelect) {
                const clayType = clayTypeSelect.value;
                const moisture = moistureSelect.value;
                selections = { clayType, moisture };
                summaryText = `陶土类型: ${getClayTypeName(clayType)}, 湿度: ${getMoistureName(moisture)}`;
                console.log('步骤1选择:', selections);
            } else {
                console.error('步骤1的选择元素未找到！');
            }
            break;
        }
        
        case 2: {
            console.log('处理步骤2的保存...');
            const shapeSelect = document.getElementById('shape-2');
            const heightInput = document.getElementById('height-2');
            const diameterInput = document.getElementById('diameter-2');
            
            if (shapeSelect && heightInput && diameterInput) {
                const shape = shapeSelect.value;
                const height = heightInput.value;
                const diameter = diameterInput.value;
                selections = { shape, height, diameter };
                summaryText = `形状: ${getShapeName(shape)}, 高度: ${height}, 直径: ${diameter}`;
                console.log('步骤2选择:', selections);
            } else {
                console.error('步骤2的选择元素未找到！');
            }
            break;
        }
        
        case 3: {
            console.log('处理步骤3的保存...');
            const decorationSelect = document.getElementById('decoration-3');
            const textureInputs = document.querySelectorAll('input[name="texture-3"]');
            const patternSelect = document.getElementById('pattern-3');
            
            if (decorationSelect && patternSelect) {
                const decoration = decorationSelect.value;
                let texture = 'smooth';
                textureInputs.forEach(input => {
                    if (input.checked) texture = input.value;
                });
                const pattern = patternSelect.value;
                selections = { decoration, texture, pattern };
                summaryText = `装饰风格: ${getDecorationStyleName(decoration)}, 纹理: ${getTextureName(texture)}, 图案: ${getPatternName(pattern)}`;
                console.log('步骤3选择:', selections);
            } else {
                console.error('步骤3的选择元素未找到！');
            }
            break;
        }
        
        case 4: {
            console.log('处理步骤4的保存...');
            const colorInput = document.getElementById('color-4');
            const glazeSelect = document.getElementById('glaze-4');
            const temperatureSelect = document.getElementById('temperature-4');
            
            if (colorInput && glazeSelect && temperatureSelect) {
                const color = colorInput.value;
                const glaze = glazeSelect.value;
                const temperature = temperatureSelect.value;
                selections = { color, glaze, temperature };
                summaryText = `颜色: ${getColorName(color)}, 釉料类型: ${getGlazeTypeName(glaze)}, 烧制温度: ${getTemperatureName(temperature)}`;
                console.log('步骤4选择:', selections);
            } else {
                console.error('步骤4的选择元素未找到！');
            }
            break;
        }
    }
    
    // 更新步骤总结显示
    const summaryElement = document.getElementById(`summary-${stepNumber}`);
    if (summaryElement && summaryText) {
        summaryElement.textContent = summaryText;
        console.log('已更新步骤', stepNumber, '的总结显示');
    }
    
    // 保存到localStorage
    if (Object.keys(selections).length > 0) {
        localStorage.setItem(`step_${stepNumber}`, JSON.stringify(selections));
        console.log('步骤', stepNumber, '已保存到localStorage');
        alert(`步骤 ${stepNumber} 的选择已成功保存！`);
    } else {
        console.error('步骤', stepNumber, '没有可保存的选择数据！');
        alert('保存失败：未找到选择数据！');
    }
}

// 保存完整作品
function saveWork() {
    console.log('开始保存完整作品...');
    
    // 检查是否所有步骤都已保存
    let allStepsSaved = true;
    let workSummary = {
        step1: '',
        step2: '',
        step3: '',
        step4: ''
    };
    
    // 检查每个步骤的总结显示
    for (let i = 1; i <= 4; i++) {
        const summaryElement = document.getElementById(`summary-${i}`);
        if (summaryElement) {
            if (summaryElement.textContent === '等待输入...') {
                allStepsSaved = false;
            } else {
                workSummary[`step${i}`] = summaryElement.textContent;
            }
        }
    }
    
    if (!allStepsSaved) {
        console.log('检测到有步骤未完成保存！');
        alert('请先完成所有4个步骤的保存，然后再保存作品！');
        return;
    }
    
    // 创建作品数据
    const work = {
        id: Date.now(),
        name: `陶艺作品_${new Date().toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}`,
        createdAt: new Date().toISOString(),
        summary: workSummary
    };
    
    // 保存到localStorage
    const savedWorks = JSON.parse(localStorage.getItem('userWorks')) || [];
    savedWorks.push(work);
    localStorage.setItem('userWorks', JSON.stringify(savedWorks));
    
    console.log('作品已成功保存！作品数据:', work);
    alert('作品已成功保存！您可以在"我的作品"区域查看。');
    
    // 更新用户作品显示
    showUserWorks();
}

// 重新制作
function resetWork() {
    console.log('开始重新制作...');
    
    if (confirm('确定要重新开始制作吗？所有当前选择将被清除。')) {
        // 清除所有步骤的localStorage数据
        for (let i = 1; i <= 4; i++) {
            localStorage.removeItem(`step_${i}`);
        }
        
        // 重置所有总结显示
        for (let i = 1; i <= 4; i++) {
            const summaryElement = document.getElementById(`summary-${i}`);
            if (summaryElement) {
                summaryElement.textContent = '等待输入...';
            }
        }
        
        // 重置所有输入元素
        resetAllInputs();
        
        console.log('已重置所有制作数据！');
        alert('已重置所有选择，可以重新开始制作了！');
    }
}

// 重置所有输入元素
function resetAllInputs() {
    console.log('重置所有输入元素...');
    
    // 重置所有选择器
    document.querySelectorAll('select').forEach(select => {
        select.selectedIndex = 0;
    });
    
    // 重置所有滑块
    document.querySelectorAll('input[type="range"]').forEach(range => {
        range.value = range.defaultValue;
        // 更新滑块显示值
        const valueDisplay = range.nextElementSibling;
        if (valueDisplay && valueDisplay.classList.contains('slider-value')) {
            valueDisplay.textContent = range.defaultValue;
        }
    });
    
    // 重置所有单选按钮
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = radio.hasAttribute('checked');
    });
    
    // 重置颜色选择
    const colorOptions = document.querySelectorAll('.color-btn');
    colorOptions.forEach(opt => opt.classList.remove('active'));
    const defaultColor = document.querySelector('.color-btn[data-color="#a0522d"]');
    if (defaultColor) {
        defaultColor.classList.add('active');
        const colorInput = document.getElementById('color-4');
        if (colorInput) {
            colorInput.value = '#a0522d';
        }
    }
}

// 显示用户作品
function showUserWorks() {
    console.log('显示用户作品...');
    
    const worksGrid = document.getElementById('works-grid');
    const savedWorks = JSON.parse(localStorage.getItem('userWorks')) || [];
    
    if (savedWorks.length === 0) {
        worksGrid.innerHTML = `
            <div class="no-works">
                <p>您还没有保存任何作品</p>
                <p>完成陶艺制作过程后，点击"保存作品"按钮来保存您的创作</p>
            </div>
        `;
        return;
    }
    
    // 生成作品卡片
    const worksHTML = savedWorks.map(work => `
        <div class="work-card" data-id="${work.id}">
            <div class="work-card-header">
                <h4>${work.name}</h4>
                <button class="delete-work-btn" onclick="deleteUserWork(${work.id})">×</button>
            </div>
            <div class="work-card-date">
                ${new Date(work.createdAt).toLocaleString('zh-CN')}
            </div>
            <div class="work-card-summary">
                <div class="summary-item">
                    <strong>步骤1：材料准备</strong>
                    <p>${work.summary.step1}</p>
                </div>
                <div class="summary-item">
                    <strong>步骤2：拉坯成型</strong>
                    <p>${work.summary.step2}</p>
                </div>
                <div class="summary-item">
                    <strong>步骤3：修坯装饰</strong>
                    <p>${work.summary.step3}</p>
                </div>
                <div class="summary-item">
                    <strong>步骤4：上釉烧制</strong>
                    <p>${work.summary.step4}</p>
                </div>
            </div>
            <button class="view-work-btn" onclick="viewWorkDetails(${work.id})">查看作品详情</button>
        </div>
    `).join('');
    
    worksGrid.innerHTML = worksHTML;
}

// 删除用户作品
function deleteUserWork(workId) {
    console.log('删除作品，ID:', workId);
    
    if (confirm('确定要删除这个作品吗？')) {
        const savedWorks = JSON.parse(localStorage.getItem('userWorks')) || [];
        const updatedWorks = savedWorks.filter(work => work.id !== workId);
        localStorage.setItem('userWorks', JSON.stringify(updatedWorks));
        
        console.log('作品已删除，更新作品列表...');
        showUserWorks();
    }
}

// 查看作品详情
function viewWorkDetails(workId) {
    console.log('查看作品详情，ID:', workId);
    
    const savedWorks = JSON.parse(localStorage.getItem('userWorks')) || [];
    const work = savedWorks.find(work => work.id === workId);
    
    if (work) {
        let details = `作品名称: ${work.name}\n`;
        details += `创建时间: ${new Date(work.createdAt).toLocaleString('zh-CN')}\n\n`;
        details += `步骤1：材料准备\n${work.summary.step1}\n\n`;
        details += `步骤2：拉坯成型\n${work.summary.step2}\n\n`;
        details += `步骤3：修坯装饰\n${work.summary.step3}\n\n`;
        details += `步骤4：上釉烧制\n${work.summary.step4}`;
        
        alert(details);
    } else {
        alert('未找到该作品！');
    }
}

// 辅助函数：获取陶土类型名称
function getClayTypeName(type) {
    const typeNames = {
        'red': '红陶土',
        'white': '白陶土',
        'stoneware': '炻器陶土',
        'porcelain': '瓷土'
    };
    return typeNames[type] || '自定义陶土';
}

// 辅助函数：获取湿度名称
function getMoistureName(moisture) {
    const moistureNames = {
        'dry': '干燥',
        'medium': '适中',
        'wet': '湿润'
    };
    return moistureNames[moisture] || '自定义湿度';
}

// 辅助函数：获取形状名称
function getShapeName(shape) {
    const shapeNames = {
        'vase': '花瓶',
        'bowl': '碗',
        'cup': '杯子',
        'plate': '盘子',
        'pot': '罐子'
    };
    return shapeNames[shape] || '自定义形状';
}

// 辅助函数：获取装饰风格名称
function getDecorationStyleName(style) {
    const styleNames = {
        'traditional': '传统图案',
        'modern': '现代简约',
        'natural': '自然纹理',
        'custom': '自定义'
    };
    return styleNames[style] || '默认';
}

// 辅助函数：获取纹理名称
function getTextureName(texture) {
    const textureNames = {
        'smooth': '光滑',
        'carved': '雕刻',
        'scratched': '划痕',
        'imprinted': '印花'
    };
    return textureNames[texture] || '默认';
}

// 辅助函数：获取图案名称
function getPatternName(pattern) {
    const patternNames = {
        'none': '无',
        'floral': '花卉',
        'geometric': '几何',
        'animal': '动物',
        'abstract': '抽象'
    };
    return patternNames[pattern] || '默认';
}

// 辅助函数：获取颜色名称
function getColorName(color) {
    const colorNames = {
        '#8b5a2b': '深沉的棕色',
        '#d2b48c': '温暖的土黄色',
        '#a0522d': '赤褐色',
        '#cd853f': '秘鲁色',
        '#deb887': '古董白',
        '#808000': '橄榄色',
        '#4682b4': '钢蓝色',
        '#2e8b57': '海绿色',
        '#b22222': '砖红色'
    };
    return colorNames[color] || '自定义颜色';
}

// 辅助函数：获取釉料类型名称
function getGlazeTypeName(type) {
    const typeNames = {
        'transparent': '透明釉',
        'opaque': '不透明釉',
        'matte': '哑光釉',
        'glossy': '光泽釉'
    };
    return typeNames[type] || '默认';
}

// 辅助函数：获取烧制温度名称
function getTemperatureName(temperature) {
    const tempNames = {
        'low': '低温 (800-1000℃)',
        'medium': '中温 (1100-1200℃)',
        'high': '高温 (1200-1300℃)'
    };
    return tempNames[temperature] || '默认';
}