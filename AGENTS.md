# Auto.js 项目说明文档

## 项目概述

Auto.js 是一个支持无障碍服务的 Android 平台上的 JavaScript IDE，其发展目标是类似于 JsBox 和 Workflow。这是一个修改版的 Auto.js 项目，由 TonyJiangWJ 维护开发，原作者 hyb1996 已选择闭源开发 AutoJS Pro。

### 主要特性

1. 由无障碍服务实现的简单易用的自动操作函数
2. 悬浮窗录制和运行
3. 更专业&强大的选择器API，提供对屏幕上的控件的寻找、遍历、获取信息、操作等
4. 采用JavaScript为脚本语言，并支持代码补全、变量重命名、代码格式化、查找替换等功能
5. 支持使用Root权限以提供更强大的屏幕点击、滑动、录制功能和运行shell命令
6. 提供截取屏幕、保存截图、图片找色、找图等函数
7. 可作为Tasker插件使用
8. 带有界面分析工具，类似Android Studio的LayoutInspector

### 修改版的主要改进

- 修复了大量内存泄露问题
- 变更默认包名为 `org.autojs.autojs.modify`，支持64位和32位，修复对Android12的支持
- 替换了定时任务的调度代码，增加了WorkManager和AlarmManager的选项
- 修改了截图权限逻辑，支持多个脚本同时运行时共享AutoJS的截图权限
- 更新opencv版本为4.8.0，支持SIFT找图、DNN加载YoloV8模型等特性
- 增加OnnxRuntime，支持本地推理ONNX模型
- 内置了PaddleLite2.13-rc，支持本地模型推理
- 更新内置rhino版本为1.7.14，支持字符串模板等JS特性
- 增加PaddleOCR，封装为 `$ocr`

## 技术架构

### 项目结构

- `app/` - 主应用程序模块
- `autojs/` - 核心 JavaScript 引擎模块
- `autojs-aar/` - 包含各种 AAR 库（opencv、rhino、paddleocr等）
- `automator/` - 自动化相关功能
- `common/` - 公共代码模块
- `inrt/` - 其他功能模块
- `js-supports/` - JavaScript 支持模块

### 核心组件

1. **JavaScript 引擎**: 基于 Rhino 1.7.14，提供 JavaScript 执行环境
2. **无障碍服务**: 实现自动化操作的核心服务
3. **图像处理**: 基于 OpenCV 4.8.0，提供图像识别和处理功能
4. **OCR 功能**: 集成了 PaddleOCR 和 ML Kit OCR
5. **AI 推理**: 支持 ONNXRuntime、PaddleLite 和 YOLOv8 NCNN

### 主要文件

- `init.js` - JavaScript 引擎初始化脚本
- `AutoJs.java` - 核心引擎类
- `App.kt` - 主应用程序类

### 核心类职责

| 类 | 路径 | 职责 |
|----|------|------|
| `AutoJs.java` | `autojs/.../AutoJs.java` | 引擎初始化、ScriptEngineManager管理 |
| `RhinoJavaScriptEngine.kt` | `autojs/.../engine/` | JS执行引擎，Context和Scope管理 |
| `ScriptRuntime.java` | `autojs/.../runtime/` | 暴露所有JS API |
| `AccessibilityService.kt` | `automator/.../` | 无障碍服务核心 |

### JavaScript ES6 支持（Rhino 1.7.14）

**支持率**: 70.4% (50/71项测试)

**✅ 支持特性**:
- 箭头函数、模板字符串、let/const、解构赋值
- Promise、Map/Set、生成器(function*/yield)
- Object.assign/values/entries、数组方法(find/filter/map等)

**❌ 不支持特性**:
- 默认参数、扩展运算符(...)、class、async/await
- 可选链(?.)、空值合并(??)、ES6 import/export

**避坑口诀**: 缺省值别写，三点号不用，新运算符不碰，仅用函数声明！

## 构建和运行

### 环境要求

- JDK 11 或更高版本
- Android SDK
- Gradle 7.x

### 构建说明

1. 项目使用 Gradle 构建系统
2. 默认 Gradle 配置了代理，请根据需要修改 `gradle.properties` 文件
3. 使用 Android Studio 内置的 OpenJDK 即可满足编译需求

### 编译命令

```bash
# 使用 Gradle Wrapper 编译
./gradlew assembleDebug
./gradlew assembleRelease
```

### 模块依赖

项目包含多个模块，主要依赖关系如下：
- `app` 模块依赖 `autojs`、`automator`、`common` 等模块
- `autojs` 模块为核心引擎，提供 JavaScript 执行环境
- `autojs-aar` 包含各种第三方库（OpenCV、Rhino、PaddleOCR等）

## 开发约定

### 代码规范

- 项目使用 Java 和 Kotlin 混合开发
- 遵循 Android 开发最佳实践
- 使用 AndroidAnnotations 等注解库简化开发

### JavaScript API

- 提供丰富的 JavaScript API，如 `app`、`automator`、`console`、`dialogs` 等
- API 设计参考了原版 Auto.js，保持兼容性

### 许可证

本项目基于 Mozilla Public License Version 2.0 (MPL2.0) 并附加以下条款：
- 非商业性使用 - 不得将此项目及其衍生的项目的源代码和二进制产品用于任何商业和盈利用途

## 使用说明

### 脚本开发

1. 编写 JavaScript 脚本
2. 在应用中运行脚本
3. 利用丰富的 API 实现自动化任务

### 特殊功能

- 无障碍服务：需要手动启用
- Root 权限：提供更强大的操作能力
- 截图权限：支持多种截图方式

## 分支差异（代码验证结果）

项目包含三个主要分支：

| 分支 | 包名 | OpenCV | 特点 |
|------|------|--------|------|
| main | `org.autojs.autojs.modify` | **4.8.0** | 功能完整 |
| fake_idlefish | `com.taobao.idlefish.x` | **4.8.0** | 闲鱼伪装 |
| fake_litiaotiao | `com.litiaotiao.app` | **4.8.0** | 跳跳鱼伪装 |

**⚠️ 重要发现（代码验证）**：
- **OpenCV版本**：所有分支均为4.8.0，README声称4.5.5是**错误的**
- **AI功能**：所有分支的AI功能代码均完整保留
  - ONNX Runtime 1.15.1
  - YOLOv8 NCNN (18文件)
  - PaddleOCR (27文件)

**伪装分支实际差异**：
- ~~OpenCV降级至4.5.5~~ **错误！实际均为4.8.0**
- 移除GitHub Actions
- 移除AccessibilityFloatyService（死代码清理，功能无损失）
- 包名和图标伪装
- Rhino WrapFactory实现差异

**兼容性警告**：NCNN和PaddleOCR同时使用会导致闪退，建议使用ONNX+ML Kit OCR组合。

## 构建配置差异

**差异文件**：仅 `project-versions.json` 和 `app/build.gradle`

| 配置项 | main分支 | fake_litiaotiao分支 |
|--------|----------|---------------------|
| applicationId | `org.autojs.autojs` | `com.litiaotiao.app` |
| release包名 | `org.autojs.autojs.modify` | `com.litiaotiao.app` |
| appVersionName | `...Modify` | `...FakeLiTT` |

**所有依赖配置相同**：OpenCV、ONNX、PaddleOCR、YOLO版本完全一致。

## 注意事项

- 项目为个人维护版本，主要针对特定脚本需求（如蚂蚁森林、蚂蚁庄园）
- 编译问题需要开发者具备 Android 开发基础
- 不支持的功能包括内置编辑器优化等
- 若需更丰富的功能，建议使用其他开源版本如 AutoJS6 或 AutoX