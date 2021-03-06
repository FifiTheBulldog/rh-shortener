const http = require("http");

const { readFileSync } = require('fs');
const indexPage = readFileSync("./index.html");
const errorPage = readFileSync("./404.html");

const pages = {
    b: "blog",
    c: "changelog",
    h: "",
    k: "cookies",
    l: "login",
    m: "membership",
    p: "privacy",
    q: "faq",
    r: "register",
    t: "terms"
}

function redirect(res, url, other) {
    if (!other) {
        url = "https://routinehub.co/" + url;
    }
    
    res.writeHead(301, {
        Location: url
    });
    res.end();
}

http.createServer((req, res) => {
    const pathname = req.url;
    const type = pathname.charAt(1);
    const itemValue = pathname.substr(2);

    switch (type) {
        case "u":
            redirect(res, "user/" + itemValue);
            break;
        case "s":
            let after = itemValue;
            if (itemValue.charAt(itemValue.length - 1) === "c") {
                after = itemValue.slice(0, -1) + "/changelog";
            }
            redirect(res, "shortcut/" + after)
            break;
        case "f":
            redirect(res, "https://feedback.routinehub.co", true);
            break;
        case "":
            res.end(indexPage);
            break;
        default:
            const rhPath = pages[type];
            if (rhPath === undefined) {
                res.statusCode = 404;
                res.end(errorPage);
            } else {
                redirect(res, rhPath);
            }
    }
}).listen(process.env.PORT || 3000);