const header = document.getElementById("header")
  , nameInput = document.getElementById("nameInput")
  , enterButton = document.getElementById("enterButton")
  , nameBoxes = document.getElementById("nameBoxes")
  , downloadButton = document.getElementById("downloadBtn")
  , qrCodeButton = document.getElementById("qrCodeBtn")
  , qrCloseButton = document.getElementById("qr-close-btn")
  , QRContainerPopup = document.getElementById("QRContainerPopup")
  , helpCloseButton = document.getElementById("help-close-btn")
  , floatingWrapper = document.getElementById("floating-wrapper")
  , locationInfo = document.getElementById("locationInfo")
  , locationTitle = document.getElementById("locationTitle")
  , locationCoordinates = document.getElementById("locationCoordinates")
  , inputPopup = document.getElementById("inputPopup")
  , inputPopupText = document.getElementById("popupText")
  , favicon = document.getElementById("favicon")
  , textBelowTitle = document.getElementById("textBelowTitle")
  , helpContainer = document.getElementById("helpContainer")
  , helpIcon = document.getElementById("helpIcon")
  , helpContainerPopup = document.getElementById("helpContainerPopup")
  , info1 = document.getElementById("info1")
  , info3 = document.getElementById("info3")
  , NASALogo = document.getElementById("title")
  , copyLinkButton = document.getElementById("copy-link-btn");
let inactivityTimer, cycleTimer, typingInterval, cycleMode = !1;
const baseUrl = window.location.origin + window.location.pathname;
let currentImageUrl = ""
  , currentCustomLink = []
  , imageName = ""
  , imageSelected = !1
  , kioskMode = !1
  , embedMode = !1
  , inactivityTime = 24e4
  , timeInBetweenCycles = 1e4;
const inputErrorWaitTime = 5e3;
let previousWordTime = 0
  , imageAnimationWaitTime = 150;
var numberOf_A, numberOf_B, numberOf_C, numberOf_D, numberOf_E, numberOf_F, numberOf_G, numberOf_H, numberOf_I, numberOf_J, numberOf_K, numberOf_L, numberOf_M, numberOf_N, numberOf_O, numberOf_P, numberOf_Q, numberOf_R, numberOf_S, numberOf_T, numberOf_U, numberOf_V, numberOf_W, numberOf_X, numberOf_Y, numberOf_Z = [];
const badWords = ["asshole", "arsehole", "arse", "ass", "bitch", "bastard", "bollocks", "bullshit", "brotherfucker", "bugger", "cock", "cocksucker", "cunt", "cabron", "carajo", "chingar", "cono", "dickhead", "dumbass", "dyke", "fuck", "fucker", "fucking", "fag", "faggot", "goddamn", "goddammit", "goddamnit", "gilipollas", "horseshit", "jackass", "joder", "kike", "mother fucker", "motherfucker", "mierda", "nigga", "nigger", "pussy", "penis", "puta", "pendejo", "piss", "slut", "shit", "shite", "twat", "whore"]
  , badWordResponses = ["Please no profanity!", "Only nice language, thank you", "Rude!", "No bad words!", "Cursing will not be tolerated!", "Come on, really?", "Only nice words will be accepted"]
  , cycleWordArray = ["landsat", "satellite", "Earth", "remote sensing", "imagery", "LDCM", "multispectral", "data", "geospatial", "surface monitoring", "Goddard", "JPL", "Langley", "Ames", "Glenn", "Marshall", "Kennedy", "Earth science", "land cover", "ecosystem", "infrared", "GIS", "reflectance", "land surface", "mapping", "electromagnetic", "thermal", "earth", "data", "nasa", "technology", "ocean", "land"];
function enterButtonClick() {
    let input = nameInput.value.trim();
    if (input) {
        let hasLetters;
        if (enterButton.classList.contains("disable") || enterButton.classList.toggle("disable"),
        textBelowTitle.classList.contains("active") && !cycleMode && textBelowTitle.classList.toggle("active"),
        /^[ A-Za-z]+$/.test(input)) {
            let includesBadWords;
            if (input.toLowerCase(),
            containsBadWords(input))
                inputPopup.classList.contains("active") || (inputPopupText.innerHTML = badWordResponses[getRandomInt(0, badWordResponses.length - 1)],
                inputPopup.classList.toggle("active"),
                setTimeout( () => {
                    inputPopup.classList.contains("active") && inputPopup.classList.toggle("active"),
                    enterButton.classList.contains("disable") && enterButton.classList.toggle("disable")
                }
                , 5e3));
            else {
                if (inputPopup.classList.contains("active") && inputPopup.classList.toggle("active"),
                previousWordTime = nameBoxes.children.length * imageAnimationWaitTime + 250,
                nameBoxes.children.length > 0)
                    for (let x = 0; x < nameBoxes.children.length; x++)
                        toggleImageActive(x, nameBoxes.children[x]);
                createImages(input)
            }
        } else
            inputPopup.classList.contains("active") || (inputPopupText.innerHTML = "Please only enter letters from A-Z",
            inputPopup.classList.toggle("active"),
            setTimeout( () => {
                inputPopup.classList.contains("active") && inputPopup.classList.toggle("active"),
                enterButton.classList.contains("disable") && enterButton.classList.toggle("disable")
            }
            , 5e3))
    }
    document.getElementById("title").scrollIntoView({
        behavior: "smooth"
    })
}
function CheckSearchParameters() {
    const params = new URLSearchParams(window.location.search);
    let input = ""
      , customLetterArray = [];
    for (const [key,value] of params)
        "mode" != key && key.includes("img") ? (input += value.charAt(0),
        customLetterArray.push(value)) : "kiosk" == value ? (kioskMode = !0,
        toggleKioskMode()) : "embed" == value && (embedMode = !0,
        toggleEmbedMode());
    input && createImages(input, "", customLetterArray)
}
function GenerateSearchParameters() {
    const params = new URLSearchParams;
    currentCustomLink.forEach( (code, index) => {
        params.set(`img${index + 1}`, code)
    }
    );
    const finalUrl = `${baseUrl}?${params.toString()}`;
    QRCodeGeneration(finalUrl),
    currentImageUrl = finalUrl
}
function containsBadWords(text) {
    const normalizedText = text.toLowerCase();
    return badWords.some(badWord => {
        const regex = new RegExp(`\\b${badWord}\\b`,"i");
        return regex.test(normalizedText)
    }
    )
}
function toggleKioskMode() {
    locationTitle.classList.toggle("kiosk"),
    locationCoordinates.classList.toggle("kiosk"),
    NASALogo.classList.toggle("kiosk"),
    nameBoxes.classList.toggle("kiosk"),
    floatingWrapper.classList.toggle("kiosk"),
    info1.classList.toggle("kiosk"),
    info3.classList.toggle("kiosk"),
    downloadButton.remove(),
    copyLinkButton.remove(),
    cycleMode = !0,
    typeRandomWord(cycleWordArray, nameInput);
    const keyboardDiv = document.createElement("div");
    keyboardDiv.classList.add("simple-keyboard"),
    document.body.appendChild(keyboardDiv)
}
function toggleEmbedMode() {
    locationTitle.classList.toggle("kiosk"),
    locationCoordinates.classList.toggle("kiosk"),
    floatingWrapper.classList.toggle("embed"),
    copyLinkButton.remove(),
    nameBoxes.style.top = "30%",
    header.remove()
}
function startInactivityTimer() {
    console.log("INACTIVITY Timer STARTED"),
    clearTimeout(inactivityTimer),
    clearTimeout(typingInterval),
    clearTimeout(cycleTimer),
    inactivityTimer = setTimeout( () => {
        cycleMode = !0,
        textBelowTitle.classList.contains("active") || (console.log("TOGGLE InactivityTimer"),
        textBelowTitle.classList.toggle("active")),
        typeRandomWord(cycleWordArray, nameInput)
    }
    , inactivityTime)
}
function typeRandomWord(wordsArray, inputElement, typingSpeed=200) {
    const randomWord = wordsArray[Math.floor(Math.random() * wordsArray.length)];
    let currentIndex = 0;
    inputElement.value = "",
    cycleMode && (typingInterval = setInterval( () => {
        currentIndex < randomWord.length ? (inputElement.value += randomWord[currentIndex],
        currentIndex++) : (clearInterval(typingInterval),
        typingInterval = null,
        enterButtonClick(),
        console.log("typing done!"),
        cycleTimer = setTimeout( () => {
            cycleMode && typeRandomWord(wordsArray, inputElement, typingSpeed)
        }
        , timeInBetweenCycles))
    }
    , typingSpeed))
}
function QRCodeGeneration(url) {
    QRCode.toDataURL(url, {
        width: 250,
        margin: 1
    }).then(url => {
        let div = document.getElementById("nameBoxes");
        html2canvas(div, {
            backgroundColor: null,
            logging: !1
        }).then(canvas => {
            const ctx = canvas.getContext("2d")
              , {width: width, height: height} = canvas
              , imageData = ctx.getImageData(0, 0, width, height)
              , data = imageData.data;
            let top = null
              , bottom = null
              , left = null
              , right = null;
            for (let y = 0; y < height; y++)
                for (let x = 0; x < width; x++) {
                    const alpha = data[4 * (y * width + x) + 3];
                    alpha > 0 && (null === top && (top = y),
                    bottom = y,
                    (null === left || x < left) && (left = x),
                    (null === right || x > right) && (right = x))
                }
            let trimmedCanvas = canvas;
            if (null !== top && null !== left && null !== right && null !== bottom) {
                const trimmedWidth = right - left + 1
                  , trimmedHeight = bottom - top + 1;
                trimmedCanvas = document.createElement("canvas"),
                trimmedCanvas.width = trimmedWidth,
                trimmedCanvas.height = trimmedHeight;
                const trimmedCtx = trimmedCanvas.getContext("2d");
                trimmedCtx.drawImage(canvas, left, top, trimmedWidth, trimmedHeight, 0, 0, trimmedWidth, trimmedHeight)
            }
            const imageDataUrl = trimmedCanvas.toDataURL("image/png");
            document.getElementById("final-img").src = imageDataUrl
        }
        ).catch(error => {
            console.error("Error exporting div:", error)
        }
        ),
        document.getElementById("qr-img").src = url,
        document.getElementById("qr-popup").style.display = "flex"
    }
    ).catch(err => {
        console.error(err)
    }
    )
}
function createImages(input, optionalText, customLetterArray) {
    let theInput;
    input ? theInput = input : optionalText && (theInput = optionalText),
    resetLetterArrays(),
    currentCustomLink = [],
    setTimeout( () => {
        for (; nameBoxes.firstChild; )
            nameBoxes.removeChild(nameBoxes.firstChild);
        let gap = convertRange(theInput.length, [1, 50], [1, .1]);
        nameBoxes.style.gap = gap + "%";
        for (let i = 0; i < theInput.length; i++)
            if (" " != theInput[i]) {
                const img = document.createElement("img");
                var name;
                img.setAttribute("draggable", !1),
                name = customLetterArray ? customLetterArray[i] : pickLetterImage(theInput[i]).toLowerCase(),
                img.src = "./images/" + name + ".jpg",
                img.alt = name,
                img.id = "img",
                kioskMode && img.classList.toggle("kiosk"),
                img.addEventListener("mouseover", (function() {
                    imageOver(this, name)
                }
                )),
                img.addEventListener("mouseout", (function() {
                    imageOut(this, name)
                }
                )),
                setTimeout( () => {
                    toggleImageActive(i, img)
                }
                , imageAnimationWaitTime),
                nameBoxes.appendChild(img),
                currentCustomLink.push(name)
            } else {
                const blankDiv = document.createElement("div");
                blankDiv.classList = "blankDiv";
                let width = convertRange(theInput.length, [1, 50], [2, 5]);
                blankDiv.style.width = width + "%",
                nameBoxes.appendChild(blankDiv)
            }
        GenerateSearchParameters(currentCustomLink),
        setTimeout( () => {
            console.log("DONE TYPING OUT LETTER Images"),
            enterButton.classList.contains("disable") && enterButton.classList.toggle("disable")
        }
        , previousWordTime)
    }
    , previousWordTime)
}
function toggleImageActive(i, img) {
    setTimeout((function() {
        img.classList.toggle("active")
    }
    ), imageAnimationWaitTime * i)
}

