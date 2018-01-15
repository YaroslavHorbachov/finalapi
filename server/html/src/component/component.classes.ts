import * as $ from "jquery";
import {MessageInterface, ISetOutputs, ICreateHistory, IMessage} from "./component.interfaces"

/**Worked classes*/
export class SetOutputs implements ISetOutputs {
    output:JQuery;
    body:JQuery;
    heads:JQuery;
    status:JQuery;
    link:JQuery;
    $alert:JQuery;
    post: JQuery;
    postButton: JQuery;
    [key:string]:any;
    constructor(){
        this.output = $('#output');
        this.body = $('#nav-result').children('.result');
        this.heads = $('#nav-heads').children('.heads');
        this.status = $('#nav-status').children('.status');
        this.link = $('#url');
        this.post = $('#nav-post');
        this.$alert = $('#alert');
        this.postButton = $('#nav-heads-post')
    }
    Show (obj:{[key:string]:any}):void {
        Object.keys(obj).forEach((key) =>{
            key === 'link' ? this[key].val(obj[key]) : this[key].text(obj[key]);
        });

        try {
            this.post.html('<a href class="json-toggle"></a>' + Draw.json2html( JSON.parse(obj['body'])));
            this.post.show();
            this.postButton.show();
            this.output.show();
        }
        catch (e) {
            this.post.hide();
            this.postButton.hide();
            this.output.show();
        }
    }
    ShowOnError (obj:{body:string[],link:any}):void {
        this.$alert.empty();
        let $element = $('<div>').attr('id','error-message');
        $element.html(`<strong>${obj.body[0]}!</strong>${obj.body[1]}`).addClass(obj.body[2]);
        this.$alert.append($element);
        this.$alert.show();
    };
    HideAll():void{
        this.$alert.hide();
        this.output.hide();
    }
}

export class CreateHistory implements ICreateHistory{
    items: object[] = [];
    AddItem(item:MessageInterface):void {
        this.items.push(item);
        let $tr = $('<tr>')
            .html(`<td>${item.link}</td>`);

        $('#history').append($tr);
    };
    GetItem (index:number):object {
        return this.items[index];
    };
}

/**Validation class*/

export class Message implements IMessage{
    constructor(public link: string, public heads: string, public status:number, public body:any) {
        if (status === 200){
            this.body = body;
        }
        else if (status === 404) {
            this.body = "Page Not Found"
        }
        else if (status === 500) {
            this.body = "Internal Error"
        }
        else if (status === 400) {
            this.body = "Bad Request"
        }
        else {
            this.body = "Something went wrong"
        }
    }
}

/**Static classes*/

export class Validator {
    private static expression: RegExp = new RegExp(
        /[-a-zA-Z0-9@:%_\+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&/=]*)?/gi);
    static isValidUrl(url: string): boolean {
        let length:number = url.length;
        return !url.match(Validator.expression) && (length > 10);
    }
}

export class Draw {
    public static isCollapsable(arg: any):boolean {
        return arg instanceof Object && Object.keys(arg).length > 0;
    }
    public static isUrl(string: string):boolean {
        let regexp:RegExp = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        return regexp.test(string);
    }
    public static json2html(json: any):string{
        let html: string = '';
        if (typeof json === 'string') {
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            if (Draw.isUrl(json))
                html += '<a href="' + json + '" class="json-string">' + json + '</a>';
            else
                html += '<span class="json-string">"' + json + '"</span>';
        }
        else if (typeof json === 'number') {
            html += '<span class="json-literal">' + json + '</span>';
        }
        else if (typeof json === 'boolean') {
            html += '<span class="json-literal">' + json + '</span>';
        }
        else if (json === null) {
            html += '<span class="json-literal">null</span>';
        }
        else if (json instanceof Array) {
            if (json.length > 0) {
                html += '[<ol class="json-array">';
                for (let i = 0; i < json.length; ++i) {
                    html += '<li>'
                    // Add toggle button if item is collapsable
                    if (Draw.isCollapsable(json[i]))
                        html += '<a href class="json-toggle"></a>';

                    html += Draw.json2html(json[i]);
                    // Add comma if item is not last
                    if (i < json.length - 1)
                        html += ',';
                    html += '</li>';
                }
                html += '</ol>]';
            }
            else {
                html += '[]';
            }
        }
        else if (typeof json === 'object') {
            let key_count = Object.keys(json).length;
            if (key_count > 0) {
                html += '{<ul class="json-dict">';
                for (let i in json) {
                    if (json.hasOwnProperty(i)) {
                        html += '<li>';
                        // Add toggle button if item is collapsable
                        if (Draw.isCollapsable(json[i]))
                            html += '<a href class="json-toggle">' + i + '</a>';
                        else
                            html += i;

                        html += ': ' + Draw.json2html(json[i]);
                        // Add comma if item is not last
                        if (--key_count > 0)
                            html += ',';
                        html += '</li>';
                    }
                }
                html += '</ul>}';
            }
            else {
                html += '{}';
            }
        }
        return html
    }
    public static jsonViewer(): void {
        const field: JQuery = $("#nav-post")
        $(field).off('click');
        $(field).on('click', 'a.json-toggle', function () {
            let target = $(this).toggleClass('collapsed')
                .siblings('ul.json-dict, ol.json-array');
            target.toggle();
            if (target.is(':visible')) {
                target.siblings('.json-placeholder').remove();
            }
            else {
                let count = target.children('li').length;
                let placeholder = count + (count > 1 ? ' items' : ' item');
                target.after('<a href class="json-placeholder">' + placeholder + '</a>');
            }
            return false;
        });

        // Simulate click on toggle button when placeholder is clicked
        $(field).on('click', 'a.json-placeholder', function () {
            $(this).siblings('a.json-toggle').click();
            return false;
        });

        // Trigger click to collapse all nodes
        $(field).find('a.json-toggle').click();
    }
}