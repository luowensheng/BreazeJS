"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.mountView = exports.mountViewWithExtraStyles = void 0;
var addRule = (function (style) {
    var sheet = document.head.appendChild(style).sheet;
    return function (selector, css) {
        var propText = typeof css === "string" ? css : Object.keys(css).map(function (p) {
            return p + ":" + (p === "content" ? "'" + css[p] + "'" : css[p]);
        }).join(";");
        console.log({ propText: selector + "{" + propText + "}" });
        sheet.insertRule(selector + "{" + propText + "}", sheet.cssRules.length);
    };
})(document.createElement("style"));
var generateId = (function () {
    var counter = 1;
    return function () { return counter++; };
})();
function extractPropertiesFromObject(item, onPropertyFound) {
    var _a;
    var propNames = Object.keys(item);
    for (var _i = 0, propNames_1 = propNames; _i < propNames_1.length; _i++) {
        var propName = propNames_1[_i];
        var value = (_a = Object.getOwnPropertyDescriptor(item, propName)) === null || _a === void 0 ? void 0 : _a.value;
        onPropertyFound(propName, value);
    }
}
function addEvents(events, element) {
    var _a;
    var eventNames = Object.keys(events);
    var _loop_1 = function (eventName) {
        var eHandler = (_a = Object.getOwnPropertyDescriptor(events, eventName)) === null || _a === void 0 ? void 0 : _a.value;
        element.addEventListener(eventName, function (event) {
            eHandler(element, event);
        });
    };
    for (var _i = 0, eventNames_1 = eventNames; _i < eventNames_1.length; _i++) {
        var eventName = eventNames_1[_i];
        _loop_1(eventName);
    }
}
function addAttributes(attributes, element) {
    var _a;
    var attributeNames = Object.keys(attributes);
    for (var _i = 0, attributeNames_1 = attributeNames; _i < attributeNames_1.length; _i++) {
        var attributeName = attributeNames_1[_i];
        var value = (_a = Object.getOwnPropertyDescriptor(attributes, attributeName)) === null || _a === void 0 ? void 0 : _a.value;
        element.setAttribute(attributeName, value);
    }
}
function addStyles(styles, element) {
    var _a;
    var styleNames = Object.keys(styles);
    for (var _i = 0, styleNames_1 = styleNames; _i < styleNames_1.length; _i++) {
        var styleName = styleNames_1[_i];
        var value = (_a = Object.getOwnPropertyDescriptor(styles, styleName)) === null || _a === void 0 ? void 0 : _a.value;
        element.style[styleName] = value;
    }
}
function addPseudoStyles(pseudoStyle, element) {
    var elementId = element.id;
    if (elementId == '') {
        elementId = typeof element + generateId();
        element.id = elementId;
    }
    extractPropertiesFromObject(pseudoStyle, function (propName, value) {
        var selector = "#" + element.id + ":" + propName;
        addRule(selector, value);
    });
}
function addProperties(properties, element) {
    var events = properties.events, attributes = properties.attributes, style = properties.style, textContent = properties.textContent, pseudoStyle = properties.pseudoStyle;
    if (events != undefined)
        addEvents(events, element);
    if (attributes != undefined)
        addAttributes(attributes, element);
    if (style != undefined)
        addStyles(style, element);
    if (pseudoStyle != undefined)
        addPseudoStyles(pseudoStyle, element);
    if (textContent != undefined) {
        element.textContent = textContent;
    }
}
function isStack(name) {
    return name.substring(1) == "Stack";
}
function addStack(stack, element) {
    var keys = Object.keys(stack).filter(function (s) { return isStack(s); });
    if (keys.length == 0)
        return;
    checkList(keys);
    var stackType = keys[0];
    switch (stackType) {
        case "VStack":
            element.style.display = 'flex';
            element.style.flexDirection = "column";
            var vstack = stack;
            vstack.VStack.forEach(function (view) { return mountView(view, element); });
            return;
        case "ZStack":
            element.style.display = 'flex';
            var zstack = stack;
            element.style.position = "relative";
            var styles_1 = { position: "absolute", "z-index": 0 };
            zstack.ZStack.forEach(function (view) {
                mountViewWithExtraStyles(view, element, styles_1);
                styles_1["z-index"]++;
            });
            return;
        case "HStack":
            element.style.display = 'flex';
            element.style.flexDirection = "row";
            var hstack = stack;
            hstack.HStack.forEach(function (view) { return mountView(view, element); });
            return;
        default:
            throw new Error("Not implemented stack type " + stack);
    }
}
function mountViewWithExtraStyles(view, parent, styles) {
    mountView(view, parent);
    var el = parent.children[parent.children.length - 1];
    addStyles(styles, el);
}
exports.mountViewWithExtraStyles = mountViewWithExtraStyles;
function mountView(view, parent) {
    var _a;
    var keys = Object.keys(view);
    checkList(keys);
    var tag = keys[0];
    var el = document.createElement(tag);
    parent.appendChild(el);
    var value = (_a = Object.getOwnPropertyDescriptor(view, tag)) === null || _a === void 0 ? void 0 : _a.value;
    addProperties(value, el);
    addStack(value, el);
    window.el = el;
}
exports.mountView = mountView;
function checkList(params, length) {
    if (length === void 0) { length = 1; }
    if (params.length != length) {
        throw new Error("A View only should contain " + length + " item, got [" + params + "]");
    }
}
var ButtonView = function (_a) {
    var _b = _a.text, text = _b === void 0 ? "Button" : _b, _c = _a.click, click = _c === void 0 ? function () { return console.log("button is pressed"); } : _c, _d = _a.style, style = _d === void 0 ? {} : _d;
    return {
        button: {
            events: { click: click },
            textContent: text,
            style: __assign({ padding: "5%", "background-color": "blue", display: "flex", border: "2px solid red" }, style),
            pseudoStyle: {
                hover: { outline: "3px solid black" }
            }
        }
    };
};
var TextView = function (_a) {
    var _b = _a.text, text = _b === void 0 ? "Empty" : _b, _c = _a.click, click = _c === void 0 ? function () { return console.log("text is clicked"); } : _c, _d = _a.style, style = _d === void 0 ? {} : _d;
    var defaultStyle = { padding: "5%", "font-family": "Helvetica", "font-weight": "bold", display: "flex", "align-items": "center", "justify-content": "center", border: "1px solid black" };
    return {
        div: {
            events: { click: click },
            textContent: text,
            pseudoStyle: { hover: { outline: "10px solid black" } },
            style: __assign(__assign({}, defaultStyle), style)
        }
    };
};
var LiView = function (_a) {
    var _b = _a.text, text = _b === void 0 ? "Empty" : _b, _c = _a.click, click = _c === void 0 ? function () { return console.log("text is clicked"); } : _c, _d = _a.style, style = _d === void 0 ? {} : _d;
    return {
        li: {
            events: { click: click },
            textContent: text,
            style: __assign({}, style)
        }
    };
};
var UnorderedListView = function (_a) {
    var _b = _a.array, array = _b === void 0 ? ["Empty"] : _b, _c = _a.stack, stack = _c === void 0 ? "V" : _c, _d = _a.style, style = _d === void 0 ? {} : _d;
    var list = {
        ul: {
            style: __assign({ "font-family": "Helvetica", "font-weight": "bold", border: "1px solid black" }, style)
        }
    };
    list.ul[stack.toUpperCase() + "Stack"] = array.map(function (s) { return TextView({ text: s.toString(), style: { border: "none" } }); });
    return list;
};
var CounterButtonView = function (_a) {
    var _b = _a.start, start = _b === void 0 ? 0 : _b, _c = _a.style, style = _c === void 0 ? {} : _c;
    var defaultStyle = { padding: "5%", "background-color": "blue", display: "flex", border: "2px solid red" };
    var view = {
        div: {
            style: { border: "1px solid black" },
            pseudoStyle: { hover: { outline: "10px solid green" } },
            VStack: [
                { h1: { textContent: "Counter", style: { "font-weght": "bold" } } },
                { button: {
                        textContent: start.toString(),
                        style: __assign(__assign({}, defaultStyle), style),
                        events: {
                            click: function (el, event) {
                                var count = parseInt(el.textContent);
                                el.textContent = "" + (count + 1);
                                console.log(event);
                            }
                        }
                    } }
            ]
        }
    };
    return view;
};
var ContentView = {
    section: {
        style: { "gap": "10px", "border": "1px dashed red", height: "100%", "background-color": "lightgray" },
        HStack: [
            {
                div: {
                    style: { "gap": "10px", "border": "1px solid blue" },
                    VStack: [
                        CounterButtonView({}),
                        ButtonView({ text: "Button1", style: { "background-color": "red", "font-family": "Helvetica" } }),
                        ButtonView({ text: "Button2", style: { "background-color": "green" } }),
                        TextView({ text: "How does the fish breath inside of the packaging?" }),
                        UnorderedListView({ array: [1, 2, 3, 4, 5, 6, 7, 8].map(function (x) { return "element " + x; }), stack: "V" }),
                    ]
                }
            },
            {
                div: {
                    style: { "border": "1px solid green", width: "100px", height: "100px" },
                    ZStack: [
                        ButtonView({ text: "Button3", style: { "background-color": "blue" } }),
                        ButtonView({ text: "Button4", style: { "background-color": "yellow", left: "10px", top: "20px" } }),
                        ButtonView({ text: "Button5", style: { "background-color": "yellow", left: "40px", top: "60px" } }),
                    ]
                }
            },
            {
                div: {
                    style: { "border": "1px dashed gray", gap: "20px" },
                    HStack: [
                        ButtonView({ text: "Button5", style: { "background-color": "lightgray" } }),
                        ButtonView({ text: "Button6", style: { "background-color": "orange" } }),
                        ButtonView({ text: "Button7", style: { "background-color": "purple" } }),
                        ButtonView({ text: "Button8", style: { "background-color": "yellow" } }),
                        ButtonView({ text: "Button9", style: { "background-color": "green" } }),
                        ButtonView({ text: "Button10", style: { "background-color": "red" } }),
                    ]
                }
            }
        ]
    }
};
mountView(ContentView, document.body);
