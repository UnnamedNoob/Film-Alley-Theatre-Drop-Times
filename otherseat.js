function Seat(n, t, i, r, u, f, e, o, s, h, c, l, a, v, y, p, w, b, k) {
    this.id = n;
    this.seatGraphicId = t;
    this.rowNum = i;
    this.colNum = r;
    this.rowDesc = u;
    this.colDesc = f;
    this.seatType = e;
    this.bestSetting = o;
    this.xPos = s;
    this.yPos = h;
    this.width = c;
    this.height = l;
    this.angle = a;
    this.groupId = v;
    this.groupPosition = y;
    this.groupDesc = p;
    this.hideOnInternet = w;
    this.hideRowDesc = b;
    this.hideSeparator = k;
    this.ticketGroupId = 0
}

function SeatType(n, t, i) {
    this.id = n;
    this.name = t;
    this.overlayColor = i
}

function GraphicAsset(n, t) {
    this.id = n;
    this.url = t
}

function SeatGroup(n, t, i, r, u, f, e) {
    this.id = n;
    this.groupGraphicId = t;
    this.xPos = i;
    this.yPos = r;
    this.width = u;
    this.height = f;
    this.type = e
}

function Ticket(n, t, i, r) {
    this.id = n;
    this.internetName = t;
    this.price = i;
    this.tax = r
}

function TicketGroup(n, t) {
    this.id = n;
    this.ticketArray = t
}

function SeatTicketGroup(n, t) {
    this.id = n;
    this.seatArray = t
}

function rtsAlert(n) {
    window.console && console.log && console.log !== undefined && console.log(n)
}

function getGroupTypeById(n) {
    for (var t = 0; t < seatGroups[rtsParameters.sectionId].length; t++)
        if (seatGroups[rtsParameters.sectionId][t].id === n) return seatGroups[rtsParameters.sectionId][t].type;
    return -1
}

function setupVariables() {
    var t = window.innerWidth,
        i = window.innerHeight,
        n;
    for (config.gridWidth = t > 1200 ? t * .7 : t * .9, config.gridHeight = config.gridWidth, $("#seatingChart").width(config.gridWidth), $("#seatingChart").height(config.gridHeight), n = 0; n < seats[rtsParameters.sectionId].length; n++) seats[rtsParameters.sectionId][n].xPos !== 0 && (config.usingCoords = !0), config.maxX < seats[rtsParameters.sectionId][n].colNum && (config.maxX = seats[rtsParameters.sectionId][n].colNum), config.maxY < seats[rtsParameters.sectionId][n].rowNum && (config.maxY = seats[rtsParameters.sectionId][n].rowNum);
    config.xMultiplier = config.gridWidth / 1e4;
    config.yMultiplier = config.gridHeight / 1e4;
    config.cellWidth = config.gridWidth / config.maxX;
    config.cellHeight = config.gridHeight / config.maxY
}

function getAssetById(n) {
    for (var t = 0; t < graphicAssets.length; t++)
        if (graphicAssets[t].id === n) return graphicAssets[t].url;
    return null
}

function loadGraphicAssetImage(n, t) {
    var i = getAssetById(t);
    i !== null ? $("#" + n).css({
        "background-image": 'url("' + i + '")',
        "background-repeat": "no-repeat",
        "background-size": "100% 100%"
    }) : $("#" + n).css({
        border: "1px solid black",
        background: "white"
    })
}

function isSelectedSeat(n) {
    for (var t = 0; t < state.seatsSelected.length; t++)
        if (state.seatsSelected[t].id === n) return !0;
    return !1
}

function getSeatTypeById(n) {
    for (var t = 0; t < seatTypes.length; t++)
        if (seatTypes[t].id === n) return seatTypes[t];
    return ""
}

