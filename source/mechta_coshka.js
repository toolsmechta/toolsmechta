//this code was created by me, see.
//this JS script created to facilitate the process of checking price tags based on a storefront (mechta.kz)
//github: github.com/badcast

var raw_types = 'W1si0JLQsNGA0L7Rh9C90LDRjyDQv9C+0LLQtdGA0YXQvdC+0YHRgtGMIiwyLCLQktC10L3RgtC40LvRj9GC0L7RgCIsMCwi0JLQtdGA0YLQuNC60LDQu9GM0L3Ri9C5INC/0YvQu9C10YHQvtGBIiwzLCLQktC+0LTQvtC90LDQs9GA0LXQstCw0YLQtdC70YwiLDMsItCS0YHRgtGALiDQv9C+0YHRg9C00L7QvNC+0LXRh9C90LDRjyDQvNCw0YjQuNC90LAiLDMsItCS0YvRgtGP0LbQutCwIiwzLCLQk9Cw0LfQvtCy0LDRjyDQv9C70LjRgtCwIiwzLCLQk9Cw0LfQvtGN0LvQtdC60YLRgNC40YfQtdGB0LrQsNGPINC/0LvQuNGC0LAiLDMsItCU0YPRhdC+0LLQvtC5INGI0LrQsNGEIiwyLCLQmtC+0LzQsdC40L3QuNGA0L7QstCw0L3QvdCw0Y8g0L/Qu9C40YLQsCIsMywi0JrQvtC90LLQtdC60YLQvtGAIiwzLCLQmtC+0L3QtNC40YbQuNC+0L3QtdGAIiwzLCLQmtGD0LvQtdGAINC90LDQv9C+0LvRjNC90YvQuSIsMywi0JrRg9C70LXRgCDQvdCw0YHRgtC+0LvRjNC90YvQuSIsMywi0JzQuNC60YDQvtCy0L7Qu9C90L7QstCw0Y8g0L/QtdGH0YwiLDEsItCc0L7RgNC+0LfQuNC70YzQvdC40LoiLDMsItCc0L7RgNC+0LfQuNC70YzQvdC40Log0LvQsNGA0YwiLDMsItCe0LHQvtCz0YDQtdCy0LDRgtC10LvRjCIsMSwi0J/QvtGB0YPQtNC+0LzQvtC10YfQvdCw0Y8g0LzQsNGI0LjQvdCwIiwzLCLQn9GL0LvQtdGB0L7RgSIsMSwi0KDQvtCx0L7Rgi3Qv9GL0LvQtdGB0L7RgSIsMywi0KHRgtC40YDQsNC70YzQvdCw0Y8g0LzQsNGI0LjQvdCwIiwzLCLQodGC0LjRgNCw0LvRjNC90LDRjyDQvNCw0YjQuNC90LAg0J8v0JAiLDMsItCh0YLQuNGA0LDQu9GM0L3QsNGPINC80LDRiNC40L3QsCDRgSDRgdGD0YjQutC+0LkiLDMsItCi0LXQv9C70L7QstCw0Y8g0L/Rg9GI0LrQsCIsMywi0KLQtdC/0LvQvtCy0LXQvdGC0LjQu9GP0YLQvtGAIiwzLCLQotC10L/Qu9C+0LLQvtC30LTRg9GI0L3QsNGPINC30LDQstC10YHQsCIsMywi0KXQvtC70L7QtNC40LvRjNC90LjQuiIsMywi0KjQutCw0YQg0LLQuNGC0YDQuNC90LAiLDMsItCt0LvQtdC60YLRgNC40YfQtdGB0LrQuNC5INC60LDQvNC40L0iLDMsItCt0LvQtdC60YLRgNC+0L/QtdGH0YwiLDFdLFsi0JHRg9GC0LXRgNCx0YDQvtC00L3QuNGG0LAiLDEsItCS0LXRgdGLIiwxLCLQk9C70LDQtNC40LvRjNC90LDRjyDRgdC40YHRgtC10LzQsCIsMSwi0JbQsNGA0L7QstC90Y8iLDEsItCY0YDRgNC40LPQsNGC0L7RgCIsMCwi0JrQsNC30LDQvSIsMSwi0JrQsNGB0YLRgNGO0LvRjyIsMSwi0JrQvtCy0YgiLDEsItCa0L7RhNC10LLQsNGA0LrQsCIsMSwi0JrQvtGE0LXQvNCw0YjQuNC90LAiLDEsItCa0YPRhdC+0L3QvdCw0Y8g0LzQsNGI0LjQvdCwIiwxLCLQnNCw0L3RgtC+0LLQsNGA0LrQsCIsMSwi0JzQsNGB0YHQsNC20LXRgCIsMSwi0JzQsNGI0LjQvdC60LAg0LTQu9GPINGB0YLRgNC40LbQutC4INC60LDRgtGL0YjQutC+0LIiLDEsItCc0LjQutGB0LXRgCIsMSwi0JzRg9C70YzRgtC40LLQsNGA0LrQsCIsMSwi0JzRg9C70YzRgtC40L/QtdC60LDRgNGMIiwxLCLQnNGP0YHQvtGA0YPQsdC60LAiLDEsItCd0LDQsdC+0YAg0L/QvtGB0YPQtNGLIiwxLCLQndCw0YHRgtC+0LvRjNC90YvQuSDQs9GA0LjQu9GMIiwxLCLQntGC0L/QsNGA0LjQstCw0YLQtdC70Ywg0Y3Qu9C10LrRgtGA0LjRh9C10YHQutC40LkiLDEsItCf0LvQvtC50LrQsCIsMSwi0J/RgNC40LHQvtGAINC00LvRjyDRgNCw0YHQv9GA0Y/QvNC70LXQvdC40Y8g0LLQvtC70L7RgSIsMSwi0KDRg9GH0L3QvtC5INCx0LvQtdC90LTQtdGAIiwxLCLQodC60L7QstC+0YDQvtC00LAgLSDQs9GA0LjQu9GMIiwxLCLQodC60L7QstC+0YDQvtC00LAgKyDQutGA0YvRiNC60LAiLDEsItCh0LrQvtCy0L7RgNC+0LTQsCIsMSwi0KHQvtC60L7QstGL0LbQuNC80LDQu9C60LAiLDEsItCh0YLQsNGG0LjQvtC90LDRgNC90YvQuSDQsdC70LXQvdC00LXRgCIsMSwi0KLQtdGA0LzQvtC/0L7RgiIsMSwi0KLQvtGB0YLQtdGAIiwxLCLQotGA0LjQvNC80LXRgCDQtNC70Y8g0LHQvtGA0L7QtNGLIiwyLCLQotGA0LjQvNC80LXRgCDQtNC70Y8g0LLQvtC70L7RgSIsMiwi0KLRgNC40LzQvNC10YAg0LTQu9GPINC90L7RgdCwIiwyLCLQo9Cy0LvQsNC20L3QuNGC0LXQu9GMINCy0L7Qt9C00YPRhdCwIiwxLCLQo9GC0Y7QsyIsMSwi0KTQtdC9IiwxLCLQpNC10L0g0L/Qu9C+0LnQutCwIiwxLCLQp9Cw0LnQvdC40LoiLDEsItCo0LLQtdC50L3QsNGPINC80LDRiNC40L3QsCIsMSwi0K3Quy4g0LfRg9Cx0L3QsNGPINGJ0ZHRgtC60LAiLDAsItCt0LvQtdC60YLRgNC40YfQtdGB0LrQsNGPINGB0YPRiNC60LAiLDAsItCt0LvQtdC60YLRgNC+0LHRgNC40YLQstCwIiwyLCLQrdC70LXQutGC0YDQvtCy0LDRhNC10LvRjNC90LjRhtCwIiwxLCLQrdC70LXQutGC0YDQvtGH0LDQudC90LjQuiIsMSwi0K3Qu9C10LrRgtGA0L7RidC40L/RhtGLIiwxLCLQrdC/0LjQu9GP0YLQvtGAIiwyXSxbItCg0LXQu9C1INC90LDQv9GA0Y/QttC10L3QuNGPIiwxLCLQmtC+0LLRgNC40Log0LTQu9GPINGF0YDQsNC90LXQvdC40Y8g0L7QstC+0YnQtdC5INC4INGE0YDRg9C60YLQvtCyIiwwLCLQkNC90YLQuNCy0LjQsdGA0LDRhtC40L7QvdC90YvQtSDQu9Cw0L/QutC4IiwwLCLQkdCw0L3QutCwIiwwLCLQkdGD0YLRi9C70LrQsCIsMSwi0KDRg9C60LDQstC40YbQsCIsMCwi0JPQtdC70YwiLDEsItCT0LvQsNC00LjQu9GM0L3QsNGPINC00L7RgdC60LAiLDEsItCU0LXRgNC20LDRgtC10LvRjCDQtNC70Y8g0LzQvtC70L7QutCwIiwwLCLQlNC+0YHQutCwINGA0LDQt9C00LXQu9C+0YfQvdCw0Y8iLDAsItCU0YPRgNGI0LvQsNCzIiwwLCLQgdC80LrQvtGB0YLRjCDQtC/RhdC+0LvQvtC0LiDQuCDQvC/Qv9C10YfQuCIsMCwi0JHRg9GC0YvQu9C60LAg0LTQu9GPINC80LDRgdC70LAiLDAsItCB0LzQutC+0YHRgtGMINC00LvRjyDRgdC/0LXRhtC40LkgIiwwLCLQgdC80LrQvtGB0YLRjCDQtNC70Y8g0YHRi9C/0YPRh9C40YUg0L/RgNC+0LQuIiwwLCLQldC80LrQvtGB0YLRjCDQvNC10YDQvdCw0Y8iLDAsItCX0LDQstCw0YDQvtGH0L3Ri9C5INGH0LDQudC90LjQuiIsMSwi0JjQs9C70YsiLDAsItCY0LPQvtC70YzQvdC40YbQsCIsMCwi0JrQsNGA0LDQvdC00LDRiCDQtNC70Y8g0YPRgtGO0LPQvtCyIiwwLCLQntCy0L7RidC10YfQuNGB0YLQutCwIiwwLCLQmtCw0YHRgtGA0Y7Qu9C4INGB0YLQtdC60LvRj9C90L3Ri9C1IiwxLCLQndCw0LHQvtGAINC60L7QvdGC0LXQudC90LXRgNC+0LIiLDAsItCa0L7QvdC00LjRhtC40L7QvdC10YAg0LTQu9GPINCx0LXQu9GM0Y8iLDEsItCa0L7QvdGC0LXQudC90LXRgCIsMCwi0JrQvtC90YLQtdC50L3QtdGAINC00LvRjyDRgdGC0LjRgNCw0LvRjNC90L7Qs9C+INC/0L7RgNC+0YjQutCwIiwxLCLQmtC+0YDQt9C40L3QsCDQtNC70Y8g0LHQtdC70YzRjyIsMSwi0JrQvtGA0LfQuNC90LrQsCDRg9C90LjQstC10YDRgdCw0LvRjNC90LDRjyIsMCwi0JrQvtGE0LUg0LIg0LfQtdGA0L3QsNGFIiwwLCLQmtC+0YTQtSDQvNC+0LvQvtGC0YvQuSIsMCwi0JrQvtGE0LXQvNC+0LvQutCwIiwxLCLQmtGA0L7QvdGI0YLQtdC50L0g0LTQu9GPINCh0JLQpyIsMCwi0JXQvNC60L7RgdGC0Ywg0LTQu9GPINC80LjQutGB0LXRgNCwIiwwLCLQmtGA0YvRiNC60LAiLDEsItCa0YDRi9GI0LrQsCDQtC/RhdC+0LvQvtC0LiDQuCDQvC/Qv9C10YfQuCIsMCwi0JrRg9Cy0YjQuNC9IiwxLCLQmtGD0LLRiNC40L0g0LzQtdGA0L3Ri9C5IiwwLCLQmtGD0LvQuNC90LDRgNC90YvQuSDRiNC/0YDQuNGGIiwwLCLQmtGD0YXQvtC90L3Ri9C1INCy0LXRgdGLIiwxLCLQmtGD0YXQvtC90L3Ri9C5INC90LDQsdC+0YAiLDEsItCb0L7QttC60LAiLDAsItCb0L7Qv9Cw0YLQutCwIiwwLCLQnNCw0YHQu9GR0L3QutCwIiwwLCLQnNCw0YHQu9C+INC00LvRjyDRiNCy0LXQudC90YvRhSDQvNCw0YjQuNC9IiwwLCLQnNC40YHQutCwIiwwLCLQnNC+0LTRg9C70Ywg0YHQvNC10L3QvdGL0LkiLDEsItCd0LDQsdC+0YAgKNGF0LjQvNC40Y8pIiwwLCLQkdGD0LvQsNCy0LrQuCIsMCwi0J3QsNCx0L7RgCDQstGC0YPQu9C+0LoiLDAsItCo0YLQvtC/0L7RgCIsMCwi0J3QsNCx0L7RgCDQtNC70Y8g0L/QuNC60L3QuNC60LAiLDAsItCd0LDQsdC+0YAg0LTQu9GPINGI0LLQtdC50L3Ri9GFINC80LDRiNC40L0iLDAsItCd0LDQsdC+0YAg0L3QvtC20LXQuSIsMCwi0J3QsNCx0L7RgCDRgNCw0LfQtNC10LvQvtGH0L3Ri9GFINC00L7RgdC+0LoiLDAsItCd0LDRgdCw0LTQutCwICgg0LTQu9GPINGD0YLRjtCz0LApIiwwLCLQndCw0YHQsNC00LrQsCAo0LTQu9GPINGI0LLQsNCx0YDRiykiLDAsItCd0LDRgdCw0LTQutCwINC3L9GJIiwwLCLQndC40YLQutC4IiwwLCLQndC+0LYiLDAsItCd0L7QttC90LjRhtGLIiwwLCLQntC/0L7Qu9Cw0YHQutC40LLQsNGC0LXQu9GMIiwxLCLQntGH0LjRgdGC0LjRgtC10LvRjCDQvdCw0LrQuNC/0LgiLDAsItCf0L7QtNC90L7RgSIsMCwi0J/QvtC00YHRgtCw0LLQutCwINC00LvRjyDQutGD0YXQvtC90L3Ri9GFINC/0YDQuNC90LDQtNC70LXQttC90L7RgdGC0LXQuSIsMCwi0J/QvtC70L7QstC90LjQuiIsMCwi0J/QvtGA0L7RiNC+0LoiLDEsItCk0YDQtdC90Yct0L/RgNC10YHRgSIsMSwi0J/RgNC10YHRgSDQtNC70Y8g0YfQtdGB0L3QvtC60LAiLDAsItCf0YDQvtGC0LjQstC10L3RjCIsMCwi0J/Ri9C70LXRgdCx0L7RgNC90LjQuiIsMCwi0KHQsNC70LDRgtC90LjQuiIsMSwi0KHQsNC70YTQtdGC0LrQsCIsMSwi0KHQtdGC0LrQsCDQtNC70Y8g0LPQu9Cw0LbQtdC90LjRjyIsMCwi0KnQuNC/0YbRiyIsMCwi0KHQuNGC0L4iLDAsItCh0LrQsNC70LrQsCIsMCwi0KHQutGA0LXQsdC+0LoiLDAsItCh0L7Qu9GMIiwxLCLQodGA0LXQtNGB0YLQstC+IiwxLCLQodGA0LXQtNGB0YLQstC+INC00LvRjyDRg9GC0Y7Qs9CwIiwwLCLQodGC0LDQsdC40LvQuNC30LDRgtC+0YDRiyDQkdC10LvQvtC5INGC0LXRhdC90LjQutC4IiwxLCLQodGD0YjQuNC70LrQsCDQtNC70Y8g0LHQtdC70YzRjyIsMSwi0KLQsNCx0LvQtdGC0LrQuCIsMSwi0KLRkdGA0LrQsCIsMSwi0KLQtdGA0LzQvtC60YDRg9C20LrQsCIsMSwi0KLQtdGA0LzQvtGBIiwxLCLQotC+0LvQutGD0YjQutCwIiwwLCLQotC+0L/QvtGA0LjQuiIsMCwi0KLQvtGH0LjQu9C+IiwwLCLQotGD0YDQutCwIiwxLCLQo9C90LjQstC10YDRgdCw0LvRjNC90YvQuSDQsdC+0LrRgSDQtNC70Y8g0YXRgNCw0L3QtdC90LjRjyIsMSwi0KPRgdGC0YDQvtC50YHRgtCy0L4g0LTQu9GPINGB0LzRj9Cz0YfQtdC90LjRjyDQstC+0LTRiyIsMSwi0KTQuNC70YzRgtGAICjQtNC70Y8g0LLRi9GC0Y/QttC60LgpIiwwLCLQpNC40LvRjNGC0YAgKNC00LvRjyDQutC+0YTQtSkiLDEsItCk0LjQu9GM0YLRgCAo0LTQu9GPINC/0YvQu9C10YHQvtGB0LApIiwwLCLQpNC+0YDQvNCwIiwwLCLQpNC+0YDQvNCwINC00LvRjyDQstGL0L/QtdGH0LrQuCIsMCwi0KTQvtGA0LzQsCDQtNC70Y8g0LvRjNC00LAiLDAsItCl0LvQtdCx0L3QuNGG0LAiLDEsItCn0LDRgdGLIiwxLCLQp9Cw0YjQutC4IiwxLCLQp9C10YXQvtC7ICjQtNC70Y8g0LPQu9Cw0LTQuNC70YzQvdGL0YUg0LTQvtGB0L7QuikiLDAsItCo0LLQsNCx0YDQsCIsMCwi0KjQstCw0LHRgNCwLdC/0L7Qu9C+0YLQtdGAIiwzLCLQqNC60LDRgtGD0LvQutCwIiwxLCLQqNGD0LzQvtCy0LrQsCIsMCwi0KnQtdGC0LrQsCIsMCwi0K3Qu9C10LrRgtGA0L7RgdGD0YjQuNC70LrQsCDQtNC70Y8g0L7QsdGD0LLQuCIsMCwi0JLQtdC90YfQuNC6IiwwLCLQndCw0LHQvtGAINGE0L7RgNC8IiwwLCLQn9C+0LPQu9C+0YLQuNGC0LXQu9GMINC30LDQv9Cw0YXQvtCyIiwwXV0=';

