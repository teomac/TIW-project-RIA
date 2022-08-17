package it.polimi.tiw.projects.controllers;

import java.sql.Connection;

import java.io.IOException;
import java.sql.SQLException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;

import it.polimi.tiw.projects.beans.*;
import it.polimi.tiw.projects.dao.*;
import it.polimi.tiw.projects.utils.*;

@WebServlet("/Login")
public class Login extends HttpServlet{
	private final static long serialVersionUID = 1L;
	private Connection connection = null;

	public Login() {
		super();
	}
	

	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}


	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		
			String username = request.getParameter("username");
			String password= request.getParameter("password");
			
			if(username == null || password == null || password.isEmpty()) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				response.getWriter().println("Missing parameters");
				return;
			}
			
			UserDAO userDAO = new UserDAO(connection);
			User user = null;
			
			try {
				user = userDAO.checkCredentials(username, password);
			} catch (SQLException e) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("Not possible to check credentials");
				return;
			}
			
			if (user == null) {
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				response.getWriter().println("Incorrect credentials");
			} else {
				request.getSession().setAttribute("currentUser", user);
	            response.setStatus(HttpServletResponse.SC_OK);
	            response.setContentType("application/json");
	            response.setCharacterEncoding("UTF-8");
	            response.getWriter().println(username);
			}
			
			
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