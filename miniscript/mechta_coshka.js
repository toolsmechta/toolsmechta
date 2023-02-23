function evaluate_number(e) {
    let l = "";
    for (let t = 0; t < e.length; ++t)
        e[t] >= "0" && e[t] <= "9" && (l += e[t]);
    return parseInt(l, 10)
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