function pickLetterImage(text) {
    var number = 0, name, index;
    return "a" == text.toLowerCase() ? numberOf_A.length > 0 ? (index = getRandomInt(0, numberOf_A.length - 1),
    number = numberOf_A[index],
    numberOf_A.splice(index, 1)) : number = getRandomInt(0, 3) : "b" == text.toLowerCase() ? numberOf_B.length > 0 ? (index = getRandomInt(0, numberOf_B.length - 1),
    number = numberOf_B[index],
    numberOf_B.splice(index, 1)) : number = getRandomInt(0, 1) : "c" == text.toLowerCase() ? numberOf_C.length > 0 ? (index = getRandomInt(0, numberOf_C.length - 1),
    number = numberOf_C[index],
    numberOf_C.splice(index, 1)) : number = getRandomInt(0, 2) : "d" == text.toLowerCase() ? numberOf_D.length > 0 ? (index = getRandomInt(0, numberOf_D.length - 1),
    number = numberOf_D[index],
    numberOf_D.splice(index, 1)) : number = getRandomInt(0, 1) : "e" == text.toLowerCase() ? numberOf_E.length > 0 ? (index = getRandomInt(0, numberOf_E.length - 1),
    number = numberOf_E[index],
    numberOf_E.splice(index, 1)) : number = getRandomInt(0, 3) : "f" == text.toLowerCase() ? numberOf_F.length > 0 ? (index = getRandomInt(0, numberOf_F.length - 1),
    number = numberOf_F[index],
    numberOf_F.splice(index, 1)) : number = getRandomInt(0, 1) : "g" == text.toLowerCase() ? number = 0 : "h" == text.toLowerCase() ? numberOf_H.length > 0 ? (index = getRandomInt(0, numberOf_H.length - 1),
    number = numberOf_H[index],
    numberOf_H.splice(index, 1)) : number = getRandomInt(0, 1) : "i" == text.toLowerCase() ? numberOf_I.length > 0 ? (index = getRandomInt(0, numberOf_I.length - 1),
    number = numberOf_I[index],
    numberOf_I.splice(index, 1)) : number = getRandomInt(0, 4) : "j" == text.toLowerCase() ? numberOf_J.length > 0 ? (index = getRandomInt(0, numberOf_J.length - 1),
    number = numberOf_J[index],
    numberOf_J.splice(index, 1)) : number = getRandomInt(0, 1) : "k" == text.toLowerCase() ? numberOf_K.length > 0 ? (index = getRandomInt(0, numberOf_K.length - 1),
    number = numberOf_K[index],
    numberOf_K.splice(index, 1)) : number = getRandomInt(0, 1) : "l" == text.toLowerCase() ? numberOf_L.length > 0 ? (index = getRandomInt(0, numberOf_L.length - 1),
    number = numberOf_L[index],
    numberOf_L.splice(index, 1)) : number = getRandomInt(0, 3) : "m" == text.toLowerCase() ? numberOf_M.length > 0 ? (index = getRandomInt(0, numberOf_M.length - 1),
    number = numberOf_M[index],
    numberOf_M.splice(index, 1)) : number = getRandomInt(0, 2) : "n" == text.toLowerCase() ? numberOf_N.length > 0 ? (index = getRandomInt(0, numberOf_N.length - 1),
    number = numberOf_N[index],
    numberOf_N.splice(index, 1)) : number = getRandomInt(0, 2) : "o" == text.toLowerCase() ? numberOf_O.length > 0 ? (index = getRandomInt(0, numberOf_O.length - 1),
    number = numberOf_O[index],
    numberOf_O.splice(index, 1)) : number = getRandomInt(0, 1) : "p" == text.toLowerCase() ? numberOf_P.length > 0 ? (index = getRandomInt(0, numberOf_P.length - 1),
    number = numberOf_P[index],
    numberOf_P.splice(index, 1)) : number = getRandomInt(0, 1) : "q" == text.toLowerCase() ? numberOf_Q.length > 0 ? (index = getRandomInt(0, numberOf_Q.length - 1),
    number = numberOf_Q[index],
    numberOf_Q.splice(index, 1)) : number = getRandomInt(0, 1) : "r" == text.toLowerCase() ? numberOf_R.length > 0 ? (index = getRandomInt(0, numberOf_R.length - 1),
    number = numberOf_R[index],
    numberOf_R.splice(index, 1)) : number = getRandomInt(0, 3) : "s" == text.toLowerCase() ? numberOf_S.length > 0 ? (index = getRandomInt(0, numberOf_S.length - 1),
    number = numberOf_S[index],
    numberOf_S.splice(index, 1)) : number = getRandomInt(0, 2) : "t" == text.toLowerCase() ? numberOf_T.length > 0 ? (index = getRandomInt(0, numberOf_T.length - 1),
    number = numberOf_T[index],
    numberOf_T.splice(index, 1)) : number = getRandomInt(0, 1) : "u" == text.toLowerCase() ? numberOf_U.length > 0 ? (index = getRandomInt(0, numberOf_U.length - 1),
    number = numberOf_U[index],
    numberOf_U.splice(index, 1)) : number = getRandomInt(0, 1) : "v" == text.toLowerCase() ? numberOf_V.length > 0 ? (index = getRandomInt(0, numberOf_V.length - 1),
    number = numberOf_V[index],
    numberOf_V.splice(index, 1)) : number = getRandomInt(0, 3) : "w" == text.toLowerCase() ? numberOf_W.length > 0 ? (index = getRandomInt(0, numberOf_W.length - 1),
    number = numberOf_W[index],
    numberOf_W.splice(index, 1)) : number = getRandomInt(0, 1) : "x" == text.toLowerCase() ? numberOf_X.length > 0 ? (index = getRandomInt(0, numberOf_X.length - 1),
    number = numberOf_X[index],
    numberOf_X.splice(index, 1)) : number = getRandomInt(0, 2) : "y" == text.toLowerCase() ? numberOf_X.length > 0 ? (index = getRandomInt(0, numberOf_X.length - 1),
    number = numberOf_X[index],
    numberOf_X.splice(index, 1)) : number = getRandomInt(0, 2) : "z" == text.toLowerCase() && (numberOf_Z.length > 0 ? (index = getRandomInt(0, numberOf_Z.length - 1),
    number = numberOf_Z[index],
    numberOf_Z.splice(index, 1)) : number = getRandomInt(0, 1)),
    name = text + "_" + number
}
function getRandomInt(min, max) {
    return min = Math.ceil(min),
    max = Math.floor(max),
    Math.floor(Math.random() * (max - min + 1)) + min
}
function imageOver(x) {
    imageSelected || imageDescriptions(x)
}
function imageOut(x) {}
function resetLetterArrays() {
    numberOf_A = [0, 1, 2, 3, 4],
    numberOf_B = [0, 1],
    numberOf_C = [0, 1, 2],
    numberOf_D = [0, 1],
    numberOf_E = [0, 1, 2, 3],
    numberOf_F = [0, 1],
    numberOf_G = [0],
    numberOf_H = [0, 1],
    numberOf_I = [0, 1, 2, 3, 4],
    numberOf_J = [0, 1, 2],
    numberOf_K = [0, 1],
    numberOf_L = [0, 1, 2, 3],
    numberOf_M = [0, 1, 2],
    numberOf_N = [0, 1, 2],
    numberOf_O = [0, 1],
    numberOf_P = [0, 1],
    numberOf_Q = [0, 1],
    numberOf_R = [0, 1, 2, 3],
    numberOf_S = [0, 1, 2],
    numberOf_T = [0, 1],
    numberOf_U = [0, 1],
    numberOf_V = [0, 1, 2, 3],
    numberOf_W = [0, 1],
    numberOf_X = [0, 1, 2],
    numberOf_Y = [0, 1],
    numberOf_Z = [0, 1]
}
function imageDescriptions(x) {
    locationTitle.classList.contains("active") || locationTitle.classList.toggle("active"),
    locationCoordinates.classList.contains("active") || locationCoordinates.classList.toggle("active"),
    "a_0" == x.alt && (locationTitle.innerHTML = "Hickman, Kentucky",
    locationTitle.href = "https://go.nasa.gov/3zotXEt",
    locationCoordinates.innerHTML = "36°35'20.8 N 89°20'26.9 W",
    locationCoordinates.href = "https://www.google.com/maps/place/36%C2%B035'20.8%22N+89%C2%B020'26.9%22W/@36.5689533,-89.4212718,11.38z/data=!4m4!3m3!8m2!3d36.5891111!4d-89.3408056?entry=ttu"),
    "a_1" == x.alt && (locationTitle.innerHTML = "Farm Island, Maine",
    locationTitle.href = "https://apps.sentinel-hub.com/eo-browser/?zoom=12&lat=45.72955&lng=-69.82498&themeId=DEFAULT-THEME&visualizationUrl=U2FsdGVkX18%2FHSd6JTieOsaYIJZjmwSh1wZLiy3KHcN7c4bQZKnHzW7qhlyXWLu75IU4xUNArTK96RN61PFDbDHJ5Xp%2FPStjjG5zLiRsMOxqu1ir7hZZHEaOJf%2FGRXwb&datasetId=AWS_LOTL1&fromTime=2024-02-18T00%3A00%3A00.000Z&toTime=2024-02-18T23%3A59%3A59.999Z&layerId=1_TRUE_COLOR&demSource3D=%22MAPZEN%22",
    locationCoordinates.innerHTML = "45°43'43.8 N 69°46'08.9 W",
    locationCoordinates.href = "https://www.google.com/maps/place/45%C2%B043'45.4%22N+69%C2%B046'04.7%22W/@45.7292113,-69.7763592,6123m/data=!3m1!1e3!4m4!3m3!8m2!3d45.729275!4d-69.76798?entry=ttu"),
    "a_2" == x.alt && (locationTitle.innerHTML = "Lake Guakhmaz, Azerbaijan",
    locationTitle.href = "https://none.com",
    locationCoordinates.innerHTML = "40°39'50.8 N 47°06'36.2 E",
    locationCoordinates.href = "https://maps.app.goo.gl/tnrVaiMuFiGacH746"),
    "a_3" == x.alt && (locationTitle.innerHTML = "Yukon Delta, Alaska",
    locationTitle.href = "https://go.nasa.gov/3T5GSlu",
    locationCoordinates.innerHTML = "62°33'17.7 N 164°56'10.3 W",
    locationCoordinates.href = "https://maps.app.goo.gl/AuARuTMTcT2ugLnq5"),
    "a_4" == x.alt && (locationTitle.innerHTML = "Lake Mjøsa, Norway",
    locationTitle.href = "https://none.com",
    locationCoordinates.innerHTML = "60°45'52.7 N 10°56'43.2 E",
    locationCoordinates.href = "https://maps.app.goo.gl/2KHYmEMruQzgRTBb9"),
    "b_0" == x.alt && (locationTitle.innerHTML = "Holla Bend, Arkansas",
    locationTitle.href = "https://earthobservatory.nasa.gov/images/87241/the-alphabet-from-orbit-letter-b",
    locationCoordinates.innerHTML = "35°08'41.1 N 93°03'16.5 W",
    locationCoordinates.href = "https://www.google.com/maps/place/35%C2%B008'41.1%22N+93%C2%B003'16.5%22W/@35.150256,-93.0998349,20284m/data=!3m1!1e3!4m4!3m3!8m2!3d35.14475!4d-93.0545833?entry=ttu"),
    "b_1" == x.alt && (locationTitle.innerHTML = "Humaitá, Brazil",
    locationTitle.href = "https://apps.sentinel-hub.com/eo-browser/?zoom=12&lat=-7.59581&lng=-62.89192&themeId=DEFAULT-THEME&visualizationUrl=U2FsdGVkX18apdBT62HBIZ0ciT9rWDoSSvm91S%2BCMWuHGqXT7coXfm0CczjLG432T5axTsIi5sR2tVn7tFs95d9lu6xAAsh6kxM5tTJVRKG5HZBLC2Hl5wlZ0uxtSEVw&datasetId=AWS_LOTL1&fromTime=2023-07-06T00%3A00%3A00.000Z&toTime=2023-07-06T23%3A59%3A59.999Z&layerId=2_TRUE_COLOR_PANSHARPENED&demSource3D=%22MAPZEN%22",
    locationCoordinates.innerHTML = "7°37'00.1 S 62°55'17.0 W",
    locationCoordinates.href = "https://maps.app.goo.gl/BpsMZRtaDWr6jb9W8"),
    "c_0" == x.alt && (locationTitle.innerHTML = "Black Rock Desert, Nevada",
    locationTitle.href = "https://earthobservatory.nasa.gov/images/151802/summer-rains-on-nevadas-black-rock-playa?src=ve",
    locationCoordinates.innerHTML = "40°47'15.8 N 119°12'13.0 W",
    locationCoordinates.href = "https://www.google.com/maps/place/40%C2%B047'15.8%22N+119%C2%B012'13.0%22W/@40.7765477,-119.2977163,26799m/data=!3m1!1e3!4m4!3m3!8m2!3d40.7877222!4d-119.2036111?entry=ttu"),
    "c_1" == x.alt && (locationTitle.innerHTML = "Deception Island, Antarctica",
    locationTitle.href = "https://earthobservatory.nasa.gov/images/146164/the-island-shaped-like-a-horseshoe",
    locationCoordinates.innerHTML = "62°57'22.3 S 60°38'32.8 W",
    locationCoordinates.href = "https://www.google.com/maps/place/62%C2%B057'22.3%22S+60%C2%B038'32.8%22W/@-62.9597921,-60.8265853,38265m/data=!3m1!1e3!4m4!3m3!8m2!3d-62.9561944!4d-60.6424444?entry=ttu"),
    "c_2" == x.alt && (locationTitle.innerHTML = "False River, Louisiana",
    locationTitle.href = "https://apps.sentinel-hub.com/eo-browser/?zoom=11&lat=30.64352&lng=-91.46324&themeId=DEFAULT-THEME&visualizationUrl=U2FsdGVkX1%2Fa1U9bEMXeDYeinWHxvi5LmLVtnUa3pvvao%2B08f3KVVqH1lh%2ByawbTq4XlPTmZXT2t5d%2BW2cjixfCFyiO%2B4vCo1WUlyOkChQyEoj4h5oWBGnDIkB3FBLgY&datasetId=AWS_LOTL1&fromTime=2024-06-14T00%3A00%3A00.000Z&toTime=2024-06-14T23%3A59%3A59.999Z&layerId=1_TRUE_COLOR&demSource3D=%22MAPZEN%22",
    locationCoordinates.innerHTML = "30°38'39.7 N 91°26'45.7 W",
    locationCoordinates.href = "https://www.google.com/maps/place/30%C2%B038'39.7%22N+91%C2%B026'45.7%22W/@30.6517944,-91.5063747,22066m/data=!3m1!1e3!4m4!3m3!8m2!3d30.644357!4d-91.446029?entry=ttu"),
    "d_0" == x.alt && (locationTitle.innerHTML = "Akimiski Island, Canada",
    locationTitle.href = "https://earthobservatory.nasa.gov/images/8657/akimiski-island-canada",
    locationCoordinates.innerHTML = "53°00'58.5 N 81°18'24.6 W",
    locationCoordinates.href = "https://www.google.com/maps/place/53%C2%B000'58.5%22N+81%C2%B018'24.6%22W/@52.8535127,-81.6813828,147353m/data=!3m1!1e3!4m4!3m3!8m2!3d53.01625!4d-81.3068333?entry=ttu"),
    "d_1" == x.alt && (locationTitle.innerHTML = "Lake Tandou, Australia",
    locationTitle.href = "https://apps.sentinel-hub.com/eo-browser/?zoom=10&lat=-32.63764&lng=141.99142&themeId=DEFAULT-THEME&visualizationUrl=U2FsdGVkX1%2BzKcE7kPlfLMVBA32qupZONOT2XHXYc4WOzpkn0yeK%2BqqfLarzaJtSu%2FqhbCdKawLCU5ucZvccnFhQQIqggiiN7AGb0fRxSJ5PxvYC6p1D2CwYeVTfUbPd&datasetId=AWS_LOTL1&fromTime=2023-08-08T00%3A00%3A00.000Z&toTime=2023-08-08T23%3A59%3A59.999Z&layerId=2_TRUE_COLOR_PANSHARPENED&demSource3D=%22MAPZEN%22",
    locationCoordinates.innerHTML = "32°37'17.8 S 142°04'21.4 E",
    locationCoordinates.href = "https://maps.app.goo.gl/z3kPn1HxZUxS4FMCA"),
    "e_0" == x.alt && (locationTitle.innerHTML = "Firn-filled Fjords, Tibet",
    locationTitle.href = "https://assets.science.nasa.gov/content/dam/science/esd/eo/content-feature/abc/images/f/tibet_oli_2014116_lrg.jpg",
    locationCoordinates.innerHTML = "29°15'46.9 N 96°19'03.8 E",
    locationCoordinates.href = "https://www.google.com/maps/place/29%C2%B015'46.9%22N+96%C2%B019'03.8%22E/@29.2803917,96.192327,59727m/data=!3m1!1e3!4m13!1m8!3m7!1s0x3761317e9c4a2cc1:0x1fc12c628413da99!2sTibet,+China!3b1!8m2!3d29.6472399!4d91.11745!16zL20vMGY4bmY!3m3!8m2!3d29.26304!4d96.317724!5m1!1e4?entry=ttu"),
    "e_1" == x.alt && (locationTitle.innerHTML = "Sea of Okhotsk",
    locationTitle.href = "https://go.nasa.gov/3WY3qqK",
    locationCoordinates.innerHTML = "54°42'50.3 N 136°34'20.4 E",
    locationCoordinates.href = "https://www.google.com/maps/place/54%C2%B042'50.3%22N+136%C2%B034'20.4%22E/@54.713983,136.5674735,556m/data=!3m1!1e3!4m12!1m7!3m6!1s0x58c264a91dfb3971:0xa9181fd1ed34bb71!2sSea+of+Okhotsk!8m2!3d52.873623!4d149.3658173!16zL20vMGZ3azA!3m3!8m2!3d54.71398!4d136.572339?entry=ttu"),
    "e_2" == x.alt && (locationTitle.innerHTML = "Bellona Plateau",
    locationTitle.href = "https://earthobservatory.nasa.gov/images/151169/stirring-up-carbonate-in-the-coral-sea​",
    locationCoordinates.innerHTML = "20°30'00.0 S 158°30'00.0 E",
    locationCoordinates.href = "https://www.google.com/maps/place/20%C2%B030'00.0%22S+158%C2%B030'00.0%22E/@-16.8094327,154.1932946,5.04z/data=!4m4!3m3!8m2!3d-20.5!4d158.5?entry=ttu"),
    "e_3" == x.alt && (locationTitle.innerHTML = "Breiðamerkurjökull Glacier, Iceland",
    locationTitle.href = "https://go.nasa.gov/3AG3ZNj​",
    locationCoordinates.innerHTML = "64°05'45.0 N 16°21'45.6 W",
    locationCoordinates.href = "https://maps.app.goo.gl/6xoCUtSu99xvXZ8S6"),
    "f_0" == x.alt && (locationTitle.innerHTML = "Mato Grosso, Brazil",
    locationTitle.href = "https://worldview.earthdata.nasa.gov/?v=-55.64818728546823,-14.008907715628611,-54.983509640598605,-13.663154175100724&l=Reference_Labels_15m(hidden),Reference_Features_15m(hidden),Coastlines_15m,HLS_L30_Nadir_BRDF_Adjusted_Reflectance,VIIRS_NOAA21_CorrectedReflectance_TrueColor(hidden),VIIRS_NOAA20_CorrectedReflectance_TrueColor(hidden),VIIRS_SNPP_CorrectedReflectance_TrueColor(hidden),MODIS_Aqua_CorrectedReflectance_TrueColor(hidden),MODIS_Terra_CorrectedReflectance_TrueColor&lg=true&t=2024-07-06-T15%3A01%3A15Z",
    locationCoordinates.innerHTML = "13°50'26.9 S 55°17'55.0 W",
    locationCoordinates.href = "https://maps.app.goo.gl/tXas4c27VuWi2pwk6"),
    "f_1" == x.alt && (locationTitle.innerHTML = "Kruger National Park, South Africa",
    locationTitle.href = "https://go.nasa.gov/3AdjEDu",
    locationCoordinates.innerHTML = "28°44'01.3 S 29°12'30.1 E",
    locationCoordinates.href = "https://maps.app.goo.gl/a1UArynvAqGGYMXg6"),
    "g_0" == x.alt && (locationTitle.innerHTML = "Fonte Boa, Amazonas",
    locationTitle.href = "https://none.com​",
    locationCoordinates.innerHTML = "2°26'30.8 S 66°16'43.7 W",
    locationCoordinates.href = "https://www.google.com/maps/place/2%C2%B026'30.8%22S+66%C2%B016'43.7%22W/@-2.4639488,-66.4453563,11z/data=!4m4!3m3!8m2!3d-2.4419!4d-66.2788?entry=ttu"),
    "h_0" == x.alt && (locationTitle.innerHTML = "Southwestern Kyrgyzstan",
    locationTitle.href = "https://go.nasa.gov/46DrQsV​",
    locationCoordinates.innerHTML = "40°14'03.6 N 71°14'22.8 E",
    locationCoordinates.href = "https://maps.app.goo.gl/gRTJ6rDiiXJhT1mD9"),
    "h_1" == x.alt && (locationTitle.innerHTML = "Khorinsky District, Russia",
    locationTitle.href = "https://none.com​",
    locationCoordinates.innerHTML = "52°02'50.4 N 109°46'51.2 E",
    locationCoordinates.href = "https://maps.app.goo.gl/TLEGWnEGY8P3HUri9"),
    "i_0" == x.alt && (locationTitle.innerHTML = "Borgarbyggð, Iceland",
    locationTitle.href = "https://apps.sentinel-hub.com/eo-browser/?zoom=11&lat=64.78787&lng=-22.57242&themeId=DEFAULT-THEME&visualizationUrl=U2FsdGVkX194EmWiFw43hEItR4oMSSn7sLDV1fSwF0Va3Xb%2FYZfz3%2BxHbwk26S%2Be3ydFuvY5MsvihykFJkwEUcFrJ8Pz8ca3jV71cM1tbvlNsmHd%2BkRv87uDiQPP9z57&datasetId=AWS_LOTL1&fromTime=2024-03-28T00%3A00%3A00.000Z&toTime=2024-03-28T23%3A59%3A59.999Z&layerId=1_TRUE_COLOR&demSource3D=%22MAPZEN%22​",
    locationCoordinates.innerHTML = "64°45'46.4 N 22°27'28.0 W",
    locationCoordinates.href = "https://www.google.com/maps/place/64%C2%B045'46.4%22N+22%C2%B027'28.0%22W/@64.7585629,-22.5872018,27545m/data=!3m1!1e3!4m4!3m3!8m2!3d64.7628889!4d-22.4577778?entry=ttu"),
    "i_1" == x.alt && (locationTitle.innerHTML = "Canandaigua Lake, New York",
    locationTitle.href = "https://apps.sentinel-hub.com/eo-browser/?zoom=10&lat=42.81807&lng=-77.37259&themeId=DEFAULT-THEME&visualizationUrl=U2FsdGVkX1%2Bq%2BJCRrY6U3aoJ%2Brj%2F7DY6EW6AuueIWAjNyKhLOW9Nc8rB8k5An2t4RlWrv0mCI9hNVG5J3UMy6T9AmSeAjDLBr69TsI7lvPTXUAH5Fr%2FVokwC1Zh8qNHS&datasetId=AWS_LOTL1&fromTime=2024-04-26T00%3A00%3A00.000Z&toTime=2024-04-26T23%3A59%3A59.999Z&layerId=1_TRUE_COLOR&demSource3D=%22MAPZEN%22​",
    locationCoordinates.innerHTML = "42°47'11.0 N 77°42'58.1 W",
    locationCoordinates.href = "https://maps.app.goo.gl/jNsDTfUadwb8jBVL6"),
    "i_2" == x.alt && (locationTitle.innerHTML = "Etosha National Park, Namibia",
    locationTitle.href = "https://eros.usgs.gov/media-gallery/earth-as-art/6/salty-desolation​",
    locationCoordinates.innerHTML = "18°29'15.2 S 16°10'14.6 E",
    locationCoordinates.href = "https://maps.app.goo.gl/s6ujVrXGJKnbrppH7"),
    "i_3" == x.alt && (locationTitle.innerHTML = "Djebel Ouarkziz, Morocco",
    locationTitle.href = "https://go.nasa.gov/3AOs2tn​",
    locationCoordinates.innerHTML = "28°18'01.5 N 10°33'58.5 W",
    locationCoordinates.href = "https://maps.app.goo.gl/osEU3NnVtShw6CBN9"),
    "i_4" == x.alt && (locationTitle.innerHTML = "Holuhraun Ice Field, iceland",
    locationTitle.href = "https://go.nasa.gov/3yVc7cd​",
    locationCoordinates.innerHTML = "64°51'11.2 N 16°49'37.2 W",
    locationCoordinates.href = "https://maps.app.goo.gl/ys3A1PGKvF6MCGWP7"),
    "j_0" == x.alt && (locationTitle.innerHTML = "Great Barrier Reef",
    locationTitle.href = "https://worldview.earthdata.nasa.gov/?v=146.1248187792869,-18.735903515172936,147.59594425519202,-17.899497498630097&l=Reference_Labels_15m(hidden),Reference_Features_15m(hidden),Coastlines_15m,HLS_L30_Nadir_BRDF_Adjusted_Reflectance,VIIRS_NOAA21_CorrectedReflectance_TrueColor(hidden),VIIRS_NOAA20_CorrectedReflectance_TrueColor(hidden),VIIRS_SNPP_CorrectedReflectance_TrueColor(hidden),MODIS_Aqua_CorrectedReflectance_TrueColor(hidden),MODIS_Terra_CorrectedReflectance_TrueColor&lg=true&s=-93.0518,35.1662%2B-116.6554,39.3565%2B-119.056,40.9107%2B-119.2064,40.7852%2B-81.2747,53.0084%2B146.8476,-18.3487&t=2023-09-01-T18%3A03%3A26Z​",
    locationCoordinates.innerHTML = "18°20'55.3 S 146°50'51.4 E",
    locationCoordinates.href = "https://www.google.com/maps/place/18%C2%B020'55.3%22S+146%C2%B050'51.4%22E/@-18.3013843,146.8642487,39611m/data=!3m1!1e3!4m4!3m3!8m2!3d-18.3487!4d146.8476?entry=ttu"),
    "j_1" == x.alt && (locationTitle.innerHTML = "Karakaya Dam, Turkey",
    locationTitle.href = "https://go.nasa.gov/3QE3Wa1​",
    locationCoordinates.innerHTML = "38°29'37.7 N 38°26'39.5 E",
    locationCoordinates.href = "https://www.google.com/maps/place/38%C2%B029'37.7%22N+38%C2%B026'39.5%22E/@38.5489247,38.208631,112968m/data=!3m1!1e3!4m4!3m3!8m2!3d38.4938!4d38.4443?entry=ttu"),
    "j_2" == x.alt && (locationTitle.innerHTML = "Lake Superior, North America",
    locationTitle.href = "https://go.nasa.gov/3AHLYOJ​",
    locationCoordinates.innerHTML = "46°41'10.2 N 90°23'11.5 W",
    locationCoordinates.href = "https://maps.app.goo.gl/PFWzBnFTCXwpGDKJ8"),
    "k_0" == x.alt && (locationTitle.innerHTML = "Sirmilik National Park, Canada",
    locationTitle.href = "https://go.nasa.gov/4fPJ0b0​",
    locationCoordinates.innerHTML = "72°05'01.1 N 76°48'42.9 W",
    locationCoordinates.href = "https://www.google.com/maps/place/72%C2%B005'01.1%22N+76%C2%B048'42.9%22W/@72.1091739,-77.3683173,70440m/data=!3m1!1e3!4m12!1m7!3m6!1s0x4e17b70e5a3af4b1:0x1e43c34c0c4309a2!2sSirmilik+National+Park!8m2!3d73.3652488!4d-79.0152625!16zL20vMDZmeDZk!3m3!8m2!3d72.083628!4d-76.811917?entry=ttu"),
    "k_1" == x.alt && (locationTitle.innerHTML = "Golmud, China",
    locationTitle.href = "https://go.nasa.gov/4dhbqbY",
    locationCoordinates.innerHTML = "35°36'46.3 N 95°03'45.9 E",
    locationCoordinates.href = "https://maps.app.goo.gl/UweKoxYbPbz1xbY38"),
    "l_0" == x.alt && (locationTitle.innerHTML = "Nusantara, Indonesia",
    locationTitle.href = "https://earthobservatory.nasa.gov/images/152471/nusantara-a-new-capital-city-in-the-forest%20%E2%80%8B",
    locationCoordinates.innerHTML = "0°58'18.1 S 116°41'58.9 E",
    locationCoordinates.href = "https://www.google.com/maps/place/0%C2%B058'18.1%22S+116%C2%B041'58.9%22E/@-0.9725262,116.6947405,2641m/data=!3m1!1e3!4m12!1m7!3m6!1s0x2df6c93c8bb52e15:0x238de9438b4d18a8!2z64iE7IKw7YOA6528!8m2!3d-0.9746384!4d116.7094308!16s%2Fm%2F03bw_z_!3m3!8m2!3d-0.971695!4d116.699694?entry=ttu"),
    "l_1" == x.alt && (locationTitle.innerHTML = "Xinjiang, China",
    locationTitle.href = "https://earthobservatory.nasa.gov/images/82853/faults-in-xinjiang​",
    locationCoordinates.innerHTML = "40°04'02.8 N 77°40'00.7 E",
    locationCoordinates.href = "https://www.google.com/maps/place/40%C2%B004'02.8%22N+77%C2%B040'00.7%22E/@40.0613207,77.5606821,20116m/data=!3m1!1e3!4m7!1m2!2m1!1sTien+Shan+mountains!3m3!8m2!3d40.067453!4d77.666852?entry=ttu"),
    "l_2" == x.alt && (locationTitle.innerHTML = "Regina, Saskatchewan, Canada",
    locationTitle.href = "https://go.nasa.gov/3BwPLPd",
    locationCoordinates.innerHTML = "50°11'51.7 N 104°17'15.4 W",
    locationCoordinates.href = "https://maps.app.goo.gl/iVppLmYh44QxDr9c9"),
    "l_3" == x.alt && (locationTitle.innerHTML = "Regina, Saskatchewan, Canada",
    locationTitle.href = "https://go.nasa.gov/3BwPLPd",
    locationCoordinates.innerHTML = "50°12'41.3 N 104°43'38.1 W",
    locationCoordinates.href = "https://maps.app.goo.gl/Aa6mwzvmMJXRw3Gf8"),
    "m_0" == x.alt && (locationTitle.innerHTML = "Shenandoah River, Virginia",
    locationTitle.href = "https://earthobservatory.nasa.gov/images/84837/the-sinuous-shenandoah​",
    locationCoordinates.innerHTML = "38°46'32.2 N 78°24'07.1 W",
    locationCoordinates.href = "https://www.google.com/maps/place/Shenandoah+River/@38.7773712,-78.4192219,6454m/data=!3m1!1e3!4m7!3m6!1s0x89b6047d550cb7f7:0x83e4ccba6e682c02!4b1!8m2!3d39.1019371!4d-77.9660084!16zL20vMDMzejYz?entry=ttu"),
    "m_1" == x.alt && (locationTitle.innerHTML = "Potomac River",
    locationTitle.href = "https://earthobservatory.nasa.gov/images/88880/paw-paw-bends​",
    locationCoordinates.innerHTML = "38°46'32.2 N 78°24'07.1 W",
    locationCoordinates.href = "https://www.google.com/maps/place/Shenandoah+River/@38.7773712,-78.4192219,6454m/data=!3m1!1e3!4m7!3m6!1s0x89b6047d550cb7f7:0x83e4ccba6e682c02!4b1!8m2!3d39.1019371!4d-77.9660084!16zL20vMDMzejYz?entry=ttu"),
    "m_2" == x.alt && (locationTitle.innerHTML = "Tian Shan Mountains, Kyrgyzstan",
    locationTitle.href = "https://go.nasa.gov/3SIaKUY​",
    locationCoordinates.innerHTML = "42°07'16.4 N 80°02'44.1 E",
    locationCoordinates.href = "https://maps.app.goo.gl/Ja3ZAHeuTNCRNFMN9"),
    "n_0" == x.alt && (locationTitle.innerHTML = "Yapacani, Bolivia",
    locationTitle.href = "https://go.nasa.gov/4dzcbNt​",
    locationCoordinates.innerHTML = "17°18'29.7 S 63°53'19.0 W",
    locationCoordinates.href = "https://maps.app.goo.gl/5rXL3mESWj2YsTWj6"),
    "n_1" == x.alt && (locationTitle.innerHTML = "Yapacani, Bolivia",
    locationTitle.href = "https://go.nasa.gov/3YDgcMw​",
    locationCoordinates.innerHTML = "17°18'29.7 S 63°53'19.0 W",
    locationCoordinates.href = "https://maps.app.goo.gl/5rXL3mESWj2YsTWj6"),
    "n_2" == x.alt && (locationTitle.innerHTML = "São Miguel do Araguaia, Brazil",
    locationTitle.href = "https://go.nasa.gov/3AgO2wO​",
    locationCoordinates.innerHTML = "12°56'44.3 S 50°29'42.0 W",
    locationCoordinates.href = "https://maps.app.goo.gl/1HtmMe82x2XdabT99"),
    "o_0" == x.alt && (locationTitle.innerHTML = "Crater Lake, Oregon",
    locationTitle.href = "https://earthobservatory.nasa.gov/images/151161/a-clear-view-of-crater-lake​",
    locationCoordinates.innerHTML = "42°56'10.0 N 122°06'04.7 W",
    locationCoordinates.href = "https://maps.app.goo.gl/S9sJeZ6iHBVJuGu37"),
    "o_1" == x.alt && (locationTitle.innerHTML = "Manicouagan Reservoir",
    locationTitle.href = "​https://none.com",
    locationCoordinates.innerHTML = "51°22'42.4 N 68°40'27.2 W",
    locationCoordinates.href = "https://maps.app.goo.gl/E6Rn3yeQkYuagviG7"),
    "p_0" == x.alt && (locationTitle.innerHTML = "Mackenzie River Delta, Canada",
    locationTitle.href = "https://earthobservatory.nasa.gov/images/8320/mackenzie-river-delta-canada​",
    locationCoordinates.innerHTML = "68°12'54.4 N 134°23'15.3 W",
    locationCoordinates.href = "https://www.google.com/maps/place/68%C2%B012'54.4%22N+134%C2%B023'15.3%22W/@68.2079858,-134.5221453,23980m/data=!3m1!1e3!4m4!3m3!8m2!3d68.215103!4d-134.387585?entry=ttu"),
    "p_1" == x.alt && (locationTitle.innerHTML = "Riberalta, Bolivia",
    locationTitle.href = "https://apps.sentinel-hub.com/eo-browser/?zoom=11&lat=-10.89973&lng=-66.06422&themeId=DEFAULT-THEME&visualizationUrl=U2FsdGVkX18ySUge%2FIfc3iW7AU2HUZXzJJ1Myi1j9znNnP%2BBkPvcqQCSbcw5KXus9Kfcstc9dn7G4A6PWR%2BNTMGR%2BKYH%2FUqs2iwP2GFi4SXK3csoSCDgPmk2uoKpBjRL&datasetId=AWS_LOTL1&fromTime=2022-06-24T00%3A00%3A00.000Z&toTime=2022-06-24T23%3A59%3A59.999Z&layerId=2_TRUE_COLOR_PANSHARPENED&demSource3D=%22MAPZEN%22​",
    locationCoordinates.innerHTML = "10°52'44.0 S 66°02'52.0 W",
    locationCoordinates.href = "https://maps.app.goo.gl/sW32pDeYpN3JQQT18"),
    "q_0" == x.alt && (locationTitle.innerHTML = "Lonar Crater, India",
    locationTitle.href = "https://go.nasa.gov/3SI0oVa​",
    locationCoordinates.innerHTML = "19°58'36.8 N 76°30'30.6 E",
    locationCoordinates.href = "https://maps.app.goo.gl/vNSZuSEAV22k2UScA"),
    "q_1" == x.alt && (locationTitle.innerHTML = "Mount Tambora, Indonesia",
    locationTitle.href = "https://go.nasa.gov/3VYFv8T​",
    locationCoordinates.innerHTML = "8°14'31.3 S 117°59'31.2 E",
    locationCoordinates.href = "https://maps.app.goo.gl/1KcvrspMtYDs1qSi8"),
    "r_0" == x.alt && (locationTitle.innerHTML = "Lago Menendez, Argentina",
    locationTitle.href = "https://assets.science.nasa.gov/content/dam/science/esd/eo/content-feature/abc/images/r/lagomenendez_oli_2015021_lrg.jpg",
    locationCoordinates.innerHTML = "42°41'14.9 S 71°52'21.7 W",
    locationCoordinates.href = "https://www.google.com/maps/place/42%C2%B041'14.9%22S+71%C2%B052'21.7%22W/@-42.6921215,-71.9452812,30666m/data=!3m1!1e3!4m12!1m7!3m6!1s0x961c217407edac45:0xb660993af48f583f!2sLake+Men%C3%A9ndez!8m2!3d-42.6849165!4d-71.8274846!16s%2Fg%2F120l2rkc!3m3!8m2!3d-42.687479!4d-71.872688?entry=ttu"),
    "r_1" == x.alt && (locationTitle.innerHTML = "Province of Sondrio, Italy",
    locationTitle.href = "https://go.nasa.gov/4fFoM3n",
    locationCoordinates.innerHTML = "46°17'38.3 N 9°25'14.5 E",
    locationCoordinates.href = "https://maps.app.goo.gl/MDCo37rLRQGCvDJp8"),
    "r_2" == x.alt && (locationTitle.innerHTML = "Florida Keys",
    locationTitle.href = "https://go.nasa.gov/4dpOI1x",
    locationCoordinates.innerHTML = "24°45'30.4 N 81°31'53.6 W",
    locationCoordinates.href = "https://maps.app.goo.gl/CfSnUcNriFtWBrEQ8"),
    "r_3" == x.alt && (locationTitle.innerHTML = "Canyonlands National Park, Utah",
    locationTitle.href = "https://go.nasa.gov/3yZHEK3",
    locationCoordinates.innerHTML = "38°26'27.8 N 109°45'03.3 W",
    locationCoordinates.href = "https://maps.app.goo.gl/Bt89EafENbXXLmPPA"),
    "s_0" == x.alt && (locationTitle.innerHTML = "Mackenzie River",
    locationTitle.href = "https://earthobservatory.nasa.gov/images/89870/where-trucks-drive-on-the-river",
    locationCoordinates.innerHTML = "68°25'01.0 N 134°08'35.2 W",
    locationCoordinates.href = "https://www.google.com/maps/place/Tuktoyaktuk,+NT,+Canada/@68.408019,-134.2820739,33486m/data=!3m1!1e3!4m6!3m5!1s0x5113cb935c41b04d:0x1155e872d8421ea3!8m2!3d69.445358!4d-133.034181!16zL20vMDNwOXF4?entry=ttu"),
    "s_1" == x.alt && (locationTitle.innerHTML = "N’Djamena, Chad",
    locationTitle.href = "https://earthobservatory.nasa.gov/images/150521/flooding-in-ndjamena",
    locationCoordinates.innerHTML = "12°00'27.7 N 15°03'46.2 E",
    locationCoordinates.href = "https://www.google.com/maps/place/12%C2%B000'27.7%22N+15%C2%B003'46.2%22E/@12.0046806,15.0451832,17158m/data=!3m1!1e3!4m13!1m8!3m7!1s0x11196053fc686ffb:0xf9442c3f64221374!2sDigangali,+Chad!3b1!8m2!3d12.0619444!4d15.0727778!16s%2Fg%2F11nmsbmc9w!3m3!8m2!3d12.007689!4d15.062824?entry=ttu"),
    "s_2" == x.alt && (locationTitle.innerHTML = "Rio Chapare, Bolivia",
    locationTitle.href = "https://apps.sentinel-hub.com/eo-browser/?zoom=14&lat=-16.9319&lng=-65.23167&themeId=DEFAULT-THEME&visualizationUrl=U2FsdGVkX1%2FNAzRs%2B%2F33r75frJ5z8uNkCd3wLBh145JGwZJBjykWx86Xsd%2FS00PixdBm5Cs4p1zfMcHZk9r27yyzj6kYvBx8UfJjsuyODvYtYCUUY3qOvgP5ym2wAL9c&datasetId=AWS_LOTL1&fromTime=2023-06-20T00%3A00%3A00.000Z&toTime=2023-06-20T23%3A59%3A59.999Z&layerId=2_TRUE_COLOR_PANSHARPENED&demSource3D=%22MAPZEN%22",
    locationCoordinates.innerHTML = "16°56'04.7 S 65°13'44.2 W",
    locationCoordinates.href = "https://maps.app.goo.gl/MRR8oJSdDTTBVP4z5"),
    "t_0" == x.alt && (locationTitle.innerHTML = "Liwa, United Arab Emirates",
    locationTitle.href = "https://earthobservatory.nasa.gov/images/87237/the-alphabet-from-orbit-letter-t",
    locationCoordinates.innerHTML = "23°10'30.0 N 53°47'52.8 E",
    locationCoordinates.href = "https://www.google.com/maps/place/23%C2%B010'30.0%22N+53%C2%B047'52.8%22E/@23.2263071,53.5999631,91189m/data=!3m1!1e3!4m4!3m3!8m2!3d23.175!4d53.798?entry=ttu"),
    "t_1" == x.alt && (locationTitle.innerHTML = "Lena River Delta",
    locationTitle.href = "https://oceancolor.gsfc.nasa.gov/gallery/759/",
    locationCoordinates.innerHTML = "72°52'40.3 N 129°31'51.5 E",
    locationCoordinates.href = "https://www.google.com/maps/place/72%C2%B052'40.3%22N+129%C2%B031'51.5%22E/@72.787563,128.6593921,85488m/data=!3m1!1e3!4m12!1m7!3m6!1s0x5b1ba3a5c11a7b29:0x90c8b3da45330bba!2sLaptev+Sea!8m2!3d75.9645208!4d126.6348815!16zL20vMDI4bmRz!3m3!8m2!3d72.877867!4d129.530964?entry=ttu"),
    "u_0" == x.alt && (locationTitle.innerHTML = "Canyonlands National Park, Utah",
    locationTitle.href = "https://earthobservatory.nasa.gov/images/83875/the-loop",
    locationCoordinates.innerHTML = "38°16'09.1 N 109°55'32.7 W",
    locationCoordinates.href = "https://www.google.com/maps/place/38%C2%B016'09.1%22N+109%C2%B055'32.7%22W/@38.2749009,-110.0024741,14590m/data=!3m1!1e3!4m12!1m7!3m6!1s0x8747e1ee4518a6a9:0x15a452a9c502e6aa!2sCanyonlands+National+Park!8m2!3d38.2135733!4d-109.9025345!16zL20vMDF3cTgz!3m3!8m2!3d38.269198!4d-109.925762?entry=ttu"),
    "u_1" == x.alt && (locationTitle.innerHTML = "Bamforth National Wildlife Refuge, Wyoming",
    locationTitle.href = "https://none.com",
    locationCoordinates.innerHTML = "41°19'26.0 N 105°46'13.9 W",
    locationCoordinates.href = "https://www.google.com/maps/place/Bamforth+National+Wildlife+Refuge/@41.2734513,-106.0072281,91289m/data=!3m1!1e3!4m12!1m5!3m4!2zNDHCsDIwJzE3LjUiTiAxMDXCsDQ4JzUwLjAiVw!8m2!3d41.3382!4d-105.8139!3m5!1s0x8768812b9b07cc19:0x839bb585413c393f!8m2!3d41.3777918!4d-105.7317396!16zL20vMGJnMGY5?entry=ttu"),
    "u_2" == x.alt && (locationTitle.innerHTML = "Potomac River, Virginia",
    locationTitle.href = "https://none.com",
    locationCoordinates.innerHTML = "38°29'06.4 N 77°10'19.9 W",
    locationCoordinates.href = "https://www.google.com/maps/place/38%C2%B029'06.4%22N+77%C2%B010'19.9%22W/@38.469861,-77.324325,79968m/data=!3m1!1e3!4m4!3m3!8m2!3d38.4851!4d-77.1722?entry=ttu"),
    "v_0" == x.alt && (locationTitle.innerHTML = "Cellina and Meduna Rivers, Italy",
    locationTitle.href = "https://earthobservatory.nasa.gov/images/47670/gravel-rivers-in-northeastern-italy",
    locationCoordinates.innerHTML = "46°06'41.4 N 12°45'26.6 E",
    locationCoordinates.href = "https://www.google.com/maps/place/46%C2%B006'41.4%22N+12%C2%B045'26.6%22E/@46.1123599,12.6682228,45913m/data=!3m1!1e3!4m4!3m3!8m2!3d46.1115!4d12.7574?entry=ttu"),
    "v_1" == x.alt && (locationTitle.innerHTML = "New South Wales, Australia",
    locationTitle.href = "http://earthobservatory.nasa.gov/IOTD/view.php?id=82334",
    locationCoordinates.innerHTML = "34°17'11.2 S 150°49'32.4 E",
    locationCoordinates.href = "https://maps.app.goo.gl/fxE1ik8qzdANidxT8"),
    "v_2" == x.alt && (locationTitle.innerHTML = "Padma River, Bangladesh",
    locationTitle.href = "https://earthobservatory.nasa.gov/world-of-change/PadmaRiver",
    locationCoordinates.innerHTML = "23°21'03.9 N 90°33'06.9 E",
    locationCoordinates.href = "https://maps.app.goo.gl/sYQHYd8exhDsr5SQ7"),
    "v_3" == x.alt && (locationTitle.innerHTML = "Mapleton, Maine",
    locationTitle.href = "https://go.nasa.gov/3xGMviR",
    locationCoordinates.innerHTML = "46°32'40.5 N 68°15'06.4 W",
    locationCoordinates.href = "https://maps.app.goo.gl/8LF7PAqxNbS6egPMA"),
    "w_0" == x.alt && (locationTitle.innerHTML = "Ponoy River, Russia",
    locationTitle.href = "https://none.com",
    locationCoordinates.innerHTML = "67°02'10.9 N 40°20'19.3 E",
    locationCoordinates.href = "https://maps.app.goo.gl/z6n8HY91r7f4kv9G7"),
    "w_1" == x.alt && (locationTitle.innerHTML = "La Primavera, Columbia",
    locationTitle.href = "https://none.com",
    locationCoordinates.innerHTML = "5°26'57.9 N 69°47'57.0 W",
    locationCoordinates.href = "https://maps.app.goo.gl/fa5RwpEkAbZQU6d3A"),
    "x_0" == x.alt && (locationTitle.innerHTML = "Wolstenholme Fjord, Greenland",
    locationTitle.href = "https://earthobservatory.nasa.gov/images/150267/a-half-century-of-loss-in-northwest-greenland",
    locationCoordinates.innerHTML = "76°44'03.8 N 68°36'23.3 W",
    locationCoordinates.href = "https://www.google.com/maps/place/76%C2%B044'03.8%22N+68%C2%B036'23.3%22W/@76.769809,-69.2574316,78627m/data=!3m1!1e3!4m12!1m7!3m6!1s0x4e363cf35b4fee17:0x41fd8c3cf71f8024!2sWolstenholme+Fjord!8m2!3d76.6170514!4d-69.0542596!16zL20vMGJqd3dn!3m3!8m2!3d76.734386!4d-68.606478?entry=ttu"),
    "x_1" == x.alt && (locationTitle.innerHTML = "Davis Straight, Greenland",
    locationTitle.href = "https://oceancolor.gsfc.nasa.gov/gallery/feature/images/LC09_L1TP_004017_20230903_20230903_02_T1_Greenland_lg.png",
    locationCoordinates.innerHTML = "62°14'14.8 N 49°34'49.9 W",
    locationCoordinates.href = "https://www.google.com/maps/place/62%C2%B014'14.8%22N+49%C2%B034'49.9%22W/@62.2576372,-50.2124668,119807m/data=!3m1!1e3!4m4!3m3!8m2!3d62.237433!4d-49.580516?entry=ttu"),
    "x_2" == x.alt && (locationTitle.innerHTML = "Sermersooq Municipality, Greenland",
    locationTitle.href = " https://go.nasa.gov/3MnhF2f",
    locationCoordinates.innerHTML = "66°37'05.2 N 36°22'05.9 W",
    locationCoordinates.href = "https://maps.app.goo.gl/1P9vKFiCy3PkQSnY8"),
    "y_0" == x.alt && (locationTitle.innerHTML = "Bíobío River, Chile",
    locationTitle.href = "https://earthobservatory.nasa.gov/images/150945/fires-blaze-through-south-central-chile",
    locationCoordinates.innerHTML = "37°16'02.4 S 72°43'42.9 W",
    locationCoordinates.href = "https://www.google.com/maps/place/37%C2%B016'02.4%22S+72%C2%B043'42.9%22W/@-37.2890838,-72.7147119,11.54z/data=!4m12!1m7!3m6!1s0x9612d6239f78768f:0x62a4a840164470ae!2zQsOtb2LDrW8gUml2ZXI!8m2!3d-37.6673574!4d-72.163673!16zL20vMDZiZmdu!3m3!8m2!3d-37.267341!4d-72.728582?entry=ttu"),
    "y_1" == x.alt && (locationTitle.innerHTML = "Estuario de Virrila, Peru",
    locationTitle.href = "https://earthobservatory.nasa.gov/images/151183/warming-water-and-downpours-in-peru",
    locationCoordinates.innerHTML = "5°51'53.4 S 80°43'51.6 W",
    locationCoordinates.href = "https://www.google.com/maps/place/5%C2%B051'53.4%22S+80%C2%B043'51.6%22W/@-5.8409555,-80.83445,12.13z/data=!4m12!1m7!3m6!1s0x90497ce60f8e3bc1:0x703ee5f60c9c907d!2sEstuario+de+Virrila!8m2!3d-5.7988889!4d-80.8647222!16s%2Fg%2F12ls2ksqv!3m3!8m2!3d-5.864833!4d-80.730992?entry=ttu"),
    "y_2" == x.alt && (locationTitle.innerHTML = "Ramsay, New Zealand",
    locationTitle.href = "https://go.nasa.gov/3T7rc14",
    locationCoordinates.innerHTML = "43°31'19.4 S 170°49'53.7 E",
    locationCoordinates.href = "https://maps.app.goo.gl/vNfFAsk4VFF6pnTo7"),
    "z_0" == x.alt && (locationTitle.innerHTML = "Primavera do Leste, Brazil",
    locationTitle.href = "https://apps.sentinel-hub.com/eo-browser/?zoom=12&lat=-15.49521&lng=-54.34284&themeId=DEFAULT-THEME&visualizationUrl=U2FsdGVkX18O52iitrh0cnAcCfBS798hlrguhFdZ9QvQfjz67EBag34vBZGRzJIeGA6fTzbSnTgVhfykkGodMpS%2Fm4K4pCUWB5IKdxfj%2BtfaltJwWYzJRS58HEoxyjT%2F&datasetId=AWS_LOTL1&fromTime=2024-06-29T00%3A00%3A00.000Z&toTime=2024-06-29T23%3A59%3A59.999Z&layerId=1_TRUE_COLOR&demSource3D=%22MAPZEN%22",
    locationCoordinates.innerHTML = "15°29'38.9 S 54°20'27.5 W",
    locationCoordinates.href = "https://www.google.com/maps/place/15%C2%B029'38.9%22S+54%C2%B020'27.5%22W/@-15.4976757,-54.3580248,14215m/data=!3m1!1e3!4m13!1m8!3m7!1s0x9377238863d94d8d:0xac7e6dab9bd8285e!2sPrimavera+do+Leste+-+State+of+Mato+Grosso,+Brazil!3b1!8m2!3d-15.5605334!4d-54.2950533!16s%2Fm%2F09rs3h3!3m3!8m2!3d-15.494126!4d-54.34096?entry=ttu"),
    "z_1" == x.alt && (locationTitle.innerHTML = "Mohammed Boudiaf, Algeria",
    locationTitle.href = "https://sentinelshare.page.link/JKxh",
    locationCoordinates.innerHTML = "34°59'19.3 N 4°23'20.8 E",
    locationCoordinates.href = "https://maps.app.goo.gl/iFZcewDgx7niUQCC9")
}
function iconChange() {
    document.getElementById("favicon").href = "./favicon/favicon-1.ico",
    setTimeout((function() {
        document.getElementById("favicon").href = "./favicon/favicon-2.ico"
    }
    ), 2e3),
    setTimeout((function() {
        document.getElementById("favicon").href = "./favicon/favicon-3.ico"
    }
    ), 3e3),
    setTimeout((function() {
        document.getElementById("favicon").href = "./favicon/favicon-4.ico"
    }
    ), 4e3),
    setTimeout((function() {
        document.getElementById("favicon").href = "./favicon/favicon-5.ico"
    }
    ), 5e3),
    setTimeout((function() {
        document.getElementById("favicon").href = "./favicon/favicon-6.ico"
    }
    ), 6e3),
    setTimeout((function() {
        document.getElementById("favicon").href = "./favicon/favicon-7.ico"
    }
    ), 7e3),
    setTimeout( () => {
        iconChange()
    }
    , 8e3)
}
function GetImageName() {
    for (let x = 0; x < nameBoxes.children.length; x++)
        nameBoxes.children[x].classList.contains("selected") && nameBoxes.children[x].classList.toggle("selected");
    var exportName;
    exportName = "" == nameInput.value ? "export" : nameInput.value,
    imageName = exportName + ".png"
}
function nativeShare() {
    navigator.share ? navigator.share({
        title: "Check this out!",
        img: QRCode.toDataURL(currentImageUrl),
        url: currentImageUrl
    }).catch(err => console.error("Share failed:", err)) : alert("Sharing not supported on this browser.")
}
function convertRange(value, r1, r2) {
    return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0]
}
createImages("", "landsat"),
CheckSearchParameters(),
enterButton.addEventListener("click", (function() {
    enterButtonClick()
}
)),
document.addEventListener("keypress", (function(event) {
    "Enter" === event.key && (event.preventDefault(),
    enterButton.classList.contains("disable") || enterButtonClick(),
    document.getElementById("title").scrollIntoView({
        behavior: "smooth"
    }))
}
)),
window.onclick = function(event) {
    if (console.log(event.target.id),
    event.target.matches("img") && "title" != event.target.id) {
        if (event.target.classList.contains("selected"))
            imageSelected = !1;
        else {
            for (let x = 0; x < nameBoxes.children.length; x++)
                nameBoxes.children[x].classList.contains("selected") && nameBoxes.children[x].classList.toggle("selected");
            imageSelected = !0
        }
        event.target.classList.toggle("selected"),
        imageDescriptions(event.target),
        helpContainer.classList.contains("active") && helpContainer.classList.toggle("active")
    } else
        "title" == event.target.id ? (window.open("https://science.nasa.gov/mission/landsat/", "_blank"),
        helpContainer.classList.contains("active") && helpContainer.classList.toggle("active")) : "qr-popup" == event.target.id ? document.getElementById("qr-popup").classList.toggle("active") : "helpContainer" == event.target.id ? helpContainer.classList.contains("active") && helpContainer.classList.toggle("active") : imageSelected = !1;
    cycleMode && (cycleMode = !1,
    clearTimeout(inactivityTimer),
    clearTimeout(typingInterval),
    clearTimeout(cycleTimer)),
    kioskMode && startInactivityTimer()
}
,
iconChange(),
downloadButton.addEventListener("click", (function() {
    GetImageName(),
    downloadDivAsPng("nameBoxes", imageName)
}
)),
helpIcon.addEventListener("click", (function() {
    helpContainer.classList.contains("active") || helpContainer.classList.toggle("active")
}
)),
locationTitle.addEventListener("click", (function(event) {
    "https://none.com/" == locationTitle.href && (console.log("HREF is BLANK"),
    event.preventDefault()),
    console.log(locationTitle.href)
}
)),
qrCodeButton.addEventListener("click", (function(event) {
    document.getElementById("qr-popup").classList.toggle("active"),
    QRCodeGeneration(currentImageUrl)
}
)),
qrCloseButton.addEventListener("click", (function(event) {
    document.getElementById("qr-popup").classList.toggle("active")
}
)),
helpCloseButton.addEventListener("click", (function(event) {
    document.getElementById("helpContainer").classList.toggle("active"),
    console.log("HELP ICON")
}
)),
copyLinkButton.addEventListener("click", (function(event) {
    navigator.clipboard.writeText(currentImageUrl).then( () => {
        const text = document.getElementById("copy-link-text")
          , icon = document.getElementById("copy-link-icon");
        text.textContent = "Link Copied",
        icon.className = "fas fa-check",
        setTimeout( () => {
            text.textContent = "Copy Link",
            icon.className = "fas fa-link"
        }
        , 3e3)
    }
    ).catch(err => {
        alert("Failed to copy link")
    }
    )
}
));
let currentInput = "";
const keyboard = new window.SimpleKeyboard.default({
    onKeyPress: button => handleKeyPress(button),
    layout: {
        default: ["q w e r t y u i o p {backspace}", "a s d f g h j k l", "z x c v b n m {enter}", "{space}"]
    },
    display: {
        "{backspace}": "⌫",
        "{enter}": "Enter",
        "{space}": "Space"
    }
});
function handleKeyPress(button) {
    const input = document.getElementById("nameInput");
    input.focus(),
    "{backspace}" === button ? (currentInput = nameInput.value.slice(0, -1),
    cycleMode && (nameInput.value = "",
    currentInput = "",
    cycleMode = !1,
    clearTimeout(inactivityTimer),
    clearTimeout(typingInterval),
    clearTimeout(cycleTimer))) : "{enter}" === button ? (handleSubmit(nameInput.value),
    currentInput = nameInput.value) : "{space}" === button ? currentInput = nameInput.value + " " : (currentInput = nameInput.value + button,
    cycleMode && (nameInput.value = "",
    currentInput = button,
    cycleMode = !1,
    clearTimeout(inactivityTimer),
    clearTimeout(typingInterval),
    clearTimeout(cycleTimer))),
    input.value = currentInput
}
function handleSubmit(value) {
    enterButton.classList.contains("disable") || enterButtonClick()
}
document.querySelector(".simple-keyboard").addEventListener("mousedown", e => {
    e.preventDefault()
}
);
