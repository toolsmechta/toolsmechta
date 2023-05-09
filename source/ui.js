/*MIT License*/

const version = "1.0.7";
const haveLoad = true;
const debug_mode = false;
const cat_draw = true;
const delayLoader = debug_mode ? 100 : 1000;
const first_window = "#window_logo";
const localstorage_key = "badcast_for_cast";
var loaded = false;
var jsonResult = null;
var params = null;
var docx = [null, null]; // prev and next
var _jsons = [null, null];
var windows = [];

const __change_log =
    `
+ Добавлен показатель предыдущей цены товара.
+ Добавлена информация об коефицентности.
* Исправлен показатель ценника.
* Исправлены небольшие дэфекты в системе и прочее улучшения.
* ZzZ - я пошел спать, устал! 
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
        version: version
    });
}

function sv_save_watch() {
    function shrink(arr, min_n) {
        return arr.splice(0, Math.max(0, arr.length - min_n));
    }

    _watcher.ticket.lastSaved = Date.now();
    _watcher.ticket.saved++;
    try {
        console.log("shrinked data ", shrink(_watcher.data, 5));
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
    //save link for docx[n]
    _mark = [null, null];
    _preserves = [null, null];
    _fails = [null, null];

    let lastShownAlert = false;
    let _doctype_info = [null, null];
    for (let x = 0; x < docx.length; ++x) {
        let y = x; // y save as local x
        let reader = new FileReader();

        reader.onloadend = function (content) {
            let fail_checker = [
                function (file, input) {
                    if (input.length == 0) {
                        return {
                            fatal: true,
                            show: true,
                            msg: "Извините. Но файл оказался пустым: \"" + (file) + "\""
                        };
                    }

                    return null;
                },
                // check fail's
                function (file, input) {

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
                                    show: true,
                                    fatal: true,
                                    msg: "Внимание найден смешанный формат данных.\n\n\tФайл (" + (file) + ") не подлежит к проверке, так как в нем содержиться несколько направлений (КБТ,МБТ).\n\n\tОжидалось \"" +
                                        (categories[cmpt0].full) + "\", но затем последовал \"" + (categories[cmpt1].full) + "\"."
                                };
                            }
                    }
                    _mark[y] = {
                        category: cmpt0,
                        categoryName: categories[cmpt0]
                    }; // category
                    //ignore reach for GSM types (for skip)
                    return haveUnknown && params.get("type") != "gsm" ? ({
                        fatal: false,
                        msg: "Обнаружены новые товары, они будут неизвестными до того момента, пока не будут зарегистрированы.\n\n\tМожно продолжать."
                    }) : null;
                },
                function (file, input) {
                    if (_mark[0] != null && _mark[1] != null && (_mark[0].category != _mark[1].category)) {
                        return {
                            fatal: true,
                            msg: "Ошибка!!!\n\tОбнаружены разные виды ценников КБТ и МБТ.\n\tОжидалось \"" +
                                (categories[_mark[0].category].short) + "\", но второе было \"" + (categories[_mark[1].category].short) + "\"\nПо этому проверка не возможна."
                        }
                    }

                    return null;
                }
            ];
            let index_neighbour = y == 0 ? 1 : 0;
            let file = docx[y].name;
            let state = y == 0 ? "prev" : "next";
            let json;
            //Create a new HTML doc
            _preserves[y] = document.implementation.createHTMLDocument(state);
            //Load HTML doc to
            _preserves[y].querySelector("html").innerHTML = content.target.result;
            //MECHTA_COSHKA_PARSER:avail
            try {
                json = avail(true, _preserves[y]);
            } catch (e) {
                console.err(ex.message);
                alert("Системная ошибка модуля \"мечты-кошки\"\nПодробнее:\n\t" + ex.message);
                return;
            }
            console.log(json);

            let f = 0;
            let fail;
            while (f < fail_checker.length) {
                if ((_fails[y] = fail = fail_checker[f](file, json)) != null) {
                    if (_fails[index_neighbour] == null) {
                        if (fail.fatal || lastShownAlert == false && (lastShownAlert = true))
                            alert(fail.msg);

                        if (fail.show === true && window.confirm("Показать проблему ценника?")) {
                            window.open(URL.createObjectURL(docx[y]));
                        }
                    }
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
                try {
                    jsonResult = difference(_jsons[0], _jsons[1]);
                } catch (e) {
                    console.err(ex.message);
                    alert("Системная ошибка модуля \"мечты-кошки\"\nПодробнее:\n\t" + ex.message);
                    return;
                }

                console.log(jsonResult);

                //UPDATE
                show_loader("#window_logo");
                let t = setTimeout(function () {
                    //awake async
                    ui_show_window_only("#window_table");
                    //show_window_push("#window_data");
                    ui_print_result(jsonResult);
                }, delayLoader);

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
    let ifi = elem.parentNode.parentNode.getAttribute("json_index").split(":");
    let jsonElem = (ifi[1] == 0 ? jsonResult.changed : ifi[1] == 1 ? jsonResult.addedNew : jsonResult.prevRemoved)[ifi[0]];

    _ecopy.style.position = 'fixed';
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
    elem.innerText = 'Скопировано';
    setTimeout(function () {
        elem.innerText = 'Копировать';
    }, 1000);
}

function ui_present_copy_cancel(elem) {
    elem = $(elem.parentNode.parentNode);
    elem.removeClass("copyied");
    elem.css("background", "");
}


function ui_component_table_sort(table, elem, orderBy) {
    //let ifi = orderBy.parentNode.parentNode.getAttribute("json_index").split(":");
    //let jsonElem = (ifi[1] == 0 ? jsonResult.changed : ifi[1] == 1 ? jsonResult.addedNew : jsonResult.prevRemoved)[ifi[0]];

    const classes = ["ordering_by_down", "ordering_by_up"];
    var rows, switching, i, x, y, shouldSwitch;

    if (elem != null) {
        elem = $(elem);
        if (orderBy == null) {
            //auto switch
            orderBy = !elem.hasClass(classes[0]);
        }
        elem.removeClass(classes.toString().replace(",", " ")).addClass(orderBy ? classes[0] : classes[1]);
    }
    else
        orderBy = orderBy ?? true;

    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); ++i) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[4].innerHTML.toLowerCase();
            y = rows[i + 1].getElementsByTagName("TD")[4].innerHTML.toLowerCase();
            if ((orderBy ? x > y : x < y)) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
    rows = table.rows;
    //fix numbers
    for (i = 1; i < rows.length; ++i) {
        rows[i].getElementsByTagName("TD")[0].innerText = (i);
    }

}

function ui_print_result(jsonResult) {
    const changes_list_head = ["Измененные ценники", "Добавлены в магазин", "Удалены из магазина"];
    const _str_no_change = "Нет изменений";

    function show_info_elem() { }

    function update_list(list, table, json, index) {
        let assoc_container = new Map();
        list.innerHTML = `${changes_list_head[index]} (<a style="border-bottom: 1px dotted">${json.length}</a>)`;
        //Insert HEAD
        table.innerHTML = `<tr>
            <th style="width: 0;">№</th>
            <th>Тип</th>
            <th >Наименование</th>
            <th width=70>Цена</th>
            <th style="width: 0;" ><span class="ordering_by_down">Размер</span></th>
            <th style="width: 0;">Действие</th>
        </tr>`;

        //Insert Rows
        if (json.length > 0) {
            for (let x = 0; x < json.length; ++x) {
                let targetMBO = json[x];
                let size_info = indexof_size(targetMBO.type);
                table.innerHTML += `<tr json_index="${x}:${index}">
                    <td>${(x + 1).toString()}</td>
                    <td>${targetMBO.type}</td>
                    <td>${targetMBO.name}</td>
                    <td class="${targetMBO.oldIsDiscount != undefined ? "cosh_self_general" : ""}" style="${(targetMBO.isDiscount ? ("background:" + ui_layer_gradient_component("yellow")) : "")};">
                        ${targetMBO.oldIsDiscount != undefined ?
                        `<span class="cosh_self_new">${translate_to_number(targetMBO.cosh)}</span>
                            <span class="cosh_self_old" style="${(targetMBO.oldIsDiscount ? ("background:" + ui_layer_gradient_component("yellow")) : "")};">↯${translate_to_number(targetMBO.oldCosh)}</span>`
                        :
                        (translate_to_number(targetMBO.cosh))}
                    </td>
                    <td style="background: ${ui_layer_gradient_component(size_info.color)}">${size_info.size}</td>
                    <td>
                        <button class="cbutton cbutton_icon_cancel" onclick="ui_present_copy_cancel(this)">x</button>
                        <button class="cbutton cbutton_icon_clipboard" onclick="ui_present_copy(this)">Копировать</button>
                    </td>
                </tr>`;
                if (assoc_container.get(size_info.size_mm) == undefined) {
                    assoc_container.set(size_info.size_mm, 1);
                } else {
                    let val = assoc_container.get(size_info.size_mm);
                    assoc_container.set(size_info.size_mm, ++val);
                }
            }
            $(table).children("tr").children("th").children("span.ordering_by_down")[0].onclick = function () { ui_component_table_sort(table, this); };
            ui_component_table_sort(table, null, true);
        } else {
            table.innerHTML += `<tr style="background: ${ui_layer_gradient_component("yellow")}">
                <td></td>
                <td></td>
                <td>${_str_no_change}</td>
                <td></td>
                <td></td>
                <td></td>
                </tr>`;
        }

        //cat draw 
        if (cat_draw) {
            let catClass = ((json.length > 0) ? "cat_state_work" : "cat_state_sleep");
            let p = $(table.parentNode.parentNode);
            let cat = $("<span></span>").addClass(catClass);
            p.append(cat);
        }

        return assoc_container;
    }

    //let _cont = $("#list_body_chn")[0].parentElement.parentElement;
    //_cont.innerHTML = " _cont.innerHTML;

    let lists = [$("#thead_change")[0], $("#thead_add")[0], $("#thead_remove")[0]];
    let tables = [$("#list_body_chn")[0], $("#list_body_add")[0], $("#list_body_rem")[0]];

    let container = update_list(lists[0], tables[0], jsonResult.changed, 0);
    //show info from objects
    $("#list_body_chn span.cosh_self_old").on("click", function () {
        let msg = "";
        let ifi = this.parentNode.parentNode.getAttribute("json_index").split(":");
        let jelem = (ifi[1] == 0 ? jsonResult.changed : ifi[1] == 1 ? jsonResult.addedNew : jsonResult.prevRemoved)[ifi[0]];
        let jstat = jsonResult.stats[ifi[0]];
        alert(
            `Тип товара: ${jelem.type}
