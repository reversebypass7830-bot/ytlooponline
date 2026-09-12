(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 32781, e => {
    "use strict";
    var t = e.i(58379);
    e.s(["Loader2", () => t.default])
}, 28959, e => {
    "use strict";
    var t = e.i(43476),
        s = e.i(15504),
        i = e.i(18566),
        r = e.i(32781),
        a = e.i(50854);
    e.s(["GuestOnlyRoute", 0, function({
        children: e
    }) {
        let c = (0, i.useRouter)(),
            [u, n] = (0, s.useState)(!1),
            [l, o] = (0, s.useState)(!1);
        return ((0, s.useEffect)(() => {
            a.default.authService.isAuthenticated().then(o).catch(e => {
                console.error(e)
            }).finally(() => n(!0))
        }, []), (0, s.useEffect)(() => {
            u && l && c.replace("/")
        }, [u, l, c]), !u || l) ? (0, t.jsx)("div", {
            className: "flex h-screen items-center justify-center",
            children: (0, t.jsx)(r.Loader2, {
                className: "size-6 animate-spin text-primary"
            })
        }) : (0, t.jsx)(t.Fragment, {
            children: e
        })
    }])
}]);