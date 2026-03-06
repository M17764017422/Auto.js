/**
 * TextToSpeech (TTS) 模块使用示例
 * 
 * 这个模块提供了文本转语音功能
 */

// 基本朗读
tts.speak("你好，这是Auto.js的语音合成功能");
sleep(2000);

// 使用选项参数朗读
tts.speak("这是一段较慢的语音", {
    speechRate: 0.8,  // 语速较慢
    pitch: 1.1        // 音调稍高
});
sleep(3000);

// 异步朗读（带回调）
tts.speakAsync("这是一段异步朗读的文本", function(error) {
    if (error) {
        console.error("朗读失败: " + error.message);
    } else {
        console.log("朗读完成");
    }
});

// 设置不同的语言
// 中文
tts.setLanguage('zh-CN');
tts.speak("你好，我是中文语音");

sleep(2000);

// 英文
tts.setLanguage('en-US');
tts.speak("Hello, this is English speech synthesis");

sleep(2000);

// 设置语速和音调
tts.setSpeechRate(1.5);  // 较快的语速
tts.setPitch(1.2);       // 较高的音调
tts.speak("这是一段又快又高的语音");

sleep(2000);

// 检查是否正在朗读
if (tts.isSpeaking()) {
    console.log("正在朗读中...");
} else {
    console.log("没有在朗读");
}

// 获取支持的语言列表
var languages = tts.getAvailableLanguages();
console.log("支持的语言数量: " + languages.length);
console.log("前5个支持的语言:");
for (var i = 0; i < Math.min(5, languages.length); i++) {
    console.log("- " + languages[i].displayName + " (" + languages[i].language + ")");
}

// 使用预览功能（适用于短文本）
tts.preview("短文本");

// 停止朗读
// tts.stop();

// 脚本结束时会自动关闭TTS，但也可以手动关闭
// tts.shutdown();