/**
 * 测试TextToSpeech (TTS) 模块是否正常工作
 */

console.log("开始测试TTS模块...");

// 检查tts对象是否存在
if (typeof tts !== 'undefined') {
    console.log("TTS模块已成功加载");
    
    // 测试基本朗读功能
    console.log("测试基本朗读功能...");
    try {
        tts.speak("TTS模块测试成功");
        console.log("基本朗读功能测试完成");
    } catch (e) {
        console.error("基本朗读功能测试失败: " + e.message);
    }
    
    // 测试带选项的朗读
    console.log("测试带选项的朗读...");
    try {
        tts.speak("测试带选项的朗读", {
            speechRate: 1.0,
            pitch: 1.0
        });
        console.log("带选项朗读功能测试完成");
    } catch (e) {
        console.error("带选项朗读功能测试失败: " + e.message);
    }
    
    // 测试获取支持的语言
    console.log("测试获取支持的语言...");
    try {
        var languages = tts.getAvailableLanguages();
        console.log("支持的语言数量: " + languages.length);
        if (languages.length > 0) {
            console.log("第一个支持的语言: " + languages[0].displayName);
        }
        console.log("语言列表功能测试完成");
    } catch (e) {
        console.error("语言列表功能测试失败: " + e.message);
    }
    
    // 测试异步朗读
    console.log("测试异步朗读功能...");
    try {
        tts.speakAsync("这是一段异步朗读测试", function(error) {
            if (error) {
                console.error("异步朗读失败: " + error.message);
            } else {
                console.log("异步朗读完成");
            }
        });
        console.log("异步朗读已启动");
    } catch (e) {
        console.error("异步朗读功能测试失败: " + e.message);
    }
    
    // 测试设置语言
    console.log("测试设置语言功能...");
    try {
        var success = tts.setLanguage('zh-CN');
        console.log("设置中文语言: " + success);
        console.log("语言设置功能测试完成");
    } catch (e) {
        console.error("语言设置功能测试失败: " + e.message);
    }
    
    // 测试状态检查
    console.log("测试状态检查功能...");
    try {
        var isSpeaking = tts.isSpeaking();
        console.log("当前是否在朗读: " + isSpeaking);
        console.log("状态检查功能测试完成");
    } catch (e) {
        console.error("状态检查功能测试失败: " + e.message);
    }
    
    console.log("TTS模块所有功能测试完成");
} else {
    console.log("错误：TTS模块未定义");
}