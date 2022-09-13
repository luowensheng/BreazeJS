import type { ViewConstructor, View} from "./index"
import {mountView} from "./index"


const ButtonView: ViewConstructor = ({text="Button", click=()=>{ return console.log("button is pressed"); }}) => {

    return {
            button: {
                events: { click },
                textContent: text,
                style: { padding: "5%", "background-color": "blue", display: "flex", border: "2px solid red" }
            }
    }
} 

const ContentView: View =  {
        
    div: {
            HStack: [
                {
                    div: {
                        VStack: [
                            ButtonView({text: "Button1"}),          
                            ButtonView({text: "Button2"}), 
                        ]
                    },
                    
                },
                {
                    div: {
                        VStack: [
                            ButtonView({text: "Button1"}),          
                            ButtonView({text: "Button2"}), 
                        ]
                    },
                    
                }        
            ]
    },

}


mountView(ContentView, document.body)