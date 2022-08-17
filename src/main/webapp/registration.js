/**
 * Registration management
 */

 function showPasswordAlert(msg) {
    document.getElementById("id_error_message").style.display = "block";
    document.getElementById("id_error_message").textContent = msg;
}

function pwMismatch() {

    let pw = document.getElementById("password").value;
    let pw2 = document.getElementById("repeatpassword").value;

    // If password not entered
    if (pw == '')
        showPasswordAlert("Please enter Password");

    // If confirm password not entered
    else if (pw2 == '')
        showPasswordAlert("Please enter confirm password");

    // If Not same return False.
    else if (pw != pw2) {
        showPasswordAlert("Password did not match: Please try again...")
        return false;
    } else if (pw.length < 8) {
        showPasswordAlert("Password is too short, at least 8 characters.")
        return false;
    }

    // If same return True.
    else {
        return true;
    }
}