function getSeatText(n) {
    var t = "",
        i = "",
        r = "",
        u;
    return n.hideRowDesc === 0 && (t = n.rowDesc, n.hideSeparator === 0 && (i = ",")), n.groupId !== 0 && (u = getGroupTypeById(n.groupId), r = u === 1 ? n.groupDesc : n.colDesc), t + i + r
}

function buildSeatElements() {
    for (var n, u, e, o, f, s, v, a, r = 0; r < seats[rtsParameters.sectionId].length; r++) {
        n = seats[rtsParameters.sectionId][r];
        u = "seat_" + n.id;
        config.usingCoords === !0 ? (e = n.xPos * config.xMultiplier + "px", o = n.yPos * config.yMultiplier + "px", f = n.width * config.xMultiplier + "px", s = n.height * config.yMultiplier + "px") : (e = n.rowNum * config.cellWidth + "px", o = n.colNum * config.cellWidth + "px", f = config.cellWidth + "px", s = config.cellHeight + "px");
        var t = "",
            i = "",
            h = !1;
        soldSeatsContains(n.id) || n.hideOnInternet === 1 ? (t = "OverlaySold", i = "unavailableSeat") : bufferSeatsContains(n.id) ? (h = !0, t = "OverlayNone", i = "bufferSeat") : brokenSeatsContains(n.id) ? (h = !0, t = "OverlayNone", i = "brokenSeat") : n.groupId !== 0 && (v = getGroupTypeById(n.groupId), i = "availableSeat", t = v > 1 ? isSelectedSeat(n.id) === !0 ? "OverlaySelected" : "OverlayNone" : "OverlayTransparent");
        var y = getSeatTypeById(n.seatType),
            w = getSeatText(n),
            p = 'style="position: absolute; left: ' + e + "; top: " + o + "; width: " + f + "; height: " + s + ";max-width: " + f + ';overflow: hidden;"',
            c = '<div id="' + u + '" class="' + i + ' seat" ' + p + ' title="' + y.name + '"><div id="' + u + '_overlay" class="' + t + " " + p,
            l = '"><div class="seatLabel" >' + w + "<\/div><\/div><\/div>";
        rtsParameters.displayType === "ASSETS" ? $("#seatingChart").append(c + l) : t === "OverlaySold" || t === "OverlaySelected" ? $("#seatingChart").append(c + l) : $("#seatingChart").append(c + '" style="background-color: ' + y.overlayColor + ";" + l);
        rtsParameters.displayType !== "BUTTONS" && n.seatGraphicId !== 0 && (a = n.seatGraphicId, h && (a += 1e6), loadGraphicAssetImage(u, a))
    }
}

function groupHasSoldSeats(n) {
    for (var t = 0; t < seats[rtsParameters.sectionId].length; t++)
        if (seats[rtsParameters.sectionId][t].groupId === n && soldSeatsContains(seats[rtsParameters.sectionId][t].id)) return !0;
    return !1
}

function buildSeatGroupElements() {
    var n, t, i, r, u, f;
    for (groupCount = 0; groupCount < seatGroups[rtsParameters.sectionId].length; groupCount++) n = seatGroups[rtsParameters.sectionId][groupCount], n.type === 1 && (t = "group_" + n.id, config.usingCoords === !0 && (i = n.xPos * config.xMultiplier + "px", r = n.yPos * config.yMultiplier + "px", u = n.width * config.xMultiplier + "px", f = n.height * config.yMultiplier + "px"), groupHasSoldSeats(n.id) === !1 ? $("#seatingChart").append('<div id="' + t + '" class="availableGroup seatGroup" style="position: absolute; left: ' + i + "; top: " + r + "; width: " + u + "; height: " + f + ';"><div id="' + t + '_overlay" class="OverlayNone"><\/div><\/div>') : $("#seatingChart").append('<div id="' + t + '" class="unavailableGroup seatGroup" style="position: absolute; left: ' + i + "; top: " + r + "; width: " + u + "; height: " + f + ';"><div id="' + t + '_overlay" class="OverlaySold"><\/div><\/div>'), loadGraphicAssetImage(t, n.groupGraphicId))
}