const lwidth = 3;
const lang = [{
    lang: "ru"
}, {
    lang: "kz"
}
];
const sizes = ["МБО", "#4caf50", "28x33",
    "70x42", "#55aaff", "70x42",
    "105x75", "#ffc107", "105x75",
    "A6", "#ff5100", "148x105"];
const categories = [{
    "short": "КБТ",
    "full": "Крупнобытовая техника"
}, {
    "short": "МБТ",
    "full": "Мелкобытовая техника"
}, {
    "short": "СОП",
    "full": "Сопутствующие товары КБТ + МБТ"
}, {
    "short": "Неизвестный",
    "full": "Не зарегистрированным"
}
];
const unknown_category = categories.length - 1;
const types_unknown = "-";

function get_cc_from(size) {
    switch (size) {
        case "A6": return 0;
        case "105x75": return 1;
        case "70x42": return 2;
        case "МБО": return 3;
    }
    return unknown_category;
}

function map(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function div(x, y) {
    return {
        quot: Math.floor(x / y),
        rem: Math.floor(x % y)
    };
}
//Convert string to NUMBER (ignore any case)
function evaluate_number(e) {
    let l = "";
    for (let t = 0; t < e.length; ++t)
        e[t] >= "0" && e[t] <= "9" && (l += e[t]);
    return parseInt(l, 10)
}
//Convert number 123456789 to beautiful 123 456 789
function translate_to_number(num, _level = 3, space = " ") {
    const radix = 10;
    let result = "";
    let level = 1;

    let dv = div(0, 1);
    while ((num = (dv = div(num, radix)).quot)) {
        result = dv.rem + result;

        if (level % _level == 0)
            result = space + result;
        ++level;
    }
    result = dv.rem + result;
    return result;
}
function get_radix_n(num, a) {
    let q;
    a = Math.pow(10, a);

    //let p = Math.round(num / a);
    q = num % a;

    if (num < a / 10)
        q = 0;

    return q;
}
function stat(jsonResult) {
    /*
    JsonResult impl:
    addedNew    : array (added)
    changed     : array (changed existing list)
    prevRemoved : array (deleted from previous list)
     */
    const benefits_width = 5;
    const benefits_section = [//head .section
        90, 00, 70, 30, 10, //write GSM .section
        0.8, 0.98, 1.96, 2.94, 0.02, //write KBT .section
        0.8, 1.6, 3.2, 4.8, 0.02, //write MBT .section
        1.9, 3.8, 7.6, 11.4, 0.02, //write other (SOP) .section
        4];
    function benefit_get(coshRad) {
        //formula: x * height + y;
        let x = benefits_section.slice(0, benefits_width).indexOf(coshRad);
        if (x == -1) {
            x = benefits_section[benefits_section.length - 1];
            // get last element
        }
        return x;

    }
    if (jsonResult == null) {
        console.error("jsonResult is null");
        return jsonResult;
    }

    //evaluate stats
    let stats = new Array(jsonResult.changed.length);
    for (let x = 0; x < stats.length; ++x) {
        let el = jsonResult.changed[x];
        let coshRad = get_radix_n(el.cosh, 2);
        stats[x] = {
            kind: "unknown",
            oldCosh: el.oldCosh,
            cosh: el.cosh,
            lastOf: coshRad,
            ratio: benefit_get(el.cosh),
            oldLastOf: get_radix_n(el.oldCosh, 2),
            oldRatio: benefit_get(el.oldCosh)
        };

    }

    return stats;

}
function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

function convertToBin(json) {
    return utf8_to_b64(JSON.stringify(json));
}

function indexof_size(type) {
    let sz,
        sz_mm,
        cat,
        cl,
        x,
        y = -1;
    if (typeof (raw_types) == 'string') {
        raw_types = JSON.parse(b64_to_utf8(raw_types));
    }
    for (cat = 0; cat < raw_types.length;) {
        x = raw_types[cat].indexOf(type);
        if (x != ~0) {
            y = raw_types[cat][x + 1];
            break;
        }
        ++cat;
    }

    if (x != ~0) {
        // x * width + y = формула двухмерной индексаций (преобразует двумерную точку в одномерную)
        sz = sizes[y * lwidth];
        cl = sizes[y * lwidth + 1];
        sz_mm = sizes[y * lwidth + 2];
    } else {
        sz = types_unknown;
        cl = "#ff04c0";
        // default size 1x1 mm
        sz_mm = "1x1";
    }

    return {
        size: sz,
        color: cl,
        size_mm: sz_mm,
        category: cat // get category
    };
}
function calcPaper(target, count = 1, paper = {
    width: 210,
    // mm maximum
    height: 297,
    // mm maximum
    offLeft: 25,
    // offset left
    offRight: 18,
    // offset right
    offUp: 0,
    // offset up
    offDown: 100,
    // offset down
    valueInISO: "mm",
    name: "A4"
}) {
    let spaceX = paper.width - paper.offLeft - paper.offRight;
    let spaceY = paper.height - paper.offUp - paper.offDown;

    let size = target.replaceAll(" ", "").split("x");
    //convert string to int
    for (let i = 0; i < size.length; ++i)
        size[i] = parseInt(size[i], 10);
    // size Xmm * Ymm

    let _spaceBlock = {
        h: div(spaceX, size[0]),
        v: div(spaceY, size[1])
    };

    _spaceBlock.h = _spaceBlock.h.quot + (_spaceBlock.h.rem > 0 ? 1 : 0);
    _spaceBlock.v = _spaceBlock.v.quot + (_spaceBlock.v.rem > 0 ? 1 : 0);

    return {
        papers: Math.ceil(count / (_spaceBlock.h * _spaceBlock.v)),
        paper: paper,
        target: target,
        toHzMax: _spaceBlock.h,
        toVcMax: _spaceBlock.v,
        valueInISO: paper.valueInISO
    };

}
function find_class_heuristic(docObject = document) {
    let e,
        l = [null, null],
        t = docObject.head.innerHTML;
    function n(e) {
        let l;
        e = (e = (e = (e = e.trimStart()).substr(0, e.indexOf("{"))).trimEnd()).split(" ");
        for (let t = 0; t < e.length; ++t)
            l = e[t],
                e[t] = l.substr(l.indexOf(".") + 1, l.length);
        return {
            class: e[1],
            coshedClass: e[0]
        }
    }
    2495 != t.length && console.error("Changed cosh-class. Please check for validate.");
    var s = t.split("\n");
    for (let t = 0; t < s.length; ++t) {
        let o;
        if (null != l[0] || -1 == (o = s[t].indexOf("color: #e61771; text-align: center;")))
            if (null != l[1] || -1 == (o = s[t].indexOf(" background-color: #ffed00; ")));
            else {
                if (o = n(s[t]),
                    null == e)
                    e = o.coshedClass;
                else if (e != o.coshedClass) {
                    console.error("invalid cosh class");
                    break
                }
                l[1] = o.class
            }
        else {
            if (o = n(s[t]),
                null == e)
                e = o.coshedClass;
            else if (e != o.coshedClass) {
                console.error("invalid cosh class");
                break
            }
            l[0] = o.class
        }
    }
    return {
        discount_class: l[1],
        count_class: l[0],
        cosh_class: e
    }
}
function avail(e = !0, docObject = document) {
    let l, _compare = [null, null],
        t,
        n = docObject.getElementsByClassName("R2C1"),
        o = docObject.getElementsByClassName("R1C1"),
        coshClass;
    if (e) {
        let e = find_class_heuristic(docObject);
        _compare[0] = e.discount_class,
            _compare[1] = e.count_class;
        coshClass = e.cosh_class;
        console.log("discount class: " + l + ", count class: " + t + " cosh class: " + coshClass);
    } else {
        console.error("failing find classes. Break point");
        return null;
    }

    s = docObject.getElementsByClassName(coshClass);

    let _results = [];
    for (let e = 0; e < s.length; ++e) {
        let c = s[e].childNodes;
        for (let e = 0; e < c.length; ++e) {
            let a = c[e];
            for (let x = 0; x < _compare.length; ++x) {
                if (a.className != null && a.className == _compare[x]) {
                    _results.push({
                        type: o[_results.length].innerText,
                        name: n[_results.length].innerText,
                        isDiscount: !x,
                        cosh: evaluate_number(a.lastChild.innerText)
                    });
                }
            }
        }
    }
    return _results
}
function difference(e, l) {
    let t = [],
        n = [],
        s = [];
    for (let n = 0; n < e.length; ++n) {
        let o = !1,
            r = !1;
        for (let s = 0; l.length > s; ++s) {
            let c = e[n].name === l[s].name && e[n].type === l[s].type;
            if (!o && c && (r = !0,
                e[n].cosh != l[s].cosh || e[n].isDiscount != l[s].isDiscount)) {
                l[s].oldCosh = e[n].cosh;
                t.push(l[s]),
                    o = !0;
                break
            }
        }
        r || s.push(e[n])
    }
    for (let t = 0; t < l.length; ++t) {
        let s = !1;
        for (let n = 0; n < e.length; ++n) {
            if (e[n].name === l[t].name && e[n].type === l[t].type) {
                s = !0;
                break
            }
        }
        s || n.push(l[t])
    }
    let obj = {
        changed: t,
        addedNew: n,
        prevRemoved: s
    };
    //calc stats
    obj.stats = stat(obj);

    return obj;
}
//print calc all budget from elements
function budget(e) {
    let l = 0;
    for (let t = l; t < e.length; ++t)
        l += e[t].cosh;
    return l
}
//categorize a width element
function cat(lhs, rhsWith) {
    let arr = [];

    lhs.forEach(function (a, b, c) {
        let i = rhsWith.indexOf(a);
        let size = 0;
        if (i == ~0)
            size = 0;
        else
            size = rhsWith[i + 1];
        arr.push(a, size);
        // get size
    });

    return arr;
}
//print all coshes from elements
function print_coshes(e) {
    var l = "";
    for (let t = 0; t < e.length; ++t)
        l += e[t].type + " " + e[t].name + "\n";
    return l
}
//print all types from elements
function print_types(e) {
    let l = new Set();
    e = e ?? avail();

    for (let t = 0; t < e.length; ++t)
        l.add(e[t].type);
    return console.log(l.toString().replaceAll(",", ";")),
        l
}
