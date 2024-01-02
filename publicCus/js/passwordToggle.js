function passwordToggle(passwordID) {
    var x = document.getElementById(passwordID);
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}