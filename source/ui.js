//main content

const haveLoad = true;
const debug_mode = false;
const mechta_version = "1.0.0";
const who_is = "computer0";
const delayLoader = debug_mode ? 100 : 1000;
const first_window = "#window_table";
const localstorage_key = "badcast_for_cast";
var windows = [];
var _jsons = [null, null];
var jsonResult = null;
var loaded = false;
var docx = [null, null]; // prev and next
var params = null;
const __change_log =
    `
* Обновлен дизайн. 
* Улучшена стабильность системы. 
* Улучшена проверка коррекций ошибок. 
+ Добавлено усечение для наблюдателя.
Приятной работы - Мечта мены! :)
`;

const Action = {
    ACT_DEF: 0, // default window show
    ACT_CLOSE_WINDOW: 1, // for unblink window (close)
    ACT_SHOW_WINDOW: 2, // for blink window  (show)
    ACT_AVAIL_SHOW: 3 // reserved
};
var _watcher = {
    ticket: {
        firstInit: 0,
        lastAccess: 0,
        lastSaved: 0,
        saved: 0
    },
    sessions: [],
    data: []
};

function sv_load_watch() {
    if (localStorage.getItem(localstorage_key) == null && localStorage[localstorage_key] != "") {
        _watcher.ticket.firstInit = Date.now();
        console.log("init first log");
    } else {
        _watcher = JSON.parse(localStorage[localstorage_key]);
    }
    _watcher.data = _watcher.data ?? [];
    _watcher.sessions = _watcher.sessions ?? [];
    _watcher.data.push({});
    _watcher.sessions.push({
        date: Date.now(),
        version: mechta_version
    });
}

function sv_save_watch() {
    function shrink(arr, min_n) {
        return arr.splice(0, Math.max(0, arr.length - min_n));
    }

    _watcher.ticket.lastSaved = Date.now();
    _watcher.ticket.saved++;
    try {
        console.log("shrinked data ", shrink(_watcher.data, 10));
        console.log("shrinked sessions ", shrink(_watcher.sessions, 50));
        localStorage.setItem(localstorage_key, JSON.stringify(_watcher));
    } catch {
        console.error("failed save to localStorage");
    }
}

function sv_add_watch(name, state, json) {
    if (state == "prev") {
        _watcher.data[_watcher.data.length - 1].prev = {
            content: json,
            filename: name,
            state: state
        };
    } else {
        _watcher.data[_watcher.data.length - 1].next = {
            content: json,
            filename: name,
            state: state
        };
    }

    _watcher.ticket.lastAccess = Date.now();
}

function ui_action(code, lhs, rhs) {
    switch (code) {
        case Action.ACT_DEF: // default alert
            {
                alert("ОПС!");

                break;
            }
        case Action.ACT_CLOSE_WINDOW: // close by window from lhs
            {
                $(lhs).hide({
                    duration: 500
                });
                break;
            }
        case Action.ACT_SHOW_WINDOW: {
            $(lhs).show({
                duration: 500
            });

            let firstElem = $("div.box")[0];
            let parentNode = firstElem.parentNode;

            //change index as First
            parentNode.insertBefore($(lhs)[0], firstElem);
            break;
        }
        case Action.ACT_AVAIL_SHOW: {
            ui_show_window_push();
            break;
        }
    }
}

function ui_show_window(w, single) {
    function compare_id(lhs, jqElem) {
        return lhs == "#" + jqElem.id;
    }
    function compare_elem(lhs, jqElem) {
        return lhs == jqElem.get(0);
    }

    let compare = typeof w == "string" ? compare_id : compare_elem;
    for (let x = 0; x < windows.length; ++x) {
        let wx = $(windows[x]);

        if (compare(w, wx.get(0))) {
            ui_action(Action.ACT_SHOW_WINDOW, w);
            continue;
        }

        if (single && !wx.is(":hidden")) {
            wx.hide(); // immediately
        }
    }
}

function ui_show_window_only(w) {
    ui_show_window(w, true);
}

function ui_show_window_push(w) {
    ui_show_window(w, false);
}