function getGroupIdFromGroupDivId(n) {
    var t = n.split("_");
    return t[1]
}

function getSeatIdFromSeatDivId(n) {
    var t = n.split("_");
    return parseInt(t[1], 10)
}

function getSeatById(n) {
    for (var t = 0; t < seats[rtsParameters.sectionId].length; t++)
        if (seats[rtsParameters.sectionId][t].id === n) return seats[rtsParameters.sectionId][t];
    return null
}

function brokenSeatsContains(n) {
    for (var t = 0; t < brokenSeats.length; t++)
        if (brokenSeats[t] === n) return !0;
    return !1
}

function soldSeatsContains(n) {
    for (var t = 0; t < soldSeats.length; t++)
        if (soldSeats[t] === n) return !0;
    return !1
}

function bufferSeatsContains(n) {
    for (var t = 0; t < bufferSeats.length; t++)
        if (bufferSeats[t] === n) return !0;
    return !1
}

function getSeatsInGroupByGroupId(n) {
    for (var i = [], t = 0; t < seats[rtsParameters.sectionId].length; t++) seats[rtsParameters.sectionId][t].groupId === Number(n) && i.push(seats[rtsParameters.sectionId][t]);
    return i
}

function getGroupById(n) {
    for (var t = 0; t < seatGroups[rtsParameters.sectionId].length; t++)
        if (seatGroups[rtsParameters.sectionId][t].id === Number(n)) return seatGroups[rtsParameters.sectionId][t];
    return null
}

function confirmWheelchairSale(n, t) {
    alertify.confirm().destroy();
    alertify.defaults.glossary = {
        title: "Reserved Seating Warning",
        ok: "Yes",
        cancel: "No"
    };
    alertify.confirm(rtsParameters.wheelchairWarnMessage + "<br/><br/>Continue?").autoCancel(20).set("onok", function (i) {
        i && processSeatSale(n, t)
    })
}

function confirmCompanionSale(n, t) {
    alertify.confirm().destroy();
    alertify.defaults.glossary = {
        title: "Reserved Seating Warning",
        ok: "Yes",
        cancel: "No"
    };
    alertify.confirm(rtsParameters.companionWarnMessage + "<br/><br/>Continue?").autoCancel(20).set("onok", function (i) {
        i && processSeatSale(n, t)
    })
}

function setSeatSelected(n) {
    var i = getSeatIdFromSeatDivId(n),
        t = getSeatById(i);
    if (t !== null)
        if (Number(rtsParameters.ticketsRemaining) < Number(rtsParameters.ticketLimit))
            if (state.seatsSelected.length < Number(rtsParameters.ticketsRemaining)) {
                if (t.seatType === 1 && rtsParameters.wheelchairWarn === 1) {
                    confirmWheelchairSale(t, n);
                    return
                }
                if (t.seatType === 4 && rtsParameters.companionWarn === 1) {
                    confirmCompanionSale(t, n);
                    return
                }
                processSeatSale(t, n)
            } else Number(rtsParameters.ticketsRemaining) > 1 ? alertify.alert("You cannot select more seats. There are only " + rtsParameters.ticketsRemaining + " seats available for purchase") : Number(rtsParameters.ticketsRemaining) == 1 ? alertify.alert("You cannot select more seats. There is only " + rtsParameters.ticketsRemaining + " seat available for purchase") : alertify.alert("There are no more seats available for purchase.");
    else if (rtsParameters.enforceTicketLimit)
        if (state.seatsSelected.length < Number(rtsParameters.ticketLimit)) {
            if (t.seatType === 1 && rtsParameters.wheelchairWarn === 1) {
                confirmWheelchairSale(t, n);
                return
            }
            if (t.seatType === 4 && rtsParameters.companionWarn === 1) {
                confirmCompanionSale(t, n);
                return
            }
            processSeatSale(t, n)
        } else alertify.alert("You have reached the transaction ticket limit.")
}

