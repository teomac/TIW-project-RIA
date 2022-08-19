/**
 * Client page manager
 */
 {
    let clientQuotesList, quoteDetails, personalMessage, check, pageOrchestrator = new PageOrchestrator();
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




		function BackHome(){
			pageOrchestrator.refresh();
									}




    function QuoteDetails( _listcontainer, _listcontainer2, _listcontainerbody, _listcontainerbody2) {

  		    resetMessages();

  		    this.listcontainer = _listcontainer;
  		    this.listcontainer2 = _listcontainer2;
  		    this.listcontainerbody = _listcontainerbody;
  		    this.listcontainerbody2 = _listcontainerbody2;

  			this.listcontainer.style.display = "block";
  			this.listcontainer2.style.display = "block";
  			document.getElementById("client_startpage").style.display="none";
  			document.getElementById("quote_details").style.display="block";


  		  	 this.reset = function() {
  	      this.listcontainer.style.display = "none";
  	      this.listcontainer2.style.display = "none";
  	      document.getElementById("client_startpage").style.display="block";
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
  		           	self.listcontainer.style.display = "none";
  		            document.getElementById("error_message2").style.display="block";
  		          }
  		      }
  		        }
  		      );
  		      }



  		    this.update = function(data) {
  		      var row, numbercell, textcell;
  		      this.listcontainerbody.innerHTML = "";
  		      this.data = data;

  		      let quote=data.quote;
  		      let product=data.product;
  		      let options=data.options;



  		      // build updated list
  		      var self = this;
  		        //Create a row for each conference
  		        row = document.createElement("tr");

  		        numbercell = document.createElement("td");
  		        numbercell.textContent = quote.quoteID;
  		        row.appendChild(numbercell);

  		        textcell = document.createElement("td");
  		        textcell.textContent = quote.clientUsername;
  		        row.appendChild(textcell);

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




	// Component that handles the Conferences Table
	function ClientQuotesList( _listcontainer,_listcontainerbody) {

		    this.listcontainer = _listcontainer;
		    this.listcontainerbody = _listcontainerbody;
		  	resetMessages();

		  	 this.reset = function() {
	      this.listcontainer.style.display = "none";
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
		           	self.listcontainer.style.display = "none";
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








	function loadOptions() {
	    var self = this;
		
		makeCall("GET", "GetOptions", null,
		function(req) {
			if (req.readyState == XMLHttpRequest.DONE) {
				if (req.status == 200) {
					var optionsToShow = JSON.parse(req.responseText);
	            	window.localStorage.setItem("options", JSON.stringify(optionsToShow));
				}

				else {
					document.getElementById("error_message").textContent="Not possible to recover data"; //for demo purposes
	            	document.getElementById("error_message").style.display="block";
				}
			}

		})
	}

	function createDropDown(_listcontainer,_listcontainerbody) {
		
		this.listcontainer = _listcontainer;
		    this.listcontainerbody = _listcontainerbody;
		  	resetMessages();
		  	
		  	this.reset = function() {
	      this.listcontainer.style.display = "none";}	    
		  	
		 this.show = function() {

		  var self = this; //Important!
		  
		makeCall("GET", "GetProducts", null,
		function(req) {

			if (req.readyState == XMLHttpRequest.DONE) {
				if (req.status == 200) {
					var productsToShow = JSON.parse(req.responseText);
					if(productsToShow === null) {
						document.getElementById("error_message").textContent="Not possible to recover products"; //for demo purposes
		            	document.getElementById("error_message").style.display="block";
					}
					else {
						self.update(productsToShow)
					}

				}

				else {
					document.getElementById("error_message").textContent="Not possible to recover data"; //for demo purposes
	            	document.getElementById("error_message").style.display="block";
				}
			}

		})
		}
		
		this.update = function(products){
			
		this.listcontainerbody.innerHTML = "";

		var self = this;
		
		el = document.createElement('option');
    	//el.value = value.productName;
    	el.textContent = "--Select--";
    	el.value = "0";
    	self.listcontainerbody.appendChild(el);


		products.forEach(function(product) {
		el = document.createElement('option');
    	el.value = product.productCode;
    	el.textContent = product.productName;

    	self.listcontainerbody.appendChild(el);
	})
		self.listcontainerbody.addEventListener("change", () => {
				var select = document.getElementById('select');
				var value = select.options[select.selectedIndex].value;
				window.localStorage.setItem("productID", JSON.stringify(value));
			    check.show();
        	
  
		})
		 this.listcontainer.style.display = "block";}
	}



 function createCheckbox(_listcontainer,_listcontainerbody){
			this.listcontainer = _listcontainer;
		    this.listcontainerbody = _listcontainerbody;
		  	resetMessages();

		  	 this.reset = function() {
	      this.listcontainer.style.display = "none";
	      this.listcontainerbody.innerHTML=" ";
	    }

		    this.show = function() {

		
		      var self = this; //Important! 
		      
		      loadedOpt= JSON.parse(window.localStorage.getItem("options"));
		      var p=JSON.parse(window.localStorage.getItem("productID"));
		      
		      self.listcontainerbody.innerHTML="";
		      
		      console.log(p);
		      
		      if(p!==0){
   				
   				var array= [];
   				var i=0;
				loadedOpt.forEach(function(opt) {


				if(opt.productID==p){
				var div= document.createElement("div");
    			var checkbox = document.createElement('input');
    			var br= document.createElement("br");
    			checkbox.type = "checkbox";
    			checkbox.value = opt.optionID;
    			checkbox.id = opt.optionID;
    			array.push(opt.optionID);
    			var label = document.createElement("label") 
    			if(opt.inSale){
				var tn = document.createTextNode(opt.name +"‎‎‎‎‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎--->‏‏‎ ‎‏‏‎ ‎‏‏‎ ‎"+ "In Sale!");
					} 
					else{var tn = document.createTextNode(opt.name);}
    			
    			
    			label.appendChild(tn);
    			div.appendChild(checkbox);
    			div.appendChild(label);
    			self.listcontainerbody.appendChild(div);
    			self.listcontainerbody.appendChild(br)}
    			})
    			
    			window.localStorage.setItem("array", JSON.stringify(array));
    			self.listcontainer.style.display="block"}}
}

	function createQuote(){
		createQuote1();
		}

	function createQuote1(){
		
		let optionFields=[];
		let selected = [];
		
		optionFields = JSON.parse(window.localStorage.getItem("array"));
		var p=JSON.parse(window.localStorage.getItem("productID"));
		
		optionFields.forEach(function(opt) {
			var ref = document.getElementById(opt);
			
			if(ref.checked){
				selected.push(opt)
			}
		})
		
		if(selected.length===0){
			document.getElementById("error_message3").textContent="Please select at least one option";
			document.getElementById("error_message3").style.display="block"
			return;
		}
		
		
		var self = this; //Important!

			
		      makeCall("POST", "CreateQuote?option=" + selected + "&chosenProduct=" + p, null,
		        // callback function
		        function(req) {
		          if (req.readyState == XMLHttpRequest.DONE) { // == 4
		            if (req.status == 200) {
						
		              // If quotes list is not emtpy, then update view
		              pageOrchestrator.refresh(); // self visible by closure
		            }
		           else {
					 var data = req.responseText;
		           	// request failed, handle it
		           	document.getElementById("error_message3").style.display="block";
		            document.getElementById("error_message3").textContent=data; //for demo purposes
		            return;
		          }}
		      }
		        );
		
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

		//dropDown();
		//changeFunc(1);


     	 quoteDetails= new QuoteDetails(
			     document.getElementById("details_table"),
			        document.getElementById("options_table"),
			           document.getElementById("details1"),
			              document.getElementById("details2"));


		quoteDetails.reset();



      document.getElementById("home").addEventListener('click', () => {
	        BackHome();
	      })
	      
	      document.getElementById("option_button").addEventListener('click', () => {
	        createQuote();
	      })

		document.querySelector("a[href='Logout']").addEventListener('click', () => {
	        window.sessionStorage.removeItem('username');
	      })

		
		createdd = new createDropDown(
			document.getElementById("client_create"),
			        document.getElementById("select")
		);
		createdd.show();

		loadOptions();
		
		check=new createCheckbox(
			document.getElementById("select_options"),
			        document.getElementById("fill_options") 	
		);
		


	      }


	    this.refresh = function() {
	      alertContainer.textContent = "";
	      quoteDetails.reset();
	      check.reset();
	      document.getElementById("logout").style.display="block";
	      document.getElementById("home").style.display="none";
	      personalMessage.show();
          clientQuotesList.reset();
          clientQuotesList.show();
  		  createdd.show();
		  loadOptions();

	    }

      this.prepareShowDetails=function(){
  			clientQuotesList.reset();
  			createdd.reset();
  			document.getElementById("client_startpage").style.display="none";
  			document.getElementById("quote_details").style.display="block";
  			document.getElementById("logout").style.display="none";
  			document.getElementById("home").style.display="block";
  			quoteDetails.show();
	
  	}

}}