Имя товара: ${jelem.name}
Товар подлежит в (короткое): ${categories[jstat.type].short}
Товар подлежит в (подробное): ${categories[jstat.type].full}
Цена: ${translate_to_number(jelem.cosh)}
Прошлая цена: ${translate_to_number(jelem.oldCosh)}
Со скидкой? ${jelem.isDiscount ? "Да" : "Нет"}
Разница: ${Math.abs(jelem.cosh - jelem.oldCosh)}
Окончание ценника: ${jstat.lastOf}
Коэффициент c продаж (на ${jstat.lastOf}): ${jstat.ratio} (*не работает*)
`)
    });
    lists[0].click();

    update_list(lists[1], tables[1], jsonResult.addedNew, 1);
    update_list(lists[2], tables[2], jsonResult.prevRemoved, 2);

    let corners = $(".cc_corner");
    let totalPages = 0;
    let cmptN = new Array(corners.length);

    container.forEach(function (value, key, map) {
        let index = get_cc_from(key);
        let cp = calcPaper(key, value);
        $(corners[index]).html($(corners[index]).html().replace("{}", cp.papers).replace("{}", value));
        if (cmptN[index] == null) cmptN[index] = 1;
        totalPages += cp.papers;
    });

    //hide empty
    for (let x = 0; x < cmptN.length; ++x) {
        if (cmptN[x] == null) {
            $(corners[x]).hide();
        }
    }
}

function ui_version_notify(verinit) {
    const ver_key = "_version";

    if (localStorage.getItem(ver_key) != version || verinit == true) {
        alert(`Новая версия: ${version}\n${__change_log}`);
        localStorage.setItem(ver_key, version);
    }
}


function user_interface_present() {

    //Params: 
    // maybe_error - this is for stupied mode 
    // name        - user name 
    // target      - target for confirm  
    // type        - user department
    params = new URL(document.location).searchParams;
    {
        let p = $("#_projectName");
        p.text(`Мечта-кошка v${version}`);
        p.on("click", function () { ui_version_notify(true) });
        sv_load_watch();
    }
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

    const _textMBO = ["Выберите предыдущий МБО", "Выберите следующий МБО"];
    let __files = $('.input-file input[type=file]');
    __files.on('change', function () {
        let file = this.files[0],
            x, filename = file.name,
            permission = true;

        if (params.get("maybe_error") == "true") {
            x = name_analyze(filename);
            if (!(permission = x.error == 0)) {
                let target = params.get("target");
                filename = "Неверный имя МБО.";
                alert("Вы " + (target != null ? "\"" + target + "\" " : "") + "ввели некорректное название для МБО.\n" +
                    "Пример правильности имени: \n\tGSM-10.10.2023-10.22.\n\tKBT-10.10.2023-10.22.\n\tMBT-10.10.2023-10.22.\n\n" +
                    "Правила:\n[ОТДЕЛЕНИЕ]-[ДЕНЬ].[МЕСЯЦ].[ГОД]-[ЧАСЫ].[МИНУТЫ].\n\n" +
                    "Сообщение ошибки: " + x.error_message +
                    "\nКод ошибки: " + x.error);
            }
        }

        $(this).closest('.input-file').find('.input-file-text').text(filename);
        if (permission) {
            if (this.id == "prev")
                x = 0;
            else
                x = 1;
            docx[x] = file;
        }
    });

    __files.on("click", function () {
        let x;
        this.value = null;
        if (this.id == "prev")
            x = 0;
        else
            x = 1;
        docx[x] = null; // clean 
        $('.input-file-text')[x].innerText = _textMBO[x];
    });


    // wait and show
    if (haveLoad) {
        setTimeout(function () {
            //return;
            show_loader("#window_data");
        }, delayLoader);
    }

    $('.input-file-text').first().text(_textMBO[0]);
    $('.input-file-text').last().text(_textMBO[1]);

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

    const __tmp_day = "__wtmp_day";
    if (new Date().toDateString().startsWith("Fri")) {
        if (sessionStorage.getItem(__tmp_day) == null) {
            sessionStorage.setItem(__tmp_day, 1);
            alert("Сегодня пятница, значит готовимся на прибытие новых товаров!\nНе забудьте сохранить ценники после прибытия, чтобы не потерять изменения!");
        }
    }
    else {
        sessionStorage.removeItem(__tmp_day);
    }

    try {
        fetch("https://profile-counter.glitch.me/toolsmechta.kz/count.svg", {
            "method": "GET",
            "mode": "no-cors"
        });
        console.log("send statistics for debug");
    } catch (e) { console.error(e); }
}

$(document).ready(user_interface_present);