function processSingleSeatSale(n, t) {
    state.seatsSelected.push(n);
    rtsParameters.displayType !== "ASSETS" && $("#" + t + "_overlay").removeAttr("style");
    $("#" + t + " > div").hasClass("OverlayNone") ? $("#" + t + " > div").removeClass("OverlayNone").addClass("OverlaySelected") : $("#" + t + " > div").hasClass("OverlayTransparent") && $("#" + t + " > div").removeClass("OverlayTransparent").addClass("OverlaySelected");
    updateNextButton()
}

function processSeatSale(n, t) {
    var u, r, i, f;
    if (n.groupId !== 0 && (u = getGroupById(n.groupId), u !== null && u.type === 1)) {
        for ($("#group_" + u.id + " > div").removeClass("OverlayNone").addClass("OverlaySelected"), r = getSeatsInGroupByGroupId(n.groupId), i = 0; i < r.length; i++) soldSeatsContains(r[i].id) === !1 && bufferSeatsContains(r[i].id) === !1 && (f = "seat_" + r[i].id, processSingleSeatSale(r[i], f));
        return
    }
    processSingleSeatSale(n, t)
}

function removeSeatSelected(n) {
    for (var t = 0; t < state.seatsSelected.length; t++)
        if (state.seatsSelected[t].id === n.id) {
            state.seatsSelected.splice(t, 1);
            break
        }
}

function setSeatUnselected(n) {
    var o = getSeatIdFromSeatDivId(n),
        r = getSeatById(o),
        u, i, t, f, e;
    if (r !== null) {
        if (r.groupId !== 0 && (u = getGroupById(r.groupId), u !== null && u.type === 1)) {
            for ($("#group_" + u.id + " > div").removeClass("OverlaySelected").addClass("OverlayNone"), i = getSeatsInGroupByGroupId(r.groupId), t = 0; t < i.length; t++) soldSeatsContains(i[t].id) === !1 && bufferSeatsContains(i[t].id) === !1 && (removeSeatSelected(i[t]), rtsParameters.displayType === "ASSETS" ? $("#seat_" + i[t].id + " > div").removeClass("OverlaySelected").addClass("OverlayNone") : (f = getSeatTypeById(r.seatType), $("#seat_" + i[t].id + "_overlay").attr("style", "background-color: " + f.overlayColor + ";"), $("#seat_" + i[t].id + " > div").removeClass("OverlaySelected").addClass("OverlayTransparent")));
            updateNextButton();
            return
        }
        removeSeatSelected(r);
        rtsParameters.displayType === "ASSETS" ? $("#" + n + " > div").removeClass("OverlaySelected").addClass("OverlayNone") : (e = getSeatTypeById(r.seatType), $("#" + n + "_overlay").attr("style", "background-color: " + e.overlayColor + ";"), $("#" + n + " > div").removeClass("OverlaySelected").addClass("OverlayTransparent"))
    }
    updateNextButton()
}

function setGroupSelected(n) {
    var r, u, i, t;
    if ($("#" + n + " > div").removeClass("OverlayNone").addClass("OverlaySelected"), r = getGroupIdFromGroupDivId(n), u = getGroupById(r), u !== null)
        if (u.type === 1)
            for (i = getSeatsInGroupByGroupId(r), t = 0; t < i[rtsParameters.sectionId].length; t++) state.seatsSelected.push(i[rtsParameters.sectionId][t]), $("#seat_" + i[rtsParameters.sectionId][t].id + " > div").hasClass("OverlayNone") ? $("#seat_" + i[rtsParameters.sectionId][t].id + " > div").removeClass("OverlayNone").addClass("OverlaySelected") : $("#seat_" + i[rtsParameters.sectionId][t].id + " > div").hasClass("OverlayTransparent") && $("#seat_" + i[rtsParameters.sectionId][t].id + " > div").removeClass("OverlayTransparent").addClass("OverlaySelected");
        else $("#" + n + " > div").removeClass("OverlayNone").addClass("OverlaySelected");
    updateNextButton()
}

