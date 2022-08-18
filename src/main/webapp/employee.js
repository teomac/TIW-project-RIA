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
		document.getElementById("no_quotes_to_price").style.display="none";
		 document.getElementById("error_message1").style.display="none";
		 document.getElementById("error_message2").style.display="none";  
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
		        //anchor.onclick=showDetails(quote.quoteID);
		        anchor.addEventListener("click", () => {
				showDetails(quote.quoteID);})
		        row.appendChild(anchor);

				// Add row to table body
		        self.listcontainerbody.appendChild(row);
		      });
		      
		      this.listcontainer.style.visibility = "visible";
		    }
		  }
		  
		  
		  
		  function showDetails(quoteID){
			this.quoteID=quoteID;
			localStorage.setItem("quoteID", this.quoteID);
			pageOrchestrator.prepareShowDetails();
		}
		  
		  
		  
		  // Component that handles the Conferences Table
	function EmployeeNotPricedQuotesList( _listcontainer,_listcontainerbody) {
		    
		    this.listcontainer = _listcontainer;
		    this.listcontainerbody = _listcontainerbody;
		  	resetMessages();
		  	
		  	 this.reset = function() {
	      this.listcontainer.style.visibility = "hidden";
	    }

		    this.show = function() {
		      
		      var self = this; //Important!

		      makeCall("GET", "GetNotPricedQuotes", null,
		        // callback function
		        function(req) {
		          if (req.readyState == XMLHttpRequest.DONE) { // == 4
		            if (req.status == 200) {
		              var notPricedquotesToShow = JSON.parse(req.responseText);

		              if (notPricedquotesToShow.length == 0) {
		               document.getElementById("no_quotes_to_price").style.display="block"; 
		                return;
		              }
		              // If quotes list is not emtpy, then update view
		              self.update(notPricedquotesToShow); // self visible by closure
		            }
		           else {
		           	// request failed, handle it
		           	self.listcontainer.style.visibility = "hidden";
		            document.getElementById("error_message1").textContent="Not possible to recover data"; //for demo purposes
		            document.getElementById("error_message1").style.display="block";
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
		        
		        destcell = document.createElement("td");
		        destcell.textContent= quote.clientUsername;
		        row.appendChild(destcell);
		        
		        anchor = document.createElement("a");
		        anchor.textContent = "Add price";
		        anchor.href="#"
		        //anchor.onclick=addPrice(quote);
		        row.appendChild(anchor);

				// Add row to table body
		        self.listcontainerbody.appendChild(row);
		      });
		      
		      this.listcontainer.style.visibility = "visible";
		    }
		  }
		  
		  
		  
		  function QuoteDetails( _listcontainer, _listcontainer2, _listcontainerbody, _listcontainerbody2) {
		    
		    resetMessages();
			
		    this.listcontainer = _listcontainer;
		    this.listcontainer2 = _listcontainer2;
		    this.listcontainerbody = _listcontainerbody;
		    this.listcontainerbody2 = _listcontainerbody2;
				
			this.listcontainer.style.visibility = "visible";
			this.listcontainer2.style.visibility = "visible";
			document.getElementById("employee_startpage").style.visibility="hidden";
			document.getElementById("quote_details").style.visibility="visible";
		  	
		  	
		  	 this.reset = function() {
	      this.listcontainer.style.visibility = "hidden";
	      this.listcontainer2.style.visibility = "hidden";
	      document.getElementById("employee_startpage").style.visibility="visible";
	      document.getElementById("quote_details").style.visibility="hidden";
		  	
	      
	    }

		    this.show = function() {
		      
		      this.quoteID = localStorage.getItem("quoteID");
		      var self = this; //Important!

		      makeCall("GET", "GetQuoteDetails?quoteID=" + quoteID, null,
		        // callback function
		        function(req) {
		          if (req.readyState == XMLHttpRequest.DONE) { // == 4
		            if (req.status == 200) {
		              var quote = JSON.parse(req.responseText);

		              if (quote === null) {
		               document.getElementById("error_message2").style.display="block"; 
		                return;
		              }
		              // If quotes list is not emtpy, then update view
		              localStorage.setItem("saved_quote", quote);
		              localStorage.setItem("productID", quote.getProductID)
		            }
		           else {
		           	// request failed, handle it
		           	self.listcontainer.style.visibility = "hidden";
		            document.getElementById("error_message2").style.display="block";
		          }
		      }
		        }
		      );
		      
		    makeCall("GET", "GetProductDetails?productID=" +localStorage.getItem("quoteID"), null,
		        // callback function
		        function(req) {
		          if (req.readyState == XMLHttpRequest.DONE) { // == 4
		            if (req.status == 200) {
		              var product = JSON.parse(req.responseText);

		              if (product === null) {
		               document.getElementById("error_message2").style.display="block"; 
		                return;
		              }
		              // If quotes list is not emtpy, then update view
		              localStorage.setItem("product", product);
		            }
		           else {
		           	// request failed, handle it
		           	self.listcontainer.style.visibility = "hidden";
		            document.getElementById("error_message2").style.display="block";

		          }
		      }
		        }
		      ); 
		       makeCall("GET", "GetQuoteOptions?quoteID=" + quoteID, null,
		        // callback function
		        function(req) {
		          if (req.readyState == XMLHttpRequest.DONE) { // == 4
		            if (req.status == 200) {
		              var selectedOptions = JSON.parse(req.responseText);

		              if (selectedOptions.length == 0) {
		               document.getElementById("error_message2").style.display="block"; 
		                return;
		              }
		              // If quotes list is not emtpy, then update view
		              localStorage.setItem("options", selectedOptions);
		              self.update(); // self visible by closure
		            }
		           else {
		           	// request failed, handle it
		           	self.listcontainer.style.visibility = "hidden";
		            document.getElementById("error_message2").style.display="block";

		          }
		      }
		        }
		      );
		    };


		    this.update = function() {
		      var elem, i, row, destcell, datecell, linkcell, anchor;
		      this.listcontainerbody.innerHTML = "";
		      
		      quote=localStorage.getItem("saved_quote");
		      product=localStorage.getItem("product");
		      
		      // build updated list
		      var self = this;
		        //Create a row for each conference
		        row = document.createElement("tr");
		        
		        numberCell = document.createElement("td");
		        numberCell.textContent = quote.quoteID;
		        row.appendChild(numberCell);
		        
		        textCell = document.createElement("td");
		        textCell.textContent = quote.clientUsername;
		        row.appendChild(textCell);

		        textcell = document.createElement("td");
		        textcell.textContent = quote.employeeUsername;
		        row.appendChild(textcell);
		        
		       	numbercell = document.createElement("td");
		        numbercell.textContent= quote.productID;
		        row.appendChild(numbercell);
		        
		        textcell = document.createElement("td");
		        textcell.textContent = product.productName;
		        row.appendChild(textcell);
		        
		        //img = document.createElement("img");
		        //img.src="src/main/webapp/upload/".concat(product.productImage);
		        //img.style.height="200";
		        //row.appendChild(img);
		        
		        doublecell = document.createElement("td");
		        doublecell.textContent= quote.price;
		        row.appendChild(doublecell);

				// Add row to table body
		        self.listcontainerbody.appendChild(row);
		        
		        
		           this.listcontainer.style.visibility = "visible";
		        //this.update2();
		        
		      
		        }
		        
		        ////////////////////////////
		        
		        this.update2= function(){
			
		        this.listcontainerbody2.innerHTML = "";
		        
		        var self=this;
		        
		        options=localStorage.getItem("options");
		        
		      
		        //Create a row for each conference
		        options.forEach(function(option){ 
		        row2 = document.createElement("tr");
		        
		        numberCell = document.createElement("td");
		        numberCell.textContent = option.optionID;
		        row2.appendChild(numberCell);
		        
		        textCell = document.createElement("td");
		        textCell.textContent = option.name;
		        row2.appendChild(textCell);

				if(option.inSale){
		        textcell = document.createElement("td");
		        textcell.textContent = "In Sale!";
		        row2.appendChild(textcell);}
		        });

				// Add row to table body
		        self.listcontainerbody2.appendChild(row2);
		        
		        
		      
		      this.listcontainer2.style.visibility = "visible";
		    }
		  }
		  
		  
		  
		  
		  
		  
		  
		  
		  
		  function PageOrchestrator() {
	    var alertContainer = document.getElementById("error_message");
	    
	    this.start = function() {
	      personalMessage = new PersonalMessage(sessionStorage.getItem('username'),
	        document.getElementById("id_username"));
	        
	      personalMessage.show();
	      resetMessages();

	      employeeQuotesList = new EmployeeQuotesList(
	        document.getElementById("employee_quotes_table")
		,document.getElementById("employee_quotes_body"));
		
		employeeNotPricedQuotesList = new EmployeeNotPricedQuotesList(
			document.getElementById("not_priced_table")
		,document.getElementById("not_priced_body"));
		
			
		quoteDetails= new QuoteDetails(
			document.getElementById("details_table"), 
			document.getElementById("options_table"),
			document.getElementById("details1"), 
			document.getElementById("details2"));
			
		
			quoteDetails.reset();
			
		employeeQuotesList.show();
		
		employeeNotPricedQuotesList.show();
		
		
		

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
	      quoteDetails.reset();
          employeeQuotesList.reset();
	      employeeQuotesList.show();
	      employeeNotPricedQuotesList.reset();
	      employeeNotPricedQuotesList.show();
	      
	    }
	    
	    this.prepareShowDetails=function(){
			employeeQuotesList.reset();
			employeeNotPricedQuotesList.reset();
			document.getElementById("employee_startpage").style.visibility="hidden";
			document.getElementById("quote_details").style.visibility="visible";
			quoteDetails.show();
	}
	  

}}