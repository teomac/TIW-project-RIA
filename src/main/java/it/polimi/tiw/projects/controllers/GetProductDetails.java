package it.polimi.tiw.projects.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import it.polimi.tiw.projects.beans.Product;
import it.polimi.tiw.projects.dao.ProductDAO;
import it.polimi.tiw.projects.utils.ConnectionHandler;

@WebServlet("/GetProductDetails")
public class GetProductDetails extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	
	public GetProductDetails() {
		super();
	}
	
	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {		
		// get and check params
			Integer productID = null;
				try {
					productID = Integer.parseInt(request.getParameter("productID"));
				} catch (NumberFormatException | NullPointerException e) {
					// only for debugging e.printStackTrace();
					response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
					response.getWriter().println("Incorrect param values");	
					return;}
				
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
				
	
		
		Gson gson = new GsonBuilder().create();
		String json = gson.toJson(product);
		
		
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
}

