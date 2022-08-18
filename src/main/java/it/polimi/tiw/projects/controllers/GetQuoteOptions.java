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

import it.polimi.tiw.projects.beans.Option;
import it.polimi.tiw.projects.dao.OptionDAO;
import it.polimi.tiw.projects.dao.QuoteDAO;
import it.polimi.tiw.projects.utils.ConnectionHandler;

@WebServlet("/GetQuoteOptions")
public class GetQuoteOptions extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	
	public GetQuoteOptions() {
		super();
	}
	
	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}
	
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {		
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
				
	
		
		Gson gson = new GsonBuilder().create();
		String json = gson.toJson(sOpt);
		
		
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


