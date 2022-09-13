# SwiftUI inspired JS FrameWork JSUI

## GOAL: Create HTML, CSS only with Javascript/Typescript

```js

const ContentView: View =  {
        
    section: {
            style:{"gap": "10px", "border": "1px dashed red", height: "100%", "background-color": "lightgray"},
            HStack: [
                {
                    div: {
                        style:{"gap": "10px", "border": "1px solid blue"},
                        VStack: [
                            CounterButtonView({}),
                            ButtonView({text: "Button1", style: {"background-color": "red", "font-family": "Helvetica"} }),          
                            ButtonView({text: "Button2", style: {"background-color": "green"}}), 
                            TextView({text:"How does the fish breath inside of the packaging?"}),
                            UnorderedListView({array: [1,2,3,4,5,6,7,8].map(x=>`element ${x}`), stack:"V"}),
                        ]
                    },
                    
                },
                {
                    div: {
                        style:{ "border": "1px solid green", width:"100px", height: "100px"},
                        ZStack: [
                            ButtonView({text: "Button3", style: {"background-color": "blue"}}),          
                            ButtonView({text: "Button4", style: {"background-color": "yellow", left: "10px", top: "20px"}}), 
                            ButtonView({text: "Button5", style: {"background-color": "yellow", left: "40px", top: "60px"}}), 
                        ]
                    },
                    
                },
                {
                    div: {
                        style:{ "border": "1px dashed gray", gap:"20px"},
                        HStack: [
                            ButtonView({text: "Button5", style: {"background-color": "lightgray"}}),          
                            ButtonView({text: "Button6", style: {"background-color": "orange"}}), 
                            ButtonView({text: "Button7", style: {"background-color": "purple"}}), 
                            ButtonView({text: "Button8", style: {"background-color": "yellow"}}), 
                            ButtonView({text: "Button9", style: {"background-color": "green"}}), 
                            ButtonView({text: "Button10", style: {"background-color": "red"}}), 
                        ]
                    },
                    
                }

            ]
    },

}
```


```js
const TextView: ViewConstructor = ({text="Empty", click=()=>{ return console.log("text is clicked"); }, style={}}) => {
    
    const defaultStyle = { padding: "5%", "font-family":"Helvetica" , "font-weight": "bold", display: "flex", "align-items":"center", "justify-content":"center", border: "1px solid black" }
    return {
            div: {
                events: { click },
                textContent: text,
                pseudoStyle:{hover: {outline: "10px solid black"}},
                style: {...defaultStyle, ...style}
            }
    }
} 

```


```js 
const UnorderedListView: ViewConstructor = ({array=["Empty"], stack="V",style={}}) => {

    const list = {
        ul: {
            style: {...{ "font-family":"Helvetica" , "font-weight": "bold", border: "1px solid black" }, ...style}
        }
    }
    list.ul[stack.toUpperCase()+"Stack"] = array.map(s => TextView({text: s.toString(), style:{border:"none"}}))
    return list 
} 
```

```js
const CounterButtonView: ViewConstructor = ({start=0, style={}}) => {
    
    const defaultStyle = { padding: "5%", "background-color": "blue", display: "flex", border: "2px solid red" }
    const view = {

               div: {
                    style: {border: "1px solid black"},
                    pseudoStyle:{hover: {outline: "10px solid green"}},
                    VStack: [
                        { h1: { textContent: "Counter", style: {"font-weght": "bold"}} },
                        { button: {
                                textContent: start.toString(),
                                style: {...defaultStyle, ...style},
                                events: {
                                            click: (el: HTMLElement, event: EventType)=>{
                                                    let count =  parseInt(el.textContent)
                                                    el.textContent = `${count+1}`;
                                                    console.log(event)
                             },
                            }
                        }}
                    ]
               }
    }

  
```

```js
const ButtonView: ViewConstructor = ({text="Button", click=()=>{ return console.log("button is pressed"); }, style={}}) => {

    return {
            button: {
                events: { click },
                textContent: text,
                style: {...{ padding: "5%", "background-color": "blue", display: "flex", border: "2px solid red" }, ...style},
                pseudoStyle:{
                    hover:{ outline: "3px solid black"}
                }
            }
    }
} 
```