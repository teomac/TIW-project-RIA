/**
 * Client page manager
 */
 {
    let clientQuotesList, quoteDetails, personalMessage, pageOrchestrator = new PageOrchestrator();
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




	function createOption(list) {
		var self = this;
		document.getElementById('select').innerHTML=" ";


		el = document.createElement('option');
    	//el.value = value.productName;
    	el.textContent = "--Select--";
    	el.id = "0";
    	document.getElementById('select').appendChild(el);



	list.forEach(function(value) {
		el = document.createElement('option');
    	el.value = value.productName;
    	el.textContent = value.productName;
    	el.id = value.productID;

    	el.addEventListener("onclick", () => {
			document.getElementById("error_message").textContent="Error loading options";
		document.getElementById("error_message").style.display="block";
			changeFunc(value.productID);

		})

    	document.getElementById('select').appendChild(el);

	})

}




	function changeFunc(id) {

		let temp=window.localStorage.getItem("options")
		let options=JSON.parse(temp);
		if(options==null){
			document.getElementById("error_message").textContent="options==null";
		document.getElementById("error_message").style.display="block";
		}
		else{
		document.getElementById("error_message").textContent="Error loading options";
		document.getElementById("error_message").style.display="block";}
		this.id = id

		//var list = options.filter((opt) => opt.productID === this.id);

		options.forEach(function(value) {

			//console.log(value.Name);

			row = document.createElement("tr");
			textCell = document.createElement("td");
        	textCell.textContent = value.name;
        	row.appendChild(textCell);
        	document.getElementById("options_container").appendChild(row);
		})

	}



	function options() {
		let options;
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
		return options;
	}

	function dropDown() {
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
						createOption(productsToShow);
					}

				}

				else {
					document.getElementById("error_message").textContent="Not possible to recover data"; //for demo purposes
	            	document.getElementById("error_message").style.display="block";
				}
			}

		})
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

		//options();
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

		document.querySelector("a[href='Logout']").addEventListener('click', () => {
	        window.sessionStorage.removeItem('username');
	      })


	      }


	    this.refresh = function() {
	      alertContainer.textContent = "";
	       quoteDetails.reset();
	      document.getElementById("logout").style.display="block";
	      document.getElementById("home").style.display="none";
	      personalMessage.show();
          clientQuotesList.reset();
          clientQuotesList.show();



	    }

      this.prepareShowDetails=function(){
  			clientQuotesList.reset();
  			document.getElementById("client_startpage").style.display="none";
  			document.getElementById("quote_details").style.display="block";
  			document.getElementById("logout").style.display="none";
  			document.getElementById("home").style.display="block";
  			quoteDetails.show();

  	}

}}
