module.exports = function (runtime, global) {
    importClass(android.speech.tts.TextToSpeech);
    importClass(java.util.Locale);
    
    var tts = {};
    var textToSpeech = null;
    var ttsInitialized = false;
    
    // 初始化TextToSpeech
    function initTTS() {
        if (textToSpeech == null) {
            textToSpeech = new TextToSpeech(context, new TextToSpeech.OnInitListener({
                onInit: function (status) {
                    if (status == TextToSpeech.SUCCESS) {
                        ttsInitialized = true;
                        // 设置默认语言
                        var result = textToSpeech.setLanguage(Locale.getDefault());
                        if (result == TextToSpeech.LANG_MISSING_DATA || 
                            result == TextToSpeech.LANG_NOT_SUPPORTED) {
                            // 如果默认语言不支持，尝试设置为英语
                            textToSpeech.setLanguage(Locale.ENGLISH);
                        }
                    }
                }
            }));
        }
    }
    
    /**
     * 朗读文本
     * @param {string} text - 要朗读的文本
     * @param {Object} options - 选项
     *   - pitch: 音调 (0.0-2.0, 默认1.0)
     *   - speechRate: 语速 (0.0-2.0, 默认1.0)
     *   - volume: 音量 (0.0-1.0, 默认1.0)
     *   - streamType: 音频流类型 (默认为STREAM_MUSIC)
     */
    tts.speak = function(text, options) {
        if (!ttsInitialized) {
            initTTS();
            // 简单等待初始化完成(实际应用中应该使用回调)
            sleep(500);
        }
        
        if (ttsInitialized && textToSpeech) {
            options = options || {};
            
            // 设置音调
            if (options.pitch !== undefined) {
                textToSpeech.setPitch(options.pitch);
            }
            
            // 设置语速
            if (options.speechRate !== undefined) {
                textToSpeech.setSpeechRate(options.speechRate);
            }
            
            // 设置音量 (通过参数传递)
            var audioParams = {};
            if (options.volume !== undefined) {
                audioParams[TextToSpeech.Engine.KEY_PARAM_VOLUME] = options.volume.toString();
            }
            
            // 设置音频流类型
            if (options.streamType !== undefined) {
                textToSpeech.setStreamType(options.streamType);
            }
            
            textToSpeech.speak(text.toString(), TextToSpeech.QUEUE_FLUSH, audioParams);
        }
    };
    
    /**
     * 异步朗读文本
     * @param {string} text - 要朗读的文本
     * @param {Object} options - 选项
     * @param {Function} callback - 完成回调函数
     */
    tts.speakAsync = function(text, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        
        if (!ttsInitialized) {
            initTTS();
            sleep(500);
        }
        
        if (ttsInitialized && textToSpeech) {
            options = options || {};
            
            // 设置参数
            if (options.pitch !== undefined) {
                textToSpeech.setPitch(options.pitch);
            }
            if (options.speechRate !== undefined) {
                textToSpeech.setSpeechRate(options.speechRate);
            }
            
            var audioParams = {};
            if (options.volume !== undefined) {
                audioParams[TextToSpeech.Engine.KEY_PARAM_VOLUME] = options.volume.toString();
            }
            
            // 创建UtteranceProgressListener来监听完成状态
            var utteranceId = "tts_" + new Date().getTime();
            audioParams[TextToSpeech.Engine.KEY_PARAM_UTTERANCE_ID] = utteranceId;
            
            textToSpeech.setOnUtteranceProgressListener(new android.speech.tts.UtteranceProgressListener({
                onDone: function(utteranceId) {
                    if (callback) {
                        callback(null); // 成功完成
                    }
                },
                onError: function(utteranceId) {
                    if (callback) {
                        callback(new Error("TTS Error")); // 错误
                    }
                },
                onStart: function(utteranceId) {
                    // 开始朗读
                },
                onProgress: function(utteranceId, start, end, eventBuffer) {
                    // 朗读进度
                }
            }));
            
            textToSpeech.speak(text.toString(), TextToSpeech.QUEUE_FLUSH, audioParams);
        } else {
            if (callback) {
                callback(new Error("TextToSpeech not initialized"));
            }
        }
    };
    
    /**
     * 预览朗读文本（短文本）
     * @param {string} text - 要朗读的短文本
     */
    tts.preview = function(text) {
        tts.speak(text, { speechRate: 1.2 });
    };
    
    /**
     * 设置语言
     * @param {string} language - 语言代码，如 'zh-CN', 'en-US', 'ja-JP' 等
     * @returns {boolean} 是否设置成功
     */
    tts.setLanguage = function(language) {
        if (!ttsInitialized) {
            initTTS();
            sleep(500);
        }
        
        if (ttsInitialized && textToSpeech) {
            var locale;
            switch (language.toLowerCase()) {
                case 'zh-cn':
                case 'zh':
                    locale = Locale.SIMPLIFIED_CHINESE;
                    break;
                case 'zh-tw':
                    locale = Locale.TRADITIONAL_CHINESE;
                    break;
                case 'en':
                case 'en-us':
                    locale = Locale.ENGLISH;
                    break;
                case 'ja':
                case 'ja-jp':
                    locale = Locale.JAPANESE;
                    break;
                case 'ko':
                case 'ko-kr':
                    locale = Locale.KOREAN;
                    break;
                case 'fr':
                case 'fr-fr':
                    locale = Locale.FRENCH;
                    break;
                case 'de':
                case 'de-de':
                    locale = Locale.GERMAN;
                    break;
                case 'es':
                case 'es-es':
                    locale = Locale.SPANISH;
                    break;
                default:
                    locale = new Locale(language.split('-')[0]);
            }
            
            var result = textToSpeech.setLanguage(locale);
            return result == TextToSpeech.LANG_AVAILABLE;
        }
        return false;
    };
    
    /**
     * 获取支持的语言列表
     */
    tts.getAvailableLanguages = function() {
        if (!ttsInitialized) {
            initTTS();
            sleep(500);
        }
        
        var languages = [];
        if (ttsInitialized && textToSpeech) {
            var locales = Locale.getAvailableLocales();
            for (var i = 0; i < locales.length; i++) {
                var result = textToSpeech.isLanguageAvailable(locales[i]);
                if (result == TextToSpeech.LANG_AVAILABLE || 
                    result == TextToSpeech.LANG_COUNTRY_AVAILABLE ||
                    result == TextToSpeech.LANG_COUNTRY_VAR_AVAILABLE) {
                    languages.push({
                        language: locales[i].getLanguage(),
                        country: locales[i].getCountry(),
                        displayName: locales[i].getDisplayName(),
                        tag: locales[i].toLanguageTag ? locales[i].toLanguageTag() : null
                    });
                }
            }
        }
        return languages;
    };
    
    /**
     * 设置音调
     * @param {number} pitch - 音调值 (0.0-2.0, 默认1.0)
     */
    tts.setPitch = function(pitch) {
        if (!ttsInitialized) {
            initTTS();
            sleep(500);
        }
        
        if (ttsInitialized && textToSpeech) {
            textToSpeech.setPitch(pitch);
        }
    };
    
    /**
     * 设置语速
     * @param {number} speechRate - 语速 (0.0-2.0, 默认1.0)
     */
    tts.setSpeechRate = function(speechRate) {
        if (!ttsInitialized) {
            initTTS();
            sleep(500);
        }
        
        if (ttsInitialized && textToSpeech) {
            textToSpeech.setSpeechRate(speechRate);
        }
    };
    
    /**
     * 设置音量
     * @param {number} volume - 音量 (0.0-1.0, 默认1.0)
     */
    tts.setVolume = function(volume) {
        if (!ttsInitialized) {
            initTTS();
            sleep(500);
        }
        
        if (ttsInitialized && textToSpeech) {
            // 音量需要在每次朗读时通过参数设置
            // 这里可以保存为默认值
            tts.defaultVolume = volume;
        }
    };
    
    /**
     * 暂停朗读
     */
    tts.pause = function() {
        // TextToSpeech没有直接的暂停方法，我们停止当前朗读
        tts.stop();
    };
    
    /**
     * 停止朗读
     */
    tts.stop = function() {
        if (ttsInitialized && textToSpeech) {
            textToSpeech.stop();
        }
    };
    
    /**
     * 检查是否正在朗读
     * @returns {boolean} 是否正在朗读
     */
    tts.isSpeaking = function() {
        if (ttsInitialized && textToSpeech) {
            return textToSpeech.isSpeaking();
        }
        return false;
    };
    
    /**
     * 关闭TextToSpeech
     */
    tts.shutdown = function() {
        if (textToSpeech) {
            textToSpeech.stop();
            textToSpeech.shutdown();
            textToSpeech = null;
            ttsInitialized = false;
        }
    };
    
    /**
     * 获取当前语言
     */
    tts.getLanguage = function() {
        if (!ttsInitialized) {
            initTTS();
            sleep(500);
        }
        
        if (ttsInitialized && textToSpeech) {
            return textToSpeech.getLanguage();
        }
        return null;
    };
    
    // 在脚本结束时自动关闭TTS
    events.on('exit', function() {
        tts.shutdown();
    });
    
    return tts;
};