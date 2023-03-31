//this code was created by me, see.
//this JS script created to facilitate the process of checking price tags based on a storefront (mechta.kz)
//github: github.com/badcast

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
    a = Math.pow(10, a);

    //let p = Math.round(num / a);
    let q = num % a;

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
    const benefits_section = [
        //head .section
        90, 00, 70, 30, 10,
        //write GSM .section
        0.8, 0.98, 1.96, 2.94, 0.02,
        //write KBT .section
        0.8, 1.6, 3.2, 4.8, 0.02,
        //write MBT .section
        1.9, 3.8, 7.6, 11.4, 0.02,
        //write other (SOP) .section
        4
    ];
    function benefit_get(coshRad) {
        //formula: x * height + y;
        let x = benefits_section.slice(0, benefits_width).indexOf(coshRad);
        if (x == -1) {
            return benefits_section[benefits_section.length - 1]; // get last element
        }

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
const types = [
    ["Бутербродница", 1, "Варочная поверхность", 2, "Вертикальный пылесос", 3, "Весы", 1, "Водонагреватель", 3, "Встр. посудомоечная машина", 3, "Вытяжка", 3, "Газовая плита", 3, "Газоэлектрическая плита", 3, "Гладильная система", 1, "Духовой шкаф", 2, "Жаровня", 1, "Казан", 1, "Кастрюля", 1, "Ковш", 1, "Комбинированная плита", 3, "Конвектор", 3, "Кондиционер", 3, "Кофеварка", 1, "Кофемашина", 1, "Кулер напольный", 3, "Кулер настольный", 3, "Кухонная машина", 1, "Мантоварка", 1, "Массажер", 1, "Машинка для стрижки катышков", 1, "Микроволновая печь", 1, "Миксер", 1, "Морозильник", 3, "Морозильник ларь", 3, "Мультиварка", 1, "Мультипекарь", 1, "Мультитриммер", 2, "Мясорубка", 1, "Набор посуды", 1, "Настольный гриль", 1, "Обогреватель", 1, "Отпариватель электрический", 1, "Пароварка", 1, "Плойка", 1, "Посудомоечная машина", 3, "Прибор для распрямления волос", 1, "Пылесос", 1, "Робот-пылесос", 3, "Ручной блендер", 1, "Сковорода - гриль", 1, "Сковорода + крышка", 1, "Сковорода", 1, "Сковорода + крышка", 1, "Соковыжималка", 1, "Стационарный блендер", 1, "Стиральная машина", 3, "Стиральная машина П/А", 3, "Стиральная машина с сушкой", 3, "Тепловая пушка", 3, "Тепловентилятор", 3, "Тепловоздушная завеса", 3, "Термопот", 1, "Тостер", 1, "Триммер для бороды", 2, "Триммер для волос", 2, "Триммер для носа", 2, "Увлажнитель воздуха", 1, "Утюг", 1, "Фен", 1, "Фен плойка", 1, "Холодильник", 3, "Чайник", 1, "Швейная машина", 1, "Шкаф витрина", 3, "Эл. зубная щётка", 0, "Электрическая сушка", 0, "Электрический камин", 3, "Электробритва", 2, "Электровафельница", 1, "Электропечь", 1, "Электрочайник", 1, "Электрощипцы", 1, "Эпилятор", 2],
    ["Коврик для выпечки", 1, "Набор сковородок", 1, "Реле напряжения", 1, "Коврик для хранения овощей и фруктов", 0, "Антивибрационные лапки", 0, "Банка", 0, "Бутылка", 1, "Рукавица", 0, "Венчик", 0, "Гель", 1, "Гладильная доска", 1, "Держатель для молока", 0, "Доска разделочная", 0, "Дуршлаг", 0, "Ёмкость д/холод. и м/печи", 0, "Бутылка для масла", 0, "Ёмкость для специй", 0, "Ёмкость для сыпучих прод.", 0, "Емкость мерная", 0, "Заварочный чайник", 1, "Иглы", 0, "Игольница", 0, "Карандаш для утюгов", 0, "Кастрюли стеклянные", 1, "Набор контейнеров", 0, "Кондиционер для белья", 1, "Контейнер", 0, "Контейнер для стирального порошка", 1, "Контейнер", 0, "Корзина для белья", 1, "Корзинка универсальная", 0, "Кофе в зернах", 0, "Кофе молотый", 0, "Кофемолка", 1, "Кронштейн для СВЧ", 0, "Емкость для миксера", 0, "Емкость мерная", 0, "Крышка", 1, "Крышка д/холод. и м/печи", 0, "Крышка", 1, "Кувшин", 1, "Кувшин мерный", 0, "Кувшин", 1, "Кухонные весы", 1, "Ложка", 0, "Лопатка", 0, "Маслёнка", 0, "Масло для швейных машин", 0, "Емкость мерная", 0, "Миска", 0, "Модуль сменный", 1, "Набор (химия)", 0, "Булавки", 0, "Набор втулок", 0, "Штопор", 0, "Набор для пикника", 0, "Набор для швейных машин", 0, "Набор контейнеров", 0, "Набор ножей", 0, "Модуль сменный", 1, "Набор форм", 0, "Насадка (для швабры)", 0, "Насадка з/щ", 0, "Нитки", 0, "Нож", 0, "Ножницы", 0, "Овощечистка", 0, "Ополаскиватель", 1, "Очиститель накипи", 0, "Поднос", 0, "Подставка для кухонных принадлежностей", 0, "Половник", 0, "Порошок", 1, "Френч-пресс", 1, "Пресс для чеснока", 0, "Противень", 0, "Пылесборник", 0, "Салатник", 1, "Салфетка", 1, "Сетка для глажения", 0, "Щипцы", 0, "Сито", 0, "Скалка", 0, "Скребок", 0, "Соль", 1, "Средство", 1, "Средство для утюга", 0, "Стабилизаторы Белой техники", 1, "Сушилка для белья", 1, "Таблетки", 1, "Тёрка", 1, "Термокружка", 1, "Термос", 1, "Термокружка", 1, "Толкушка", 0, "Топорик", 0, "Точило", 0, "Турка", 1, "Универсальный бокс для хранения", 1, "Устройство для смягчения воды", 1, "Фильтр (для вытяжки)", 0, "Фильтр (для кофе)", 1, "Фильтр (для пылесоса)", 0, "Кувшин", 1, "Модуль сменный", 1, "Форма", 0, "Форма для выпечки", 0, "Форма", 0, "Форма для выпечки", 0, "Форма для льда", 0, "Форма", 0, "Френч-пресс", 1, "Хлебница", 1, "Часы", 1, "Чашки", 1, "Чехол (для гладильных досок)", 0, "Швабра-полотер", 3, "Швейный набор", 0, "Шкатулка", 1, "Шумовка", 0, "Щетка", 0, "Электросушилка для обуви", 0]
];
const lwidth = 3;
const sizes = [
    "МБО", "#4caf50", "28x33",
    "70x42", "#55aaff", "70x42",
    "105x75", "#ffc107", "105x75",
    "A6", "#ff5100", "148x105"];
const types_unknown = "-";
function indexof_size(type) {
    let sz;
    let sz_mm;
    let cl;
    let x;
    let y;

    for (y = 0; y < types.length; ) {

        x = types[y].indexOf(type);
        if (x != ~0) {
            y = types[y][x + 1];
            break;
        }
        ++y;
    }

    if (x != ~0) {
        // x * width + y = формула двухмерной индексаций (преобразует двумерную точку в одномерную)
        sz = sizes[y * lwidth];
        cl = sizes[y * lwidth + 1];
        sz_mm = sizes[y * lwidth + 2];
    } else {
        sz = types_unknown;
        cl = "#ff04c0";
        sz_mm = "1x1"; // default size 1x1 mm
    }

    return {
        size: sz,
        color: cl,
        size_mm: sz_mm
    };
}
function calcPaper(size, count = 1, paper = {
        width: 297, // mm maximum
        height: 420, // mm maximum
        offLeft: 4, // offset left
        offRight: 96, // 96mm minimum
        offUp: 2, // offset up
        offDown: 16 + 109, // 109mm minimum
        valueInISO: "mm"
    }) {
    let spaceX = paper.width - paper.offLeft - paper.offRight;
    let spaceY = paper.height - paper.offUp - paper.offDown;

    size = size.replaceAll(" ", "").split("x");
    //convert string to int
    for (let i = 0; i < size.length; ++i)
        size[i] = parseInt(size[i], 10); // size Xmm * Ymm

    let toRightMax = div(spaceX, size[0]);
    let toDownMax = div(spaceY, size[1]);

    let paperRequire = 1;
	
	
    return {
        papers: paperRequire,
        toRightMax: toRightMax.quot,
        toDownMax: toDownMax.quot,
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
            l = e[t], e[t] = l.substr(l.indexOf(".") + 1, l.length);
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
                if (o = n(s[t]), null == e)
                    e = o.coshedClass;
                else if (e != o.coshedClass) {
                    console.error("invalid cosh class");
                    break
                }
                l[1] = o.class
            }
        else {
            if (o = n(s[t]), null == e)
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
    let l,
    t,
    n = docObject.getElementsByClassName("R2C1"),
    o = docObject.getElementsByClassName("R1C1"),
    coshClass;
    if (e) {
        let e = find_class_heuristic(docObject);
        l = e.discount_class,
        t = e.count_class;
        coshClass = e.cosh_class;
        console.log("discount class: " + l + ", count class: " + t + " cosh class: " + coshClass);
    } else {
        console.error("failing find classes. Break point");
        return null;
    }

    s = docObject.getElementsByClassName(coshClass);

    let r = [];
    for (let e = 0; e < s.length; ++e) {
        let c = s[e].childNodes;
        for (let e = 0; e < c.length; ++e) {
            let s,
            a = c[e],
            i = -1;
            ((s = a.className == l) || a.className == t) && (i = evaluate_number(a.lastChild.innerText), r.push({
                    name: n[r.length].innerText,
                    cosh: i,
                    type: o[r.length].innerText,
                    isDiscount: s
                }))
        }
    }
    return r
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
            if (!o && c && (r = !0, e[n].cosh != l[s].cosh || e[n].isDiscount != l[s].isDiscount)) {
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
function budget(e) {
    let l = 0;
    for (let t = l; t < e.length; ++t)
        l += e[t].cosh;
    return l
}
function print_coshes(e) {
    var l = "";
    for (let t = 0; t < e.length; ++t)
        l += e[t].type + " " + e[t].name + "\n";
    return l
}
function print_types(e) {
    let l = [];
    e = e ?? avail(),
    l.push(e[0].type);
    for (let t = l.length; t < e.length; ++t)
        l[l.length - 1] != e[t].type && l.push(e[t].type);
    return console.log(l.toString().replaceAll(",", ";")),
    l
}
