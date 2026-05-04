package com.odsoftware.hrm.config;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Locale;
import javax.sql.DataSource;
import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FlywayConfig {

	@Bean(initMethod = "migrate")
	public Flyway flyway(DataSource dataSource) {
		return Flyway.configure()
				.dataSource(dataSource)
				.locations("classpath:db/migration", "classpath:db/vendor/" + resolveVendor(dataSource))
				.load();
	}

	private String resolveVendor(DataSource dataSource) {
		try (Connection connection = dataSource.getConnection()) {
			String productName = connection.getMetaData().getDatabaseProductName().toLowerCase(Locale.ROOT);
			if (productName.contains("postgres")) {
				return "postgresql";
			}
			if (productName.contains("h2")) {
				return "h2";
			}
			throw new IllegalStateException("Unsupported database vendor for Flyway migrations: " + productName);
		} catch (SQLException exception) {
			throw new IllegalStateException("Unable to resolve database vendor for Flyway migrations", exception);
		}
	}

	@Bean
	public static BeanFactoryPostProcessor entityManagerFactoryDependsOnFlyway() {
		return beanFactory -> addDependsOnFlyway(beanFactory, "entityManagerFactory");
	}

	private static void addDependsOnFlyway(ConfigurableListableBeanFactory beanFactory, String beanName) {
		if (!beanFactory.containsBeanDefinition(beanName)) {
			return;
		}
		BeanDefinition beanDefinition = beanFactory.getBeanDefinition(beanName);
		String[] dependsOn = beanDefinition.getDependsOn();
		if (dependsOn == null || dependsOn.length == 0) {
			beanDefinition.setDependsOn("flyway");
			return;
		}
		String[] updatedDependsOn = new String[dependsOn.length + 1];
		System.arraycopy(dependsOn, 0, updatedDependsOn, 0, dependsOn.length);
		updatedDependsOn[dependsOn.length] = "flyway";
		beanDefinition.setDependsOn(updatedDependsOn);
	}
}
