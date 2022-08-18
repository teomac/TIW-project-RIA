/**
 * Employee page manager
 */
 {
    let employeeQuotesList, pageOrchestrator = new PageOrchestrator();
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
		document.getElementById("no_quotes_employee").style.display="none"; 
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
	function EmployeeQuotesList( _listcontainer,_listcontainerbody) {
		    
		    this.listcontainer = _listcontainer;
		    this.listcontainerbody = _listcontainerbody;
		  	resetMessages();
		  	
		  	 this.reset = function() {
	      this.listcontainer.style.visibility = "hidden";
	    }

		    this.show = function() {
		      
		      var self = this; //Important!

		      makeCall("GET", "GetEmployeeQuotes", null,
		        // callback function
		        function(req) {
		          if (req.readyState == XMLHttpRequest.DONE) { // == 4
		            if (req.status == 200) {
		              var quotesToShow = JSON.parse(req.responseText);

		              if (quotesToShow.length == 0) {
		               document.getElementById("no_quotes_employee").style.display="block"; 
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

	      employeeQuotesList = new EmployeeQuotesList(
	        document.getElementById("employee_quotes_table")
		,document.getElementById("employee_quotes_body"));
		
		employeeQuotesList.show();

	     /* missionDetails = new MissionDetails({ // many parameters, wrap them in an
	        // object
	        alert: alertContainer,
	        detailcontainer: document.getElementById("id_detailcontainer"),
	        expensecontainer: document.getElementById("id_expensecontainer"),
	        expenseform: document.getElementById("id_expenseform"),
	        closeform: document.getElementById("id_closeform"),
	        date: document.getElementById("id_date"),
	        destination: document.getElementById("id_destination"),
	        status: document.getElementById("id_status"),
	        description: document.getElementById("id_description"),
	        country: document.getElementById("id_country"),
	        province: document.getElementById("id_province"),
	        city: document.getElementById("id_city"),
	        fund: document.getElementById("id_fund"),
	        food: document.getElementById("id_food"),
	        accomodation: document.getElementById("id_accomodation"),
	        transportation: document.getElementById("id_transportation")
	      });
	      missionDetails.registerEvents(this); // the orchestrator passes itself --this-- so that the wizard can call its refresh function after updating a mission

	      wizard = new Wizard(document.getElementById("id_createmissionform"), alertContainer);
	      wizard.registerEvents(this);  // the orchestrator passes itself --this-- so that the wizard can call its refresh function after creating a mission

*/
	      }
	    

	    this.refresh = function() {
	      alertContainer.textContent = "";  
	      personalMessage.show();
          employeeQuotesList.reset();
	      employeeQuotesList.show();
	    }
	  

}}