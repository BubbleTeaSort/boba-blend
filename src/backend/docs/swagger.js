const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
    definition: {
        openapi: "3.2.0",
        info: {
            title: "Boba Blend API",
            version: "1.0.0",
            description: "API documentation for Boba Blend."
        },
        servers: [
            {
                url: "http://localhost:10000",
                description: "Development server"
            }
        ],
        components: {
            schemas: {
                User: {
                    type: "object",
                    required: [
                        "id",
                        "handle",
                        "status",
                        "is_email_verified",
                        "created_at",
                        "updated_at"
                    ],
                    properties: {
                        id: {
                            type: "integer",
                            format: "int64",
                            example: 1
                        },
                        email: {
                            type: "string",
                            format: "email",
                            nullable: true,
                            example: "user@example.com"
                        },
                        handle: {
                            type: "string",
                            minLength: 3,
                            maxLength: 32,
                            example: "riri"
                        },
                        display_name: {
                            type: "string",
                            maxLength: 32,
                            nullable: true,
                            example: "Riri"
                        },
                        avatar_url: {
                            type: "string",
                            format: "uri",
                            nullable: true,
                            example: "https://example.com/avatar.png"
                        },
                        status: {
                            type: "string",
                            enum: [
                                "pending_verification",
                                "active",
                                "suspended",
                                "banned",
                                "deactivated"
                            ],
                            example: "active"
                        },
                        is_email_verified: {
                            type: "boolean",
                            example: true
                        },
                        last_login_at: {
                            type: "string",
                            format: "date-time",
                            nullable: true
                        },
                        created_at: {
                            type: "string",
                            format: "date-time"
                        },
                        updated_at: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                }
            }
        }
    },
    apis: [
        "./src/routes/**/*.js"
    ]
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs;