import * as $ from "jquery"
import {CreateHistory,
    Message,
    SetOutputs,
    Validator,
    Draw} from "./component/component.classes"
import {MessageInterface,errorOutput} from "./component/component.interfaces"


const Output = new SetOutputs();

const MyHistory = new CreateHistory;

function httpGet (url:string) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);

        xhr.onload = () => {
            let result:MessageInterface = new Message(
                url,
                xhr.getAllResponseHeaders(),
                xhr.status,
                xhr.response
            );

            if (xhr.status === 200) {
                MyHistory.AddItem(result);
            }
            resolve(result);
        };

        xhr.onerror = () => {

            let onError:errorOutput ={
                body: ["Trouble",`We can’t connect to the server ${url}`, "alert alert-danger"],
                link: url
            };
            reject(onError);
        };

        xhr.send();

    })
}

$('#history tbody').on('click', 'tr', function () {
    let index: number = $(this).index();

    let historyItem: object = MyHistory.GetItem(index);

    Output.Show(historyItem);
});

$('.form').submit(function (event) {
    Output.HideAll();
    let url:any = $('#url').val();
    if (!Validator.isValidUrl(url)) {
		let stableUrl = url
		let testUrl = "http://cist.nure.ua/"
		if (stableUrl.split("ias/app/tt")[0] === testUrl){
			stableUrl = "http://localhost:3000/cist/api" + stableUrl.split("ias/app/tt")[1]
		}
        httpGet(stableUrl).then(
            (onLoad) => {
                Output.Show(onLoad);
            },
            (onError) => {
                Output.ShowOnError(onError);
            }
        );
    }
    else {
        let onError:errorOutput ={
            body: ["Warning"," This url is strange. Are you not deceiving our search engine?", "alert alert-warning"],
            link: url
        };
        Output.ShowOnError(onError);
    }
    event.preventDefault();
});

Draw.jsonViewer();





