function setGroupUnselected(n) {
    var r, u, i, t;
    if ($("#" + n + " > div").removeClass("OverlaySelected").addClass("OverlayNone"), r = getGroupIdFromGroupDivId(n), u = getGroupById(r), u !== null)
        if (u.type === 1)
            for (i = getSeatsInGroupByGroupId(r), t = 0; t < i[rtsParameters.sectionId].length; t++) removeSeatSelected(i[rtsParameters.sectionId][t]), $("#seat_" + i[rtsParameters.sectionId][t].id + " > div").removeClass("OverlaySelected").addClass("OverlayNone");
        else $("#" + n + " > div").removeClass("OverlaySelected").addClass("OverlayNone");
    updateNextButton()
}

function addWindowEventListeners() {
    $(window).resize(function () {
        $(window).width() !== windowWidth && ($("#seatingChart").html(""), setupVariables(), config.backgroundImageId > 0 && loadGraphicAssetImage("seatingChart", config.backgroundImageId), config.usingCoords === !0 && buildSeatGroupElements(), buildSeatElements(), removeElementEventListeners(), addElementEventListeners(), setLegendImage(), windowWidth = $(window).width())
    })
}

function removeElementEventListeners() {
    $(".availableSeat").off("click");
    $(".availableGroup").off("click");
    $("#seatNextButton").off("click");
    $("#seatBackButton").off("click")
}

function addElementEventListeners() {
    $(".availableSeat").click(function () {
        showingViolation === !1 && $(this).hasClass("availableSeat") && ($("#" + this.id + " > div").hasClass("OverlayNone") || $("#" + this.id + " > div").hasClass("OverlayTransparent") ? setSeatSelected(this.id) : $("#" + this.id + " > div").hasClass("OverlaySelected") && setSeatUnselected(this.id))
    });
    $(".bufferSeat").click(function () {
        alert(rtsParameters.bufferWarnMessage)
    });
    $(".availableGroup").click(function () {
        showingViolation === !1 && $(this).hasClass("availableGroup") && ($("#" + this.id + " > div").hasClass("OverlayNone") ? setGroupSelected(this.id) : $("#" + this.id + " > div").hasClass("OverlaySelected") && setGroupUnselected(this.id))
    });
    $("#seatNextButton").click(function () {
        rtsParameters.disableSingleSeatWarnings === 0 ? hasSingleSeatViolations() === !1 && showTicketPick() : showTicketPick()
    });
    $("#seatBackButton").click(function () {
        window.history.back()
    })
}

function ticketBackButtonClick() {
    $("#ticketPickWrapper").remove();
    $("#ticketNavWrapper").remove();
    $("#background").show();
    $("#seatNavWrapper").show()
}

function showTicketPick() {
    var n, t, i, r, u;
    if ($("#background").hide(), $("#seatNavWrapper").hide(), n = !1, ticketGroups.length > 1) {
        for (t = 0, i = 0; i < state.seatsSelected.length; i++) r = state.seatsSelected[i], u = getTicketsInGroupById(r.ticketGroupId), t = Math.max(u.length, t);
        t > 1 && (n = !0)
    } else tickets.length > 1 && (n = !0);
    n === !0 ? ($("#wrapper").append(getTicketPickHtml(!1)), $("#wrapper").toggle().toggle(), window.scrollTo(0, 0)) : ($("#wrapper").append(getTicketPickHtml(!0)), $("#wrapper").toggle().toggle(), window.scrollTo(0, 0), document.forms[0].submit())
}

