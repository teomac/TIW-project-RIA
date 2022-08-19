package it.polimi.tiw.projects.controllers;

import java.sql.Connection;

import java.io.IOException;
import java.sql.SQLException;

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


@WebServlet("/AddPrice")
@MultipartConfig
public class AddPrice extends HttpServlet{
	private final static long serialVersionUID = 1L;
	private Connection connection = null;

	public AddPrice() {
		super();
	}
	

	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}


	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		
		String employeeUser;
		double price = 0;
		int quoteID = 0;

		
		HttpSession session = request.getSession();
		User user = (User) session.getAttribute("user");
		employeeUser = user.getUsername();
		
		/*try {*/
			price = Double.parseDouble(request.getParameter("price"));
			quoteID = Integer.parseInt(request.getParameter("quoteID"));
		
		QuoteDAO quoteDao = new QuoteDAO(connection);
		
		Quote quote = new Quote();
		
		try {
			if(price != 0 && quoteID != 0) {
				quote= quoteDao.findQuoteDetails(quoteID);
			}
			else {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("InvalidInput");
				return;
			}
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Quote not valid");
			return;
		}
		
		try {
			if(quote.getEmployeeUsername()==null && quote.getPrice()==0.0) {
				quoteDao.addPriceToQuote(price, quoteID, employeeUser);
			}
			else {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("Invalid action for this user");
				return;
			}
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Failed to price quote");
			return;
		}
		
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
			
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
