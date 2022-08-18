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
	
	
	
	function BackHome(){
		pageOrchestrator.refresh();
	}
	
	
	function addPrice(quote){
		
		pageOrchestrator.prepareShowDetails();
		document.getElementById("price_quote").style.display="block";
		document.getElementById("price_form").addEventListener('click', () => {
			price=document.getElementById("written_price").value;
			if(price < 0 || price === 0){
				document.getElementById("error_message3").textContent="Price can not be negative or equal than zero";
				document.getElementById("error_message3").style.display="block";
				pageOrchestrator.prepareShowDetails();
			}	
			else{
	        receivePrice(quote, price);}
	      })
		
	}
	
	function resetAddPrice(){
		document.getElementById("written_price").value="";
		document.getElementById("price_quote").style.display="none";
		document.getElementById("error_message3").style.display="block";
	}
	
	
	
	function receivePrice(quote, price){
		 var self = this; //Important!

				this.price=price;
				this.quoteID=quote;
				
			
		      makeCall("POST", "AddPrice?price=" + this.price + "&quoteID=" + this.quoteID, null,
		        // callback function
		        function(req) {
					var message = JSON.parse(req.responseText);
					
		          if (req.readyState == XMLHttpRequest.DONE) { // == 4
		            if (req.status == 200) {
		              
		              // If quotes list is not emtpy, then update view
		              pageOrchestrator.refresh(); // self visible by closure
		            }
		           else {
		           	// request failed, handle it
		           	document.getElementByID("error_message3").style.display="block";
		            document.getElementById("error_message3").textContent=message; //for demo purposes
		            return;
		          }}
		      }
		        );
		      
		
	}
	
	
	
	
	
	
	
	// Component that handles the Conferences Table
	function EmployeeQuotesList( _listcontainer,_listcontainerbody) {
		    
		    this.listcontainer = _listcontainer;
		    this.listcontainerbody = _listcontainerbody;
		  	resetMessages();
		  	
		  	 this.reset = function() {
	      this.listcontainer.style.display = "none";
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
		      
		      this.listcontainer.style.display = "block";
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
	      this.listcontainer.style.display = "none";
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
		        //anchor.onclick=addPrice(quote.quoteID);
		        anchor.addEventListener("click", () => {
				localStorage.setItem("quoteID", quote.quoteID);
				addPrice(quote.quoteID);})
		        row.appendChild(anchor);

				// Add row to table body
		        self.listcontainerbody.appendChild(row);
		      });
		      
		      this.listcontainer.style.display = "block";
		    }
		  }
		  
		  
		  
		  function QuoteDetails( _listcontainer, _listcontainer2, _listcontainerbody, _listcontainerbody2) {
		    
		    resetMessages();
			
		    this.listcontainer = _listcontainer;
		    this.listcontainer2 = _listcontainer2;
		    this.listcontainerbody = _listcontainerbody;
		    this.listcontainerbody2 = _listcontainerbody2;
				
			this.listcontainer.style.display = "block";
			this.listcontainer2.style.display = "block";
			document.getElementById("employee_startpage").style.display="none";
			document.getElementById("quote_details").style.display="block";
		  	
		  	
		  	 this.reset = function() {
	      this.listcontainer.style.display = "none";
	      this.listcontainer2.style.display = "none";
	      document.getElementById("employee_startpage").style.display="block";
	      document.getElementById("quote_details").style.display="none";}

		    this.show = function() {
		      
		      this.quoteID = localStorage.getItem("quoteID");
		      var self = this; //Important!

		      makeCall("GET", "GetQuoteDetails?quoteID=" + this.quoteID, null,
		        // callback function
		        function(req) {
		          if (req.readyState == XMLHttpRequest.DONE) { // == 4
		            if (req.status == 200) {
		              var data = JSON.parse(req.responseText);
		              if (data === null) {
		               document.getElementById("error_message2").style.display="block"; 
		                return;
		              }
		              // If quotes list is not emtpy, then update view
		              self.update(data); // self visible by closure
		            }
		           else {
		           	// request failed, handle it
		           	self.listcontainer.style.visibility = "hidden";
		            document.getElementById("error_message2").style.display="block";
		          }
		      }
		        }
		      );
		      }
		     


		    this.update = function(data) {
		      var elem, i, row, destcell, datecell, linkcell, anchor;
		      this.listcontainerbody.innerHTML = "";
		      this.data = data;
		      
		      let quote=data.quote;
		      let product=data.product;
		      let options=data.options;
		      
		      
		      
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
		        
		        temp='upload/'.concat(product.productImage.toString());
		        
		        img = document.createElement("img");
		        img.src=temp;
		        img.style.height="200px";
		        img.style.width="200px";
		        row.appendChild(img);
		        
		        doublecell = document.createElement("td");
		        doublecell.textContent= quote.price;
		        row.appendChild(doublecell);

				// Add row to table body
		        self.listcontainerbody.appendChild(row);
		        
		        
		        this.listcontainer.style.display = "block";
		        this.update2(options);
		        
		      
		        }
		        
		        ////////////////////////////
		        
		        this.update2= function(selectedOptions){

			
		        this.listcontainerbody2.innerHTML = "";
		        
		        var self=this;
		        
		      
		        //Create a row for each conference
		        selectedOptions.forEach(function(option){ 
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
		        
		       self.listcontainerbody2.appendChild(row2);
		        });

				// Add row to table body
		        
		        
		        
		      
		      this.listcontainer2.style.display = "block";
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
		
		document.getElementById("logout").addEventListener('click', () => {
	        logout();
	      })
		
		document.getElementById("home").addEventListener('click', () => {
	        BackHome();
	      })
		

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
	      resetMessages();  
	      personalMessage.show();
	      quoteDetails.reset();
	      document.getElementById("logout").style.display="block";
		  document.getElementById("home").style.display="none";
		  resetAddPrice();
          employeeQuotesList.reset();
	      employeeQuotesList.show();
	      employeeNotPricedQuotesList.reset();
	      employeeNotPricedQuotesList.show();
	      
	    }
	    
	    this.prepareShowDetails=function(){
			employeeQuotesList.reset();
			employeeNotPricedQuotesList.reset();
			document.getElementById("employee_startpage").style.display="none";
			document.getElementById("quote_details").style.display="block";
			document.getElementById("logout").style.display="none";
			document.getElementById("home").style.display="block";
			quoteDetails.show();
			
	}
	  

}}