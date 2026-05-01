package com.odsoftware.hrm.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

	@Bean
	public OpenAPI hrmOpenAPI() {
		return new OpenAPI()
				.info(new Info()
						.title("HRM AI-first API")
						.description("OpenAPI documentation for the HRM AI-first MVP backend")
						.version("v1"));
	}
}
