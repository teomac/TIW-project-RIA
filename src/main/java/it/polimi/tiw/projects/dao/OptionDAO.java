package it.polimi.tiw.projects.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import it.polimi.tiw.projects.beans.Option;

public class OptionDAO {
	
	private Connection connection;
	
	public OptionDAO(Connection c) {
		this.connection=c;
	}
	
	public List<Option> list() throws SQLException{
		List<Option> options = new ArrayList<>();
		
		String SQLQuery = "SELECT * FROM available";
		
		try(PreparedStatement statement = connection.prepareStatement(SQLQuery);
				ResultSet resultSet = statement.executeQuery();
				){
			while(resultSet.next()) {
				Option option = new Option();
				option.setOptionID(resultSet.getInt("id"));
				option.setName(resultSet.getString("name"));
				option.setInSale(resultSet.getBoolean("inSale"));
				option.setProductID(resultSet.getInt("productID"));
				options.add(option);
			}}
		
		return options;
	}
	
	public List<Option> findAvailableOptions(int productID) throws SQLException{
		List<Option> availableOptions = new ArrayList<Option>();
		
		String query = "SELECT * from available WHERE productID = ? ORDER BY id DESC";
		try (PreparedStatement pstatement = connection.prepareStatement(query);) {
			pstatement.setInt(1, productID);
			try (ResultSet result = pstatement.executeQuery();) {
				while (result.next()) {
					Option option = new Option();
					option.setOptionID(result.getInt("id"));
					option.setName(result.getString("name"));
					option.setInSale(result.getBoolean("inSale"));
					availableOptions.add(option);
				}
			}
		}
		return availableOptions;
	}
	
	
	
	public Option findOptionDetails(int optionID) throws SQLException{
		Option o = new Option();
		String query = "SELECT * FROM available WHERE id = ?";
		try (PreparedStatement pstatement = connection.prepareStatement(query)){
			pstatement.setInt(1, optionID);
			try (ResultSet result = pstatement.executeQuery();) {
				if(result.next()) {
					o.setOptionID(result.getInt("id"));
					o.setName(result.getString("name"));
					o.setInSale(result.getBoolean("inSale"));
					o.setProductID(result.getInt("productID"));
					}
				}
		}
		return o;
	}

}
