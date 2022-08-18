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
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import it.polimi.tiw.projects.beans.Quote;
import it.polimi.tiw.projects.dao.QuoteDAO;
import it.polimi.tiw.projects.utils.ConnectionHandler;

@WebServlet("/GetNotPricedQuotes")
public class EmployeeNotPriced extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	
	public EmployeeNotPriced() {
		super();
	}
	
	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
			
		QuoteDAO quotesDAO = new QuoteDAO(connection);
		List<Quote> freequotes = new ArrayList<Quote>();
		
		try {
			freequotes = quotesDAO.findFreeQuotes();
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to recover quotes");			
			return;
		}
		
		Gson gson = new GsonBuilder().create();
		String json = gson.toJson(freequotes);
		
		
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
