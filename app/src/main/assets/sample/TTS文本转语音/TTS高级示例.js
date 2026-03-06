/**
 * TTS高级功能示例 - 语音助手
 * 
 * 演示TTS模块的高级用法
 */

// 检查TTS是否可用
if (typeof tts === 'undefined') {
    toastLog("TTS模块不可用");
    exit();
}

// 获取支持的语言
console.log("获取支持的语言列表...");
var languages = tts.getAvailableLanguages();
console.log("支持的语言数量: " + languages.length);

// 显示前5个支持的语言
console.log("前5个支持的语言:");
for (var i = 0; i < Math.min(5, languages.length); i++) {
    console.log("- " + languages[i].displayName + " (" + languages[i].language + ")");
}

// 设置默认语言为中文
var success = tts.setLanguage('zh-CN');
if (success) {
    console.log("语言设置成功");
} else {
    console.log("语言设置失败，尝试英语");
    tts.setLanguage('en-US');
}

// 演示不同语速和音调
console.log("演示不同语速和音调效果...");

// 正常语速语调
console.log("1. 正常速度和音调");
tts.speak("这是正常语速和音调的语音");

sleep(3000);

// 慢速
console.log("2. 慢速语音");
tts.speak("这是比较缓慢的语音", {
    speechRate: 0.5,
    pitch: 1.0
});

sleep(3000);

// 快速
console.log("3. 快速语音");
tts.speak("这是比较快速的语音", {
    speechRate: 1.5,
    pitch: 1.0
});

sleep(3000);

// 高音调
console.log("4. 高音调语音");
tts.speak("这是高音调的语音", {
    speechRate: 1.0,
    pitch: 1.5
});

sleep(3000);

// 低音调
console.log("5. 低音调语音");
tts.speak("这是低音调的语音", {
    speechRate: 1.0,
    pitch: 0.7
});

sleep(3000);

// 演示异步朗读
console.log("6. 演示异步朗读功能");
tts.speakAsync("这是异步朗读的文本，朗读完成后会有提示", function(error) {
    if (error) {
        console.error("朗读失败: " + error.message);
    } else {
        console.log("异步朗读完成");
        toastLog("异步朗读已完成");
    }
});

// 检查是否正在朗读
setTimeout(() => {
    if (tts.isSpeaking()) {
        console.log("当前正在朗读");
    } else {
        console.log("当前没有在朗读");
    }
}, 1000);

// 等待异步朗读完成
sleep(5000);

console.log("TTS高级功能示例演示完成！");