function formatNumberAsCurrency(n) {
    for (var t, u, i = n.toString(), r = "", f = "", e = 0; e < 3; e++) f += "0";
    for (r = (f + i).substr(-2), i = i.length > 2 ? i.substr(0, i.length - 2) : 0, i = "000" + i, t = ""; i.length >= 3;) {
        if (u = i.substr(0, i.length - 3), +u > 0) t = i.substr(-3) + t, t = "." + t;
        else {
            t = i.substr(-3) + t;
            break
        }
        i = u
    }
    if (t.length > 0)
        while (t.substr(0, 1) === "0")
            if (t.length > 1) t = t.substr(1);
            else break;
    return +t == 0 ? "$." + r : "$" + t + "." + r
}

function getTicketsInGroupById(n) {
    for (var u, r, t, f = [], i = 0; i < ticketGroups.length; i++)
        if (ticketGroups[i].id === n)
            for (u = ticketGroups[i], r = 0; r < u.ticketArray.length; r++)
                for (t = 0; t < tickets.length; t++) tickets[t].id === u.ticketArray[r] && f.push(tickets[t]);
    return f
}

function getTicketPickHtml(n) {
    var t, f, i, r, u, e;
    for (t = n ? "<div id='ticketPickWrapper' style='display:none;'>" : "<div id='ticketPickWrapper'>", t += "<p class='instructions'>For each seat selection assign the ticket type you wish to purchase:<\/p>", t += "<div id='ticketPicker'>", t += "<form action='https://411322.formovietickets.com:2235/T.asp?WCI=CS' method='POST'>", t += "<input name='perfId' type='hidden' value='" + rtsParameters.perfId + "'/>", t += "<input name='sectionId' type='hidden' value='" + rtsParameters.sectionId + "'/>", t += "<input name='placeId' type='hidden' value='" + rtsParameters.placeId + "'/>", t += "<input name='spCount' type='hidden' value='" + state.seatsSelected.length + "'/>", t += "<input name='showTime' type='hidden' value='" + rtsParameters.showTime + "'/>", t += "<input name='title' type='hidden' value='" + rtsParameters.title + "'/>", t += "<input name='audText' type='hidden' value='" + rtsParameters.audText + "'/>", t += "<input name='RtsPurchaseId' type='hidden' value='" + rtsParameters.rtsPurchaseId + "'/>", rtsParameters.nonce !== undefined && (t += "<input name='nonce' type='hidden' value='" + rtsParameters.nonce + "'/>"), t += "<table>", t += "<tr><th>Seat<\/th><th>Ticket<\/th><\/tr>", state.seatsSelected.sort(sortSeatsByGroupIdRowNumColNum), f = 0; f < state.seatsSelected.length; f++) {
        if (i = state.seatsSelected[f], t += "<tr><td>" + i.rowDesc + "," + i.colDesc + "<\/td><td><select name='SP" + (f + 1) + "'>", ticketGroups.length > 0)
            for (e = getTicketsInGroupById(i.ticketGroupId), u = 0; u < e.length; u++) r = e[u], t += "<option value='" + r.id + "|" + i.rowNum + "|" + i.colNum + "'>" + r.internetName + " (" + formatNumberAsCurrency(r.price) + ")<\/option>";
        else
            for (u = 0; u < tickets.length; u++) r = tickets[u], t += "<option value='" + r.id + "|" + i.rowNum + "|" + i.colNum + "'>" + r.internetName + " (" + formatNumberAsCurrency(r.price) + ")<\/option>";
        t += "<\/select>"
    }
    return t += "<\/table>", t += "<\/form>", t += "<\/div>", t += "<\/div>", n || (t += "<div id='ticketNavWrapper'>", t += "<div id='ticketNavigation'>", t += "<input id='ticketBackButton' class='backButton' type='button' value='Back' onclick='ticketBackButtonClick();'><input type='button' id='ticketNextButton' class='nextButton' value='Continue' onclick='this.disabled = true; document.forms[0].submit();'>", t += "<\/div>", t += "<\/div>"), t
}

function sortTicketByPriceLargestToSmallest(n, t) {
    return Number(t.price) - Number(n.price)
}

