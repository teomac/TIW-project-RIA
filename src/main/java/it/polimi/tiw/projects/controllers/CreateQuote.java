package it.polimi.tiw.projects.controllers;

import java.sql.Connection;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;

import it.polimi.tiw.projects.beans.*;
import it.polimi.tiw.projects.dao.*;
import it.polimi.tiw.projects.utils.*;


@WebServlet("/CreateQuote")
@MultipartConfig
public class CreateQuote extends HttpServlet{
	private final static long serialVersionUID = 1L;
	private Connection connection = null;

	public CreateQuote() {
		super();
	}
	

	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}


	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		
		
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");
		
		String selectedOptionsraw = null;
		int chosenProduct=0;
		
		
		selectedOptionsraw=request.getParameter("option");
		chosenProduct= Integer.parseInt(request.getParameter("chosenProduct"));
		
		String[] parts = selectedOptionsraw.split(",");
		
	    List<Integer> selectedOptions = new ArrayList<Integer>();
		
	    for(int w=0; w<parts.length; w++) {
		selectedOptions.add( Integer.parseInt(parts[w])); // 004
		}
		
		
		
		ProductDAO productDao = new ProductDAO(connection);
		Product tempProduct = new Product();
		
		try {
			tempProduct = productDao.findProductDetails(chosenProduct);
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to recover product");
			return;
		}
		
		if(tempProduct.getProductName()==null) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Selected product does not exist");
			return;
			}
		
		if(selectedOptions.isEmpty()) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("No option selected");
			return;
		}
				
		//List<Integer> options = new ArrayList<Integer>();
		
		//for(int i=0; i<selectedOptions.length; i++) {
		//	options.add(selectedOptions[i]);
		//}
	
		QuoteDAO quoteDao = new QuoteDAO(connection);
		OptionDAO optionDao = new OptionDAO(connection);
		
		ArrayList<Option> opt = new ArrayList<Option>();
		
		for(int i=0; i<selectedOptions.size(); i++) {
		try {
			opt.add(optionDao.findOptionDetails(selectedOptions.get(i)));
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to recover product");
			return;
		}}
		
		for(Option o: opt) {
				if(!(o.getProductID()==chosenProduct)) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("Option comes from a different product");
				return;}}
			
		

		try {
			quoteDao.createQuote(chosenProduct, user.getUsername());
			}catch (SQLException e) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("Failed to create quote");
				return;
			}
		
		SOptionsDAO sOptionsDao = new SOptionsDAO(connection);
		for(int o: selectedOptions) {
			try {
				sOptionsDao.updateSOptions(o, user.getUsername());
				}catch (SQLException e) {
					response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
					response.getWriter().println("Failed to update Selected Options in database");	
					return;
				}
		}
		
		
		 response.setStatus(HttpServletResponse.SC_OK);
	        response.setContentType("application/json");
	        response.setCharacterEncoding("UTF-8");
			
		}
	
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// If the user is not logged in (not present in session) redirect to the login
		doPost(request, response);
	}
	
			
	@Override
	public void destroy() {
		try {
			ConnectionHandler.closeConnection(connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
			
			

}
