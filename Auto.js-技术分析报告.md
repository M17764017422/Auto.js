# Auto.js 项目技术分析报告（优化版）

## 目录
- [1. 项目概述](#1-项目概述)
- [2. 核心功能与技术特性](#2-核心功能与技术特性)
- [3. 技术栈与架构设计](#3-技术栈与架构设计)
  - [3.1 技术栈](#31-技术栈)
  - [3.2 架构设计](#32-架构设计)
- [4. 代码结构与模块实现](#4-代码结构与模块实现)
  - [4.1 App模块目录结构](#41-app-模块目录结构-appsrcmainjavaorgautojsautojs)
  - [4.2 AutoJS模块目录结构](#42-autojs-模块目录结构-autojssrcmainjavacomstardustautojs)
  - [4.3 JavaScript模块实现](#43-javascript-模块实现)
  - [4.4 核心类职责](#44-核心类职责)
  - [4.5 核心模块实现](#45-核心模块实现)
  - [4.6 AI功能模块](#46-ai-功能模块)
  - [4.7 自动化实现](#47-自动化实现)
  - [4.8 定时任务调度](#48-定时任务调度)
- [5. JavaScript兼容性与API扩展](#5-javascript-兼容性与api扩展)
- [6. 分支差异分析](#6-分支差异分析)
- [7. 高级功能实现分析](#7-高级功能实现分析)
- [8. 跳跳鱼分支OCR功能详细分析](#8-跳跳鱼分支fake_litiaotiaoocr功能详细分析)
- [9. Rhino 1.7.14 ES6语法支持详情](#9-rhino-1714-es6-语法支持详情)
- [10. 维护建议与开发指南](#10-维护建议与开发指南)
- [11. 总结](#11-总结)

---

## 1. 项目概述

Auto.js 是一个支持无障碍服务的 Android 平台上的 JavaScript IDE，基于原作者 hyb1996 开发的开源版本，由 TonyJiangWJ 维护的修改版。该项目旨在提供一个功能强大的自动化脚本环境，支持各种复杂的自动化任务。项目基于 Mozilla Rhino JavaScript 引擎，为 Android 平台提供完整的 JavaScript 运行环境，支持无障碍服务、图像处理、AI 推理等多种高级功能。

## 2. 核心功能与技术特性

### 2.1 核心功能
- **无障碍服务自动化**：通过 Android 无障碍服务实现屏幕自动化操作
- **UI 控件操作**：提供强大的选择器 API，用于寻找、遍历、获取信息和操作屏幕上控件
- **JavaScript IDE**：以 JavaScript 为脚本语言，支持代码补全、重命名、格式化等功能
- **APK 打包**：支持将 JavaScript 脚本打包为 APK 文件
- **Root 权限支持**：提供更强大的屏幕点击、滑动、录制功能和运行 shell 命令
- **图像处理**：提供截取屏幕、保存截图、图片找色、找图等功能
- **Tasker 集成**：可作为 Tasker 插件使用，结合 Tasker 完成工作流自动化
- **界面分析工具**：类似 Android Studio 的 LayoutInspector，用于分析界面层次和控件信息

### 2.2 高级功能
- **AI 推理引擎**：集成了 PaddleOCR、YOLO 模型等多种 AI 推理引擎
- **语音合成**：提供文本转语音（TTS）功能
- **多媒体处理**：支持音频播放、媒体文件扫描等
- **传感器访问**：支持访问设备传感器数据
- **插件系统**：支持外部插件扩展功能
- **浮动窗口**：支持创建可交互的浮动窗口界面

### 2.3 技术特性
- **内存优化**：修复了大量内存泄漏问题，持续运行大量脚本后也能保持较低内存占用
- **多架构支持**：打包为 64 位和 32 位，修复对 Android 12+ 的支持
- **AI 集成**：支持多种机器学习推理引擎，包括 ONNXRuntime、PaddleLite、PaddleOCR
- **定时任务**：支持 WorkManager、AlarmManager 和 Android-job 调度选项

## 3. 技术栈与架构设计

### 3.1 技术栈
#### 3.1.1 前端技术
- **宿主语言**：Java/Kotlin
- **脚本语言**：JavaScript (ES5/ES6+)
- **UI 框架**：Android 原生 UI 组件
- **XML 布局**：使用 XML 定义 UI 界面

#### 3.1.2 后端技术
- **构建系统**：Gradle 7.2.2
- **目标平台**：Android (API 21-33)
- **编译环境**：JDK 11+

#### 3.1.3 AI/ML 技术
- **OpenCV**：4.8.0 版本，用于图像处理和识别
- **PaddleOCR**：用于文字识别
- **ONNXRuntime**：支持本地模型推理
- **PaddleLite**：2.13-rc 版本，用于模型推理
- **NCNN**：用于 YOLO 模型推理

#### 3.1.4 依赖库
- **AndroidX**：1.4.1 版本
- **Material Design**：1.4.0 版本
- **Kotlin**：1.9.0 版本
- **Rhino JavaScript Engine**：1.7.14 版本
- **ButterKnife**：10.2.3 版本，用于视图绑定
- **Glide**：4.12.0 版本，用于图片加载
- **Retrofit**：2.9.0 版本，用于网络请求
- **RxJava**：2.2.21 版本，用于响应式编程

### 3.2 架构设计

#### 3.2.1 分层架构图
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              app Module (UI层)                              │
│         App.kt → AutoJs.java → ScriptEngineManager                          │
│         SplashActivity → MainActivity → EditActivity                        │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │ depends on
┌─────────────────────────────────────▼───────────────────────────────────────┐
│                           autojs Module (核心引擎)                          │
│   RhinoJavaScriptEngine → LoopBasedJavaScriptEngine → ScriptRuntime        │
│   AccessibilityBridge → TopLevelScope → init.js                             │
└─────────────────────────────────────┬───────────────────────────────────────┘
                                      │ depends on
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
┌───────▼───────┐           ┌─────────▼─────────┐         ┌────────▼────────┐
│   automator   │           │      common       │         │   autojs-aar    │
│ 无障碍服务     │           │ 公共工具类         │         │ OpenCV 4.8.0    │
│ UiAutomator   │           │ Kotlin stdlib     │         │ Rhino 1.7.14    │
└───────────────┘           └───────────────────┘         │ PaddleLite      │
                                                          │ YOLOv8 NCNN     │
                                                          │ ONNX Runtime    │
                                                          └─────────────────┘
```

#### 3.2.2 模块依赖关系图
```
app
├── automator (AccessibilityService, UiAutomator wrappers)
├── common (Shared utilities, Kotlin stdlib)
├── autojs (Core JS engine, Runtime APIs)
├── apkbuilder (APK packaging for standalone scripts)
└── autojs-aar/apksigner

autojs
├── common
├── automator
├── autojs-aar/opencv (OpenCV 4.8.0)
├── autojs-aar/opencvhelper
├── autojs-aar/rhino-jdk7 (Rhino 1.7.14)
├── autojs-aar/paddleocr (PaddleLite 2.13-rc)
├── autojs-aar/yolov8ncnn (NCNN inference)
├── autojs-aar/rootshell
├── autojs-aar/libtermexec
├── autojs-aar/emulatorview
└── autojs-aar/term

automator
└── common

inrt (Standalone script runner)
├── autojs
├── automator
├── common
└── autojs-aar/opencv, libtermexec, emulatorview, term
```

#### 3.2.3 数据流图
```
User Script Execution Flow:
┌─────────────┐     ┌─────────────────┐     ┌────────────────────┐
│ Script File │────▶│ ScriptEngine    │────▶│ RhinoJavaScriptEngine │
│ (.js)       │     │ Manager         │     │ .execute()          │
└─────────────┘     └─────────────────┘     └──────────┬─────────┘
                                                       │
                            ┌──────────────────────────▼──────────────────────────┐
                            │                    init.js                          │
                            │  - Load modules via require()                      │
                            │  - Initialize global APIs (runtime.app, etc.)      │
                            │  - Setup bridges for JS-Java communication         │
                            └──────────────────────────┬──────────────────────────┘
                                                       │
                            ┌──────────────────────────▼──────────────────────────┐
                            │                 ScriptRuntime                       │
                            │  - Provides all API objects (app, automator, etc.) │
                            │  - Bridges to Java implementations                 │
                            └──────────────────────────┬──────────────────────────┘
                                                       │
              ┌──────────────────────────────────────────┼───────────────────────────────────────┐
              │                                          │                                       │
┌─────────────▼─────────────┐            ┌──────────────▼──────────────┐          ┌─────────────▼─────────────┐
│ AccessibilityService      │            │ Images + OpenCV             │          │ OCR/YOLO                  │
│ (click, swipe, gestures)  │            │ (screenshot, findImage)     │          │ (text recognition, detect)│
└───────────────────────────┘            └─────────────────────────────┘          └───────────────────────────┘
```

#### 3.2.4 简化模块结构图
```
┌─────────────────┐
│    App 模块     │ ← 主应用界面
├─────────────────┤
│   AutoJS 模块   │ ← JavaScript 运行时
├─────────────────┤
│  Automator 模块 │ ← 自动化操作
├─────────────────┤
│  Common 模块    │ ← 公共工具
├─────────────────┤
│   Inrt 模块     │ ← AI 推理引擎
└─────────────────┘
```

## 4. 代码结构与模块实现

### 4.1 App 模块目录结构 (app/src/main/java/org/autojs/autojs/)
- `accessibility/` - 无障碍服务相关功能
- `autojs/` - Auto.js 核心逻辑
  - `api/` - API 接口定义
  - `key/` - 全局按键监听
  - `record/` - 操作录制功能
- `build/` - 构建相关
- `external/` - 外部接口实现
  - `fileprovider/` - 文件提供者
  - `receiver/` - 广播接收器
  - `tasker/` - Tasker 集成
  - `widget/` - 小组件
- `model/` - 数据模型
- `network/` - 网络功能
- `pluginclient/` - 插件客户端
- `storage/` - 存储功能
- `theme/` - 主题相关
- `timing/` - 定时任务
- `tool/` - 工具类
- `ui/` - 用户界面
  - `doc/` - 文档界面
  - `edit/` - 编辑器界面
  - `error/` - 错误报告界面
  - `floating/` - 浮动窗口
  - `log/` - 日志界面
  - `main/` - 主界面
  - `project/` - 项目管理
  - `settings/` - 设置界面
  - `shortcut/` - 快捷方式
  - `splash/` - 启动界面
  - `timing/` - 定时任务界面
  - `user/` - 用户相关界面
- `workground/` - 工作区相关

### 4.2 AutoJS 模块目录结构 (autojs/src/main/java/com/stardust/autojs/)
- `annotation/` - 注解定义
- `codegeneration/` - 代码生成
- `core/` - 核心功能实现
  - `accessibility/` - 无障碍服务核心
  - `activity/` - 活动管理
  - `console/` - 控制台实现
  - `graphics/` - 图形处理
  - `image/` - 图像处理核心
    - `capture/` - 截图功能
    - `ocr/` - OCR 实现
  - `permission/` - 权限管理
  - `record/` - 录制功能
    - `accessibility/` - 无障碍录制
  - `ui/` - UI 相关
    - `inflater/` - 布局解析
  - `util/` - 工具类
  - `events/` - 事件系统
- `engine/` - 脚本引擎管理
- `execution/` - 脚本执行管理
- `onnx/` - ONNX 模型推理
- `project/` - 项目管理
- `rhino/` - Rhino JavaScript 引擎封装
- `runtime/` - 运行时环境
  - `accessibility/` - 无障碍运行时
  - `api/` - API 实现
  - `exception/` - 异常处理
  - `record/` - 录制运行时
- `script/` - 脚本相关
- `shizuku/` - Shizuku 相关功能
- `util/` - 工具类
- `workground/` - 工作区
- `yolo/` - YOLO 模型推理

### 4.3 JavaScript 模块实现
#### JavaScript 模块目录结构 (autojs/src/main/assets/modules/)
- `__app__.js` - app 模块实现
- `__automator__.js` - automator 模块实现
- `__console__.js` - console 模块实现
- `__dialogs__.js` - dialogs 模块实现
- `__engines__.js` - engines 模块实现
- `__events__.js` - events 模块实现
- `__floaty__.js` - floaty 模块实现
- `__globals__.js` - 全局函数实现
- `__http__.js` - http 模块实现
- `__images__.js` - images 模块实现
- `__io__.js` - io 模块实现
- `__selector__.js` - selector 模块实现
- `__sensors__.js` - sensors 模块实现
- `__shell__.js` - shell 模块实现
- `__storages__.js` - storages 模块实现
- `__threads__.js` - threads 模块实现
- `__timers__.js` - timers 模块实现
- `__tts__.js` - TTS 模块实现
- `__ui__.js` - ui 模块实现
- `__util__.js` - util 模块实现
- `__web__.js` - web 模块实现
- `__$mlKitOcr__.js` - ML Kit OCR 模块
- `__$ocr__.js` - PaddleOCR 模块
- `__$shizuku__.js` - Shizuku 模块
- `__$yolo__.js` - YOLO 模块

#### JavaScript 模块与 Java 实现对应关系
- `__app__.js` ← `autojs/src/main/java/com/stardust/autojs/runtime/api/AppScriptRuntime.java`
- `__automator__.js` ← `autojs/src/main/java/com/stardust/autojs/core/automator/` (自动化操作核心)
- `__console__.js` ← `autojs/src/main/java/com/stardust/autojs/core/console/` (控制台实现)
- `__dialogs__.js` ← `autojs/src/main/java/com/stardust/autojs/runtime/api/Dialogs.java`
- `__engines__.js` ← `autojs/src/main/java/com/stardust/autojs/engine/ScriptEngineManager.java`
- `__events__.js` ← `autojs/src/main/java/com/stardust/autojs/core/event/` (事件系统)
- `__floaty__.js` ← `autojs/src/main/java/com/stardust/autojs/core/ui/floaty/` (浮动窗口)
- `__http__.js` ← `autojs/src/main/java/com/stardust/autojs/runtime/api/http/` (HTTP请求)
- `__images__.js` ← `autojs/src/main/java/com/stardust/autojs/core/image/` (图像处理)
- `__io__.js` ← `autojs/src/main/java/com/stardust/autojs/runtime/api/IOUtils.java`
- `__selector__.js` ← `autojs/src/main/java/com/stardust/autojs/core/automator/UiSelector.java` (UI选择器)
- `__sensors__.js` ← `autojs/src/main/java/com/stardust/autojs/core/sensors/` (传感器)
- `__shell__.js` ← `autojs/src/main/java/com/stardust/autojs/core/util/Shell.java` (Shell命令)
- `__storages__.js` ← `autojs/src/main/java/com/stardust/autojs/runtime/api/Storages.java` (本地存储)
- `__threads__.js` ← `autojs/src/main/java/com/stardust/autojs/core/execution/` (多线程)
- `__timers__.js` ← `autojs/src/main/java/com/stardust/autojs/core/timer/` (定时器)
- `__tts__.js` ← `autojs/src/main/java/com/stardust/autojs/runtime/api/Tts.java` (文本转语音)
- `__ui__.js` ← `autojs/src/main/java/com/stardust/autojs/core/ui/` (UI构建)
- `__util__.js` ← `autojs/src/main/java/com/stardust/autojs/runtime/api/Util.java` (工具函数)
- `__web__.js` ← `autojs/src/main/java/com/stardust/autojs/runtime/api/web/` (Web API)
- `__$mlKitOcr__.js` ← `autojs/src/main/java/com/stardust/autojs/core/image/ocr/MlKitOcr.java`
- `__$ocr__.js` ← `autojs/src/main/java/com/stardust/autojs/core/image/ocr/PaddleOcr.java`
- `__$shizuku__.js` ← `autojs/src/main/java/com/stardust/autojs/shizuku/` (Shizuku功能)
- `__$yolo__.js` ← `inrt/src/main/java/com/stardust/innovation/ai/yolo/` (YOLO推理)

#### AI 推理模块 (inrt/src/main/java/com/stardust/innovation/)
- `ai/` - AI 推理核心
  - `onnx/` - ONNXRuntime 推理引擎
  - `paddle/` - PaddleLite 推理引擎
  - `yolo/` - YOLO 模型实现
- `ocr/` - OCR 相关功能
- `util/` - AI 推理工具类

#### 图像处理模块 (autojs-aar/opencv/src/main/java/)
- `org/opencv/` - OpenCV 原始库
- `com/stardust/opencv/` - OpenCV 扩展功能

#### OCR 功能实现
- Java 层: `autojs/src/main/java/com/stardust/autojs/core/image/ocr/`
- JavaScript 层: `autojs/src/main/assets/modules/__$ocr__.js`

#### YOLO 功能实现
- Java 层: `inrt/src/main/java/com/stardust/innovation/ai/yolo/`
- JavaScript 层: `autojs/src/main/assets/modules/__$yolo__.js`

#### TTS 功能实现
- JavaScript 层: `autojs/src/main/assets/modules/__tts__.js`

#### 核心启动文件
- `autojs/src/main/assets/init.js` - JavaScript 环境初始化
- `autojs/src/main/java/com/stardust/autojs/AutoJs.java` - Java 核心类
- `app/src/main/java/org/autojs/autojs/App.java` - 应用主类

### 4.4 核心类职责

| 类 | 路径 | 职责 |
|----|------|------|
| `AutoJs.java` | `autojs/src/main/java/.../AutoJs.java` | 引擎初始化、管理ScriptEngineManager、AccessibilityBridge |
| `RhinoJavaScriptEngine.kt` | `autojs/src/main/java/.../engine/` | JS执行引擎，管理Context和Scope，模块加载 |
| `LoopBasedJavaScriptEngine.java` | `autojs/src/main/java/.../engine/` | 扩展RhinoJavaScriptEngine，添加Android Looper支持 |
| `ScriptRuntime.java` | `autojs/src/main/java/.../runtime/` | 暴露所有JS API (app, automator, images等) |
| `AccessibilityService.kt` | `automator/src/main/java/.../` | 无障碍服务核心，委托事件处理给Delegate |
| `TopLevelScope.java` | `autojs/src/main/java/.../rhino/` | JavaScript全局作用域，管理资源生命周期和GC |
| `App.kt` | `app/src/main/java/.../App.kt` | 应用入口，初始化AutoJs实例、主题、接收器 |

### 4.5 核心模块实现
- **app 模块**：提供应用操作相关功能，如启动应用、获取应用信息、发送广播等
- **automator 模块**：自动化操作核心，包括点击、滑动、输入文本等操作
- **console 模块**：控制台输出和日志记录功能
- **dialogs 模块**：对话框和用户交互界面
- **images 模块**：图像处理功能，包括截图、颜色检测、模板匹配等
- **files 模块**：文件系统操作
- **shell 模块**：Shell 命令执行
- **http 模块**：HTTP 请求和网络通信
- **threads 模块**：多线程编程支持
- **timers 模块**：定时器功能
- **selector 模块**：UI 控件选择器
- **events 模块**：事件处理系统
- **engines 模块**：脚本引擎管理
- **storages 模块**：本地存储
- **floaty 模块**：浮动窗口
- **sensors 模块**：传感器访问
- **media 模块**：多媒体功能
- **plugins 模块**：插件系统
- **ui 模块**：用户界面构建

### 4.5 AI 功能模块
- **$ocr 模块**：基于 PaddleOCR 的文字识别功能
  - 支持自定义模型路径
  - 支持区域截取识别
  - 提供文本检测和识别功能
- **$yolo 模块**：基于 YOLO 的目标检测功能
  - 支持 ONNX 和 NCNN 两种模型格式
  - 支持自定义标签和置信度阈值
  - 提供实时检测和截图检测功能
- **$tts 模块**：文本转语音功能
  - 基于 Android TextToSpeech API
  - 支持多种语言和音调调节
  - 提供异步朗读和事件回调功能

### 4.6 自动化实现
- **无障碍服务**：通过 Android 无障碍服务实现屏幕控件操作
- **截图权限管理**：实现多脚本共享截图权限，避免互相抢占
- **图像识别**：基于 OpenCV 4.8.0 实现 SIFT 找图、DNN 加载 YoloV8 模型
- **OCR 识别**：集成 PaddleOCR，提供 `$ocr` 接口

### 4.7 定时任务调度
- **WorkManager**：适用于长期运行的任务
- **AlarmManager**：适用于精确时间调度
- **Android-job**：已弃用的调度方式

## 5. JavaScript 兼容性与API扩展

### 5.1 语法支持
- **ES5 特性**：完全支持，包括函数、对象、数组等基本特性
- **ES6+ 特性**：通过 Rhino 1.7.14 支持部分特性（基于71项全量测试，支持率70.4%）：

  - **完全支持的特性（50项，70.4%）**：
    - **基础语法**：箭头函数（`const add = (a, b) => a + b;`）、模板字符串（`var name = "Auto.js"; console.log(`Hello ${name}`)）、let/const 块级作用域变量声明、数字分隔符（`const num = 1_000_000;`）
    - **解构赋值**：无默认值的解构（`const {width, height} = device;`）、变量交换（`[a, b] = [b, a];`）
    - **集合**：Map 和 Set 集合的全部基础操作（`new Map()`、`new Set()`、`add()`、`set()`、`get()`、`has()`、`delete()` 等）
    - **对象操作**：属性简写（`{name}` 代替 `{name:name}`）、方法简写（`{fn(){}}` 代替 `{fn:function(){}}`）、Object 扩展方法（`Object.assign()`、`Object.values()`、`Object.entries()`）
    - **字符串方法**：includes、startsWith、endsWith、repeat、padStart、padEnd 等 ES6+ 拓展方法
    - **数组方法**：find、findIndex、some、every、filter、map 等 ES6 基础方法
    - **异步支持**：Promise 全操作（`new Promise()`、`then()`、`catch()`）
    - **生成器**：function* 生成器语法和 yield 关键字
    - **函数声明**：仅普通函数声明（`function fn(a,b)`，无默认值/无...运算符）

  - **有限支持或不支持的特性（21项+Symbol）**：
    - **默认参数相关**：函数参数默认值（`function func(a, b = 10) { ... }`）、带默认值的解构赋值（`const [a,b=5] = [1];`）- 不支持，会报语法错误
    - **扩展运算符相关**：剩余参数（`function func(...args) { ... }`）、数组扩展（`[...arr]`）、解构剩余项（`[a,...rest]`、`{a,...rest}`）、计算属性名（`{[key]: value}`）- 不支持，会报语法错误
    - **ES2020+新运算符**：空值合并运算符（`??`）、可选链运算符（`?.`）、短路赋值（`||=`、`&&=`）- 不支持，会报语法错误
    - **高阶特性**：
      - 类（class）：`class MyClass { ... }` - 不支持，会报语法错误
      - async/await：`async function fn() { await ... }` - 不支持，会报语法错误
      - Proxy 和 Reflect：不支持
      - Symbol：完全不支持（底层引擎抛出异常）
      - 模块语法（import/export）：使用 CommonJS 的 `require` 和 `module.exports`，不支持ES6的import/export语法
      - 数组高阶方法：flat()、flatMap() - 引擎未实现
    - **函数表达式**：`const fn = function(a,b) { ... }` - 不支持，会报语法错误

### 5.2 API 扩展

#### 5.2.1 全局函数
- `toast(message)` - 显示Toast提示
- `sleep(ms)` - 延时执行
- `setClip(text)` - 设置剪贴板
- `getClip()` - 获取剪贴板内容
- `currentPackage()` - 获取当前包名
- `currentActivity()` - 获取当前活动名
- `exit()` - 退出脚本
- `random(min, max)` - 生成随机数
- `setScreenMetrics(width, height)` - 设置屏幕参数

##### 全局函数使用示例：
```javascript
// 显示Toast提示
toast("脚本开始运行");

// 等待应用程序启动
waitForPackage("com.tencent.mm");

// 获取当前活动名称
var currentActivity = currentActivity();

// 延时执行
sleep(1000);

// 生成随机数
var randomNum = random(1, 100);
```

#### 5.2.2 全局对象
- `JSON` - JSON处理
- `util` - 工具函数
- `Promise` - 异步编程
- `Canvas` - 画布对象
- `Image` - 图像对象
- `device` - 设备信息和控制

#### 5.2.3 设备控制对象 (device)
- 屏幕信息：`device.width`, `device.height`
- 音量控制：`getMusicVolume()`, `setMusicVolume(volume)` 等
- 亮度控制：`getBrightness()`, `setBrightness(brightness)` 等
- 电池信息：`getBattery()`, `getTotalMem()`, `getAvailMem()`
- 屏幕控制：`isScreenOn()`, `wakeUp()`, `keepScreenOn()` 等
- 振动控制：`vibrate(millis)`, `cancelVibration()`

#### 5.2.4 对象绑定与原生调用
##### 对象绑定示例：
```javascript
// 导入Android类
importClass(android.widget.Toast);
importClass(android.content.Context);
importClass(android.view.KeyEvent);

// 使用导入的类
Toast.makeText(context, "Hello World", Toast.LENGTH_SHORT).show();

// 也可以导入包下的所有类
importClass("com.stardust.autojs.core.util.Shell");
var shell = new Shell(context, true);
```

##### 原生调用示例：
```javascript
// 直接使用Android API
var intent = new android.content.Intent(android.content.Intent.ACTION_VIEW);
intent.setData(android.net.Uri.parse("https://www.example.com"));
app.startActivity(intent);

// 访问设备信息
var width = device.width;
var height = device.height;
var battery = device.getBattery();

// 控制设备
device.wakeUp();
device.vibrate(500);
```

#### 5.2.5 模块化
##### 模块化示例：
```javascript
// 定义模块 (myModule.js)
module.exports = {
    add: function(a, b) {
        return a + b;
    },
    multiply: function(a, b) {
        return a * b;
    }
};

// 使用模块
var myModule = require('./myModule');
var result = myModule.add(5, 3);

// 使用内置模块
var automator = require('./__automator__')(runtime, global);
```

#### 5.2.6 运行环境
- **单线程执行**：JavaScript 代码在单线程中执行
- **与 Java 交互**：通过桥接机制实现 JavaScript 与 Java 的双向调用
- **内存管理**：实现 JavaScript 与 Java 对象的垃圾回收整合
- **错误处理**：提供完善的异常处理机制

## 6. 分支差异分析

### 6.1 main 分支（主开发分支）
- **包名**：`org.autojs.autojs.modify`
- **功能完整**：包含所有高级 AI 功能（OpenCV 4.8.0、ONNXRuntime、PaddleLite 2.13-rc）
- **目标用户**：通用用户，功能最全面
- **版本标识**：`4.1.25.0702.alpha Modify`
- **GitHub Actions**：支持CI/CD自动构建

### 6.2 fake_idlefish 分支（闲鱼伪装分支）
- **包名**：`com.taobao.idlefish`
- **伪装目的**：规避淘宝等应用的无障碍检测，通过 `AutoJs.fakeIdlefish` 实现
- **应用图标**：使用 `@drawable/autojs_fake_idle`（闲鱼风格）
- **功能限制**：
  - OpenCV 版本降级至 4.5.5
  - 移除 ONNXRuntime 和 PaddleLite 2.13-rc 相关功能
  - 恢复 tess-two OCR 支持
  - 移除 GitHub Actions 打包功能
- **APK 后缀**：`.x`（替代 `.modify`）
- **版本标识**：`4.1.25.0702.alpha FakeIdleFish`
- **补丁名**：`困鱼`

### 6.3 fake_litiaotiao 分支（跳跳鱼分支）- 详细差异分析

#### 6.3.1 基本信息差异

| 项目 | main分支 | fake_litiaotiao分支 |
|------|----------|---------------------|
| 包名 | `org.autojs.autojs.modify` | `com.litiaotiao.app` |
| 应用名 | Auto.js M | 跳跳鱼 |
| 版本标识 | `4.1.25.0702.alpha Modify` | `4.1.25.0702.alpha FakeLiTT` |
| 补丁名 | 修改版 | 跳跳鱼 |
| 应用图标 | `autojs_material` | `fake_tiaotiao`（李跳跳风格） |
| APK后缀 | `.modify` | 无后缀 |

#### 6.3.2 代码级差异（共24个文件变更）

**删除的文件（2个）**：
| 文件 | 说明 |
|------|------|
| `.github/workflows/android.yml` | 移除GitHub Actions CI/CD配置 |
| `autojs/.../AccessibilityFloatyService.java` | 移除无障碍浮动窗口服务（66行代码） |

**新增的文件（3个）**：
| 文件 | 说明 |
|------|------|
| `app/src/main/res/drawable/fake_tiaotiao.png` | 李跳跳风格应用图标 |
| `app/src/main/res/drawable/autojs_fake_idle.png` | 闲鱼风格图标（用于Intent Activity） |
| `autojs-aar/paddleocr/.../libc++_shared.so` | PaddleLite C++运行时库（arm64/armeabi） |

**修改的关键文件**：

| 文件 | 变更内容 |
|------|----------|
| `app/build.gradle` | 包名改为`com.litiaotiao.app`，移除`.modify`后缀 |
| `App.kt` | 包名迁移，添加import语句 |
| `RhinoJavaScriptEngine.kt` | 移除`isJavaPrimitiveWrap=false`，添加String特殊处理 |
| `AndroidManifest.xml` | 更新Application类名和图标引用 |
| `strings.xml` | 应用名改为"跳跳鱼" |

#### 6.3.3 核心代码差异详解

**1. RhinoJavaScriptEngine.kt 差异**：
```kotlin
// main分支
init {
    isJavaPrimitiveWrap = false  // 禁用Java基本类型包装
}

// fake_litiaotiao分支
override fun wrap(cx: Context, scope: Scriptable, obj: Any?, staticType: Class<*>?): Any? {
    return when {
        obj is String -> runtime.bridges.toString(obj.toString())  // 新增String特殊处理
        // ...
    }
}
```

**2. AccessibilityFloatyService.java 完全移除**：
- 移除了66行代码的无障碍浮动窗口服务
- 该服务用于在无障碍服务上下文中创建浮动窗口
- 可能是为了减少检测特征或简化架构

**3. App.kt 包名迁移**：
```kotlin
// main分支
package org.autojs.autojs

// fake_litiaotiao分支
package com.litiaotiao.app
// 需要额外导入原包名的类
import org.autojs.autojs.BuildConfig
import org.autojs.autojs.Pref
import org.autojs.autojs.R
```

#### 6.3.4 功能差异（代码验证结果）

| 功能 | main分支 | fake_litiaotiao分支 | 验证方式 |
|------|----------|---------------------|----------|
| OpenCV版本 | 4.8.0 | **4.8.0** | `autojs-aar/opencv/build.gradle` |
| ONNXRuntime | ✅ 1.15.1 | ✅ **1.15.1** | `autojs/build.gradle` |
| YOLO (NCNN) | ✅ 18文件 | ✅ **18文件** | `**/*yolo*` glob搜索 |
| PaddleOCR | ✅ 27文件 | ✅ **27文件** | `**/*ocr*` glob搜索 |
| ML Kit OCR | ✅ 支持 | ✅ **支持** | `__$mlKitOcr__.js` 存在 |
| tess-two OCR | ❌ 注释 | ❌ **注释** | build.gradle注释 |
| GitHub Actions | ✅ 存在 | ❌ **不存在** | `.github/workflows/`目录 |
| AccessibilityFloatyService | ✅ 存在 | ❌ **不存在** | 代码验证 |

**⚠️ AccessibilityFloatyService 分析**：

经代码分析发现，`AccessibilityFloatyService` 在 main 分支中实际上是**死代码**：
- 该类**从未被任何其他代码引用**
- **未在 AndroidManifest.xml 中注册**
- 其核心功能早已合并到 `FloatyService` 中

```java
// FloatyService 已包含相同功能
public void refreshAccessWindowManager() {
    if (AccessibilityService.Companion.getInstance() != null) {
        accessibilityWindowManager = AccessibilityService.Companion.getInstance().getWindowManager();
    }
}

private void appendWindow(FloatyWindow window) {
    // Android 12+ 使用 accessibilityWindowManager
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S &&
            instance.accessibilityWindowManager != null && window instanceof RawWindow) {
        window.onCreate(instance, instance.accessibilityWindowManager);
    } else {
        window.onCreate(instance, instance.mWindowManager);
    }
}
```

**结论**：删除 `AccessibilityFloatyService` 是清理无用代码，**功能无任何损失**，同时还减少了被检测的特征。
| WrapFactory.isJavaPrimitiveWrap | `false` | **未设置** | RhinoJavaScriptEngine.kt |
| WrapFactory String处理 | ❌ 无 | ✅ **有** | RhinoJavaScriptEngine.kt |

**⚠️ 重大发现（代码验证）**：

1. **OpenCV版本**：两个分支均为 **4.8.0**，README声称4.5.5是**错误的**
2. **AI功能**：跳跳鱼分支的AI功能代码**完整保留**
   - ONNX Runtime 1.15.1 依赖存在
   - YOLOv8 NCNN模块（18个文件）存在
   - PaddleOCR模块（27个文件）存在
   - init.js中`$yolo`、`$ocr`、`$mlKitOcr`模块正常加载

3. **README.md多处描述不准确**：
   - OpenCV版本并非4.5.5，实际是4.8.0
   - AI功能并未移除，代码完整保留
   - 这可能是故意降低项目关注度或误导检测工具

**兼容性问题**：NCNN和PaddleOCR同时使用会导致闪退，建议使用ONNX+ML Kit OCR组合。

#### 6.3.5 构建配置差异分析

**差异文件汇总**：

| 文件 | 是否有差异 |
|------|------------|
| `project-versions.json` | ✅ 有差异 |
| `app/build.gradle` | ✅ 有差异 |
| `build.gradle` (根目录) | ❌ 无差异 |
| `gradle.properties` | ❌ 无差异 |
| `settings.gradle` | ❌ 无差异 |
| `autojs/build.gradle` | ❌ 无差异 |
| `autojs-aar/*/build.gradle` | ❌ 无差异 |
| `inrt/build.gradle` | ❌ 无差异 |

**project-versions.json 差异**：

| 配置项 | main分支 | fake_litiaotiao分支 |
|--------|----------|---------------------|
| appVersionCode | 492 | 492 (相同) |
| appVersionName | `4.1.25.0702.alpha Modify` | `4.1.25.0702.alpha FakeLiTT` |
| target | 31 | 31 (相同) |
| buildApkTarget | 29 | 29 (相同) |
| mini | 21 | 21 (相同) |
| compile | 33 | 33 (相同) |
| buildTool | 30.0.3 | 30.0.3 (相同) |
| patchName | `修改版` | `跳跳鱼` |

**app/build.gradle 差异**：

| 配置项 | main分支 | fake_litiaotiao分支 |
|--------|----------|---------------------|
| applicationId | `org.autojs.autojs` | `com.litiaotiao.app` |
| resourcePackageName | `android.defaultConfig.applicationId` | `org.autojs.autojs` (固定值) |
| applicationIdSuffix (release) | `.modify` | **无** |

**最终包名对比**：

| 分支 | debug包名 | release包名 |
|------|-----------|-------------|
| main | `org.autojs.autojs.debug` | `org.autojs.autojs.modify` |
| fake_litiaotiao | `com.litiaotiao.app.debug` | `com.litiaotiao.app` |

**重要结论**：
- 所有依赖配置完全相同（OpenCV、ONNX、PaddleOCR、YOLO版本相同）
- SDK版本、编译工具版本相同
- 仅包名和版本名称不同

#### 6.3.6 与fake_idlefish分支的差异

跳跳鱼分支相比闲鱼分支有15个文件差异，主要是：

| 差异项 | fake_idlefish | fake_litiaotiao |
|--------|---------------|-----------------|
| 包名 | `com.taobao.idlefish.x` | `com.litiaotiao.app` |
| 应用名 | 困鱼 | 跳跳鱼 |
| 应用图标 | 闲鱼风格 | 李跳跳风格 |
| APK后缀 | `.x` | 无后缀 |
| inrt模块 | 无变更 | 有轻微变更 |

### 6.4 分支差异总结（代码验证）

```
分支差异对比图（实际代码验证状态）：

main (主分支)
├── OpenCV 4.8.0 ✅
├── ONNXRuntime 1.15.1 ✅
├── YOLO NCNN ✅ (18文件)
├── PaddleOCR ✅ (27文件)
├── GitHub Actions ✅
├── AccessibilityFloatyService ✅
├── WrapFactory.isJavaPrimitiveWrap = false
├── 包名: org.autojs.autojs.modify
└── 脚本打包 ✅

fake_idlefish (闲鱼伪装)
├── OpenCV 4.8.0 ✅ (与main相同)
├── ONNXRuntime ✅ (代码存在)
├── YOLO NCNN ✅ (代码存在)
├── PaddleOCR ✅ (代码存在)
├── GitHub Actions ❌
├── AccessibilityFloatyService ❌
├── 包名: com.taobao.idlefish.x
└── 目标: 规避淘宝检测

fake_litiaotiao (跳跳鱼) - 当前分支
├── OpenCV 4.8.0 ✅ (与main相同!)
├── ONNXRuntime 1.15.1 ✅ (代码存在)
├── YOLO NCNN ✅ (18文件存在)
├── PaddleOCR ✅ (27文件存在)
├── GitHub Actions ❌
├── AccessibilityFloatyService ❌
├── WrapFactory: 无isJavaPrimitiveWrap，有String处理
├── 包名: com.litiaotiao.app
└── 目标: 规避李跳跳等工具检测
```

**伪装分支的实际共同特点（代码验证）**：
1. ~~OpenCV版本降级至4.5.5~~ **错误！实际均为4.8.0**
2. 移除GitHub Actions避免公开构建
3. 移除AccessibilityFloatyService（死代码清理，功能无损失）
4. 使用特定包名和图标规避检测
5. **AI功能代码完整保留**（ONNX/YOLO/OCR）

**⚠️ README文档多处与实际代码不符**：
- OpenCV版本声称4.5.5，实际是4.8.0
- README声称移除了高级AI功能，但实际代码完整存在
- 这可能是故意降低项目关注度或误导检测工具

## 7. 高级功能实现分析

### 7.1 OCR 文字识别实现
OCR 功能通过 `$ocr` 模块实现，基于 PaddleOCR 引擎：
- 支持初始化自定义模型
- 提供文本识别和检测功能
- 支持按区域截取识别
- 具有资源自动回收机制

### 7.2 YOLO 目标检测实现
YOLO 功能通过 `$yolo` 模块实现，支持 ONNX 和 NCNN 格式：
- 支持 ONNXRuntime 和 NCNN 两种推理后端
- 提供模型初始化、推理和资源释放功能
- 支持置信度过滤和自定义标签
- 具有完整的错误处理机制

### 7.3 TTS 语音合成功能
TTS 功能通过 `$tts` 模块实现，基于 Android TextToSpeech API：
- 支持多种语言和音调调节
- 提供同步和异步朗读方式
- 具备事件监听和回调机制
- 音量、语速、音调可调节

### 7.4 图像处理与识别
图像处理基于 OpenCV 4.8.0 实现：
- 提供截图、裁剪、颜色检测等功能
- 支持模板匹配和多点颜色查找
- 具备图像预处理和格式转换功能

## 8. 跳跳鱼分支（fake_litiaotiao）OCR功能详细分析

跳跳鱼分支虽然表面上移除了高级AI功能，但在代码层面仍然保留了OCR模块，其实际功能表现需要通过具体分析来确定。

### 8.1 OCR模块文件分析

#### JavaScript层实现
- **__$ocr__.js**：PaddleOCR模块实现
- **__$mlKitOcr__.js**：ML Kit OCR模块实现
- **示例代码**：在`app/src/main/assets/sample/OCR/`目录下存在多个OCR示例

#### OCR示例代码分析
跳跳鱼分支包含以下OCR示例文件：
- `PaddleOCR.js` - 基础PaddleOCR识别示例
- `PaddleOCR截图识别.js` - 截图识别示例
- `PaddleOCR截图识别v4.js` - 使用v4模型的示例
- `MlKitOCR.js` - ML Kit OCR示例
- `MlKitOCR截图识别.js` - ML Kit截图识别示例

#### 示例代码特点
1. **初始化方式**：
   ```javascript
   importClass(com.baidu.paddle.lite.ocr.Predictor)
   let predictor = new Predictor()
   let loadSuccess = loading.blockedGet()
   ```

2. **模型路径处理**：
   - 使用精简版模型：`let useSlim = true`
   - 内置默认模型路径：`models/ocr_v3_for_cpu`
   - 支持自定义模型路径配置

3. **功能完整性**：
   - 包含完整的初始化、识别、资源回收流程
   - 支持区域识别和完整文本检测
   - 包含性能测试代码

### 8.2 跳跳鱼分支的实际OCR功能状态

尽管README中声称跳跳鱼分支移除了高级AI功能，但通过实际代码分析发现：

1. **模块文件保留**：`__$ocr__.js`、`__$mlKitOcr__.js`等模块文件依然存在于assets目录中

2. **示例代码完整**：OCR示例目录包含多个使用示例，代码结构完整

3. **依赖库可能被移除**：虽然JavaScript模块存在，但底层的native库（PaddleLite）可能被移除或禁用

4. **运行时检查机制**：实际运行时可能会通过配置或条件判断来判断AI功能是否可用

5. **目标场景**：
   - 保留核心自动化功能
   - 移除或禁用高级AI推理引擎
   - 减小APK体积以规避检测
   - 保持代码结构完整以支持未来功能启用

### 8.3 YOLO功能状态
同样，跳跳鱼分支也保留了YOLO相关模块：
- `__$yolo__.js` 模块文件
- `app/src/main/assets/sample/YOLO/` 示例目录
- 但底层AI推理引擎可能被禁用或移除

## 9. Rhino 1.7.14 ES6 语法支持详情

Rhino 1.7.14 引擎在 Auto.js 中通过设置 `context.languageVersion = Context.VERSION_ES6` 启用了ES6支持。根据 **71项全量测试**，支持率达到 **70.4%（50/71）**。以下是详细的支持情况：

### 9.1 支持率统计

| 类别 | 数量 | 占比 |
|------|------|------|
| 完全支持 | 50项 | 70.4% |
| 谨慎使用 | 2项 | 2.8% |
| 绝对禁用 | 19项 | 26.8% |

### 9.2 完全支持的ES6特性（50项，70.4%）

#### 基础语法
- **块级作用域**：`let` 和 `const` 关键字
- **模板字符串**：`${}` 语法
- **箭头函数**：`=>` 语法
- **数字分隔符**：`const num = 1_000_000;`

#### 解构赋值
- **无默认值的解构**：`const {width, height} = device;`
- **变量交换**：`[a, b] = [b, a];`

#### 集合
- **Map/Set**：完全支持基础操作（add/set/get/has/delete等）

#### 对象操作
- **属性简写**：`{name}` 代替 `{name:name}`
- **方法简写**：`{fn(){}}` 代替 `{fn:function(){}}`
- **Object扩展方法**：`Object.assign()`、`Object.values()`、`Object.entries()`

#### 字符串方法
- `includes`、`startsWith`、`endsWith`、`repeat`、`padStart`、`padEnd`

#### 数组方法
- `find`、`findIndex`、`some`、`every`、`filter`、`map`

#### 异步/生成器
- **Promise**：全操作支持（then/catch）
- **生成器**：`function*` 语法和 `yield` 关键字

### 9.3 谨慎使用的特性（2项）
- **WeakMap/WeakSet**：语法支持（可创建实例），但不推荐使用，建议用Map/Set替代

### 9.4 绝对禁用的特性（19项）

#### 默认值相关（会报语法错误）
- **函数参数默认值**：`function func(a, b = 10) { ... }`
- **解构赋值带默认值**：`const [a, b = 5] = [1];`

#### 扩展运算符相关（会报语法错误）
- **剩余参数**：`function func(...args) { ... }`
- **数组扩展**：`[...arr]`
- **解构剩余项**：`[a, ...rest]` 或 `{a, ...rest}`
- **计算属性名**：`{[key]: value}`

#### ES2020+新运算符（会报语法错误）
- **空值合并运算符**：`??`
- **可选链运算符**：`?.`
- **短路赋值**：`||=`、`&&=`

#### 高阶特性（会报语法错误）
- **类（Class）**：`class MyClass { ... }`
- **async/await**：`async function fn() { await ... }`
- **Proxy 和 Reflect**
- **Symbol**：完全不支持（底层引擎抛出IllegalStateException）
- **ES6 import/export**：使用CommonJS的 `require` 和 `module.exports`
- **函数表达式**：`const fn = function(a, b) { ... }`
- **数组高阶方法**：`flat()`、`flatMap()` - 引擎未实现

### 9.5 JavaScript引擎配置
- **语言版本**：`Context.VERSION_ES6`
- **优化级别**：`-1`（禁用优化，提高兼容性）
- **模块系统**：CommonJS，通过 JVM-NPM 实现

### 9.6 开发避坑指南

**避坑口诀**：缺省值别写，三点号不用，新运算符不碰，仅用函数声明！

```javascript
// ✅ 正确写法
function add(a, b) { return a + b; }
const sum = (a, b) => a + b;
const {width, height} = device;
const arr = [1, 2, 3].map(x => x * 2);

// ❌ 错误写法（会报语法错误）
function add(a, b = 0) { return a + b; }  // 默认参数不支持
const result = {...obj};                   // 扩展运算符不支持
const value = obj?.prop;                   // 可选链不支持
```

## 10. 维护建议与开发指南

### 10.1 构建优化建议
- **APK体积优化**：考虑使用App Bundle替代多APK分发
- **资源压缩**：启用`minifyEnabled`和`shrinkResources`减少APK体积
- **ABI配置**：项目已配置ABI splits，支持armeabi-v7a和arm64-v8a

### 10.2 依赖更新建议
- **AndroidX库**：当前版本1.4.1较旧，考虑更新以获得更好的Android兼容性
- **AndroidAnnotations**：4.8.0版本已弃用，考虑迁移到现代DI框架（如Hilt）
- **Kotlin版本**：当前1.9.0，建议保持更新

### 10.3 代码质量建议
- **语言统一**：新代码建议统一使用Kotlin
- **重复代码**：发现重复的AccessibilityService文件需要清理：
  - `/automator/src/main/java/.../accessibility/AccessibilityService.kt`
  - `/autojs/src/main/java/.../accessibility/AccessibilityService.kt`
- **单元测试**：为JavaScript桥接层添加单元测试

### 10.4 性能优化建议
- **内存回收**：`TopLevelScope`回收延迟1分钟，短脚本可考虑更激进的清理策略
- **模块预编译**：可预编译JavaScript模块以提升启动速度
- **截图权限**：多脚本共享截图权限的实现需要优化

### 10.5 关键文件路径索引

| 功能 | 文件路径 |
|------|----------|
| 应用入口 | `app/src/main/java/org/autojs/autojs/App.kt` |
| 引擎初始化 | `autojs/src/main/java/com/stardust/autojs/AutoJs.java` |
| JS执行引擎 | `autojs/src/main/java/com/stardust/autojs/engine/RhinoJavaScriptEngine.kt` |
| API运行时 | `autojs/src/main/java/com/stardust/autojs/runtime/ScriptRuntime.java` |
| JS初始化 | `autojs/src/main/assets/init.js` |
| 无障碍服务 | `automator/src/main/java/com/stardust/view/accessibility/AccessibilityService.kt` |
| OCR实现 | `autojs/src/main/java/com/stardust/autojs/core/image/ocr/` |
| YOLO实现 | `autojs/src/main/java/com/stardust/autojs/runtime/api/Yolo.java` |
| 主模块配置 | `autojs/build.gradle` |
| OpenCV集成 | `autojs-aar/opencv/build.gradle` |

### 10.6 架构模式总结

项目采用了以下架构模式：

1. **分层架构**：UI → Service → Runtime → Engine → Native
2. **委托模式**：AccessibilityService委托给多个AccessibilityDelegate
3. **桥接模式**：JS-Java通过ScriptRuntime桥接
4. **构建器模式**：ScriptRuntime.Builder、ScriptEngineServiceBuilder
5. **观察者模式**：OnKeyListener.Observer、EventDispatcher

## 11. 总结

Auto.js 项目是一个功能强大的 Android 自动化工具，通过 JavaScript 作为脚本语言，实现了对 Android 设备的深度控制。项目通过多个分支策略，既保持了功能的完整性，又提供了针对特定场景的优化版本。

### 11.1 项目亮点

- **JavaScript与Android原生深度结合**：通过Rhino引擎和桥接机制实现JS-Java双向调用
- **AI能力集成**：支持PaddleOCR、YOLO、ONNX等多种推理引擎
- **自动化核心**：基于无障碍服务和Root权限的双重自动化方案
- **模块化设计**：清晰的模块划分和依赖关系

### 11.2 技术栈概览

| 层级 | 技术 |
|------|------|
| 脚本语言 | JavaScript (ES5 + 部分ES6) |
| JS引擎 | Rhino 1.7.14 |
| 图像处理 | OpenCV 4.8.0 |
| AI推理 | PaddleLite 2.13-rc, ONNX Runtime, NCNN |
| 构建系统 | Gradle 7.2.2 |
| 目标平台 | Android API 21-33 |

### 11.3 ES6支持情况总结

| 项目 | 数据 |
|------|------|
| 总测试项 | 71项 |
| 支持数量 | 50项 |
| 支持率 | 70.4% |
| 核心可用特性 | 箭头函数、模板字符串、let/const、解构赋值、Promise、Map/Set |
| 核心禁用特性 | 默认参数、扩展运算符、class、async/await、可选链 |

### 11.4 分支策略

| 分支 | 包名 | 特点 |
|------|------|------|
| main | org.autojs.autojs.modify | 功能完整，含所有AI功能 |
| fake_idlefish | com.taobao.idlefish | 闲鱼伪装，移除部分AI功能 |
| fake_litiaotiao | com.litiaotiao.app | 李跳跳伪装，核心自动化功能 |

### 11.5 ES6+ 语法开发指南（基于71项全量测试结果）

根据 71 项详细测试，Auto.js 的 ES6+ 语法支持率达到 70.4%（50/71），以下是开发指南：

#### ✅ 放心使用（50项，70.4%）
1. **基础语法**：箭头函数、模板字符串、let/const块级作用域、数字分隔符_
2. **解构赋值**：无默认值的数组/对象解构、变量纯交换[a,b]=[b,a]
3. **集合**：Map/Set所有基础操作（add/set/has/get/delete）
4. **对象**：属性/方法简写、Object.assign/values/entries
5. **字符串**：includes/startsWith/endsWith/repeat/padStart/padEnd
6. **数组**：find/findIndex/some/every/filter/map（ES6基础方法）
7. **异步/生成器**：Promise全操作（then/catch）、生成器function*+yield
8. **函数**：仅普通函数声明 function fn(a,b)（无默认值/无...）

#### ⚠️ 谨慎使用（2项）
1. **WeakMap/WeakSet** 基础创建（无实际开发价值，可用Map/Set直接替代）

#### 🔴 绝对禁用（19项，核心避坑）
1. **默认值相关**：函数参数默认值、解构赋值带默认值（数组/对象）
2. **...运算符相关**：剩余参数、数组扩展、解构剩余项、计算属性名
3. **ES2020+新运算符**：??、?.、||=、&&=
4. **高阶特性**：Class类/继承、async/await、Proxy、Symbol、ES6 import/export、函数表达式
5. **数组高阶方法**：flat()、flatMap()

#### 📌 开发建议
- **模块化**：使用 Auto.js 原生支持的 CommonJS 规范（require/module.exports）
- **避坑口诀**：缺省值别写，三点号不用，新运算符不碰，仅用函数声明！
- **替代方案**：使用传统函数声明替代函数表达式，使用Object.assign替代扩展运算符等