function sortTicketByPriceSmallestToLargest(n, t) {
    return Number(n.price) - Number(t.price)
}

function getTicketById(n) {
    for (var t = 0; t < tickets.length; t++)
        if (tickets[t].id === n) return tickets[t]
}

function updateNextButton() {
    var n = "";
    state.seatsSelected.length === 0 ? ($("#seatNextButton").html("Continue"), $("#seatNextButton").attr("disabled", !0)) : ($("#seatNextButton").attr("disabled", !1), n = state.seatsSelected.length > 1 ? state.seatsSelected.length + " seats picked" : state.seatsSelected.length + " seat picked", $("#seatNextButton").html("Continue (" + n + ")"))
}

function sortSeatsByGroupIdRowNumColNum(n, t) {
    var i;
    return i = n.groupId < t.groupId ? -1 : n.groupId > t.groupId ? 1 : 0, i === 0 && (i = n.rowNum < t.rowNum ? -1 : n.rowNum > t.rowNum ? 1 : 0, i === 0 && (i = n.colNum < t.colNum ? -1 : n.colNum > t.colNum ? 1 : 0)), i
}

function sortSeatsByGroupPosition(n, t) {
    return parseFloat(n.groupPosition) - parseFloat(t.groupPosition)
}

function hasBufferSeatViolations() {}

function hasSingleSeatViolations() {
    for (var lt, p, at, w, y, f, h, b, n, t, k, d, e, g, vt, nt, r, u, yt, tt, gt, ni, pt, it, wt, rt, c, l, o, bt, a, v, ut, ft, et, ot, st, ht, s = [], ct = 0; ct < state.seatsSelected.length; ct++)
        if (lt = state.seatsSelected[ct], lt.groupId !== 0 && (p = getGroupById(lt.groupId), p.type !== 0)) {
            for (at = !1, w = 0; w < s.length; w++)
                if (s[w].id === p.id) {
                    at = !0;
                    break
                } at === !1 && s.push(p)
        } if (y = [], s.length > 0) {
        for (f = [], h = !1, b = 0; b < s.length; b++) {
            var ti = s[b],
                kt = 0,
                dt = 0,
                i = [];
            for (i = getSeatsInGroupByGroupId(ti.id), i.sort(sortSeatsByGroupPosition), n = [], n.push(!0), k = 0; k < i.length; k++) t = i[k], soldSeatsContains(t.id) || bufferSeatsContains(t.id) ? n.push(!0) : n.push(!1);
            for (n.push(!0), d = 1; d < n.length - 1; d++) isSingleSeat(d, n) && kt++;
            for (e = [], n = [], n.push(!0), g = 0; g < i.length; g++) {
                for (t = i[g], vt = !1, nt = 0; nt < state.seatsSelected.length; nt++)
                    if (t.id === state.seatsSelected[nt].id) {
                        vt = !0;
                        break
                    } vt === !0 ? (e.push(n.length), n.push(!0)) : soldSeatsContains(t.id) || bufferSeatsContains(t.id) ? n.push(!0) : n.push(!1)
            }
            for (n.push(!0), r = [], u = 1; u < n.length - 1; u++) {
                for (yt = !1, tt = 0; tt < e.length; tt++)
                    if (e[tt] === u) {
                        yt = !0;
                        break
                    } if (yt === !0) {
                    if (gt = isSingleSeat(u - 1, n), ni = isSingleSeat(u + 1, n), gt === !0) {
                        for (t = i[u - 2], pt = !1, it = 0; it < f.length; it++)
                            if (f[it].id === t.id) {
                                pt = !0;
                                break
                            } pt === !1 && (f.push(t), r.push(u - 1))
                    }
                    if (ni === !0) {
                        for (t = i[u], wt = !1, rt = 0; rt < f.length; rt++)
                            if (f[rt].id === t.id) {
                                wt = !0;
                                break
                            } wt === !1 && (f.push(t), r.push(u + 1))
                    }
                }
            }
            for (c = [], l = [], o = 0; o < r.length; o++) {
                for (bt = !1, a = r[o], a; a > 1; a--)
                    if ($.inArray(a - 1, e) === -1) {
                        n[a - 1] === !1 && (t = i[r[o] - 1], l.push(t), bt = !0);
                        break
                    } if (bt === !1)
                    for (v = r[o], v; v < i.length; v++)
                        if ($.inArray(v + 1, e) === -1) {
                            n[v + 1] === !1 && (t = i[r[o] - 1], l.push(t));
                            break
                        }
            }
            for (ut = 0; ut < r.length; ut++) ft = r[ut], $.inArray(ft - 1, e) > -1 && $.inArray(ft + 1, e) > -1 && (t = i[ft - 1], $.inArray(t, c) === -1 && c.push(t));
            for (et = 1; et < n.length - 1; et++) isSingleSeat(et, n) && dt++;
            if (dt - kt > 1)
                for (h = !0, ot = 0; ot < f.length; ot++) y.push(f[ot].id);
            else if (c.length > 0)
                for (h = !0, st = 0; st < c.length; st++) y.push(c[st].id);
            else if (l.length > 0)
                for (h = !0, ht = 0; ht < l.length; ht++) y.push(l[ht].id)
        }
        return h === !0 && flashSeatsOn(y, "Your selections have created 1 or more single seats.\nThe problem seats will highlight when you click 'OK'."), h
    }
}