function ui_show_avail_window() {
    jsonResult = null;
    _jsons[0] = null;
    _jsons[1] = null;
    _mark = [null, null];
    _preserves = [null, null];

    let _doctype_info = [null, null];
    for (let x = 0; x < docx.length; ++x) {
        let y = x;
        let reader = new FileReader();

        reader.onloadend = function (content) {
            let fail_checker = [
                function (file, input) {
                    if (input.length == 0) {
                        return {
                            fatal: true,
                            msg: "Извините. Но файл оказался пустым: \"" + (file) + "\""
                        };
                    }

                    return null;
                },
                function (file, input) {
                    // check fail's
                    let cmpt0 = indexof_size(input[0].type).category,
                        cmpt1;
                    let haveUnknown = false;
                    for (let z = 1; z < input.length; ++z) {
                        cmpt1 = indexof_size(input[z].type).category;
                        if (cmpt1 == unknown_category)
                            haveUnknown = true;
                        else
                            if (cmpt0 != cmpt1) {
                                return {
                                    fatal: true,
                                    msg: "Внимание найден смешанный формат данных.\n\n\tФайл (" + (file) + ") не подлежит к проверке, так как в нем содержиться несколько направлений (КБТ,МБТ).\n\n\tОжидалось \"" +
                                        (categories[cmpt0].full) + "\", но второй оказался \"" + (categories[cmpt1].full) + "\"."
                                };
                                break;
                            }
                    }
                    _mark[y] = {
                        category: cmpt0,
                        categoryName: categories[cmpt0]
                    }; // category

                    return haveUnknown ? ({
                        fatal: false,
                        msg: "Обнаружены новые товары, они будут неизвестными до того момента, пока не будут зарегистрированы.\n\n\tМожно продолжать."
                    }) : null;
                },
                function (file, input) {
                    if (_mark[0] != null && _mark[1] != null && (_mark[0].category != _mark[1].category)) {
                        return {
                            fatal: true,
                            msg: "Ошибка!!!\n\tОбнаружена разные виды ценников КБТ и МБТ.\n\tОжидалось \"" +
                                (categories[_mark[0].category].short) + "\", но второе было \"" + (categories[_mark[1].category].short) + "\"\nПо этому проверка не возможна."
                        }
                    }

                    return null;
                }
            ];

            let file = docx[y].name;
            let state = x == 0 ? "prev" : "next";
            //Create a new HTML doc
            _preserves[y] = document.implementation.createHTMLDocument(state);
            //Load HTML doc to
            _preserves[y].querySelector("html").innerHTML = content.target.result;
            //MECHTA_COSHKA_PARSER:avail
            let json = avail(true, _preserves[y]);
            console.log(json);

            let f = 0;
            let fail;
            while (f < fail_checker.length) {
                if ((fail = fail_checker[f](file, json)) != null) {
                    alert(fail.msg);
                    if (fail.fatal)
                        return;
                }
                ++f;
            }

            _jsons[y] = json;

            // add to watches
            sv_add_watch(file, state, json);

            if (_jsons[0] != null && _jsons[1] != null) {
                //State is loaded

                jsonResult = difference(_jsons[0], _jsons[1]);
                console.log(jsonResult);
                //UPDATE

                show_loader("#window_logo");
                let t = setTimeout(function () {
                    //awake async
                    ui_show_window_only("#window_table");
                    //show_window_push("#window_data");
                    ui_print_result(jsonResult);
                }, 2000);

                sv_save_watch();
            }

        }
        reader.readAsText(docx[x]);
    }
}

function show_loader(postWindow, closePrevs = true) {
    setTimeout(function () {
        ui_show_window(postWindow, closePrevs);
    }, delayLoader); //wait 1s

    ui_show_window("#window_loader", closePrevs);
}

function ui_layer_gradient_component(col) {
    return "linear-gradient(95deg, " + col + ",rgba(0,0,0,0.1))";
}

function ui_present_copy(elem) {
    var _ecopy = document.createElement("textarea");
    //split by indexes
    let ifi = elem.getAttribute("json_index").split(":");
    let jsonElem = (ifi[1] == 0 ? jsonResult.changed : ifi[1] == 1 ? jsonResult.addedNew : jsonResult.prevRemoved)[ifi[0]];
    _ecopy.style.position = 'fixed';

    _ecopy.style.padding = 0;

    // Clean up any borders.
    _ecopy.style.border = 'none';
    _ecopy.style.outline = 'none';
    _ecopy.style.boxShadow = 'none';

    // Avoid flash of the white box if rendered for any reason.
    _ecopy.style.background = 'transparent';

    _ecopy.value = jsonElem.name;

    document.body.appendChild(_ecopy);
    _ecopy.focus();
    _ecopy.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }

    document.body.removeChild(_ecopy);
    let node = $(elem.parentNode.parentNode);
    node.addClass("copyied");
    node.css("background", ui_layer_gradient_component(indexof_size(jsonElem.type).color));
    elem.innerText = 'Скопировано ✓';
    setTimeout(function () {
        elem.innerText = 'Копировать 📋';
    }, 1000);
}

