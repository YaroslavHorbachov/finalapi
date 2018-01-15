
export interface errorOutput {
    body:string[];
    link:any;
}

export interface MessageInterface {
    body: any;
    link: string;
    heads: string;
    status: number;
}

export interface ISetOutputs {
    output: JQuery;
    body : JQuery;
    heads: JQuery;
    status : JQuery;
    link : JQuery;
    $alert : JQuery;
    Show(prop:{[key:string]:any}):void
    ShowOnError(prop:{body:string[],link:any}):void
    HideAll():void
}
export interface ICreateHistory{
    items: object[] ;
    AddItem(prop: MessageInterface):void;
    GetItem(index: number): object;
}
export interface IMessage {
    link:string;
    heads: string;
    status: number;
    body:any
}
