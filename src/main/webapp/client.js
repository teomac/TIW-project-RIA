/**
 * Client page manager
 */
 {
    let clientQuotesList, pageOrchestrator = new PageOrchestrator();
    /**
     * This starts the page if the user is logged in.
     */
   window.addEventListener("load", () => {
	    if (sessionStorage.getItem("username") == null) {
	      window.location.href = "index.html";
	    } else {
	      pageOrchestrator.start(); // initialize the components
	      pageOrchestrator.refresh();
	    } // display initial content
	  }, false);
	  

	function resetMessages(){
		document.getElementById("no_quotes_client").style.display="none"; 
		document.getElementById("error_message").style.display="none";
	}
	
	 function PersonalMessage(_username, messagecontainer) {
	    this.username = _username;
	    this.show = function() {
	      messagecontainer.textContent = this.username;
	    }
	  }
	
    
    
    
    
	//LOGOUT
    /**
     * This method logs out the user and goes to the login page.
     */
    function logout() {
        let loggedOut = false;
        makeCall("GET", 'logout', function (response) {
            if (response.readyState === XMLHttpRequest.DONE) {
                switch (response.status) {
                    case 200:
                        loggedOut = true;
                        localStorage.clear();
                        window.sessionStorage.removeItem('username');
                        window.location.href = "login.html";
                        break;
                    default :
                        alert("Unknown Error");
                        break;
                }
            }
        });
        if (!loggedOut) {
            localStorage.clear();
            window.location.href = "index.html";
        }
        pageOrchestrator.refresh();
    }
	
	
	
	
	
	// Component that handles the Conferences Table
	function ClientQuotesList( _listcontainer,_listcontainerbody) {
		    
		    this.listcontainer = _listcontainer;
		    this.listcontainerbody = _listcontainerbody;
		  	resetMessages();
		  	
		  	 this.reset = function() {
	      this.listcontainer.style.visibility = "hidden";
	    }

		    this.show = function() {
		      
		      var self = this; //Important!

		      makeCall("GET", "GetClientQuotes", null,
		        // callback function
		        function(req) {
		          if (req.readyState == XMLHttpRequest.DONE) { // == 4
		            if (req.status == 200) {
		              var quotesToShow = JSON.parse(req.responseText);

		              if (quotesToShow.length == 0) {
		               document.getElementById("no_quotes_client").style.display="block"; 
		                return;
		              }
		              // If quotes list is not emtpy, then update view
		              self.update(quotesToShow); // self visible by closure
		            }
		           else {
		           	// request failed, handle it
		           	self.listcontainer.style.visibility = "hidden";
		            document.getElementById("error_message").textContent="Not possible to recover data"; //for demo purposes
		            document.getElementById("error_message").style.display="block";
		          }
		      }
		        }
		      );
		    };


		    this.update = function(quotesArray) {
		      var elem, i, row, destcell, datecell, linkcell, anchor;
		      this.listcontainerbody.innerHTML = ""; // empty the table body
		      
		      // build updated list
		      var self = this;
		      quotesArray.forEach(function(quote) { // self visible here, not this
		        //Create a row for each conference
		        row = document.createElement("tr");
		        
		        numberCell = document.createElement("td");
		        numberCell.textContent = quote.quoteID;
		        row.appendChild(numberCell);
		        
		        numberCell = document.createElement("td");
		        numberCell.textContent = quote.productID;
		        row.appendChild(numberCell);

		        doublecell = document.createElement("td");
		        doublecell.textContent = quote.price;
		        row.appendChild(doublecell);
		        
		        anchor = document.createElement("a");
		        anchor.textContent = "Details";
		        anchor.href="#"
		        anchor.onclick="showDetails(quote)"
		        row.appendChild(anchor);

				// Add row to table body
		        self.listcontainerbody.appendChild(row);
		      });
		      
		      this.listcontainer.style.visibility = "visible";
		    }
		  }
		  
		  
		  function PageOrchestrator() {
	    var alertContainer = document.getElementById("error_message");
	    
	    this.start = function() {
	      personalMessage = new PersonalMessage(sessionStorage.getItem('username'),
	        document.getElementById("id_username"));
	        
	      personalMessage.show();

	      clientQuotesList = new ClientQuotesList(
	        document.getElementById("client_quotes_table")
		,document.getElementById("client_quotes_body"));
		
		clientQuotesList.show();

	      }
	    

	    this.refresh = function() {
	      alertContainer.textContent = "";  
	      personalMessage.show();
          employeeQuotesList.reset();
	      employeeQuotesList.show();
	    }
	  

}}