function ui_print_result(jsonResult) {
    const changes_list_head = ["Измененные ценники", "Добавлены в магазин", "Удалены из магазина"];

    function update_list(list, table, json, index) {
        let assoc_container = new Map();
        list.innerText = changes_list_head[index] + " (" + json.length + ")";
        //Insert HEAD
        table.innerHTML = "<tr>" +
            "<th>№</th>" +
            "<th>Тип</th>" +
            "<th>Наименование</th>" +
            "<th width=70>Цена</th>" +
            "<th>Размер</th>" +
            "<th>Действие</th>" +
            "</tr>";

        //Insert Rows
        if (json.length > 0) {
            for (let x = 0; x < json.length; ++x) {
                let size = indexof_size(json[x].type);
                table.innerHTML += "<tr>" +
                    "<td>" + (x + 1).toString() + "</td>" +
                    "<td>" + json[x].type + "</td>" +
                    "<td>" + json[x].name + "</td>" +
                    "<td style=\"" + (json[x].isDiscount ? ("background:" + ui_layer_gradient_component("yellow")) : "") + "\">" + translate_to_number(json[x].cosh) + "</td>" +
                    "<td style=\"background: " + ui_layer_gradient_component(size.color) + "\">" + size.size + "</td>" +
                    "<td><button class=\"fbutton\" json_index='" + x + ":" + index + "' onclick=\"ui_present_copy(this)\">Копировать 📋</button></td>" +
                    "</tr>";
                if (assoc_container.get(size.size_mm) == undefined) {
                    assoc_container.set(size.size_mm, 1);
                } else {
                    let val = assoc_container.get(size.size_mm);
                    assoc_container.set(size.size_mm, ++val);
                }

            }
        } else {
            table.innerHTML += "<tr style=\"background: " + ui_layer_gradient_component("yellow") + ";\">" +
                "<td></td>" +
                "<td></td>" +
                "<td>Нет изменений</td>" +
                "<td></td>" +
                "<td></td>" +
                "<td></td>" +
                "</tr>";
        }
        return assoc_container;
    }

    //let _cont = $("#list_body_chn")[0].parentElement.parentElement;
    //_cont.innerHTML = "" + _cont.innerHTML;

    let lists = [$("#thead_change")[0], $("#thead_add")[0], $("#thead_remove")[0]];
    let tables = [$("#list_body_chn")[0], $("#list_body_add")[0], $("#list_body_rem")[0]];

    let container = update_list(lists[0], tables[0], jsonResult.changed, 0);
    lists[0].click();

    update_list(lists[1], tables[1], jsonResult.addedNew, 1);
    update_list(lists[2], tables[2], jsonResult.prevRemoved, 2);

    let cc = $(".cc")[0];
    let cc_corner_tag = cc.innerHTML;
    let pages = 0;
    //cc.innerHTML = "";
    function logMapElements(value, key, map) {
        let cp = calcPaper(key, value);
        pages += cp.papers;
        //console.warn(cp);
    }
    container.forEach(logMapElements);
    cc.innerHTML = cc_corner_tag.replace("{}", pages).replace("{}", " общее");
}

function ui_version_notify() {
    const ver_key = "_version";
    if (localStorage.getItem(ver_key) != mechta_version) {
        alert(`Новая версия: ${mechta_version}\n${__change_log}`);
        localStorage.setItem(ver_key, mechta_version);
    }
}

function user_interface_present() {
    params = new URL(document.location).searchParams;

    sv_load_watch();

    ui_version_notify();

    //collapse element
    let coll = document.getElementsByClassName("collapsible");
    let i;
    let _duration = {
        duration: 150
    };
    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            let content = this.nextElementSibling;
            if (content.style.display === "block") {
                $(content).hide(_duration);
                //content.style.display = "none";
            } else {
                $(content).show(_duration);
                //content.style.display = "block";
            }
        });
    }

    // wait and show
    if (haveLoad) {
        setTimeout(function () {
            //return;
            show_loader("#window_data");
        }, delayLoader);
        $('.input-file input[type=file]').on('change', function () {
            let file = this.files[0];
            let x;
            $(this).closest('.input-file').find('.input-file-text').html(file.name);
            if (this.id == "prev")
                x = 0;
            else
                x = 1;

            docx[x] = file;
        });
    }

    $('.input-file-text').text("Нажмите, чтобы выбрать");

    $('#do').on("click", function () {
        let _part = ["Первый", "Второй"];
        let fail_msg = null;
        let _sparse = " документ не выбран.";
        //compare is a null
        for (let x = 0; x < docx.length; ++x) {
            if (docx[x] == null) {
                fail_msg = _part[x] + _sparse;
                break;
            }
        }

        //compare a identity
        if (fail_msg == null && docx[0].file == docx[1].file && docx[0].lastModified == docx[1].lastModified && docx[0].size == docx[1].size) {
            fail_msg = "Оба файла выбраны одинаково. Изменение не будет.";
        }

        if (fail_msg) {
            alert(fail_msg);
            return;
        };
        ui_show_avail_window();
    });

    windows = $("div.box").get(); // get windows
    //show first window
    ui_show_window_only(first_window);
}

$(document).ready(user_interface_present);