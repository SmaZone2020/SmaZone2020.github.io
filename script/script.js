function getCookie(name) {
    let cookieArr = document.cookie.split(';');
    for(let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split('=');
        if(name === cookiePair[0].trim()) {
            // Decode the cookie value and return
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function checkAndSetInitialCookie() {
    let darkCookie = getCookie('dark');
    if (darkCookie === null) {
        setCookie('dark', 'false', 7); // Set cookie for 7 days
        dark = false;
    } else {
        dark = darkCookie === 'true';
        document.body.classList.toggle('dark-mode', dark);
        if(dark)
            document.getElementById("toggleMode").innerHTML = `<i class="bi bi-brightness-high"></i>`;
        else
            document.getElementById("toggleMode").innerHTML = `<i class="bi bi-moon-stars"></i>`;
    }
}

var dark = false;
function toggleMode() {
    dark = !dark;
    document.body.classList.toggle('dark-mode');
    setCookie('dark', dark.toString(), 7); // Update the cookie value
    if(dark)
        document.getElementById("toggleMode").innerHTML = `<i class="bi bi-brightness-high"></i>`;
    else
        document.getElementById("toggleMode").innerHTML = `<i class="bi bi-moon-stars"></i>`;
}

// Initialize the page state based on the cookie
window.onload = function() {
    checkAndSetInitialCookie();
};