function flashSeatsOn(n, t) {
    alertify.alert(t, function () {
        showingViolation = !0;
        for (var t = 0; t < n.length; t++) rtsParameters.displayType === "ASSETS" ? $("#seat_" + n[t] + " > div").removeClass("OverlayNone").addClass("OverlayViolation") : ($("#seat_" + n[t] + "_overlay").removeAttr("style"), $("#seat_" + n[t] + " > div").removeClass("OverlayNone").addClass("OverlayViolation"));
        setTimeout(flashSeatsOff, 2e3, n)
    })
}

function flashSeatsOff(n) {
    for (var i, r, t = 0; t < n.length; t++) rtsParameters.displayType === "ASSETS" ? $("#seat_" + n[t] + " > div").removeClass("OverlayViolation").addClass("OverlayNone") : (i = getSeatById(n[t]), r = getSeatTypeById(i.seatType), $("#seat_" + n[t] + "_overlay").attr("style", "background-color: " + r.overlayColor + ";"), $("#seat_" + n[t] + " > div").removeClass("OverlayViolation").addClass("OverlayNone"));
    showingViolation = !1
}

function isSingleSeat(n, t) {
    return t[n] === !1 && t[n - 1] === !0 && t[n + 1] === !0 ? !0 : !1
}

function configBackButton() {
    history.length === 1 && $("#seatBackButton").hide()
}

function updateSeatTicketGroups() {
    for (var t, i, r, n = 0; n < seatTicketGroups.length; n++)
        for (t = seatTicketGroups[n], i = 0; i < t.seatArray.length; i++) r = getSeatById(t.seatArray[i]), r.ticketGroupId = t.id
}

function setLegendImage() {
    config.legendImageId > 0 ? ($("#screenLegend").width(config.gridWidth), $("#screenLegendImage").width(config.gridWidth), $("#screenLegendImage").attr("src", getAssetById(config.legendImageId))) : $("#screenLegendImage").hide()
}

function init() {
    configBackButton();
    setupVariables();
    typeof seatTicketGroups != "undefined" && updateSeatTicketGroups();
    config.backgroundImageId > 0 && loadGraphicAssetImage("seatingChart", config.backgroundImageId);
    setLegendImage();
    config.usingCoords === !0 && buildSeatGroupElements();
    buildSeatElements();
    addWindowEventListeners();
    addElementEventListeners()
}
var windowWidth = $(window).width(),
    showingViolation = !1;