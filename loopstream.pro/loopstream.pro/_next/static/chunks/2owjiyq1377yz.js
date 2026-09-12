(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 51437, e => {
    "use strict";
    e.i(47167);
    var t = e.i(15504);
    e.s(["useControlled", 0, function({
        controlled: e,
        default: r,
        name: a,
        state: i = "value"
    }) {
        let {
            current: n
        } = t.useRef(void 0 !== e), [s, l] = t.useState(r), o = t.useCallback(e => {
            n || l(e)
        }, []);
        return [n ? e : s, o]
    }])
}, 91476, e => {
    "use strict";
    let {
        Axios: t,
        AxiosError: r,
        CanceledError: a,
        isCancel: i,
        CancelToken: n,
        VERSION: s,
        all: l,
        Cancel: o,
        isAxiosError: c,
        spread: d,
        toFormData: u,
        AxiosHeaders: p,
        HttpStatusCode: m,
        formToJSON: x,
        getAdapter: h,
        mergeConfig: g,
        create: b
    } = e.i(81949).default;
    e.s(["isAxiosError", 0, c])
}, 93698, 43957, e => {
    "use strict";
    let t = (0, e.i(56420).default)("check", [
        ["path", {
            d: "M20 6 9 17l-5-5",
            key: "1gmf2c"
        }]
    ]);
    e.s(["default", 0, t], 43957), e.s(["CheckIcon", 0, t], 93698)
}, 64742, 89664, 67239, e => {
    "use strict";
    var t = e.i(43476),
        r = e.i(15504),
        a = e.i(18566),
        i = e.i(56420);
    let n = (0, i.default)("activity", [
            ["path", {
                d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
                key: "169zse"
            }]
        ]),
        s = (0, i.default)("award", [
            ["path", {
                d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
                key: "1yiouv"
            }],
            ["circle", {
                cx: "12",
                cy: "8",
                r: "6",
                key: "1vp47v"
            }]
        ]);
    var l = e.i(43957);
    e.s(["Check", () => l.default], 89664);
    var l = l;
    let o = (0, i.default)("database", [
        ["ellipse", {
            cx: "12",
            cy: "5",
            rx: "9",
            ry: "3",
            key: "msslwz"
        }],
        ["path", {
            d: "M3 5V19A9 3 0 0 0 21 19V5",
            key: "1wlel7"
        }],
        ["path", {
            d: "M3 12A9 3 0 0 0 21 12",
            key: "mv7ke4"
        }]
    ]);
    var c = e.i(15331);
    let d = (0, i.default)("target", [
        ["circle", {
            cx: "12",
            cy: "12",
            r: "10",
            key: "1mglay"
        }],
        ["circle", {
            cx: "12",
            cy: "12",
            r: "6",
            key: "1vlfrh"
        }],
        ["circle", {
            cx: "12",
            cy: "12",
            r: "2",
            key: "1c9p78"
        }]
    ]);
    var u = e.i(52838),
        p = e.i(87486),
        m = e.i(19455),
        x = e.i(46798),
        h = e.i(22016),
        g = e.i(91476),
        b = e.i(46696),
        f = e.i(76639),
        v = e.i(93479),
        y = e.i(57428),
        _ = e.i(10204),
        k = e.i(67489),
        j = e.i(75157),
        w = e.i(50854);
    let C = ["YouTube", "Facebook", "Instagram", "Twitch", "Kick"],
        N = ["Music / Lo-Fi", "Devotional", "Study / Ambient", "Podcasts / Talk", "Gaming", "Education", "Other"],
        S = [{
            value: "<5",
            label: "< 5 hrs/week"
        }, {
            value: "5–20",
            label: "5–20 hrs/week"
        }, {
            value: "20–60",
            label: "20–60 hrs/week"
        }, {
            value: ">60",
            label: "60+ hrs/week"
        }],
        I = ["Creator", "Channel Manager", "Agency", "Developer / Integrator"];

    function D(e, t) {
        let r = new Set(e);
        return r.has(t) ? r.delete(t) : r.add(t), Array.from(r)
    }

    function T({
        label: e,
        checked: r,
        onChange: a
    }) {
        return (0, t.jsxs)(_.Label, {
            className: "inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-2.5 py-1.5 text-xs font-normal",
            children: [(0, t.jsx)(y.Checkbox, {
                checked: r,
                onCheckedChange: a
            }), e]
        })
    }

    function F({
        open: e,
        onOpenChange: a,
        category: i
    }) {
        let [n, s] = (0, r.useState)(1), [l, o] = (0, r.useState)(""), [c, d] = (0, r.useState)(!1), [u, p] = (0, r.useState)(!1), [x, P] = (0, r.useState)(null), [A, R] = (0, r.useState)([]), [L, B] = (0, r.useState)([]), [E, M] = (0, r.useState)(""), [q, O] = (0, r.useState)(""), [W, V] = (0, r.useState)(""), [$, z] = (0, r.useState)(""), [K, G] = (0, r.useState)(!1), [U, Y] = (0, r.useState)(!1), [H, J] = (0, r.useState)(!1), [Q, X] = (0, r.useState)(!1), [Z, ee] = (0, r.useState)(e);
        e !== Z && (ee(e), e && (s(1), o(""), d(!1), p(!1), P(null), R([]), B([]), M(""), O(""), V(""), z(""), G(!1), Y(!1), J(!1), X(!1)));
        let et = (0, r.useMemo)(() => L.includes("Other"), [L]);
        async function er(e) {
            e.preventDefault();
            let t = A.length > 0,
                r = L.length > 0,
                n = !!q;
            if (G(!t), Y(!r), J(!n), t && r && n) try {
                X(!0), await w.default.waitlistService.addToProductWaitlist({
                    email: l,
                    consentTerms: c,
                    consentMarketing: u || void 0,
                    platforms: A,
                    content: L,
                    contentOther: et && E ? E : void 0,
                    hours: q,
                    role: W || void 0,
                    project: $ || void 0
                }, i), b.toast.success("Success! You're now on the waitlist"), a(!1)
            } catch (t) {
                let e = (0, g.isAxiosError)(t) ? t.response ? .data ? .error ? .[0] : void 0;
                b.toast.error(e || "Something went wrong. Please try again!")
            } finally {
                X(!1)
            }
        }
        return (0, t.jsx)(f.Dialog, {
            open: e,
            onOpenChange: a,
            children: (0, t.jsxs)(f.DialogContent, {
                className: "max-h-[80vh] overflow-y-auto sm:max-w-[560px]",
                children: [(0, t.jsx)(f.DialogHeader, {
                    children: (0, t.jsx)(f.DialogTitle, {
                        children: "Join the Loop Stream Beta Waitlist"
                    })
                }), (0, t.jsxs)("div", {
                    className: "-mt-2 flex items-center gap-2 text-muted-foreground",
                    children: [(0, t.jsx)("span", {
                        className: (0, j.cn)("size-1.5 rounded-full", 1 === n ? "bg-primary" : "bg-muted-foreground/40")
                    }), (0, t.jsx)("span", {
                        className: (0, j.cn)("size-1.5 rounded-full", 2 === n ? "bg-primary" : "bg-muted-foreground/40")
                    }), (0, t.jsxs)("span", {
                        className: "text-xs",
                        children: ["Step ", n, " of 2"]
                    })]
                }), (0, t.jsxs)("form", {
                    onSubmit: er,
                    className: "flex flex-col gap-4",
                    children: [1 === n && (0, t.jsxs)("div", {
                        className: "flex flex-col gap-4",
                        children: [(0, t.jsxs)("div", {
                            className: "flex flex-col gap-1.5",
                            children: [(0, t.jsx)(_.Label, {
                                htmlFor: "waitlist-email",
                                children: "Work email"
                            }), (0, t.jsx)(v.Input, {
                                id: "waitlist-email",
                                type: "email",
                                required: !0,
                                value: l,
                                onChange: e => o(e.target.value),
                                "aria-invalid": !!x
                            }), x && (0, t.jsx)("p", {
                                className: "text-xs text-destructive",
                                children: x
                            })]
                        }), (0, t.jsxs)("div", {
                            className: "flex flex-col gap-3",
                            children: [(0, t.jsxs)(_.Label, {
                                className: "flex items-start gap-2 font-normal",
                                children: [(0, t.jsx)(y.Checkbox, {
                                    checked: c,
                                    onCheckedChange: d
                                }), (0, t.jsxs)("span", {
                                    className: "text-sm",
                                    children: ["I agree to the", " ", (0, t.jsx)(h.default, {
                                        href: "/terms-of-use",
                                        target: "_blank",
                                        rel: "noopener",
                                        className: "underline",
                                        children: "Terms"
                                    }), " ", "and", " ", (0, t.jsx)(h.default, {
                                        href: "/privacy-policy",
                                        target: "_blank",
                                        rel: "noopener",
                                        className: "underline",
                                        children: "Privacy Policy"
                                    }), "."]
                                })]
                            }), (0, t.jsxs)(_.Label, {
                                className: "flex items-start gap-2 font-normal",
                                children: [(0, t.jsx)(y.Checkbox, {
                                    checked: u,
                                    onCheckedChange: p
                                }), (0, t.jsx)("span", {
                                    className: "text-sm",
                                    children: "Send me product updates, tips, and beta invites. (Optional)"
                                })]
                            })]
                        }), (0, t.jsx)(m.Button, {
                            type: "button",
                            onClick: function() {
                                let e = l && /.+@.+\..+/.test(l);
                                P(e ? null : "Please enter a valid email."), e && c && s(2)
                            },
                            children: "Continue"
                        }), (0, t.jsx)("p", {
                            className: "text-xs text-muted-foreground",
                            children: "Limited beta. You’ll start with a short premium trial or free credits when invited."
                        })]
                    }), 2 === n && (0, t.jsxs)("div", {
                        className: "flex flex-col gap-4",
                        children: [(0, t.jsxs)("div", {
                            children: [(0, t.jsx)(_.Label, {
                                className: "mb-1.5 block text-xs",
                                children: "Primary platform(s) *"
                            }), (0, t.jsx)("div", {
                                className: "flex flex-wrap gap-2 rounded-[10px] border border-white/10 bg-[#1a0e29] p-2.5",
                                children: C.map(e => (0, t.jsx)(T, {
                                    label: e,
                                    checked: A.includes(e),
                                    onChange: () => R(t => D(t, e))
                                }, e))
                            }), K && (0, t.jsx)("p", {
                                className: "mt-1.5 text-xs text-destructive",
                                children: "Pick at least one platform."
                            })]
                        }), (0, t.jsxs)("div", {
                            children: [(0, t.jsx)(_.Label, {
                                className: "mb-1.5 block text-xs",
                                children: "What will you stream? *"
                            }), (0, t.jsx)("div", {
                                className: "flex flex-wrap gap-2 rounded-[10px] border border-white/10 bg-[#1a0e29] p-2.5",
                                children: N.map(e => (0, t.jsx)(T, {
                                    label: e,
                                    checked: L.includes(e),
                                    onChange: () => B(t => D(t, e))
                                }, e))
                            }), et && (0, t.jsx)(v.Input, {
                                className: "mt-2.5",
                                placeholder: "e.g., meditation, nature cams",
                                value: E,
                                onChange: e => M(e.target.value)
                            }), U && (0, t.jsx)("p", {
                                className: "mt-1.5 text-xs text-destructive",
                                children: "Choose at least one category."
                            })]
                        }), (0, t.jsxs)("div", {
                            className: "flex gap-3",
                            children: [(0, t.jsxs)("div", {
                                className: "flex-1",
                                children: [(0, t.jsx)(_.Label, {
                                    className: "mb-1.5 block text-xs",
                                    children: "Expected streaming volume *"
                                }), (0, t.jsxs)(k.Select, {
                                    value: q,
                                    onValueChange: e => O(e ? ? ""),
                                    children: [(0, t.jsx)(k.SelectTrigger, {
                                        className: "w-full",
                                        children: (0, t.jsx)(k.SelectValue, {
                                            placeholder: "Select one"
                                        })
                                    }), (0, t.jsx)(k.SelectContent, {
                                        children: S.map(e => (0, t.jsx)(k.SelectItem, {
                                            value: e.value,
                                            children: e.label
                                        }, e.value))
                                    })]
                                }), H && (0, t.jsx)("p", {
                                    className: "mt-1.5 text-xs text-destructive",
                                    children: "Select expected hours."
                                })]
                            }), (0, t.jsxs)("div", {
                                className: "flex-1",
                                children: [(0, t.jsx)(_.Label, {
                                    className: "mb-1.5 block text-xs",
                                    children: "Role (optional)"
                                }), (0, t.jsxs)(k.Select, {
                                    value: W,
                                    onValueChange: e => V(e ? ? ""),
                                    children: [(0, t.jsx)(k.SelectTrigger, {
                                        className: "w-full",
                                        children: (0, t.jsx)(k.SelectValue, {
                                            placeholder: "—"
                                        })
                                    }), (0, t.jsx)(k.SelectContent, {
                                        children: I.map(e => (0, t.jsx)(k.SelectItem, {
                                            value: e,
                                            children: e
                                        }, e))
                                    })]
                                })]
                            })]
                        }), (0, t.jsxs)("div", {
                            children: [(0, t.jsx)(_.Label, {
                                className: "mb-1.5 block text-xs",
                                children: "Channel / Project (optional)"
                            }), (0, t.jsx)(v.Input, {
                                placeholder: "e.g., Chill Lofi Radio",
                                value: $,
                                onChange: e => z(e.target.value)
                            })]
                        }), (0, t.jsxs)("div", {
                            className: "flex gap-2.5",
                            children: [(0, t.jsx)(m.Button, {
                                type: "button",
                                variant: "outline",
                                onClick: () => s(1),
                                children: "Back"
                            }), (0, t.jsx)(m.Button, {
                                type: "submit",
                                disabled: Q,
                                className: "flex-1",
                                children: Q ? "Submitting…" : "Join Waitlist"
                            })]
                        }), (0, t.jsx)("p", {
                            className: "text-xs text-muted-foreground",
                            children: "We use these answers only to prioritize a good beta fit. You can opt out any time."
                        })]
                    })]
                })]
            })
        })
    }
    e.s(["WaitlistDialog", 0, F], 67239);
    var P = e.i(35872);
    let A = {
            streaming: c.Radio,
            quality: n,
            storage: o
        },
        R = {
            badgeLabel: "FREE TRIAL",
            badgeClass: "border border-[rgba(0,255,136,0.35)] bg-[rgba(0,255,136,0.12)] text-[#00FF88] shadow-[0_0_16px_rgba(0,255,136,0.22)]",
            badgeDotClass: "bg-[#00FF88] shadow-[0_0_6px_#00FF88]",
            cardBorder: "rgba(0,255,136,0.25)",
            priceColor: "#00FF88",
            priceGlow: "animate-[price-glow-green_3.5s_ease-in-out_infinite]",
            buttonClass: "border border-[rgba(0,255,136,0.4)] text-[#00FF88] hover:bg-[rgba(0,255,136,0.09)]"
        },
        L = {
            badgeLabel: "PREMIUM",
            badgeClass: "border-transparent bg-gradient-to-r from-primary to-[#A725F8] text-white shadow-[0_4px_18px_color-mix(in_srgb,var(--primary)_45%,transparent)]",
            badgeDotClass: "bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]",
            cardBorder: "var(--primary)",
            priceColor: "var(--primary)",
            priceGlow: "animate-[price-glow-pink_3.5s_ease-in-out_infinite]",
            buttonClass: "bg-gradient-to-br from-primary to-[#ff4d8e] text-white shadow-[0_8px_28px_color-mix(in_srgb,var(--primary)_35%,transparent)] hover:shadow-[0_14px_38px_color-mix(in_srgb,var(--primary)_50%,transparent)] hover:-translate-y-0.5"
        },
        B = {
            badgeLabel: "COMING SOON",
            badgeClass: "border border-[rgba(167,37,248,0.4)] bg-[rgba(167,37,248,0.14)] text-[#C77DFF] shadow-[0_0_16px_rgba(167,37,248,0.2)]",
            badgeDotClass: "bg-[#C77DFF] shadow-[0_0_6px_#A725F8]",
            cardBorder: "rgba(167,37,248,0.25)",
            priceColor: "#8D8D94",
            priceGlow: "",
            buttonClass: "border border-[rgba(167,37,248,0.4)] text-[#A725F8] hover:bg-[rgba(167,37,248,0.09)]"
        },
        E = {
            badgeLabel: "STANDARD",
            badgeClass: "border border-[color-mix(in_srgb,var(--primary)_35%,transparent)] bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] text-primary shadow-[0_0_16px_color-mix(in_srgb,var(--primary)_18%,transparent)]",
            badgeDotClass: "bg-primary shadow-[0_0_6px_var(--primary)]",
            cardBorder: "color-mix(in srgb, var(--primary) 22%, transparent)",
            priceColor: "var(--primary)",
            priceGlow: "animate-[price-glow-pink_3.5s_ease-in-out_infinite]",
            buttonClass: "border border-[color-mix(in_srgb,var(--primary)_40%,transparent)] text-primary hover:bg-[color-mix(in_srgb,var(--primary)_9%,transparent)]"
        };
    e.s(["PlanCard", 0, function({
        product: e,
        currency: i,
        periodValue: n,
        hasUserUsedFreeTrial: o = !1,
        freeTrialActive: c = !0,
        onChoosePlan: h
    }) {
        let g = (0, a.useRouter)(),
            [b, f] = (0, r.useState)(1),
            [v, y] = (0, r.useState)(!1),
            _ = e.category[1] === u.GlobalConstants.ProductStreamCategory.s_1080f,
            k = e.category.includes(u.GlobalConstants.ProductStreamCategory.s_4k),
            w = e.category[1] === u.GlobalConstants.ProductStreamCategory.s_1080p,
            C = _ && !c,
            N = _ && c && o,
            S = k ? B : _ ? R : w ? L : E,
            I = e.prices.find(e => e.currency === i),
            {
                tiles: D,
                checklist: T,
                bestFor: M
            } = function(e) {
                let t = [],
                    r = [],
                    a = null;
                for (let i of e) /^for /i.test(i.featureName) ? a = i.featureName.replace("For ", "") : /broadcast quality/i.test(i.featureName) ? t.push({ ...i,
                    kind: "quality"
                }) : /storage/i.test(i.featureName) ? t.push({ ...i,
                    kind: "storage"
                }) : /stream/i.test(i.featureName) ? t.push({ ...i,
                    kind: "streaming"
                }) : r.push(i);
                return {
                    tiles: t,
                    checklist: r,
                    bestFor: a
                }
            }(e.metadata),
            q = _ || k ? 1 : b * n,
            O = I ? I.amount / 100 * q : 0,
            W = I ? I.originalAmount / 100 * q : 0,
            V = I ? .discount ? Math.round(100 * I.discount) : 0,
            $ = "INR" === i ? "₹" : "$";
        return (0, t.jsxs)("div", {
            className: (0, j.cn)("group relative flex w-full min-w-[280px] flex-1 flex-col rounded-[18px] border p-[30px] transition-transform duration-300 will-change-transform before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[18px] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100", k && "opacity-[0.88]", w && "z-10 shadow-[0_0_50px_color-mix(in_srgb,var(--primary)_20%,transparent),inset_0_0_60px_color-mix(in_srgb,var(--primary)_3%,transparent)] hover:-translate-y-2 before:shadow-[0_24px_60px_color-mix(in_srgb,var(--primary)_25%,transparent),inset_0_0_60px_color-mix(in_srgb,var(--primary)_4%,transparent)] md:-my-6 md:pt-10", _ && "hover:-translate-y-2 before:shadow-[0_24px_60px_rgba(0,255,136,0.08)]", k && "hover:-translate-y-2 before:shadow-[0_24px_60px_rgba(167,37,248,0.12)]", !_ && !w && !k && "hover:-translate-y-2 before:shadow-[0_24px_60px_color-mix(in_srgb,var(--primary)_12%,transparent)]"),
            style: {
                backgroundColor: "var(--card)",
                borderColor: S.cardBorder
            },
            children: [w && (0, t.jsxs)(p.Badge, {
                className: "absolute -top-5 left-1/2 h-auto -translate-x-1/2 gap-1.5 bg-gradient-to-br from-primary to-[#A725F8] px-4 py-1.5 font-mono font-bold tracking-[0.06em] whitespace-nowrap text-white shadow-[0_6px_18px_rgba(255,27,114,0.5)]",
                children: [(0, t.jsx)(s, {
                    className: "size-4"
                }), "Most Popular"]
            }), (0, t.jsx)("h3", {
                className: (0, j.cn)("mb-[3px] text-xl font-bold text-white", w && "mt-3"),
                children: e.name
            }), (0, t.jsx)("p", {
                className: "mb-[15px] text-sm text-[#8D8D94]",
                children: k ? "Ultra-sharp. Broadcasting-grade." : e.longDescription
            }), (0, t.jsxs)(p.Badge, {
                className: (0, j.cn)("mb-[15px] h-auto self-start gap-1.5 px-3 py-1 font-mono text-[0.7rem] font-bold tracking-[0.12em] uppercase backdrop-blur-sm", S.badgeClass),
                children: [(0, t.jsx)("span", {
                    className: (0, j.cn)("size-1.5 rounded-full", S.badgeDotClass)
                }), S.badgeLabel]
            }), k ? (0, t.jsxs)("div", {
                className: "mb-[14px]",
                children: [(0, t.jsx)("p", {
                    className: "font-mono text-2xl leading-none font-bold text-[#8D8D94]",
                    children: "Join Waitlist"
                }), (0, t.jsx)("p", {
                    className: "mt-1.5 text-sm text-[#8D8D94]",
                    children: "Priority access when 4K launches"
                })]
            }) : (0, t.jsxs)("div", {
                className: "mb-1.5 flex items-start gap-2.5",
                children: [(0, t.jsxs)("div", {
                    className: "min-w-0 flex-1",
                    children: [V > 0 && (0, t.jsxs)("p", {
                        className: "mb-0.5 text-[#8D8D94] line-through",
                        children: [$, W.toLocaleString()]
                    }), (0, t.jsxs)("p", {
                        className: (0, j.cn)("text-4xl leading-none font-bold", S.priceGlow),
                        style: {
                            color: S.priceColor
                        },
                        children: [$, O.toLocaleString()]
                    }), (0, t.jsx)("p", {
                        className: "mt-1.5 mb-[14px] text-sm text-[#8D8D94]",
                        children: _ ? "/24 hours" : "/stream"
                    })]
                }), V > 0 && !_ && (0, t.jsxs)("div", {
                    className: (0, j.cn)("relative mt-0.5 flex min-h-[50px] w-[54px] shrink-0 rotate-[4deg] flex-col items-center justify-center rounded-[7px_7px_7px_0] shadow-[2px_4px_18px_color-mix(in_srgb,var(--primary)_55%,transparent)] after:absolute after:-bottom-[7px] after:left-0 after:border-r-[7px] after:border-t-[7px] after:border-r-transparent", w ? "bg-[linear-gradient(150deg,var(--primary),#A725F8)] after:border-t-[#A725F8]" : "bg-[linear-gradient(150deg,var(--primary),#C41563)] after:border-t-[#C41563]"),
                    children: [(0, t.jsxs)("span", {
                        className: "mt-1 font-mono text-[17px] leading-tight font-bold text-white",
                        children: [V, "%"]
                    }), (0, t.jsx)("span", {
                        className: "text-[10px] font-bold tracking-[0.12em] text-white/90",
                        children: "OFF"
                    })]
                })]
            }), (0, t.jsxs)("div", {
                className: "flex-1",
                children: [D.length > 0 && (0, t.jsx)("div", {
                    className: "mb-[18px] grid gap-2",
                    style: {
                        gridTemplateColumns: `repeat(${D.length}, 1fr)`
                    },
                    children: D.map(e => {
                        let r = A[e.kind];
                        return (0, t.jsxs)("div", {
                            className: "flex min-h-[74px] flex-col items-center justify-center gap-1.5 rounded-[10px] bg-white/[0.06] px-1.5 py-3 text-center",
                            children: [(0, t.jsx)(r, {
                                className: "size-[17px] text-primary",
                                strokeWidth: 1.8
                            }), (0, t.jsx)("span", {
                                className: "text-[10.5px] leading-[1.4] font-bold tracking-[0.01em] text-white",
                                children: e.featureName
                            })]
                        }, e.featureName)
                    })
                }), T.length > 0 && (0, t.jsx)("ul", {
                    className: "mb-4 grid list-none grid-cols-2 gap-x-3 gap-y-[9px]",
                    children: T.map(e => (0, t.jsxs)("li", {
                        className: "flex items-start gap-[7px] text-[12.5px] leading-[1.4] tracking-[0.01em] text-[#D9D9DF]",
                        children: [(0, t.jsx)(l.default, {
                            className: "mt-[3px] size-3 shrink-0 text-primary",
                            strokeWidth: 2.5
                        }), e.tooltips ? (0, t.jsxs)(x.Tooltip, {
                            children: [(0, t.jsx)(x.TooltipTrigger, {
                                render: (0, t.jsx)("span", {}),
                                children: e.featureName
                            }), (0, t.jsx)(x.TooltipContent, {
                                children: e.tooltips
                            })]
                        }) : (0, t.jsx)("span", {
                            children: e.featureName
                        })]
                    }, e.featureName))
                }), M && (0, t.jsxs)("div", {
                    className: "mb-4 flex items-start gap-[9px] rounded-lg border-l-[3px] border-primary bg-[color-mix(in_srgb,var(--primary)_9%,transparent)] px-[13px] py-[11px]",
                    children: [(0, t.jsx)(d, {
                        className: "mt-px size-[17px] shrink-0 text-primary",
                        strokeWidth: 1.8
                    }), (0, t.jsxs)("p", {
                        className: "text-[12.5px] leading-[1.45]",
                        children: [(0, t.jsx)("span", {
                            className: "mb-0.5 block text-[10.5px] font-extrabold tracking-[0.05em] text-primary uppercase",
                            children: "Best For"
                        }), (0, t.jsx)("span", {
                            className: "font-semibold text-foreground",
                            children: M
                        })]
                    })]
                })]
            }), _ && (0, t.jsx)("p", {
                className: "mb-3 text-center text-xs text-[#8D8D94]",
                children: o ? "You have already used your free trial" : c ? "No card required" : "Due to excessive demand free trial is currently unavailable"
            }), !_ && !k && (0, t.jsxs)("div", {
                className: "mb-[13px] flex items-center gap-2.5",
                children: [(0, t.jsx)("span", {
                    className: "flex-1 text-xs text-[#8D8D94]",
                    children: "Stream count"
                }), (0, t.jsxs)("div", {
                    className: "flex items-center gap-2",
                    children: [(0, t.jsx)("button", {
                        type: "button",
                        onClick: () => f(e => Math.max(1, e - 1)),
                        "aria-label": "Decrease",
                        className: "flex h-7 w-7 items-center justify-center rounded-md border border-[color-mix(in_srgb,var(--primary)_30%,transparent)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-lg text-primary transition-colors hover:bg-[color-mix(in_srgb,var(--primary)_22%,transparent)]",
                        children: "−"
                    }), (0, t.jsx)("span", {
                        className: "min-w-[22px] text-center font-mono text-white",
                        children: b
                    }), (0, t.jsx)("button", {
                        type: "button",
                        onClick: () => f(e => Math.min(10, e + 1)),
                        "aria-label": "Increase",
                        className: "flex h-7 w-7 items-center justify-center rounded-md border border-[color-mix(in_srgb,var(--primary)_30%,transparent)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-primary transition-colors hover:bg-[color-mix(in_srgb,var(--primary)_22%,transparent)]",
                        children: "+"
                    })]
                })]
            }), k ? (0, t.jsxs)(t.Fragment, {
                children: [(0, t.jsx)(m.Button, {
                    type: "button",
                    onClick: () => y(!0),
                    className: (0, j.cn)("mt-auto bg-transparent text-[0.95rem] font-bold tracking-[0.02em]", S.buttonClass),
                    children: "Join Wait List"
                }), (0, t.jsx)(F, {
                    open: v,
                    onOpenChange: y,
                    category: e.category.join(",")
                })]
            }) : C ? null : N ? (0, t.jsxs)(x.Tooltip, {
                children: [(0, t.jsx)(x.TooltipTrigger, {
                    render: (0, t.jsx)("span", {}),
                    className: (0, j.cn)((0, m.buttonVariants)({}), "mt-auto w-full cursor-not-allowed border-white/10 bg-transparent text-[0.95rem] font-bold tracking-[0.02em] text-[#8D8D94] opacity-60"),
                    children: "Apply Free Trial"
                }), (0, t.jsx)(x.TooltipContent, {
                    children: "You have already used your free trial"
                })]
            }) : (0, t.jsx)(m.Button, {
                type: "button",
                onClick: () => h && !_ ? h(e, b) : (0, P.goToCheckout)(e, b, n, g),
                className: (0, j.cn)("mt-auto text-[0.95rem] font-bold tracking-[0.02em]", w ? S.buttonClass : (0, j.cn)("bg-transparent", S.buttonClass)),
                children: _ ? "Apply Free Trial" : "Choose Plan"
            })]
        })
    }], 64742)
}, 57428, e => {
    "use strict";
    var t, r = e.i(43476);
    e.s([], 92299), e.i(92299);
    var a = e.i(15504),
        i = e.i(56789),
        n = e.i(51437),
        s = e.i(46376),
        l = e.i(28918),
        o = e.i(88940),
        c = e.i(2077),
        d = e.i(33848);
    let u = ((t = {}).checked = "data-checked", t.unchecked = "data-unchecked", t.indeterminate = "data-indeterminate", t.disabled = "data-disabled", t.readonly = "data-readonly", t.required = "data-required", t.valid = "data-valid", t.invalid = "data-invalid", t.touched = "data-touched", t.dirty = "data-dirty", t.filled = "data-filled", t.focused = "data-focused", t);
    var p = e.i(75812);

    function m(e) {
        return a.useMemo(() => ({
            checked: t => e.indeterminate ? {} : t ? {
                [u.checked]: ""
            } : {
                [u.unchecked]: ""
            },
            ...p.fieldValidityMapping
        }), [e.indeterminate])
    }
    var x = e.i(52245),
        h = e.i(88015),
        g = e.i(76782),
        b = e.i(40886),
        f = e.i(69690),
        v = e.i(81104),
        y = e.i(57153),
        _ = e.i(84708),
        k = e.i(47778),
        j = e.i(74854),
        w = e.i(33332);
    let C = a.createContext(void 0);
    var N = e.i(75606),
        S = e.i(56434),
        I = e.i(6039);
    let D = a.forwardRef(function(e, t) {
        let {
            checked: u,
            className: p,
            defaultChecked: w = !1,
            "aria-labelledby": D,
            disabled: T = !1,
            form: F,
            id: P,
            indeterminate: A = !1,
            inputRef: R,
            name: L,
            onCheckedChange: B,
            parent: E = !1,
            readOnly: M = !1,
            render: q,
            required: O = !1,
            uncheckedValue: W,
            value: V,
            nativeButton: $ = !1,
            style: z,
            ...K
        } = e, {
            clearErrors: G
        } = (0, _.useFormContext)(), {
            disabled: U,
            name: Y,
            setDirty: H,
            setFilled: J,
            setFocused: Q,
            setTouched: X,
            state: Z,
            validationMode: ee,
            validityData: et,
            validation: er
        } = (0, f.useFieldRootContext)(), ea = (0, y.useFieldItemContext)(), {
            labelId: ei,
            controlId: en,
            registerControlId: es,
            getDescriptionProps: el
        } = (0, k.useLabelableContext)(), eo = (0, j.useCheckboxGroupContext)(), ec = eo ? .parent, ed = ec && eo.allValues, eu = U || ea.disabled || eo ? .disabled || T, ep = Y ? ? L, em = V ? ? ep, ex = (0, h.useBaseUiId)(), eh = (0, h.useBaseUiId)(), eg = en;
        ed ? eg = E ? eh : `${ec.id}-${em}` : P && (eg = P);
        let eb = {};
        ed && (E ? eb = eo.parent.getParentProps() : em && (eb = eo.parent.getChildProps(em)));
        let {
            checked: ef = u,
            indeterminate: ev = A,
            onCheckedChange: ey,
            ...e_
        } = eb, ek = eo ? .value, ej = eo ? .setValue, ew = eo ? .defaultValue, eC = a.useRef(null), eN = (0, o.useRefWithInit)(() => Symbol("checkbox-control")), eS = a.useRef(!1), {
            getButtonProps: eI,
            buttonRef: eD
        } = (0, b.useButton)({
            disabled: eu,
            native: $
        }), eT = eo ? .validation ? ? er, [eF, eP] = (0, n.useControlled)({
            controlled: em && ek && !E ? ek.includes(em) : ef,
            default: em && ew && !E ? ew.includes(em) : w,
            name: "Checkbox",
            state: "checked"
        }), eA = ed ? !!ef : eF, eR = ed && ev || A;
        (0, s.useIsoLayoutEffect)(() => {
            es !== i.NOOP && (eS.current = !0, es(eN.current, eg))
        }, [eg, es, eN]), a.useEffect(() => {
            let e = eN.current;
            return () => {
                eS.current && es !== i.NOOP && (eS.current = !1, es(e, void 0))
            }
        }, [es, eN]), (0, v.useRegisterFieldControl)(eC, ex, eF, void 0, !eo && !eu, L);
        let eL = a.useRef(null),
            eB = (0, l.useMergedRefs)(R, eL, eT.inputRef, eT.registerInput),
            eE = function(e, t, r, i = !0, n) {
                let [l, o] = a.useState(), c = (0, h.useBaseUiId)(n ? `${n}-label` : void 0), d = e ? ? t ? ? l;
                return (0, s.useIsoLayoutEffect)(() => {
                    let a = e || t || !i ? void 0 : function(e, t) {
                        let r = function(e) {
                            if (!e) return;
                            let t = e.parentElement;
                            if (t && "LABEL" === t.tagName) return t;
                            let r = e.id;
                            if (r) {
                                let t = e.nextElementSibling;
                                if (t && t.htmlFor === r) return t
                            }
                            let a = e.labels;
                            return a && a[0]
                        }(e);
                        if (r) return !r.id && t && (r.id = t), r.id || void 0
                    }(r.current, c);
                    l !== a && o(a)
                }), d
            }(D, ei, eL, !$, eg ? ? void 0);
        (0, s.useIsoLayoutEffect)(() => {
            eL.current && (eL.current.indeterminate = eR, eF && J(!0))
        }, [eF, eR, J]), (0, I.useValueChanged)(eF, () => {
            eo || (G(ep), J(eF), H(eF !== et.initialValue), eT.change(eF))
        });
        let eM = (0, g.mergeProps)({
            checked: eF,
            disabled: eu,
            form: F,
            name: E ? void 0 : ep,
            id: $ ? void 0 : eg ? ? void 0,
            required: O,
            ref: eB,
            style: ep ? c.visuallyHiddenInput : c.visuallyHidden,
            tabIndex: -1,
            type: "checkbox",
            "aria-hidden": !0,
            onChange(e) {
                if (e.nativeEvent.defaultPrevented) return;
                if (M) return void e.preventDefault();
                let t = e.currentTarget.checked,
                    r = (0, N.createChangeEventDetails)(S.REASONS.none, e.nativeEvent);
                B ? .(t, r), r.isCanceled || (ey ? .(t, r), !r.isCanceled && (eP(t), em && ek && ej && !E && !ed && ej(t ? [...ek, em] : ek.filter(e => e !== em), r)))
            },
            onFocus() {
                eC.current ? .focus()
            }
        }, void 0 !== V ? {
            value: (eo ? eF && V : V) || ""
        } : i.EMPTY_OBJECT, el, e => eT.getValidationProps(eu, e));
        a.useEffect(() => {
            if (!ec || !em) return;
            let e = ec.disabledStatesRef.current;
            return e.set(em, eu), () => {
                e.delete(em)
            }
        }, [ec, eu, em]);
        let eq = a.useMemo(() => ({ ...Z,
                checked: eA,
                disabled: eu,
                readOnly: M,
                required: O,
                indeterminate: eR
            }), [Z, eA, eu, M, O, eR]),
            eO = m(eq),
            eW = (0, x.useRenderElement)("span", e, {
                state: eq,
                ref: [eD, eC, t, eo ? .registerControlRef],
                props: [{
                    id: $ ? eg ? ? void 0 : ex,
                    role: "checkbox",
                    "aria-checked": eR ? "mixed" : eA,
                    "aria-readonly": M || void 0,
                    "aria-required": O || void 0,
                    "aria-labelledby": eE,
                    "data-parent": E ? "" : void 0,
                    onFocus() {
                        eu || Q(!0)
                    },
                    onBlur() {
                        let e = eL.current;
                        e && (X(!0), Q(!1), "onBlur" === ee && eT.commit(eo ? ek : e.checked))
                    },
                    onKeyDown(e) {
                        if ("Enter" !== e.key || (e.preventBaseUIHandler(), e.defaultPrevented)) return;
                        let t = eL.current ? .form ? ? null,
                            r = e.currentTarget,
                            a = e.nativeEvent,
                            i = e.preventDefault,
                            n = a.preventDefault,
                            s = !1;
                        e.preventDefault = () => {
                            s = !0, i.call(e)
                        }, a.preventDefault = () => {
                            s = !0, n.call(a)
                        }, n.call(a), (0, d.ownerWindow)(r).queueMicrotask(() => {
                            e.preventDefault = i, a.preventDefault = n, s || (function(e) {
                                if (!e) return null;
                                for (let t of e.elements) {
                                    let e = t.tagName;
                                    if (("BUTTON" === e || "INPUT" === e) && "submit" === t.type) return t
                                }
                                return null
                            })(t) ? .click()
                        })
                    },
                    onClick(e) {
                        if (M || eu) return;
                        e.preventDefault();
                        let t = eL.current;
                        t && t.dispatchEvent(new((0, d.ownerWindow)(t)).PointerEvent("click", {
                            bubbles: !0,
                            shiftKey: e.shiftKey,
                            ctrlKey: e.ctrlKey,
                            altKey: e.altKey,
                            metaKey: e.metaKey
                        }))
                    }
                }, K, e_, eI, el, e => eT.getValidationProps(eu, e)],
                stateAttributesMapping: eO
            });
        return (0, r.jsxs)(C.Provider, {
            value: eq,
            children: [eW, !eF && !eo && ep && !E && void 0 !== W && (0, r.jsx)("input", {
                type: "hidden",
                form: F,
                name: ep,
                value: W,
                disabled: eu
            }), (0, r.jsx)("input", { ...eM,
                suppressHydrationWarning: !0
            })]
        })
    });
    var T = e.i(37584),
        F = e.i(23910),
        P = e.i(9407);
    let A = a.forwardRef(function(e, t) {
        let {
            render: r,
            className: i,
            style: n,
            keepMounted: s = !1,
            ...l
        } = e, o = function() {
            let e = a.useContext(C);
            if (void 0 === e) throw Error((0, w.default)(14));
            return e
        }(), c = o.checked || o.indeterminate, {
            mounted: d,
            transitionStatus: u,
            setMounted: h
        } = (0, F.useTransitionStatus)(c), g = a.useRef(null), b = { ...o,
            transitionStatus: u
        };
        (0, T.useOpenChangeComplete)({
            open: c,
            ref: g,
            onComplete() {
                c || h(!1)
            }
        });
        let f = { ...m(o),
                ...P.transitionStatusMapping,
                ...p.fieldValidityMapping
            },
            v = (0, x.useRenderElement)("span", e, {
                ref: [t, g],
                state: b,
                stateAttributesMapping: f,
                props: l
            });
        return s || d ? v : null
    });
    e.s(["Indicator", 0, A, "Root", 0, D], 26749);
    var R = e.i(26749),
        R = R,
        L = e.i(75157),
        B = e.i(93698);
    e.s(["Checkbox", 0, function({
        className: e,
        ...t
    }) {
        return (0, r.jsx)(R.Root, {
            "data-slot": "checkbox",
            className: (0, L.cn)("peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input shadow-xs transition-shadow outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary", e),
            ...t,
            children: (0, r.jsx)(R.Indicator, {
                "data-slot": "checkbox-indicator",
                className: "grid place-content-center text-current transition-none [&>svg]:size-3.5",
                children: (0, r.jsx)(B.CheckIcon, {})
            })
        })
    }], 57428)
}, 10204, e => {
    "use strict";
    var t = e.i(43476),
        r = e.i(75157);
    e.s(["Label", 0, function({
        className: e,
        ...a
    }) {
        return (0, t.jsx)("label", {
            "data-slot": "label",
            className: (0, r.cn)("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", e),
            ...a
        })
    }])
}, 35872, e => {
    "use strict";
    let t = e.i(52838).GlobalConstants.ProductStreamCategory.s_1080f;
    e.s(["goToCheckout", 0, function(e, r, a, i, n) {
        let s = {
            coupons: [],
            lineItems: [{
                productId: e.id,
                quantity: r,
                timeQty: a,
                streamId: null
            }],
            note: `Order for ${e.name} plan`
        };
        window.localStorage.setItem("orderData", window.btoa(JSON.stringify(s)));
        let l = e.category[1] === t ? `/free-trial-checkout?planId=${e.id}` : "/checkout",
            o = n ? `${l}${l.includes("?")?"&":"?"}${n}` : l;
        i ? i.push(o) : window.location.href = `${window.location.origin}${o}`
    }])
}, 90838, e => {
    "use strict";
    let t = (...e) => {
            let t = window;
            t.fbq && t.fbq.apply(null, e)
        },
        r = (e, t = 100) => {
            if ("number" == typeof e && isFinite(e)) return parseFloat((e / t).toFixed(2))
        },
        a = new class {
            registerInitiate(e, r) {
                t("trackCustom", "RegistrationInitiated", {
                    content_name: r ? .trim(),
                    content_category: "registration",
                    status: "started"
                }, {
                    eventID: e
                })
            }
            registerSuccess(e, r) {
                t("track", "CompleteRegistration", {
                    content_name: r ? .trim(),
                    content_category: "registration",
                    status: "success"
                }, {
                    eventID: e
                })
            }
            viewPricing(e) {
                let r = {
                    content_name: "Pricing",
                    content_category: "pricing"
                };
                t("track", "ViewContent", r, {
                    eventID: e
                }), t("trackCustom", "ViewPricing", r, {
                    eventID: e
                })
            }
            trialApplicationSubmitted(e) {
                t("trackCustom", "TrialApplicationSubmitted", {
                    content_name: "TrialApplicationSubmitted",
                    content_category: "trial"
                }, {
                    eventID: e
                })
            }
            startTrial(e, a, i) {
                t("track", "StartTrial", {
                    content_name: "StartTrial",
                    value: r(i),
                    currency: a
                }, {
                    eventID: e
                })
            }
            purchaseIntent(e, a, i, n) {
                let s = r(i ? .prices ? .find(e => e.currency === a) ? .amount),
                    l = i ? [{
                        id: i.id,
                        quantity: n ? .lineItems ? .[0] ? .quantity ? ? 1,
                        item_price: s
                    }] : void 0;
                t("trackCustom", "PurchaseIntent", {
                    currency: a,
                    value: s,
                    content_type: "product",
                    content_name: i ? .name,
                    content_ids: i ? [i.id] : void 0,
                    contents: l
                }, {
                    eventID: e
                })
            }
            initiateCheckout(e, a, i, n, s) {
                let l = r(i ? .prices ? .find(e => e.currency === n) ? .amount),
                    o = a ? .lineItems ? .[0] ? .quantity ? ? 1;
                t("track", "InitiateCheckout", {
                    currency: n,
                    value: "number" == typeof l ? parseFloat((l * o).toFixed(2)) : void 0,
                    num_items: o,
                    content_type: "product",
                    content_name: i ? .name,
                    content_ids: [i ? .id].filter(Boolean),
                    contents: [{
                        id: i ? .id,
                        quantity: o,
                        item_price: l
                    }],
                    customer_id: s ? .id
                }, {
                    eventID: e
                })
            }
            purchase(e, a, i) {
                let n = a ? .lineItems ? .map(e => ({
                    id: e.productId,
                    quantity: e.quantity,
                    item_price: r(e.rate)
                })) ? ? [];
                t("track", "Purchase", {
                    currency: a ? .currency,
                    value: r(a ? .total),
                    content_type: "product",
                    content_ids: a ? .lineItems ? .map(e => e.productId),
                    contents: n,
                    order_id: a ? .orderNumber ? ? a ? .id,
                    customer_id: i ? .id
                }, {
                    eventID: e
                })
            }
            addToWaitlist(e, r, a) {
                let i = {
                    content_category: a,
                    consent_terms: !!r ? .consentTerms,
                    consent_marketing: !!r ? .consentMarketing,
                    platforms: r ? .platforms,
                    content: r ? .content,
                    hours: r ? .hours,
                    role: r ? .role,
                    project: r ? .project
                };
                t("track", "Lead", i, {
                    eventID: e
                }), t("trackCustom", "AddToWaitlist", i, {
                    eventID: e
                })
            }
        },
        i = (...e) => {
            let t = window;
            t.gtag && t.gtag.apply(null, e)
        },
        n = (e, t = 100) => {
            if ("number" == typeof e && isFinite(e)) return parseFloat((e / t).toFixed(2))
        },
        s = new class {
            registerInitiate(e, t) {
                i("event", "sign_up_initiated", {
                    content_name: t ? .trim(),
                    content_category: "registration",
                    status: "started",
                    event_id: e
                })
            }
            registerSuccess(e, t) {
                i("event", "sign_up", {
                    method: "email",
                    content_name: t ? .trim(),
                    event_id: e
                })
            }
            viewPricing(e) {
                let t = {
                    content_name: "Pricing",
                    content_category: "pricing",
                    event_id: e
                };
                i("event", "view_item", t), i("event", "view_pricing", t)
            }
            trialApplicationSubmitted(e) {
                i("event", "trial_application_submitted", {
                    content_name: "TrialApplicationSubmitted",
                    content_category: "trial",
                    event_id: e
                })
            }
            startTrial(e, t, r) {
                i("event", "start_trial", {
                    currency: t,
                    value: n(r),
                    event_id: e
                })
            }
            purchaseIntent(e, t, r, a) {
                let s = n(r ? .prices ? .find(e => e.currency === t) ? .amount),
                    l = a ? .lineItems ? .[0] ? .quantity ? ? 1;
                i("event", "add_to_cart", {
                    currency: t,
                    value: s,
                    items: r ? [{
                        item_id: r.id,
                        item_name: r.name,
                        quantity: l,
                        price: s
                    }] : void 0,
                    event_id: e
                })
            }
            initiateCheckout(e, t, r, a, s) {
                let l = n(r ? .prices ? .find(e => e.currency === a) ? .amount),
                    o = t ? .lineItems ? .[0] ? .quantity ? ? 1;
                i("event", "begin_checkout", {
                    currency: a,
                    value: "number" == typeof l ? parseFloat((l * o).toFixed(2)) : void 0,
                    items: [{
                        item_id: r ? .id,
                        item_name: r ? .name,
                        quantity: o,
                        price: l
                    }],
                    event_id: e
                })
            }
            purchase(e, t, r) {
                let a = n(t ? .total),
                    s = t ? .orderNumber ? ? t ? .id,
                    l = t ? .lineItems ? .map(e => ({
                        item_id: e.productId,
                        quantity: e.quantity,
                        price: n(e.rate)
                    })) ? ? [];
                i("event", "purchase", {
                    transaction_id: s,
                    currency: t ? .currency,
                    value: a,
                    items: l,
                    event_id: e
                })
            }
            addToWaitlist(e, t, r) {
                let a = {
                    content_category: r,
                    consent_marketing: !!t ? .consentMarketing,
                    event_id: e
                };
                i("event", "generate_lead", a), i("event", "add_to_waitlist", a)
            }
        },
        l = e => `${e}-${Date.now()}-${Math.random().toString(36).slice(2,10)}`,
        o = new Map,
        c = e => {
            let t = o.get(e);
            return !!(t && Date.now() - t < 1e3) || (o.set(e, Date.now()), !1)
        },
        d = new class {
            registerInitiate(e, t) {
                if (c("registerInitiate")) return;
                e = e.trim(), t = t.trim();
                let r = l("registerInitiate");
                try {
                    a.registerInitiate(r, e)
                } catch {}
                try {
                    s.registerInitiate(r, e)
                } catch {}
            }
            registerSuccess(e, t) {
                if (c("registerSuccess")) return;
                e = e.trim(), t = t.trim();
                let r = l("registerSuccess");
                try {
                    a.registerSuccess(r, e)
                } catch {}
                try {
                    s.registerSuccess(r, e)
                } catch {}
            }
            viewPricing() {
                if (c("viewPricing")) return;
                let e = l("viewPricing");
                try {
                    a.viewPricing(e)
                } catch {}
                try {
                    s.viewPricing(e)
                } catch {}
            }
            trialApplicationSubmitted() {
                if (c("trialApplicationSubmitted")) return;
                let e = l("trialApplicationSubmitted");
                try {
                    a.trialApplicationSubmitted(e)
                } catch {}
                try {
                    s.trialApplicationSubmitted(e)
                } catch {}
            }
            startTrial(e, t) {
                if (c("startTrial")) return;
                let r = l("startTrial");
                try {
                    a.startTrial(r, e, t)
                } catch {}
                try {
                    s.startTrial(r, e, t)
                } catch {}
            }
            purchaseIntent(e, t, r) {
                if (c("purchaseIntent")) return;
                let i = l("purchaseIntent");
                try {
                    a.purchaseIntent(i, e, t, r)
                } catch {}
                try {
                    s.purchaseIntent(i, e, t, r)
                } catch {}
            }
            initiateCheckout(e, t, r, i) {
                if (c("initiateCheckout")) return;
                let n = l("initiateCheckout");
                try {
                    a.initiateCheckout(n, e, t, r, i)
                } catch {}
                try {
                    s.initiateCheckout(n, e, t, r, i)
                } catch {}
            }
            purchase(e, t) {
                if (console.log({
                        event: "purchase",
                        orderData: e,
                        user: t
                    }), c("purchase")) return;
                let r = l("purchase");
                try {
                    a.purchase(r, e, t)
                } catch {}
                try {
                    s.purchase(r, e, t)
                } catch {}
            }
            addToWaitlist(e, t) {
                if (c("waitlist")) return;
                let r = l("waitlist");
                try {
                    a.addToWaitlist(r, e, t)
                } catch {}
                try {
                    s.addToWaitlist(r, e, t)
                } catch {}
            }
        };
    e.s(["default", 0, d], 90838)
}]);