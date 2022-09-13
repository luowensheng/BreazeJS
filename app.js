"use strict";

import jsui from "./index.js"

const ButtonView = function ({text="Button", click=()=>{ return console.log("button is pressed"); }}) {

    return {
        button: {
            events: { click },
            textContent: text,
            style: { padding: "5%", "background-color": "blue", display: "flex", border: "2px solid red" }
        }
    };
};

const ContentView = {
    div: {
        HStack: [
            ButtonView({ text: "Button1", click: ()=> console.log(this) }),
            ButtonView({ text: "Button2" }),
        ]
    }
};
jsui.mountView(ContentView, document.body);
