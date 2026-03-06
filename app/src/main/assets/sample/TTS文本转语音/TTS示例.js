/**
 * TextToSpeech (TTS) 模块使用示例
 * 
 * 这个脚本演示了如何使用tts模块进行文本转语音
 */

"ui";

ui.layout(
    <vertical padding="16">
        <text text="TTS (文本转语音) 模块示例" textStyle="bold" textSize="18sp" margin="8"/>
        
        <horizontal margin="8">
            <input id="inputText" hint="输入要朗读的文本" text="你好，这是Auto.js的语音合成功能" layout_weight="1"/>
            <button id="speakBtn" text="朗读"/>
        </horizontal>
        
        <text text="语速调节:" margin="8"/>
        <seekbar id="speechRateBar" max="20" progress="10"/>
        <text id="speechRateText" text="当前语速: 1.0" margin="8"/>
        
        <text text="音调调节:" margin="8"/>
        <seekbar id="pitchBar" max="20" progress="10"/>
        <text id="pitchText" text="当前音调: 1.0" margin="8"/>
        
        <horizontal margin="8">
            <button id="pauseBtn" text="停止" layout_weight="1"/>
            <button id="zhBtn" text="中文" layout_weight="1"/>
            <button id="enBtn" text="英文" layout_weight="1"/>
        </horizontal>
        
        <horizontal margin="8">
            <button id="previewBtn" text="预览(短文本)" layout_weight="1"/>
            <button id="asyncBtn" text="异步朗读" layout_weight="1"/>
        </horizontal>
    </vertical>
);

// 更新语速显示
ui.speechRateBar.on("progress", (progress) => {
    let rate = progress / 10;
    ui.speechRateText.setText("当前语速: " + rate.toFixed(1));
});

// 更新音调显示
ui.pitchBar.on("progress", (progress) => {
    let pitch = progress / 10;
    ui.pitchText.setText("当前音调: " + pitch.toFixed(1));
});

// 朗读按钮
ui.speakBtn.on("click", () => {
    let text = ui.inputText.getText().toString();
    if (text.length == 0) {
        toast("请输入要朗读的文本");
        return;
    }
    
    // 获取语速和音调
    let speechRate = ui.speechRateBar.getProgress() / 10;
    let pitch = ui.pitchBar.getProgress() / 10;
    
    tts.speak(text, {
        speechRate: speechRate,
        pitch: pitch
    });
});

// 停止按钮
ui.pauseBtn.on("click", () => {
    tts.stop();
});

// 中文语言设置
ui.zhBtn.on("click", () => {
    let success = tts.setLanguage('zh-CN');
    if (success) {
        toast("已设置为中文");
    } else {
        toast("中文语言设置失败");
    }
});

// 英文语言设置
ui.enBtn.on("click", () => {
    let success = tts.setLanguage('en-US');
    if (success) {
        toast("已设置为英文");
    } else {
        toast("英文语言设置失败");
    }
});

// 预览功能
ui.previewBtn.on("click", () => {
    tts.preview("这是预览文本");
});

// 异步朗读功能
ui.asyncBtn.on("click", () => {
    let text = ui.inputText.getText().toString();
    if (text.length == 0) {
        toast("请输入要朗读的文本");
        return;
    }
    
    tts.speakAsync(text, (error) => {
        if (error) {
            toastLog("朗读失败: " + error.message);
        } else {
            toastLog("朗读完成");
        }
    });
});