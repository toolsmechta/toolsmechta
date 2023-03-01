function evaluate_number(e) {
    let l = "";
    for (let t = 0; t < e.length; ++t)
        e[t] >= "0" && e[t] <= "9" && (l += e[t]);
    return parseInt(l, 10)
}

const types = ["Бутербродница", 1, "Варочная поверхность", 2, "Вертикальный пылесос", 3, "Весы", 1, "Водонагреватель", 3, "Встр. посудомоечная машина", 3, "Вытяжка", 3, "Газовая плита", 3, "Газоэлектрическая плита", 3, "Гладильная система", 1, "Духовой шкаф", 2, "Жаровня", 1, "Казан", 1, "Кастрюля", 1, "Ковш", 1, "Комбинированная плита", 3, "Конвектор", 3, "Кондиционер", 3, "Кофеварка", 1, "Кофемашина", 1, "Кулер напольный", 3, "Кулер настольный", 3, "Кухонная машина", 1, "Мантоварка", 1, "Массажер", 1, "Машинка для стрижки катышков", 1, "Микроволновая печь", 1, "Миксер", 1, "Морозильник", 3, "Морозильник ларь", 3, "Мультиварка", 1, "Мультипекарь", 1, "Мультитриммер", 2, "Мясорубка", 1, "Набор посуды", 1, "Настольный гриль", 1, "Обогреватель", 1, "Отпариватель электрический", 1, "Пароварка", 1, "Плойка", 1, "Посудомоечная машина", 3, "Прибор для распрямления волос", 1, "Пылесос", 1, "Робот-пылесос", 3, "Ручной блендер", 1, "Сковорода - гриль", 1, "Сковорода + крышка", 1, "Сковорода", 1, "Сковорода + крышка", 1, "Соковыжималка", 1, "Стационарный блендер", 1, "Стиральная машина", 3, "Стиральная машина П/А", 3, "Стиральная машина с сушкой", 3, "Тепловая пушка", 3, "Тепловентилятор", 3, "Тепловоздушная завеса", 3, "Термопот", 1, "Тостер", 1, "Триммер для бороды", 2, "Триммер для волос", 2, "Триммер для носа", 2, "Увлажнитель воздуха", 1, "Утюг", 1, "Фен", 1, "Фен плойка", 1, "Холодильник", 3, "Чайник", 1, "Швейная машина", 1, "Шкаф витрина", 3, "Эл. зубная щётка", 0, "Электрическая сушка", 0, "Электрический камин", 3, "Электробритва", 2, "Электровафельница", 1, "Электропечь", 1, "Электрочайник", 1, "Электрощипцы", 1, "Эпилятор", 2];
function indexof_size(type){
	const sizes = [
	    "МБО",    "#4caf50",
	    "70x42",  "#e91e63",
	    "105x75", "#ffc107", 
	    "A6",     "#ff5722"];
	const types_unknown = "неизвестный";
	let x = types.indexOf(type);
	let sz;
	let cl; 
	if (x != ~0) {
		// x * width + y = формула двухмерной индексаций (преобразует двумерную точку в одномерную)
		x = types[x+1]
	    sz = sizes[x*2];
		cl = sizes[x*2+1];
	}
	else {
		sz = types_unknown; 
		cl = "inherit";
	}
	
	return { size: sz, color: cl};
}
function find_class_heuristic(docObject=document) {
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
function avail(e = !0, docObject=document) {
    let l,
    t,
    n = docObject.getElementsByClassName("R2C1"),
    s = docObject.getElementsByClassName("R3"),
    o = docObject.getElementsByClassName("R1C1");
    if (e) {
        let e = find_class_heuristic(docObject);
        l = e.discount_class,
        t = e.count_class
		console.log("discount class: " + l + ", count class: " + t);
	}
	else
	{
		console.error("failing find classes. Break point");
		return null;  
	}
	
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
    return {
        changed: t,
        addedNew: n,
        prevRemoved: s
    }
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
