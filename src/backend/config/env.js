const config = {
    PORT: process.env.PORT || 10000,
    DATABASE_URL: process.env.DATABASE_URL,
};

const missing = Object.entries(config)
    .filter(([, value]) => value === undefined)
    .map(([key]) => key);

if (missing.length) {
    console.error(
        `FATAL: Missing environment variables:\n${missing
            .map(key => `  - ${key}`)
            .join("\n")}`
    );
    process.exit(1);
}

module.exports = config;