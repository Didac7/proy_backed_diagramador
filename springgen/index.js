const fs = require('fs');
const path = require('path');
const readline = require('readline');
const handlebars = require('handlebars');


// Helper para capitalizar nombres de campos
handlebars.registerHelper('capitalize', function(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
});

// Helper para saber si algún campo es de cierto tipo
handlebars.registerHelper('anyFieldType', function(fields, type, options) {
	return fields.some(f => f.javaType === type);
});



console.log('=== Generador de backend Spring Boot ===');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

// Preguntar nombre del archivo SQL
rl.question('Nombre del archivo SQL a procesar (ej: modelo.sql): ', (fileName) => {
	// Preguntar nombre de la carpeta destino
	rl.question('Nombre de la carpeta donde se generará el proyecto (ej: backend-hospital): ', (projectDir) => {
		const modeloPath = path.join(__dirname, fileName);
		if (!fs.existsSync(modeloPath)) {
			console.error('No se encontró el archivo especificado en la carpeta springgen.');
			rl.close();
			process.exit(1);
		}
		// Limpiar carpeta destino si existe
		const outRoot = path.join(__dirname, projectDir);
		if (fs.existsSync(outRoot)) {
			fs.rmSync(outRoot, { recursive: true, force: true });
		}
		fs.mkdirSync(outRoot, { recursive: true });

		const sql = fs.readFileSync(modeloPath, 'utf-8');
		// Buscar todas las tablas en el SQL
		const tableRegex = /create table (\w+)\s*\(([^;]+)\)/gi;
		let match;
		let tables = [];
		while ((match = tableRegex.exec(sql)) !== null) {
			let tableName = match[1];
			let tableDef = match[0];
			let fieldsRaw = match[2].split(',');
			let fields = fieldsRaw
				.map(line => line.trim())
				.filter(line => line.length > 0 && !/^primary key/i.test(line))
				.map(line => {
					const parts = line.split(/\s+/);
					return {
						name: parts[0].replace(/"/g, ''),
						type: parts[1] ? parts[1].toLowerCase() : 'string',
						raw: line
					};
				});
			tables.push({ tableName, fields, tableDef });
		}
		if (tables.length === 0) {
			console.error('No se encontró ninguna tabla en el archivo SQL.');
			rl.close();
			process.exit(1);
		}

		// Mapeo SQL -> Java
		function sqlToJavaType(sqlType, isAuto) {
			// Si es autoincremental, debe ser Long
			if (isAuto) return 'Long';
			if (sqlType.includes('int')) return 'Long';
			if (sqlType.includes('char') || sqlType.includes('text')) return 'String';
			if (sqlType.includes('date')) return 'LocalDate';
			if (sqlType.includes('bool')) return 'Boolean';
			return 'String';
		}

		// Generar entidades, repos, services, controllers
		const baseJava = path.join(outRoot, 'src', 'main', 'java', 'com', 'example', 'demo');
		const entityDir = path.join(baseJava, 'entity');
		const repoDir = path.join(baseJava, 'repository');
		const serviceDir = path.join(baseJava, 'service');
		const controllerDir = path.join(baseJava, 'controller');
		[entityDir, repoDir, serviceDir, controllerDir].forEach(dir => fs.mkdirSync(dir, { recursive: true }));

		// Cargar plantillas
		const entityTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'Entity.hbs'), 'utf-8');
		const repoTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'Repository.hbs'), 'utf-8');
		const serviceTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'Service.hbs'), 'utf-8');
		const controllerTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'Controller.hbs'), 'utf-8');

		// Función para limpiar nombres a identificadores válidos de Java
		function toJavaIdentifier(name) {
			let clean = name.replace(/[^a-zA-Z0-9_]/g, '_');
			if (/^[0-9]/.test(clean)) clean = '_' + clean;
			return clean;
		}

		// Función para detectar claves primarias y autoincrementales
		function parsePrimaryKeys(tableDef, fields) {
			let pk = [];
			// PRIMARY KEY en definición de campo
			fields.forEach(f => {
				if (/primary key/i.test(f.raw)) pk.push(f.name);
			});
			// PRIMARY KEY al final
			let match = tableDef.match(/primary key\s*\(([^\)]+)\)/i);
			if (match) {
				pk = match[1].split(',').map(s => s.trim().replace(/"/g, ''));
			}
			// Detectar autoincremental (SERIAL o similar)
			let auto = {};
			fields.forEach(f => {
				if (/serial|auto_increment/i.test(f.type)) auto[f.name] = true;
			});
			return { pk, auto };
		}

		const idClassTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'IdClass.hbs'), 'utf-8');

		tables.forEach(({ tableName, fields, tableDef }) => {
			const className = toJavaIdentifier(tableName.charAt(0).toUpperCase() + tableName.slice(1));
			const { pk, auto } = parsePrimaryKeys(tableDef, fields);
			// Ajustar tipos: si es autoincremental, Long
			const fieldsJava = fields.map(f => ({
				name: toJavaIdentifier(f.name),
				javaType: sqlToJavaType(f.type, auto[f.name] || false),
				isId: pk.includes(f.name),
				isAuto: auto[f.name] || false
			}));

			// Si PK compuesta, generar IdClass y agregar anotación en la entidad
			let idClassName = null;
			if (pk.length > 1) {
				idClassName = className + 'Id';
				// Generar clase IdClass
				const pkFields = fieldsJava.filter(f => pk.includes(f.name));
				const idClassCode = handlebars.compile(idClassTemplate)({
					package: 'com.example.demo.entity',
					idClassName,
					pkFields
				});
				fs.writeFileSync(path.join(entityDir, `${idClassName}.java`), idClassCode);
			}

			// Entidad
			const entityCode = handlebars.compile(entityTemplate)({
				package: 'com.example.demo.entity',
				className,
				tableName,
				fields: fieldsJava,
				idClassName: idClassName ? `com.example.demo.entity.${idClassName}` : null
			});
			fs.writeFileSync(path.join(entityDir, `${className}.java`), entityCode);
			// Repository
			if (repoTemplate.trim()) {
				const repoCode = handlebars.compile(repoTemplate)({
					package: 'com.example.demo.repository',
					className
				});
				fs.writeFileSync(path.join(repoDir, `${className}Repository.java`), repoCode);
			} else {
				console.warn('No se generó Repository porque el template está vacío.');
			}
			// Service
			if (serviceTemplate.trim()) {
				const serviceCode = handlebars.compile(serviceTemplate)({
					package: 'com.example.demo.service',
					className
				});
				fs.writeFileSync(path.join(serviceDir, `${className}Service.java`), serviceCode);
			} else {
				console.warn('No se generó Service porque el template está vacío.');
			}
			// Controller
			if (controllerTemplate.trim()) {
				const controllerCode = handlebars.compile(controllerTemplate)({
					package: 'com.example.demo.controller',
					className
				});
				fs.writeFileSync(path.join(controllerDir, `${className}Controller.java`), controllerCode);
			} else {
				console.warn('No se generó Controller porque el template está vacío.');
			}
		});

		// DemoApplication
		const demoAppTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'DemoApplication.hbs'), 'utf-8');
		if (demoAppTemplate.trim()) {
			const demoAppCode = handlebars.compile(demoAppTemplate)({
				package: 'com.example.demo'
			});
			fs.mkdirSync(path.join(baseJava), { recursive: true });
			fs.writeFileSync(path.join(baseJava, 'DemoApplication.java'), demoAppCode);
		} else {
			// Clase de arranque mínima
			fs.writeFileSync(path.join(baseJava, 'DemoApplication.java'),
`package com.example.demo;\n\nimport org.springframework.boot.SpringApplication;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\n\n@SpringBootApplication\npublic class DemoApplication {\n    public static void main(String[] args) {\n        SpringApplication.run(DemoApplication.class, args);\n    }\n}`);
		}

		// pom.xml
		const pomTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'pom.hbs'), 'utf-8');
		if (pomTemplate.trim()) {
			const pomCode = handlebars.compile(pomTemplate)({});
			fs.writeFileSync(path.join(outRoot, 'pom.xml'), pomCode);
		} else {
			// pom.xml mínimo
			fs.writeFileSync(path.join(outRoot, 'pom.xml'),
`<project xmlns=\"http://maven.apache.org/POM/4.0.0\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\n    xsi:schemaLocation=\"http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd\">\n    <modelVersion>4.0.0</modelVersion>\n    <groupId>com.example</groupId>\n    <artifactId>demo</artifactId>\n    <version>0.0.1-SNAPSHOT</version>\n    <packaging>jar</packaging>\n    <name>demo</name>\n    <description>Demo project for Spring Boot</description>\n    <parent>\n        <groupId>org.springframework.boot</groupId>\n        <artifactId>spring-boot-starter-parent</artifactId>\n        <version>3.2.5</version>\n        <relativePath/>\n    </parent>\n    <dependencies>\n        <dependency>\n            <groupId>org.springframework.boot</groupId>\n            <artifactId>spring-boot-starter-data-jpa</artifactId>\n        </dependency>\n        <dependency>\n            <groupId>org.springframework.boot</groupId>\n            <artifactId>spring-boot-starter-web</artifactId>\n        </dependency>\n        <dependency>\n            <groupId>com.h2database</groupId>\n            <artifactId>h2</artifactId>\n            <scope>runtime</scope>\n        </dependency>\n    </dependencies>\n    <build>\n        <plugins>\n            <plugin>\n                <groupId>org.springframework.boot</groupId>\n                <artifactId>spring-boot-maven-plugin</artifactId>\n            </plugin>\n        </plugins>\n    </build>\n</project>`);
		}

		// application.properties
		const appPropsTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'application.properties.hbs'), 'utf-8');
		const resourcesDir = path.join(outRoot, 'src', 'main', 'resources');
		fs.mkdirSync(resourcesDir, { recursive: true });
		if (appPropsTemplate.trim()) {
			const appPropsCode = handlebars.compile(appPropsTemplate)({});
			fs.writeFileSync(path.join(resourcesDir, 'application.properties'), appPropsCode);
		} else {
			// application.properties mínimo
			fs.writeFileSync(path.join(resourcesDir, 'application.properties'),
`spring.datasource.url=jdbc:h2:mem:testdb\nspring.datasource.driverClassName=org.h2.Driver\nspring.datasource.username=sa\nspring.datasource.password=\nspring.jpa.database-platform=org.hibernate.dialect.H2Dialect\nspring.h2.console.enabled=true\n`);
		}

		console.log(`Proyecto generado en: ${outRoot}`);
		rl.close();
	});
});
