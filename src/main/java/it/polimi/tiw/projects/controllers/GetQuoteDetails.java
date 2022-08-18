package it.polimi.tiw.projects.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import it.polimi.tiw.projects.beans.Option;
import it.polimi.tiw.projects.beans.Product;
import it.polimi.tiw.projects.beans.Quote;
import it.polimi.tiw.projects.beans.User;
import it.polimi.tiw.projects.dao.OptionDAO;
import it.polimi.tiw.projects.dao.ProductDAO;
import it.polimi.tiw.projects.dao.QuoteDAO;
import it.polimi.tiw.projects.utils.ConnectionHandler;

@WebServlet("/GetQuoteDetails")
public class GetQuoteDetails extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	
	public GetQuoteDetails() {
		super();
	}
	
	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		HttpSession session = request.getSession();
		
		User user = (User) session.getAttribute("user");
				
		// get and check params
			Integer quoteID = null;
				try {
					quoteID = Integer.parseInt(request.getParameter("quoteID"));
				} catch (NumberFormatException | NullPointerException e) {
					// only for debugging e.printStackTrace();
					response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
					response.getWriter().println("Incorrect param values");	
					return;}
				
		QuoteDAO quoteDao = new QuoteDAO(connection);
		Quote quote = new Quote();
				
				
		try {
			quote = quoteDao.findQuoteDetails(quoteID);
					
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to recover quote");
			return;}
				
		if(quote==null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			response.getWriter().println("Resource not found");
			return;}
				
		// check if the user is a Client and quote.clientUsername is equal to active Client username
		
		if (user.getEmployee()==false && !(user.getUsername().equals(quote.getClientUsername())))  {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.getWriter().println("User not allowed");
			return;}
				
		// check if the user is an Employee and quote.employeeUsername is equal to active Employee username
				
		if (user.getEmployee()==true && !(user.getUsername().equals(quote.getEmployeeUsername())))  {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.getWriter().println("User not allowed");
			return;}
		
		int productID=quote.getProductID();
		ProductDAO productDao = new ProductDAO(connection);
		Product product = new Product();
				
				
		try {
			product = productDao.findProductDetails(productID);
					
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to recover product");
			return;}
				
		if(product==null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			response.getWriter().println("Resource not found");
			return;}
		
		
		List<Option> selectedOptions = new ArrayList<Option>();	
		
		try {
			selectedOptions= quoteDao.findQuoteOptions(quoteID);
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to recover options");
			return;
		}
		if (selectedOptions.size() == 0) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			response.getWriter().println("Resource not found");
			return;
		}
				
		
		OptionDAO optionDao = new OptionDAO(connection);
		List<Option> sOpt = new ArrayList<Option>();
		
		for(Option opt: selectedOptions) {
			int temp = opt.getOptionID();
			Option o1 = new Option();
			try {
				o1 = optionDao.findOptionDetails(temp);
				sOpt.add(o1);
			}catch (SQLException e) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("Not possible to recover options");
				return;}
			}
		
	
		ToSend data = new ToSend(product, sOpt, quote);
		
		Gson gson = new GsonBuilder().create();
		String json = gson.toJson(data);
		
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(json);
		
	}

	
	
	
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doGet(request, response);
	}

	public void destroy() {
		try {
			ConnectionHandler.closeConnection(connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	private class ToSend {

        private final Product product;
        private final List<Option> options;
        private final Quote quote;

        ToSend(Product product, List<Option> options, Quote quote){
            this.quote = quote;
            this.product = product;
            this.options = options;
        }
    }
}

