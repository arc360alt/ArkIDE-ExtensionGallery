(async function(Scratch) {
    const variables = {};

    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }

    const ExtForge = {
        Broadcasts: new function() {
            this.raw_ = {};
            this.register = (name, blocks) => {
                this.raw_[name] = blocks;
            };
            this.execute = async (name) => {
                if (this.raw_[name]) {
                    await this.raw_[name]();
                };
            };
        },

        Variables: new function() {
            this.raw_ = {};
            this.set = (name, value) => {
                this.raw_[name] = value;
            };
            this.get = (name) => {
                return this.raw_[name] ?? null;
            }
        },

        Vector: class {
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }

            static from(v) {
                if (v instanceof ExtForge.Vector) return v
                if (v instanceof Array) return new ExtForge.Vector(Number(v[0]), Number(v[1]))
                if (v instanceof Object) return new ExtForge.Vector(Number(v.x), Number(v.y))
                return new ExtForge.Vector()
            }

            add(v) {
                return new Vector(this.x + v.x, this.y + v.y);
            }

            set(x, y) {
                return new Vector(x ?? this.x, y ?? this.y)
            }
        },

        Utils: {
            setList: (list, index, value) => {
                [...list][index] = value;
                return list;
            },
            lists_foreach: {
                index: [0],
                value: [null],
                depth: 0
            },
            countString: (x, y) => {
                return y.length == 0 ? 0 : x.split(y).length - 1
            }
        }
    }

    class Extension {
        getInfo() {
            return {
                "id": "arkide",
                "name": "ArkIDE Additions",
                "color1": "#5200ff",
                "blocks": [{
                    "opcode": "block_6a44d3d06218626b",
                    "text": "Pause Project (Stop)",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_3d961ca81840842b",
                    "text": "Play Project (Start)",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_e9852c2efdb6e6f2",
                    "text": "Set Turbo Mode [MODE]",
                    "blockType": "command",
                    "arguments": {
                        "MODE": {
                            "type": "string",
                            "menu": "turboMenu"
                        }
                    }
                }, {
                    "opcode": "block_turbo_status",
                    "text": "Turbo Mode enabled?",
                    "blockType": "Boolean",
                    "arguments": {}
                }, {
                    "opcode": "block_02469e8d1cc6244c",
                    "text": "Alert User: [5adb97d708fd8d13]",
                    "blockType": "command",
                    "arguments": {
                        "5adb97d708fd8d13": {
                            "type": "string",
                            "defaultValue": "This is an ArkIDE Project!"
                        }
                    }
                }, {
                    "opcode": "block_6f02e9ec204e0935",
                    "text": "Set Framerate to: [3182a9fddfab9ac4]",
                    "blockType": "command",
                    "arguments": {
                        "3182a9fddfab9ac4": {
                            "type": "number",
                            "defaultValue": 60
                        }
                    }
                }, {
                    "opcode": "block_get_framerate",
                    "text": "Current Framerate",
                    "blockType": "reporter",
                    "arguments": {}
                }, {
                    "opcode": "block_c948c3beccfbf0cc",
                    "text": "Log Message: [ec30006abbf6981b]",
                    "blockType": "command",
                    "arguments": {
                        "ec30006abbf6981b": {
                            "type": "string",
                            "defaultValue": "hi"
                        }
                    }
                }, {
                    "opcode": "block_ff159a6d6763cb12",
                    "text": "set API key: [28de697a40af259a]",
                    "blockType": "command",
                    "arguments": {
                        "28de697a40af259a": {
                            "type": "string"
                        }
                    }
                }, {
                    "opcode": "block_5e57cf9d81072d1b",
                    "text": "Ask Gemini: [09f9ebd342383991]",
                    "blockType": "reporter",
                    "arguments": {
                        "09f9ebd342383991": {
                            "type": "string"
                        }
                    }
                }, {
                    "opcode": "block_set_system_prompt",
                    "text": "Set Gemini System Prompt: [PROMPT]",
                    "blockType": "command",
                    "arguments": {
                        "PROMPT": {
                            "type": "string",
                            "defaultValue": "You are a helpful assistant."
                        }
                    }
                }, {
                    "opcode": "block_4acfbd4167f0698d",
                    "text": "returnapikey",
                    "blockType": "reporter",
                    "arguments": {}
                }, {
                    "opcode": "block_788944bdafad134b",
                    "text": "latestresponce",
                    "blockType": "reporter",
                    "arguments": {}
                }, {
                    "opcode": "block_clear_memory",
                    "text": "Clear Gemini Memory",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_confirm",
                    "text": "Confirm: [MESSAGE]",
                    "blockType": "Boolean",
                    "arguments": {
                        "MESSAGE": {
                            "type": "string",
                            "defaultValue": "Are you sure?"
                        }
                    }
                }, {
                    "opcode": "block_prompt",
                    "text": "Prompt user: [MESSAGE]",
                    "blockType": "reporter",
                    "arguments": {
                        "MESSAGE": {
                            "type": "string",
                            "defaultValue": "Enter something:"
                        }
                    }
                }, {
                    "opcode": "block_get_username",
                    "text": "Get Scratch Username",
                    "blockType": "reporter",
                    "arguments": {}
                }, {
                    "opcode": "block_open_url",
                    "text": "Open URL: [URL]",
                    "blockType": "command",
                    "arguments": {
                        "URL": {
                            "type": "string",
                            "defaultValue": "https://scratch.mit.edu"
                        }
                    }
                }, {
                    "opcode": "block_redirect_url",
                    "text": "Redirect to URL: [URL]",
                    "blockType": "command",
                    "arguments": {
                        "URL": {
                            "type": "string",
                            "defaultValue": "https://scratch.mit.edu"
                        }
                    }
                }, {
                    "opcode": "block_copy_to_clipboard",
                    "text": "Copy to clipboard: [TEXT]",
                    "blockType": "command",
                    "arguments": {
                        "TEXT": {
                            "type": "string",
                            "defaultValue": "Hello!"
                        }
                    }
                }, {
                    "opcode": "block_current_url",
                    "text": "Current URL",
                    "blockType": "reporter",
                    "arguments": {}
                }, {
                    "opcode": "block_battery_level",
                    "text": "Battery Level %",
                    "blockType": "reporter",
                    "arguments": {}
                }, {
                    "opcode": "block_is_charging",
                    "text": "Device Charging?",
                    "blockType": "Boolean",
                    "arguments": {}
                }, {
                    "opcode": "block_fullscreen",
                    "text": "Toggle Fullscreen",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_vibrate",
                    "text": "Vibrate for [MS] ms",
                    "blockType": "command",
                    "arguments": {
                        "MS": {
                            "type": "number",
                            "defaultValue": 200
                        }
                    }
                }],
                "menus": {
                    "turboMenu": {
                        "acceptReporters": false,
                        "items": ["on", "off"]
                    }
                }
            }
        }
        
        async block_6a44d3d06218626b(args) {
            Scratch.vm.stopAll();
        }
        
        async block_3d961ca81840842b(args) {
            Scratch.vm.greenFlag();
        }
        
        async block_e9852c2efdb6e6f2(args) {
            if (args.MODE === "on") {
                Scratch.vm.setTurboMode(true);
            } else {
                Scratch.vm.setTurboMode(false);
            }
        }
        
        async block_turbo_status(args) {
            return Scratch.vm.runtime.turboMode;
        }
        
        async block_02469e8d1cc6244c(args) {
            eval(String.prototype.concat(String("alert(\""), String.prototype.concat(args["5adb97d708fd8d13"], String("\")"))))
        }
        
        async block_6f02e9ec204e0935(args) {
            Scratch.vm.runtime.frameLoop.setFramerate(args["3182a9fddfab9ac4"]);
        }
        
        async block_get_framerate(args) {
            return Scratch.vm.runtime.frameLoop.framerate || 30;
        }
        
        async block_c948c3beccfbf0cc(args) {
            console.log(args["ec30006abbf6981b"]);
        }
        
        async block_ff159a6d6763cb12(args) {
            ExtForge.Variables.set("apikey", args["28de697a40af259a"])
        }
        
        async block_set_system_prompt(args) {
            ExtForge.Variables.set("system_prompt", args.PROMPT);
            ExtForge.Variables.set("gemini_history", []);
        }
        
        async block_5e57cf9d81072d1b(args) {
            try {
                if (!ExtForge.Variables.get("gemini_history")) {
                    ExtForge.Variables.set("gemini_history", []);
                }
                
                let history = ExtForge.Variables.get("gemini_history");
                
                history.push({
                    role: "user",
                    parts: [{text: args["09f9ebd342383991"]}]
                });
                
                let requestBody = {
                    contents: history
                };
                
                const systemPrompt = ExtForge.Variables.get("system_prompt");
                if (systemPrompt) {
                    requestBody.systemInstruction = {
                        parts: [{text: systemPrompt}]
                    };
                }
                
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${ExtForge.Variables.get("apikey")}`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(requestBody)
                });
                
                const data = await response.json();
                
                if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                    const aiResponse = data.candidates[0].content.parts[0].text;
                    
                    history.push({
                        role: "model",
                        parts: [{text: aiResponse}]
                    });
                    
                    ExtForge.Variables.set("gemini_history", history);
                    ExtForge.Variables.set("latestresponce", aiResponse);
                    
                    return aiResponse;
                } else {
                    console.error("Unexpected response structure:", data);
                    const errorMsg = "Error: " + (data.error?.message || JSON.stringify(data));
                    ExtForge.Variables.set("latestresponce", errorMsg);
                    return errorMsg;
                }
            } catch (error) {
                console.error("Fetch error:", error);
                const errorMsg = "Error: " + error.message;
                ExtForge.Variables.set("latestresponce", errorMsg);
                return errorMsg;
            }
        }
        
        async block_4acfbd4167f0698d(args) {
            await new Promise(resolve => setTimeout(() => resolve(), (1) * 1000));
            return ExtForge.Variables.get("apikey");
        }
        
        async block_788944bdafad134b(args) {
            return ExtForge.Variables.get("latestresponce");
        }
        
        async block_clear_memory(args) {
            ExtForge.Variables.set("gemini_history", []);
            console.log("Gemini conversation memory cleared");
        }
        
        async block_confirm(args) {
            return confirm(args.MESSAGE);
        }
        
        async block_prompt(args) {
            return prompt(args.MESSAGE) || "";
        }
        
        async block_get_username(args) {
            return Scratch.vm.runtime.ioDevices.userData._username || "Unknown";
        }
        
        async block_open_url(args) {
            window.open(args.URL, '_blank');
        }
        
        async block_redirect_url(args) {
            window.location.href = args.URL;
        }
        
        async block_copy_to_clipboard(args) {
            try {
                await navigator.clipboard.writeText(args.TEXT);
                console.log("Copied to clipboard!");
            } catch (err) {
                console.error("Failed to copy:", err);
            }
        }
        
        async block_current_url(args) {
            return window.location.href;
        }
        
        async block_battery_level(args) {
            try {
                const battery = await navigator.getBattery();
                return Math.round(battery.level * 100);
            } catch (err) {
                return "Not supported";
            }
        }
        
        async block_is_charging(args) {
            try {
                const battery = await navigator.getBattery();
                return battery.charging;
            } catch (err) {
                return false;
            }
        }
        
        async block_fullscreen(args) {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
        
        async block_vibrate(args) {
            if (navigator.vibrate) {
                navigator.vibrate(args.MS);
            }
        }
    }

    let extension = new Extension();
    
    Scratch.extensions.register(extension);
})(Scratch);