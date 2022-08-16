(function() {

    document.getElementById("loginbutton").addEventListener('click', (e) => {
        var form = e.target.closest("form");
        if (form.checkValidity()) {
            makeCall("POST", 'Login', e.target.closest("form"),
                function(x) {
                    if (x.readyState == XMLHttpRequest.DONE) {
                        var message = x.responseText;
                        switch (x.status) {
                            case 200:
                                sessionStorage.setItem('username', message);
                                window.location.href = "homepageClient.html";
                                break;
                            case 400: // bad request
                                document.getElementById("errormessage").textContent = message;
                                break;
                            case 401: // unauthorized
                                document.getElementById("errormessage").textContent = message;
                                break;
                            case 500: // server error
                                alert(message);
                                break;
                        }
                    }
                }
            );
        } else {
            form.reportValidity();
        }
    });
    window.onload = () => {
        var x = sessionStorage.getItem("registrationOK");
        if(x!=undefined){
            sessionStorage.removeItem("registrationOK");
            document.getElementsByClassName("creation")[0].textContent = x;
        }
    }

})();