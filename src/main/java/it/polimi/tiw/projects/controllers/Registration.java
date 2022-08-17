package it.polimi.tiw.projects.controllers;

import it.polimi.tiw.projects.dao.UserDAO;
import it.polimi.tiw.projects.utils.ConnectionHandler;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.*;


@WebServlet("/Registration")
@MultipartConfig
public class Registration extends HttpServlet{
	private final static long serialVersionUID = 1L;
	private Connection connection = null;
	
	public Registration() {
		super();
	}
	
    @Override
    public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}
	
	
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		String username=null;
		String password=null;
		String name=null;
		String surname=null;
		String email=null;
		Boolean employee = null;
		String repeatpassword=null;
		
		username = request.getParameter("usernameReg");
		password = request.getParameter("passwordReg");
		name = request.getParameter("name");
	    surname = request.getParameter("surname");
	    email = request.getParameter("emailReg");
	    employee = Boolean.parseBoolean(request.getParameter("isEmployee"));
	    repeatpassword=request.getParameter("repeatpassword");
	    	
			
		if (username == null || password == null || name == null || surname == null || employee == null || email == null) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Credentials must be not null");
			return;
		}
		
		if(username.length()<8 || password.length()<8) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Invalid username or password");
			return;
		}
		
		if(!(password.equals(repeatpassword))) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Password and repeat password are different");
			return;
		}
		
		
    	UserDAO userDAO = new UserDAO(connection);
    	boolean isFree = false;
    	
    	try {
    		isFree = userDAO.isUsernameFree(username);
    	}catch (Exception e) {
    		response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Internal server error, retry later"); 
			return;
		} 
    	
    	if(!isFree) {
    		response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Username already taken");
			return;
    	}
    	
    	boolean isEmailValid = userDAO.isEmailValid(email);
  
    	if(!isEmailValid) {
    		response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Email format is not valid");
			return;
    	}
    	
    	try {
    		userDAO.createCredentials(username, name, surname, password, employee, email);
    	} catch (Exception e) {
    		response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Internal server error, retry later"); 
			return;}
    	
        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().println("Registration completed");
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