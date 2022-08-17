/**
 * Login and Registration management
 */

 function showPasswordAlert(msg) {
     document.getElementById("errormessageregpw").textContent = msg;
 }

function resetRegErrors(){
	document.getElementById('errormessagereg').textContent=" ";
     document.getElementById('errormessageregpw').textContent=" ";
     document.getElementById('errormessageregemail').textContent=" ";
	
}
 function showLogin(message) {
     document.getElementById("id_login_section").style.display="block";
     document.getElementById("id_registration_section").style.display="none";
     document.getElementById("formLogin").reset();
     document.getElementById('registrationOK').textContent=message;
 }
 function showRegistration(message) {
     document.getElementById("id_registration_section").style.display="block";
     document.getElementById("id_login_section").style.display="none";
     document.getElementById("formRegistration").reset();
     document.getElementById('errormessagereg').textContent=message;
     document.getElementById('errormessageregpw').textContent=message;
     document.getElementById('errormessageregemail').textContent=message;
 }

 function pwMismatch() {

	resetRegErrors();
    let pw = document.getElementById("passwordReg").value;
    let pw2 = document.getElementById("repeatpassword").value;

    // If password not entered
    if (pw == '')
        showPasswordAlert("Please enter Password");

    // If confirm password not entered
    else if (pw2 == '')
        showPasswordAlert("Please enter confirm password");

    // If Not same return false.
    else if (pw != pw2) {
        showPasswordAlert("Password did not match: please try again")
        return false;
    //If password is too short
    } else if (pw.length < 8) {
        showPasswordAlert("Password is too short, at least 8 characters")
        return false;
    }
    else if (pw.length > 32) {
        showPasswordAlert("Password is too long, max 32 characters")
        return false;
    }

    // If same return true.
    else {
        return true;
    }
}

function emailValid(){
 resetRegErrors();
  let email=document.getElementById("emailReg").value;
   var re = /\S+@\S+\.\S+/;
    if(email == " "){
	    document.getElementById("errormessageregemail").textContent="Email format not valid"
    	return false;
     }
       else if(re.test(email)){
			return true;
		}
  	else {
    	document.getElementById("errormessageregemail").textContent="Email format not valid"
    	return false;

  		}
}



(function() {

    document.getElementById("loginbutton").addEventListener('click', (e) => {
        var form = e.target.closest("form");
        if (form.checkValidity()) {
            makeCall("POST", 'Login', e.target.closest("form"),
                function(x) {
                    if (x.readyState == XMLHttpRequest.DONE) {
                        var message = x.responseText;
                        document.getElementById('registrationOK').textContent=" ";
                        switch (x.status) {
                            case 200:
                                sessionStorage.setItem('username', message);
                                window.location.href = "HomepageClient.html";
                                break;
                            case 400: // bad request
                                document.getElementById("errormessagelogin").textContent = message;
                                break;
                            case 401: // unauthorized
                                document.getElementById("errormessagelogin").textContent = message;
                                break;
                            case 500: // server error
                                document.getElementById("errormessagelogin").textContent = message;
                                break;
                        }
                    }
                }
            );
        } else {
            form.reportValidity();
        }
    });

    document.getElementById("registrationbutton").addEventListener('click', (e) => {
	if(pwMismatch() && emailValid()){
            var form = e.target.closest("form");
            resetRegErrors();
            if (form.checkValidity()) {
                makeCall("POST", 'Registration', e.target.closest("form"),
                    function (req) {
                        if (req.readyState == XMLHttpRequest.DONE) {
                            var message = req.responseText;
                            switch (req.status) {
                                case 200:
                                    showLogin(message);
                                    break;
                                case 400: // bad request
                                    document.getElementById("errormessagereg").textContent = message;
                                    break;
                                case 401: // unauthorized
                                    document.getElementById("errormessagereg").textContent = message;
                                    break;
                                case 500: // server error
                                    document.getElementById("errormessagereg").textContent = message;
                                    break;
                            }
                        }
                    }
                );
            } else {
                form.reportValidity();
            }
      }  
    })
})();
