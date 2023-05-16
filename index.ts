export type HTMLTagNames =  "a"|"abbr"|"acronym"|"address"|"applet"|"area"|"article"|"aside"|"audio"|"b"|"base"|"basefont"|"bdi"|"bdo"|"big"|"blockquote"|"br"|"button"|"canvas"|"caption"|"center"|"cite"|"code"|"col"|"colgroup"|"data"|"datalist"|"dd"|"del"|"details"|"dfn"|"dialog"|"dir"|"div"|"dl"|"dt"|"em"|"embed"|"fieldset"|"figcaption"|"figure"|"font"|"footer"|"form"|"frame"|"frameset"|"h1"|"h2"|"h3"|"h4"|"h5"|"h6"|"head"|"header"|"hr"|"html"|"i"|"iframe"|"img"|"input"|"ins"|"kbd"|"label"|"legend"|"li"|"link"|"main"|"map"|"mark"|"menu"|"menuitem"|"meta"|"meter"|"nav"|"noframes"|"noscript"|"object"|"ol"|"optgroup"|"option"|"output"|"p"|"param"|"picture"|"pre"|"progress"|"q"|"rp"|"rt"|"ruby"|"s"|"samp"|"script"|"section"|"select"|"small"|"source"|"span"|"strike"|"strong"|"sub"|"summary"|"sup"|"svg"|"table"|"tbody"|"td"|"template"|"textarea"|"tfoot"|"th"|"thead"|"time"|"title"|"tr"|"track"|"tt"|"u"|"ul"|"var"|"video"|"wbr"

export type UIElement = View 
export type UIElementContruct = UIElement 
export type Container = UIElementContruct[]
export type EventType =  Event | ProgressEvent<EventTarget> | ClipboardEvent | UIEvent | AnimationEvent | MouseEvent | WheelEvent

export type EventHandler = (element:HTMLElement, event: EventType)=>void

export interface Events {
    [name: string]: EventHandler
}

export type Style = Record<string, any>

export interface HStack  {
    HStack: Container
}

export interface VStack  {
    VStack: Container
}

export interface ZStack  {
    ZStack: Container
}

export interface Spacing {
    padding: number
}

export type Stack = (HStack | VStack | ZStack) | Spacing

export interface ViewAttributeOnly {
    events?: Events
    textContent?: string
    attributes?: Record<string, string>
    style?: Style
    pseudoStyle?: Record<string, Style>
}

export type ViewAttribute = ViewAttributeOnly | Stack;


export type ViewElement = {
    [key in HTMLTagNames]?: ViewAttribute;
  };
  
export type View = ViewElement
export type ViewConstructor = ((...args: any[])=>ViewElement) |  ((params:object)=>ViewElement)  

const addRule = (function (style) {
    var sheet = document.head.appendChild(style).sheet;
    return function (selector: string, css:Style) {
        var propText = typeof css === "string" ? css : Object.keys(css).map(function (p) {
            return p + ":" + (p === "content" ? "'" + css[p] + "'" : css[p]);
        }).join(";");
        console.log({propText: selector + "{" + propText + "}"})
        sheet.insertRule(selector + "{" + propText + "}", sheet.cssRules.length);
    };
})(document.createElement("style"));


const generateId = (function(){
    let counter = 1
    return ()=> counter++
})();

function extractPropertiesFromObject(item: object, onPropertyFound:(propName:string, value:any)=>void){
    
    let propNames = Object.keys(item) 

    for (let propName of propNames){

        const value = Object.getOwnPropertyDescriptor(item, propName)?.value;

        onPropertyFound(propName, value)
        
    }
}

function addEvents(events: Events, element: HTMLElement){
    
    let eventNames = Object.keys(events) 

    for (let eventName of eventNames){

        const eHandler = Object.getOwnPropertyDescriptor(events, eventName)?.value as EventHandler
        element.addEventListener(eventName as keyof HTMLElementEventMap, (event)=>{
            eHandler(element, event)
        })
    }
}

function addAttributes(attributes: Record<string, string>, element: HTMLElement){
    
    let attributeNames = Object.keys(attributes) 

    for (let attributeName of attributeNames){
        
        const value = Object.getOwnPropertyDescriptor(attributes, attributeName)?.value as string
        element.setAttribute(attributeName, value)
    }
}

function addStyles(styles: Record<string, string>, element: HTMLElement){
    
    let styleNames = Object.keys(styles) 

    for (let styleName of styleNames){

        const value = Object.getOwnPropertyDescriptor(styles, styleName)?.value as string
        element.style[styleName] = value
    }
}

function addPseudoStyles(pseudoStyle: Record<string,  Style>, element: HTMLElement){

    let elementId = element.id

    if (elementId == ''){
       elementId = typeof element+generateId() 
       element.id = elementId
    }

    extractPropertiesFromObject(pseudoStyle, (propName, value)=>{
        
        const selector = `#${element.id}:${propName}`
        addRule(selector, value as Style)     
    })
}

function addProperties( properties: ViewAttributeOnly, element: HTMLElement){
    
    const {events, attributes, style, textContent, pseudoStyle} = properties

    if (events!= undefined) addEvents(events, element)
    if (attributes!= undefined) addAttributes(attributes, element)
    if (style!= undefined) addStyles(style, element)
    if (pseudoStyle!= undefined) addPseudoStyles(pseudoStyle, element)
    if (textContent!= undefined) {element.textContent = textContent}
}

function isStack(name: string):boolean {
    return name.substring(1) == "Stack"
}

function addStack(stack: Stack, element: HTMLElement){
    
    let keys =  Object.keys(stack).filter(s => isStack(s))

    if (keys.length == 0) return;

    checkList(keys)

    const stackType = keys[0]

    switch(stackType){

        case "VStack":
            element.style.display = 'flex';
            element.style.flexDirection = "column"
            const vstack = stack as VStack
            vstack.VStack.forEach(view => mountView(view, element))
            return;

        case "ZStack":
            element.style.display = 'flex';
            const zstack = stack as ZStack
            element.style.position = "relative"
            const styles = { position: "absolute", "z-index": 0};
            zstack.ZStack.forEach(view =>{

                mountViewWithExtraStyles(view, element, styles)
                styles["z-index"]++;
            })
            return;

        case "HStack":
            element.style.display = 'flex';
            element.style.flexDirection = "row"
            const hstack = stack as HStack
            hstack.HStack.forEach(view => mountView(view, element))
            return;
        
            default:
                throw new Error(`Not implemented stack type ${stack}`)
    }

}

export function mountViewWithExtraStyles(view:View, parent: HTMLElement, styles: Style) {

    mountView(view, parent)
    const el = parent.children[parent.children.length-1] as HTMLElement
    addStyles( styles, el);
 
 }


export function mountView(view:View, parent: HTMLElement) {

   let keys =  Object.keys(view)
   checkList(keys)
   
   const tag = keys[0]
   const el = document.createElement(tag)
   parent.appendChild(el)

   const value = Object.getOwnPropertyDescriptor(view, tag)?.value

   addProperties( value as ViewAttributeOnly, el);
   addStack( value as Stack, el);

}

function checkList(params: any[], length: number=1) {

    if (params.length != length){
        throw new Error(`A View only should contain ${length} item, got [${params}]`)
     }
}



